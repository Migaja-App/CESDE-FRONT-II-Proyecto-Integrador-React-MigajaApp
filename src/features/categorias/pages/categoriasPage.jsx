import { useState } from "react";
import { useCategorias } from "../hooks/useCategorias";
import Modal from "../../../shared/components/modal/modal";
import CategoriaCard from "../components/categoriaCard/categoriaCard";
import CategoriaForm from "../components/categoriaForm/categoriaForm";
import { alertas } from "../../../shared/utils/alertas";
import styles from "./categoriasPage.module.css";

function CategoriasPage() {
  const { categorias, cargando, error, crear, actualizar, eliminar } =
    useCategorias();
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  function abrirCrear() {
    setCategoriaEditando(null);
    setModalFormAbierto(true);
  }

  function abrirEditar() {
    setCategoriaEditando(categoriaSeleccionada);
    setCategoriaSeleccionada(null);
    setModalFormAbierto(true);
  }

  function cerrarForm() {
    setModalFormAbierto(false);
    setCategoriaEditando(null);
  }

  async function handleGuardar(datos) {
    if (categoriaEditando) {
      await actualizar(categoriaEditando.id, datos);
      alertas.exito("Categoría actualizada");
    } else {
      await crear(datos);
      alertas.exito("Categoría creada");
    }
    cerrarForm();
  }

  async function handleEliminar() {
    const cat = categoriaSeleccionada;
    if (!cat) return;
    const confirmado = await alertas.confirmar({
      titulo: "¿Eliminar categoría?",
      texto: `Se eliminará "${cat.nombre}" permanentemente.`,
      textoConfirmar: "Sí, eliminar",
    });
    if (!confirmado) return;
    try {
      await eliminar(cat.id);
      setCategoriaSeleccionada(null);
      alertas.exito("Categoría eliminada");
    } catch (err) {
      alertas.error("No se pudo eliminar: " + err.message);
    }
  }

  const POR_PAGINA = 5;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.ceil(categorias.length / POR_PAGINA);
  const categoriasPagina = categorias.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  if (cargando) return <p className={styles.message}>Cargando categorías...</p>;
  if (error)
    return (
      <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>
    );

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mis Categorías</h1>
        <p className={styles.subtitle}>
          Organiza tus gastos en grupos para ver en qué se te va el dinero.
        </p>
      </header>

      <div className={styles.grid}>
        {categoriasPagina.map((cat) => (
          <CategoriaCard
            key={cat.id}
            categoria={cat}
            onClick={setCategoriaSeleccionada}
          />
        ))}

        <button type="button" className={styles.addCard} onClick={abrirCrear}>
          <div className={styles.addIcon}>+</div>
          <span className={styles.addLabel}>Añadir nuevo</span>
        </button>
      </div>

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
        <CategoriaForm
          categoriaInicial={categoriaEditando}
          onGuardar={handleGuardar}
          onCancelar={cerrarForm}
        />
      </Modal>

      <Modal
        isOpen={Boolean(categoriaSeleccionada)}
        onClose={() => setCategoriaSeleccionada(null)}
      >
        {categoriaSeleccionada && (
          <div className={styles.optionsContent}>
            <div className={styles.optionsIcon}>
              <span className={styles.optionsIconText}>
                {categoriaSeleccionada.icono || "📌"}
              </span>
            </div>
            <h2 className={styles.optionsTitle}>
              {categoriaSeleccionada.nombre}
            </h2>
            <p className={styles.optionsSubtitle}>
              ¿Qué deseas hacer con esta categoría? Puedes editar sus detalles o
              eliminarla permanentemente.
            </p>
            <button onClick={abrirEditar} className={styles.btnEditar}>
              Editar Categoría
            </button>
            <button onClick={handleEliminar} className={styles.btnEliminar}>
              Eliminar Categoría
            </button>
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className={styles.btnCancelar}
            >
              Cancelar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CategoriasPage;
