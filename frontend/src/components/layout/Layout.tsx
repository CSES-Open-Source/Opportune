import { Outlet, useLocation } from "react-router-dom";
import SideNav from "./SideNav";
import { useAuth } from "../../contexts/useAuth";
import { requireLogin, roleGuard } from "../../constants/pathAccess";
import { pathToRegexp } from "path-to-regexp";
import LoginRequired from "../../pages/LoginRequired";
import Forbidden from "../../pages/Forbidden";

const Layout = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const loginPaths = requireLogin.map((path) => pathToRegexp(path));

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
    <div className="flex bg-background">
      <SideNav />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
