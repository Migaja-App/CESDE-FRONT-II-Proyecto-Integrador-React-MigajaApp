import { useState, useMemo } from "react";
import { useMediosPago } from "../hooks/useMediosPago";
import MedioPagoForm from "../components/mediosPagoForm/mediosPagoForm";
import Modal from "../../../shared/components/modal/modal";
import { alertas } from "../../../shared/utils/alertas";
import FiltroSelect, { FiltroBar } from "../../../shared/components/filtros/FiltroSelect";
import styles from "./mediosPagoPage.module.css";

const ETIQUETA_FRANQUICIA = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  AMERICAN_EXPRESS: "American Express",
};

function MediosPagoPage() {
  const { mediosPago, cargando, error, crear, actualizar, eliminar } =
    useMediosPago();
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [medioPagoEditando, setMedioPagoEditando] = useState(null);

  const [filtroFranquicia, setFiltroFranquicia] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const mediosFiltrados = useMemo(() => {
    return mediosPago.filter((mp) => {
      if (filtroFranquicia && mp.franquicia !== filtroFranquicia) return false;
      if (filtroEstado !== "" && String(mp.estado) !== filtroEstado) return false;
      return true;
    });
  }, [mediosPago, filtroFranquicia, filtroEstado]);

  const hayFiltros = Boolean(filtroFranquicia || filtroEstado);
  function limpiarFiltros() { setFiltroFranquicia(""); setFiltroEstado(""); setPaginaActual(1); }

  function abrirCrear() {
    setMedioPagoEditando(null);
    setModalFormAbierto(true);
  }

  function abrirEditar(medioPago) {
    setMedioPagoEditando(medioPago);
    setModalFormAbierto(true);
  }

  function cerrarForm() {
    setModalFormAbierto(false);
    setMedioPagoEditando(null);
  }

  async function handleGuardar(datos) {
    if (medioPagoEditando) {
      await actualizar(medioPagoEditando.id, datos);
      alertas.exito("Medio de pago actualizado");
    } else {
      await crear(datos);
      alertas.exito("Medio de pago creado");
    }
    cerrarForm();
  }

  async function handleEliminar(medioPago) {
    const confirmado = await alertas.confirmar({
      titulo: "¿Eliminar medio de pago?",
      texto: `Se eliminará "${medioPago.nombre}" permanentemente.`,
      textoConfirmar: "Sí, eliminar",
    });
    if (!confirmado) return;
    try {
      await eliminar(medioPago.id);
      alertas.exito("Medio de pago eliminado");
    } catch (err) {
      alertas.error("No se pudo eliminar: " + err.message);
    }
  }

  const POR_PAGINA = 5;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.ceil(mediosFiltrados.length / POR_PAGINA);
  const mediosPagina = mediosFiltrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  if (cargando)
    return <p className={styles.message}>Cargando medios de pago...</p>;
  if (error)
    return (
      <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>
    );

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Medios de pago</h1>
          <p className={styles.subtitle}>
            Las tarjetas y formas de pago asociadas a cada usuario.
          </p>
        </div>
        <button onClick={abrirCrear} className={styles.btnNuevo}>
          + Nuevo medio de pago
        </button>
      </header>

      <FiltroBar hayFiltros={hayFiltros} onLimpiar={limpiarFiltros}>
        <FiltroSelect
          label="Franquicia"
          value={filtroFranquicia}
          onChange={(v) => { setFiltroFranquicia(v); setPaginaActual(1); }}
          options={[
            { value: "VISA", label: "Visa" },
            { value: "MASTERCARD", label: "Mastercard" },
            { value: "AMERICAN_EXPRESS", label: "American Express" },
          ]}
        />
        <FiltroSelect
          label="Estado"
          value={filtroEstado}
          onChange={(v) => { setFiltroEstado(v); setPaginaActual(1); }}
          options={[
            { value: "true", label: "Activo" },
            { value: "false", label: "Inactivo" },
          ]}
        />
      </FiltroBar>

      {mediosFiltrados.length === 0 ? (
        <p className={styles.empty}>
          {hayFiltros ? "Sin resultados con los filtros aplicados." : "No hay medios de pago registrados. Crea el primero con el botón de arriba."}
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Franquicia</th>
                <th>Estado</th>
                <th>Propietario</th>
                <th className={styles.actionsCol}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mediosPagina.map((mp) => (
                <tr key={mp.id}>
                  <td className={styles.nameCell}>{mp.nombre}</td>
                  <td>
                    <span className={styles.franquiciaBadge}>
                      {ETIQUETA_FRANQUICIA[mp.franquicia] || mp.franquicia}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.estadoBadge} ${
                        mp.estado ? styles.estadoActivo : styles.estadoInactivo
                      }`}
                    >
                      {mp.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className={styles.truncate}>
                    {mp.usuario
                      ? `${mp.usuario.nombre} ${mp.usuario.apellidos}`
                      : "—"}
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => abrirEditar(mp)}
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      title="Editar"
                      aria-label={`Editar ${mp.nombre}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleEliminar(mp)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Eliminar"
                      aria-label={`Eliminar ${mp.nombre}`}
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
        <MedioPagoForm
          medioPagoInicial={medioPagoEditando}
          onGuardar={handleGuardar}
          onCancelar={cerrarForm}
        />
      </Modal>
    </div>
  );
}

export default MediosPagoPage;
