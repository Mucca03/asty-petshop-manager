import type {ClientDetail, PetRecord, ServiceRecord} from "../types/ClientDetail.ts";
import {
    getServiceDebt,
    isServiceStatusCompleted,
    isServiceStatusOpen,
} from "./serviceLifecycle.ts";

export interface ClientServiceEntry {
    readonly service: ServiceRecord;
    readonly pet: PetRecord;
}

export interface ClientActivitySummary {
    /** Every service of every pet, newest first. */
    readonly services: readonly ClientServiceEntry[];
    readonly serviceCount: number;
    /** Distinct days with at least one service. */
    readonly visitCount: number;
    readonly completedCount: number;
    readonly openCount: number;
    readonly totalBilled: number;
    readonly totalPaid: number;
    readonly pendingDebt: number;
    readonly lastServiceDate: string | null;
    readonly isRecurring: boolean;
}

const toNumber = (value: number | string | null | undefined): number => {
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? number : 0;
};

const getVisitDayKey = (value: string): string | null => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

/**
 * Derives the all-time activity of a client from the data already returned by
 * `/api/clients`. A client is recurrent when they have services on more than
 * one day; two services in the same visit still count as a first visit.
 */
export const getClientActivity = (client: ClientDetail): ClientActivitySummary => {
    const services: ClientServiceEntry[] = client.pets.flatMap(pet => (
        pet.services.map(service => ({service, pet}))
    ));
    const visitDays = new Set<string>();
    let totalBilled = 0;
    let totalPaid = 0;
    let pendingDebt = 0;
    let completedCount = 0;
    let openCount = 0;
    let lastServiceDate: string | null = null;
    let lastServiceTime = Number.NEGATIVE_INFINITY;

    services.forEach(({service}) => {
        const visitDay = getVisitDayKey(service.date);

        if (visitDay) {
            visitDays.add(visitDay);
        }

        totalBilled += toNumber(service.price);
        totalPaid += toNumber(service.paid_amount);
        pendingDebt += getServiceDebt(service.price, service.paid_amount);

        if (isServiceStatusCompleted(service.status)) {
            completedCount += 1;
        } else if (isServiceStatusOpen(service.status)) {
            openCount += 1;
        }

        const serviceTime = new Date(service.date).getTime();

        if (Number.isFinite(serviceTime) && serviceTime > lastServiceTime) {
            lastServiceTime = serviceTime;
            lastServiceDate = service.date;
        }
    });

    services.sort((a, b) => {
        const timeA = new Date(a.service.date).getTime();
        const timeB = new Date(b.service.date).getTime();
        const safeTimeA = Number.isFinite(timeA) ? timeA : 0;
        const safeTimeB = Number.isFinite(timeB) ? timeB : 0;

        return safeTimeB - safeTimeA || b.service.id - a.service.id;
    });

    const visitCount = visitDays.size > 0 ? visitDays.size : services.length;

    return {
        services,
        serviceCount: services.length,
        visitCount,
        completedCount,
        openCount,
        totalBilled,
        totalPaid,
        pendingDebt,
        lastServiceDate,
        isRecurring: visitCount > 1,
    };
};
