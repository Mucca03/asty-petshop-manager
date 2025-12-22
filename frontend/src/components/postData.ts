import axios from "axios";

const postData = async () => {
    try {
            const newUser = {
                name: 'Miguelito',
                phones: [
                    "3155521",
                    "1255524"
                ]
            };
            const response = await axios.post('/api/clients', newUser);
            console.log('User added:', response.data);
        } catch (error) {
            console.error('Error adding user:', error);
    }
};

export default postData;