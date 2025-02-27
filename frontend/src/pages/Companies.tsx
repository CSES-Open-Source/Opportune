import React from "react";
import SearchBar from "../components/SearchBar";
import DataList from "../components/DataList";
import CompanyTile from "../components/CompanyTile";
import { CompanyPage } from "../types/Company";

const sampleCompanies: CompanyPage[] = [
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
  {
    _id: "3",
    name: "Netflix",
    city: "Los Gatos",
    state: "CA",
    employees: "12k+",
    industry: "Entertainment",
    url: "https://www.netflix.com",
  },
  {
    _id: "4",
    name: "Amazon",
    city: "Seattle",
    state: "WA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    employees: "1.5M+",
    industry: "E-commerce",
    url: "https://www.amazon.com",
  },
  {
    _id: "5",
    name: "Meta",
    city: "Menlo Park",
    state: "CA",
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-meta-logo-icon-download-in-svg-png-gif-file-formats--messenger-chatting-social-media-pack-logos-icons-5582655.png",
    industry: "Social Media",
    url: "https://about.meta.com",
  },
  {
    _id: "7",
    name: "Tesla",
    city: "Austin",
    state: "TX",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    employees: "127k+",
    industry: "Automotive",
    url: "https://www.tesla.com",
  },
  {
    _id: "6",
    name: "Microsoft",
    city: "Redmond",
    state: "WA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    employees: "220k+",
    industry: "Software",
    url: "https://www.microsoft.com",
  },
  {
    _id: "8",
    name: "GitHub",
    city: "San Francisco",
    state: "CA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    employees: "2k+",
    industry: "Software Development",
    url: "https://www.github.com",
  },
  {
    _id: "9",
    name: "Adobe",
    city: "San Jose",
    state: "CA",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwOg7gTWZyeood7eZeaJGPk1sljXfddkROA&s",
    employees: "30k+",
    industry: "Software",
    url: "https://www.adobe.com",
  },
  {
    _id: "10",
    name: "Salesforce",
    city: "San Francisco",
    state: "CA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png",
    employees: "70k+",
    industry: "Cloud Computing",
    url: "https://www.salesforce.com",
  },
];

const Companies: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Companies</h1>
        <SearchBar
          selections={[
            {
              label: "Employees",
              options: [
                "1-10",
                "11-50",
                "51-200",
                "201-500",
                "501-1000",
                "1001+",
              ],
            },
            {
              label: "Industry",
              options: [
                "Tech",
                "Finance",
                "Healthcare",
                "Retail",
                "Software",
                "Consumer Electronics",
              ],
            },
          ]}
        />
        {/* dataList container with paginator at the bottom */}
        <div className="mt-4 h-[75vh] flex flex-col">
          <DataList
            TileComponent={CompanyTile}
            data={sampleCompanies}
            usePagination={true}
            paginatorContent={{ setPerPage: true, goToPage: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default Companies;
