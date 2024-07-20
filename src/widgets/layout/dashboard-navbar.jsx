import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  ChevronDownIcon,
  TrashIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import React, { useContext, useState } from 'react';
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/pages/admin";

export function DashboardNavbar() {
  const { user } = useContext(UserContext);
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");


  const { notifications, removeNotification } = useNotification();
  //METODO PARA CLICKEAR NOTIFICACION Y ELIMINARLA
  const clickNotificacionesEliminar = (notificationId) => {
    removeNotification(notificationId);
  };
  const [expandirNotificacion, setExpandirNotificacion] = useState(null);
  const MenuNoti = (notificationId) => {
    if (expandirNotificacion === notificationId) {
      setExpandirNotificacion(null);
    } else {
      setExpandirNotificacion(notificationId);
    }
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
        ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
        : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Button
            variant="text"
            color="blue-gray"
            className="hidden items-center gap-1 px-4 xl:flex normal-case"
            disabled={true}
          >
            <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            {user?.roles[0] === 'ROLE_ADMIN' ? user?.username : user?.nombre}
          </Button>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
          >
            <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
          <Menu>
            <MenuHandler>
              <IconButton
                variant="text"
                color="blue-gray"
              >
                <BellIcon className="h-5 w-5 text-blue-gray-500 relative">
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                  )}
                </BellIcon>
              </IconButton>
            </MenuHandler>
            {notifications.length > 0 ? (
              <MenuList className="w-max border-0">
                {notifications.map((notification) => (
                  <MenuItem key={notification.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {notification.message}
                      </Typography>
                      <div className="flex gap-2">
                        <IconButton variant="text" onClick={(e) => {
                          e.stopPropagation();
                          MenuNoti(notification.id);
                        }}>
                          <ChevronDownIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton variant="text" onClick={(e) => {
                          e.stopPropagation();
                          clickNotificacionesEliminar(notification.id);
                        }}>
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                    {expandirNotificacion === notification.id && (
                      <div>
                        <Typography variant="small" color="blue-gray">
                          {notification.description}
                        </Typography>
                      </div>
                    )}
                  </MenuItem>
                ))}
              </MenuList>
            ) : (
              <MenuList className="w-max border-0">
                <MenuItem className="flex items-center gap-3">
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-normal"
                    >
                      No hay notificaciones
                    </Typography>
                  </div>
                </MenuItem>
              </MenuList>
            )}
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
