import {useEffect, useId, useRef} from "react";
import type {ClientDetail} from "../types/ClientDetail.ts";
import type {ClientActivitySummary} from "../domain/clientActivity.ts";
import {
    getServiceDebt,
    getServiceStatusMeta,
} from "../domain/serviceLifecycle.ts";
import ClientTypeBadge from "./ClientTypeBadge.tsx";
import {CalendarIcon, PawIcon} from "./icons.tsx";

interface ClientServicesDialogProps {
    client: ClientDetail;
    summary: ClientActivitySummary;
    onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

const serviceDateFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

const clientSinceFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

const formatMoney = (value: number) => currencyFormatter.format(value);

const formatServiceDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Fecha sin registrar"
        : serviceDateFormatter.format(date).replace(/\./g, "");
};

const formatClientSince = (value: string | null | undefined) => {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? null
        : clientSinceFormatter.format(date);
};

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "?";
    }

    return words.slice(0, 2).map(word => word[0]).join("").toUpperCase();
};

const formatClientPhones = (client: ClientDetail) => {
    const phones = [...new Set(
        client.client_phones
            .map(item => item.phone.trim())
            .filter(phone => phone.length > 0),
    )];

    return phones.length > 0 ? phones.join(", ") : "Sin teléfono";
};

const ClientServicesDialog = ({client, summary, onClose}: ClientServicesDialogProps) => {
    const titleId = useId().replace(/:/g, "");
    const dialogRef = useRef<HTMLElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const clientSince = formatClientSince(client.created_at);

    useEffect(() => {
        const previouslyFocused = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) {
                return;
            }

            const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
                "button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])",
            )].filter(element => element.offsetParent !== null);

            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;

            if (previouslyFocused && document.contains(previouslyFocused)) {
                previouslyFocused.focus();
            }
        };
    }, [onClose]);

    return (
        <div
            className="client-dialog-backdrop"
            onMouseDown={event => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                ref={dialogRef}
                className="client-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <header className="client-dialog-header">
                    <div className="client-dialog-person">
                        <span className="client-dialog-avatar" aria-hidden="true">
                            {getInitials(client.name)}
                        </span>
                        <div className="client-dialog-identity">
                            <div className="client-dialog-title-row">
                                <h2 id={titleId}>{client.name}</h2>
                                <ClientTypeBadge isRecurring={summary.isRecurring} long/>
                            </div>
                            <p className="client-dialog-contact">{formatClientPhones(client)}</p>
                            {clientSince && (
                                <p className="client-dialog-since">
                                    <CalendarIcon/>
                                    Cliente desde {clientSince}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="client-dialog-close"
                        onClick={onClose}
                        aria-label="Cerrar servicios del cliente"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <div className="client-dialog-stats">
                    <div className="client-dialog-stat">
                        <span>Servicios</span>
                        <strong>{summary.serviceCount}</strong>
                    </div>
                    <div className="client-dialog-stat">
                        <span>Visitas</span>
                        <strong>{summary.visitCount}</strong>
                    </div>
                    <div className="client-dialog-stat">
                        <span>Facturado</span>
                        <strong>{formatMoney(summary.totalBilled)}</strong>
                    </div>
                    <div className="client-dialog-stat">
                        <span>Por cobrar</span>
                        <strong className={summary.pendingDebt > 0 ? "client-dialog-stat-warning" : ""}>
                            {formatMoney(summary.pendingDebt)}
                        </strong>
                    </div>
                </div>

                <div className="client-dialog-body">
                    <div className="client-dialog-section-heading">
                        <div>
                            <h3>Historial de servicios</h3>
                            <p>Todos los servicios registrados de este cliente.</p>
                        </div>
                        <span>
                            {summary.serviceCount} {summary.serviceCount === 1 ? "servicio" : "servicios"}
                        </span>
                    </div>

                    {summary.serviceCount === 0 ? (
                        <div className="client-dialog-empty">
                            <PawIcon/>
                            <p>Este cliente todavía no tiene servicios registrados.</p>
                        </div>
                    ) : (
                        <div className="client-dialog-pets">
                            {client.pets.map(pet => {
                                const petServices = summary.services.filter(entry => entry.pet.id === pet.id);

                                return (
                                    <section className="client-dialog-pet" key={pet.id}>
                                        <header className="client-dialog-pet-header">
                                            <div>
                                                <h4>{pet.name}</h4>
                                                <p>{pet.raza} · {pet.edad}</p>
                                            </div>
                                            <span>
                                                {petServices.length} {petServices.length === 1 ? "servicio" : "servicios"}
                                            </span>
                                        </header>

                                        {petServices.length === 0 ? (
                                            <p className="client-dialog-empty-pet">
                                                Sin servicios registrados para esta mascota.
                                            </p>
                                        ) : (
                                            <ol className="client-dialog-service-list">
                                                {petServices.map(({service}) => {
                                                    const status = getServiceStatusMeta(service.status);
                                                    const debt = getServiceDebt(service.price, service.paid_amount);

                                                    return (
                                                        <li className="client-dialog-service" key={service.id}>
                                                            <time
                                                                className="client-dialog-service-date"
                                                                dateTime={service.date}
                                                            >
                                                                {formatServiceDate(service.date)}
                                                            </time>
                                                            <div className="client-dialog-service-info">
                                                                <span className="client-dialog-service-type">
                                                                    {service.service_type}
                                                                </span>
                                                                <span className="client-dialog-service-details">
                                                                    {service.details || "Sin detalles"}
                                                                </span>
                                                            </div>
                                                            <span className={`status-badge status-badge-${status.tone}`}>
                                                                {status.label}
                                                            </span>
                                                            <div className="client-dialog-service-money">
                                                                <span>{formatMoney(Number(service.price) || 0)}</span>
                                                                {debt > 0 && (
                                                                    <small>{formatMoney(debt)} por cobrar</small>
                                                                )}
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ol>
                                        )}
                                    </section>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="client-dialog-footer">
                    <span>
                        {summary.completedCount} completados
                        {" · "}
                        {summary.openCount} pendientes
                    </span>
                    <button type="button" className="dash-btn" onClick={onClose}>
                        Cerrar
                    </button>
                </footer>
            </section>
        </div>
    );
};

export default ClientServicesDialog;
