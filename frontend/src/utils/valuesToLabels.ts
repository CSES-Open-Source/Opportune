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
