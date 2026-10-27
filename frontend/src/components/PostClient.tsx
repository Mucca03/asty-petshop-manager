import {createClient, createPet, createService} from "../services/index.ts";
import { useState } from 'react';

const TestPost = () => {
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
          try {
            const formData = new FormData(e.currentTarget);
            const value = (name: string) => String(formData.get(name) ?? "").trim();
            const numberValue = (name: string) => {
                const number = Number(formData.get(name));
                return Number.isFinite(number) ? number : 0;
            };

            const client = await createClient(value("nombre"), value("telefono"));
            const pet = await createPet(
                value("nombrePet"),
                value("razaPet"),
                client.id
            )
            await createService(
                value("serviceType"),
                value("details"),
                numberValue("price"),
                numberValue("paidAmount"),
                value("status"),
                pet.id
            )
            alert("¡Guardado!");
            setHasPaid(false);
          } catch (error) {
            alert(error);
          }
    };

  return (

    <div>
        <form onSubmit={handleSubmit}>

                <p>Nombre cliente</p>
                <input type="text" id="nombre" name="nombre"
                       placeholder="Escribe tu nombre"/>
                <p>Telefono cliente</p>
                <input type="number" id="telefono" name="telefono"
                       placeholder="Escribe tu telefono"/>
                <p>Nombre mascota</p>
                <input type="text" id="nombrePet" name="nombrePet"
                       placeholder="Escribe el nombre de la mascota"/>
                <p>Raza mascota</p>
                <input type="text" id="razaPet" name="razaPet"
                       placeholder="Escribe la raza de la mascota"/>
                <p>Tipo de servicio</p>

                <select id="serviceType" name="serviceType">
                  <option value="Baño">Baño</option>
                  <option value="Baño y corte">Baño y Corte</option>
                  <option value="Corte de uñas">Corte de uñas</option>
                </select>

                <p>Detalles</p>
                <input type="text" id="details" name="details"
                       placeholder="Escribe los Detalles"/>
                <p>Precio</p>
                <input type="number" min={0} id="price" name="price"
                       placeholder="Escribe el precio"/>
                <p>¿El cliente Abona?</p>
                <div>
                   <label>
                     <input type="checkbox" checked={hasPaid} onChange={(e) => setHasPaid(e.target.checked)}/>
                    </label>
                </div>
                {hasPaid && (
                <>
                  <p>Cantidad pagada</p>
                    <input type="number" min={0} id="paidAmount" name="paidAmount"
                       placeholder="Escribe la cantidad pagada"/>
                </>
                )}

                <p>Estado</p>
                <input type="text" id="status" name="status"
                  placeholder="Pendiente"  value="Pendiente" />
                <br/>
                <button type="submit">
                    Guardar registro
                </button>
            </form>
        </div>
    )
}
export default TestPost
