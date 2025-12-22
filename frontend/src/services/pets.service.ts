import axios from "axios";
import type {Pets} from "../types/Pets.ts";

const createPet = async (name: string, raza: string, clientId: number)
    :Promise<Pets>=> {
        const {data} = await axios.post('/api/pets', {
            name: name,
            raza: raza,
            id: clientId
        });
        console.log('Pet added:', data.data);
        return data
};

export {createPet};