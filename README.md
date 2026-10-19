# Banco MVP - Frontend Web (Banca Digital)

Aplicación cliente de **Banco MVP**, desarrollada con React 18, Vite y TypeScript, con una interfaz moderna basada en *Glassmorphism*, diseño responsivo, gestión de sesión stateless y suite completa de pruebas unitarias y E2E con Playwright.

---

## 1. Tecnologías y Versiones

| Tecnología / Herramienta | Versión | Rol / Propósito |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Biblioteca declarativa para construcción de interfaces de usuario |
| **React DOM** | `18.3.1` | Renderizador de React para la web |
| **Vite** | `6.0.3` | Bundler y servidor de desarrollo ultra-rápido basado en ESM nativo |
| **TypeScript** | `5.7.2` | Tipado estático para robustez y mantenibilidad del cliente |
| **NGINX** | `alpine` | Servidor web HTTP para servir los artefactos estáticos en producción |
| **Lucide React** | `0.468.0` | Conjunto iconográfico moderno y estilizado |
| **Playwright** | `1.64.1` | Framework de pruebas automatizadas End-to-End (E2E) en navegadores reales |
| **TSX / Node Test** | `4.23.15` / Node `>=20` | Suite de pruebas unitarias para lógica de autenticación y formateo |
| **CSS3 Vanilla** | Modern Spec | Estilos personalizados, Glassmorphism y animaciones fluidas |
| **Docker** | Multi-stage | Construcción con Node 20 Alpine y despliegue final en NGINX Alpine |

---

## 2. Imagen en DockerHub

Este proyecto cuenta con su imagen pública en DockerHub lista para ser descargada y desplegada:

* **Repositorio DockerHub:** `juanfer2006/banco-frontend`
* **Tag:** `latest`
* **URL:** `https://hub.docker.com/r/juanfer2006/banco-frontend`

### Descargar desde DockerHub
```bash
docker pull juanfer2006/banco-frontend:latest
```

### Ejecutar contenedor individual desde DockerHub
```bash
docker run -d --name banco-frontend -p 8080:80 juanfer2006/banco-frontend:latest
```
Acceder en el navegador a: `http://localhost:8080`

### Construir y publicar imagen (para desarrolladores)
```bash
# Construir imagen Docker localmente
docker build -t juanfer2006/banco-frontend:latest .

# Iniciar sesión y publicar en DockerHub
docker login
docker push juanfer2006/banco-frontend:latest
```

---

## 3. Cómo Descargar el Código (Clonación)

### Clonación independiente
```bash
git clone https://github.com/juanfer2006/banco-frontend.git
cd banco-frontend
```

### Clonación como parte del Monorepo con submódulos
```bash
git clone --recurse-submodules <URL_DEL_MONOREPO>
```

---

## 4. Requisitos e Instrucciones de Instalación y Ejecución

### Requisitos Previos
* **Node.js** v20 o superior
* **npm** v10 o superior
* **Docker y Docker Compose** (opcional, para despliegue contenerizado)

### Opción A: Ejecución Local en Desarrollo
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la URL de la API (opcional, por defecto http://localhost:3000)
cp .env.example .env

# 3. Iniciar el servidor Vite de desarrollo
npm run dev
```

La aplicación estará accesible en: `http://localhost:5173`

### Opción B: Construcción y Previsualización Local de Producción
```bash
npm run build
npm run preview
```

### Opción C: Ejecución con Dockerfile (NGINX)
```bash
# Construir imagen con la URL del backend
docker build --build-arg VITE_API_URL=http://localhost:3000 -t banco-frontend .

# Ejecutar contenedor mapeando el puerto HTTP
docker run -d --name banco-web -p 8080:80 banco-frontend
```

---

## 5. Historias de Usuario Asignadas

| Código | Historia de Usuario | Descripción Técnica | Responsable |
| :--- | :--- | :--- | :--- |
| **HU-07** | Interfaz de Autenticación y Registro | Formularios reactivos para login y registro de nuevos clientes con persistencia segura de token Bearer en cliente. | **Juan Fernando Ramírez (juanfer2006)** |
| **HU-08** | Tablero Principal (Dashboard) y Resumen Financiero | Vista general de saldos de cuentas corrientes y de ahorro, widgets de acceso rápido y accesos directos de operación. | **Juan Fernando Ramírez (juanfer2006)** |
| **HU-09** | Módulo de Transferencias y Movimientos | Formulario para enviar dinero por número de cuenta, validación de montos y consulta reactiva de historial contable. | **Tomás Buriticá (buri033)** |
| **HU-10** | Cajitas de Ahorro y Metas Financieras | Creación de alcancías virtuales (*subcuentas*), visualización de barras de progreso y traslado inmediato de fondos. | **Tomás Buriticá (buri033)** |
| **HU-11** | Simulador y Solicitud de Créditos | Calculadora interactiva con amortización francesa en tiempo real, desglose de cuotas y radicación de solicitudes. | **Juan Fernando Ramírez (juanfer2006)** |
| **HU-12** | Pruebas Automatizadas Unitarias y E2E (Playwright) | Implementación de pruebas unitarias de utilidades y flujos críticos de extremo a extremo con Playwright. | **Tomás Buriticá (buri033)** |

---

## 6. Pruebas Automatizadas

El proyecto incluye tanto **pruebas unitarias** de utilidades y estado, como **pruebas de extremo a extremo (E2E)** con Playwright.

### A. Pruebas Unitarias
Validan la gestión del estado de autenticación, almacenamiento local, observadores de sesión y utilidades financieras.
```bash
npm test
```

### B. Pruebas End-to-End (E2E) con Playwright
Validan la comunicación real entre el frontend, backend y base de datos simulando las interacciones de un usuario real en el navegador:
* `auth.spec.ts`: Registro, login, verificación de dashboard y logout.
* `creditos.spec.ts`: Simulación y radicación de crédito con validación de estados.
* `navegacion.spec.ts`: Navegación entre vistas, cajitas, tarjetas y transferencias.

```bash
# Ejecutar pruebas E2E en consola
npm run test:e2e

# Ejecutar pruebas E2E con interfaz gráfica interactiva
npm run test:e2e:ui

# Ejecutar pruebas E2E visualizando el navegador en tiempo real
npm run test:e2e:headed
```

### C. Chequeo de Tipos TypeScript
```bash
npm run typecheck
```
