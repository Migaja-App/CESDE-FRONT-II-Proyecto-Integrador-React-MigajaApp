import { NavLink } from "react-router-dom";
import styles from "./sideBar.module.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Panel" },
  { to: "/gastos", label: "Gastos" },
  { to: "/categorias", label: "Categorías" },
  { to: "/comercios", label: "Comercios" },
  { to: "/medios-pago", label: "Medios de pago" },
  { to: "/usuarios", label: "Usuarios" },
];

function Sidebar({ abierta, onCerrar }) {
  return (
    <aside className={`${styles.sidebar} ${abierta ? styles.abierta : ""}`}>
      <div className={styles.logo}>
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="8" fill="#FFFFFF" />
          <circle cx="12" cy="18" r="4" fill="#FFFFFF" />
          <circle cx="28" cy="22" r="5" fill="#FFFFFF" />
          <path d="M10 12L14 16M26 12L22 16" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="22" cy="12" r="6" fill="#FFD97D" />
        </svg>
        Migaja
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.activo : ""}`
            }
            onClick={onCerrar}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
