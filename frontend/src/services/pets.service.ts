import axios from "axios";

const createPet = async (name: string, raza: string, id: number) => {
    try {
        const newUser = {
            name: name,
            raza: raza,
            client_id: id,
        };
        const response = await axios.post('/api/pets', newUser);
        console.log('User added:', response.data);
    } catch (error) {
        console.error('Error adding user:', error);
    }
};

export {createPet};