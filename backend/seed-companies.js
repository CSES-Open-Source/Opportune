/* eslint-disable */
const mongoose = require("mongoose");
require("dotenv").config();

// Import the Company model from source
const Company = require("./src/models/Company").default;

const sampleCompanies = [
  {
    name: "Google",
    city: "Mountain View",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.google.com",
  },
  {
    name: "Meta",
    city: "Menlo Park",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.meta.com",
  },
  {
    name: "Apple",
    city: "Cupertino",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.apple.com",
  },
  {
    name: "Microsoft",
    city: "Redmond",
    state: "Washington",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.microsoft.com",
  },
  {
    name: "Amazon",
    city: "Seattle",
    state: "Washington",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.amazon.com",
  },
  {
    name: "Netflix",
    city: "Los Gatos",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.netflix.com",
  },
  {
    name: "Tesla",
    city: "Austin",
    state: "Texas",
    employees: "LARGE",
    industry: "AUTO",
    url: "https://www.tesla.com",
  },
  {
    name: "Uber",
    city: "San Francisco",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.uber.com",
  },
  {
    name: "Airbnb",
    city: "San Francisco",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.airbnb.com",
  },
  {
    name: "Spotify",
    city: "New York",
    state: "New York",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.spotify.com",
  },
  {
    name: "Slack",
    city: "San Francisco",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.slack.com",
  },
  {
    name: "Zoom",
    city: "San Jose",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.zoom.us",
  },
  {
    name: "Salesforce",
    city: "San Francisco",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.salesforce.com",
  },
  {
    name: "Adobe",
    city: "San Jose",
    state: "California",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.adobe.com",
  },
  {
    name: "Oracle",
    city: "Austin",
    state: "Texas",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.oracle.com",
  },
  {
    name: "IBM",
    city: "Armonk",
    state: "New York",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.ibm.com",
  },
  {
    name: "Intel",
    city: "Santa Clara",
    state: "California",
    employees: "LARGE",
    industry: "TECH_HARDWARE",
    url: "https://www.intel.com",
  },
  {
    name: "NVIDIA",
    city: "Santa Clara",
    state: "California",
    employees: "LARGE",
    industry: "TECH_HARDWARE",
    url: "https://www.nvidia.com",
  },
  {
    name: "AMD",
    city: "Santa Clara",
    state: "California",
    employees: "LARGE",
    industry: "TECH_HARDWARE",
    url: "https://www.amd.com",
  },
  {
    name: "Palantir",
    city: "Denver",
    state: "Colorado",
    employees: "LARGE",
    industry: "SOFTDEV",
    url: "https://www.palantir.com",
  },
];

async function seedCompanies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing companies
    await Company.deleteMany({});
    console.log("Cleared existing companies");

    // Insert sample companies
    const insertedCompanies = await Company.insertMany(sampleCompanies);
    console.log(`Successfully inserted ${insertedCompanies.length} companies`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding companies:", error);
    process.exit(1);
  }
}

seedCompanies();
