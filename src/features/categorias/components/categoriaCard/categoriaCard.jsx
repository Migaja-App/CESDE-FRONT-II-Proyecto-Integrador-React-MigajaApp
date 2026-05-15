import styles from "./categoriaCard.module.css";

function CategoriaCard({ categoria, onClick }) {
  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={() => onClick(categoria)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(categoria);
        }
      }}
    >
      <div className={styles.icon} style={{ backgroundColor: categoria.color || "var(--bg-main)" }}>
        {categoria.icono || "📌"}
      </div>
      <span className={styles.name}>{categoria.nombre}</span>
    </div>
  );
}

export default CategoriaCard;
