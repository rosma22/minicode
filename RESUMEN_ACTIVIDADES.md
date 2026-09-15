# Resumen de actividades — Bosque de Algoritmos

Este documento resume todas las actividades del juego, organizadas por mundo. Cada mundo
tiene un personaje guía, un concepto de programación y una serie de mini-juegos que terminan
con una evaluación o reto final.

| Mundo | Personaje guía | Concepto | Nº actividades | Recompensa total aprox. |
|-------|----------------|----------|:--------------:|:-----------------------:|
| 1 · Semillas 🌱 | Nori 🧑‍🚀 | Secuencias | 5 | 50 XP · 5 semillas |
| 2 · Sendero 🌿 | Vera la maga 🧙‍♀️ | Variables | 8 | 80 XP · 8 semillas |
| 3 · Río 🌊 | Coco la rana 🐸 | Condicionales | 7 | 70 XP · 7 semillas |

Cada actividad completada otorga **+10 XP y +1 semilla**. Los mundos 2 y 3 comienzan
bloqueados y se desbloquean al completar el mundo anterior.

---

## 🌱 Mundo 1 — Semillas (Secuencias)

**Idea central:** una secuencia es una lista de pasos en un orden concreto. Si el orden es
correcto, la tarea se completa.

**Intro:** Nori 🧑‍🚀 se presenta y explica qué es una secuencia con un diálogo interactivo.

| # | Actividad | Qué se practica |
|---|-----------|-----------------|
| 1 | **Prepara el sándwich de Nori** 🥪 | Ordenar ingredientes (🍞 → 🥬 → 🍅 → 🧀 → 🥪) arrastrando o tocando. Introduce la idea de secuencia. |
| 2 | **Haz crecer la planta** 🌱 | Armar la secuencia de acciones: plantar → regar → sol, y ejecutarla para ver crecer la flor. |
| 3 | **Lleva a Nori a casa** 🏠 | Programar una ruta de movimientos en una cuadrícula 4×5 evitando obstáculos (rocas y árboles). |
| 4 | **Arregla la mochila** 🎒 | Depuración: reordenar pasos desordenados hasta lograr la secuencia correcta (Manzana → Agua → Cerrar). |
| 5 | **Reto final: La semilla mágica** 🌟 | Programar a Nori para recoger 💧 Agua, ☀️ Luz y 🌱 Tierra y plantar la semilla mágica. Integra todo lo aprendido. |

---

## 🌿 Mundo 2 — Sendero (Variables)

**Idea central:** una variable es como una caja con etiqueta que guarda un valor (número o texto)
y ese valor puede cambiar.

**Intro:** Vera la maga 🧙‍♀️ presenta el mundo con la metáfora de las "cajas mágicas".

| # | Actividad | Qué se practica |
|---|-----------|-----------------|
| 1 | **Las cajas mágicas** 📦 | Asociar cada elemento con su caja (etiqueta). Introduce la idea de variable como contenedor. |
| 2 | **¿Qué hay dentro?** 🔍 | Abrir cajas para descubrir el valor guardado y responder sobre su contenido. |
| 3 | **Cambia el valor** 🔄 | Modificar el valor de una variable (❤️ Vidas) y ver cómo su nuevo valor afecta el juego. |
| 4 | **La tienda de monedas** 🏪 | Comprar objetos y observar cómo las acciones cambian el valor de la variable 🪙 monedas. |
| 5 | **¡Cuida tus vidas!** ❤️ | Una variable cambia por distintos eventos; mantener las vidas dentro de un rango (0 a máximo). |
| 6 | **¿Quién eres?** 👤 | Variables de texto: guardar un nombre y usarlo dentro del juego. |
| 7 | **La mochila de variables** 🎒 | Configurar varias variables del personaje y vivir una pequeña aventura con ellas. |
| 8 | **Evaluación final** 🎓 | Quiz de **5 preguntas** sobre variables. Hay que acertar todas para completar el mundo. |

**Preguntas de la evaluación (Actividad 8):**
1. Si tienes 5 monedas y encuentras 1 más, ¿cuántas tienes? → **6**
2. ¿Qué tipo de dato es un nombre? → **Texto**
3. ¿Qué puede hacer una variable? → **Cambiar su valor**
4. ¿Con qué se compara una variable? → **Una caja que guarda algo**
5. Si una variable "vidas" vale 5 y pierdes 2, ¿cuánto vale ahora? → **3**

---

## 🌊 Mundo 3 — Río (Condicionales)

**Idea central:** un condicional toma decisiones: SI se cumple una condición, entonces pasa algo;
SI NO, pasa otra cosa. Incluye comparaciones (==, mayor/menor que) y combinaciones.

**Intro:** Coco la rana 🐸 presenta el mundo con el ejemplo de la llave y la puerta.

| # | Actividad | Qué se practica |
|---|-----------|-----------------|
| 1 | **La bifurcación** 🌉 | Tomar una decisión según una condición (por ejemplo, si tienes la llave). |
| 2 | **El detector** 🔎 | Comparar valores para saber si son iguales (operador `==`). |
| 3 | **La puerta de las monedas** 🪙 | Condición basada en el valor de una variable (mayor o menor que). |
| 4 | **Si tienes vidas...** ❤️ | Regla: SI vidas > 0 → puedes continuar. Cambiar las vidas y observar el resultado. |
| 5 | **Si no... toma otro camino** 🔀 | El patrón SI / SI NO (if/else): una condición con dos resultados posibles. |
| 6 | **El guardián del río** 🧙 | Combinar variables y condiciones que deben cumplirse a la vez (condición compuesta). |
| 7 | **¡Cruza el Río!** 🏆 | Reto final: analizar cada condición y decidir correctamente para cruzar. |

---

## Notas de diseño

- **Progresión pedagógica:** los conceptos avanzan de lo concreto a lo abstracto
  (secuencias → variables → condicionales).
- **Refuerzo positivo:** cada actividad da recompensas (XP y semillas) y celebraciones animadas.
- **Interacción variada:** arrastrar y soltar, tocar, armar secuencias, decidir y quizzes.
- **Guías con personalidad:** cada mundo tiene su propio personaje presentador con un diálogo de
  introducción (efecto de "hablar" letra por letra).

*Documento de resumen del contenido educativo del juego, generado a partir del código actual del proyecto.*
