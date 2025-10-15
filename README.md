# Parcial I - Programación III - Sistema de Pinturería

**Alumno:** Ramirez Luca

Este proyecto es la resolución del primer parcial de Programación III. Consiste en un frontend interactivo para gestionar un inventario de pinturas, consumiendo datos desde una API RESTful proporcionada. La aplicación permite realizar operaciones CRUD, visualizar estadísticas y exportar datos, todo en una interfaz moderna y responsiva.

---

<img width="1366" height="768" alt="1" src="https://github.com/user-attachments/assets/07bdff0c-2432-4474-93d5-82dd52750160" />

---

## 🚀 Cómo Ejecutar el Proyecto

1.  Descargar o clonar el repositorio.
2.  Asegurarse de tener la estructura de carpetas correcta (`js/`, `css/`, `capturas/`, etc.).
3.  Abrir el archivo `pintureria.html` en cualquier navegador web moderno. No requiere instalación de dependencias.

---

## 🛠️ Funcionalidades Desarrolladas

A continuación se detallan las funcionalidades implementadas, agrupadas según los requisitos del parcial.

### Panel de Inicio y Navegación

* **Dashboard Interactivo**: La aplicación recibe al usuario con un panel de bienvenida que muestra estadísticas clave en tiempo real, como el total de pinturas y el precio promedio.
* **Navegación por Pestañas**: La interfaz está organizada en secciones (Inicio, Listado, Formulario, Estadísticas) para una navegación clara e intuitiva. El logo también redirige al inicio.

### CRUD y Gestión de Datos

* **Listado de Datos**: Carga y muestra todas las pinturas desde la API en una tabla ordenada por el más reciente.
* **Limpieza de Datos**: Se implementó un filtro robusto que limpia los datos de la API, ignorando registros con precios negativos, fuera del rango (50-500), sin ID o sin marca.
* **Alta, Baja y Modificación (ABM)**: Se pueden agregar, eliminar (con confirmación) y modificar pinturas a través de un formulario.
* **Validaciones Completas**: El formulario valida todos los campos mostrando feedback visual al usuario.

<img width="1366" height="768" alt="Captura de pantalla (9)" src="https://github.com/user-attachments/assets/798dc0d2-9a87-46ec-be7b-4df41dcf0dbb" />
<img width="1366" height="768" alt="Captura de pantalla (10)" src="https://github.com/user-attachments/assets/54501d0e-2b0d-4009-968c-fdbf29709d4e" />



### Mejoras de Experiencia de Usuario (UX/UI)

* **Spinner de Carga**: Se muestra un indicador de carga durante las peticiones a la API.
* **Actualización en Vivo**: Un botón "Actualizar" permite recargar los datos de la API sin necesidad de refrescar toda la página.
* **Cálculo de Promedio Integrado**: Muestra el precio promedio directamente en la interfaz, sin usar alertas.
* **Diseño Responsivo**: La aplicación es 100% responsiva gracias al uso de Bootstrap 5.

### Estadísticas y Funciones Extra

* **Panel de Estadísticas Avanzado**: Un panel visual con tarjetas que muestran métricas clave y una tabla con el desglose de precios promedio por marca.
* **Exportación a CSV**: Permite descargar la lista actual de pinturas en un archivo `.csv`.
* **Modo Oscuro/Claro**: Un interruptor permite cambiar el tema de la aplicación, y la preferencia se guarda localmente.

<img width="1366" height="768" alt="Captura de pantalla (11)" src="https://github.com/user-attachments/assets/b052c768-42d6-4668-b7a3-8db15f584e70" />


---

## 💡 Qué Aprendí

Al realizar este proyecto, reforcé mis habilidades en:
* Manejo asíncrono de JavaScript con `fetch` y `async/await` para consumir APIs.
* Manipulación dinámica del DOM para crear interfaces interactivas.
* Implementación de un diseño moderno y responsivo utilizando Bootstrap 5.
* Uso de funciones de array como `map`, `filter` y `reduce` para el procesamiento y limpieza de datos.
* Buenas prácticas de desarrollo frontend, como la separación de responsabilidades y la mejora de la experiencia de usuario (UX).
