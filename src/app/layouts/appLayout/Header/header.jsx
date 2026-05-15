import styles from "./header.module.css";

function Header({ onToggleSidebar }) {
  return (
    <header className={styles.header}>
      <button
        className={styles.burger}
        onClick={onToggleSidebar}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <div className={styles.searchBar}>
        <input type="text" placeholder="Buscar..." />
      </div>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>M</div>
        <span className={styles.userName}>Invitado</span>
      </div>
    </header>
  );
}

export default Header;
