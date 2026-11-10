import type {ClientDetail, ClientPhone, PetRecord, ServiceRecord} from "./ClientDetail.ts";

export interface ServiceRow {
    client: ClientDetail;
    phone: ClientPhone;
    pet: PetRecord;
    service: ServiceRecord;
}
