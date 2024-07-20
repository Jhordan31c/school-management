import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsIncome = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Marzo",
    value: "30"
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Abril",
    value: "30"
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Mayo",
    value: "30"
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Junio",
    value: "30"
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Julio",
    value: "30"
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Agosto",
    value: "30"
  }, {
    color: "gray",
    icon: BanknotesIcon,
    title: "Septiembre",
    value: "30"
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Octubre",
    value: "30"
  }
];

export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Estudiantes",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: " mas del ultimo mes",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Total Docentes",
    value: "3,462",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "mas que ayer",
    },
  }
];

const AllData = { statisticsCardsData, statisticsCardsIncome};

export default AllData;
