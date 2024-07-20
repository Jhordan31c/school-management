import axios from "axios";
import rutaBase from "./rutaBase";

const URL_BASE  = rutaBase.URL_BASE;
const urlgetData = URL_BASE + "/users";
const urlgetAlumno = URL_BASE +  "/alumnos/aula";


const getData = (id, rol) => {
    return axios.get(`${urlgetData}/${id}/${rol}`);
}

const getAlumnoExtraData = (id) => {
    return axios.get(`${urlgetAlumno}/${id}`)
}

export default {
    getData,
    getAlumnoExtraData
}