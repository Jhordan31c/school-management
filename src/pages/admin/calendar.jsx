import React, { useState, useEffect, useContext, createContext, Fragment } from 'react';
import { Calendar as BigCalendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { Button, Input, Select } from '@material-tailwind/react';
import 'dayjs/locale/es';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/style/calendar.css'
import eventoServicio from '@/services/eventoServicio';
import { useUser } from "@/context/UserContext";
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import { EllipsisVerticalIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, description = '') => {
    const id = toast(message);
    const newNotification = { id, message, description };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    // Almacenar en localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([...storedNotifications, newNotification]));
  };
  //METODO PARA REMOVER LA NOTI
  const removeNotification = (idToRemove) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== idToRemove)
    );
    // UPDATE DEL LOCAL DESPUÉS DE REMOVER UNA NOTIFICACION
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const updatedNotifications = storedNotifications.filter((notification) => notification.id !== idToRemove);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  useEffect(() => {
    // CARGAR LAS NOTIFICACIONES DEL LOCAL PARA EL COMPONENTE 
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(storedNotifications);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export function Calendar() {
  const localizer = dayjsLocalizer(dayjs);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectEvent, setSelectEvent] = useState(null);
  const [eventStatus, setEventStatus] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);




  //PARA CARGAR DESDE UN INICIO LOS EVENTOS DE LA BD
  useEffect(() => {
    fetchEvents();
  }, []);


  //METODO PARA TRAER DE LA BD Y MOSTRAR EN EL CALENDARIO
  const fetchEvents = async () => {
    try {
      const response = await eventoServicio.getEvents();
      if (response.data) {
        const formattedEvents = response.data.map(event => {
          console.log('Original event:', event); // Registro del evento original
          const startDateTime = dayjs(`${event.fecha.split('T')[0]}T${event.inicio}`).toDate();
          const endDateTime = dayjs(`${event.fecha.split('T')[0]}T${event.fin}`).toDate();
          const formattedEvent = {
            ...event,
            title: event.nombre,
            description: event.descripcion,
            inicio: event.inicio,
            fin: event.fin,
            start: startDateTime,
            end: endDateTime,
            isActive: event.estado === 1,
          };
          console.log('Formatted event:', formattedEvent); // Registro del evento formateado
          return formattedEvent;
        });
        setEvents(formattedEvents);
      } else {
        //MARCAR EN LA CONSOLA POR SI NO ENCUENTRA EVENTOS DE LA BD
        console.error('NO SE HAYA EVENTOS');
      }
    } catch (error) {
      //MARCAR ERRORES RESPECTO AL EVENTO
      console.error('ERROR AL BUSCAR EVENTOS', error);
    }
  };

  //ESTE METODO ABRE EL MODAL DEL EVENTO PARA ACTUALIZAR AL SELECCIONAR
  const handleSelectedEvent = (event) => {
    setIsOpen(true);
    setShowModal(true);
    setSelectEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setSelectedDate(dayjs(event.start).startOf('day').toDate());
    setEventStatus(event.isActive ? 1 : 0);
    setStartTime(dayjs(event.start).format('HH:mm'));
    setEndTime(dayjs(event.end).format('HH:mm'));
  }

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const openModal = () => { // Obtiene solo la parte de la fecha en formato YYYY-MM-DD
    setIsOpen(true);
  };

  //METODO PARA GUARDAR EVENTO O ACTUALIZAR EL EVENTO QUE ESTA PREVIAMENTE CREADO
  const saveEvent = async () => {
    if (eventTitle && selectedDate) {
      const event = {
        nombre: eventTitle,
        descripcion: eventDescription,
        fecha: selectedDate.toISOString().split('T')[0], // Asegúrate de que esté en formato YYYY-MM-DD
        inicio: startTime,
        fin: endTime,
        estado: eventStatus
      };

      try {
        if (selectEvent) {
          await eventoServicio.updateEvent(selectEvent.id, event);
          toast(`Evento "${eventTitle}" actualizado correctamente`);
        } else {
          await eventoServicio.createEvent(event);
          addNotification(`Evento "${eventTitle}" creado correctamente`, eventDescription);
        }
        console.log(event);
        fetchEvents();
        setIsOpen(false);
        resetForm();
      } catch (error) {
        console.error('Error saving event', error);
        addNotification('Error al crear evento');
      }

      setIsOpen(false);
      setEventTitle('');
      setEventDescription('');
      setEventStatus(1);
      setSelectEvent(null);
    }
  };

  //METODO OBVIO PARA ELIMINAR XD
  const deleteEvent = async () => {
    if (selectEvent) {
      try {
        await eventoServicio.deleteEvent(selectEvent.id);
        toast('Evento eliminado correctamente');
        fetchEvents();
      } catch (error) {
        console.error('Error al eliminar evento', error);
        toast('ERROR AL ELIMINAR EL EVENTO');
      }

      setIsOpen(false);
      setEventTitle('');
      setEventDescription('');
      setEventStatus(1);
      setSelectEvent(null);
    }
  };

  // Componente personalizado para mostrar la hora junto con el evento
  const PersonalizacionEvento = ({ event }) => (
    <div>
      <ol className="mt-2">
        <li>
          <a className="group flex" target="_blank">
            <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600 text-xs">{event.title}</p>
            <time className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block text-xs">{dayjs(event.start).format('HH:mm A')} </time>
          </a>
        </li>
      </ol>
    </div>
  );

  //RESETEAR FORMULARIO

  const resetForm = () => {
    setEventTitle('');
    setEventDescription('');
    setSelectedDate(new Date());
    setEventStatus(1);
    setStartTime('');
    setEndTime('');
    setSelectEvent(null);
  };

  return (
    <div className="ContenedorCalendar w-full">
      <div className="flex justify-between items-center mb-3">
        <Button variant="outlined" color='indigo' onClick={openModal} className='ml-auto'>Añadir Evento</Button>
      </div>
      <BigCalendar
        localizer={localizer}
        events={events}
        views={['month']} // SE PERMITE SOLO VER MES
        defaultView="month" // ESTABLECER EN MES
        min={dayjs('2024-01-01T08:00:00').toDate()}
        max={dayjs('2024-01-01T21:00:00').toDate()}
        selectable={true}
        components={{
          event: PersonalizacionEvento // PARA USAR EL COMPONENTE PERSONALIZADO
        }}
        onSelectEvent={handleSelectedEvent} // PARA QUE EL CALENDARIO ACEPTE EL METODO DE SELECCIONAR EVENTO
      />
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
                    {selectEvent ? 'Editar Evento' : 'Nuevo Evento'}
                  </DialogTitle>
                  <div className="mt-4">
                  </div>
                  <div className="mt-4">
                    <div className="mt-1">
                      <Input
                        type="text"
                        className='w-full'
                        label="Título del Evento"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        type="text"
                        className='w-full'
                        label="Descripción"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="date"
                        value={dayjs(selectedDate).format('YYYY-MM-DD')} // Asegúrate de que esté en formato YYYY-MM-DD
                        onChange={(e) => setSelectedDate(dayjs(e.target.value).toDate())}
                        className="block w-full p-2 border border-gray-300 rounded-md bg-white"
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        type="time"
                        label="Inicio"
                        value={startTime}
                        className='w-full'
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        type="time"
                        label="Fin"
                        value={endTime}
                        className='w-full'
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <select
                        id="eventStatus"
                        value={eventStatus}
                        onChange={(e) => setEventStatus(parseInt(e.target.value))}
                        className="block w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value={1}>Activo</option>
                        <option value={0}>Inactivo</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {selectEvent && (
                      <Button color="red" onClick={deleteEvent} className="mr-2">Eliminar Evento</Button>
                    )}
                    <Button onClick={saveEvent} className="mr-2">Guardar</Button>
                    <Button onClick={closeModal} color="gray">Cancelar</Button>
                  </div>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      </div>
      <ToastContainer />
    </div>
  );

}

export default Calendar;