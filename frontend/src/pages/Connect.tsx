import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DataGrid from "../components/DataGrid";
import AlumniTile from "../components/AlumniTile";
import { getAlumni } from "../api/users";
import { APIResult } from "../api/requests";
import { Alumni } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";
import { IndustryType } from "../types/Company";

const Connect = () => {
  const [alumni, setAlumni] = useState<PaginatedData<Alumni>>({
    page: 0,
    perPage: 10,
    total: 0,
    data: [],
  });

  useEffect(() => {
    const fetchAlumni = async () => {
      const result: APIResult<PaginatedData<Alumni>> = await getAlumni({
        page: alumni.page,
        perPage: alumni.perPage,
      });
      if (result.success) {
        setAlumni(result.data);
      } else {
        console.error(result.error); // not sure how we want to handle errors
      }
    };

    fetchAlumni();
  }, [alumni.page, alumni.perPage]);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Alumni Directory</h1>
          <p>Connect with graduates from your university</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8 ">
          <h1 className="text-2xl font-bold mb-6">Find Alumni</h1>
          <SearchBar
            selections={[
              {
                label: "Industry",
                options: [...Object.values(IndustryType)],
              },
            ]}
            placeholder="Search by name, company, or industry"
          />
        </div>
        {/* Alumni Grid */}
        {/* Temporary Solution until we make the sidebar sticky */}
        <div className="overflow-y-auto max-h-[500px]">
          <DataGrid
            data={alumni.data}
            usePagination={true}
            TileComponent={AlumniTile}
            cols={2}
            maxRows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Connect;
