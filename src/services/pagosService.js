import axios from "axios";


const urlApodPagos = "http://localhost:8080/pagos/alumnos";
const urlPago = "http://localhost:8080/pagos";
const urlPagos = "http://localhost:8080/pagos/parametro-paga";

const getApodPagos = () => {
    return axios.get(urlApodPagos);
}
const getApodPagosById = (id) => {
    return axios.get(`${urlApodPagos}/${id}`)
}

const getParamPagos = () => {
    return axios.get(urlPagos);
}

const setParamPagos = (paramPagos) => {
    return axios.put(urlPagos, paramPagos);
}

const changeState = (id, state) => {
    return axios.put(`${urlPago}/${id}/${state}`);
}

export default {
    getApodPagos,
    getApodPagosById,
    getParamPagos,
    setParamPagos,
    changeState
}