import { useEffect, useState } from 'react';
import axios from "axios";

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

const TestGetClients = () => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        axios.get(`/api/clients`)
            .then(response => setClients(response.data));
        // response.data contains the parsed JSON from the API.
        // setUsers(data) updates the React state with that JSON and stores it in state so you can access it.
    }, []);


    return (
        <div>
            <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Nombre cliente</th>
                    <th>Telefono</th>
                    <th>Nombre mascota</th>
                    <th>Raza</th>
                    <th>Servicio</th>
                    <th>Detalles</th>
                    <th>Precio</th>
                    <th>Pagado</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                {clients.map(client => (
                    client.client_phones.map(phone => (
                        client.pets.map(pet => (
                            pet.services.sort((a, b) => {
                                    // Ordena del más reciente al más antiguo
                                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                                }).map(service => (
                                <tr key={`${client.id}-${pet.id}-${phone.id}`}>
                                    <td className="text-lg font-semibold">{new Date(service.date).toLocaleDateString()}</td>
                                    <td className="text-lg font-semibold">{client.name}</td>
                                    <td className="text-lg font-semibold">{phone.phone}</td>
                                    <td className="text-lg font-semibold">{pet.name}</td>
                                    <td className="text-lg font-semibold">{pet.raza}</td>
                                    <td className="text-lg font-semibold">{service.service_type}</td>
                                    <td className="text-lg font-semibold">{service.details}</td>
                                    <td className="text-lg font-semibold">{service.price}</td>
                                    <td className="text-lg font-semibold">{service.paid_amount}</td>
                                    <td className="text-lg font-semibold">{service.status}</td>
                                </tr>
                            ))
                        ))
                    ))
                ))}

                </tbody>
            </table>
        </div>
    )

}

export default TestGetClients
