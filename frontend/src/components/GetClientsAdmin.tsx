import {useMemo, useState} from 'react';
import {deleteService, getClients} from "../services/index.ts";
import {getServiceDebt, getServiceStatusMeta} from "../domain/serviceLifecycle.ts";
import {useAsyncAction} from "../hooks/useAsyncAction.ts";
import {useAsyncResource} from "../hooks/useAsyncResource.ts";
import {usePagination} from "../hooks/usePagination.ts";
import type {ServiceRow} from "../types/ServiceRow.ts";

const PAGE_SIZE = 30;

const TestGet = () => {
    const clientsResource = useAsyncResource(getClients, {
        errorMessage: "No se pudieron cargar los servicios.",
    });
    const deleteAction = useAsyncAction(deleteService, {
        errorMessage: "Hubo un error al eliminar el registro",
    });
    const [notice, setNotice] = useState<string | null>(null);

    const clients = useMemo(() => clientsResource.data ?? [], [clientsResource.data]);
    const deletingServiceId = deleteAction.state.status === "pending"
        ? deleteAction.state.args[0]
        : null;

    const handleDelete = async (serviceId: number) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
            return;
        }

        setNotice(null);
        const deleted = await deleteAction.run(serviceId);

        if (!deleted) {
            return;
        }

        clientsResource.setData(currentClients => currentClients.map(client => ({
            ...client,
            pets: client.pets.map(pet => ({
                ...pet,
                services: pet.services.filter(service => service.id !== serviceId),
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

    const actionMessage = notice
        ? {type: "info" as const, text: notice}
        : deleteAction.state.status === "success"
            ? {type: "success" as const, text: "¡Eliminado con éxito!"}
            : deleteAction.state.status === "error"
                ? {type: "error" as const, text: deleteAction.state.error}
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
                                <th className="cell-nowrap">ServiceID </th>
                                <th>Editar</th>
                                <th>Borrar</th>
                              </tr>
                            </thead>
                            <tbody>
                            {visibleRows.map((row) => {
                                const {client, phone, pet, service} = row;
                                const status = getServiceStatusMeta(service.status);
                                const isDeleting = deletingServiceId === service.id;

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
                                            <span className={`status-badge status-badge-${status.tone}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="cell-nowrap">{service.id}</td>
                                        <td>
                                          <button type="button"
                                            onClick={() => setNotice("La edición aún no está disponible")}
                                            className="admin-action-btn admin-action-btn-edit">Editar</button>
                                        </td>
                                        <td>
                                          <button type="button" onClick={() => void handleDelete(service.id)}
                                            className="admin-action-btn admin-action-btn-delete"
                                            disabled={deleteAction.isPending}>
                                            {isDeleting ? "Borrando…" : "Borrar"}
                                          </button>
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

export default TestGet;
