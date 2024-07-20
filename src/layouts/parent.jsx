import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
    Sidenav,
    Configurator,
    Navbar,
    Footer,
    DashboardNavbar
} from "@/widgets/layout";
import Allroutes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

const { routesParent } = Allroutes;

export function DashParents() {

    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavType } = controller;

    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav
                routes={routesParent}
                brandImg={
                    sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
                }
            />
            <div className="p-4 xl:ml-80">
                <DashboardNavbar />
                <Configurator />
                <IconButton
                    size="lg"
                    color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
                    ripple={false}
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
                <Routes>
                    {routesParent.map(
                        ({ layout, pages }) =>
                            layout === "parent" &&
                            pages.map(({ path, element }) => (
                                <Route exact path={path} element={element} />
                            ))
                    )}
                </Routes>
                <div className="text-blue-gray-600">
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default DashParents;