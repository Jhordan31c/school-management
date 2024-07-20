import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import citaServicio from '@/services/citaServicio';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "@/context/UserContext";
import alumnoServicio from '@/services/alumnoServicio';
import docenteServicio from "@/services/docenteServicio";

export function AchievementsEducator() {


  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const { user, setUser } = useContext(UserContext);
  const idDocente = user?.id;
  const [showModal, setShowModal] = useState(false);
  const token = user.token;
  const [alumnos, setAlumnos] = useState([]);
  const [cantidadAlumnos, setCantidadAlumnos] = useState(0);

  // Cargar datos de usuario y cita, tbm  cambia el activeTab
  useEffect(() => {
    fetchAlumnos(idDocente)
    setCantidadAlumnos(alumnos.length);
  }, []);


  // Cambiar la pestaña activa basado en el estado de la cita


  const fetchAlumnos = async (docenteId) => {
    try {
      const response = await docenteServicio.getAlumnosAsignados(docenteId);

      if (response.data) {
        setAlumnos(response.data);
        setCantidadAlumnos(response.data.length);
      } else {
        console.error('No se encontraron alumnos');
      }
    } catch (error) {
      console.error('Error al acceder a encontrar alumnos red', error);
    }
  };

  const alumnosFiltrados = alumnos.filter(alumno =>
    alumno.dni.toString().startsWith(filtro) ||
    alumno.nombre.toLowerCase().startsWith(filtro.toLowerCase()) ||
    alumno.apellido.toLowerCase().startsWith(filtro.toLowerCase())
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Alumnos Asignados
          </Typography>
        </CardHeader>
        <div className="relative mb-5">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
        </div>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre", "Apellido", "Género", "Estado"].map((el, index) => (
                  <th
                    key={index}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      className="font-normal leading-none opacity-70"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.map((alumno, index) => {
                const classes = index === alumnosFiltrados.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={alumno.id || index}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {alumno.nombre}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {alumno.apellido}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {alumno.genero}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max text-center">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={alumno.estado === 1 ? "online" : "offline"}
                          color={alumno.estado === 1 ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default AchievementsEducator;