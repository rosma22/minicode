# 📋 Análisis del Proyecto — Minicode ("Bosque de Algoritmos")

> Documento de análisis técnico e indicaciones de trabajo.
> Última revisión: septiembre 2026.

---

## 1. Resumen general

**Minicode** es una aplicación educativa e interactiva para enseñar conceptos
básicos de programación a niños (secuencias, variables, depuración) a través de
mini-juegos con temática de un "Bosque de Algoritmos". El personaje guía es
**Nori**, un astronauta explorador.

La app está construida con **Angular 22** (standalone components, control flow
`@if` / `@for`) y se empaqueta como aplicación de escritorio con **Electron**.

- **Nombre:** minicode
- **Versión:** 0.0.0
- **Tipo:** Aplicación web (Angular) + escritorio (Electron)
- **Idioma de la UI:** Español
- **Público objetivo:** Niños que empiezan a programar

---

## 2. Stack tecnológico

| Área | Tecnología | Versión |
|------|------------|---------|
| Framework front-end | Angular | ^22.1.0 |
| Lenguaje | TypeScript | ~6.0.2 |
| Reactividad | RxJS | ~7.8.0 |
| Runtime de zonas | zone.js | ^0.16.3 |
| Escritorio | Electron | ^44.0.0 |
| Testing | Vitest | ^4.0.8 |
| Formateo | Prettier | ^3.8.1 |
| Gestor de paquetes | npm | 11.12.1 |
| Build | @angular/build (esbuild/vite) | ^22.1.6 |

---

## 3. Estructura del proyecto

```
minicode/
├── angular.json            # Configuración del workspace de Angular
├── package.json            # Dependencias y scripts
├── tsconfig*.json          # Configuración de TypeScript (app / spec)
├── README.md               # Documentación generada por Angular CLI
├── electron/
│   └── main.js             # Punto de entrada de Electron (crea la ventana)
├── public/                 # Assets estáticos
├── src/
│   ├── index.html          # HTML raíz (<app-root>)
│   ├── main.ts             # Bootstrap de la aplicación Angular
│   ├── styles.css          # Estilos globales
│   └── app/
│       ├── app.ts          # Componente raíz: TODA la lógica de los juegos
│       ├── app.html        # Plantilla con las 3 pantallas y actividades
│       ├── app.css         # Estilos del componente
│       ├── app.config.ts   # Providers (router, error listeners)
│       ├── app.routes.ts   # Rutas (actualmente vacías)
│       ├── activities.ts   # Tipos y constantes de las actividades
│       └── app.spec.ts     # Pruebas unitarias del componente raíz
├── dist/                   # Artefactos de build
└── .angular/               # Caché de compilación (ignorar)
```

---

## 4. Arquitectura de la aplicación

La aplicación es **monolítica en un solo componente** (`App`, en `app.ts`).
Todo el estado y la lógica de las actividades viven en esa clase, y la plantilla
`app.html` cambia lo que muestra según la variable de estado `currentScreen`.

### Pantallas (`Screen`)
- `forest` — Mapa del bosque. Pantalla inicial con acceso a los mundos.
- `world-1` — **Mundo 1: Semillas** (concepto: *secuencias*).
- `world-2` — **Mundo 2: Sendero** (concepto: *variables*). Se desbloquea al
  terminar el Mundo 1.

Existe un tercer nodo en el mapa ("Río / Condicionales") marcado como bloqueado,
sin implementar todavía.

### Estado global
- `experience` — puntos de experiencia (XP) acumulados.
- `seeds` — semillas ganadas.
- `level2Unlocked` — controla el acceso al Mundo 2.
- La recompensa estándar por actividad es `{ experience: 10, seeds: 1 }`.

---

## 5. Contenido: actividades

### Mundo 1 — Semillas (secuencias) · 5 actividades
Definidas en `activities.ts` (`WORLD_ONE_ACTIVITIES`) y controladas por
`currentActivity` (0–4).

1. **Sándwich** — Ordenar ingredientes (🍞 🥬 🧀 🥪) mediante drag & drop o clic.
   Enseña qué es una secuencia. Orden correcto: `SANDWICH_CORRECT_ORDER`.
2. **Planta** — Armar y ejecutar una secuencia de bloques
   (🌱 Plantar → 💧 Regar → ☀️ Sol) que se corre paso a paso. Orden en
   `PLANT_GROWTH_ORDER`.
3. **Ruta** — Programar movimientos en un grid 4×5 para llevar a Nori a casa
   evitando obstáculos (🪨 roca, 🌳 árbol).
4. **Depuración (mochila)** — Reordenar pasos de empaque (`PACKING_INITIAL_ORDER`
   → `PACKING_CORRECT_ORDER`) intercambiando posiciones.
5. **Reto final** — En un grid 3×3, recoger recursos (💧 Agua, ☀️ Luz, 🌱 Tierra)
   y plantar en la semilla mágica, con animación de crecimiento.

Al completar el Mundo 1 se activa `level2Unlocked`.

### Mundo 2 — Sendero (variables) · 11 actividades
Controladas por `currentWorld2Activity` (0–10).

1. **Cajas mágicas** — Emparejar ítems con la caja que los acepta (variables como cajas).
2. **Abrir cajas** — Revelar valores guardados y responder una pregunta.
3. **Cambiar valor** — Subir/bajar un número hasta un objetivo (mutación de variable).
4. **Tienda** — Comprar ítems restando de las monedas disponibles.
5. **Vidas** — Aplicar eventos que suman/restan vidas hasta la meta.
6. **Nombre** — Guardar un nombre (variable de texto).
7. **Marcador** — Recolectar estrellas e incrementar el marcador.
8. **Mochila de variables** — Definir un personaje (nombre, monedas, vidas, puntos)
   y vivir una aventura que modifica esos valores.
9. **Arreglar variables** — Asignar cada etiqueta a su slot correcto (depuración).
10. **Gran aventura** — Secuencia de eventos que modifican varias variables.
11. **Evaluación final** — Quiz de 3 preguntas (`quizCorrect`).

---

## 6. Cómo ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Servidor de desarrollo Angular (http://localhost:4200):

```bash
npm start
```

Ejecutar como app de escritorio con Electron (requiere que el servidor de
desarrollo esté corriendo, porque `electron/main.js` carga `http://localhost:4200`):

```bash
# En una terminal
npm start
# En otra terminal
npm run electron
```

Compilar para producción (salida en `dist/`):

```bash
npm run build
```

Ejecutar pruebas:

```bash
npm test
```

---

## 7. Observaciones y hallazgos

- **La lógica está toda en un solo componente.** `app.ts` supera las 1300 líneas
  y `app.html` es muy extenso. Funciona, pero dificulta el mantenimiento.
- **La prueba unitaria está desactualizada.** `app.spec.ts` espera que el `<h1>`
  contenga `"Hello, minicode"`, texto que ya no existe en la plantilla actual
  (ahora dice "Bienvenido al Bosque de Algoritmos"). Esa prueba fallará.
- **El rutado no se usa.** `app.routes.ts` está vacío; la navegación se maneja
  con la variable `currentScreen`. El `provideRouter` podría eliminarse si no se
  planea usar rutas.
- **Electron depende del servidor de desarrollo.** `main.js` carga siempre
  `localhost:4200`. Para distribuir una app real habría que cargar los archivos
  compilados de `dist/` en modo producción.
- **El tercer mundo (Río / Condicionales) no está implementado**, solo aparece
  bloqueado en el mapa.
- **Detección de cambios manual.** Se usa `ChangeDetectorRef.detectChanges()` en
  muchas animaciones con `setTimeout`. Migrar a *signals* de Angular simplificaría
  esto.

---

## 8. Indicaciones / próximos pasos recomendados

Prioridad alta:
1. **Arreglar la prueba unitaria** de `app.spec.ts` para que valide el contenido
   real (o reescribirla acorde a las pantallas actuales).
2. **Configurar Electron para producción**: cargar `dist/` con `loadFile` cuando
   no esté en modo desarrollo, y agregar un script que construya + lance Electron.

Prioridad media:
3. **Refactorizar por componentes**: separar cada mundo/actividad en su propio
   componente standalone para reducir el tamaño de `app.ts` y `app.html`.
4. **Extraer el estado del juego a un servicio** (por ejemplo `GameService`) o a
   *signals*, para separar lógica de presentación.
5. **Añadir pruebas** para la lógica de cada actividad (validación de secuencias,
   rutas, recompensas).

Prioridad baja / mejoras:
6. Implementar el **Mundo 3 (Condicionales)**.
7. Persistir el progreso (XP, semillas, mundos desbloqueados) en `localStorage`.
8. Revisar **accesibilidad**: roles ARIA, navegación por teclado y foco en los
   juegos de arrastrar y soltar.
9. Considerar migrar a **signals** para las animaciones que hoy usan
   `detectChanges()` manual.

---

## 9. Convenciones del proyecto

- Componentes **standalone** (sin NgModules).
- Sintaxis de control de flujo moderna de Angular: `@if`, `@else if`, `@for`.
- `prefix` de selectores: `app`.
- Formateo con **Prettier**.
- Textos de la interfaz en **español**.
- Emojis usados de forma intensiva como recursos visuales del juego.
