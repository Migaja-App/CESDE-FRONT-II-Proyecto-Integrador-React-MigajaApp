import { useState } from "react";
import { useUsuarios } from "../../../usuarios/hooks/useUsuarios";
import styles from "./medioPagoForm.module.css";

const FRANQUICIAS = [
    { valor: "VISA", etiqueta: "Visa" },
    { valor: "MASTERCARD", etiqueta: "Mastercard" },
    { valor: "AMERICAN_EXPRESS", etiqueta: "American Express" },
];

const ESTADO_INICIAL = {
    nombre: "",
    franquicia: "VISA",
    estado: true,
    usuario: null,
};

function MedioPagoForm({ medioPagoInicial, onGuardar, onCancelar }) {
    const { usuarios, cargando: cargandoUsuarios } = useUsuarios();
    const [formData, setFormData] = useState(medioPagoInicial || ESTADO_INICIAL);
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);

    const esEdicion = Boolean(medioPagoInicial);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleUsuarioChange(e) {
        const id = parseInt(e.target.value, 10);
        const usuario = usuarios.find((u) => u.id === id);
        setFormData((prev) => ({ ...prev, usuario: usuario || null }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setEnviando(true);
        setErrorEnvio(null);
        try {
            if (!formData.usuario?.id) {
                throw new Error("Debes seleccionar un usuario propietario");
            }
            const datosParaEnviar = {
                nombre: formData.nombre,
                franquicia: formData.franquicia,
                estado: formData.estado,
                usuario: { id: formData.usuario.id },
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
                <span className={styles.iconPreview}>💳</span>
            </div>

            <h2 className={styles.title}>
                {esEdicion ? "Editar Medio de Pago" : "Nuevo Medio de Pago"}
            </h2>
            <p className={styles.subtitle}>
                {esEdicion
                    ? "Modifica los datos del medio de pago."
                    : "Registra una tarjeta o medio de pago asociado a un usuario."}
            </p>

            <div className={styles.field}>
                <label className={styles.label}>Nombre / Alias</label>
                <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className={styles.input}
                    placeholder="Ej: Visa Bancolombia personal"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Franquicia</label>
                <select
                    name="franquicia"
                    value={formData.franquicia}
                    onChange={handleChange}
                    required
                    className={styles.input}
                >
                    {FRANQUICIAS.map((f) => (
                        <option key={f.valor} value={f.valor}>
                            {f.etiqueta}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Usuario propietario</label>
                <select
                    name="usuarioId"
                    value={formData.usuario?.id || ""}
                    onChange={handleUsuarioChange}
                    required
                    className={styles.input}
                    disabled={cargandoUsuarios}
                >
                    <option value="">
                        {cargandoUsuarios
                            ? "Cargando usuarios..."
                            : "Selecciona un usuario"}
                    </option>
                    {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.nombre} {u.apellidos} — {u.email}
                        </option>
                    ))}
                </select>
                {!cargandoUsuarios && usuarios.length === 0 && (
                    <small className={styles.hint}>
                        No hay usuarios registrados. Crea uno en la sección "Usuarios".
                    </small>
                )}
            </div>

            <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        name="estado"
                        checked={formData.estado}
                        onChange={handleChange}
                        className={styles.checkbox}
                    />
                    <span>Activo</span>
                </label>
            </div>

            {errorEnvio && <p className={styles.error}>{errorEnvio}</p>}

            <button type="submit" className={styles.btnConfirm} disabled={enviando}>
                {enviando
                    ? "Guardando..."
                    : esEdicion
                        ? "Actualizar Medio de Pago"
                        : "Guardar Medio de Pago"}
            </button>
            <button type="button" onClick={onCancelar} className={styles.btnCancel}>
                Cancelar
            </button>
        </form>
    );
}

export default MedioPagoForm;
