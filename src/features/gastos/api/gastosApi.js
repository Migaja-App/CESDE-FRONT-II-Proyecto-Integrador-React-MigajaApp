import { http } from "../../../shared/api/http";

const RESOURCE = "/migaja/v1/gasto";

export const gastosApi = {
    listar: () => http.get(RESOURCE).then((res) => res.data),
    obtenerPorId: (id) =>
        http.get(`${RESOURCE}/buscarPorId/${id}`).then((res) => res.data),
    crear: (datos) => http.post(RESOURCE, datos).then((res) => res.data),
    actualizar: (id, datos) =>
        http.put(`${RESOURCE}/actualizar/${id}`, datos).then((res) => res.data),
    eliminar: (id) =>
        http.delete(`${RESOURCE}/delete/${id}`).then((res) => res.data),
};