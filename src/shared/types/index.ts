export interface ICountry {
	uniqueId?: string;
	iso: string;
	iso3: string;
	flag: string;
	name: string;
	nicename: string;
	numcode: string;
	phonecode: string;
}

export interface IRegisterRequest {
	organization: Organization;
	admin: Admin;
}

interface Organization {
	name: string;
	contact_email: string;
	phone: string;
	country: string;
}

interface Admin {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
}
