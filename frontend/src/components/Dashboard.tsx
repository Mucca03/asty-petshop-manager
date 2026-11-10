import {useMemo, useState} from "react";
import type {ReactNode} from "react";
import {Link} from "react-router-dom";
import {getClients, updateServiceStatus} from "../services/index.ts";
import type {ClientDetail, PetRecord, ServiceRecord} from "../types/ClientDetail.ts";
import {
    getServiceDebt,
    getServiceStatusMeta,
    isServiceStatusCompleted,
    isServiceStatusOpen,
    SERVICE_STATUS,
} from "../domain/serviceLifecycle.ts";
import {useAsyncAction} from "../hooks/useAsyncAction.ts";
import {useAsyncResource} from "../hooks/useAsyncResource.ts";
import {
    AlertTriangleIcon,
    ArrowUpRightIcon,
    CalendarIcon,
    PawIcon,
    PlusIcon,
    RefreshIcon,
    ScissorsIcon,
    TrendingUpIcon,
    UserPlusIcon,
    UsersIcon,
    WalletIcon,
} from "./icons.tsx";

interface ServiceRow {
    service: ServiceRecord;
    pet: PetRecord;
    client: ClientDetail;
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
});

const monthFormatter = new Intl.DateTimeFormat("es-ES", {
    month: "short",
});

const statusColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
];

const toNumber = (value: number | string | null | undefined) => {
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? number : 0;
};

const formatMoney = (value: number) => currencyFormatter.format(value);

const formatShortDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : shortDateFormatter.format(date).replace(".", "");
};

const formatMonth = (date: Date) => monthFormatter.format(date).replace(".", "");

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "?";
    }

    return words.slice(0, 2).map(word => word[0]).join("").toUpperCase();
};

const getStatusColor = (index: number) => (
    statusColors[index % statusColors.length]
);

type DashboardPeriod = "today" | "7d" | "30d" | "month" | "year" | "custom";

const periodLabels: Record<DashboardPeriod, string> = {
    today: "Hoy",
    "7d": "Últimos 7 días",
    "30d": "Últimos 30 días",
    month: "Este mes",
    year: "Este año",
    custom: "Fecha específica",
};

const rangeDateFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date: Date) => new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
);

const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const parseDateInputValue = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
        return new Date();
    }

    return new Date(year, month - 1, day);
};

const getPeriodRange = (period: DashboardPeriod, customDate: string) => {
    const now = new Date();
    let start = startOfDay(now);
    let end = endOfDay(now);

    if (period === "7d") {
        start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
    } else if (period === "30d") {
        start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29));
    } else if (period === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "year") {
        start = new Date(now.getFullYear(), 0, 1);
    } else if (period === "custom") {
        const custom = parseDateInputValue(customDate);
        start = startOfDay(custom);
        end = endOfDay(custom);
    }

    const days = Math.max(
        1,
        Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / 86_400_000) + 1,
    );

    return {start, end, days};
};

const formatRangeDate = (date: Date) => (
    rangeDateFormatter.format(date).replace(/\./g, "")
);

const formatClientPhones = (client: ClientDetail) => {
    const phones = [...new Set(
        client.client_phones
            .map(item => item.phone.trim())
            .filter(phone => phone.length > 0),
    )];

    return phones.length > 0 ? phones.join(", ") : "Sin teléfono";
};

interface DashboardHeaderProps {
    period: DashboardPeriod;
    customDate: string;
    rangeLabel: string;
    onPeriodChange: (period: DashboardPeriod) => void;
    onCustomDateChange: (date: string) => void;
}

const DashboardHeader = ({
    period,
    customDate,
    rangeLabel,
    onPeriodChange,
    onCustomDateChange,
}: DashboardHeaderProps) => (
    <header className="dash-header">
        <div>
            <p className="dash-eyebrow">Resumen del periodo</p>
            <h1>Panel de control</h1>
            <p className="dash-subtitle">
                Todo el movimiento de tu petshop, en un solo lugar.
            </p>
        </div>
        <div className="dash-header-actions">
            <select
                className="dash-filter-select"
                value={period}
                onChange={(event) => onPeriodChange(event.target.value as DashboardPeriod)}
                aria-label="Filtrar estadísticas por periodo"
            >
                <option value="today">Hoy</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="month">Este mes</option>
                <option value="year">Este año</option>
                <option value="custom">Fecha específica</option>
            </select>
            {period === "custom" && (
                <input
                    type="date"
                    className="dash-filter-date"
                    value={customDate}
                    onChange={(event) => onCustomDateChange(event.target.value)}
                    aria-label="Seleccionar fecha"
                />
            )}
            <span className="dash-date-chip">
                <CalendarIcon/>
                {rangeLabel}
            </span>
            <Link to="/crearCliente" className="dash-btn dash-btn-primary">
                <PlusIcon/>
                Nuevo registro
            </Link>
        </div>
    </header>
);

const EmptyState = ({icon, title, text}: { icon: ReactNode; title: string; text: string }) => (
    <div className="dash-empty">
        <span className="dash-empty-icon">{icon}</span>
        <p className="dash-empty-title">{title}</p>
        <p className="dash-empty-text">{text}</p>
    </div>
);

const DashboardSkeleton = () => (
    <div className="dash-loading" aria-busy="true">
        <span className="sr-only">Cargando panel…</span>
        <div className="stats-grid">
            {[0, 1, 2, 3].map(item => (
                <div className="dash-skeleton-stat" key={item}>
                    <div className="skeleton skeleton-circle"/>
                    <div className="skeleton skeleton-line skeleton-line-sm"/>
                    <div className="skeleton skeleton-line skeleton-line-lg"/>
                    <div className="skeleton skeleton-line skeleton-line-md"/>
                </div>
            ))}
        </div>
        <div className="dash-card dash-skeleton-card dash-skeleton-card-sm"/>
        <div className="dash-bottom-grid dash-bottom-grid-single">
            <div className="dash-card dash-skeleton-card dash-skeleton-card-sm"/>
        </div>
        <div className="dash-analytics-grid">
            <div className="dash-card dash-skeleton-card"/>
            <div className="dash-card dash-skeleton-card"/>
        </div>
    </div>
);

const Dashboard = () => {
    const clientsResource = useAsyncResource(getClients, {
        errorMessage: "No pudimos cargar el panel.",
    });
    const completeService = useAsyncAction(
        ({service}: ServiceRow) => updateServiceStatus(
            service.id,
            SERVICE_STATUS.completed,
            toNumber(service.price),
        ),
        {errorMessage: "No se pudo completar el servicio. Inténtalo de nuevo."},
    );
    const [period, setPeriod] = useState<DashboardPeriod>("today");
    const [customDate, setCustomDate] = useState(() => toDateInputValue(new Date()));
    const [showRevenue, setShowRevenue] = useState(true);

    const clients = useMemo(() => clientsResource.data ?? [], [clientsResource.data]);
    const loading = clientsResource.isLoading;
    const error = clientsResource.isError;
    const updatingServiceId = completeService.state.status === "pending"
        ? completeService.state.args[0].service.id
        : null;
    const actionMessage = completeService.state.status === "success"
        ? {
            type: "success" as const,
            text: `Servicio de ${completeService.state.args[0].pet.name} completado. Abono registrado: ${formatMoney(toNumber(completeService.state.args[0].service.price))}.`,
        }
        : completeService.state.status === "error"
            ? {type: "error" as const, text: completeService.state.error}
            : null;

    const services = useMemo<ServiceRow[]>(() => (
        clients.flatMap(client => (
            client.pets.flatMap(pet => (
                pet.services.map(service => ({service, pet, client}))
            ))
        ))
    ), [clients]);

    const dateRange = useMemo(() => getPeriodRange(period, customDate), [period, customDate]);

    const rangeLabel = useMemo(() => {
        const startLabel = formatRangeDate(dateRange.start);
        const endLabel = formatRangeDate(dateRange.end);

        return startLabel === endLabel
            ? `${periodLabels[period]} · ${startLabel}`
            : `${periodLabels[period]} · ${startLabel} – ${endLabel}`;
    }, [dateRange, period]);

    const filteredServices = useMemo<ServiceRow[]>(() => (
        services.filter(({service}) => {
            const date = new Date(service.date);

            return !Number.isNaN(date.getTime())
                && date >= dateRange.start
                && date <= dateRange.end;
        })
    ), [services, dateRange]);

    const totals = useMemo(() => {
        const totalClients = new Set(filteredServices.map(({client}) => client.id)).size;
        const totalPets = new Set(filteredServices.map(({pet}) => pet.id)).size;
        const totalServices = filteredServices.length;
        const revenue = filteredServices.reduce((sum, row) => sum + toNumber(row.service.price), 0);
        const collected = filteredServices.reduce((sum, row) => sum + toNumber(row.service.paid_amount), 0);
        const pending = Math.max(revenue - collected, 0);
        const averageTicket = totalServices > 0 ? revenue / totalServices : 0;
        const pendingServiceCount = filteredServices.filter(
            ({service}) => isServiceStatusOpen(service.status),
        ).length;
        const completedServiceCount = filteredServices.filter(
            ({service}) => isServiceStatusCompleted(service.status),
        ).length;

        return {
            totalClients,
            totalPets,
            totalServices,
            revenue,
            collected,
            pending,
            averageTicket,
            pendingServiceCount,
            completedServiceCount,
        };
    }, [filteredServices]);

    const monthlyData = useMemo(() => {
        const now = new Date();
        const months = Array.from({length: 6}, (_, index) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

            return {
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: formatMonth(date),
                amount: 0,
                current: index === 5,
            };
        });
        const monthsByKey = new Map(months.map(month => [month.key, month]));

        filteredServices.forEach(({service}) => {
            const date = new Date(service.date);

            if (Number.isNaN(date.getTime())) {
                return;
            }

            const month = monthsByKey.get(`${date.getFullYear()}-${date.getMonth()}`);

            if (month) {
                month.amount += toNumber(service.price);
            }
        });

        return months;
    }, [filteredServices]);

    const maxMonthlyAmount = Math.max(...monthlyData.map(month => month.amount), 1);

    const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.amount ?? 0;
    const previousMonthRevenue = monthlyData[monthlyData.length - 2]?.amount ?? 0;
    const monthChange = previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : null;

    const pendingServices = useMemo<ServiceRow[]>(() => (
        filteredServices
            .filter(({service}) => isServiceStatusOpen(service.status))
            .sort((a, b) => {
                const debtA = getServiceDebt(a.service.price, a.service.paid_amount);
                const debtB = getServiceDebt(b.service.price, b.service.paid_amount);
                const dateA = new Date(a.service.date).getTime() || 0;
                const dateB = new Date(b.service.date).getTime() || 0;
                return debtB - debtA || dateB - dateA || b.service.id - a.service.id;
            })
    ), [filteredServices]);

    const pendingPetCount = new Set(pendingServices.map(({pet}) => pet.id)).size;
    const pendingDebtTotal = pendingServices.reduce(
        (sum, {service}) => sum + getServiceDebt(service.price, service.paid_amount),
        0,
    );

    const handleCompletePendingService = async (row: ServiceRow) => {
        const updated = await completeService.run(row);

        if (!updated) {
            return;
        }

        clientsResource.setData(currentClients => currentClients.map(client => ({
            ...client,
            pets: client.pets.map(currentPet => ({
                ...currentPet,
                services: currentPet.services.map(currentService => (
                    currentService.id === row.service.id
                        ? {
                            ...currentService,
                            status: updated.status,
                            paid_amount: updated.paid_amount ?? row.service.price,
                        }
                        : currentService
                )),
            })),
        })));
    };

    const statusServices = useMemo<ServiceRow[]>(() => (
        filteredServices
            .filter(({service}) => (
                isServiceStatusOpen(service.status) || isServiceStatusCompleted(service.status)
            ))
            .sort((a, b) => {
                const pendingA = isServiceStatusOpen(a.service.status) ? 1 : 0;
                const pendingB = isServiceStatusOpen(b.service.status) ? 1 : 0;
                const dateA = new Date(a.service.date).getTime() || 0;
                const dateB = new Date(b.service.date).getTime() || 0;
                return pendingB - pendingA || dateB - dateA || b.service.id - a.service.id;
            })
    ), [filteredServices]);

    const statusServiceDetails = useMemo(
        () => statusServices.slice(0, 50),
        [statusServices],
    );

    const statusBreakdown = useMemo(() => {
        const counts = new Map<string, number>();

        statusServices.forEach(({service}) => {
            const status = getServiceStatusMeta(service.status).label;
            counts.set(status, (counts.get(status) ?? 0) + 1);
        });

        return [...counts.entries()]
            .map(([status, count]) => ({
                status,
                count,
                percentage: statusServices.length > 0 ? (count / statusServices.length) * 100 : 0,
            }))
            .sort((a, b) => b.count - a.count);
    }, [statusServices]);

    let donutCursor = 0;
    const donutGradient = statusBreakdown.length > 0
        ? `conic-gradient(${statusBreakdown.map((item, index) => {
            const start = donutCursor;
            donutCursor += item.percentage;
            return `${getStatusColor(index)} ${start}% ${donutCursor}%`;
        }).join(", ")})`
        : "#efedf7";

    const recentServices = useMemo(() => (
        [...filteredServices]
            .sort((a, b) => {
                const dateA = new Date(a.service.date).getTime() || 0;
                const dateB = new Date(b.service.date).getTime() || 0;
                return dateB - dateA || b.service.id - a.service.id;
            })
            .slice(0, 6)
    ), [filteredServices]);

    const topClients = useMemo(() => {
        const byClient = new Map<number, {
            client: ClientDetail;
            revenue: number;
            serviceCount: number;
        }>();

        filteredServices.forEach(({client, service}) => {
            const entry = byClient.get(client.id) ?? {
                client,
                revenue: 0,
                serviceCount: 0,
            };

            entry.revenue += toNumber(service.price);
            entry.serviceCount += 1;
            byClient.set(client.id, entry);
        });

        return [...byClient.values()]
            .sort((a, b) => b.revenue - a.revenue || b.serviceCount - a.serviceCount)
            .slice(0, 4);
    }, [filteredServices]);

    const stats = [
        {
            label: "Clientes",
            value: totals.totalClients.toLocaleString("es-MX"),
            helper: totals.totalPets > 0
                ? `${totals.totalPets} ${totals.totalPets === 1 ? "mascota atendida" : "mascotas atendidas"}`
                : "Sin clientes atendidos en el periodo",
            icon: <UsersIcon/>,
            tone: "purple",
        },
        {
            label: "Mascotas",
            value: totals.totalPets.toLocaleString("es-MX"),
            helper: pendingPetCount > 0
                ? `${pendingPetCount} ${pendingPetCount === 1 ? "pendiente" : "pendientes"} · ${formatMoney(pendingDebtTotal)} por cobrar`
                : "Sin mascotas pendientes en el periodo",
            icon: <PawIcon/>,
            tone: "pink",
        },
        {
            label: "Servicios",
            value: totals.totalServices.toLocaleString("es-MX"),
            helper: totals.totalServices > 0
                ? [
                    `${totals.pendingServiceCount} ${totals.pendingServiceCount === 1 ? "pendiente" : "pendientes"}`,
                    `${totals.completedServiceCount} ${totals.completedServiceCount === 1 ? "completado" : "completados"}`,
                ].join(" · ")
                : "Sin servicios en el periodo",
            icon: <ScissorsIcon/>,
            tone: "blue",
        },
        {
            label: "Ingresos",
            value: showRevenue ? formatMoney(totals.revenue) : "•••••",
            helper: showRevenue ? `${formatMoney(totals.collected)} cobrado` : "Ingresos ocultos",
            icon: <WalletIcon/>,
            tone: "green",
        },
    ];

    let trendLabel = "Sin ingresos en el periodo";
    let trendTone = "neutral";
    let trendIcon: ReactNode = null;

    if (monthChange !== null) {
        trendLabel = `${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(0)}% vs. mes anterior`;
        trendTone = monthChange >= 0 ? "positive" : "negative";
        trendIcon = <TrendingUpIcon/>;
    } else if (currentMonthRevenue > 0) {
        trendLabel = "Primer ingreso registrado en el periodo";
        trendTone = "positive";
        trendIcon = <TrendingUpIcon/>;
    }

    return (
        <div className="dashboard">
            <DashboardHeader
                period={period}
                customDate={customDate}
                rangeLabel={rangeLabel}
                onPeriodChange={setPeriod}
                onCustomDateChange={setCustomDate}
            />

            {loading && <DashboardSkeleton/>}

            {!loading && error && (
                <section className="dash-card dash-error" role="alert">
                    <span className="dash-error-icon"><AlertTriangleIcon/></span>
                    <h2>No pudimos cargar el panel</h2>
                    <p>{clientsResource.error ?? "Revisa que el servidor esté disponible e inténtalo de nuevo."}</p>
                    <button type="button" className="dash-btn dash-btn-primary" onClick={() => void clientsResource.reload()}>
                        <RefreshIcon/>
                        Reintentar
                    </button>
                </section>
            )}

            {!loading && !error && (
                <>
                    <section className="stats-grid" aria-label="Resumen general">
                        {stats.map(stat => (
                            <article className={`stat-card stat-card-${stat.tone}`} key={stat.label}>
                                <div className="stat-top">
                                    <div>
                                        <p className="stat-label">{stat.label}</p>
                                        <p className="stat-value">{stat.value}</p>
                                    </div>
                                    <span className={`stat-icon stat-icon-${stat.tone}`}>{stat.icon}</span>
                                </div>
                                <p className="stat-helper">{stat.helper}</p>
                            </article>
                        ))}
                    </section>

                    <section className="dash-card pending-card" aria-labelledby="pending-title">
                        <div className="dash-card-header">
                            <div className="dash-card-title">
                                <h2 id="pending-title">Mascotas pendientes</h2>
                                <p>
                                    {pendingPetCount} {pendingPetCount === 1 ? "mascota" : "mascotas"}
                                    {" · "}
                                    {formatMoney(pendingDebtTotal)} por cobrar
                                </p>
                            </div>
                            <Link to="/verCliente" className="dash-link">
                                Ver clientes
                                <ArrowUpRightIcon/>
                            </Link>
                        </div>

                        {actionMessage && (
                            <p
                                className={`message-banner message-banner-${actionMessage.type}`}
                                role={actionMessage.type === "error" ? "alert" : "status"}
                            >
                                {actionMessage.text}
                            </p>
                        )}

                        {pendingServices.length === 0 ? (
                            <EmptyState
                                icon={<PawIcon/>}
                                title="Sin mascotas pendientes"
                                text="No hay servicios pendientes en el periodo seleccionado."
                            />
                        ) : (
                            <div className="dash-table-wrap">
                                <table className="dash-table pending-table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Mascota</th>
                                        <th scope="col">Dueño</th>
                                        <th scope="col">Teléfono</th>
                                        <th scope="col">Servicio</th>
                                        <th scope="col">Debe</th>
                                        <th scope="col">Estado</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pendingServices.map((row) => {
                                        const {service, pet, client} = row;
                                        const status = getServiceStatusMeta(service.status);
                                        const isUpdating = updatingServiceId === service.id;
                                        const isBusy = updatingServiceId !== null;

                                        return (
                                            <tr key={service.id}>
                                                <td>
                                                    <div className="service-primary">
                                                        <span className="service-avatar">
                                                            {getInitials(pet.name)}
                                                        </span>
                                                        <div className="service-client">
                                                            <span className="service-name">{pet.name}</span>
                                                            <span className="service-detail">
                                                                {pet.raza} · {pet.edad}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="service-name">{client.name}</span>
                                                </td>
                                                <td className="dash-muted-cell">
                                                    {formatClientPhones(client)}
                                                </td>
                                                <td>
                                                    <span className="service-name">{service.service_type}</span>
                                                    {service.details && (
                                                        <span className="service-detail">{service.details}</span>
                                                    )}
                                                </td>
                                                <td className="price-cell pending-debt-cell">
                                                    {formatMoney(getServiceDebt(service.price, service.paid_amount))}
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`status-badge status-badge-${status.tone} pending-complete-button`}
                                                        onClick={() => void handleCompletePendingService(row)}
                                                        disabled={isBusy}
                                                        title="Clic para completar y registrar el abono"
                                                        aria-label={`Marcar como completado y pagado el servicio de ${pet.name}`}
                                                    >
                                                        {isUpdating ? "Guardando…" : status.label}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <div className={`dash-bottom-grid${dateRange.days <= 1 ? " dash-bottom-grid-single" : ""}`}>
                        <section className="dash-card recent-card" aria-labelledby="recent-title">
                            <div className="dash-card-header">
                                <div className="dash-card-title">
                                    <h2 id="recent-title">Servicios recientes</h2>
                                    <p>
                                        {dateRange.days === 1
                                            ? `Servicios del ${formatRangeDate(dateRange.start)}`
                                            : "Los últimos movimientos del periodo"}
                                    </p>
                                </div>
                                <Link to="/verCliente" className="dash-link">
                                    Ver clientes
                                    <ArrowUpRightIcon/>
                                </Link>
                            </div>

                            {recentServices.length === 0 ? (
                                <EmptyState
                                    icon={<PawIcon/>}
                                    title={dateRange.days === 1 ? "Sin servicios ese día" : "Sin movimientos en el periodo"}
                                    text={dateRange.days === 1
                                        ? `No hay servicios registrados el ${formatRangeDate(dateRange.start)}.`
                                        : "No hay servicios registrados en el rango de fechas seleccionado."}
                                />
                            ) : (
                                <div className="dash-table-wrap">
                                    <table className="dash-table">
                                        <thead>
                                        <tr>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Servicio</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Estado</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {recentServices.map(({service, pet, client}) => {
                                            const status = getServiceStatusMeta(service.status);

                                            return (
                                                <tr key={service.id}>
                                                    <td>
                                                        <div className="service-primary">
                                                            <span className="service-avatar">
                                                                {getInitials(client.name)}
                                                            </span>
                                                            <div className="service-client">
                                                                <span className="service-name">{client.name}</span>
                                                                <span className="service-detail">
                                                                    {pet.name} · {pet.raza} · {pet.edad}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="service-name">{service.service_type}</span>
                                                        {service.details && (
                                                            <span className="service-detail">{service.details}</span>
                                                        )}
                                                    </td>
                                                    <td className="dash-muted-cell">{formatShortDate(service.date)}</td>
                                                    <td>
                                                        <span className={`status-badge status-badge-${status.tone}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="price-cell">{formatMoney(toNumber(service.price))}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        {dateRange.days > 1 && (
                            <section className="dash-card top-clients-card" aria-labelledby="top-clients-title">
                                <div className="dash-card-header">
                                    <div className="dash-card-title">
                                        <h2 id="top-clients-title">Top clientes</h2>
                                        <p>Por facturación del periodo</p>
                                    </div>
                                    <Link to="/verCliente" className="dash-link" aria-label="Ver todos los clientes">
                                        <ArrowUpRightIcon/>
                                    </Link>
                                </div>

                                {topClients.length === 0 ? (
                                    <EmptyState
                                        icon={<UserPlusIcon/>}
                                        title="Sin clientes con servicios"
                                        text="Cuando registres servicios en el periodo, aquí verás a tus mejores clientes."
                                    />
                                ) : (
                                    <ol className="top-clients-list">
                                        {topClients.map(({client, revenue, serviceCount}, index) => (
                                            <li className="top-client" key={client.id}>
                                                <span className={`client-avatar client-avatar-${index % 4}`}>
                                                    {getInitials(client.name)}
                                                </span>
                                                <div className="client-info">
                                                    <span className="client-name">{client.name}</span>
                                                    <span className="client-meta">
                                                        {client.pets.length} {client.pets.length === 1 ? "mascota" : "mascotas"}
                                                        {" · "}
                                                        {serviceCount} {serviceCount === 1 ? "servicio" : "servicios"}
                                                    </span>
                                                </div>
                                                <span className="client-amount">{formatMoney(revenue)}</span>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </section>
                        )}
                    </div>
                    <div className="dash-analytics-grid">
                        <section className="dash-card revenue-card" aria-labelledby="revenue-title">
                            <div className="dash-card-header">
                                <div className="dash-card-title">
                                    <h2 id="revenue-title">Ingresos</h2>
                                    <p>Facturación mensual del periodo</p>
                                </div>
                                <div className="revenue-header-actions">
                                    {showRevenue && (
                                        <span className={`revenue-trend revenue-trend-${trendTone}`}>
                                            {trendIcon}
                                            {trendLabel}
                                        </span>
                                    )}
                                    <label className="revenue-visibility-toggle">
                                        <input
                                            type="checkbox"
                                            checked={showRevenue}
                                            onChange={(event) => setShowRevenue(event.target.checked)}
                                        />
                                        <span>Mostrar ingresos</span>
                                    </label>
                                </div>
                            </div>

                            {!showRevenue ? (
                                <div className="revenue-hidden-state">
                                    <WalletIcon/>
                                    <p>Ingresos ocultos</p>
                                    <span>Marca “Mostrar ingresos” para ver la facturación del periodo.</span>
                                </div>
                            ) : (
                                <>
                                    <div className="revenue-total-block">
                                        <span>Total facturado</span>
                                        <p>{formatMoney(totals.revenue)}</p>
                                    </div>

                                    <div className="revenue-metrics">
                                        <div className="revenue-metric">
                                            <span>Cobrado</span>
                                            <strong className="revenue-metric-success">
                                                {formatMoney(totals.collected)}
                                            </strong>
                                        </div>
                                        <div className="revenue-metric">
                                            <span>Por cobrar</span>
                                            <strong className="revenue-metric-warning">
                                                {formatMoney(totals.pending)}
                                            </strong>
                                        </div>
                                        <div className="revenue-metric">
                                            <span>Ticket promedio</span>
                                            <strong>{formatMoney(totals.averageTicket)}</strong>
                                        </div>
                                    </div>

                                    <div
                                        className="bar-chart"
                                        role="img"
                                        aria-label="Ingresos facturados por mes en el periodo seleccionado"
                                    >
                                        {monthlyData.map(month => {
                                            const height = month.amount > 0
                                                ? Math.max((month.amount / maxMonthlyAmount) * 100, 4)
                                                : 0;

                                            return (
                                                <div className="bar-column" key={month.key}>
                                                    <div className="bar-track">
                                                        <div
                                                            className={`bar-fill${month.current ? " bar-fill-current" : ""}`}
                                                            style={{height: `${height}%`}}
                                                            title={`${month.label}: ${formatMoney(month.amount)}`}
                                                        />
                                                    </div>
                                                    <span className="bar-label">{month.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </section>

                        <section className="dash-card status-card" aria-labelledby="status-title">
                            <div className="dash-card-header">
                                <div className="dash-card-title">
                                    <h2 id="status-title">Servicios por estado</h2>
                                    <p>Pendientes y completados del periodo</p>
                                </div>
                            </div>

                            {statusServices.length === 0 ? (
                                <EmptyState
                                    icon={<ScissorsIcon/>}
                                    title="Sin pendientes ni completados"
                                    text="No hay servicios pendientes o completados en el periodo seleccionado."
                                />
                            ) : (
                                <div className="status-body">
                                    <div className="donut" style={{background: donutGradient}}>
                                        <div className="donut-center">
                                            <strong>{statusServices.length}</strong>
                                            <span>{statusServices.length === 1 ? "servicio" : "servicios"}</span>
                                        </div>
                                    </div>

                                    <ul className="status-legend">
                                        {statusBreakdown.map((item, index) => (
                                            <li className="status-legend-item" key={item.status}>
                                                <span
                                                    className="status-dot"
                                                    style={{background: getStatusColor(index)}}
                                                />
                                                <span className="status-legend-label">{item.status}</span>
                                                <span className="status-legend-count">{item.count}</span>
                                                <span className="status-legend-percent">
                                                    {item.percentage.toFixed(0)}%
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="status-services">
                                        <p className="status-services-heading">
                                            Detalle del periodo
                                            {statusServices.length > statusServiceDetails.length && (
                                                <span className="status-services-limit">
                                                    {statusServiceDetails.length} de {statusServices.length}
                                                </span>
                                            )}
                                        </p>
                                        <ul className="status-services-list">
                                            {statusServiceDetails.map(({service, pet, client}) => {
                                                const status = getServiceStatusMeta(service.status);
                                                const debt = getServiceDebt(service.price, service.paid_amount);

                                                return (
                                                    <li className="status-service-item" key={service.id}>
                                                        <span className={`status-badge status-badge-${status.tone}`}>
                                                            {status.label}
                                                        </span>
                                                        <div className="status-service-info">
                                                            <span className="status-service-pet">
                                                                {pet.name} · {service.service_type}
                                                            </span>
                                                            <span className="status-service-owner">
                                                                {client.name} · {formatClientPhones(client)}
                                                            </span>
                                                        </div>
                                                        <span className="status-service-debt">
                                                            {formatMoney(debt)}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                </>
            )}
        </div>
    );
};

export default Dashboard;
