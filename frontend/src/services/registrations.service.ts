import axios from "axios";
import type {ClientDetail} from "../types/ClientDetail.ts";

export interface RegistrationInput {
    client: {
        name: string;
        phone: string;
    };
    pet: {
        name: string;
        raza: string;
        edad: string;
    };
    service: {
        service_type: string;
        details: string;
        price: number;
        paid_amount: number;
        status?: string;
    };
}

/**
 * Creates the client, pet and first service in one request. The backend uses a
 * nested Prisma write, so either all three records exist or none do.
 */
const createRegistration = async (input: RegistrationInput): Promise<ClientDetail> => {
    const {data} = await axios.post<ClientDetail>('/api/registrations', input);

    return data;
};

export {createRegistration};
