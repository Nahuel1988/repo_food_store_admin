import axios from "axios";

//Instancia compartida de axios
export const api = axios.create({
    baseURL: '/api', //Configura "/api" como la URL base del backend
    withCredentials: true //Manda la cookie en cada request
})