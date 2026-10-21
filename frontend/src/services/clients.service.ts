import axios from "axios";
import type {Client} from "../types/Client.ts";
import type {ClientDetail} from "../types/ClientDetail.ts";

const createClient = async (name: string, phone: string)
    : Promise<Client> => {

        const {data} = await axios.post('/api/clients',
            {
                name: name,
                phones: [
                    phone
                ]
            });
        console.log('User added:', data);

        return data;
};

const getClients = async (): Promise<ClientDetail[]> => {
    const {data} = await axios.get<ClientDetail[]>('/api/clients');
    return data;
};

const getClient = async () => {
    axios.get(`/api/clients`)
        .then(response => {console.log(response.data)})
        .catch(error => {console.log(error)})
};


export {createClient, getClients, getClient};