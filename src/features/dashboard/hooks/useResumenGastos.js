import { useMemo } from "react";
import { useGastos } from "../../gastos/hooks/useGastos";

function calcularResumen(gastos) {
    const total = gastos.reduce((acc, g) => acc + (g.monto || 0), 0);
    const cantidad = gastos.length;
    const promedio = cantidad > 0 ? total / cantidad : 0;

    const porCategoria = {};
    for (const g of gastos) {
        const id = g.categoria?.id;
        if (!id) continue;
        if (!porCategoria[id]) {
            porCategoria[id] = {
                id,
                nombre: g.categoria.nombre,
                icono: g.categoria.icono,
                color: g.categoria.color,
                total: 0,
                cantidad: 0,
            };
        }
        porCategoria[id].total += g.monto || 0;
        porCategoria[id].cantidad += 1;
    }

    const porComercio = {};
    for (const g of gastos) {
        const id = g.comercio?.id;
        if (!id) continue;
        if (!porComercio[id]) {
            porComercio[id] = { id, nombre: g.comercio.nombre, total: 0 };
        }
        porComercio[id].total += g.monto || 0;
    }

    const categorias = Object.values(porCategoria).sort(
        (a, b) => b.total - a.total
    );
    const comercios = Object.values(porComercio)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
    const recientes = [...gastos]
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
        .slice(0, 5);

    return { total, cantidad, promedio, categorias, comercios, recientes };
}

export function useResumenGastos() {
    const { gastos, cargando, error } = useGastos();
    const resumen = useMemo(() => calcularResumen(gastos), [gastos]);
    return { resumen, cargando, error, sinDatos: gastos.length === 0 };
}