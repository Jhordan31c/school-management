import axios from 'axios';
import rutaBase from './rutaBase';

const URL_BASE = rutaBase.URL_BASE;
const urlApi = URL_BASE + '/eventos';

const getEvents = () => {
  return axios.get(urlApi);
};

const createEvent = (event) => {
  return axios.post(urlApi, event);
};

const updateEvent = (eventId, updatedEvent) => {
  return axios.put(`${urlApi}/${eventId}`, updatedEvent);
};

const deleteEvent = (eventId) => {
  return axios.delete(`${urlApi}/${eventId}`);
};

export default {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};