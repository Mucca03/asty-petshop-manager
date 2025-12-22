import {createClient} from "../services/index.ts";
import {useRef} from "react";

const TestPost = () => {
    const nameClient = useRef<HTMLInputElement>(null); // Create a ref for an input
    const phoneClient = useRef<HTMLInputElement>(null); // Create a ref for an input

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        createClient(
            nameClient.current?.value || "",
            phoneClient.current?.value || ""
        );
        /*console.log('Nombre clientee: ', nameClient.current?.value,
            'Telefono cliente: ', phoneClient.current?.value);*/
    };

    return (
        <div>
            <input ref={nameClient} type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre"/>
            <input ref={phoneClient} type="text" id="telefono" name="telefono" placeholder="Escribe tu telefono"/>
            <button onClick={(e) => handleSubmit(e)}>
                Add User
            </button>
        </div>
    )
}
export default TestPost
