/**
 * Canonical service lifecycle for Asty Petshop Manager.
 *
 * This module is the single source of truth for:
 * - which service statuses exist,
 * - which transitions are legal,
 * - how legacy/free-text statuses map to canonical ones,
 * - how a service's payment state is derived.
 *
 * It is imported by both the backend (validation) and the frontend (UI).
 * Do not compare status strings directly in components or controllers; use
 * the helpers exported here instead.
 */

export const SERVICE_STATUS = {
    pending: "pending",
    inProgress: "in_progress",
    completed: "completed",
    cancelled: "cancelled",
} as const;

export type ServiceStatus = (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];

export type ServiceStatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export type ServiceStatusCategory =
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "unknown";

export interface ServiceStatusDefinition {
    readonly key: ServiceStatus;
    readonly label: string;
    readonly tone: ServiceStatusTone;
    readonly category: Exclude<ServiceStatusCategory, "unknown">;
    readonly description: string;
}

export const SERVICE_STATUS_DEFINITIONS: Readonly<Record<ServiceStatus, ServiceStatusDefinition>> = {
    [SERVICE_STATUS.pending]: {
        key: SERVICE_STATUS.pending,
        label: "Pendiente",
        tone: "warning",
        category: "pending",
        description: "El servicio fue registrado y todavía no inicia.",
    },
    [SERVICE_STATUS.inProgress]: {
        key: SERVICE_STATUS.inProgress,
        label: "En proceso",
        tone: "info",
        category: "in_progress",
        description: "La mascota está siendo atendida.",
    },
    [SERVICE_STATUS.completed]: {
        key: SERVICE_STATUS.completed,
        label: "Completado",
        tone: "success",
        category: "completed",
        description: "El servicio terminó y el pago quedó registrado.",
    },
    [SERVICE_STATUS.cancelled]: {
        key: SERVICE_STATUS.cancelled,
        label: "Cancelado",
        tone: "danger",
        category: "cancelled",
        description: "El servicio no se realizará o se anuló.",
    },
};

export const SERVICE_STATUS_ORDER: readonly ServiceStatus[] = [
    SERVICE_STATUS.pending,
    SERVICE_STATUS.inProgress,
    SERVICE_STATUS.completed,
    SERVICE_STATUS.cancelled,
];

/**
 * Legal transitions. A transition to the same state is treated as an
 * idempotent no-op by `canTransitionServiceStatus`.
 */
export const SERVICE_STATUS_TRANSITIONS: Readonly<Record<ServiceStatus, readonly ServiceStatus[]>> = {
    [SERVICE_STATUS.pending]: [
        SERVICE_STATUS.inProgress,
        SERVICE_STATUS.completed,
        SERVICE_STATUS.cancelled,
    ],
    [SERVICE_STATUS.inProgress]: [
        SERVICE_STATUS.completed,
        SERVICE_STATUS.cancelled,
    ],
    [SERVICE_STATUS.completed]: [],
    [SERVICE_STATUS.cancelled]: [
        SERVICE_STATUS.pending,
    ],
};

/**
 * Legacy and human-friendly aliases. Keys are normalized before lookup, so
 * accents, casing, underscores and extra whitespace do not matter.
 *
 * These keep older rows and older API clients working after the status model
 * became explicit.
 */
export const SERVICE_STATUS_ALIASES: Readonly<Record<string, ServiceStatus>> = {
    pendiente: SERVICE_STATUS.pending,
    pend: SERVICE_STATUS.pending,
    agendado: SERVICE_STATUS.pending,
    agendada: SERVICE_STATUS.pending,
    programado: SERVICE_STATUS.pending,
    programada: SERVICE_STATUS.pending,
    "en espera": SERVICE_STATUS.pending,
    espera: SERVICE_STATUS.pending,
    "por hacer": SERVICE_STATUS.pending,

    proceso: SERVICE_STATUS.inProgress,
    "en proceso": SERVICE_STATUS.inProgress,
    "en curso": SERVICE_STATUS.inProgress,
    "en progreso": SERVICE_STATUS.inProgress,
    progreso: SERVICE_STATUS.inProgress,
    trabajando: SERVICE_STATUS.inProgress,

    completado: SERVICE_STATUS.completed,
    completada: SERVICE_STATUS.completed,
    pagado: SERVICE_STATUS.completed,
    pagada: SERVICE_STATUS.completed,
    finalizado: SERVICE_STATUS.completed,
    finalizada: SERVICE_STATUS.completed,
    entregado: SERVICE_STATUS.completed,
    entregada: SERVICE_STATUS.completed,
    listo: SERVICE_STATUS.completed,
    lista: SERVICE_STATUS.completed,
    terminado: SERVICE_STATUS.completed,
    terminada: SERVICE_STATUS.completed,

    cancelado: SERVICE_STATUS.cancelled,
    cancelada: SERVICE_STATUS.cancelled,
    rechazado: SERVICE_STATUS.cancelled,
    rechazada: SERVICE_STATUS.cancelled,
    vencido: SERVICE_STATUS.cancelled,
    vencida: SERVICE_STATUS.cancelled,
    anulado: SERVICE_STATUS.cancelled,
    anulada: SERVICE_STATUS.cancelled,
};

const normalizeToken = (value: string): string => (
    value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
);

const STATUS_LOOKUP = new Map<string, ServiceStatus>();

for (const key of SERVICE_STATUS_ORDER) {
    STATUS_LOOKUP.set(normalizeToken(key), key);
    STATUS_LOOKUP.set(normalizeToken(SERVICE_STATUS_DEFINITIONS[key].label), key);
}

for (const [alias, key] of Object.entries(SERVICE_STATUS_ALIASES)) {
    STATUS_LOOKUP.set(normalizeToken(alias), key);
}

/**
 * Resolves a persisted/API status (canonical key, Spanish label or legacy
 * alias) to a canonical key. Returns `null` for unknown values.
 */
export const normalizeServiceStatus = (
    value: string | null | undefined,
): ServiceStatus | null => {
    if (typeof value !== "string") {
        return null;
    }

    const token = normalizeToken(value);

    return token.length > 0 ? STATUS_LOOKUP.get(token) ?? null : null;
};

export interface ServiceStatusMeta {
    readonly key: ServiceStatus | null;
    readonly label: string;
    readonly tone: ServiceStatusTone;
    readonly category: ServiceStatusCategory;
    readonly allowedTransitions: readonly ServiceStatus[];
    readonly isTerminal: boolean;
}

/**
 * Presentation + capability metadata for any stored status. Unknown legacy
 * values stay visible (so data is never hidden) and may be repaired through a
 * transition to any canonical state.
 */
export const getServiceStatusMeta = (
    value: string | null | undefined,
): ServiceStatusMeta => {
    const key = normalizeServiceStatus(value);

    if (!key) {
        return {
            key: null,
            label: typeof value === "string" && value.trim().length > 0
                ? value.trim()
                : "Sin estado",
            tone: "neutral",
            category: "unknown",
            allowedTransitions: SERVICE_STATUS_ORDER,
            isTerminal: false,
        };
    }

    const definition = SERVICE_STATUS_DEFINITIONS[key];
    const allowedTransitions = SERVICE_STATUS_TRANSITIONS[key];

    return {
        key,
        label: definition.label,
        tone: definition.tone,
        category: definition.category,
        allowedTransitions,
        isTerminal: allowedTransitions.length === 0,
    };
};

export const serviceStatusLabel = (key: ServiceStatus): string => (
    SERVICE_STATUS_DEFINITIONS[key].label
);

/**
 * Returns true when `from -> to` is legal. Unknown `from` values are accepted
 * so legacy rows can be repaired. Same-state transitions are idempotent.
 */
export const canTransitionServiceStatus = (
    from: string | null | undefined,
    to: string | null | undefined,
): boolean => {
    const fromKey = normalizeServiceStatus(from);
    const toKey = normalizeServiceStatus(to);

    if (!toKey) {
        return false;
    }

    if (!fromKey || fromKey === toKey) {
        return true;
    }

    return SERVICE_STATUS_TRANSITIONS[fromKey].includes(toKey);
};

export const isServiceStatusOpen = (value: string | null | undefined): boolean => {
    const {category} = getServiceStatusMeta(value);

    return category === "pending" || category === "in_progress";
};

export const isServiceStatusCompleted = (value: string | null | undefined): boolean => (
    getServiceStatusMeta(value).category === "completed"
);

export const isServiceStatusCancelled = (value: string | null | undefined): boolean => (
    getServiceStatusMeta(value).category === "cancelled"
);

/* -------------------------------------------------------------------------- */
/* Payment state (derived, not persisted)                                      */
/* -------------------------------------------------------------------------- */

export type ServicePaymentState = "unpaid" | "partial" | "paid" | "overpaid";

export interface ServicePaymentSnapshot {
    readonly state: ServicePaymentState;
    readonly price: number;
    readonly paid: number;
    readonly debt: number;
}

export const toServiceAmount = (
    value: number | string | null | undefined,
): number => {
    const amount = typeof value === "number" ? value : Number(value);

    return Number.isFinite(amount) ? amount : 0;
};

/**
 * Payments are derived from `price` and `paid_amount` instead of being another
 * persisted status. This prevents the classic desync where `status` says
 * "paid" while `paid_amount` says otherwise.
 */
export const getServicePayment = (
    price: number | string | null | undefined,
    paidAmount: number | string | null | undefined,
): ServicePaymentSnapshot => {
    const priceValue = Math.max(toServiceAmount(price), 0);
    const paidValue = Math.max(toServiceAmount(paidAmount), 0);
    let state: ServicePaymentState;

    if (priceValue === 0) {
        state = paidValue > 0 ? "overpaid" : "paid";
    } else if (paidValue <= 0) {
        state = "unpaid";
    } else if (paidValue < priceValue) {
        state = "partial";
    } else if (paidValue === priceValue) {
        state = "paid";
    } else {
        state = "overpaid";
    }

    return {
        state,
        price: priceValue,
        paid: paidValue,
        debt: Math.max(priceValue - paidValue, 0),
    };
};

export const getServiceDebt = (
    price: number | string | null | undefined,
    paidAmount: number | string | null | undefined,
): number => getServicePayment(price, paidAmount).debt;
