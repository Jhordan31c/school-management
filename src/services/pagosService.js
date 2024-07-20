import axios from "axios";
import rutaBase from "./rutaBase";

const URL_BASE = rutaBase.URL_BASE;
const urlApodPagos = URL_BASE + "/pagos/alumnos";
const urlPago = URL_BASE + "/pagos";
const urlPagos = URL_BASE + "/pagos/parametro-paga";

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