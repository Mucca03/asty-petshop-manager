import {createClient, createPet} from "../services/index.ts";
import {useRef} from "react";

const TestPost = () => {
    const nameClient = useRef<HTMLInputElement>(null); // Create a ref for an input
    const phoneClient = useRef<HTMLInputElement>(null); // Create a ref for an input
    const namePet = useRef<HTMLInputElement>(null); // Create a ref for an input
    const breedPet = useRef<HTMLInputElement>(null); // Create a ref for an input

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const client = await createClient(
            nameClient.current?.value || "",
            phoneClient.current?.value || ""
        );

        await createPet(
            namePet.current?.value || "",
            breedPet.current?.value || "",
            client.id
        )
    };

    return (
        <div>
            <p>Nombre cliente</p>
            <input ref={nameClient} type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre"/>
            <p>Telefono cliente</p>
            <input ref={phoneClient} type="text" id="telefono" name="telefono" placeholder="Escribe tu telefono"/>
            <p>Nombre mascota</p>
            <input ref={namePet} type="text" id="nombrePet" name="nombrePet" placeholder="Escribe el nombre de la mascota"/>
            <p>Raza mascota</p>
            <input ref={breedPet} type="text" id="razaPet" name="razaPet" placeholder="Escribe la raza de la mascota"/>

            <button onClick={(e) => handleSubmit(e)}>
                Add User
            </button>
        </div>
    )
}
export default TestPost
