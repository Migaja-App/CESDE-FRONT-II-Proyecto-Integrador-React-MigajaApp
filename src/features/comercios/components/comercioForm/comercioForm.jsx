import { useState } from "react";
import styles from "./comercioForm.module.css";

const ESTADO_INICIAL = {
    nit: "",
    nombre: "",
    correo: "",
    direccion: "",
    telefono: "",
    sitioWeb: "",
    actividad: "",
    representanteLegal: "",
};

function ComercioForm({ comercioInicial, onGuardar, onCancelar }) {
    const [formData, setFormData] = useState(comercioInicial || ESTADO_INICIAL);
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);

    const esEdicion = Boolean(comercioInicial);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setEnviando(true);
        setErrorEnvio(null);
        try {
            const datosParaEnviar = {
                ...formData,
                nit: parseInt(formData.nit, 10),
            };
            await onGuardar(datosParaEnviar);
        } catch (err) {
            setErrorEnvio(err.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.iconBadge}>
                <span className={styles.iconPreview}>🏪</span>
            </div>

            <h2 className={styles.title}>
                {esEdicion ? "Editar Comercio" : "Nuevo Comercio"}
            </h2>
            <p className={styles.subtitle}>
                {esEdicion
                    ? "Modifica los datos del comercio."
                    : "Registra un nuevo comercio donde realizas gastos."}
            </p>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>NIT</label>
                    <input
                        name="nit"
                        type="number"
                        value={formData.nit}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="900123456"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Teléfono</label>
                    <input
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        maxLength={11}
                        className={styles.input}
                        placeholder="3001234567"
                    />
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Nombre del comercio</label>
                <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className={styles.input}
                    placeholder="Ej: Tienda La Esquina"
                />
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Correo</label>
                    <input
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        maxLength={70}
                        className={styles.input}
                        placeholder="contacto@comercio.com"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Sitio web (opcional)</label>
                    <input
                        name="sitioWeb"
                        type="url"
                        value={formData.sitioWeb}
                        onChange={handleChange}
                        maxLength={100}
                        className={styles.input}
                        placeholder="https://..."
                    />
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Dirección</label>
                <input
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className={styles.input}
                    placeholder="Calle 123 #45-67"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Actividad económica</label>
                <input
                    name="actividad"
                    value={formData.actividad}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    className={styles.input}
                    placeholder="Ej: Venta al por menor de alimentos"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Representante legal</label>
                <input
                    name="representanteLegal"
                    value={formData.representanteLegal}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className={styles.input}
                    placeholder="Nombre completo"
                />
            </div>

            {errorEnvio && <p className={styles.error}>{errorEnvio}</p>}

            <button type="submit" className={styles.btnConfirm} disabled={enviando}>
                {enviando
                    ? "Guardando..."
                    : esEdicion
                        ? "Actualizar Comercio"
                        : "Guardar Comercio"}
            </button>
            <button type="button" onClick={onCancelar} className={styles.btnCancel}>
                Cancelar
            </button>
        </form>
    );
}

export default ComercioForm;
