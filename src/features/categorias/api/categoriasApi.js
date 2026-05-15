import { http} from  "../../../shared/api/http";

const RESOURCE = '/migaja/v1/categoria';

export const categoriasApi = {
    
    listar: () => http.get(RESOURCE).then((res) => res.data),
    obtenerPorId: (id) => http.get(`${RESOURCE}/${id}`).then((res) => res.data),
    crear: (datos) => http.post(RESOURCE, datos).then((res) => res.data),
    actualizar: (id, datos) => http.put(`${RESOURCE}/${id}`, datos).then((res) => res.data),
    eliminar: (id) => http.delete(`${RESOURCE}/${id}`).then((res) => res.data),

};