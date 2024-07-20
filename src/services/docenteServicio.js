import axios from 'axios';
import rutaBase from './rutaBase';


const URL_BASE = rutaBase.URL_BASE;
const urlApi = URL_BASE + '/docentes';
const urlStatusActivate = URL_BASE + '/docentes/estado/1';
const urlStatusDesactivated = URL_BASE + '/docentes/estado/0';
const urlDocenteUser= URL_BASE +  '/users';
const urlDocenteHorario= URL_BASE +  '/docentes/horario';
const urlAulasAsignadas= URL_BASE + '/docentes/aulas-asignadas';
const urlAulaElegida= URL_BASE + '/docentes/alumnos-materias';
const urlApiAlumnosAsignados = URL_BASE +  '/docentes/alumnos-correspondientes';

const getDocentes = () => {
  return axios.get(urlApi);
};

const getDocentesId = (id) => {
  return axios.get(`${urlApi}/${id}`);
}

const getDocentesActivate = () => {
  return axios.get(urlStatusActivate);
};
const getDocentesDesactivate = () => {
  return axios.get(urlStatusDesactivated);
};

const addDocente = (docente) =>{
    return axios.post(urlApi,docente)
}

const updateDocente = (id,updatedDocente) =>{
  return axios.put(`${urlApi}/${id}`, updatedDocente);
}

const deleteDocente = (id) => {
  return axios.delete(`${urlApi}/${id}`);
}

const actualizarEstado = (id, nuevoEstado) => {
  return axios.put(`${urlApi}/${id}/${nuevoEstado}`);
};

const busquedaDocente = (dni) => {
  return axios.get(`${urlApi}?dni=${dni}`);
};

const getDocenteUser = (userId, role) => {
  return axios.get(`${urlDocenteUser}/${userId}/${role}`);
};
const getHorarioDocente = (id) => {
  return axios.get(`${urlDocenteHorario}/${id}`);
};
const getAulasAsignadas = (id) => {
  return axios.get(`${urlAulasAsignadas}/${id}`);
};

const getAulasElegida= (idDocente,idAula,idMateria) => {
  return axios.get(`${urlAulaElegida}/${idDocente}/${idAula}/${idMateria}`);
};
const UpdateAulasElegida= (idDocente,idAula,idMateria,updateNotas) => {
  return axios.put(`${urlAulaElegida}/${idDocente}/${idAula}/${idMateria}`,updateNotas);
};
const actualizarNotas = (actualizarNotas) => {
  return axios.put(urlAulaElegida, actualizarNotas);
};
const getAlumnosAsignados = (id) => {
  return axios.get(`${urlApiAlumnosAsignados}/${id}`);
};
const actualizarMisDatos = (id,updatedDocente) =>{
  return axios.put(`${urlApi}/${id}`, updatedDocente);
}

export default {
  getDocentes,
  getDocentesActivate,
  getDocentesDesactivate,
  addDocente,
  updateDocente,
  deleteDocente,
  busquedaDocente,
  getDocentesId,
  actualizarEstado,
  getDocenteUser,
  getHorarioDocente,
  getAulasAsignadas,
  getAulasElegida,
  actualizarMisDatos,
  getAlumnosAsignados,
  actualizarNotas,
  UpdateAulasElegida
};