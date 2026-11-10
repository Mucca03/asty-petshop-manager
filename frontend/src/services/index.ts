import {createClient, getClient, getClients} from "./clients.service.ts";
import {createPet} from "./pets.service.ts";
import {createService, deleteService, updateServiceStatus} from "./services.service.ts"
import {createRegistration} from "./registrations.service.ts"

export {
    getClient,
    getClients,
    createClient,
    createPet,
    createService,
    createRegistration,
    deleteService,
    updateServiceStatus,
}
