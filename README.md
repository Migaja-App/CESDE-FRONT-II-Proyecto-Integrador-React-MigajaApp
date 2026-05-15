# 🍪 Migaja - Control de Gastos Hormiga

**Migaja** es una aplicación web moderna diseñada para rastrear y gestionar esos pequeños gastos diarios que suelen pasar desapercibidos pero impactan significativamente en tus finanzas. Con una interfaz limpia y centrada en el usuario, Migaja te ayuda a visualizar a dónde se va tu dinero.

---

## 🚀 Tecnologías Principales

El proyecto aprovecha las últimas versiones de las herramientas más robustas del ecosistema React:

*   **Core:** [React 19](https://react.dev/) & [Vite](https://vitejs.dev/)
*   **Routing:** [React Router 7](https://reactrouter.com/)
*   **API Client:** [Axios](https://axios-http.com/)
*   **Alertas:** [SweetAlert2](https://sweetalert2.github.io/)
*   **Estilos:** CSS Modules para un estilado encapsulado y mantenible.

---

## ✨ Características Principales

*   **📊 Dashboard Inteligente:** Visualiza tu gasto total, promedio por transacción y volumen de operaciones de un vistazo.
*   **📈 Rankings de Consumo:** Identifica rápidamente qué categorías y comercios consumen la mayor parte de tu presupuesto.
*   **💸 Gestión de Gastos:** Registro detallado de cada movimiento con fecha, monto, categoría y comercio.
*   **📁 Módulos Maestros:** Gestión completa de:
    *   **Categorías:** Clasifica tus consumos (Comida, Transporte, Ocio, etc.).
    *   **Comercios:** Mantén un registro de tus lugares frecuentes.
    *   **Medios de Pago:** Controla si gastas en efectivo, tarjeta o apps digitales.
    *   **Usuarios:** Soporte multi-usuario para control personalizado.
*   **🕒 Actividad Reciente:** Historial cronológico de tus últimos movimientos.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue un patrón de diseño **orientado a características (Feature-based Architecture)**, lo que facilita la escalabilidad y el mantenimiento:

```text
src/
├── app/            # Configuración global, Router y Layouts
├── features/       # Módulos independientes por dominio
│   ├── dashboard/
│   ├── gastos/
│   ├── categorias/
│   └── ...         # Cada feature contiene su api, hooks, componentes y páginas
├── shared/         # Componentes, hooks y utilidades reutilizables
└── main.jsx        # Punto de entrada de la aplicación
```

---

## 🛠️ Configuración Local

1.  **Clonar el repositorio:**
    ```bash
    git clone [url-del-repositorio]
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade la URL de tu API:
    ```env
    VITE_API_URL=http://tu-api-url.com/api
    ```

4.  **Iniciar en desarrollo:**
    ```bash
    npm run dev
    ```

---

## 🎨 Estándares de Código

*   **CSS Modules:** Evita colisiones de nombres de clases.
*   **Custom Hooks:** La lógica de negocio está separada de los componentes visuales para facilitar pruebas y reutilización.
*   **Axios Interceptors:** Manejo centralizado de peticiones HTTP en `src/shared/api/http.js`.

---

Desarrollado con ❤️ para el control financiero personal.
