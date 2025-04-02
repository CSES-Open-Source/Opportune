/* eslint-disable no-unused-vars */
export enum IndustryType {
  AEROSPACEDEFENSE = "AERO_DEF",
  AUTOMOTIVE = "AUTO",
  BANKFINANCIALSERVICES = "BANK_FINANCESERV",
  BIOTECHPHARMACEUTICALS = "BIOTECH_PHARM",
  CONSUMERGOODS = "CONSGOODS",
  CYBERSECURITY = "CYBERSEC",
  ECOMMERCE = "ECOMM",
  ENERGYUTILITIES = "ENERGY_UTIL",
  ENTERTAINMENTMEDIA = "ENT_MEDIA",
  HEALTHMEDICALDEVICES = "HEALTH_MEDDEVICES",
  ITSERVCONSULTING = "ITSERV_CONSULT",
  MANUFACTURINGINDUSTRIAL = "MANUF_INDUST",
  NETWORKINGTELECOMM = "NET_TELECOMM",
  REALESTTATECONSTUCTION = "REALEST_CONSTRUCT",
  RETAIL = "RETAIL",
  SOFTWAREDEVELOPMENT = "SOFTDEV",
  TECHHARDWARE = "TECH_HARDWARE",
  TRANSPORTATIONLOGISTICS = "TRANSPORT_LOGISTIC",
  VENTURECAPITALPRIVATEEQUITY = "VENCAP_PRIVEQUITY",
  WEBDIGITALSERVICES = "WEB_DIGITALSERV",
  OTHERS = "OTHER",
}

export enum NumEmployees {
  S1_10 = "SMALL",
  S11_50 = "MIDSIZE",
  M51_200 = "LARGE",
  M201_500 = "LARGEPLUS",
  L501_1000 = "ENTERPRISE",
  L1001_5000 = "ENTERPRISEPLUS",
  ENT5001_10000 = "GLOBAL",
  ENT10001_PLUS = "GLOBALPLUS",
}
/* eslint-enable no-unused-vars */

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
