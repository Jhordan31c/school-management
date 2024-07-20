import React, { useState, useEffect, useContext, createContext } from 'react';
import { Calendar as BigCalendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { Button } from '@material-tailwind/react';
import 'dayjs/locale/es';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/style/calendar.css'
import eventoServicio from '@/services/eventoServicio';
import { useUser } from "@/context/UserContext";


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




  //PARA CARGAR DESDE UN INICIO LOS EVENTOS DE LA BD
  useEffect(() => {
    fetchEvents();
  }, []);


  //METODO PARA TRAER DE LA BD Y MOSTRAR EN EL CALENDARIO
  const fetchEvents = async () => {
    try {
      const response = await eventoServicio.getEvents();
      if(response.data) {
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
    setShowModal(true);
    setSelectEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setSelectedDate(dayjs(event.fecha).startOf('day').toDate());
    setEventStatus(event.isActive ? 1 : 0);
  }

  //METODO PARA GUARDAR EVENTO O ACTUALIZAR EL EVENTO QUE ESTA PREVIAMENTE CREADO
  const saveEvent = async () => {
    if (eventTitle && selectedDate) {
      const startOfDay = startTime;
      const endOfDay = endTime;
      const event = {
        nombre: eventTitle,
        descripcion: eventDescription,
        fecha: selectedDate,
        inicio: startOfDay,
        fin: endOfDay,
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
        setShowModal(false); 
        resetForm(); 
      } catch (error) {
        console.error('Error saving event', error);
        addNotification('Error al crear evento');
      }

      setShowModal(false);
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

      setShowModal(false);
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
    setSelectEvent(null);
  };

  return (
    <div className="ContenedorCalendar w-full">
      <div className="flex justify-between items-center mb-3">
        <Button variant="outlined" color='indigo' onClick={() => setShowModal(true)} className='ml-auto'>Añadir Evento</Button>
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3 h-auto max-h-screen overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
              <h5 className="text-xl font-medium text-white">
                {selectEvent ? 'Editar Evento' : 'Añadir Evento'}
              </h5>
              <button
                type="button"
                className="text-red-400 font-bold hover:bg-gray-300 rounded-lg px-2 py-2 shadow-md"
                onClick={() => {
                  setShowModal(false);
                  resetForm(); // RESETEAR FORMULARIO
                }}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
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
            <div className="p-4">
              <label className="block mb-2 font-bold text-white">NOMBRE DEL EVENTO:</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-purple-600 rounded-md bg-transparent text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <label className="block mt-4 mb-2 font-bold text-white">DESCRIPCIÓN DEL EVENTO:</label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-purple-600 rounded-md bg-transparent text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
              <div className="flex items-center mt-4">
                <label className="font-bold text-white mr-2">FECHA:</label>
                <DatePicker
                  className="mt-2 block px-3 py-2 border border-purple-600 rounded-md bg-transparent text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 w-36 -ml-28 react-datepicker-ignore-onclickoutside"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="font-bold text-white mr-2">HORA DE INICIO:</label>
                <input
                  type="time"
                  className="mt-1 block w-36 px-3 py-2 border border-purple-600 rounded-md bg-transparent text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="font-bold text-white mr-2">HORA DE FIN:</label>
                <input
                  type="time"
                  className="mt-1 block w-36 px-3 py-2 border border-purple-600 rounded-md bg-transparent text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="font-bold text-white mr-2">ESTADO:</label>
                <select
                  className="mt-1 block w-36 px-3 py-2 border border-purple-600 rounded-md bg-transparent text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ml-2"
                  value={eventStatus}
                  onChange={(e) => setEventStatus(Number(e.target.value))}
                >
                  <option className="bg-gray-800 text-white" value={1}>
                    Activo
                  </option>
                  <option className="bg-gray-800 text-white" value={0}>
                    Inactivo
                  </option>
                </select>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-700 flex justify-end space-x-2">
              <button
                type="button"
                onClick={saveEvent}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-500 z-1 border-2 border-blue-900"
              >
                <span>{selectEvent ? 'Actualizar' : 'Agregar'}</span>
              </button>
              {selectEvent && (
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-500 z-1 border-2 border-red-900"
                  onClick={deleteEvent}
                >
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
  
}

export default Calendar;