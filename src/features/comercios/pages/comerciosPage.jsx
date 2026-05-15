import { useState, useMemo } from "react";
import { useComercios } from "../hooks/useComercios";
import ComercioForm from "../components/comercioForm/comercioForm";
import Modal from "../../../shared/components/modal/modal";
import { alertas } from "../../../shared/utils/alertas";
import FiltroSelect, { FiltroBar } from "../../../shared/components/filtros/FiltroSelect";
import styles from "./comercioPage.module.css";

function ComerciosPage() {
  const { comercios, cargando, error, crear, actualizar, eliminar } =
    useComercios();
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [comercioEditando, setComercioEditando] = useState(null);

  const [filtroActividad, setFiltroActividad] = useState("");

  const opcionesActividad = useMemo(() => {
    const actividades = [...new Set(comercios.map((c) => c.actividad).filter(Boolean))];
    return actividades.sort().map((a) => ({ value: a, label: a }));
  }, [comercios]);

  const comerciosFiltrados = useMemo(() => {
    return comercios.filter((c) => {
      if (filtroActividad && c.actividad !== filtroActividad) return false;
      return true;
    });
  }, [comercios, filtroActividad]);

  const hayFiltros = Boolean(filtroActividad);
  function limpiarFiltros() { setFiltroActividad(""); setPaginaActual(1); }

  function abrirCrear() {
    setComercioEditando(null);
    setModalFormAbierto(true);
  }

  function abrirEditar(comercio) {
    setComercioEditando(comercio);
    setModalFormAbierto(true);
  }

  function cerrarForm() {
    setModalFormAbierto(false);
    setComercioEditando(null);
  }

  async function handleGuardar(datos) {
    if (comercioEditando) {
      await actualizar(comercioEditando.id, datos);
      alertas.exito("Comercio actualizado");
    } else {
      await crear(datos);
      alertas.exito("Comercio creado");
    }
    cerrarForm();
  }

  async function handleEliminar(comercio) {
    const confirmado = await alertas.confirmar({
      titulo: "¿Eliminar comercio?",
      texto: `Se eliminará "${comercio.nombre}" permanentemente.`,
      textoConfirmar: "Sí, eliminar",
    });
    if (!confirmado) return;
    try {
      await eliminar(comercio.id);
      alertas.exito("Comercio eliminado");
    } catch (err) {
      alertas.error("No se pudo eliminar: " + err.message);
    }
  }

  const POR_PAGINA = 5;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.ceil(comerciosFiltrados.length / POR_PAGINA);
  const comerciosPagina = comerciosFiltrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  if (cargando) return <p className={styles.message}>Cargando comercios...</p>;
  if (error)
    return (
      <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>
    );

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Comercios</h1>
          <p className={styles.subtitle}>
            Los lugares donde realizas tus gastos hormiga.
          </p>
        </div>
        <button onClick={abrirCrear} className={styles.btnNuevo}>
          + Nuevo comercio
        </button>
      </header>

      <FiltroBar hayFiltros={hayFiltros} onLimpiar={limpiarFiltros}>
        <FiltroSelect
          label="Actividad"
          value={filtroActividad}
          onChange={(v) => { setFiltroActividad(v); setPaginaActual(1); }}
          options={opcionesActividad}
        />
      </FiltroBar>

      {comerciosFiltrados.length === 0 ? (
        <p className={styles.empty}>
          {hayFiltros ? "Sin resultados con los filtros aplicados." : "No hay comercios registrados. Crea el primero con el botón de arriba."}
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Actividad</th>
                <th className={styles.actionsCol}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comerciosPagina.map((com) => (
                <tr key={com.id}>
                  <td className={styles.nameCell}>{com.nombre}</td>
                  <td>{com.nit}</td>
                  <td className={styles.truncate}>{com.correo}</td>
                  <td>{com.telefono}</td>
                  <td className={styles.truncate}>{com.actividad}</td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => abrirEditar(com)}
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      title="Editar"
                      aria-label={`Editar ${com.nombre}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleEliminar(com)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Eliminar"
                      aria-label={`Eliminar ${com.nombre}`}
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
        <ComercioForm
          comercioInicial={comercioEditando}
          onGuardar={handleGuardar}
          onCancelar={cerrarForm}
        />
      </Modal>
    </div>
  );
}

export default ComerciosPage;
