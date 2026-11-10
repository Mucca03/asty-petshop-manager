export interface Service {
    id: number;
    service_type: string;
    details?: string | null;
    price: number | string;
    paid_amount?: number | string | null;
    status: string;
    pet_id: number;
    date: string;
}
