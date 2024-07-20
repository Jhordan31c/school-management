import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
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
import { EllipsisVerticalIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import citaServicio from '@/services/citaServicio';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import { UserContext } from "@/context/UserContext";
import docenteServicio from '@/services/docenteServicio';
import dayjs from 'dayjs';

export function MeetingsEducator() {
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
  const { user, setUser } = useContext(UserContext);
  const rolDocente = 'ROLE_DOCENTE';
  const idUser = user?.user_id;
  const idDocente = user?.id;
  const [showModal, setShowModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = (cita) => {
    const fechaLocal = new Date(cita.fecha);
    const fechaLocalString = fechaLocal.toISOString().split('T')[0]; // Obtiene solo la parte de la fecha en formato YYYY-MM-DD

    setIsOpen(true);
    setSelectedCita({
      ...cita,
      fecha: fechaLocalString,
    });
  };

  // Cargar datos de usuario y cita, tbm  cambia el activeTab
  useEffect(() => {

    fetchCitas();
  }, [activeTab, idUser, rolDocente, setUser]);

  // Obtener citas basado en la pestaña activa
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
    cita.docente.id === idDocente && (
      cita.alumno.nombre.toString().startsWith(filtro) ||
      cita.alumno.apellido.toLowerCase().startsWith(filtro.toLowerCase()) ||
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

  // Cambiar el estado de una cita
  const cambiarEstadoCita = async (idCita, nuevoEstado) => {
    try {
      await citaServicio.actualizarCitaEstado(idCita, nuevoEstado);
      fetchCitas(); // Refrescar la lista de citas después de cambiar el estado
    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
    }
  };

  // Editar una cita
  const EditarCita = (cita) => {
    setShowModal(true);
    setSelectedCita(cita);
  };


  const handleUpdateCita = async () => {
    try {
      const { id, fecha, inicio, mensaje, estado } = selectedCita;
      const citaData = { fecha, inicio, mensaje, estado };
      console.log('DATOS A ENVIAR:', citaData);
      const response = await citaServicio.actualizarCita(id, citaData);
      if (response.data) {
        console.log('Cita actualizada:', response.data);
        setIsOpen(false);
        fetchCitas();
      } else {
        console.error('No se recibieron datos al actualizar la cita');
      }
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

  const convertToLocalDate = (dateString) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Meses comienzan desde 0
    const day = ('0' + date.getDate()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  return (
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
                {["Alumno", "", "Título", "Fecha y Hora", "Estado", "", ""].map((el, index) => (
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
                const className = `py-3 px-5 ${key === citasFiltradas.length - 1 ? '' : 'border-b border-blue-gray-50'}`;
                return (
                  <tr key={cita.id}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {cita.alumno.apellido}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {cita.alumno.nombre}
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
                        {convertToLocalDate(cita.fecha)} - {cita.inicio}
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
                    <td className={className}>
                      <Menu>
                        <MenuHandler>
                          <IconButton variant="text">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem onClick={() => cambiarEstadoCita(cita.id, 0)}>Pendiente</MenuItem>
                          <MenuItem onClick={() => cambiarEstadoCita(cita.id, 1)}>Confirmado</MenuItem>
                          <MenuItem onClick={() => cambiarEstadoCita(cita.id, 2)}>Cancelado</MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                    <td>
                      <Tooltip content="Editar Cita">
                        <PencilIcon
                          className="h-4 w-4 cursor-pointer text-blue-gray-500"
                          onClick={() => openModal(cita)}
                        />
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
            <div className="min-h-screen px-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="fixed inset-0 bg-black opacity-30" />
              </TransitionChild>
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl mx-auto">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                    Editar Cita
                  </DialogTitle>
                  <div className="mt-4">
                  </div>
                  <div className="mt-4">
                    <div className="mt-1">
                      <Input
                        color="gray"
                        label="Mensaje sobre la Cita"
                        type="text"
                        value={selectedCita.mensaje}
                        onChange={(e) => setSelectedCita({ ...selectedCita, mensaje: e.target.value })}
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        color="gray"
                        label="Hora Inicio"
                        type="time"
                        value={selectedCita.inicio}
                        onChange={(e) => setSelectedCita({ ...selectedCita, inicio: e.target.value })}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="date"
                        value={selectedCita.fecha || ''} // Usar el formato YYYY-MM-DD
                        onChange={(e) => setSelectedCita({ ...selectedCita, fecha: e.target.value })}
                        className="block w-full p-2 border border-gray-300 rounded-md bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-8 space-x-4">
                    <Button color="red" onClick={closeModal}>Cancelar</Button>
                    <Button color="green" onClick={handleUpdateCita}>Guardar</Button>
                  </div>
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 p-1 rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-600 w-7 fill-current"
                  >
                    <XMarkIcon />
                  </button>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}

export default MeetingsEducator;