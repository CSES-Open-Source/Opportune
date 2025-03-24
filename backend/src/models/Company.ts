import { InferSchemaType, Schema, model } from "mongoose";
import { URL } from "url";

/* eslint-disable no-unused-vars */
export enum IndustryType {
  AERO_DEF = "Aerospace & Defense",
  AUTO = "Automotive",
  BANK_FINANCESERV = "Banking & Financial Services",
  BIOTECH_PHARM = "Biotech & Pharmaceuticals",
  CONSGOODS = "Consumer Goods",
  CYBERSEC = "Cybersecurity",
  ECOMM = "E-commerce",
  ENERGY_UTIL = "Energy & Utilities",
  ENT_MEDIA = "Entertainment & Media",
  HEALTH_MEDDEVICES = "Health & Medical Devices",
  ITSERV_CONSULT = "IT Services & Consulting",
  MANUF_INDUST = "Manufacturing & Industrial",
  NET_TELECOMM = "Networking & Telecommunications",
  REALEST_CONSTRUCT = "Real Estate & Construction",
  RETAIL = "Retail",
  SOFTDEV = "Software Development",
  TECH_HARDWARE = "Tech & Hardware",
  TRANSPORT_LOGISTIC = "Transportation & Logistics",
  VENCAP_PRIVEQUITY = "Venture Capital & Private Equity",
  WEB_DIGITALSERV = "Web & Digital Services",
  OTHER = "Other",
}

export enum NumEmployees {
  SMALL = "1-10",
  MIDSIZE = "11-50",
  LARGE = "51-200",
  LARGEPLUS = "201-500",
  ENTERPRISE = "501-1000",
  ENTERPRISEPLUS = "1001-5000",
  GLOBAL = "5001-10000",
  GLOBALPLUS = "10001+",
}
/* eslint-enable no-unused-vars */

const companySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: false,
    },
    state: {
      type: String,
      trim: true,
      required: false,
    },
    logoKey: {
      type: String,
      trim: true,
      required: false,
      default: null,
    },
    employees: {
      type: String,
      trim: true,
      enum: Object.values(NumEmployees),
      required: false,
    },
    industry: {
      type: String,
      trim: true,
      enum: Object.values(IndustryType),
      required: false,
    },
    url: {
      type: String,
      trim: true,
      required: false,
    },
  },
  {
    // Ensure virtuals are included in JSON and Object conversions
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

type Company = InferSchemaType<typeof companySchema>;

const AWS_BUCKET_URL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

companySchema.virtual("logo").get(function () {
  if (this.logoKey) {
    return new URL(this.logoKey, AWS_BUCKET_URL).href;
  }
  return null;
});

const generateLogoUrl = async (doc: Company) => {
  if (doc.logoKey) {
    return new URL(doc.logoKey, AWS_BUCKET_URL).href;
  }
};

companySchema.post("find", async function (docs) {
  for (const doc of docs) {
    await generateLogoUrl(doc);
  }
});

companySchema.post("findOne", async function (doc) {
  if (doc) {
    await generateLogoUrl(doc);
  }
});

export default model<Company>("Company", companySchema);
