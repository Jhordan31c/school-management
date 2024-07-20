import axios from 'axios';

const urlStatusDesactivated = 'http://localhost:8080/citas/estado/0';
const urlApi = 'http://localhost:8080/citas';
const urlStatusActivate = 'http://localhost:8080/citas/estado/1';
const urlStatusCancelado = 'http://localhost:8080/citas/estado/2';

const getCitasActivate = () => {
  return axios.get(urlStatusActivate);
};
const getCitasDesactivate = () => {
  return axios.get(urlStatusDesactivated);
};
const getCitasCancelado = () => {
  return axios.get(urlStatusCancelado);
};

const getCitaAlumnoConfirmado = (estado,idAlumno) =>{
  return axios.get(`${urlApi}/estado/${estado}/alumno/${idAlumno}`);
}

const getCitaDocenteConfirmado = (estado,idDocente) =>{
  return axios.get(`${urlApi}/estado/${estado}/docente/${idDocente}`);
}

const sendCitas = (data) => {
  return axios.post(urlApi, data)
}

const actualizarCitaEstado = (id, nuevoEstado) => {
  return axios.put(`${urlApi}/${id}/${nuevoEstado}`);
};
const actualizarCita = (id, updatedCita) => {
  return axios.put(`${urlApi}/${id}`, updatedCita);
}

export default {
    getCitasActivate,
    getCitasCancelado,
    getCitasDesactivate,
    getCitaAlumnoConfirmado,
    getCitaDocenteConfirmado,
    sendCitas,
    actualizarCitaEstado,
    actualizarCita
};