import { Status } from "../types/Application";
import { IndustryType, NumEmployees } from "../types/Company";

const industryLabelMap = {
  AERO_DEF: "Aerospace & Defense",
  AUTO: "Automotive",
  BANK_FINANCESERV: "Banking & Financial Services",
  BIOTECH_PHARM: "Biotech & Pharmaceuticals",
  CONSGOODS: "Consumer Goods",
  CYBERSEC: "Cybersecurity",
  ECOMM: "E-commerce",
  ENERGY_UTIL: "Energy & Utilities",
  ENT_MEDIA: "Entertainment & Media",
  HEALTH_MEDDEVICES: "Health & Medical Devices",
  ITSERV_CONSULT: "IT Services & Consulting",
  MANUF_INDUST: "Manufacturing & Industrial",
  NET_TELECOMM: "Networking & Telecommunications",
  REALEST_CONSTRUCT: "Real Estate & Construction",
  RETAIL: "Retail",
  SOFTDEV: "Software Development",
  TECH_HARDWARE: "Technology Hardware",
  TRANSPORT_LOGISTIC: "Transportation & Logistics",
  VENCAP_PRIVEQUITY: "Venture Capital & Private Equity",
  WEB_DIGITALSERV: "Web & Digital Services",
  OTHER: "Other",
};

export const INDUSTRY_COLOR_MAP: { [K in IndustryType]: string } = {
  [IndustryType.AEROSPACEDEFENSE]:      "bg-sky-100    text-sky-900",
  [IndustryType.AUTOMOTIVE]:             "bg-red-100    text-red-900",
  [IndustryType.BANKFINANCIALSERVICES]:  "bg-green-100  text-green-900",
  [IndustryType.BIOTECHPHARMACEUTICALS]: "bg-emerald-100 text-emerald-900",
  [IndustryType.CONSUMERGOODS]:          "bg-orange-100 text-orange-900",
  [IndustryType.CYBERSECURITY]:          "bg-teal-100   text-teal-900",
  [IndustryType.ECOMMERCE]:              "bg-violet-100 text-violet-900",
  [IndustryType.ENERGYUTILITIES]:        "bg-yellow-100 text-yellow-900",
  [IndustryType.ENTERTAINMENTMEDIA]:     "bg-pink-100   text-pink-900",
  [IndustryType.HEALTHMEDICALDEVICES]:   "bg-rose-100   text-rose-900",
  [IndustryType.ITSERVCONSULTING]:       "bg-blue-100   text-blue-900",
  [IndustryType.MANUFACTURINGINDUSTRIAL]:"bg-slate-100  text-slate-900",
  [IndustryType.NETWORKINGTELECOMM]:     "bg-cyan-100   text-cyan-900",
  [IndustryType.REALESTTATECONSTUCTION]: "bg-lime-100   text-lime-900",
  [IndustryType.RETAIL]:                 "bg-fuchsia-100 text-fuchsia-900",
  [IndustryType.SOFTWAREDEVELOPMENT]:    "bg-indigo-100 text-indigo-900",
  [IndustryType.TECHHARDWARE]:           "bg-stone-100  text-stone-900",
  [IndustryType.TRANSPORTATIONLOGISTICS]:"bg-amber-100  text-amber-900",
  [IndustryType.VENTURECAPITALPRIVATEEQUITY]:"bg-amber-200 text-amber-900",
  [IndustryType.WEBDIGITALSERVICES]:     "bg-zinc-200   text-zinc-900",
  [IndustryType.OTHERS]:                 "bg-gray-300   text-gray-900",
};

const employeesLabelMap = {
  SMALL: "1-10 employees",
  MIDSIZE: "11-50 employees",
  LARGE: "51-200 employees",
  LARGEPLUS: "201-500 employees",
  ENTERPRISE: "501-1,000 employees",
  ENTERPRISEPLUS: "1,001-5,000 employees",
  GLOBAL: "5,001-10,000 employees",
  GLOBALPLUS: "10,001+ employees",
};

const applicationStatusLabelMap = {
  APPLIED: "Applied",
  OA: "OA",
  PHONE: "Phone",
  FINAL: "Final",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export const getIndustryLabel = (value: string): string => {
  return industryLabelMap[value as IndustryType] || "Other";
};

export const getEmployeesLabel = (value: string): string => {
  return employeesLabelMap[value as NumEmployees] || "1-10 employees";
};

export const getApplicationStatusLabel = (value: string): string => {
  return applicationStatusLabelMap[value as Status] || "None";
};