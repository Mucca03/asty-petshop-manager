import axios from "axios";

const getData = async (id: number) => {
    axios.get(`/api/clients/${id}`)
        .then(response => {console.log(response.data)})
        .catch(error => {console.log(error)})
};

export default getData;