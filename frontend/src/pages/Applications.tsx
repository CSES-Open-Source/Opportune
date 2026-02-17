import { useCallback, useState } from "react";
import { getApplicationsByUserID } from "../api/applications";
import DataTable from "../components/public/DataTable";
import SearchBar from "../components/public/SearchBar";
import StatusBubble from "../components/public/StatusBubble";
import { statusColors } from "../constants/statusColors";
import { Application } from "../types/Application";
import { ColumnDef } from "../types/ColumnDef";
import { PaginatedData } from "../types/PaginatedData";
import { useAuth } from "../contexts/useAuth";
import NewApplicationModal from "../components/application/NewApplicationModal";
import ApplicationModal from "../components/application/ApplicationModal";
import { LuFileText, LuPlus, LuSearch } from "react-icons/lu";
import "../styles/Animations.css";

const defaultLogo = "/assets/defaultLogo.png";

const applicationColumns: ColumnDef<Application>[] = [
  {
    header: "Company",
    cell: (row) => {
      return (
        <div className="flex flex-row items-center gap-3">
          {/* Status bar accent */}
          <div
            className={`w-1 h-10 rounded-full flex-shrink-0 bg-opacity-80 ${
              statusColors[
                row.process && row.process.length > 0
                  ? row.process[row.process.length - 1].status
                  : ""
              ]
            }`}
          />
          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-[#1a1f2e] border border-[#2d3748] flex items-center justify-center flex-shrink-0">
            <img
              src={row.company.logo || defaultLogo}
              alt="Company Logo"
              className="w-5 h-5 object-contain rounded"
            />
          </div>
          <span className="min-w-0 flex-1 text-[#e8eaed] font-medium truncate pr-2">
            {row.company.name}
          </span>
        </div>
      );
    },
  },
  {
    header: "Position",
    key: "position",
  },
  {
    header: "Location",
    key: "location",
  },
  {
    header: "Link",
    key: "link",
    width: "100px",
  },
  {
    header: "Status",
    cell: (row) => (
      <StatusBubble
        status={
          row.process && row.process.length > 0
            ? row.process[row.process.length - 1].status
            : "NONE"
        }
      />
    ),
  },
  {
    header: "Date Applied",
    accessor: (row) =>
      row.process && row.process.length > 0
        ? row.process[0].date.toLocaleDateString()
        : "",
  },
  {
    header: "Date Updated",
    accessor: (row) =>
      row.process && row.process.length > 0
        ? row.process[row.process.length - 1].date.toLocaleDateString()
        : "",
  },
];

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  sortBy: string[];
  status: string[];
}

const Applications = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    sortBy: [],
    status: [],
  });

  const [newApplicationOpen, setNewApplicationOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application>({
    _id: "",
    userId: "",
    company: { _id: "", name: "" },
    position: "",
  });
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);

  const getPaginatedApplications = useCallback(
    async (page: number, perPage: number) => {
      if (!user) {
        return { page: 0, perPage: 0, total: 0, data: [] } as PaginatedData<Application>;
      }

      const res = await getApplicationsByUserID(user._id, {
        page,
        perPage,
        query: search.query.length >= 1 ? search.query : undefined,
        sortBy: search.sortBy.length === 1 ? search.sortBy[0].toUpperCase() : undefined,
        status: search.status.length >= 1 ? search.status.join(",") : undefined,
      });

      if (res.success) {
        return {
          ...res.data,
          data: res.data.data.map((app) => ({
            ...app,
            process:
              app.process &&
              app.process.map((proc) => ({
                ...proc,
                date: new Date(proc.date),
              })),
          })),
        };
      } else {
        console.error(res.error);
        return { page: 0, perPage: 0, total: 0, data: [] } as PaginatedData<Application>;
      }
    },
    [search, user],
  );

  const onApplicationClicked = (application: Application) => {
    setSelectedApplication(application);
    setApplicationModalOpen(true);
  };

  const onApplicationModalClosed = () => {
    setApplicationModalOpen(false);
    setSelectedApplication({
      _id: "",
      userId: "",
      company: { _id: "", name: "" },
      position: "",
    });
  };

  return (
    <div
      className="min-h-screen px-6 py-8 relative"
      style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(91,142,244,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="animate-fadeIn">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="p-3 rounded-xl text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                boxShadow: "0 4px 15px rgba(91,142,244,0.3)",
              }}
            >
              <LuFileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#e8eaed] tracking-tight">
                Applications
              </h1>
              <p className="text-[#9ca3af] mt-1">
                Track your internship and job applications
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#2d3748] to-transparent mt-4" />
        </div>

        {/* Search Bar Card */}
        <div className="animate-slideUp">
          <div className="bg-[#1e2433] rounded-2xl border border-[#2d3748] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#1a1f2e] rounded-lg border border-[#5b8ef4]">
                <LuSearch className="text-[#5b8ef4] w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-[#e8eaed]">
                Search & Filter
              </h2>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-[#2d3748]">
              <SearchBar<SearchBarData>
                selections={[
                  {
                    label: "Sort By",
                    options: ["Applied", "Modified", "Status", "Company", "Position"],
                    single: true,
                  },
                  {
                    label: "Status",
                    options: ["Applied", "OA", "Phone", "Final", "Offer", "Rejected", "Ghosted"],
                  },
                ]}
                onSubmitForm={setSearch}
              />
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between animate-slideUp delay-100">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded-full" />
            <h2 className="text-2xl font-bold text-[#e8eaed]">Your Applications</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1e2433] rounded-lg border border-[#2d3748]">
            <div className="w-2 h-2 bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] rounded-full animate-pulse" />
            <span className="text-[#9ca3af] text-sm">Live Results</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="animate-slideUp delay-200">
          <DataTable<Application>
            pageType="applications"
            tableStyle={{
              width: "100%",
              height: "72vh",
            }}
            useServerPagination
            paginatorContent={{ setPerPage: true, goToPage: true }}
            columns={applicationColumns}
            fetchData={getPaginatedApplications}
            onRowClick={onApplicationClicked}
          />
        </div>
      </div>

      {/* Floating New Application Button */}
      <button
        onClick={() => setNewApplicationOpen(true)}
        className="fixed right-10 bottom-8 inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white shadow-2xl transition-all hover:-translate-y-0.5 z-20"
        style={{
          background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
          boxShadow: "0 4px 25px rgba(91,142,244,0.4)",
        }}
      >
        <LuPlus className="w-5 h-5" />
        New Application
      </button>

      <NewApplicationModal
        isOpen={newApplicationOpen}
        onClose={() => setNewApplicationOpen(false)}
        onNewApplication={() => {
          setSearch({ ...search });
          window.dispatchEvent(new CustomEvent("applications:changed"));
        }}
      />
      <ApplicationModal
        isOpen={applicationModalOpen}
        onClose={onApplicationModalClosed}
        application={selectedApplication}
        setApplication={setSelectedApplication}
        onSaveApplication={() => {
          setSearch({ ...search });
          window.dispatchEvent(new CustomEvent("applications:changed"));
        }}
      />
    </div>
  );
};

export default Applications;