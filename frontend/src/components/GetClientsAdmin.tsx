import type { Client, ServiceRow } from "./GetClients.tsx";
import { useEffect, useMemo, useState } from 'react';
import axios from "axios";
import { getServiceDebt } from "../utils/serviceDebt.ts";

const PAGE_SIZE = 30;

const TestGet = () => {


    const [clients, setClients] = useState<Client[]>([]);
    const [page, setPage] = useState(1);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);


    useEffect(() => {
        axios.get(`/api/clients`)
            .then(response => setClients(response.data));
        // response.data contains the parsed JSON from the API.
        // setUsers(data) updates the React state with that JSON and stores it in state so you can access it.
    }, []);

    const handleDelete = async (serviceId: number) => {
            if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
                setMessage(null);

                try {
                    await axios.delete(`/api/services/${serviceId}`);

                    setClients(clients.map(client => ({
                        ...client,
                        pets: client.pets.map(pet => ({
                            ...pet,
                            services: pet.services.filter(s => s.id !== serviceId)
                        }))
                    })));

                    setMessage({type: "success", text: "¡Eliminado con éxito!"});
                } catch {
                    setMessage({type: "error", text: "Hubo un error al eliminar el registro"});
                }
            }
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

    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const visibleRows = rows.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div>
            {message && (
                <div
                    className={`message-banner message-banner-${message.type}`}
                    role={message.type === "error" ? "alert" : "status"}
                >
                    {message.text}
                </div>
            )}

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
                    {visibleRows.map(({client, phone, pet, service}) => (
                        <tr key={`${service.id}-${phone.id}`}>
                            <td className="cell-nowrap">{new Date(service.date).toLocaleDateString()}</td>
                            <td><span className="cell-ellipsis" title={client.name}>{client.name}</span></td>
                            <td className="cell-nowrap">{phone.phone}</td>
                            <td><span className="cell-ellipsis" title={pet.name}>{pet.name}</span></td>
                            <td className="hide-sm"><span className="cell-ellipsis" title={pet.raza}>{pet.raza}</span></td>
                            <td className="cell-nowrap hide-sm">{pet.edad}</td>
                            <td>{service.service_type}</td>
                            <td className="hide-sm">
                                <span className="cell-ellipsis cell-ellipsis-wide" title={service.details}>
                                    {service.details}
                                </span>
                            </td>
                            <td className="cell-nowrap">{service.price}</td>
                            <td className="cell-nowrap">{service.paid_amount}</td>
                            <td className="cell-nowrap">{getServiceDebt(service.price, service.paid_amount).toFixed(2)}</td>
                            <td className="cell-nowrap">{service.status}</td>
                            <td className="cell-nowrap">{service.id}</td>
                            <td>
                              <button type="button"
                                onClick={() => setMessage({type: "info", text: "La edición aún no está disponible"})}
                                className="admin-action-btn admin-action-btn-edit">Editar</button>
                            </td>
                            <td>
                              <button type="button" onClick={() => handleDelete(service.id)}
                                className="admin-action-btn admin-action-btn-delete">Borrar</button>
                            </td>

                          </tr>
                    ))}

                    </tbody>
                </table>
            </div>

            {rows.length > 0 && (
                <div className="pagination">
                    <span className="pagination-summary">
                        Mostrando {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, rows.length)} de {rows.length} servicios
                    </span>
                    <div className="pagination-controls">
                        <button
                            type="button"
                            className="pagination-btn"
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span className="pagination-page">Página {currentPage} de {totalPages}</span>
                        <button
                            type="button"
                            className="pagination-btn"
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestGet
