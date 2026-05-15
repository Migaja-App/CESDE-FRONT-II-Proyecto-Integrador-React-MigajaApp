import { useEffect, useState, useCallback } from "react";
import { mediosPagoApi } from "../api/mediosPagoApi";

export function useMediosPago() {
    
    const [mediosPago, setMediosPago] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await mediosPagoApi.listar();
            setMediosPago(datos);
        } catch (err) {
            setError(err.message || "Error al cargar medios de pago");
        } finally {
            setCargando(false);
        }
    }, []);

    async function crear(datos) {
        try {
            await mediosPagoApi.crear(datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al crear";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function actualizar(id, datos) {
        try {
            await mediosPagoApi.actualizar(id, datos);
            await cargar();
        } catch (err) {
            const mensaje =
                err.response?.data?.message || err.message || "Error al actualizar";
            throw new Error(mensaje, { cause: err });
        }
    }

    async function eliminar(id) {
        try {
            await mediosPagoApi.eliminar(id);
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

    return { mediosPago, cargando, error, recargar: cargar, crear, actualizar, eliminar };
}