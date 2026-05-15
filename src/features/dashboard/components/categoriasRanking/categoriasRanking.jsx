import { formatoMoneda } from "../../../../shared/utils/format";
import { useState } from "react";
import styles from "./categoriasRanking.module.css";

function CategoriasRanking({ categorias }) {

    if (categorias.length === 0) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.title}>Gastos por categoría</h2>
                <p className={styles.empty}>Sin datos para mostrar.</p>
            </section>
        );
    }

    const max = categorias[0].total || 1;
    const NUMERO_DE_REGISTROS_POR_PAGINA = 3;
    const [paginaActual, setPaginaActual] = useState(1);
    const totalPaginas = Math.ceil(categorias.length / NUMERO_DE_REGISTROS_POR_PAGINA,);
    const inicio = (paginaActual - 1) * NUMERO_DE_REGISTROS_POR_PAGINA;
    const categoriasPagina = categorias.slice(inicio, inicio + NUMERO_DE_REGISTROS_POR_PAGINA);


    return (
        <section className={styles.panel}>
            <h2 className={styles.title}>Gastos por categoría</h2>
            <div className={styles.lista}>
                {categoriasPagina.map((c) => {
                    const porcentaje = (c.total / max) * 100;
                    return (
                        <div key={c.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.nombre}>
                                    {c.icono ? `${c.icono} ` : ""}
                                    {c.nombre}
                                </span>
                                <span className={styles.monto}>{formatoMoneda(c.total)}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <div
                                    className={styles.barFill}
                                    style={{
                                        width: `${porcentaje}%`,
                                        background:
                                            c.color ||
                                            "linear-gradient(90deg, var(--primary-coral) 0%, var(--accent-peach) 100%)",
                                    }}
                                />
                            </div>
                            <span className={styles.meta}>
                                {c.cantidad} {c.cantidad === 1 ? "gasto" : "gastos"}
                            </span>
                        </div>
                    );
                })}
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
        </section>
    );
}

export default CategoriasRanking;
