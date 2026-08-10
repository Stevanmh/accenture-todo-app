# Accenture Todo App 📱

Una aplicación de gestión de tareas multiplataforma desarrollada con **Ionic, Angular y Capacitor**, como resolución a la prueba técnica para el rol de Desarrollador Mobile.

## 🚀 Características Principales

*   **CRUD Completo de Tareas:** Crear, leer, actualizar (marcar como completada) y eliminar tareas.
*   **Gestión de Categorías:** Posibilidad de crear categorías personalizadas con colores únicos y asignarlas a las tareas.
*   **Filtrado Activo:** Visualización de tareas filtradas instantáneamente por categoría.
*   **Feature Flags (Firebase Remote Config):** Control en tiempo real de características de la app desde la nube.
*   **Multiplataforma:** Soporte nativo y compilación tanto para **Android** como para **iOS** (vía Swift Package Manager y GitHub Actions).

---

## 🎥 Demostración de Feature Flags (Remote Config)

En el siguiente video se demuestra cómo al cambiar las variables `enable_categories` y `show_completed_tasks` desde la consola de Firebase, la aplicación reacciona y actualiza la interfaz instantáneamente (desaparecen los badges de categorías y se ocultan las tareas ya completadas).

https://github.com/Stevanmh/accenture-todo-app/raw/main/docs/feature_flags_comp.mp4

---

## 🔗 Enlaces de Entrega

*   🍏 **Demo iOS (Appetize.io):** [Ver demostración en vivo](https://appetize.io/app/ios/io.ionic.starter?device=iphone14pro&osVersion=16.2&toolbar=true)
*   🤖 **APK Android:** Disponible en la carpeta del repositorio: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🛠️ Instalación y Configuración Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Stevanmh/accenture-todo-app.git
    cd accenture-todo-app
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar en el navegador (Desarrollo):**
    ```bash
    ionic serve
    ```

4.  **Compilar para Android:**
    ```bash
    npm run build
    npx cap sync android
    cd android
    ./gradlew assembleDebug
    ```

---

## 📝 Respuestas a la Evaluación Técnica

### 1. ¿Cuáles fueron los principales desafíos?
El principal desafío radicó en la orquestación del soporte multiplataforma, específicamente lograr una compilación exitosa para iOS sin disponer de un entorno físico con macOS. Esto se resolvió mediante la implementación de un flujo de CI/CD utilizando **GitHub Actions** (`macos-latest`) configurado para compilar el proyecto vía `xcodebuild` utilizando Swift Package Manager (estándar en Capacitor 6). 
Adicionalmente, la integración de **Firebase Remote Config** requirió manejar la asincronía de la configuración remota para garantizar que las *Feature Flags* (`enable_categories` y `show_completed_tasks`) se resolvieran adecuadamente, asegurando una experiencia de usuario fluida sin parpadeos visuales.

### 2. ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?
*   **Change Detection Strategy (OnPush):** En un escenario de listas dinámicas (tareas), se minimiza el ciclo de detección de cambios de Angular para que los componentes solo se re-rendericen cuando sus `Inputs` cambian directamente.
*   **RxJS BehaviorSubjects:** El estado de las tareas, categorías y los filtros se manejaron de forma reactiva en servicios Singleton. Esto evita consultas redundantes al almacenamiento local (`Preferences`) cada vez que un componente se destruye y se vuelve a inicializar.
*   **Stand-alone Components y Lazy Loading nativo:** Asegura que los módulos de configuración y tareas solo se carguen en memoria cuando el usuario navega hacia ellos, reduciendo significativamente el tiempo del primer pintado (FCP).

### 3. ¿Cómo aseguraste la calidad y mantenibilidad del código?
*   **Arquitectura Orientada a Servicios:** La lógica de negocio (CRUD, Storage, Remote Config) fue abstraída en servicios (`TasksService`, `CategoryService`, `RemoteConfigService`), manteniendo los componentes (Page y Modals) estrictamente enfocados en la presentación (UI).
*   **Tipado Estricto con TypeScript:** Se definieron interfaces (`Task`, `Category`, `AppConfig`) para garantizar consistencia y prevenir errores de casting en tiempo de ejecución.
*   **Patrón de Diseño Modular:** El uso de componentes reutilizables facilita agregar nuevas entidades en el futuro con un mínimo impacto en el código existente.
