import { useEffect, useState, useCallback } from "react";
import { comerciosApi } from "../api/comerciosApi";

export function useComercios() {
    const [comercios, setComercios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await comerciosApi.listar();
            setComercios(datos);
        } catch (err) {
            setError(err.message || "Error al cargar comercios");
        } finally {
            setCargando(false);
        }
    }, []);

    async function crear(datos) {
        try {
            await comerciosApi.crear(datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al crear";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function actualizar(id, datos) {
        try {
            await comerciosApi.actualizar(id, datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al actualizar";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function eliminar(id) {
        try {
            await comerciosApi.eliminar(id);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al eliminar";
            throw new Error(mensaje, { cause: err });
        }
    }

    useEffect(() => {
        const t = setTimeout(() => {
            cargar();
        }, 0);
        return () => clearTimeout(t);
    }, [cargar]);

    return { comercios, cargando, error, recargar: cargar, crear, actualizar, eliminar };
}