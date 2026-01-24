import { NavLink } from "react-router-dom";
import { navItems } from "../../constants/navItems";
import { NavItem } from "../../types/NavItem";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import Dialog from "../public/Dialog";
import { useAuth } from "../../contexts/useAuth";
import { FcGoogle } from "react-icons/fc";
import { requireLogin, roleGuard } from "../../constants/pathAccess";
import { MdLockOutline } from "react-icons/md";

const OpportuneLogo = "/assets/OpportuneLogo.png";

const SideNav = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const [isLogOutDialogOpen, setIsLogOutDialogOpen] = useState<boolean>(false);

  const onLogOutClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsLogOutDialogOpen(true);
  };

  const onLogOutDialogConfirm = () => {
    logout().then(() => setIsLogOutDialogOpen(false));
  };

  const onLogOutDialogClose = () => {
    setIsLogOutDialogOpen(false);
  };

  return (
    <div>
      <aside className="sticky top-0 h-screen w-[300px] bg-white flex flex-col border-2 border-solid rounded-r-lg shadow-lg items-center">
        <div className="text-3xl font-bold h-20 w-full flex items-center p-4 gap-2">
          <img className="h-12 w-12" src={OpportuneLogo} />
          <h1 className="text-gray-700">Opportune</h1>
        </div>
        <div className="w-full flex justify-center">
          <hr className="w-[80%]" />
        </div>
        <nav className="flex-grow w-full">
          <ul className="h-full w-full">
            {navItems.map((navItem: NavItem, index: number) => {
              if (navItem.disabled) {
                return <></>;
              }

              const pathIndex = roleGuard.findIndex(
                (pair) => navItem.path === pair.path,
              );
              if (pathIndex !== -1) {
                if (
                  !isAuthenticated ||
                  (user && roleGuard[pathIndex].role.includes(user.type))
                ) {
                  return <></>;
                }
              }

              const isPathLocked =
                !isAuthenticated && requireLogin.includes(navItem.path);

              return (
                <li key={index} className="h-[65px] px-2 py-1">
                  {!isPathLocked && (
                    <NavLink
                      className={({ isActive }) =>
                        `h-full w-full text-lg flex items-center rounded-md font-medium px-3 gap-3 transition ${
                          isActive
                            ? "bg-primary text-white"
                            : "hover:bg-primary hover:bg-opacity-10 text-gray-700"
                        }`
                      }
                      to={navItem.path}
                    >
                      {navItem.icon && <navItem.icon size={24} />}
                      <div>{navItem.label}</div>
                    </NavLink>
                  )}
                  {isPathLocked && (
                    <div
                      className={`nav-lock-${index} h-full w-full text-lg flex items-center rounded-md font-medium px-3 gap-3 transition text-gray-400 hover:cursor-default`}
                    >
                      {navItem.icon && <navItem.icon size={24} />}
                      <div>{navItem.label}</div>
                      <MdLockOutline className="mt-0.5" />
                    </div>
                  )}
                  {/* <Tooltip
                    target={`.nav-lock-${index}`}
                    content={`Login to access ${navItem.label}`}
                    showDelay={300}
                    mouseTrack
                  /> */}
                </li>
              );
            })}
          </ul>
        </nav>
        {isAuthenticated && user && (
          <div className="w-full flex flex-col items-center justify-center">
            <hr className="w-[80%]" />
            <div className="h-[65px] w-full py-1 gap-3">
              <NavLink
                className="h-full w-full text-sm flex items-center rounded-md font-medium px-2 gap-3 text-gray-700"
                to={"/profile"}
              >
                <img
                  src={user.profilePicture}
                  alt={`${user.name} Profile`}
                  className="rounded-full h-10 w-10"
                />
                <div className="flex flex-col flex-grow">
                  <div>{user.name}</div>
                  <div className="text-gray-400">{user.email}</div>
                </div>
                <button onClick={onLogOutClicked}>
                  <FiLogOut
                    size={27}
                    className="m-1 hover:stroke-primary transition"
                  />
                </button>
              </NavLink>
            </div>
          </div>
        )}
        {!isAuthenticated && (
          <div className="h-[65px] py-1 px-2 w-full flex items-center">
            <button
              className={
                "h-full w-full text-lg flex items-center rounded-md font-medium px-3 gap-3 transition justify-center border shadow-md hover:bg-black hover:bg-opacity-[0.03] hover:shadow-lg"
              }
              onClick={login}
            >
              <FcGoogle size={28} />
              <div>Sign in with Google</div>
            </button>
          </div>
        )}
      </aside>
      <Dialog
        isDialogOpen={isLogOutDialogOpen}
        onConfirm={onLogOutDialogConfirm}
        onDialogClose={onLogOutDialogClose}
        text="Are you sure you would like to logout?"
      />
    </div>
  );
};

export default SideNav;
