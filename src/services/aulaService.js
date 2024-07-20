import axios from "axios";

const urlGradeApi = "http://localhost:8080/grados";
const urlEducatorApi = "http://localhost:8080/docentes/estado/1";
const urlStudentsApi = "http://localhost:8080/alumnos/disponible/1";
const urlTopicsApi = "http://localhost:8080/materias";
const urlAulaApi = "http://localhost:8080/aulas";
const urlAulaActiveApi = "http://localhost:8080/aulas/estado/1";
const urlAulaDesactiveApi = "http://localhost:8080/aulas/estado/0";

const getGrades = () => {
    return axios.get(urlGradeApi);
}

const getEducators = () => {
    return axios.get(urlEducatorApi);
}

const getStudents = () => {
    return axios.get(urlStudentsApi);
}

const getTopics = () => {
    return axios.get(urlTopicsApi);
}

const getAulas = () => {
    return axios.get(urlAulaActiveApi);
}

const getAulaDes = () => {
    return axios.get(urlAulaDesactiveApi);
}

const addAula = (aula) => {
    return axios.post(urlAulaApi, aula);
}

const getAulaById = (id) =>{
    return axios.get(`${urlAulaApi}/${id}`);
}

const deleteAula = (id, nuevoEstado) => {
    return axios.put(`${urlAulaApi}/${id}/${nuevoEstado}`)
}


export default {
    getGrades,
    getStudents,
    getTopics,
    getEducators,
    getAulas,
    addAula,
    getAulaDes,
    getAulaById,
    deleteAula
};