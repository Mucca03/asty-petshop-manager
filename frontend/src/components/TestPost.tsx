import {createClient, createPet, createService} from "../services/index.ts";
import {useRef} from "react";

const TestPost = () => {


    const nameClient = useRef<HTMLInputElement>(null); // Create a ref for an input
    const phoneClient = useRef<HTMLInputElement>(null); // Create a ref for an input
    const namePet = useRef<HTMLInputElement>(null); // Create a ref for an input
    const breedPet = useRef<HTMLInputElement>(null); // Create a ref for an input
    const serviceType = useRef<HTMLInputElement>(null); // Create a ref for an input
    const details = useRef<HTMLInputElement>(null); // Create a ref for an input
    const price = useRef<HTMLInputElement>(null); // Create a ref for an input
    const paidAmount = useRef<HTMLInputElement>(null); // Create a ref for an input
    const status = useRef<HTMLInputElement>(null); // Create a ref for an input

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const client = await createClient(
            nameClient.current?.value || "",
            phoneClient.current?.value || ""
        );

        const pet = await createPet(
            namePet.current?.value || "",
            breedPet.current?.value || "",
            client.id
        )

        await createService(
            serviceType.current?.value || "",
            details.current?.value || "",
            price.current?.valueAsNumber  || 0,
            paidAmount.current?.valueAsNumber || 0,
            status.current?.value || "",
            pet.id
        )

    };

    return (
        <div>
            <p>Nombre cliente</p>
            <input ref={nameClient} type="text" id="nombre" name="nombre"
                   placeholder="Escribe tu nombre"/>
            <p>Telefono cliente</p>
            <input ref={phoneClient} type="text" id="telefono" name="telefono"
                   placeholder="Escribe tu telefono"/>
            <p>Nombre mascota</p>
            <input ref={namePet} type="text" id="nombrePet" name="nombrePet"
                   placeholder="Escribe el nombre de la mascota"/>
            <p>Raza mascota</p>
            <input ref={breedPet} type="text" id="razaPet" name="razaPet"
                   placeholder="Escribe la raza de la mascota"/>
            <p>Tipo de servicio</p>
            <input ref={serviceType} type="text" id="serviceType" name="serviceType"
                   placeholder="Tipo de servicio"/>
            <p>Detalles</p>
            <input ref={details} type="text" id="details" name="details"
                   placeholder="Escribe los Detalles"/>
            <p>Price</p>
            <input ref={price} type="text" id="price" name="price"
                   placeholder="Escribe el precio"/>
            <p>Cantidad pagada</p>
            <input ref={paidAmount} type="text" id="paidAmount" name="paidAmount"
                   placeholder="Escribe la cantidad pagada"/>
            <p>Estado</p>
            <input ref={status} type="text" id="status" name="status"
                   placeholder="Estado"/>
            <br/>
            <button onClick={(e) => handleSubmit(e)}>
                Add User</button>
        </div>
    )
}
export default TestPost
