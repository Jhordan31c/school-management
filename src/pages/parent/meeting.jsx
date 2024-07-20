import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
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
  Textarea,
  Select,
  Option,
  Button
} from "@material-tailwind/react";
import React, { useContext, useState, useEffect, Fragment } from 'react';
import { format } from "date-fns";
import Calendar from "react-calendar";
import TimePicker from "react-time-picker";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUser } from '@/context/UserContext';
import { useToast } from "@/widgets/components/toast/ToastService";
import citaServicio from '@/services/citaServicio';
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import dayjs from 'dayjs';
import { ExclamationCircleIcon, ShieldCheckIcon, EllipsisVerticalIcon, PencilIcon, MagnifyingGlassIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

export function Meeting() {

  const TABS = [
    {
      label: "Confirmado",
      value: "Confirmado",
    },
    {
      label: "Pendiente",
      value: "Pendiente",
    },
    {
      label: "Cancelado",
      value: "Cancelado",
    },
  ];

  const [activeTab, setActiveTab] = useState("Confirmado");
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const { user } = useUser();
  const [idAumno, setIdAlumno] = useState('');
  const [docente, setDocente] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [showModal, setShowModal] = useState(false);;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [time, setTime] = useState('10:00');
  const [date, setDate] = useState(new Date());
  const toast = useToast();

  useEffect(() => {
    fetchCitas();
  }, [activeTab]);

  const fetchCitas = async () => {
    try {
      const response = activeTab === 'Confirmado'
        ? await citaServicio.getCitasActivate()
        : activeTab === 'Pendiente'
          ? await citaServicio.getCitasDesactivate()
          : await citaServicio.getCitasCancelado();
      if (response.data) {
        setCitas(response.data);
      } else {
        console.error('No se encontraron citas.');
      }
    } catch (error) {
      console.error('Error al acceder a encontrar citas:', error);
    }
  };

  // Filtrar citas basado en el input de filtro
  const citasFiltradas = citas.filter(cita =>
    cita.alumno.id === user.id && (
      cita.docente.apellido.toString().startsWith(filtro) ||
      cita.docente.nombre.toLowerCase().startsWith(filtro.toLowerCase()) ||
      cita.titulo.toLowerCase().startsWith(filtro.toLowerCase())
    )
  );

  // Cambiar la pestaña activa basado en el estado de la cita
  const verificarEstado = (estado) => {
    if (estado === 'Confirmado') {
      setActiveTab('Confirmado');
    } else if (estado === 'Pendiente') {
      setActiveTab('Pendiente');
    } else if (estado === 'Cancelado') {
      setActiveTab('Cancelado');
    }
  };


  const handleFail = (message) => {
    toast.open(
      <div className='flex gap-2 bg-red-300 text-red-800 p-4 rounded-lg shadow-lg'>
        <ExclamationCircleIcon className="w-10" />
        <div>
          <h3 className='font-bold'>Action Failed</h3>
          <p className='text-sm'>{message}</p>
        </div>
      </div>
    )
  };

  const handleActivate = (message) => {
    toast.open(
      <div className='flex gap-2 bg-green-300 text-green-800 p-4 rounded-lg shadow-lg'>
        <ShieldCheckIcon className="w-10" />
        <div>
          <h3 className='font-bold'>Action checked</h3>
          <p className='text-sm'>{message}</p>
        </div>
      </div>,
      3000
    )
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setIsCalendarOpen(false);
    console.log(newDate);
  };

  const closeModal = () => {
    setShowModal(false);
  }


  const handleSchedule = async () => {
    const data = {
      docente: {
        id: parseInt(docente)
      },
      alumno: {
        id: user.id
      },
      fecha: date.toISOString(),
      inicio: time,
      titulo: titulo,
      detalle: descripcion,
      estado: 1,
      mensaje: null
    };

    try {
      await citaServicio.sendCitas(data);
      handleActivate("La cita se ha agendado correctamente");
      console.log(data)
      closeModal();
    } catch (error) {
      handleFail("Hubo un error al agendar la cita");
      console.log(data)
    }
  };


  return (
    <>
      <div>
        <Transition appear show={showModal} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
              <div className="fixed inset-0 bg-black opacity-30" />
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-4xl p-6 my-8 text-left align-middle transition-all transform">
                  <div className="flex flex-col lg:flex-row">
                    <CardHeader
                      variant="gradient"
                      className="-mb-2 lg:-mr-2 -ml-0 grid w-full lg:w-80 place-items-center bg-gray-800 z-10"
                    >
                      <img
                        src="/img/oppi.jpeg"
                        className="h-full w-full object-cover rounded-xl"
                        alt="Pattern"
                      />
                    </CardHeader>
                    <Card className="w-full lg:w-96">
                      <CardBody className="flex flex-col gap-4">
                        <div>
                          <Select label="Seleccione un Docente" onChange={(e) => setDocente(e)}>
                            {user.horarios.map((horario) => (
                              <Option key={horario.docente.id} value={horario.docente.id.toString()}>{horario.docente.nombre}</Option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <Input label="Titulo" onChange={(e) => setTitulo(e.target.value)} />
                        </div>
                        <div>
                          <Textarea label="Descripcion de la cita" onChange={(e) => setDescripcion(e.target.value)} />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={format(date, 'yyyy-MM-dd')}
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="w-full p-2 border border-gray-400 rounded-md"
                            placeholder="Seleccionar fecha"
                          />
                          {isCalendarOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg z-10">
                              <Calendar
                                onChange={handleDateChange}
                                value={date}
                                className="rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <TimePicker
                            onChange={setTime}
                            value={time}
                            disableClock={true}
                            className="w-full custom-time-picker"
                            clearIcon={null}
                            format="h:mm a"
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                          />
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0">
                        <Button variant="gradient" fullWidth onClick={handleSchedule}>
                          Agendar
                        </Button>
                      </CardFooter>

                      <button
                        onClick={closeModal}
                        className="absolute top-1 right-1 p-1 rounded-lg text-gray-500 bg-transparent hover:bg-gray-50 hover:text-gray-600 w-7 fill-current"
                      >
                        <XMarkIcon />
                      </button>
                    </Card>
                  </div>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      </div>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Citas
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
                <div className="flex w-full shrink-0 gap-2 md:w-max">
                  <div className="w-full md:w-72">
                    <Input
                      label="Search"
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                  </div>
                  <Button className="flex items-center" size="sm" onClick={() => setShowModal(true)}>
                    <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Agregar
                  </Button>
                </div>
              </div>
            </CardHeader>
          </div>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Docente", "Apellido", "Título", "Detalle", "Mensaje", "Fecha y Hora", "Estado"].map((el, index) => (
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
                {citasFiltradas.map((cita, key) => {
                  const className = `text-center py-3 px-5 ${key === citasFiltradas.length - 1 ? '' : 'border-b border-blue-gray-50'}`;
                  return (
                    <tr key={cita.id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {cita.docente.nombre}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {cita.docente.apellido}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {cita.titulo}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {cita.detalle}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {cita.mensaje}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {dayjs(cita.fecha).format('DD/MM/YYYY')} - {cita.inicio}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          value={cita.estado === 0 ? "Pendiente"
                            : cita.estado === 1 ? "Confirmado" : "Cancelado"}
                          color={cita.estado === 0 ? "yellow"
                            : cita.estado === 1 ? "green" : "red"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Meeting;
