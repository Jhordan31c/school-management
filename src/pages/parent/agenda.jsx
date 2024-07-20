import React, { useState, useEffect, useContext, createContext } from 'react';
import { Calendar as BigCalendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/style/calendar.css'
import eventoServicio from '@/services/eventoServicio';

export function Agenda() {
  const localizer = dayjsLocalizer(dayjs);
  const [events, setEvents] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);


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
            inicio: event.inicio, // Asegúrate de tener esta propiedad
            fin: event.fin,       // Asegúrate de tener esta propiedad
            start: startDateTime, // Combinar fecha y hora de inicio
            end: endDateTime,     // Combinar fecha y hora de fin
            isActive: event.estado === 1,
          };

          console.log('Formatted event:', formattedEvent); // Registro del evento formateado
          return formattedEvent;
        });
        setEvents(formattedEvents);
      } else {
        // MARCAR EN LA CONSOLA POR SI NO ENCUENTRA EVENTOS DE LA BD
        console.error('NO SE HAYA EVENTOS');
      }
    } catch (error) {
      // MARCAR ERRORES RESPECTO AL EVENTO
      console.error('ERROR AL BUSCAR EVENTOS', error);
    }
  };

  //ESTE METODO ABRE EL MODAL DEL EVENTO PARA ACTUALIZAR AL SELECCIONAR
  const handleSelectedEvent = (event) => {
    setSelectedEventDetails(event);
    setShowCard(true);
  }

  // Componente personalizado para mostrar la hora junto con el evento
  const PersonalizacionEvento = ({ event }) => (
    <div>
      <ol className="mt-2">
        <li>
          <a className="group flex" target="_blank">
            <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600 text-xs">{event.title}</p>
            <time className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block text-xs">{dayjs(event.start).format('HH:mm A')}</time>
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
    <div className='ContenedorCalendar w-full mt-[25px] '>
      <BigCalendar
        localizer={localizer}
        events={events}
        views={['month']} // SE PERMITE SOLO VER MES
        defaultView='month' // ESTABLECER EN MES
        selectable={true}
        components={{
          event: PersonalizacionEvento // PARA USAR EL COMPONENTE PERSONALIZADO
        }}
        onSelectEvent={handleSelectedEvent}//PARA QUE EL CALENDARIO ACEPTE EL METODO DE SELECCIONAR EVENTO
      />
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
      <ToastContainer />
    </div>
  );
}

export default Agenda;