import axios from "axios";

//Instancia compartida de axios
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true //Manda la cookie en cada request
})