import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar/sideBar.jsx";
import Header from "./Header/header.jsx";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        abierta={sidebarAbierta}
        onCerrar={() => setSidebarAbierta(false)}
      />

      {sidebarAbierta && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarAbierta(false)}
        />
      )}

      <div className={styles.mainWrapper}>
        <Header onToggleSidebar={() => setSidebarAbierta((s) => !s)} />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
