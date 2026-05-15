import { useState, useMemo } from "react";
import { useGastos } from "../hooks/useGastos";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { useComercios } from "../../comercios/hooks/useComercios";
import { useMediosPago } from "../../mediosPago/hooks/useMediosPago";
import { useUsuarios } from "../../usuarios/hooks/useUsuarios";
import GastoForm from "../components/gastosForm/gastosForm";
import Modal from "../../../shared/components/modal/modal";
import { alertas } from "../../../shared/utils/alertas";
import { formatoMoneda , formatoFecha } from "../../../shared/utils/format";
import FiltroSelect, { FiltroBar } from "../../../shared/components/filtros/FiltroSelect";
import styles from "./gastosPage.module.css";

function GastosPage() {
    const { gastos, cargando, error, crear, actualizar, eliminar, obtenerPorId } = useGastos();
    const { categorias } = useCategorias();
    const { comercios } = useComercios();
    const { mediosPago } = useMediosPago();
    const { usuarios } = useUsuarios();
    const [modalFormAbierto, setModalFormAbierto] = useState(false);
    const [gastoEditando, setGastoEditando] = useState(null);
    const [cargandoEdicion, setCargandoEdicion] = useState(false);

    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroActivo, setFiltroActivo] = useState("");

    const opcionesCategorias = useMemo(() => {
        const nombres = [...new Set(gastos.map((g) => g.categoria?.nombre).filter(Boolean))];
        return nombres.sort().map((n) => ({ value: n, label: n }));
    }, [gastos]);

    const gastosFiltrados = useMemo(() => {
        return gastos.filter((g) => {
            if (filtroCategoria && g.categoria?.nombre !== filtroCategoria) return false;
            if (filtroTipo && g.tipoGasto !== filtroTipo) return false;
            if (filtroActivo !== "" && String(g.activo) !== filtroActivo) return false;
            return true;
        });
    }, [gastos, filtroCategoria, filtroTipo, filtroActivo]);

    const hayFiltros = Boolean(filtroCategoria || filtroTipo || filtroActivo);
    function limpiarFiltros() {
        setFiltroCategoria("");
        setFiltroTipo("");
        setFiltroActivo("");
        setPaginaActual(1);
    }

    function abrirCrear() {
        setGastoEditando(null);
        setModalFormAbierto(true);
    }

    async function abrirEditar(gasto) {
        setCargandoEdicion(true);
        try {
            const gastoCompleto = await obtenerPorId(gasto.id);
            setGastoEditando(gastoCompleto);
            setModalFormAbierto(true);
        } catch {
            alertas.error("No se pudo cargar el gasto para editar.");
        } finally {
            setCargandoEdicion(false);
        }
    }

    function cerrarForm() {
        setModalFormAbierto(false);
        setGastoEditando(null);
    }

    async function handleGuardar(datos) {
        if (gastoEditando) {
            await actualizar(gastoEditando.id, datos);
            alertas.exito("Gasto actualizado");
        } else {
            await crear(datos);
            alertas.exito("Gasto registrado");
        }
        cerrarForm();
    }

    async function handleEliminar(gasto) {
        const confirmado = await alertas.confirmar({
            titulo: "¿Eliminar gasto?",
            texto: `Se eliminará "${gasto.descripcion}" permanentemente.`,
            textoConfirmar: "Sí, eliminar",
        });
        if (!confirmado) return;
        try {
            await eliminar(gasto.id);
            alertas.exito("Gasto eliminado");
        } catch (err) {
            alertas.error("No se pudo eliminar: " + err.message);
        }
    }

    const POR_PAGINA = 5;
    const [paginaActual, setPaginaActual] = useState(1);
    const totalPaginas = Math.ceil(gastosFiltrados.length / POR_PAGINA);
    const gastosPagina = gastosFiltrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

    if (cargando) return <p className={styles.message}>Cargando gastos...</p>;
    if (error)
        return (
            <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>
        );

    return (
        <div className={styles.panel}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gastos</h1>
                    <p className={styles.subtitle}>
                        El registro de a dónde se va tu dinero.
                    </p>
                </div>
                <button onClick={abrirCrear} className={styles.btnNuevo}>
                    + Nuevo gasto
                </button>
            </header>

            <FiltroBar hayFiltros={hayFiltros} onLimpiar={limpiarFiltros}>
                <FiltroSelect
                    label="Categoría"
                    value={filtroCategoria}
                    onChange={(v) => { setFiltroCategoria(v); setPaginaActual(1); }}
                    options={opcionesCategorias}
                />
                <FiltroSelect
                    label="Tipo de gasto"
                    value={filtroTipo}
                    onChange={(v) => { setFiltroTipo(v); setPaginaActual(1); }}
                    options={[
                        { value: "HORMIGA", label: "Hormiga" },
                        { value: "FIJO", label: "Fijo" },
                        { value: "VARIABLE", label: "Variable" },
                        { value: "EXTRAORDINARIO", label: "Extraordinario" },
                    ]}
                />
                <FiltroSelect
                    label="Activo"
                    value={filtroActivo}
                    onChange={(v) => { setFiltroActivo(v); setPaginaActual(1); }}
                    options={[
                        { value: "true", label: "Sí" },
                        { value: "false", label: "No" },
                    ]}
                />
            </FiltroBar>

            {gastosFiltrados.length === 0 ? (
                <p className={styles.empty}>
                    {hayFiltros ? "Sin resultados con los filtros aplicados." : "No hay gastos registrados. Crea el primero con el botón de arriba."}
                </p>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th className={styles.amountCol}>Monto</th>
                                <th>Moneda</th>
                                <th>Tipo</th>
                                <th>Categoría</th>
                                <th>Comercio</th>
                                <th>Medio de pago</th>
                                <th>Usuario</th>
                                <th>Lugar</th>
                                <th className={styles.centerCol}>Impacto</th>
                                <th className={styles.centerCol}>Recurrente</th>
                                <th className={styles.centerCol}>Activo</th>
                                <th className={styles.centerCol}>Imagen</th>
                                <th>Observaciones</th>
                                <th className={styles.actionsCol}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gastosPagina.map((g) => (
                                <tr key={g.id}>
                                    <td className={styles.nowrap}>{formatoFecha(g.fecha)}</td>
                                    <td className={styles.descCell}>{g.descripcion}</td>
                                    <td className={`${styles.amountCell} ${styles.amountCol}`}>
                                        {formatoMoneda(g.monto)}
                                    </td>
                                    <td className={styles.nowrap}>
                                        <span className={styles.codeBadge}>{g.moneda}</span>
                                    </td>
                                    <td className={styles.nowrap}>
                                        <span className={styles.codeBadge}>{g.tipoGasto}</span>
                                    </td>
                                    <td className={styles.truncate}>
                                        {g.categoria?.icono ? `${g.categoria.icono} ` : ""}
                                        {g.categoria?.nombre || "—"}
                                    </td>
                                    <td className={styles.truncate}>{g.comercio?.nombre || "—"}</td>
                                    <td className={styles.truncate}>{g.medioPago?.nombre || "—"}</td>
                                    <td className={styles.truncate}>
                                        {g.usuario
                                            ? `${g.usuario.nombre} ${g.usuario.apellidos}`
                                            : "—"}
                                    </td>
                                    <td className={styles.truncate}>{g.lugar || "—"}</td>
                                    <td className={styles.centerCol}>
                                        <span className={styles.impactoBadge}>{g.impactoFinanciero}</span>
                                    </td>
                                    <td className={styles.centerCol}>
                                        <span
                                            className={`${styles.boolBadge} ${g.esRecurrente ? styles.boolYes : styles.boolNo
                                                }`}
                                        >
                                            {g.esRecurrente ? "Sí" : "No"}
                                        </span>
                                    </td>
                                    <td className={styles.centerCol}>
                                        <span
                                            className={`${styles.boolBadge} ${g.activo ? styles.boolYes : styles.boolNo
                                                }`}
                                        >
                                            {g.activo ? "Sí" : "No"}
                                        </span>
                                    </td>
                                    <td className={styles.centerCol}>
                                        {g.imagen ? (
                                            <a
                                                href={g.imagen}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.imagenLink}
                                            >
                                                Ver
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className={styles.truncate}>{g.observaciones || "—"}</td>
                                    <td className={styles.actionsCell}>
                                        <button
                                            onClick={() => abrirEditar(g)}
                                            className={`${styles.actionBtn} ${styles.editBtn}`}
                                            title="Editar"
                                            aria-label={`Editar ${g.descripcion}`}
                                            disabled={cargandoEdicion}
                                        >
                                            {cargandoEdicion ? "⏳" : "✏️"}
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(g)}
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            title="Eliminar"
                                            aria-label={`Eliminar ${g.descripcion}`}
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPaginas > 1 && (
                <div className={styles.paginacion}>
                    <button
                        className={styles.paginaBtnFlecha}
                        onClick={() => setPaginaActual((p) => p - 1)}
                        disabled={paginaActual === 1}
                        aria-label="Página anterior"
                    >
                        ‹
                    </button>
                    <div className={styles.paginaDots}>
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${paginaActual === i + 1 ? styles.dotActivo : ""}`}
                                onClick={() => setPaginaActual(i + 1)}
                                aria-label={`Página ${i + 1}`}
                            />
                        ))}
                    </div>
                    <button
                        className={styles.paginaBtnFlecha}
                        onClick={() => setPaginaActual((p) => p + 1)}
                        disabled={paginaActual === totalPaginas}
                        aria-label="Página siguiente"
                    >
                        ›
                    </button>
                </div>
            )}

            <Modal isOpen={modalFormAbierto} onClose={cerrarForm}>
                <GastoForm
                    gastoInicial={gastoEditando}
                    onGuardar={handleGuardar}
                    onCancelar={cerrarForm}
                    categorias={categorias}
                    comercios={comercios}
                    mediosPago={mediosPago}
                    usuarios={usuarios}
                />
            </Modal>
        </div>
    );
}

export default GastosPage;
