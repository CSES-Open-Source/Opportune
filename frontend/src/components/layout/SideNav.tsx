import { NavLink } from "react-router-dom";
import { navItems } from "../../constants/navItems";
import { NavItem } from "../../types/NavItem";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import Dialog from "../Dialog";

const SideNav = () => {
  const isAuthenticated = true;
  const user = {
    name: "King Triton",
    profile:
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    email: "ktriton@ucsd.edu",
  };

  const [isLogOutDialogOpen, setIsLogOutDialogOpen] = useState<boolean>(false);

  const onLogOutClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsLogOutDialogOpen(true);
  };

  const onLogOutDialogConfirm = () => {
    // TODO
  };

  const onLogOutDialogClose = () => {
    setIsLogOutDialogOpen(false);
  };

  return (
    <div>
      <aside className="h-screen w-[300px] bg-white flex flex-col border-2 border-solid rounded-r-lg shadow-lg items-center">
        <div className="text-3xl font-bold h-20 w-full flex items-center p-4">
          Opportune
        </div>
        <div className="w-full flex justify-center">
          <hr className="w-[80%]" />
        </div>
        <nav className="flex-grow w-full">
          <ul className="h-full w-full">
            {navItems.map((navItem: NavItem, index: number) => {
              return navItem.disabled ? (
                <></>
              ) : (
                <li key={index} className="h-[65px] px-2 py-1">
                  <NavLink
                    className={({ isActive }) =>
                      `h-full w-full text-lg flex items-center rounded-md font-medium px-3 gap-3 transition ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:bg-opacity-10 text-gray-700"
                      }`
                    }
                    to={navItem.url}
                  >
                    {navItem.icon && <navItem.icon size={24} />}
                    <div>{navItem.label}</div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <hr className="w-[80%]" />
        {isAuthenticated && (
          <div className="h-[65px] py-1 w-full gap-3">
            <NavLink
              className="h-full w-full text-sm flex items-center rounded-md font-medium px-2 gap-3 text-gray-700"
              to={"/profile"}
            >
              <img
                src={user.profile}
                alt={`${user.name} Profile Picture`}
                className="rounded-full h-10 w-10"
              />
              <div className="flex flex-col flex-grow">
                <div>{user.name}</div>
                <div className="text-gray-400">{user.email}</div>
              </div>
              <button
                className="p-2 h-[47px] rounded-full hover:bg-primary hover:bg-opacity-10 transition"
                onClick={onLogOutClicked}
              >
                <FiLogOut size={27} className="ml-1" />
              </button>
            </NavLink>
          </div>
        )}
        {!isAuthenticated && (
          <div className="h-18 w-full flex items-center p-4">
            Google login here
          </div>
        )}
      </aside>
      <Dialog
        isDialogOpen={isLogOutDialogOpen}
        onConfirm={onLogOutDialogConfirm}
        onDialogClose={onLogOutDialogClose}
        text="Are you sure you would like to log out?"
      />
    </div>
  );
};

export default SideNav;
