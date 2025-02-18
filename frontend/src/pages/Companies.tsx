import React from "react";
import SearchBar from "../components/SearchBar";
import DataList from "../components/DataList";
import CompanyTile from "../components/CompanyTile";

interface Company {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  logoKey?: string;
  logo?: string;
  employees?: string;
  industry?: string;
  url?: string;
}

const sampleCompanies: Company[] = [
  {
    _id: "1",
    name: "Google",
    city: "Mountain View",
    state: "CA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    employees: "100k+",
    industry: "Tech",
    url: "https://www.google.com",
  },
  {
    _id: "2",
    name: "Apple",
    city: "Cupertino",
    state: "CA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    employees: "100k+",
    industry: "Consumer Electronics",
    url: "https://www.apple.com",
  },

];

const Companies: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Companies</h1>

        <SearchBar
          selections={[
            {
              label: "Employees",
              options: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001+"],
            },
            {
              label: "Industry",
              options: ["Tech", "Finance", "Healthcare", "Retail", "Software", "Consumer Electronics"],
            },
          ]}
        />

        <div className="mt-8">
          <DataList
            TileComponent={CompanyTile}
            data={sampleCompanies}
            listStyle={{ height: "72vh" }}
            usePagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Companies;
