import { Outlet, useLocation } from "react-router-dom";
import SideNav from "./SideNav";
import { useAuth } from "../../contexts/useAuth";
import { requireLogin, roleGuard } from "../../constants/pathAccess";
import { pathToRegexp } from "path-to-regexp";
import LoginRequired from "../../pages/LoginRequired";
import Forbidden from "../../pages/Forbidden";
import { ProgressSpinner } from "primereact/progressspinner";

const Layout = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  const loginPaths = requireLogin.map((path) => pathToRegexp(path));

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center w-full h-[100vh]"
        style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
      >
        <ProgressSpinner className="h-16 w-16" strokeWidth="3" style={{ color: "#5b8ef4" }} />
      </div>
    );
  }

  if (
    !isAuthenticated &&
    loginPaths.some((path) => path.regexp.test(location.pathname))
  ) {
    return <LoginRequired />;
  }

  const pathIndex = roleGuard.findIndex(
    (pair) => location.pathname === pair.path,
  );
  if (pathIndex !== -1) {
    if (
      !isAuthenticated ||
      (user && roleGuard[pathIndex].role.includes(user.type))
    ) {
      return <Forbidden />;
    }
  }

  return (
    <div
      className="flex overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
    >
      <SideNav />
      <div className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;