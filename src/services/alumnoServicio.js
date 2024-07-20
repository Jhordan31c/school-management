import axios from 'axios';

const urlApi = 'http://localhost:8080/alumnos';
const urlStatusActivate = 'http://localhost:8080/alumnos/estado/1';
const urlStatusDesactivated = 'http://localhost:8080/alumnos/estado/0';
const urlDataCourses = "http://localhost:8080/alumnos/materias";
const urlDataGrades = "http://localhost:8080/alumnos/grados";



const getAlumnos = () => {
  return axios.get(urlApi);
};
const getAlumnosActivate = () => {
  return axios.get(urlStatusActivate);
};
const getAlumnosDesactivate = () => {
  return axios.get(urlStatusDesactivated);
};

const addAlumnos = (docente) => {
  return axios.post(urlApi, docente)
}

const updateAlumnos = (id, updatedAlumno) => {
  return axios.put(`${urlApi}/${id}`, updatedAlumno);
}

const actualizarEstado = (id, nuevoEstado) => {
  return axios.put(`${urlApi}/${id}/${nuevoEstado}`);
};

const getAlumnoId = (id) => {
  return axios.get(`${urlApi}/${id}`);
}

const deleteAlumnos = (id) => {
  return axios.delete(`${urlApi}/${id}`);
}

const busquedaAlumnos = (dni) => {
  return axios.get(`${urlApi}?dni=${dni}`);
};

const getCoursesByStudent = (idAlumno, idGrado) => {
  return axios.get(`${urlDataCourses}/${idAlumno}/${idGrado}`);
}

const getTopicAllInformation = (idMateria) => {
  return axios.get(`${urlDataCourses}/${idMateria}`)
}

const getAcademicLevelsByStudent = (idAlumno) => {
  return axios.get(`${urlDataGrades}/${idAlumno}`);
}

const updateMyInformation = (id,updatedAlumno) =>{
  return axios.put(`${urlApi}/${id}`, updatedAlumno);
}


export default {
  getAlumnos,
  getAlumnoId,
  getAlumnosActivate,
  getAlumnosDesactivate,
  addAlumnos,
  updateAlumnos,
  deleteAlumnos,
  busquedaAlumnos,
  actualizarEstado, 
  getCoursesByStudent,
  getTopicAllInformation,
  getAcademicLevelsByStudent,
  updateMyInformation
};