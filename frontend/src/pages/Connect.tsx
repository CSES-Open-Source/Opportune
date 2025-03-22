import SearchBar from "../components/SearchBar";
import DataGrid from "../components/DataGrid";
import AlumniTile from "../components/AlumniTile";
import { getAlumni } from "../api/users";
import { APIResult } from "../api/requests";
import { Alumni } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";

/**
 * The users should be displayed in tile cards in a grid format.
 * Make sure to use server-side pagination to fetch the alumnis
 *    that are willing to share profile.
 * In the searchbar, there should be a dropdown querying for the
 *    industry of the company that the user works in.
 */

const Connect = () => {
  let alumni: PaginatedData<Alumni> = {
    page: 0,
    perPage: 10,
    total: 0,
    data: [],
  };

  getAlumni({ page: 0, perPage: 10 }).then(
    (result: APIResult<PaginatedData<Alumni>>) => {
      if (result.success) {
        alumni = result.data;
      } else {
        console.error(result.error); // do something to inform the user of the error
      }
    },
  );

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold mb-6">Alumni Directory</h1>
        <p>Connect with graduates from your university</p>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-6">Find Alumni</h1>
        <SearchBar
          selections={[
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
          placeholder="Search by name, company, or industry"
        />
      </div>
      <div>
        <DataGrid
          data={alumni.data}
          usePagination={true}
          TileComponent={AlumniTile}
          cols={3}
          maxRows={5}
        />
      </div>
    </div>
  );
};

export default Connect;
