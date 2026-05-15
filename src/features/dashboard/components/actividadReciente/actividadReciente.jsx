import { formatoMoneda, formatoFecha } from "../../../../shared/utils/format";
import styles from "./actividadReciente.module.css";

function ActividadReciente({ gastos }) {
    if (gastos.length === 0) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.title}>Actividad reciente</h2>
                <p className={styles.empty}>No hay actividad para mostrar.</p>
            </section>
        );
    }

    return (
        <section className={styles.panel}>
            <h2 className={styles.title}>Actividad reciente</h2>
            <div className={styles.lista}>
                {gastos.map((g) => (
                    <div key={g.id} className={styles.item}>
                        <div className={styles.icon}>{g.categoria?.icono || "💸"}</div>
                        <div className={styles.info}>
                            <div className={styles.itemHeader}>
                                <span className={styles.desc}>{g.descripcion}</span>
                                <span className={styles.amount}>
                                    −{formatoMoneda(g.monto)}
                                </span>
                            </div>
                            <div className={styles.meta}>
                                <span>{g.categoria?.nombre || "Sin categoría"}</span>
                                <span>·</span>
                                <span>{formatoFecha(g.fecha)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ActividadReciente;