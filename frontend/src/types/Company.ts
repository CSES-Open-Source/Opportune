export interface Company {
  _id: string;
  name: string;
  city?: string;
  state?: string;
}

export interface CompanyJSON {
  _id: string;
  name: string;
  city?: string;
  state?: string;
}

export interface CompanyQuery {
  page?: number;
  perPage?: number;
  query?: string;
  state?: string;
}

export interface CreateCompanyRequest {
  name: string;
  city?: string;
  state?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  city?: string;
  state?: string;
}

export interface CompanyPage {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  logo?: string;
  logoKey?: string;
  employees?: string;
  industry?: string;
  url?: string;
}
