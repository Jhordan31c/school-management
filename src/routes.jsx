import {
  HomeIcon,
  UserCircleIcon,
  UsersIcon,
  InformationCircleIcon,
  BookOpenIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  ChatBubbleBottomCenterIcon,
  DocumentTextIcon,
  ServerStackIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import {
  Home,
  Section,
  Educators,
  Achievements,
  Meetings,
  Payment,
  Calendar,
  Materias
} from "@/pages/admin";

import {
  ProfileParent,
  Meeting,
  Agenda,
  Innit,
  Grades,
  Payments
} from "@/pages/parent";

import {
  CalendarDocente,
  Score,
  HomeDocente,
  ProfileEducator,
  MeetingsEducator,
  EducatorsDocentes,
  AchievementsEducator
} from "@/pages/educator";

import { LoginApp } from "./pages/auth";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routesParent = [
  {
    layout: "parent",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Inicio",
        path: "/innit",
        element: <Innit />
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Perfil",
        path: "/profile",
        element: <ProfileParent />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Rendimiento Academico",
        path: "/grades",
        element: <Grades />
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Programar cita",
        path: "/meeting",
        element: <Meeting />,
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "Pagos",
        path: "/payment",
        element: <Payments />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Cronograma",
        path: "/agenda",
        element: <Agenda />
      }
    ],
  },
];

export const routesEducator = [
  {
    layout: "educator",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Inicio",
        path: "/home",
        element: <HomeDocente />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Perfil",
        path: "/profile",
        element: <ProfileEducator />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Cronograma Eventos",
        path: "/calendar",
        element: <CalendarDocente />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "Calificaciones",
        path: "/score",
        element: <Score />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Docente",
        path: "/educators",
        element: <EducatorsDocentes />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "Alumnos",
        path: "/achievements",
        element: <AchievementsEducator />,
      }, {
        icon: <ChatBubbleBottomCenterIcon {...icon} />,
        name: "Mis Citas",
        path: "/meetings",
        element: <MeetingsEducator />,
      },
    ],
  }
];


export const routesAdmin = [
  {
    layout: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <BuildingLibraryIcon {...icon} />,
        name: "Aula",
        path: "/sections",
        element: <Section />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Docente",
        path: "/educators",
        element: <Educators />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "Alumno",
        path: "/achievements",
        element: <Achievements />,
      },
      {
        icon: <ChatBubbleBottomCenterIcon {...icon} />,
        name: "Citas",
        path: "/meetings",
        element: <Meetings />,
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "Gestion de Pagos",
        path: "/payment",
        element: <Payment />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Cronograma",
        path: "/calendar",
        element: <Calendar />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "Materias",
        path: "/materias",
        element: <Materias />,
      },
    ],
  }
];

export const routeLoginIn = [{
  layout: "auth",
  pages: [
    {
      icon: <ServerStackIcon />,
      name: "Ingresar",
      path: "/LoginApp",
      element: <LoginApp />
    }
  ]
}
]
const AllRoutes = { routesAdmin, routesParent, routeLoginIn, routesEducator };

export default AllRoutes;