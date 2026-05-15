import { useEffect, useState, useCallback } from "react";
import { gastosApi } from "../api/gastosApi";

export function useGastos() {
    const [gastos, setGastos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = useCallback(async () => {
        // Evitamos el setState síncrono que dispara el linter de React
        await Promise.resolve();
        setCargando(true);
        setError(null);
        try {
            const datos = await gastosApi.listar();
            setGastos(datos);
        } catch (err) {
            setError(err.message || "Error al cargar gastos");
        } finally {
            setCargando(false);
        }
    }, []);

    async function crear(datos) {
        try {
            await gastosApi.crear(datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al crear";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function actualizar(id, datos) {
        try {
            await gastosApi.actualizar(id, datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al actualizar";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function eliminar(id) {
        try {
            await gastosApi.eliminar(id);
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

    async function obtenerPorId(id) {
        try {
            return await gastosApi.obtenerPorId(id);
        } catch (err) {
            const mensaje = err.response?.data?.message || err.message || "Error al obtener gasto";
            throw new Error(mensaje, { cause: err });
        }
    }

    return { gastos, cargando, error, recargar: cargar, crear, actualizar, eliminar, obtenerPorId };
}