import { useResumenGastos } from "../hooks/useResumenGastos";
import { formatoMoneda } from "../../../shared/utils/format";
import SummaryCard from "../components/SummaryCard/summaryCard";
import CategoriasRanking from "../components/categoriasRanking/categoriasRanking";
import ComerciosRanking from "../components/ComerciosRanking/comerciosRanking";
import ActividadReciente from "../components/actividadReciente/actividadReciente";
import GraficaPlaceholder from "../components/graficaPlaceholder/graficaPlaceholder";
import styles from "./dashboardPage.module.css";

function DashboardPage() {
  const { resumen, cargando, error, sinDatos } = useResumenGastos();

  if (cargando)
    return <p className={styles.message}>Cargando dashboard...</p>;
  if (error)
    return (
      <p className={`${styles.message} ${styles.errorMsg}`}>Error: {error}</p>
    );

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel de Control</h1>
        <p className={styles.subtitle}>Resumen de tus gastos hormiga.</p>
      </header>

      <div className={styles.summaryGrid}>
        <SummaryCard
          icon="💸"
          label="Gasto total"
          value={formatoMoneda(resumen.total)}
          variant="hero"
        />
        <SummaryCard
          icon="📊"
          label="Transacciones"
          value={resumen.cantidad}
          variant="green"
        />
        <SummaryCard
          icon="⚖️"
          label="Promedio por gasto"
          value={formatoMoneda(resumen.promedio)}
          variant="gold"
        />
      </div>

      {sinDatos ? (
        <div className={styles.empty}>
          <p>
            Aún no has registrado gastos. Ve a la sección "Gastos" y crea el
            primero para ver tus estadísticas aquí.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.contentGrid}>
            <CategoriasRanking categorias={resumen.categorias} />
            <ComerciosRanking comercios={resumen.comercios} />
          </div>
          <ActividadReciente gastos={resumen.recientes} />
          <div className={styles.graficasGrid}>
            <GraficaPlaceholder titulo="Gráfica 1" />
            <GraficaPlaceholder titulo="Gráfica 2" />
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;