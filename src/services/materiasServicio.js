import axios from 'axios';
import rutaBase from './rutaBase';

const URL_BASE = rutaBase.URL_BASE;
const urlApiMateriasAreas =  URL_BASE + '/materias/areas';
const urlApiMaterias= URL_BASE + '/materias';

const getAreasyMaterias = () => {
  return axios.get(urlApiMateriasAreas);
};

const addMateria = (materia) => {
  return axios.post(urlApiMaterias, materia);
};

const deleteMateria = (id) => {
  return axios.delete(`${urlApiMaterias}/${id}`);
};

const updateMateria= (id,updatedMateria) =>{
  return axios.put(`${urlApiMaterias}/${id}`, updatedMateria);
}

export default {
  getAreasyMaterias,
  addMateria,
  deleteMateria,
  updateMateria,
};