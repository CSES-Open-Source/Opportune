export interface Company {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  logoKey?: string;
  employees?: string;
  industry?: string;
  url?: string;
  logo?: string;
}

export interface CompanyJSON {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  logoKey?: string;
  employees?: string;
  industry?: string;
  url?: string;
  logo?: string;
}

export interface CompanyQuery {
  page?: number;
  perPage?: number;
  query?: string;
  state?: string;
  industry?: string;
  employees?: string;
}

export interface CreateCompanyRequest {
  name: string;
  city?: string;
  state?: string;
  employees?: string;
  industry?: string;
  url?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  city?: string;
  state?: string;
  employees?: string;
  industry?: string;
  url?: string;
}
