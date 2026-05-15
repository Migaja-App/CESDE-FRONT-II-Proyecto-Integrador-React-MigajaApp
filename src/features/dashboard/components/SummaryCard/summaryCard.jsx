import styles from "./summaryCard.module.css";

function SummaryCard({ icon, label, value, variant = "default" }) {
    return (
        <div
            className={`${styles.card} ${variant === "hero" ? styles.cardHero : ""
                }`}
        >
            <div className={`${styles.icon} ${styles[`icon_${variant}`] || ""}`}>
                {icon}
            </div>
            <div className={styles.info}>
                <h3 className={styles.label}>{label}</h3>
                <div className={styles.value}>{value}</div>
            </div>
        </div>
    );
}

export default SummaryCard;