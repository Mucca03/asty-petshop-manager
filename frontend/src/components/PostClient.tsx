import {createClient, createPet, createService} from "../services/index.ts";
import { useState } from 'react';

const TestPost = () => {
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [petAge, setPetAge] = useState<"Cachorro" | "Adulto">("Adulto");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setMessage(null);
        const form = e.currentTarget;
          try {
            const formData = new FormData(form);
            const value = (name: string) => String(formData.get(name) ?? "").trim();
            const numberValue = (name: string) => {
                const number = Number(formData.get(name));
                return Number.isFinite(number) ? number : 0;
            };
            const price = numberValue("price");
            const paidAmount = hasPaid ? numberValue("paidAmount") : 0;

            if (hasPaid && paidAmount > price) {
                setMessage({type: "error", text: "La cantidad pagada no puede ser mayor al precio"});
                return;
            }

            const client = await createClient(value("nombre"), value("telefono"));
            const pet = await createPet(
                value("nombrePet"),
                value("razaPet"),
                petAge,
                client.id
            )
            await createService(
                value("serviceType"),
                value("details"),
                price,
                paidAmount,
                value("status"),
                pet.id
            )
            setMessage({type: "success", text: "¡Guardado!"});
            form.reset();
            setHasPaid(false);
            setPetAge("Adulto");
          } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Ocurrió un error al guardar el registro",
            });
          }
    };

  return (

    <div>
        <form onSubmit={handleSubmit}>

                {message && (
                  <div
                    className={`message-banner message-banner-${message.type}`}
                    role={message.type === "error" ? "alert" : "status"}
                  >
                    {message.text}
                  </div>
                )}

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
                <p>Edad mascota</p>
                <select
                  id="edadPet"
                  name="edadPet"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value as "Cachorro" | "Adulto")}
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Adulto">Adulto</option>
                </select>
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
                  placeholder="Pendiente" value="Pendiente" readOnly />
                <br/>
                <button type="submit">
                    Guardar registro
                </button>
            </form>
        </div>
    )
}
export default TestPost
