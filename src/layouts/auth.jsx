import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import AllRoutes from "@/routes";

const {routeLoginIn} = AllRoutes;

export function Auth() {
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/admin/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/admin/home",
      icon: UserIcon,
    },
    {
      name: "sign in",
      path: "/auth/LoginApp",
      icon: ArrowRightOnRectangleIcon,
    },
  ];

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routeLoginIn.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

export default Auth;
