import { useState } from "react";
import { hoyIso } from "../../../../shared/utils/format";
import styles from "./gastosForm.module.css";

const MONEDAS = [
    { valor: "COP", etiqueta: "COP — Peso colombiano" },
    { valor: "USD", etiqueta: "USD — Dólar" },
    { valor: "EUR", etiqueta: "EUR — Euro" },
];

const TIPOS_GASTO = [
    { valor: "HORMIGA", etiqueta: "Hormiga" },
    { valor: "FIJO", etiqueta: "Fijo" },
    { valor: "VARIABLE", etiqueta: "Variable" },
    { valor: "IMPULSIVO", etiqueta: "Impulsivo" },
    { valor: "PLANIFICADO", etiqueta: "Planificado" },
];

const ESTADO_INICIAL = {
    descripcion: "",
    fecha: hoyIso(),
    monto: "",
    imagen: "",
    moneda: "COP",
    lugar: "",
    esRecurrente: false,
    tipoGasto: "HORMIGA",
    impactoFinanciero: 5,
    activo: true,
    observaciones: "",
    categoriaId: "",
    comercioId: "",
    medioPagoId: "",
    usuarioId: "",
};

function GastoForm({ gastoInicial, onGuardar, onCancelar, categorias = [], comercios = [], mediosPago = [], usuarios = [] }) {

    const [formData, setFormData] = useState(() => {
        if (!gastoInicial) return ESTADO_INICIAL;
        return {
            ...gastoInicial,
            categoriaId: gastoInicial.categoria?.id != null ? String(gastoInicial.categoria.id) : "",
            comercioId: gastoInicial.comercio?.id != null ? String(gastoInicial.comercio.id) : "",
            medioPagoId: gastoInicial.medioPago?.id != null ? String(gastoInicial.medioPago.id) : "",
            usuarioId: gastoInicial.usuario?.id != null ? String(gastoInicial.usuario.id) : "",
        };
    });
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);

    const esEdicion = Boolean(gastoInicial);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setEnviando(true);
        setErrorEnvio(null);
        try {
            if (!formData.categoriaId) throw new Error("Selecciona una categoría");
            if (!formData.comercioId) throw new Error("Selecciona un comercio");
            if (!formData.medioPagoId) throw new Error("Selecciona un medio de pago");
            if (!formData.usuarioId) throw new Error("Selecciona un usuario");

            const categoriaSel = categorias.find((c) => String(c.id) === formData.categoriaId);
            const comercioSel = comercios.find((c) => String(c.id) === formData.comercioId);
            const medioPagoSel = mediosPago.find((mp) => String(mp.id) === formData.medioPagoId);
            const usuarioSel = usuarios.find((u) => String(u.id) === formData.usuarioId);

            if (!categoriaSel) throw new Error("Categoría no encontrada");
            if (!comercioSel) throw new Error("Comercio no encontrado");
            if (!medioPagoSel) throw new Error("Medio de pago no encontrado");
            if (!usuarioSel) throw new Error("Usuario no encontrado");

            const datosParaEnviar = {
                descripcion: formData.descripcion,
                fecha: formData.fecha,
                monto: parseFloat(formData.monto),
                imagen: formData.imagen || null,
                moneda: formData.moneda,
                lugar: formData.lugar || null,
                esRecurrente: Boolean(formData.esRecurrente),
                tipoGasto: formData.tipoGasto,
                impactoFinanciero: parseInt(formData.impactoFinanciero, 10),
                activo: Boolean(formData.activo),
                observaciones: formData.observaciones || null,
                categoria: categoriaSel,
                categoriaId: categoriaSel.id,
                comercio: comercioSel,
                comercioId: comercioSel.id,
                medioPago: medioPagoSel,
                medioPagoId: medioPagoSel.id,
                usuario: usuarioSel,
                usuarioId: usuarioSel.id,
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
                <span className={styles.iconPreview}>💸</span>
            </div>

            <h2 className={styles.title}>
                {esEdicion ? "Editar Gasto" : "Nuevo Gasto"}
            </h2>
            <p className={styles.subtitle}>
                {esEdicion
                    ? "Modifica los datos del gasto."
                    : "Registra un gasto hormiga para llevar mejor el control."}
            </p>

            <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <input
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    className={styles.input}
                    placeholder="Ej: Cafecito en la oficina"
                />
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Fecha</label>
                    <input
                        name="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Monto</label>
                    <input
                        name="monto"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.monto}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="5000"
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Moneda</label>
                    <select
                        name="moneda"
                        value={formData.moneda}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    >
                        {MONEDAS.map((m) => (
                            <option key={m.valor} value={m.valor}>
                                {m.etiqueta}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Tipo de gasto</label>
                    <select
                        name="tipoGasto"
                        value={formData.tipoGasto}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    >
                        {TIPOS_GASTO.map((t) => (
                            <option key={t.valor} value={t.valor}>
                                {t.etiqueta}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Categoría</label>
                <select
                    name="categoriaId"
                    value={formData.categoriaId ?? ""}
                    onChange={handleChange}
                    required
                    className={styles.input}
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                            {c.icono ? `${c.icono} ` : ""}
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Comercio</label>
                <select
                    name="comercioId"
                    value={formData.comercioId ?? ""}
                    onChange={handleChange}
                    required
                    className={styles.input}
                >
                    <option value="">Selecciona un comercio</option>
                    {comercios.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Medio de pago</label>
                <select
                    name="medioPagoId"
                    value={formData.medioPagoId ?? ""}
                    onChange={handleChange}
                    required
                    className={styles.input}
                >
                    <option value="">Selecciona un medio de pago</option>
                    {mediosPago.map((mp) => (
                        <option key={mp.id} value={String(mp.id)}>
                            {mp.nombre} ({mp.franquicia})
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Usuario</label>
                <select
                    name="usuarioId"
                    value={formData.usuarioId ?? ""}
                    onChange={handleChange}
                    required
                    className={styles.input}
                >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map((u) => (
                        <option key={u.id} value={String(u.id)}>
                            {u.nombre} {u.apellidos}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Lugar (opcional)</label>
                <input
                    name="lugar"
                    value={formData.lugar ?? ""}
                    onChange={handleChange}
                    maxLength={150}
                    className={styles.input}
                    placeholder="Ej: Centro comercial X"
                />
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Impacto financiero (1-10)</label>
                    <input
                        name="impactoFinanciero"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.impactoFinanciero}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="esRecurrente"
                            checked={formData.esRecurrente}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span>¿Es recurrente?</span>
                    </label>
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                        className={styles.checkbox}
                    />
                    <span>Activo</span>
                </label>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>URL de imagen (opcional)</label>
                <input
                    name="imagen"
                    type="url"
                    value={formData.imagen ?? ""}
                    onChange={handleChange}
                    maxLength={255}
                    className={styles.input}
                    placeholder="https://..."
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Observaciones (opcional)</label>
                <textarea
                    name="observaciones"
                    value={formData.observaciones ?? ""}
                    onChange={handleChange}
                    maxLength={300}
                    rows={3}
                    className={styles.input}
                    placeholder="Notas adicionales..."
                />
            </div>

            {errorEnvio && <p className={styles.error}>{errorEnvio}</p>}

            <button type="submit" className={styles.btnConfirm} disabled={enviando}>
                {enviando
                    ? "Guardando..."
                    : esEdicion
                        ? "Actualizar Gasto"
                        : "Guardar Gasto"}
            </button>
            <button type="button" onClick={onCancelar} className={styles.btnCancel}>
                Cancelar
            </button>
        </form>
    );
}

export default GastoForm;