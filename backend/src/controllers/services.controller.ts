import {Request, Response} from 'express'
import prisma from "../services/prisma"
import {HttpError} from "../utils/httpError";
import {
    canTransitionServiceStatus,
    getServiceStatusMeta,
    normalizeServiceStatus,
    SERVICE_STATUS,
    SERVICE_STATUS_ORDER,
    serviceStatusLabel,
} from "../../../shared/serviceLifecycle";

const parseId = (value: unknown): number => {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, "El identificador del servicio no es válido.", "INVALID_SERVICE_ID");
    }

    return id;
};

const parseAmount = (value: unknown, field: string): number => {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) {
        throw new HttpError(400, `${field} debe ser un número mayor o igual a 0.`, "INVALID_AMOUNT");
    }

    return amount;
};

const allowedStatusesMessage = (): string => (
    SERVICE_STATUS_ORDER.map(serviceStatusLabel).join(", ")
);

export const createServices = async (req: Request, res: Response) => {
    const {service_type, details, price, paid_amount, status, pet_id} = req.body ?? {};
    const serviceType = typeof service_type === "string" ? service_type.trim() : "";
    const petId = Number(pet_id);

    if (!serviceType) {
        throw new HttpError(400, "El tipo de servicio es obligatorio.", "INVALID_SERVICE_TYPE");
    }

    if (!Number.isInteger(petId) || petId <= 0) {
        throw new HttpError(400, "La mascota del servicio no es válida.", "INVALID_PET_ID");
    }

    const priceValue = parseAmount(price, "El precio");

    if (priceValue <= 0) {
        throw new HttpError(400, "El precio debe ser mayor a 0.", "INVALID_PRICE");
    }

    const paidValue = parseAmount(paid_amount ?? 0, "El pago");

    if (paidValue > priceValue) {
        throw new HttpError(400, "El pago no puede ser mayor al precio.", "INVALID_PAYMENT");
    }

    const statusKey = normalizeServiceStatus(status ?? SERVICE_STATUS.pending);

    if (!statusKey) {
        throw new HttpError(
            400,
            `Estado de servicio inválido. Usa uno de: ${allowedStatusesMessage()}.`,
            "INVALID_SERVICE_STATUS",
        );
    }

    const create = await prisma.services.create({
        data: {
            service_type: serviceType,
            details: typeof details === "string" && details.trim().length > 0 ? details.trim() : null,
            price: priceValue,
            paid_amount: paidValue,
            status: serviceStatusLabel(statusKey),
            pet_id: petId,
        },
    });

    res.status(201).json(create);
}

export const updateServiceStatus = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    const targetStatus = normalizeServiceStatus(req.body?.status);

    if (!targetStatus) {
        throw new HttpError(
            400,
            `Estado de servicio inválido. Usa uno de: ${allowedStatusesMessage()}.`,
            "INVALID_SERVICE_STATUS",
        );
    }

    const currentService = await prisma.services.findUnique({where: {id}});

    if (!currentService) {
        throw new HttpError(404, "El servicio no existe.", "SERVICE_NOT_FOUND");
    }

    if (!canTransitionServiceStatus(currentService.status, targetStatus)) {
        const current = getServiceStatusMeta(currentService.status);
        const target = getServiceStatusMeta(targetStatus);

        throw new HttpError(
            409,
            `No se puede cambiar el estado de "${current.label}" a "${target.label}".`,
            "INVALID_SERVICE_TRANSITION",
        );
    }

    const currentStatus = normalizeServiceStatus(currentService.status);
    const isIdempotent = currentStatus === targetStatus;
    const priceValue = Number(currentService.price);
    let paidAmount: number | undefined;

    if (req.body?.paid_amount !== undefined) {
        paidAmount = parseAmount(req.body.paid_amount, "El pago");

        if (paidAmount > priceValue) {
            throw new HttpError(400, "El pago no puede ser mayor al precio.", "INVALID_PAYMENT");
        }
    } else if (!isIdempotent && targetStatus === SERVICE_STATUS.completed) {
        // Completing a service from the UI means "work done and paid in full".
        // Explicit callers can still send a different paid_amount.
        paidAmount = Number.isFinite(priceValue) ? priceValue : 0;
    }

    const updatedService = await prisma.services.update({
        where: {id},
        data: {
            status: serviceStatusLabel(targetStatus),
            ...(paidAmount !== undefined ? {paid_amount: paidAmount} : {}),
        },
    });

    res.json(updatedService);
};

export const deleteService = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    const deletedService = await prisma.services.delete({
        where: {id},
    });

    res.json(deletedService);
};
