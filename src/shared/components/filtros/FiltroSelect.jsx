import styles from "./filtros.module.css";

function FiltroSelect({ label, value, onChange, options, placeholder = "Todos" }) {
    return (
        <div className={styles.grupo}>
            <label className={styles.label}>{label}</label>
            <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">{placeholder}</option>
                {options.map((op) => (
                    <option key={op.value} value={op.value}>
                        {op.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function FiltroBar({ children, onLimpiar, hayFiltros }) {
    return (
        <div className={styles.bar}>
            <div className={styles.selectsRow}>{children}</div>
            {hayFiltros && (
                <button className={styles.btnLimpiar} onClick={onLimpiar}>
                    × Limpiar filtros
                </button>
            )}
        </div>
    );
}

export default FiltroSelect;
