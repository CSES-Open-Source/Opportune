import { InferSchemaType, Schema, model } from "mongoose";
import { URL } from "url";

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
