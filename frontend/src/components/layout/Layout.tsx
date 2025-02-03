import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

const Layout = () => {
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
