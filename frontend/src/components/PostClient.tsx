import { useState } from 'react';
import { createRegistration } from "../services/index.ts";
import { getErrorMessage } from "../utils/errors.ts";
import { useAsyncAction } from "../hooks/useAsyncAction.ts";

const TestPost = () => {
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [petAge, setPetAge] = useState<"Cachorro" | "Adulto">("Adulto");
  const [validationError, setValidationError] = useState<string | null>(null);
  const registration = useAsyncAction(createRegistration, {
    errorMessage: "Ocurrió un error al guardar el registro",
  });

  const actionMessage = registration.state.status === "success"
    ? { type: "success" as const, text: "¡Guardado!" }
    : registration.state.status === "error"
      ? { type: "error" as const, text: registration.state.error }
      : null;
  const message = validationError
    ? { type: "error" as const, text: validationError }
    : actionMessage;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setValidationError(null);

        if (registration.isPending) {
          return;
        }

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

            const requiredFields: Array<[string, string]> = [
              ["nombre", "El nombre del cliente es obligatorio"],
              ["telefono", "El teléfono del cliente es obligatorio"],
              ["nombrePet", "El nombre de la mascota es obligatorio"],
              ["razaPet", "La raza de la mascota es obligatoria"],
              ["serviceType", "El tipo de servicio es obligatorio"],
            ];

            const missingField = requiredFields.find(([name]) => value(name).length === 0);

            if (missingField) {
                setValidationError(missingField[1]);
                return;
            }

            if (price <= 0) {
                setValidationError("El precio debe ser mayor a 0");
                return;
            }

            if (paidAmount < 0) {
                setValidationError("La cantidad pagada no puede ser negativa");
                return;
            }

            if (hasPaid && paidAmount > price) {
                setValidationError("La cantidad pagada no puede ser mayor al precio");
                return;
            }

            const created = await registration.run({
                client: {
                    name: value("nombre"),
                    phone: value("telefono"),
                },
                pet: {
                    name: value("nombrePet"),
                    raza: value("razaPet"),
                    edad: petAge,
                },
                service: {
                    service_type: value("serviceType"),
                    details: value("details"),
                    price,
                    paid_amount: paidAmount,
                },
            });

            if (!created) {
                return;
            }

            form.reset();
            setHasPaid(false);
            setPetAge("Adulto");
        } catch (error) {
            setValidationError(getErrorMessage(error, "Ocurrió un error al guardar el registro"));
        }
    };

  return (

    <div>
        <form onSubmit={handleSubmit} aria-busy={registration.isPending}>

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
                       placeholder="Escribe tu nombre" required/>
                <p>Telefono cliente</p>
                <input type="number" id="telefono" name="telefono"
                       placeholder="Escribe tu telefono" required/>
                <p>Nombre mascota</p>
                <input type="text" id="nombrePet" name="nombrePet"
                       placeholder="Escribe el nombre de la mascota" required/>
                <p>Raza mascota</p>
                <input type="text" id="razaPet" name="razaPet"
                       placeholder="Escribe la raza de la mascota" required/>
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

                <select id="serviceType" name="serviceType" required>
                  <option value="Baño">Baño</option>
                  <option value="Baño y corte">Baño y Corte</option>
                  <option value="Corte de uñas">Corte de uñas</option>
                </select>

                <p>Detalles</p>
                <input type="text" id="details" name="details"
                       placeholder="Escribe los Detalles"/>
                <p>Precio</p>
                <input type="number" min={0} id="price" name="price"
                       placeholder="Escribe el precio" required/>
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

                <p>Estado inicial</p>
                <p><span className="status-badge status-badge-warning">Pendiente</span></p>
                <br/>
                <button type="submit" disabled={registration.isPending}>
                    {registration.isPending ? "Guardando…" : "Guardar registro"}
                </button>
            </form>
        </div>
    )
}
export default TestPost;
