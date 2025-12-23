import { useEffect, useState } from 'react';
import axios from "axios";

const TestGetClients = () => {
    interface Client {
        id: number;
        name: string;
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
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">User List (using Axios)
                </h1>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {clients.map(client => (
                        <li key={client.id} className="bg-white shadow p-4 rounded-xl">
                            <h2 className="text-lg font-semibold">{client.name}</h2>
                        </li>
                    ))}
                </ul>
            </div>
            {/*<table>
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
                </tbody>
            </table>
        */}
        </>
    )

}

export default TestGetClients
