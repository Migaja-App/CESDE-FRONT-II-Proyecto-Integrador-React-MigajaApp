import axios from 'axios';

/*  aqui lo que haces es que axios a traves de create se trae la url del API del backend */

export const http = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },

});