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

export enum State {
  Alabama = "AL",
  Alaska = "AK",
  Arizona = "AZ",
  Arkansas = "AR",
  California = "CA",
  Colorado = "CO",
  Connecticut = "CT",
  Delaware = "DE",
  Florida = "FL",
  Georgia = "GA",
  Hawaii = "HI",
  Idaho = "ID",
  Illinois = "IL",
  Indiana = "IN",
  Iowa = "IA",
  Kansas = "KS",
  Kentucky = "KY",
  Louisiana = "LA",
  Maine = "ME",
  Maryland = "MD",
  Massachusetts = "MA",
  Michigan = "MI",
  Minnesota = "MN",
  Mississippi = "MS",
  Missouri = "MO",
  Montana = "MT",
  Nebraska = "NE",
  Nevada = "NV",
  NewHampshire = "NH",
  NewJersey = "NJ",
  NewMexico = "NM",
  NewYork = "NY",
  NorthCarolina = "NC",
  NorthDakota = "ND",
  Ohio = "OH",
  Oklahoma = "OK",
  Oregon = "OR",
  Pennsylvania = "PA",
  RhodeIsland = "RI",
  SouthCarolina = "SC",
  SouthDakota = "SD",
  Tennessee = "TN",
  Texas = "TX",
  Utah = "UT",
  Vermont = "VT",
  Virginia = "VA",
  Washington = "WA",
  WestVirginia = "WV",
  Wisconsin = "WI",
  Wyoming = "WY",
  Other = "Other",
}
/* eslint-enable no-unused-vars */

export interface Company {
  _id: string;
  name: string;
  city?: string;
  state?: State;
  logoKey?: string;
  employees?: NumEmployees;
  industry?: IndustryType;
  url?: string;
  logo?: string;
}

export interface CompanyJSON {
  _id: string;
  name: string;
  city?: string;
  state?: State;
  logoKey?: string;
  employees?: NumEmployees;
  industry?: IndustryType;
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
  state?: State;
  employees?: NumEmployees;
  industry?: IndustryType;
  url?: string;
  logo?: File;
}

export interface UpdateCompanyRequest {
  name?: string;
  city?: string;
  state?: State;
  employees?: NumEmployees;
  industry?: IndustryType;
  url?: string;
  logo?: File;
}
