import styles from "./graficaPlaceholder.module.css";

function GraficaPlaceholder({ titulo }) {
    return (
        <section className={styles.panel}>
            <h2 className={styles.title}>{titulo}</h2>
            <div className={styles.area} />
        </section>
    );
}

export default GraficaPlaceholder;
