import axios from "axios";
import rutaBase from "./rutaBase";


const URL_BASE = rutaBase.URL_BASE;
const urlApiStudent = URL_BASE + "/datos/alumnos-estado/1";
const urlApiEducator = URL_BASE + "/datos/docentes-estado/1";


const getAllStudents = () => {
    return axios.get(urlApiStudent);
}

const getAllEducators = () => {
    return axios.get(urlApiEducator);
}


export default {
    getAllEducators,
    getAllStudents
}