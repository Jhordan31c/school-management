import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'dayjs/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/style/calendar.css';
import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { format, setHours, setMinutes, startOfWeek, addDays } from 'date-fns';
import { CalendarSection } from '@/widgets/components';
import docenteServicio from '@/services/docenteServicio';
import {
  Card,
  CardHeader,
  CardBody,
  TabsHeader,
  Typography,
  Tabs,
  Tab,
  Input,
  Avatar,
  Chip,
  Tooltip, IconButton,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

export function HomeDocente() {

  const { user, setUser } = useUser();
  console.log("USER CONTEX", user);
  console.log("ID DOCENTE U", user?.id)
  const rolDocente = "ROLE_DOCENTE";
  const token = user.token;
  //const idUser = user?.user?.id;
  const [events, setEvents] = useState([]);
  const [aulasAsignadas, setAulasAsignadas] = useState([]);
  const [aulaElegida, setAulaElegida] = useState([]);
  const idDocente = user?.id;

  console.log('idDocente:', idDocente);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("INICIAL");
  const [filtro, setFiltro] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);


  const TABS = [
    {
      label: "INICIAL",
      value: "INICIAL",
    },
    {
      label: "PRIMARIA",
      value: "PRIMARIA",
    },
    {
      label: "SECUNDARIA",
      value: "SECUNDARIA",
    },
  ];


  useEffect(() => {
    fetchHorarioDocente(user?.id);
    fetchAulasAsignadas(user?.id);
  }, []);

  const fetchHorarioDocente = async (docenteId) => {
    try {
      const response = await docenteServicio.getHorarioDocente(docenteId);
      const horarioData = response.data;
      console.log("HORARIO DATA", horarioData);
      if (horarioData) {
        setEvents(horarioData);
        // Actualiza el estado del usuario con los datos de horario
        setUser(prevUser => ({
          ...prevUser,
          horarios: horarioData
        }));
      } else {
        console.error('No se encontraron datos de horario para el docente.');
      }
    } catch (error) {
      console.error('Error al obtener datos de horario del docente:', error);
    }
  };

  const formatHorarios = (horarios) => {
    console.log("Horarios originales:", horarios);
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return horarios.map((horario, index) => {
      const [inicioHora, inicioMinutos] = horario.h_inicio.split(":");
      const [finHora, finMinutos] = horario.h_fin.split(":");
      const startDay = addDays(currentWeekStart, horario.dia - 1);
      const endDay = addDays(currentWeekStart, horario.dia - 1);
      const startDate = setMinutes(setHours(startDay, parseInt(inicioHora)), parseInt(inicioMinutos));
      const endDate = setMinutes(setHours(endDay, parseInt(finHora)), parseInt(finMinutos));
      return {
        id: index.toString(),
        title: horario.materia,
        subtitle: horario.nivel,
        startDate,
        endDate,
      };
    });
  };

  const fetchAulasAsignadas = async (docenteId) => {
    try {
      const response = await docenteServicio.getAulasAsignadas(docenteId);
      console.log("AULAS ASIGNADAS", response.data)
      if (response.data) {
        setAulasAsignadas(response.data);
      } else {
        console.error('No se encontraron datos de aulas asignadas.');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener datos de aulas asignadas:', error);
    }
  };

  // Función para obtener la fecha a partir de la hora y el día de la semana
  const getDateFromTime = (timeString, dayOfWeek) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = moment().day(dayOfWeek).set({ hours, minutes, seconds });
    return date.toDate();
  };

  const handleAulaElegida = async (aulaId, materiaId) => {
    try {
      const response = await docenteServicio.getAulasElegida(idDocente, aulaId, materiaId); // Aquí usamos user.id
      if (response.data) {
        console.log(user.id);
        setAulaElegida(response.data);
        console.log(response.data);
        navigate('/educator/score', { state: { aulaElegida: response.data, userId: user.id, idDocente, aulaId, materiaId } });
      } else {
        console.error('No se encontraron datos de aula elegida.');
      }
    } catch (error) {
      console.error('Error al obtener datos de aula elegida:', error);
    }
  };

  const verificarEstado = (estado) => {
    if (estado === 'INICIAL') {
      setActiveTab('INICIAL');
    } else if (estado === 'PRIMARIA') {
      setActiveTab('PRIMARIA');
    } else if (estado === 'SECUNDARIA') {
      setActiveTab('SECUNDARIA');
    }
  };

  const aulasFiltradas = aulasAsignadas.filter(aula => {
    const gradoSubGrado = (aula.grado.toString() + ' ' + aula.subGrado.toString()).toLowerCase();
    const filtroLowerCase = filtro.toLowerCase().replace('-', '');

    return (
      aula.nivel === activeTab &&
      (
        aula.materia.toString().toLowerCase().startsWith(filtroLowerCase) ||
        gradoSubGrado.startsWith(filtroLowerCase) ||
        `${aula.grado}-${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase) ||
        `${aula.grado} - ${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase) ||
        `${aula.grado}  ${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase) ||
        `${aula.grado} ${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase)
      )
    );
  });

  console.log("NIVEL ELEGIDO:", activeTab);

  //ESTE METODO ABRE EL MODAL DEL EVENTO PARA ACTUALIZAR AL SELECCIONAR
  const handleSelectedEvent = (event) => {
    setSelectedEventDetails(event);
    setShowCard(true);
  }



  return (
    <div className="w-full">
      <div className="flex-grow mt-10">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography className="text-center" variant="h6" color="white">
              Horario
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <CalendarSection events={formatHorarios(user.horarios || [])} />
          </CardBody>
        </Card>
      </div>
      <Card className='mt-10 mb-5'>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-3">
          <Typography variant="h6" color="white">
            Aulas Asignadas
          </Typography>
        </CardHeader>
        <div className="relative mb-5">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Tabs value={activeTab} className="w-full md:w-max">
                <TabsHeader>
                  {TABS.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => verificarEstado(value)}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
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
                {["Nivel", "Grado - Subgrado", "Materia", "Cantidad Alumnos", ""].map((el, index) => (
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
              {aulasFiltradas.map((aula, key) => {
                const className = `py-3 px-5 ${key === aulasAsignadas.length - 1 ? '' : 'border-b border-blue-gray-50'
                  }`;
                return (
                  <tr key={aula.id || key}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {aula.nivel}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {aula.grado} - {aula.subGrado}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {aula.materia}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {aula.alumnos}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Tooltip content="Ver Aula Asignada">
                        <IconButton variant="text" >
                          <EllipsisVerticalIcon className="h-5 w-5" onClick={() => handleAulaElegida(aula.id_aula, aula.id_materia)} />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {showCard && selectedEventDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-gray-900 dark:border-gray-900 shadow-lg rounded-lg bg-white dark:bg-gray-800">
            <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-900 dark:border-gray-900 border-b-2 border-r-2 border-dashed">
              EVENTO
            </span>
            <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
              <p className="font-display mb-2 text-2xl font-semibold dark:text-gray-200">
                {selectedEventDetails.title}
              </p>
              <div className="mb-4 md:text-lg text-gray-400">
                <p>{selectedEventDetails.description}</p>
                <time>
                  Fecha : {dayjs(selectedEventDetails.start).format('DD/MM/YYYY')} - {dayjs(selectedEventDetails.start).format('HH:mm A')} - {dayjs(selectedEventDetails.end).format('HH:mm A')}
                </time>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => setShowCard(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeDocente;