import type { Client } from "./GetClients.tsx";
import { useEffect, useState } from 'react';
import axios from "axios";

const TestGet = () => {


    const [clients, setClients] = useState<Client[]>([]);


    useEffect(() => {
        axios.get(`/api/clients`)
            .then(response => setClients(response.data));
        // response.data contains the parsed JSON from the API.
        // setUsers(data) updates the React state with that JSON and stores it in state so you can access it.
    }, []);

    const handleDelete = async (serviceId: number) => {
            if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
                try {
                    await axios.delete(`/api/services/${serviceId}`);

                    setClients(clients.map(client => ({
                        ...client,
                        pets: client.pets.map(pet => ({
                            ...pet,
                            services: pet.services.filter(s => s.id !== serviceId)
                        }))
                    })));

                    alert("¡Eliminado con éxito!");
                } catch {
                    alert("Hubo un error al eliminar el registro");
                }
            }
        };

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
              <th>ServiceID </th>
                    <th>Editar</th>
                    <th>Borrar</th>
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
                                    <td className="text-lg font-semibold">{service.id}</td>
                                    <td className="text-lg font-semibold">
                                      <button onClick={() => alert("Editar")}
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-1 ">Editar</button>
                                    </td>
                                    <td className="text-lg font-semibold">
                                      <button onClick={() => handleDelete(service.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded">Borrar</button>
                                    </td>

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

export default TestGet
