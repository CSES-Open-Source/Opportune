import React, { useCallback, useState, useEffect } from "react";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";
import DataList from "../components/DataList";
import CompanyRow from "../components/CompanyTile";
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

  // “applied” filters & search
  const [filters, setFilters] = useState({
    query: "",
    employees: "",
    industry: "",
  });
  // debounce search‐as‐you‐type (500ms)
  useEffect(() => {
    // TODO: Temporary solution to prevent refetching when the page is loaded.
    if (initialized) {
      const handle = setTimeout(() => {
        setFilters((f) => ({ ...f, query }));
      }, 500);
      return () => clearTimeout(handle);
    } else {
      setInitialized(true);
    }
  }, [query]);

  // filter modal toggle
  const [showFilters, setShowFilters] = useState(false);

  // apply filters from modal
  const applyFilters = () => {
    setFilters({
      query,
      employees: employeesInput,
      industry: industryInput,
    });
    setShowFilters(false);
  };

  // fetcher (no spinner logic - looked cleaner in my opinion)
  const fetchCompanies = useCallback(
    (page: number, perPage: number) =>
      apiGetCompanies({
        page,
        perPage,
        query: filters.query,
        employees: filters.employees,
        industry: filters.industry,
      }).then((res: APIResult<PaginatedData<Company>>) =>
        res.success
          ? { page, perPage, total: res.data.total, data: res.data.data }
          : { page, perPage, total: 0, data: [] },
      ),
    [filters],
  );

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Companies Directory</h1>

        {/*  search + filter bar  */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 flex items-center space-x-4">
          <div className="relative flex-1 min-w-0">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search companies..."
              className="
                w-full border border-gray-300 rounded-full
                py-2 pl-12 pr-4 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition
              "
            />
          </div>

          {/* collapse to icon only on small, and shrink icon slightly */}
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center px-2 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
          >
            <FaSlidersH className="w-4 h-4 sm:w-5 sm:h-5 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
        {/*  filter modal */}
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
                    className="
                      block w-full bg-gray-50 border border-gray-200
                      rounded-lg py-2 px-3 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition
                    "
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
                    className="
                      block w-full bg-gray-50 border border-gray-200
                      rounded-lg py-2 px-3 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition
                    "
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

        {/* ==== Results ==== */}
        <div className="overflow-visible">
          <div className="flex flex-col h-[75vh]">
            <DataList<Company>
              key={`${filters.query}_${filters.employees}_${filters.industry}`}
              fetchData={fetchCompanies}
              useServerPagination
              listStyle={{}}
              listClassName="space-y-2"
              TileComponent={CompanyRow}
              paginatorContent={{ setPerPage: true, goToPage: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
