import { useState, useMemo } from "react";
import { useUsuarios } from "../hooks/useUsuarios";
import UsuarioForm from "../components/usuariosForm/usuarioForm";
import Modal from "../../../shared/components/modal/modal";
import { alertas } from "../../../shared/utils/alertas";
import FiltroSelect, { FiltroBar } from "../../../shared/components/filtros/FiltroSelect";
import styles from "./usuariosPage.module.css";

const ETIQUETA_TIPO_DOC = {
  CEDULA_DE_CIUDADANIA: "CC",
  TARJETA_DE_IDENTIDAD: "TI",
  CEDULA_DE_EXTRANJERIA: "CE",
};

const ETIQUETA_ROL = {
  ADMINISTRADOR: "Administrador",
  CLIENTE: "Cliente",
  EMPLEADO: "Empleado",
};

function UsuariosPage() {
  const { usuarios, cargando, error, crear, actualizar, eliminar } =
    useUsuarios();
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [filtroRol, setFiltroRol] = useState("");
  const [filtroTipoDoc, setFiltroTipoDoc] = useState("");

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (filtroRol && u.rol !== filtroRol) return false;
      if (filtroTipoDoc && u.tipoDocumento !== filtroTipoDoc) return false;
      return true;
    });
  }, [usuarios, filtroRol, filtroTipoDoc]);

  const hayFiltros = Boolean(filtroRol || filtroTipoDoc);
  function limpiarFiltros() { setFiltroRol(""); setFiltroTipoDoc(""); setPaginaActual(1); }

  function abrirCrear() {
    setUsuarioEditando(null);
    setModalFormAbierto(true);
  }

  function abrirEditar(usuario) {
    setUsuarioEditando(usuario);
    setModalFormAbierto(true);
  }

  function cerrarForm() {
    setModalFormAbierto(false);
    setUsuarioEditando(null);
  }

  async function handleGuardar(datos) {
    if (usuarioEditando) {
      await actualizar(usuarioEditando.id, datos);
      alertas.exito("Usuario actualizado");
    } else {
      await crear(datos);
      alertas.exito("Usuario creado");
    }
    cerrarForm();
  }

  async function handleEliminar(usuario) {
    const confirmado = await alertas.confirmar({
      titulo: "¿Eliminar usuario?",
      texto: `Se eliminará "${usuario.nombre} ${usuario.apellidos}" permanentemente.`,
      textoConfirmar: "Sí, eliminar",
    });
    if (!confirmado) return;
    try {
      await eliminar(usuario.id);
      alertas.exito("Usuario eliminado");
    } catch (err) {
      alertas.error("No se pudo eliminar: " + err.message);
    }
  }

  const POR_PAGINA = 5;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / POR_PAGINA);
  const usuariosPagina = usuariosFiltrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  if (cargando) return <p className={styles.message}>Cargando usuarios...</p>;
  if (error)
    return (
      <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>
    );

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Usuarios</h1>
          <p className={styles.subtitle}>Las personas registradas en la app.</p>
        </div>
        <button onClick={abrirCrear} className={styles.btnNuevo}>
          + Nuevo usuario
        </button>
      </header>

      <FiltroBar hayFiltros={hayFiltros} onLimpiar={limpiarFiltros}>
        <FiltroSelect
          label="Rol"
          value={filtroRol}
          onChange={(v) => { setFiltroRol(v); setPaginaActual(1); }}
          options={[
            { value: "ADMINISTRADOR", label: "Administrador" },
            { value: "CLIENTE", label: "Cliente" },
            { value: "EMPLEADO", label: "Empleado" },
          ]}
        />
        <FiltroSelect
          label="Tipo de documento"
          value={filtroTipoDoc}
          onChange={(v) => { setFiltroTipoDoc(v); setPaginaActual(1); }}
          options={[
            { value: "CEDULA_DE_CIUDADANIA", label: "Cédula de ciudadanía" },
            { value: "TARJETA_DE_IDENTIDAD", label: "Tarjeta de identidad" },
            { value: "CEDULA_DE_EXTRANJERIA", label: "Cédula de extranjería" },
          ]}
        />
      </FiltroBar>

      {usuariosFiltrados.length === 0 ? (
        <p className={styles.empty}>
          {hayFiltros ? "Sin resultados con los filtros aplicados." : "No hay usuarios registrados. Crea el primero con el botón de arriba."}
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Documento</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th className={styles.actionsCol}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPagina.map((u) => (
                <tr key={u.id}>
                  <td className={styles.nameCell}>
                    {u.nombre} {u.apellidos}
                  </td>
                  <td>
                    <span className={styles.docTipo}>
                      {ETIQUETA_TIPO_DOC[u.tipoDocumento] || u.tipoDocumento}
                    </span>{" "}
                    {u.numeroDocumento}
                  </td>
                  <td className={styles.truncate}>{u.email}</td>
                  <td>{u.telefono}</td>
                  <td>
                    <span
                      className={`${styles.rolBadge} ${
                        styles[`rol_${u.rol}`] || ""
                      }`}
                    >
                      {ETIQUETA_ROL[u.rol] || u.rol}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => abrirEditar(u)}
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      title="Editar"
                      aria-label={`Editar ${u.nombre}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleEliminar(u)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Eliminar"
                      aria-label={`Eliminar ${u.nombre}`}
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
        <UsuarioForm
          usuarioInicial={usuarioEditando}
          onGuardar={handleGuardar}
          onCancelar={cerrarForm}
        />
      </Modal>
    </div>
  );
}

export default UsuariosPage;
