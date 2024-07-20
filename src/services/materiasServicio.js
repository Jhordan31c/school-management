import axios from 'axios';

const urlApiMateriasAreas = 'http://localhost:8080/materias/areas';
const urlApiMaterias= 'http://localhost:8080/materias';

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