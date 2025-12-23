import { useEffect, useState } from 'react';
import axios from "axios";

const TestGetClients = () => {
    interface Client {
        id: number;
        name: string;
        client_phones: [
            {
                id: number;
                phone: string;
            }
        ]
        pets: [
            {
                id: number;
                name: string;
                raza: string;
                services: [
                    {
                        service_type: string;
                        details: string;
                        price: number;
                        paid_amount: number;
                        status: string;
                    }
                    ]
            }
            ]
    }

    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        axios.get(`/api/clients`)
            .then(response => setClients(response.data));
        // response.data contains the parsed JSON from the API.
        // setUsers(data) updates the React state with that JSON and stores it in state so you can access it.
    }, []);


    return (
        <>
            <table>
                <thead>
                <tr>
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
                            pet.services.map(service => (
                                <tr key={`${client.id}-${pet.id}-${phone.id}`}>
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
        </>
    )

}

export default TestGetClients
