import { useEffect, useMemo, useState } from 'react';
import axios from "axios";
import { updateServiceStatus } from "../services/index.ts";
import { getServiceDebt } from "../utils/serviceDebt.ts";

export interface Client {
    id: number;
    name: string;
    client_phones: {
        id: number;
        phone: string;
    }[];
    pets: {
        id: number;
        name: string;
        raza: string;
        edad: string;
        services: {
            id: number;
            service_type: string;
            details: string;
            price: number;
            paid_amount: number;
            status: string;
            date: string;
        }[];
    }[];
}

export interface ServiceRow {
    client: Client;
    phone: Client["client_phones"][number];
    pet: Client["pets"][number];
    service: Client["pets"][number]["services"][number];
}

const PAGE_SIZE = 30;

const TestGetClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [updatingServiceId, setUpdatingServiceId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`/api/clients`)
            .then(response => setClients(response.data));
        // response.data contains the parsed JSON from the API.
        // setUsers(data) updates the React state with that JSON and stores it in state so you can access it.
    }, []);

    const handleCompleteService = async (serviceId: number, price: number | string) => {
        if (updatingServiceId !== null) {
            return;
        }

        setUpdatingServiceId(serviceId);
        setMessage(null);
        const paidAmount = Number(price) || 0;

        try {
            await updateServiceStatus(serviceId, "Completado", paidAmount);

            setClients(currentClients => currentClients.map(client => ({
                ...client,
                pets: client.pets.map(pet => ({
                    ...pet,
                    services: pet.services.map(service => (
                        service.id === serviceId
                            ? {...service, status: "Completado", paid_amount: paidAmount}
                            : service
                    )),
                })),
            })));
        } catch {
            setMessage("No se pudo cambiar el estado del servicio");
        } finally {
            setUpdatingServiceId(null);
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
                <div className="message-banner message-banner-error" role="alert">
                    {message}
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
                            <td className="cell-nowrap">
                                {(service.status ?? "").trim().toLowerCase() === "pendiente" ? (
                                    <button
                                        type="button"
                                        className="status-toggle"
                                        onClick={() => handleCompleteService(service.id, service.price)}
                                        disabled={updatingServiceId === service.id}
                                        title="Marcar como Completado"
                                    >
                                        {service.status}
                                    </button>
                                ) : (
                                    service.status
                                )}
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

export default TestGetClients
