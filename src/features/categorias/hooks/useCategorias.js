import { useEffect, useState, useCallback } from 'react';
import { categoriasApi } from '../api/categoriasApi';

export function useCategorias() {
    
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await categoriasApi.listar();
            setCategorias(datos);
        } catch (err) {
            setError(err.message || 'Error al cargar categorías');
        } finally {
            setCargando(false);
        }
    }, []);

    async function crear(datos) {
        try {
            await categoriasApi.crear(datos);
            await cargar();
        } catch (err) {
            const mensaje = err.response?.data?.message || err.message || 'Error al crear';
            throw new Error(mensaje, { cause: err });
        }
    }

    async function actualizar(id, datos) {
        try {
            await categoriasApi.actualizar(id, datos);
            await cargar();
        } catch (err) {
            const mensaje = err.response?.data?.message || err.message || 'Error al actualizar';
            throw new Error(mensaje, { cause: err });
        }
    }

    async function eliminar(id) {
        try {
            await categoriasApi.eliminar(id);
            await cargar();
        } catch (err) {
            const mensaje = err.response?.data?.message || err.message || 'Error al eliminar';
            throw new Error(mensaje, { cause: err });
        }
    }

    useEffect(() => {
        const t = setTimeout(() => {
            cargar();
        }, 0);
        return () => clearTimeout(t);
    }, [cargar]);

    return { categorias, cargando, error, recargar: cargar, crear, actualizar, eliminar };
}