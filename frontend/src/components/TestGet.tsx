import {getClient} from "../services/index.ts";

const TestGet = () => {


    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        getClient();
    };

    return (
        <>
        <button onClick={(e) => handleSubmit(e)}>
            Get User
        </button>

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
                </tbody>
            </table>
        </>
    )

}

export default TestGet
