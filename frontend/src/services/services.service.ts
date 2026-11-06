import axios from "axios";
import type {Service} from "../types/Service.ts";

const createService = async (service: string, details: string,
                         price: number, paid:number, status:string,
                         petId: number):Promise<Service> => {
    const {data} = await axios.post('/api/services', {
        service_type: service,
        details: details,
        price: price.toFixed(2),
        paid_amount: paid.toFixed(2),
        status: status,
        pet_id: petId
    });
    console.log('Service added:', data);

    return data
};

const updateServiceStatus = async (serviceId: number, status: string, paidAmount?: number): Promise<Service> => {
    const {data} = await axios.patch(`/api/services/${serviceId}/status`, {
        status: status,
        ...(paidAmount !== undefined ? { paid_amount: paidAmount } : {}),
    });

    return data;
};

export {createService, updateServiceStatus};
