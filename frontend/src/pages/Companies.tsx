import React, { useCallback, useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaTimes } from "react-icons/fa";
import DataList from "../components/public/DataList";
import NewCompanyModal from "../components/company/CompanyModal";
import CompanyTile from "../components/company/CompanyTile";
import { getCompanies as apiGetCompanies } from "../api/companies";
import { APIResult } from "../api/requests";
import { PaginatedData } from "../types/PaginatedData";
import { getEmployeesLabel, getIndustryLabel } from "../utils/valuesToLabels";
import { NumEmployees, IndustryType, Company } from "../types/Company";

const Companies: React.FC = () => {
  const [query, setQuery] = useState("");
  const [employeesInput, setEmployeesInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [initialized, setInitialized] = useState(false);

  const [filters, setFilters] = useState({
    query: "",
    employees: "",
    industry: "",
  });

  // Debounce the text search
  useEffect(() => {
    // TODO: Temporary solution to prevent refetching when the page is loaded.
    if (!initialized) {
      setInitialized(true);
      return;
    }

    const handle = setTimeout(() => {
      setFilters((f) => ({ ...f, query }));
    }, 500);
    return () => clearTimeout(handle);

    // Temporary fix
    // eslint-disable-next-line
  }, [query]);

  // filter modal state
  const [showFilters, setShowFilters] = useState(false);
  const applyFilters = () => {
    setFilters({
      query,
      employees: employeesInput,
      industry: industryInput,
    });
    setShowFilters(false);
  };

  // Add Company Modal
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  const refreshFilters = () => {
    setFilters((f) => ({ ...f }));
  };

  const onSaveCompany = () => {
    setCompanyModalOpen(false);
    refreshFilters();
  };

  const fetchCompanies = useCallback(
    (page: number, perPage: number) =>
      apiGetCompanies({
        page,
        perPage,
        query: filters.query,
        employees: filters.employees as NumEmployees,
        industry: filters.industry as IndustryType,
      }).then((res: APIResult<PaginatedData<Company>>) =>
        res.success
          ? { page, perPage, total: res.data.total, data: res.data.data }
          : { page, perPage, total: 0, data: [] },
      ),
    [filters],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies Directory</h1>
          <p className="text-gray-600">Browse top tech companies and get insider insights</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md flex-1">
              <FaSearch className="ml-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies..."
                className="flex-1 p-3 text-base border-none outline-none"
              />
            </div>

            <button
              onClick={() => setCompanyModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
            >
              <span className="mr-2">Add</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            <button
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-base"
            >
              <span className="mr-2">Sort by</span>
              <FaChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* filter modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
            <div className="bg-white rounded-2xl w-96 p-6 relative shadow-lg">
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold mb-4">Filter Companies</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employees
                  </label>
                  <select
                    value={employeesInput}
                    onChange={(e) => setEmployeesInput(e.target.value)}
                    className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any</option>
                    {Object.values(NumEmployees).map((ind) => (
                      <option key={ind} value={ind}>
                        {getEmployeesLabel(ind)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any</option>
                    {Object.values(IndustryType).map((ind) => (
                      <option key={ind} value={ind}>
                        {getIndustryLabel(ind)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* company List */}
        <div className="overflow-visible">
          <div className="flex flex-col h-[75vh]">
            <DataList
              key={`${filters.query}_${filters.employees}_${filters.industry}`}
              fetchData={fetchCompanies}
              useServerPagination
              listStyle={{}}
              listClassName="space-y-2"
              paginatorContent={{ setPerPage: true, goToPage: true }}
              TileComponent={CompanyTile}
            />
          </div>
        </div>
      </div>

      {/* company modal */}
      <NewCompanyModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onCompanyChanged={onSaveCompany}
        company={null}
      />
    </div>
  );
};

export default Companies;
