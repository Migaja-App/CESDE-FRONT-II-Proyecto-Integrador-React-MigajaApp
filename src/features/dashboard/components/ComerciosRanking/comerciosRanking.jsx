import { formatoMoneda } from "../../../../shared/utils/format";
import styles from "./comerciosRanking.module.css";

function ComerciosRanking({ comercios }) {
    if (comercios.length === 0) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.title}>Top comercios</h2>
                <p className={styles.empty}>Sin datos para mostrar.</p>
            </section>
        );
    }

    const max = comercios[0].total || 1;

    return (
        <section className={styles.panel}>
            <h2 className={styles.title}>Top comercios</h2>
            <div className={styles.lista}>
                {comercios.map((c, i) => {
                    const porcentaje = (c.total / max) * 100;
                    return (
                        <div key={c.id} className={styles.item}>
                            <div
                                className={`${styles.rank} ${i === 0 ? styles.rankTop : ""}`}
                            >
                                {i + 1}
                            </div>
                            <div className={styles.body}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.nombre}>{c.nombre}</span>
                                    <span className={styles.monto}>
                                        {formatoMoneda(c.total)}
                                    </span>
                                </div>
                                <div className={styles.barTrack}>
                                    <div
                                        className={styles.barFill}
                                        style={{ width: `${porcentaje}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default ComerciosRanking;