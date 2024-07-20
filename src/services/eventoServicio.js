import axios from 'axios';

const urlApi = 'http://localhost:8080/eventos';

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