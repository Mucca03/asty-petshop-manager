export interface Service {
    id: number;
    service_type: string;
    details?: string;
    price: number;
    paid_amount?: number;
    status: string;
    pet_id: number;
    date: string;
}
