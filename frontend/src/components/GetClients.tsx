import {useMemo} from 'react';
import {getClients, updateServiceStatus} from "../services/index.ts";
import {getServiceDebt, getServiceStatusMeta, SERVICE_STATUS} from "../domain/serviceLifecycle.ts";
import {useAsyncAction} from "../hooks/useAsyncAction.ts";
import {useAsyncResource} from "../hooks/useAsyncResource.ts";
import {usePagination} from "../hooks/usePagination.ts";
import type {ServiceRow} from "../types/ServiceRow.ts";

const PAGE_SIZE = 30;

const TestGetClients = () => {
    const clientsResource = useAsyncResource(getClients, {
        errorMessage: "No se pudieron cargar los servicios.",
    });
    const completeService = useAsyncAction(
        (row: ServiceRow) => updateServiceStatus(
            row.service.id,
            SERVICE_STATUS.completed,
            Number(row.service.price) || 0,
        ),
        {errorMessage: "No se pudo cambiar el estado del servicio"},
    );

    const clients = useMemo(() => clientsResource.data ?? [], [clientsResource.data]);
    const updatingServiceId = completeService.state.status === "pending"
        ? completeService.state.args[0].service.id
        : null;

    const handleCompleteService = async (row: ServiceRow) => {
        const updated = await completeService.run(row);

        if (!updated) {
            return;
        }

        clientsResource.setData(currentClients => currentClients.map(client => ({
            ...client,
            pets: client.pets.map(pet => ({
                ...pet,
                services: pet.services.map(service => (
                    service.id === row.service.id
                        ? {
                            ...service,
                            status: updated.status,
                            paid_amount: updated.paid_amount ?? row.service.price,
                        }
                        : service
                )),
            })),
        })));
    };

    const rows = useMemo<ServiceRow[]>(() => (
        clients.flatMap(client => (
            client.client_phones.flatMap(phone => (
                client.pets.flatMap(pet => (
                    pet.services.map(service => ({client, phone, pet, service}))
                ))
            ))
        )).sort((a, b) => {
            const dateA = new Date(a.service.date).getTime() || 0;
            const dateB = new Date(b.service.date).getTime() || 0;
            return dateB - dateA || b.service.id - a.service.id;
        })
    ), [clients]);

    const pagination = usePagination(rows.length, PAGE_SIZE);
    const visibleRows = rows.slice(pagination.startIndex, pagination.endIndex);

    const actionMessage = completeService.state.status === "success"
        ? {type: "success" as const, text: "Servicio completado y pago registrado."}
        : completeService.state.status === "error"
            ? {type: "error" as const, text: completeService.state.error}
            : null;

    return (
        <div>
            {actionMessage && (
                <div
                    className={`message-banner message-banner-${actionMessage.type}`}
                    role={actionMessage.type === "error" ? "alert" : "status"}
                >
                    {actionMessage.text}
                </div>
            )}

            {clientsResource.isLoading && (
                <p className="table-state" role="status">Cargando servicios…</p>
            )}

            {clientsResource.isError && (
                <div className="message-banner message-banner-error" role="alert">
                    <span>{clientsResource.error}</span>
                    <button
                        type="button"
                        className="message-banner-action"
                        onClick={() => void clientsResource.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!clientsResource.isLoading && !clientsResource.isError && rows.length === 0 && (
                <p className="table-state">No hay servicios registrados todavía.</p>
            )}

            {!clientsResource.isLoading && !clientsResource.isError && rows.length > 0 && (
                <>
                    <div className="table-scroll">
                        <table className="services-table">
                            <thead>
                              <tr>
                                <th className="cell-nowrap">Fecha</th>
                                <th>Nombre cliente</th>
                                <th className="cell-nowrap">Telefono</th>
                                <th>Nombre mascota</th>
                                <th className="hide-sm">Raza</th>
                                <th className="cell-nowrap hide-sm">Edad</th>
                                <th>Servicio</th>
                                <th className="hide-sm">Detalles</th>
                                <th className="cell-nowrap">Precio</th>
                                <th className="cell-nowrap">Pagado</th>
                                <th className="cell-nowrap">Debe</th>
                                <th className="cell-nowrap">Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                            {visibleRows.map((row) => {
                                const {client, phone, pet, service} = row;
                                const status = getServiceStatusMeta(service.status);
                                const canComplete = status.allowedTransitions.includes(SERVICE_STATUS.completed);
                                const isUpdating = updatingServiceId === service.id;

                                return (
                                    <tr key={`${service.id}-${phone.id}`}>
                                        <td className="cell-nowrap">{new Date(service.date).toLocaleDateString()}</td>
                                        <td><span className="cell-ellipsis" title={client.name}>{client.name}</span></td>
                                        <td className="cell-nowrap">{phone.phone}</td>
                                        <td><span className="cell-ellipsis" title={pet.name}>{pet.name}</span></td>
                                        <td className="hide-sm"><span className="cell-ellipsis" title={pet.raza}>{pet.raza}</span></td>
                                        <td className="cell-nowrap hide-sm">{pet.edad}</td>
                                        <td>{service.service_type}</td>
                                        <td className="hide-sm">
                                            <span className="cell-ellipsis cell-ellipsis-wide" title={service.details ?? ""}>
                                                {service.details}
                                            </span>
                                        </td>
                                        <td className="cell-nowrap">{service.price}</td>
                                        <td className="cell-nowrap">{service.paid_amount}</td>
                                        <td className="cell-nowrap">{getServiceDebt(service.price, service.paid_amount).toFixed(2)}</td>
                                        <td className="cell-nowrap">
                                            {canComplete ? (
                                                <button
                                                    type="button"
                                                    className={`status-badge status-badge-${status.tone} service-status-action`}
                                                    onClick={() => void handleCompleteService(row)}
                                                    disabled={completeService.isPending}
                                                    title="Marcar como Completado"
                                                >
                                                    {isUpdating ? "Guardando…" : status.label}
                                                </button>
                                            ) : (
                                                <span className={`status-badge status-badge-${status.tone}`}>
                                                    {status.label}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span className="pagination-summary">
                            Mostrando {pagination.startIndex + 1}-{pagination.endIndex} de {rows.length} servicios
                        </span>
                        <div className="pagination-controls">
                            <button
                                type="button"
                                className="pagination-btn"
                                onClick={pagination.goPrevious}
                                disabled={!pagination.canGoPrevious}
                            >
                                Anterior
                            </button>
                            <span className="pagination-page">Página {pagination.page} de {pagination.totalPages}</span>
                            <button
                                type="button"
                                className="pagination-btn"
                                onClick={pagination.goNext}
                                disabled={!pagination.canGoNext}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )

}

export default TestGetClients;
