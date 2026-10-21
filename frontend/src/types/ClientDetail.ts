export interface ClientPhone {
    id: number;
    phone: string;
    client_id: number;
}

export interface ServiceRecord {
    id: number;
    service_type: string;
    details: string | null;
    price: number | string;
    paid_amount: number | string | null;
    status: string;
    date: string;
    pet_id: number;
}

export interface PetRecord {
    id: number;
    name: string;
    raza: string;
    client_id: number;
    created_at?: string | null;
    services: ServiceRecord[];
}

export interface ClientDetail {
    id: number;
    name: string;
    created_at?: string | null;
    client_phones: ClientPhone[];
    pets: PetRecord[];
}
