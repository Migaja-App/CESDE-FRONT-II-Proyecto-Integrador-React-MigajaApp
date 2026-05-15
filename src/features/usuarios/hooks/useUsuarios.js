import { useEffect, useState, useCallback } from "react";
import { usuariosApi } from "../api/usuariosApi";

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await usuariosApi.listar();
            setUsuarios(datos);
        } catch (err) {
            setError(err.message || "Error al cargar usuarios");
        } finally {
            setCargando(false);
        }
    }, []);

    async function crear(datos) {
        try {
            await usuariosApi.crear(datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al crear";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function actualizar(id, datos) {
        try {
            await usuariosApi.actualizar(id, datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al actualizar";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function eliminar(id) {
        try {
            await usuariosApi.eliminar(id);
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

    return { usuarios, cargando, error, recargar: cargar, crear, actualizar, eliminar };
}