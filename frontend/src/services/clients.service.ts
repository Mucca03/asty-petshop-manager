import axios from "axios";

const createClient = async (name: string, phone: string) => {
    try {
            const newUser = {
                name: name,
                phones: [
                    phone
                ]
            };
            const response = await axios.post('/api/clients', newUser);
            console.log('User added:', response.data);
        } catch (error) {
            console.error('Error adding user:', error);
    }
};

const getClient = async (id: number) => {
    axios.get(`/api/clients/${id}`)
        .then(response => {console.log(response.data)})
        .catch(error => {console.log(error)})
};


export {createClient, getClient};