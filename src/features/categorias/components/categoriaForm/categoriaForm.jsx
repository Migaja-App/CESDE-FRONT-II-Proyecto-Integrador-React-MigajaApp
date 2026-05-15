import { useState } from "react";
import { hoyIso } from "../../../../shared/utils/format";
import styles from "./categoriaForm.module.css";

const ESTADO_INICIAL = {
  nombre: "",
  fechaCreacion: hoyIso(),
  responsable: "",
  justificacion: "",
  descripcion: "",
  prioridad: "MEDIA",
  color: "#EE6055",
  icono: "📌",
  estado: "ACTIVO",
};

function CategoriaForm({ categoriaInicial, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState(categoriaInicial || ESTADO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);

  const esEdicion = Boolean(categoriaInicial);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErrorEnvio(null);
    try {
      await onGuardar(formData);
    } catch (err) {
      setErrorEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.iconBadge}>
        <span className={styles.iconPreview}>{formData.icono}</span>
      </div>

      <h2 className={styles.title}>
        {esEdicion ? "Editar Categoría" : "Nueva Categoría"}
      </h2>
      <p className={styles.subtitle}>
        {esEdicion
          ? "Modifica los detalles de la categoría seleccionada."
          : "Crea una nueva categoría para organizar mejor tus gastos."}
      </p>

      <div className={styles.field}>
        <label className={styles.label}>Nombre de la categoría</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={100}
          className={styles.input}
          placeholder="Ej: Alimentación"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Icono</label>
        <input
          name="icono"
          value={formData.icono}
          onChange={handleChange}
          maxLength={50}
          className={styles.input}
          placeholder="Ej: 🍔 o un texto corto"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Responsable</label>
        <input
          name="responsable"
          value={formData.responsable}
          onChange={handleChange}
          required
          maxLength={100}
          className={styles.input}
          placeholder="Ej: Mateo"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Prioridad</label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={styles.colorInput}
          />
        </div>
      </div>

      {errorEnvio && <p className={styles.error}>{errorEnvio}</p>}

      <button type="submit" className={styles.btnConfirm} disabled={enviando}>
        {enviando
          ? "Guardando..."
          : esEdicion
            ? "Actualizar Categoría"
            : "Guardar Categoría"}
      </button>
      <button type="button" onClick={onCancelar} className={styles.btnCancel}>
        Cancelar
      </button>
    </form>
  );
}

export default CategoriaForm;
