import {useCallback, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {Link} from "react-router-dom";
import {getClients} from "../services/index.ts";
import type {ClientDetail, PetRecord, ServiceRecord} from "../types/ClientDetail.ts";
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

type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

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

const todayFormatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
});

const statusColors = ["#6c63ff", "#ec4899", "#0ea5e9", "#f59e0b", "#14b8a6", "#ef4444"];

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

const getStatusTone = (status: string): StatusTone => {
    const value = status.toLowerCase();

    if (/(pagad|complet|finaliz|entregad|listo)/.test(value)) {
        return "success";
    }

    if (/(cancel|vencid|rechaz|atras|adeud)/.test(value)) {
        return "danger";
    }

    if (/(pend|proceso|agend|program|espera|abono)/.test(value)) {
        return "warning";
    }

    if (/(activo|nuevo)/.test(value)) {
        return "info";
    }

    return "neutral";
};

const getStatusColor = (index: number) => (
    statusColors[index % statusColors.length]
);

const DashboardHeader = () => {
    const today = todayFormatter.format(new Date());

    return (
        <header className="dash-header">
            <div>
                <p className="dash-eyebrow">Resumen general</p>
                <h1>Panel de control</h1>
                <p className="dash-subtitle">
                    Todo el movimiento de tu petshop, en un solo lugar.
                </p>
            </div>
            <div className="dash-header-actions">
                <span className="dash-date-chip">
                    <CalendarIcon/>
                    {today.charAt(0).toUpperCase() + today.slice(1)}
                </span>
                <Link to="/crearCliente" className="dash-btn dash-btn-primary">
                    <PlusIcon/>
                    Nuevo registro
                </Link>
            </div>
        </header>
    );
};

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
        <div className="dash-analytics-grid">
            <div className="dash-card dash-skeleton-card"/>
            <div className="dash-card dash-skeleton-card"/>
        </div>
        <div className="dash-bottom-grid">
            <div className="dash-card dash-skeleton-card dash-skeleton-card-sm"/>
            <div className="dash-card dash-skeleton-card dash-skeleton-card-sm"/>
        </div>
    </div>
);

const Dashboard = () => {
    const [clients, setClients] = useState<ClientDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const data = await getClients();
            setClients(Array.isArray(data) ? data : []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const services = useMemo<ServiceRow[]>(() => (
        clients.flatMap(client => (
            client.pets.flatMap(pet => (
                pet.services.map(service => ({service, pet, client}))
            ))
        ))
    ), [clients]);

    const totals = useMemo(() => {
        const totalClients = clients.length;
        const totalPets = clients.reduce((sum, client) => sum + client.pets.length, 0);
        const totalServices = services.length;
        const revenue = services.reduce((sum, row) => sum + toNumber(row.service.price), 0);
        const collected = services.reduce((sum, row) => sum + toNumber(row.service.paid_amount), 0);
        const pending = Math.max(revenue - collected, 0);
        const averageTicket = totalServices > 0 ? revenue / totalServices : 0;
        const clientsWithPets = clients.filter(client => client.pets.length > 0).length;
        const breeds = new Set(clients.flatMap(client => client.pets.map(pet => pet.raza))).size;
        const now = new Date();
        const servicesThisMonth = services.filter(({service}) => {
            const date = new Date(service.date);
            return !Number.isNaN(date.getTime())
                && date.getMonth() === now.getMonth()
                && date.getFullYear() === now.getFullYear();
        }).length;

        return {
            totalClients,
            totalPets,
            totalServices,
            revenue,
            collected,
            pending,
            averageTicket,
            clientsWithPets,
            breeds,
            servicesThisMonth,
        };
    }, [clients, services]);

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

        services.forEach(({service}) => {
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
    }, [services]);

    const maxMonthlyAmount = Math.max(...monthlyData.map(month => month.amount), 1);

    const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.amount ?? 0;
    const previousMonthRevenue = monthlyData[monthlyData.length - 2]?.amount ?? 0;
    const monthChange = previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : null;

    const statusBreakdown = useMemo(() => {
        const counts = new Map<string, number>();

        services.forEach(({service}) => {
            const status = service.status?.trim() || "Sin estado";
            counts.set(status, (counts.get(status) ?? 0) + 1);
        });

        return [...counts.entries()]
            .map(([status, count]) => ({
                status,
                count,
                percentage: totals.totalServices > 0 ? (count / totals.totalServices) * 100 : 0,
            }))
            .sort((a, b) => b.count - a.count);
    }, [services, totals.totalServices]);

    let donutCursor = 0;
    const donutGradient = statusBreakdown.length > 0
        ? `conic-gradient(${statusBreakdown.map((item, index) => {
            const start = donutCursor;
            donutCursor += item.percentage;
            return `${getStatusColor(index)} ${start}% ${donutCursor}%`;
        }).join(", ")})`
        : "#efedf7";

    const recentServices = useMemo(() => (
        [...services]
            .sort((a, b) => {
                const dateA = new Date(a.service.date).getTime() || 0;
                const dateB = new Date(b.service.date).getTime() || 0;
                return dateB - dateA || b.service.id - a.service.id;
            })
            .slice(0, 6)
    ), [services]);

    const topClients = useMemo(() => (
        clients
            .map(client => {
                const clientServices = client.pets.flatMap(pet => pet.services);

                return {
                    client,
                    revenue: clientServices.reduce((sum, service) => sum + toNumber(service.price), 0),
                    serviceCount: clientServices.length,
                };
            })
            .filter(item => item.serviceCount > 0)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 4)
    ), [clients]);

    const stats = [
        {
            label: "Clientes",
            value: totals.totalClients.toLocaleString("es-MX"),
            helper: `${totals.clientsWithPets} con mascotas registradas`,
            icon: <UsersIcon/>,
            tone: "purple",
        },
        {
            label: "Mascotas",
            value: totals.totalPets.toLocaleString("es-MX"),
            helper: `${totals.breeds} ${totals.breeds === 1 ? "raza registrada" : "razas registradas"}`,
            icon: <PawIcon/>,
            tone: "pink",
        },
        {
            label: "Servicios",
            value: totals.totalServices.toLocaleString("es-MX"),
            helper: `${totals.servicesThisMonth} registrados este mes`,
            icon: <ScissorsIcon/>,
            tone: "blue",
        },
        {
            label: "Ingresos",
            value: formatMoney(totals.revenue),
            helper: `${formatMoney(totals.collected)} cobrado`,
            icon: <WalletIcon/>,
            tone: "green",
        },
    ];

    let trendLabel = "Sin ingresos registrados este mes";
    let trendTone = "neutral";
    let trendIcon: ReactNode = null;

    if (monthChange !== null) {
        trendLabel = `${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(0)}% vs. mes anterior`;
        trendTone = monthChange >= 0 ? "positive" : "negative";
        trendIcon = <TrendingUpIcon/>;
    } else if (currentMonthRevenue > 0) {
        trendLabel = "Primer ingreso registrado este mes";
        trendTone = "positive";
        trendIcon = <TrendingUpIcon/>;
    }

    return (
        <div className="dashboard">
            <DashboardHeader/>

            {loading && <DashboardSkeleton/>}

            {!loading && error && (
                <section className="dash-card dash-error" role="alert">
                    <span className="dash-error-icon"><AlertTriangleIcon/></span>
                    <h2>No pudimos cargar el panel</h2>
                    <p>Revisa que el servidor esté disponible e inténtalo de nuevo.</p>
                    <button type="button" className="dash-btn dash-btn-primary" onClick={() => void loadDashboard()}>
                        <RefreshIcon/>
                        Reintentar
                    </button>
                </section>
            )}

            {!loading && !error && (
                <>
                    <section className="stats-grid" aria-label="Resumen general">
                        {stats.map(stat => (
                            <article className="stat-card" key={stat.label}>
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

                    <div className="dash-analytics-grid">
                        <section className="dash-card revenue-card" aria-labelledby="revenue-title">
                            <div className="dash-card-header">
                                <div className="dash-card-title">
                                    <h2 id="revenue-title">Ingresos</h2>
                                    <p>Facturación de los últimos 6 meses</p>
                                </div>
                                <span className={`revenue-trend revenue-trend-${trendTone}`}>
                                    {trendIcon}
                                    {trendLabel}
                                </span>
                            </div>

                            <div className="revenue-total-block">
                                <span>Total facturado</span>
                                <p>{formatMoney(totals.revenue)}</p>
                            </div>

                            <div className="revenue-metrics">
                                <div className="revenue-metric">
                                    <span>Cobrado</span>
                                    <strong className="revenue-metric-success">{formatMoney(totals.collected)}</strong>
                                </div>
                                <div className="revenue-metric">
                                    <span>Por cobrar</span>
                                    <strong className="revenue-metric-warning">{formatMoney(totals.pending)}</strong>
                                </div>
                                <div className="revenue-metric">
                                    <span>Ticket promedio</span>
                                    <strong>{formatMoney(totals.averageTicket)}</strong>
                                </div>
                            </div>

                            <div
                                className="bar-chart"
                                role="img"
                                aria-label="Ingresos facturados en los últimos seis meses"
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
                        </section>

                        <section className="dash-card status-card" aria-labelledby="status-title">
                            <div className="dash-card-header">
                                <div className="dash-card-title">
                                    <h2 id="status-title">Servicios por estado</h2>
                                    <p>Distribución de todos los servicios</p>
                                </div>
                            </div>

                            {statusBreakdown.length === 0 ? (
                                <EmptyState
                                    icon={<ScissorsIcon/>}
                                    title="Aún no hay servicios"
                                    text="Los servicios que registres aparecerán aquí."
                                />
                            ) : (
                                <div className="status-body">
                                    <div className="donut" style={{background: donutGradient}}>
                                        <div className="donut-center">
                                            <strong>{totals.totalServices}</strong>
                                            <span>{totals.totalServices === 1 ? "servicio" : "servicios"}</span>
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
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="dash-bottom-grid">
                        <section className="dash-card recent-card" aria-labelledby="recent-title">
                            <div className="dash-card-header">
                                <div className="dash-card-title">
                                    <h2 id="recent-title">Servicios recientes</h2>
                                    <p>Los últimos movimientos registrados</p>
                                </div>
                                <Link to="/verCliente" className="dash-link">
                                    Ver clientes
                                    <ArrowUpRightIcon/>
                                </Link>
                            </div>

                            {recentServices.length === 0 ? (
                                <EmptyState
                                    icon={<PawIcon/>}
                                    title="Todavía no hay movimientos"
                                    text="Registra tu primer cliente, mascota y servicio para empezar."
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
                                            const tone = getStatusTone(service.status);

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
                                                                    {pet.name} · {pet.raza}
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
                                                        <span className={`status-badge status-badge-${tone}`}>
                                                            {service.status || "Sin estado"}
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

                        <section className="dash-card top-clients-card" aria-labelledby="top-clients-title">
                            <div className="dash-card-header">
                                <div className="dash-card-title">
                                    <h2 id="top-clients-title">Top clientes</h2>
                                    <p>Por facturación total</p>
                                </div>
                                <Link to="/verCliente" className="dash-link" aria-label="Ver todos los clientes">
                                    <ArrowUpRightIcon/>
                                </Link>
                            </div>

                            {topClients.length === 0 ? (
                                <EmptyState
                                    icon={<UserPlusIcon/>}
                                    title="Sin clientes con servicios"
                                    text="Cuando registres servicios, aquí verás a tus mejores clientes."
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
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
