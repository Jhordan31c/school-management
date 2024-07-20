// data/index.js
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import dataServicio from "@/services/dataServicio";

// Hook personalizado para obtener los datos
const useStatisticsData = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [educatorsCount, setEducatorsCount] = useState(0);

  useEffect(() => {
    dataServicio.getAllStudents()
      .then((response) => {
        setStudentsCount(response.data); // Ajusta según la estructura de tu respuesta
      })
      .catch((error) => {
        console.error("Error al obtener estudiantes:", error);
      });

    dataServicio.getAllEducators()
      .then((response) => {
        setEducatorsCount(response.data); // Ajusta según la estructura de tu respuesta
      })
      .catch((error) => {
        console.error("Error al obtener docentes:", error);
      });
  }, []);

  return { studentsCount, educatorsCount };
};

// Datos de las tarjetas
const getStatisticsCardsData = (studentsCount, educatorsCount) => [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Estudiantes",
    value: studentsCount.toString(),
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "más del último mes",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Total Docentes",
    value: educatorsCount.toString(),
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "más que ayer",
    },
  },
];

const statisticsCardsIncome = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Marzo",
    value: "30",
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Abril",
    value: "30",
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Mayo",
    value: "30",
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Junio",
    value: "30",
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Julio",
    value: "30",
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Agosto",
    value: "30",
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Septiembre",
    value: "30",
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Octubre",
    value: "30",
  },
];

export { useStatisticsData, getStatisticsCardsData, statisticsCardsIncome };
