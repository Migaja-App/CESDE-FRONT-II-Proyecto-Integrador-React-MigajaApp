import { useState } from "react";
import styles from "./graficaPlaceholder.module.css";

function GraficaPlaceholder({ titulo, graficas }) {
    const [paginaActual, setPaginaActual] = useState(1);
    const totalPaginas = graficas ? graficas.length : 0;
    const graficaActual = graficas ? graficas[paginaActual - 1] : null;

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>{titulo}</h2>
                {graficaActual && (
                    <span className={styles.subtitulo}>{graficaActual.titulo}</span>
                )}
            </div>

            {graficas ? (
                <>
                    <div className={styles.area}>
                        <img
                            src={graficaActual.src}
                            alt={graficaActual.titulo}
                            className={styles.imagen}
                        />
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
                </>
            ) : (
                <div className={styles.areaVacia} />
            )}
        </section>
    );
}

export default GraficaPlaceholder;
