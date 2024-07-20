import axios from "axios";

const urlgetData = "http://localhost:8080/users";
const urlgetAlumno = "http://localhost:8080/alumnos/aula"


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