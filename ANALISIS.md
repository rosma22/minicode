# Análisis del proyecto — Bosque de Algoritmos (minicode)

Fecha del análisis: 12 de septiembre de 2026

## 1. Descripción general

**Bosque de Algoritmos** es una aplicación educativa e interactiva pensada para enseñar
conceptos básicos de programación a niños y principiantes a través de un juego por
"mundos". El jugador (el explorador *Nori* 🧑‍🚀) recorre un bosque y va desbloqueando
mundos temáticos, cada uno enfocado en un concepto de programación:

| Mundo | Nombre | Concepto que enseña |
|-------|--------|---------------------|
| 1 | 🌱 Semillas | Secuencias (pasos en orden) |
| 2 | 🌿 Sendero | Variables |
| 3 | 🌊 Río | Condicionales |

La aplicación combina explicaciones simples con mini-juegos prácticos (armar un sándwich,
hacer crecer una planta, programar rutas, tomar decisiones, etc.) y un sistema de
recompensas (XP y semillas).

## 2. Stack tecnológico

- **Framework:** Angular 22.1 (componentes *standalone*, nueva sintaxis de control de flujo `@if` / `@for`).
- **Lenguaje:** TypeScript ~6.0.
- **Empaquetado de escritorio:** Electron 44 (`main: electron/main.js`), lo que permite distribuir la app como aplicación de escritorio.
- **Testing:** Vitest 4 + jsdom (configurado, aunque sin cobertura visible de pruebas de los mundos).
- **Estilos:** CSS puro centralizado en `src/app/shared/global.css`.
- **Estado:** servicio Angular inyectable (`GameStateService`), sin librería de estado externa.

## 3. Arquitectura

```
src/app/
├── app.ts / app.html / app.css      → Shell: cabecera + navegación entre pantallas
├── app.config.ts / app.routes.ts    → Configuración (router provisto pero sin rutas)
├── core/
│   └── game-state.service.ts        → Estado global (XP, semillas, desbloqueos)
├── models/
│   └── activities.ts                → Tipos y constantes de las actividades
├── shared/
│   └── global.css                   → TODOS los estilos de la app (~3950 líneas)
└── worlds/
    ├── forest/                      → Menú principal (mapa del bosque)
    ├── world-1-seeds/               → Mundo 1: Secuencias (5 actividades)
    ├── world-2-path/                → Mundo 2: Variables
    └── world-3-river/               → Mundo 3: Condicionales
```

### Patrón de navegación
El componente raíz `App` mantiene un estado `currentScreen` (`'forest' | 'world-1' | 'world-2' | 'world-3'`)
y usa `@if` / `@else if` para renderizar la pantalla activa. La comunicación entre mundos y
el shell se hace mediante `@Output() EventEmitter`:

- `forest` emite `openWorld1/2/3` → el shell cambia de pantalla.
- Cada mundo emite eventos para desbloquear/abrir el siguiente (`unlockWorld2`, `unlockWorld3`, etc.).

Como los mundos se montan con `@if`, cada componente se **recrea** al entrar, por lo que sus
hooks de inicialización (constructor / `ngOnInit`) se ejecutan cada vez. Esto se aprovecha,
por ejemplo, para reiniciar animaciones (el explorador que "camina" en el bosque) y la intro
del Mundo 1.

### Estado global (`GameStateService`)
```ts
experience = 0;       // XP acumulada
seeds = 0;            // Semillas (moneda del juego)
level2Unlocked = false;
level3Unlocked = false;
applyReward(reward)   // Suma XP y semillas
```
Los mundos 2 y 3 comienzan bloqueados y se desbloquean al completar el mundo anterior.

## 4. Detalle por pantallas

### 4.1 Bosque (menú principal) — `forest/`
- Escena "realista" construida íntegramente con CSS: cielo con degradado, rayos de sol,
  montañas lejanas, colinas en capas, línea de árboles de fondo, bruma, sendero SVG serpenteante
  y decoración (árboles, arbustos, aves).
- Tres nodos de mundo posicionados sobre el sendero, con estado bloqueado/desbloqueado.
- **Personaje que camina:** el explorador arranca al inicio del sendero y se desplaza (transición
  CSS de ~2.6 s) hasta el mundo desbloqueado más avanzado. Al volver al bosque tras desbloquear
  un mundo nuevo, camina hacia él. Incluye animación de paso y sombra dinámica.

### 4.2 Mundo 1 — Semillas / Secuencias (~810 líneas TS, ~858 HTML)
El mundo más desarrollado. Incluye:
- **Intro con diálogo:** el personaje aparece en grande y "habla" con efecto máquina de escribir;
  el usuario avanza el diálogo con clics y luego inicia las actividades.
- **5 actividades:**
  1. **Sándwich** (secuencia): ordenar 🍞 🥬 🍅 🧀 🥪 mediante drag & drop o clic.
  2. **Planta:** armar la secuencia plantar → regar → sol y verla crecer animada.
  3. **Ruta:** programar movimientos en una cuadrícula 4×5 evitando obstáculos para llevar a Nori a casa.
  4. **Mochila (depuración):** reordenar pasos para empacar correctamente.
  5. **Reto final:** recoger recursos (agua, luz, tierra) y plantar la semilla mágica.
- Cada actividad otorga recompensas y muestra celebraciones animadas.

### 4.3 Mundo 2 — Sendero / Variables (~798 líneas TS)
Amplia variedad de mini-juegos alrededor del concepto de variable: cajas mágicas,
contadores de vidas/corazones, tienda con precios, héroe con nombre y tipo, mochila,
y un quiz final que desbloquea el Mundo 3.

### 4.4 Mundo 3 — Río / Condicionales (~475 líneas TS)
Actividades centradas en decisiones (if/else): bifurcaciones en el camino, detector de
igualdad, puerta con condición de paso, condicionales sobre vidas, guardián y un cruce final.

## 5. Modelo de datos (`activities.ts`)
Define tipos y constantes que sirven como "fuente de verdad" de las soluciones correctas:
- Tipos: `PlantAction`, `RouteMove`, `PackingStep`, `FinalBlock`, `FinalResource`, etc.
- Órdenes correctos: `SANDWICH_CORRECT_ORDER`, `PLANT_GROWTH_ORDER`, `PACKING_CORRECT_ORDER`, etc.
- Recompensa estándar: `{ experience: 10, seeds: 1 }`.

Mantener la lógica de validación basada en estas constantes es una buena práctica: la interfaz
y la comprobación de respuestas se derivan del mismo dato.

## 6. Fortalezas

- **Enfoque pedagógico claro:** progresión de conceptos (secuencias → variables → condicionales)
  con metáforas concretas y visuales para cada idea abstracta.
- **Alta calidad visual:** escenas y animaciones logradas solo con CSS, sin dependencias gráficas externas.
- **Arquitectura simple y comprensible:** componentes standalone bien separados por mundo, estado global mínimo.
- **Uso de la sintaxis moderna de Angular** (`@if`, `@for`, señales de control de flujo).
- **Feedback inmediato y refuerzo positivo:** celebraciones, XP y semillas mantienen la motivación.
- **Base para escritorio con Electron** ya preparada.

## 7. Riesgos y oportunidades de mejora

### Mantenibilidad
- **`global.css` es un archivo monolítico (~3950 líneas).** Concentra los estilos de todas las
  pantallas. Recomendación: dividir en hojas por componente (`forest.css`, `world-1.css`, …) o
  usar estilos encapsulados por componente para reducir el riesgo de colisiones de clases
  (varias clases como `.sky`, `.cloud`, `.tree` se reutilizan en contextos distintos).
- **Componentes de mundo muy grandes** (700–800 líneas de TS con mucha lógica de UI y `setTimeout`
  para animaciones). Podrían extraerse servicios o subcomponentes por actividad para facilitar
  pruebas y lectura.

### Estado y persistencia
- **El progreso no se persiste.** Al recargar, XP, semillas y desbloqueos se reinician. Sería útil
  guardar en `localStorage` (o almacenamiento de Electron) para conservar el avance.
- El estado global usa propiedades mutables simples; migrar a **signals** de Angular daría
  reactividad más robusta y explícita.

### Enrutamiento
- El `Router` está provisto pero **sin rutas** (`routes = []`); la navegación es manual por estado.
  Si el proyecto crece, usar rutas reales facilitaría deep-linking, historial y pruebas.

### Calidad
- **Cobertura de pruebas escasa.** Vitest está configurado, pero la lógica de validación de las
  actividades (que es determinista y aislada) es ideal para pruebas unitarias.
- Uso frecuente de `any` en temporizadores (`typeTimer`) y de `setTimeout` encadenados; encapsular
  las animaciones o usar utilidades de RxJS mejoraría la robustez.

### Accesibilidad
- La interacción depende mucho de emojis y color. Conviene añadir textos alternativos/etiquetas ARIA,
  asegurar contraste suficiente y ofrecer alternativas a las acciones de arrastrar y soltar (ya existe
  el clic como alternativa en el sándwich, buen punto de partida).

## 8. Recomendaciones priorizadas

1. **Persistir el progreso** (localStorage) — alto impacto, bajo esfuerzo.
2. **Dividir `global.css`** por componente o encapsular estilos — reduce riesgo de regresiones.
3. **Añadir pruebas unitarias** a las funciones de validación de cada actividad.
4. **Extraer subcomponentes/servicios** en los mundos más grandes (empezando por Mundo 1 y 2).
5. **Migrar el estado a signals** y evaluar el uso del Router para la navegación.
6. **Revisar accesibilidad** (ARIA, contraste, alternativas de interacción).

## 9. Métricas rápidas

| Archivo | Líneas |
|---------|-------:|
| `shared/global.css` | 3954 |
| `world-1-seeds/world-1.html` | 858 |
| `world-1-seeds/world-1.ts` | 810 |
| `world-2-path/world-2.ts` | 798 |
| `world-2-path/world-2.html` | 566 |
| `world-3-river/world-3.ts` | 475 |
| `world-3-river/world-3.html` | 326 |
| `forest/forest.html` | 91 |
| `forest/forest.ts` | 62 |
| `models/activities.ts` | 61 |
| `core/game-state.service.ts` | 21 |

---

*Documento generado como análisis técnico del estado actual del proyecto. Las recomendaciones
son sugerencias de mejora y no implican que el proyecto esté incompleto para su propósito educativo.*
