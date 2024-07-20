import axios from "axios";
import rutaBase from "./rutaBase";

const URL_BASE = rutaBase.URL_BASE;
const urlGradeApi = URL_BASE + "/grados";
const urlEducatorApi = URL_BASE + "/docentes/estado/1";
const urlStudentsApi = URL_BASE + "/alumnos/disponible/1";
const urlTopicsApi = URL_BASE + "/materias";
const urlAulaApi = URL_BASE + "/aulas";
const urlAulaActiveApi = URL_BASE + "/aulas/estado/1";
const urlAulaDesactiveApi = URL_BASE + "/aulas/estado/0";

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