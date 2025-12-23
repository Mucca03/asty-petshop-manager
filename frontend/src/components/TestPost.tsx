import {createClient, createPet, createService} from "../services/index.ts";
import {useRef} from "react";

const TestPost = () => {

    const refs = {
        nameClient: useRef<HTMLInputElement>(null),
        phoneClient: useRef<HTMLInputElement>(null),
        namePet: useRef<HTMLInputElement>(null),
        breedPet: useRef<HTMLInputElement>(null),
        serviceType: useRef<HTMLInputElement>(null),
        details: useRef<HTMLInputElement>(null),
        price: useRef<HTMLInputElement>(null),
        paidAmount: useRef<HTMLInputElement>(null),
        status: useRef<HTMLInputElement>(null),
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const client = await createClient(
            refs.nameClient.current?.value || "",
            refs.phoneClient.current?.value || ""
        );
        const pet = await createPet(
            refs.namePet.current?.value || "",
            refs.breedPet.current?.value || "",
            client.id
        )
        await createService(
            refs.serviceType.current?.value || "",
            refs.details.current?.value || "",
            refs.price.current?.valueAsNumber  || 0,
            refs.paidAmount.current?.valueAsNumber || 0,
            refs.status.current?.value || "",
            pet.id
        )
    };

    return (
        <div>
            <form>
                <p>Nombre cliente</p>
                <input ref={refs.nameClient} type="text" id="nombre" name="nombre"
                       placeholder="Escribe tu nombre"/>
                <p>Telefono cliente</p>
                <input ref={refs.phoneClient} type="text" id="telefono" name="telefono"
                       placeholder="Escribe tu telefono"/>
                <p>Nombre mascota</p>
                <input ref={refs.namePet} type="text" id="nombrePet" name="nombrePet"
                       placeholder="Escribe el nombre de la mascota"/>
                <p>Raza mascota</p>
                <input ref={refs.breedPet} type="text" id="razaPet" name="razaPet"
                       placeholder="Escribe la raza de la mascota"/>
                <p>Tipo de servicio</p>
                <input ref={refs.serviceType} type="text" id="serviceType" name="serviceType"
                       placeholder="Tipo de servicio"/>
                <p>Detalles</p>
                <input ref={refs.details} type="text" id="details" name="details"
                       placeholder="Escribe los Detalles"/>
                <p>Price</p>
                <input ref={refs.price} type="number" min={0} id="price" name="price"
                       placeholder="Escribe el precio"/>
                <p>Cantidad pagada</p>
                <input ref={refs.paidAmount} type="number" min={0} id="paidAmount" name="paidAmount"
                       placeholder="Escribe la cantidad pagada"/>
                <p>Estado</p>
                <input ref={refs.status} type="text" id="status" name="status"
                       placeholder="Estado"/>
                <br/>
                <button onClick={(e) => handleSubmit(e)}>
                    Add User</button>
            </form>
        </div>
    )
}
export default TestPost
