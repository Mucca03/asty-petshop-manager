import {Request, Response} from 'express'
import prisma from "../services/prisma"
import {HttpError} from "../utils/httpError";
import {
    normalizeServiceStatus,
    SERVICE_STATUS,
    SERVICE_STATUS_ORDER,
    serviceStatusLabel,
} from "../../../shared/serviceLifecycle";

const asText = (value: unknown): string => (
    typeof value === "string" ? value.trim() : ""
);

const allowedStatusesMessage = (): string => (
    SERVICE_STATUS_ORDER.map(serviceStatusLabel).join(", ")
);

/**
 * Registers a client, their pet and the first service as one atomic write.
 *
 * This replaces the old three-request flow (client -> pet -> service), which
 * could leave orphaned clients/pets if a later request failed.
 */
export const createRegistration = async (req: Request, res: Response) => {
    const {client, pet, service} = req.body ?? {};

    const clientName = asText(client?.name);
    const phone = asText(client?.phone);
    const petName = asText(pet?.name);
    const petRaza = asText(pet?.raza);
    const petAge = asText(pet?.edad) || "Adulto";
    const serviceType = asText(service?.service_type);
    const details = asText(service?.details);
    const price = Number(service?.price);
    const paidAmount = Number(service?.paid_amount ?? 0);
    const statusKey = normalizeServiceStatus(service?.status ?? SERVICE_STATUS.pending);

    if (!clientName || !phone) {
        throw new HttpError(
            400,
            "El nombre y el teléfono del cliente son obligatorios.",
            "INVALID_CLIENT",
        );
    }

    if (!petName || !petRaza) {
        throw new HttpError(
            400,
            "El nombre y la raza de la mascota son obligatorios.",
            "INVALID_PET",
        );
    }

    if (!serviceType) {
        throw new HttpError(400, "El tipo de servicio es obligatorio.", "INVALID_SERVICE_TYPE");
    }

    if (!Number.isFinite(price) || price <= 0) {
        throw new HttpError(400, "El precio debe ser mayor a 0.", "INVALID_PRICE");
    }

    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
        throw new HttpError(400, "El pago debe ser un número mayor o igual a 0.", "INVALID_PAYMENT");
    }

    if (paidAmount > price) {
        throw new HttpError(400, "El pago no puede ser mayor al precio.", "INVALID_PAYMENT");
    }

    if (!statusKey) {
        throw new HttpError(
            400,
            `Estado de servicio inválido. Usa uno de: ${allowedStatusesMessage()}.`,
            "INVALID_SERVICE_STATUS",
        );
    }

    const created = await prisma.clients.create({
        data: {
            name: clientName,
            client_phones: {
                create: [{phone}],
            },
            pets: {
                create: [{
                    name: petName,
                    raza: petRaza,
                    edad: petAge,
                    services: {
                        create: [{
                            service_type: serviceType,
                            details: details.length > 0 ? details : null,
                            price,
                            paid_amount: paidAmount,
                            status: serviceStatusLabel(statusKey),
                        }],
                    },
                }],
            },
        },
        include: {
            client_phones: true,
            pets: {
                include: {
                    services: true,
                },
            },
        },
    });

    res.status(201).json(created);
};
