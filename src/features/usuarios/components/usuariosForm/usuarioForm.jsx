import { useState } from "react";
import styles from "./usuarioForm.module.css";

const TIPOS_DOCUMENTO = [
    { valor: "CEDULA_DE_CIUDADANIA", etiqueta: "Cédula de ciudadanía" },
    { valor: "TARJETA_DE_IDENTIDAD", etiqueta: "Tarjeta de identidad" },
    { valor: "CEDULA_DE_EXTRANJERIA", etiqueta: "Cédula de extranjería" },
];

const ROLES = [
    { valor: "ADMINISTRADOR", etiqueta: "Administrador" },
    { valor: "CLIENTE", etiqueta: "Cliente" },
    { valor: "EMPLEADO", etiqueta: "Empleado" },
];

const ESTADO_INICIAL = {
    nombre: "",
    apellidos: "",
    tipoDocumento: "CEDULA_DE_CIUDADANIA",
    numeroDocumento: "",
    edad: "",
    email: "",
    telefono: "",
    direccion: "",
    rol: "CLIENTE",
};

function UsuarioForm({ usuarioInicial, onGuardar, onCancelar }) {
    const [formData, setFormData] = useState(usuarioInicial || ESTADO_INICIAL);
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);

    const esEdicion = Boolean(usuarioInicial);

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
                edad: parseInt(formData.edad, 10),
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
                <span className={styles.iconPreview}>👤</span>
            </div>

            <h2 className={styles.title}>
                {esEdicion ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <p className={styles.subtitle}>
                {esEdicion
                    ? "Modifica los datos del usuario."
                    : "Registra un nuevo usuario en la app."}
            </p>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Nombre</label>
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        className={styles.input}
                        placeholder="Ej: María"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Apellidos</label>
                    <input
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        className={styles.input}
                        placeholder="Ej: Pérez Gómez"
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Tipo de documento</label>
                    <select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    >
                        {TIPOS_DOCUMENTO.map((t) => (
                            <option key={t.valor} value={t.valor}>
                                {t.etiqueta}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Número de documento</label>
                    <input
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                        required
                        maxLength={15}
                        className={styles.input}
                        placeholder="1234567890"
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Edad</label>
                    <input
                        name="edad"
                        type="number"
                        min={0}
                        max={120}
                        value={formData.edad}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="25"
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
                        maxLength={10}
                        className={styles.input}
                        placeholder="3001234567"
                    />
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className={styles.input}
                    placeholder="usuario@correo.com"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Dirección</label>
                <input
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className={styles.input}
                    placeholder="Calle 123 #45-67"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Rol</label>
                <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    required
                    className={styles.input}
                >
                    {ROLES.map((r) => (
                        <option key={r.valor} value={r.valor}>
                            {r.etiqueta}
                        </option>
                    ))}
                </select>
            </div>

            {errorEnvio && <p className={styles.error}>{errorEnvio}</p>}

            <button type="submit" className={styles.btnConfirm} disabled={enviando}>
                {enviando
                    ? "Guardando..."
                    : esEdicion
                        ? "Actualizar Usuario"
                        : "Guardar Usuario"}
            </button>
            <button type="button" onClick={onCancelar} className={styles.btnCancel}>
                Cancelar
            </button>
        </form>
    );
}

export default UsuarioForm;
