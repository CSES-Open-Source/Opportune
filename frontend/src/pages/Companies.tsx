import React, { useCallback } from "react";
import SearchBar from "../components/SearchBar";
import DataList from "../components/DataList";
import CompanyTile from "../components/CompanyTile";
import { CompanyPage } from "../types/Company";
import { getCompanies } from "../api/companies";
import { APIResult } from "../api/requests";
import { PaginatedData } from "../types/PaginatedData";

const Companies: React.FC = () => {
  const fetchCompanies = useCallback(
    (page: number, perPage: number) =>
      getCompanies({ page, perPage }).then(
        (res: APIResult<PaginatedData<CompanyPage>>) =>
          res.success
            ? { page, perPage, total: res.data.total, data: res.data.data }
            : { page, perPage, total: 0, data: [] }
      ),
    []
  );

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

        {/* pagination*/}
        <div className="mt-4 h-[75vh]">
          <DataList<CompanyPage>
            fetchData={fetchCompanies}
            useServerPagination
            TileComponent={CompanyTile}
            paginatorContent={{ setPerPage: true, goToPage: true }}
            listClassName="flex-1 overflow-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Companies;
