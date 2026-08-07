# Decision Log

Registro de decisiones técnicas importantes tomadas durante el desarrollo.
Cada entrada documenta el contexto, las alternativas evaluadas y la razón de la elección.

---

## [001] Arquitectura basada en módulos por funcionalidad

**Fecha:** 2026-08-06  
**Estado:** Aprobada

**Contexto:**  
Necesitaba definir cómo organizar el código antes de empezar a desarrollar.

**Alternativas evaluadas:**
- Estructura plana (todo en AppModule)
- Feature Modules (Core / Shared / Features)
- Standalone Components (Angular 15+)

**Decisión:**  
Feature Modules con separación Core / Shared / Features.

**Razón:**  
Es el patrón recomendado por la guía oficial de estilo de Angular, separa claramente las responsabilidades y es familiar para cualquier equipo que trabaje con Angular. Los Standalone Components son el futuro del framework pero están menos consolidados en codebases enterprise actuales.

---

## [002] Gestión de estado con BehaviorSubject en lugar de NgRx

**Fecha:** 2026-08-06  
**Estado:** Aprobada

**Contexto:**  
Necesitaba decidir cómo gestionar el estado compartido entre componentes (lista de tareas, categorías).

**Alternativas evaluadas:**
- NgRx (Redux pattern)
- BehaviorSubject en servicios (RxJS)
- Angular Signals (Angular 16+)

**Decisión:**  
BehaviorSubject dentro de los servicios del módulo Core.

**Razón:**  
NgRx añade una cantidad considerable de código adicional (actions, reducers, effects, selectors) que no aporta un beneficio proporcional para una aplicación de este tamaño. BehaviorSubject es más simple, igualmente testeable y completamente suficiente para 2-3 features con estado compartido.

---

## [003] Timestamps como number en lugar de Date en los modelos

**Fecha:** 2026-08-06  
**Estado:** Aprobada

**Contexto:**  
Necesitaba definir cómo representar fechas en los modelos `Task` y `Category`.

**Decisión:**  
Usar `number` (timestamp Unix vía `Date.now()`).

**Razón:**  
`@ionic/storage` persiste los datos serializándolos a JSON. Un objeto `Date` de JavaScript se convierte en string al serializar (`"2026-08-06T..."`) y no se recupera como `Date` al deserializar — vuelve como string. Un número entero sobrevive el ciclo de serialización sin pérdida ni conversiones adicionales.

---

## [004] Cordova como runtime nativo (con Capacitor presente)

**Fecha:** 2026-08-06  
**Estado:** Aprobada

**Contexto:**  
Los requerimientos de la prueba especifican Cordova. Ionic 7 incluye Capacitor por defecto al crear un proyecto nuevo.

**Decisión:**  
Mantener Capacitor (instalado por el starter) y agregar Cordova como integración adicional mediante `ionic integrations enable cordova`. Los builds nativos (APK/IPA) se generan usando comandos de Cordova.

**Razón:**  
Capacitor y Cordova pueden coexistir en un proyecto Ionic. Eliminar Capacitor del starter requeriría trabajo manual que no aporta valor al objetivo de la prueba. El runtime activo para la compilación nativa es Cordova, según lo especificado.
