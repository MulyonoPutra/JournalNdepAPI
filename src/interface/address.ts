export interface Address {
	street: string;
	villages: string;
	districts: string;
	regencies: string;
	provinces: string;
}

export interface Province {
	id: string;
	name: string;
}

export interface Regencies extends Province {
	province_id: string;
}

export interface Districts extends Province {
	regency_id: string;
}

export interface Villages extends Province {
	district_id: string;
}
