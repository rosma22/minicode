import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  SANDWICH_CORRECT_ORDER,
  PLANT_GROWTH_ORDER,
  PACKING_CORRECT_ORDER,
  PACKING_INITIAL_ORDER,
  FINAL_RESOURCE_EMOJI,
  FINAL_RESOURCE_LABEL,
  SEED_GROWTH_STAGES,
  type ActivityReward,
  type PlantAction,
  type RouteMove,
  type PackingStep,
  type FinalBlock,
  type FinalResource,
} from './activities';

type Screen = 'forest' | 'world-1' | 'world-2' | 'world-3';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private cdr: ChangeDetectorRef) {}
  // ═══════════════════════════════════════════════════════════
  // ESTADO GLOBAL
  // ═══════════════════════════════════════════════════════════
  currentScreen: Screen = 'forest';
  experience = 0;
  seeds = 0;
  level2Unlocked = true; // TODO: volver a false antes de publicar (habilitado para desarrollo)
  level3Unlocked = true; // TODO: volver a false antes de publicar (habilitado para desarrollo)

  // ═══════════════════════════════════════════════════════════
  // MUNDO 1 - SEMILLAS (SECUENCIAS)
  // ═══════════════════════════════════════════════════════════
  currentActivity = 0;
  totalActivities = 5;

  // Actividad 1 – Sándwich
  sandwichStep: 'intro' | 'game' | 'done' = 'intro';
  sandwichOptions: string[] = [];
  sandwichBuild: string[] = [];
  sandwichFeedback = '';
  sandwichDone = false;
  draggingIngredient: string | null = null;
  dropReady = false;

  // Actividad 2 – Planta (construir secuencia y ejecutarla)
  plantStage: 'empty' | 'seed' | 'sprout' | 'flower' = 'empty';
  plantActions: PlantAction[] = [];   // pasos ya ejecutados correctamente (para la escena)
  plantSequence: PlantAction[] = [];   // secuencia que arma el niño antes de ejecutar
  plantFeedback = '';
  plantDone = false;
  plantRunning = false;                // true mientras se ejecuta la secuencia paso a paso
  plantActiveStep = -1;                // índice del bloque que se está ejecutando (para resaltar)

  // Actividad 3 – Ruta (grid 4x5: x: 0-3, y: 0-4)
  routeBuild: RouteMove[] = [];
  routeFeedback = '';
  routeDone = false;
  routeRunning = false;
  routeCharPos = { x: 0, y: 4 };  // Esquina inferior izquierda
  routeGoal = { x: 3, y: 2 };     // Casa en fila 2, columna 3
  routeObstacles: { x: number; y: number; emoji: string }[] = [
    { x: 1, y: 1, emoji: '🪨' },   // Roca
    { x: 3, y: 4, emoji: '🌳' }    // Árbol
  ];
  routeCharDirection: 'right' | 'left' | 'up' | 'down' = 'right';
  routeHitObstacle = false;
  routeCurrentStep = -1;
  routeGridRows = 5;  // 5 filas (y: 0-4)
  routeGridCols = 4;  // 4 columnas (x: 0-3)

  // Actividad 4 – Depuración (mochila)
  packingBuild: PackingStep[] = [...PACKING_INITIAL_ORDER];
  packingFeedback = '';
  packingDone = false;
  packingSelectedIdx: number | null = null;
  packingPacking = false;              // true mientras corre la animación de empaque
  packingItemsIn: PackingStep[] = [];  // objetos que ya "entraron" a la mochila (para animar)
  packingClosed = false;               // true cuando la mochila se cierra al final
  packingShake = false;                // sacudida cuando el orden es incorrecto

  // Actividad 5 – Reto final (recoger Agua 💧, Luz ☀️, Tierra 🌱 y plantar en la semilla mágica)
  finalBuild: FinalBlock[] = [];
  finalFeedback = '';
  finalDone = false;
  finalRunning = false;
  finalCharPos = { x: 0, y: 2 };
  finalStartPos = { x: 0, y: 2 };
  finalSeedPos = { x: 2, y: 0 };            // Posición de la semilla mágica
  finalResources: { x: number; y: number; type: FinalResource; collected: boolean }[] = [
    { x: 1, y: 2, type: 'water', collected: false },  // 💧 Agua
    { x: 2, y: 1, type: 'sun', collected: false },    // ☀️ Luz
    { x: 1, y: 0, type: 'soil', collected: false },   // 🌱 Tierra
  ];
  finalCollected: FinalResource[] = [];
  finalPlanted = false;
  finalCurrentStep = -1;
  finalSeedStageIndex = 0;                  // Índice en SEED_GROWTH_STAGES
  finalGrowing = false;

  // ═══════════════════════════════════════════════════════════
  // MUNDO 2 - SENDERO (VARIABLES)
  // ═══════════════════════════════════════════════════════════
  currentWorld2Activity = 0;
  totalWorld2Activities = 8;

  // Actividad 1 – Cajas mágicas
  magicItems = [
    { emoji: '⭐', label: 'estrella', placed: false },
    { emoji: '🍎', label: 'manzana', placed: false },
    { emoji: '🪙', label: 'moneda', placed: false },
    { emoji: '🌸', label: 'flor', placed: false },
    { emoji: '❤️', label: 'corazón', placed: false },
    { emoji: '🔑', label: 'llave', placed: false },
  ];
  magicBoxes = [
    { accepts: 'moneda', filled: false, emoji: '' },
    { accepts: 'corazón', filled: false, emoji: '' },
    { accepts: 'estrella', filled: false, emoji: '' },
    { accepts: 'llave', filled: false, emoji: '' },
    { accepts: 'flor', filled: false, emoji: '' },
    { accepts: 'manzana', filled: false, emoji: '' },
  ];
  magicFeedback = '';
  magicDone = false;
  magicDragItem: { emoji: string; label: string; placed: boolean } | null = null;
  magicSelectedItem: { emoji: string; label: string; placed: boolean } | null = null;

  // Actividad 2 – Abrir cajas
  openBoxes = [
    { label: 'monedas', value: 5 as string | number, emoji: '🪙', revealed: false },
    { label: 'vidas', value: 3 as string | number, emoji: '❤️', revealed: false },
    { label: 'nombre', value: 'Nori' as string | number, emoji: '🧑‍🚀', revealed: false },
  ];
  openQuestion = '';
  openAnswer: string | number | null = null;
  openFeedback = '';
  openDone = false;
  openPhase: 'reveal' | 'question' = 'reveal';

  // Actividad 3 – Cambiar valor (vidas del personaje)
  changeValue = 3;
  changeTarget = 5;
  changeFeedback = '';
  changeDone = false;

  // Actividad 4 – La tienda de monedas
  shopPhase: 'shop' | 'quiz' | 'challenge' = 'shop';
  shopCoins = 10;
  shopItems = [
    { emoji: '🍎', name: 'Manzana', price: 2, bought: false },
    { emoji: '⚔️', name: 'Espada', price: 5, bought: false },
    { emoji: '🛡️', name: 'Escudo', price: 7, bought: false },
  ];
  shopFeedback = '';
  shopFeedbackError = false;
  shopQuizAnswered = false;
  shopDone = false;

  // Reto libre: empezar con 15 y quedar exactamente en 3
  challengeStart = 15;
  challengeGoal = 3;
  challengeCoins = 15;
  challengeItems = [
    { emoji: '🍎', name: 'Manzana', price: 2 },
    { emoji: '⚔️', name: 'Espada', price: 5 },
    { emoji: '🛡️', name: 'Escudo', price: 7 },
    { emoji: '🧪', name: 'Poción', price: 3 },
  ];
  challengeFeedback = '';
  challengeFeedbackError = false;
  challengeDone = false;

  // Actividad 5 – ¡Cuida tus vidas!
  readonly LIVES_MAX = 5;
  livesPhase: 'decide' | 'round' | 'mission' | 'quiz' = 'decide';
  livesValue = 3;
  livesFeedback = '';
  livesFeedbackError = false;
  livesDone = false;

  // Parte 1 – decidir qué pasa con la variable
  livesDecideEvents = [
    { emoji: '🐲', text: '¡Un monstruo te atacó!', delta: -1 },
    { emoji: '⭐', text: '¡Encontraste un corazón mágico!', delta: +1 },
  ];
  livesDecideIndex = 0;
  livesDecideResolved = false;

  // Parte 2 – ronda interactiva con eventos aleatorios
  livesRoundPool = [
    { emoji: '🐲', label: 'Monstruo', delta: -1 },
    { emoji: '💖', label: 'Corazón', delta: +1 },
    { emoji: '🪤', label: 'Trampa', delta: -1 },
    { emoji: '✨', label: 'Bonus', delta: +1 },
  ];
  livesRoundEvent = this.livesRoundPool[0];
  livesRoundCount = 0;
  livesRoundGoal = 5; // reacciona a 5 eventos
  livesGameOver = false;

  // Parte 3 – misión: llegar al final con al menos 2 vidas
  livesMissionValue = 3;
  livesMissionMin = 2;
  livesMissionSteps = [
    { emoji: '🐲', label: 'Monstruo', delta: -1 },
    { emoji: '💖', label: 'Corazón', delta: +1 },
    { emoji: '🪤', label: 'Trampa', delta: -1 },
    { emoji: '✨', label: 'Bonus', delta: +1 },
    { emoji: '🐲', label: 'Monstruo', delta: -1 },
  ];
  livesMissionIndex = 0;
  livesMissionFeedback = '';
  livesMissionFailed = false;

  // Parte 4 – mini desafío final
  livesQuizAnswered = false;

  // Actividad 6 – ¿Quién eres?
  heroPhase: 'name' | 'use' | 'change' | 'type' | 'final' = 'name';
  heroName = '';
  heroNewName = '';
  heroFeedback = '';
  heroFeedbackError = false;
  heroDone = false;

  // Parte 4 – clasificar tipo de información
  heroTypeVars = [
    { emoji: '🪙', name: 'monedas', value: '10', isText: false },
    { emoji: '❤️', name: 'vidas', value: '3', isText: false },
    { emoji: '👤', name: 'nombre', value: '"Sofía"', isText: true },
    { emoji: '🎮', name: 'nivel', value: '5', isText: false },
  ];
  heroTypeAnswered = false;

  // Desafío final – mensaje con dos variables
  heroFinalName = 'Mateo';
  heroFinalPet = 'Luna';
  heroFinalQuizAnswered = false;

  // Actividad 7 – Mochila de variables
  backpack = { name: '', coins: 0, lives: 0, points: 0 };
  backpackPhase: 'edit' | 'adventure' | 'done' = 'edit';
  backpackFeedback = '';
  backpackAdventureStep = 0;
  backpackDone = false;

  // Actividad 8 – Evaluación final
  quizAnswers: (string | null)[] = [null, null, null];
  quizCorrect = ['6', 'texto', 'cambiar'];
  quizFeedback = '';
  quizDone = false;

  // ═══════════════════════════════════════════════════════════
  // MUNDO 3 - RÍO (CONDICIONALES)
  // ═══════════════════════════════════════════════════════════
  currentWorld3Activity = 0;
  totalWorld3Activities = 7;

  // Actividad 1 – La bifurcación
  forkScenarios = [
    { emoji: '🔑', text: 'Tienes la llave.', hasKey: true },
    { emoji: '🚫', text: 'No tienes la llave.', hasKey: false },
    { emoji: '🔑', text: '¡Encontraste una llave dorada!', hasKey: true },
  ];
  forkIndex = 0;
  forkFeedback = '';
  forkFeedbackError = false;
  forkDone = false;

  // Actividad 2 – El detector (¿es igual?)
  detectorRounds = [
    { icon: '🪙', label: 'Monedas', value: 5, goal: 5 },
    { icon: '❤️', label: 'Vidas', value: 3, goal: 5 },
    { icon: '⭐', label: 'Puntos', value: 8, goal: 8 },
  ];
  detectorIndex = 0;
  detectorFeedback = '';
  detectorFeedbackError = false;
  detectorDone = false;

  // Actividad 3 – La puerta de las monedas (mayor/menor que)
  doorRounds = [
    { coins: 7, required: 5 },
    { coins: 3, required: 5 },
  ];
  doorIndex = 0;
  doorFeedback = '';
  doorFeedbackError = false;
  doorOpen = false;
  doorDone = false;

  // Actividad 4 – Si tienes vidas...
  ifLivesValue = 4;
  ifLivesFeedback = '';
  ifLivesReached0 = false;
  ifLivesReachedContinue = false;
  ifLivesDone = false;

  // Actividad 5 – Si no... toma otro camino (SI / SINO)
  elseScenarios = [
    {
      question: '🔑 ¿Tienes la llave?',
      hasIt: true,
      ifText: '🚪 Abre la puerta.',
      elseText: '🔄 Busca otra entrada.',
    },
    {
      question: '🪙 ¿Tienes 10 monedas?',
      hasIt: false,
      ifText: '🛒 Compra el objeto.',
      elseText: '🚫 No puedes comprarlo.',
    },
  ];
  elseIndex = 0;
  elseResult: 'if' | 'else' | null = null;
  elseFeedback = '';
  elseFeedbackError = false;
  elseDone = false;

  // Actividad 6 – El guardián del río (variables + condiciones)
  guardianScenarios = [
    { lives: 4, hasKey: true },
    { lives: 2, hasKey: true },
    { lives: 5, hasKey: false },
  ];
  guardianIndex = 0;
  guardianFeedback = '';
  guardianFeedbackError = false;
  guardianDone = false;

  // Actividad 7 – Reto final: ¡Cruza el Río!
  crossKey = false;
  crossCoins = 5;
  crossLives = 3;
  crossBoat = false;
  crossStep = 0; // 0 puente, 1 tienda, 2 monstruo, 3 meta
  crossFeedback = '';
  crossFeedbackError = false;
  crossGameOver = false;
  crossDone = false;

  // ═══════════════════════════════════════════════════════════
  // NAVEGACIÓN
  // ═══════════════════════════════════════════════════════════
  openWorld1(): void {
    this.currentScreen = 'world-1';
    this.currentActivity = 0;
    this.resetWorld1Activities();
  }

  openWorld2(): void {
    if (this.level2Unlocked) {
      this.currentScreen = 'world-2';
      this.currentWorld2Activity = 0;
      this.resetWorld2Activities();
    }
  }

  // Otorga la recompensa final, desbloquea y entra directamente al Mundo 2
  unlockAndOpenWorld2(): void {
    if (!this.level2Unlocked) {
      this.applyReward({ experience: 10, seeds: 1 });
      this.level2Unlocked = true;
    }
    this.currentScreen = 'world-2';
    this.currentWorld2Activity = 0;
    this.resetWorld2Activities();
    this.cdr.detectChanges();
  }

  openWorld3(): void {
    if (this.level3Unlocked) {
      this.currentScreen = 'world-3';
      this.currentWorld3Activity = 0;
      this.resetWorld3Activities();
    }
  }

  // Otorga la recompensa final del Mundo 2, desbloquea y entra al Mundo 3
  unlockAndOpenWorld3(): void {
    if (!this.level3Unlocked) {
      this.level3Unlocked = true;
    }
    this.currentScreen = 'world-3';
    this.currentWorld3Activity = 0;
    this.resetWorld3Activities();
    this.cdr.detectChanges();
  }

  backToForest(): void {
    this.currentScreen = 'forest';
  }

  applyReward(reward: ActivityReward): void {
    this.experience += reward.experience;
    this.seeds += reward.seeds;
  }

  // ═══════════════════════════════════════════════════════════
  // MUNDO 1: MÉTODOS GENERALES
  // ═══════════════════════════════════════════════════════════
  nextActivity(): void {
    const reward: ActivityReward = { experience: 10, seeds: 1 };
    this.applyReward(reward);
    if (this.currentActivity < this.totalActivities - 1) {
      this.currentActivity++;
      this.resetCurrentActivity();
    } else {
      this.level2Unlocked = true;
    }
  }

  skipActivity(): void {
    if (this.currentActivity < this.totalActivities - 1) {
      this.currentActivity++;
      this.resetCurrentActivity();
    } else {
      this.level2Unlocked = true;
    }
  }

  progressPercent(): number {
    return Math.round((this.currentActivity / this.totalActivities) * 100);
  }

  resetWorld1Activities(): void {
    this.resetSandwich();
    this.resetPlant();
    this.resetRoute();
    this.resetPacking();
    this.resetFinal();
  }

  resetCurrentActivity(): void {
    switch (this.currentActivity) {
      case 0: this.resetSandwich(); break;
      case 1: this.resetPlant(); break;
      case 2: this.resetRoute(); break;
      case 3: this.resetPacking(); break;
      case 4: this.resetFinal(); break;
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 1: SÁNDWICH
  // ───────────────────────────────────────────────────────────
  resetSandwich(): void {
    this.sandwichStep = 'intro';
    this.sandwichOptions = this.shuffleArray([...SANDWICH_CORRECT_ORDER]);
    this.sandwichBuild = [];
    this.sandwichFeedback = '';
    this.sandwichDone = false;
    this.draggingIngredient = null;
    this.dropReady = false;
  }

  goToSandwichGame(): void {
    this.sandwichStep = 'game';
  }

  shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  layerClass(emoji: string): string {
    const map: Record<string, string> = {
      '🍞': 'bread-layer',
      '🥬': 'lettuce-layer',
      '🧀': 'cheese-layer',
      '🥪': 'close-layer'
    };
    return map[emoji] || '';
  }

  getIngredientName(emoji: string): string {
    const names: Record<string, string> = {
      '🍞': 'Pan',
      '🥬': 'Lechuga',
      '🧀': 'Queso',
      '🥪': 'Cerrar'
    };
    return names[emoji] || '';
  }

  onDragStart(ingredient: string): void {
    this.draggingIngredient = ingredient;
  }

  onDragEnd(): void {
    this.draggingIngredient = null;
    this.dropReady = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dropReady = true;
  }

  onDragLeave(): void {
    this.dropReady = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropReady = false;
    if (this.draggingIngredient && !this.sandwichBuild.includes(this.draggingIngredient)) {
      this.sandwichBuild = [...this.sandwichBuild, this.draggingIngredient];
    }
    this.draggingIngredient = null;
  }

  addIngredient(ingredient: string): void {
    if (!this.sandwichBuild.includes(ingredient)) {
      this.sandwichBuild = [...this.sandwichBuild, ingredient];
    }
  }

  checkSandwich(): void {
    const correct = SANDWICH_CORRECT_ORDER.every((s, i) => this.sandwichBuild[i] === s);
    if (correct) {
      this.sandwichFeedback = '¡Perfecto! 🎉';
      this.sandwichDone = true;
      this.sandwichStep = 'done';
    } else {
      this.sandwichFeedback = 'Orden incorrecto. ¡Inténtalo de nuevo!';
      this.sandwichBuild = [];
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 2: PLANTA
  // ───────────────────────────────────────────────────────────
  resetPlant(): void {
    this.plantStage = 'empty';
    this.plantActions = [];
    this.plantSequence = [];
    this.plantFeedback = '';
    this.plantDone = false;
    this.plantRunning = false;
    this.plantActiveStep = -1;
  }

  plantEmoji(): string {
    return this.plantStage === 'seed' ? '🌱' : this.plantStage === 'sprout' ? '🌿' : '🌻';
  }

  actionLabel(action: PlantAction): string {
    return action === 'plant' ? 'Plantar' : action === 'water' ? 'Regar' : 'Sol';
  }

  actionEmoji(action: PlantAction): string {
    return action === 'plant' ? '🌱' : action === 'water' ? '💧' : '☀️';
  }

  // El niño agrega un bloque de acción a su secuencia
  addPlantBlock(action: PlantAction): void {
    if (this.plantRunning || this.plantDone) return;
    if (this.plantSequence.length >= PLANT_GROWTH_ORDER.length) return;
    this.plantSequence.push(action);
    this.plantFeedback = '';
  }

  removePlantBlock(index: number): void {
    if (this.plantRunning || this.plantDone) return;
    this.plantSequence.splice(index, 1);
    this.plantFeedback = '';
  }

  clearPlantSequence(): void {
    if (this.plantRunning) return;
    this.plantSequence = [];
    this.plantFeedback = '';
  }

  // Ejecuta la secuencia armada, paso a paso, validando el orden
  runPlantSequence(): void {
    if (this.plantRunning || this.plantDone) return;
    if (this.plantSequence.length === 0) {
      this.plantFeedback = 'Primero arma tu secuencia con los bloques 🌱💧☀️';
      return;
    }

    this.plantRunning = true;
    this.plantActions = [];
    this.plantStage = 'empty';
    this.plantFeedback = '';
    this.plantActiveStep = -1;
    this.cdr.detectChanges();
    // pequeño respiro para que se vea la tierra vacía antes del primer paso
    setTimeout(() => this.runPlantStep(0), 400);
  }

  private runPlantStep(idx: number): void {
    // Terminó de recorrer toda la secuencia
    if (idx >= this.plantSequence.length) {
      this.finishPlantRun();
      return;
    }

    this.plantActiveStep = idx;
    const action = this.plantSequence[idx];

    setTimeout(() => {
      // ¿Es el paso correcto en este punto de la secuencia?
      if (PLANT_GROWTH_ORDER[idx] !== action) {
        this.plantActiveStep = -1;
        this.plantRunning = false;
        this.plantFeedback = `¡Ups! El paso ${idx + 1} no va en ese orden. Recuerda: primero Plantar 🌱, luego Regar 💧 y al final Sol ☀️.`;
        this.plantStage = 'empty';
        this.plantActions = [];
        this.cdr.detectChanges();
        return;
      }

      // Paso correcto: actualiza la escena
      this.plantActions.push(action);
      if (action === 'plant') this.plantStage = 'seed';
      else if (action === 'water') this.plantStage = 'sprout';
      else if (action === 'sun') this.plantStage = 'flower';
      this.cdr.detectChanges();

      this.runPlantStep(idx + 1);
    }, 700);
  }

  private finishPlantRun(): void {
    this.plantActiveStep = -1;
    this.plantRunning = false;

    const correct =
      this.plantSequence.length === PLANT_GROWTH_ORDER.length &&
      this.plantSequence.every((a, i) => a === PLANT_GROWTH_ORDER[i]);

    if (correct) {
      this.plantStage = 'flower';
      this.plantDone = true;
    } else {
      this.plantFeedback = 'Casi. Faltan pasos o el orden no es completo. Prueba: 🌱 → 💧 → ☀️';
      this.plantStage = 'empty';
      this.plantActions = [];
    }
    this.cdr.detectChanges();
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 3: RUTA
  // ───────────────────────────────────────────────────────────
  resetRoute(): void {
    this.routeBuild = [];
    this.routeFeedback = '';
    this.routeDone = false;
    this.routeRunning = false;
    this.routeCharPos = { x: 0, y: 4 };  // Esquina inferior izquierda
    this.routeCharDirection = 'right';
    this.routeHitObstacle = false;
    this.routeCurrentStep = -1;
  }

  addRouteMove(move: RouteMove): void {
    if (this.routeBuild.length < 6 && !this.routeDone && !this.routeRunning) {
      this.routeBuild = [...this.routeBuild, move];
    }
  }

  removeLastMove(): void {
    if (this.routeBuild.length > 0 && !this.routeRunning) {
      this.routeBuild = this.routeBuild.slice(0, -1);
    }
  }

  routeMoveEmoji(m: RouteMove): string {
    return m === 'right' ? '➡️' : m === 'up' ? '⬆️' : m === 'left' ? '⬅️' : '⬇️';
  }

  getCurrentStep(): number {
    return this.routeCurrentStep;
  }

  isObstacle(x: number, y: number): boolean {
    return this.routeObstacles.some(o => o.x === x && o.y === y);
  }

  getObstacleEmoji(x: number, y: number): string {
    const obstacle = this.routeObstacles.find(o => o.x === x && o.y === y);
    return obstacle ? obstacle.emoji : '';
  }

  runRoute(): void {
    // Validaciones iniciales
    if (this.routeRunning || this.routeDone || this.routeBuild.length === 0) {
      return;
    }
    
    // Iniciar ejecución
    this.routeRunning = true;
    this.routeCharPos = { x: 0, y: 4 };  // Posición inicial: esquina inferior izquierda
    this.routeFeedback = '';
    this.routeHitObstacle = false;
    this.routeCurrentStep = -1;
    
    let stepIndex = 0;
    
    const executeStep = () => {
      // Verificar si ya terminamos todos los movimientos
      if (stepIndex >= this.routeBuild.length) {
        this.routeRunning = false;
        this.routeCurrentStep = -1;
        if (this.routeCharPos.x === this.routeGoal.x && this.routeCharPos.y === this.routeGoal.y) {
          this.routeFeedback = '¡Nori llegó a casa! 🎉';
          this.routeDone = true;
        } else {
          this.routeFeedback = 'Nori no llegó a casa. ¡Intenta otra ruta!';
        }
        this.cdr.detectChanges();
        return;
      }
      
      this.routeCurrentStep = stepIndex;
      const move = this.routeBuild[stepIndex];
      this.routeCharDirection = move;
      
      let newX = this.routeCharPos.x;
      let newY = this.routeCharPos.y;
      
      if (move === 'right') newX++;
      else if (move === 'left') newX--;
      else if (move === 'up') newY--;
      else if (move === 'down') newY++;
      
      // Verificar límites del grid (4x5: x: 0-3, y: 0-4)
      if (newX < 0 || newX > 3 || newY < 0 || newY > 4) {
        this.routeRunning = false;
        this.routeCurrentStep = -1;
        this.routeFeedback = '¡Nori se salió del camino! 😵';
        this.cdr.detectChanges();
        return;
      }
      
      // Verificar obstáculos
      if (this.isObstacle(newX, newY)) {
        this.routeHitObstacle = true;
        this.routeRunning = false;
        this.routeCurrentStep = -1;
        this.routeFeedback = '¡Nori chocó con un obstáculo! 💥';
        this.cdr.detectChanges();
        return;
      }
      
      // Movimiento válido - actualizar posición
      this.routeCharPos = { x: newX, y: newY };
      stepIndex++;

      // Si Nori llegó a casa, celebrar de inmediato (aunque queden movimientos)
      if (newX === this.routeGoal.x && newY === this.routeGoal.y) {
        this.routeRunning = false;
        this.routeCurrentStep = -1;
        this.routeFeedback = '¡Nori llegó a casa! 🎉';
        this.routeDone = true;
        this.cdr.detectChanges();
        return;
      }

      this.cdr.detectChanges();

      // Continuar con el siguiente movimiento
      setTimeout(() => executeStep(), 600);
    };
    
    // Iniciar la ejecución después de un pequeño delay
    this.cdr.detectChanges();
    setTimeout(() => executeStep(), 300);
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 4: DEPURACIÓN MOCHILA
  // ───────────────────────────────────────────────────────────
  resetPacking(): void {
    this.packingBuild = [...PACKING_INITIAL_ORDER];
    this.packingFeedback = '';
    this.packingDone = false;
    this.packingSelectedIdx = null;
    this.packingPacking = false;
    this.packingItemsIn = [];
    this.packingClosed = false;
    this.packingShake = false;
  }

  packingEmoji(step: PackingStep): string {
    return step === 'apple' ? '🍎' : step === 'water' ? '💧' : '🎒';
  }

  packingLabel(step: PackingStep): string {
    return step === 'apple' ? 'Manzana' : step === 'water' ? 'Agua' : 'Cerrar mochila';
  }

  selectPackingStep(idx: number): void {
    if (this.packingDone) return;
    if (this.packingSelectedIdx === null) {
      this.packingSelectedIdx = idx;
    } else {
      const temp = this.packingBuild[this.packingSelectedIdx];
      this.packingBuild[this.packingSelectedIdx] = this.packingBuild[idx];
      this.packingBuild[idx] = temp;
      this.packingSelectedIdx = null;
    }
  }

  checkPacking(): void {
    if (this.packingPacking || this.packingDone) return;
    const ok = PACKING_CORRECT_ORDER.every((s, i) => this.packingBuild[i] === s);

    if (!ok) {
      // Animación de error: la mochila se sacude
      this.packingFeedback = 'El orden no es correcto. Intercambia los pasos.';
      this.packingShake = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.packingShake = false;
        this.cdr.detectChanges();
      }, 600);
      return;
    }

    // Animación de éxito: los objetos entran uno a uno y luego se cierra la mochila
    this.packingPacking = true;
    this.packingItemsIn = [];
    this.packingClosed = false;
    this.packingFeedback = 'Empacando... 🎒';
    this.cdr.detectChanges();
    this.packItemsStep(0);
  }

  private packItemsStep(idx: number): void {
    // Solo animamos manzana y agua entrando (los pasos que "guardan" algo)
    const itemsToPack: PackingStep[] = this.packingBuild.filter(s => s !== 'close');

    if (idx >= itemsToPack.length) {
      // Todos dentro: cerrar la mochila
      setTimeout(() => {
        this.packingClosed = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.packingPacking = false;
          this.packingFeedback = '¡Mochila lista! 🎉';
          this.packingDone = true;
          this.cdr.detectChanges();
        }, 700);
      }, 500);
      return;
    }

    setTimeout(() => {
      this.packingItemsIn = [...this.packingItemsIn, itemsToPack[idx]];
      this.cdr.detectChanges();
      this.packItemsStep(idx + 1);
    }, 700);
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 5: RETO FINAL
  // ───────────────────────────────────────────────────────────
  resetFinal(): void {
    this.finalBuild = [];
    this.finalFeedback = '';
    this.finalDone = false;
    this.finalRunning = false;
    this.finalCharPos = { ...this.finalStartPos };
    this.finalResources = [
      { x: 1, y: 2, type: 'water', collected: false },
      { x: 2, y: 1, type: 'sun', collected: false },
      { x: 1, y: 0, type: 'soil', collected: false },
    ];
    this.finalCollected = [];
    this.finalPlanted = false;
    this.finalCurrentStep = -1;
    this.finalSeedStageIndex = 0;
    this.finalGrowing = false;
  }

  addFinalBlock(block: FinalBlock): void {
    if (this.finalBuild.length < 12 && !this.finalDone && !this.finalRunning) {
      this.finalBuild = [...this.finalBuild, block];
    }
  }

  removeFinalBlock(): void {
    if (this.finalBuild.length > 0 && !this.finalRunning) {
      this.finalBuild = this.finalBuild.slice(0, -1);
    }
  }

  finalBlockLabel(b: FinalBlock): string {
    switch (b) {
      case 'right': return '➡️ Avanzar';
      case 'up': return '⬆️ Subir';
      case 'left': return '⬅️ Izquierda';
      case 'down': return '⬇️ Bajar';
      case 'collect': return '🫳 Recoger';
      case 'plant': return '🌱 Plantar';
    }
  }

  // Helpers para el template
  finalResourceEmoji(type: FinalResource): string {
    return FINAL_RESOURCE_EMOJI[type];
  }

  finalResourceLabel(type: FinalResource): string {
    return FINAL_RESOURCE_LABEL[type];
  }

  finalResourceAt(x: number, y: number): { type: FinalResource; collected: boolean } | undefined {
    return this.finalResources.find((r) => r.x === x && r.y === y);
  }

  finalSeedEmoji(): string {
    return SEED_GROWTH_STAGES[this.finalSeedStageIndex];
  }

  finalAllCollected(): boolean {
    return this.finalResources.every((r) => r.collected);
  }

  runFinal(): void {
    if (this.finalRunning || this.finalDone || this.finalBuild.length === 0) return;
    // Reiniciar mundo de ejecución
    this.finalRunning = true;
    this.finalCharPos = { ...this.finalStartPos };
    this.finalResources.forEach((r) => (r.collected = false));
    this.finalCollected = [];
    this.finalPlanted = false;
    this.finalCurrentStep = -1;
    this.finalSeedStageIndex = 0;
    this.finalGrowing = false;
    this.finalFeedback = '';

    let i = 0;
    const run = () => {
      if (i >= this.finalBuild.length) {
        this.finalRunning = false;
        this.finalCurrentStep = -1;
        if (this.finalPlanted) {
          this.finishFinalChallenge();
        } else if (this.finalAllCollected()) {
          this.finalFeedback = 'Recogiste todo, pero falta 🌱 PLANTAR en la semilla mágica.';
        } else {
          this.finalFeedback = 'Aún faltan recursos por recoger. ¡Intenta otra ruta!';
        }
        this.cdr.detectChanges();
        return;
      }

      this.finalCurrentStep = i;
      const b = this.finalBuild[i];
      let newX = this.finalCharPos.x;
      let newY = this.finalCharPos.y;

      if (b === 'right') newX++;
      else if (b === 'left') newX--;
      else if (b === 'up') newY--;
      else if (b === 'down') newY++;

      if (b === 'right' || b === 'left' || b === 'up' || b === 'down') {
        // Validar límites del grid 3x3 (x: 0-2, y: 0-2)
        if (newX < 0 || newX > 2 || newY < 0 || newY > 2) {
          this.finalRunning = false;
          this.finalCurrentStep = -1;
          this.finalFeedback = '¡Nori se salió del camino! 😵';
          this.cdr.detectChanges();
          return;
        }
        this.finalCharPos = { x: newX, y: newY };
      } else if (b === 'collect') {
        const res = this.finalResourceAt(this.finalCharPos.x, this.finalCharPos.y);
        if (res && !res.collected) {
          res.collected = true;
          this.finalCollected = [...this.finalCollected, res.type];
          this.finalFeedback = `¡Recogiste ${FINAL_RESOURCE_EMOJI[res.type]} ${FINAL_RESOURCE_LABEL[res.type]}!`;
        } else {
          this.finalRunning = false;
          this.finalCurrentStep = -1;
          this.finalFeedback = 'Aquí no hay nada que recoger. 🤔';
          this.cdr.detectChanges();
          return;
        }
      } else if (b === 'plant') {
        const onSeed = this.finalCharPos.x === this.finalSeedPos.x && this.finalCharPos.y === this.finalSeedPos.y;
        if (!onSeed) {
          this.finalRunning = false;
          this.finalCurrentStep = -1;
          this.finalFeedback = 'Debes estar sobre la semilla mágica 🌟 para plantar.';
          this.cdr.detectChanges();
          return;
        }
        if (!this.finalAllCollected()) {
          this.finalRunning = false;
          this.finalCurrentStep = -1;
          this.finalFeedback = 'Necesitas 💧 Agua, ☀️ Luz y 🌱 Tierra antes de plantar.';
          this.cdr.detectChanges();
          return;
        }
        this.finalPlanted = true;
        this.finalFeedback = '¡Plantaste la semilla mágica! 🌱';
      }

      i++;
      this.cdr.detectChanges();
      setTimeout(run, 500);
    };

    this.cdr.detectChanges();
    setTimeout(run, 300);
  }

  // Animación de crecimiento de la semilla gigante: 🌱 → 🌿 → 🌳 → 🌲
  private finishFinalChallenge(): void {
    this.finalGrowing = true;
    this.finalFeedback = '';
    this.finalSeedStageIndex = 0;
    this.cdr.detectChanges();

    const grow = () => {
      if (this.finalSeedStageIndex < SEED_GROWTH_STAGES.length - 1) {
        this.finalSeedStageIndex++;
        this.cdr.detectChanges();
        setTimeout(grow, 700);
      } else {
        this.finalGrowing = false;
        this.finalDone = true;
        this.cdr.detectChanges();
      }
    };
    setTimeout(grow, 700);
  }

  // ═══════════════════════════════════════════════════════════
  // MUNDO 2: MÉTODOS GENERALES
  // ═══════════════════════════════════════════════════════════
  nextWorld2Activity(): void {
    const reward: ActivityReward = { experience: 10, seeds: 1 };
    this.applyReward(reward);
    if (this.currentWorld2Activity < this.totalWorld2Activities - 1) {
      this.currentWorld2Activity++;
      this.resetCurrentWorld2Activity();
    }
  }

  skipWorld2Activity(): void {
    if (this.currentWorld2Activity < this.totalWorld2Activities - 1) {
      this.currentWorld2Activity++;
      this.resetCurrentWorld2Activity();
    }
  }

  world2ProgressPercent(): number {
    return Math.round((this.currentWorld2Activity / this.totalWorld2Activities) * 100);
  }

  resetWorld2Activities(): void {
    this.resetMagic();
    this.resetOpen();
    this.resetChange();
    this.resetShop();
    this.resetLives();
    this.resetHero();
    this.resetBackpack();
    this.resetQuiz();
  }

  resetCurrentWorld2Activity(): void {
    switch (this.currentWorld2Activity) {
      case 0: this.resetMagic(); break;
      case 1: this.resetOpen(); break;
      case 2: this.resetChange(); break;
      case 3: this.resetShop(); break;
      case 4: this.resetLives(); break;
      case 5: this.resetHero(); break;
      case 6: this.resetBackpack(); break;
      case 7: this.resetQuiz(); break;
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 1: CAJAS MÁGICAS
  // ───────────────────────────────────────────────────────────
  resetMagic(): void {
    this.magicItems = [
      { emoji: '⭐', label: 'estrella', placed: false },
      { emoji: '🍎', label: 'manzana', placed: false },
      { emoji: '🪙', label: 'moneda', placed: false },
      { emoji: '🌸', label: 'flor', placed: false },
      { emoji: '❤️', label: 'corazón', placed: false },
      { emoji: '🔑', label: 'llave', placed: false },
    ];
    this.magicBoxes = [
      { accepts: 'moneda', filled: false, emoji: '' },
      { accepts: 'corazón', filled: false, emoji: '' },
      { accepts: 'estrella', filled: false, emoji: '' },
      { accepts: 'llave', filled: false, emoji: '' },
      { accepts: 'flor', filled: false, emoji: '' },
      { accepts: 'manzana', filled: false, emoji: '' },
    ];
    this.magicFeedback = '';
    this.magicDone = false;
    this.magicDragItem = null;
    this.magicSelectedItem = null;
  }

  // Inicio del arrastre de un elemento
  startMagicDrag(item: { emoji: string; label: string; placed: boolean }): void {
    if (item.placed) return;
    this.magicDragItem = item;
  }

  // Selección por clic (útil en táctil): 1º clic elige, 2º clic en la caja coloca
  selectMagicItem(item: { emoji: string; label: string; placed: boolean }): void {
    if (item.placed) return;
    this.magicSelectedItem = this.magicSelectedItem === item ? null : item;
  }

  // Se suelta/coloca un elemento en una caja concreta elegida por el usuario
  dropMagicItem(boxIdx: number): void {
    const item = this.magicDragItem ?? this.magicSelectedItem;
    if (!item) return;
    this.placeMagicItem(item, boxIdx);
    this.magicDragItem = null;
    this.magicSelectedItem = null;
  }

  private placeMagicItem(item: { emoji: string; label: string; placed: boolean }, boxIdx: number): void {
    const box = this.magicBoxes[boxIdx];
    if (box.filled || item.placed) return;
    if (box.accepts === item.label) {
      box.filled = true;
      box.emoji = item.emoji;
      item.placed = true;
      this.magicFeedback = '¡Correcto! ' + item.emoji + ' va en caja_' + box.accepts;
      if (this.magicBoxes.every((b) => b.filled)) this.magicDone = true;
    } else {
      this.magicFeedback = 'La caja_' + box.accepts + ' no es para ' + item.label;
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 2: ABRIR CAJAS
  // ───────────────────────────────────────────────────────────
  resetOpen(): void {
    this.openBoxes = [
      { label: 'monedas', value: 5, emoji: '🪙', revealed: false },
      { label: 'vidas', value: 3, emoji: '❤️', revealed: false },
      { label: 'nombre', value: 'Nori', emoji: '🧑‍🚀', revealed: false },
    ];
    this.openQuestion = '';
    this.openAnswer = null;
    this.openFeedback = '';
    this.openDone = false;
    this.openPhase = 'reveal';
  }

  revealBox(idx: number): void {
    this.openBoxes[idx].revealed = true;
    this.cdr.detectChanges();
    if (this.openBoxes.every((b) => b.revealed)) {
      // Esperamos un momento para que se vea el contenido de la última caja
      // abierta antes de pasar a la fase de pregunta.
      setTimeout(() => {
        this.openPhase = 'question';
        this.openQuestion = '¿Cuántas monedas tiene Nori?';
        this.openAnswer = 5;
        this.cdr.detectChanges();
      }, 1200);
    }
  }

  checkOpenAnswer(ans: number | string): void {
    if (ans === this.openAnswer) {
      this.openFeedback = '¡Correcto!';
      this.openDone = true;
    } else {
      this.openFeedback = 'Incorrecto, mira bien las cajas';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 3: CAMBIAR VALOR
  // ───────────────────────────────────────────────────────────
  resetChange(): void {
    this.changeValue = 3;
    this.changeTarget = 5;
    this.changeFeedback = '';
    this.changeDone = false;
  }

  // Array de corazones para dibujar las vidas actuales
  get changeHearts(): number[] {
    return Array.from({ length: this.changeValue }, (_, i) => i);
  }

  changeAdd(): void {
    if (this.changeDone) return;
    this.changeValue++;
    this.checkChange('add');
  }

  changeSub(): void {
    if (this.changeDone) return;
    if (this.changeValue > 0) this.changeValue--;
    this.checkChange('sub');
  }

  checkChange(action: 'add' | 'sub'): void {
    if (this.changeValue === this.changeTarget) {
      this.changeFeedback = '❤️ Vidas = ' + this.changeValue + ' 🎉 ¡Llegaste a la meta!';
      this.changeDone = true;
    } else if (this.changeValue > this.changeTarget) {
      this.changeFeedback = '❤️ Vidas = ' + this.changeValue + ' · ¡Te pasaste! Quita una vida.';
    } else {
      const faltan = this.changeTarget - this.changeValue;
      this.changeFeedback =
        '❤️ Vidas = ' + this.changeValue + ' · Faltan ' + faltan + ' para llegar a ' + this.changeTarget + '.';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 4: TIENDA
  // ───────────────────────────────────────────────────────────
  resetShop(): void {
    this.shopPhase = 'shop';
    this.shopCoins = 10;
    this.shopItems = [
      { emoji: '🍎', name: 'Manzana', price: 2, bought: false },
      { emoji: '⚔️', name: 'Espada', price: 5, bought: false },
      { emoji: '🛡️', name: 'Escudo', price: 7, bought: false },
    ];
    this.shopFeedback = '';
    this.shopFeedbackError = false;
    this.shopQuizAnswered = false;
    this.shopDone = false;

    this.challengeCoins = this.challengeStart;
    this.challengeItems = [
      { emoji: '🍎', name: 'Manzana', price: 2 },
      { emoji: '⚔️', name: 'Espada', price: 5 },
      { emoji: '🛡️', name: 'Escudo', price: 7 },
      { emoji: '🧪', name: 'Poción', price: 3 },
    ];
    this.challengeFeedback = '';
    this.challengeFeedbackError = false;
    this.challengeDone = false;
  }

  buyItem(idx: number): void {
    const item = this.shopItems[idx];
    if (item.bought) return;
    if (this.shopCoins < item.price) {
      this.shopFeedbackError = true;
      this.shopFeedback =
        '❌ No puedes comprarlo. Necesitas ' + item.price + ' monedas, pero tienes ' + this.shopCoins + '.';
      return;
    }
    const antes = this.shopCoins;
    this.shopCoins -= item.price;
    item.bought = true;
    this.shopFeedbackError = false;
    this.shopFeedback =
      '¡Compraste ' + item.name.toLowerCase() + '! Tenías ' + antes + ' monedas y gastaste ' +
      item.price + '. Ahora tienes ' + this.shopCoins + ' monedas.';
    // Cuando ya no pueda comprar nada más (todo comprado o sin monedas suficientes)
    // pasamos a la fase de reflexión.
    const puedeSeguir = this.shopItems.some((i) => !i.bought && i.price <= this.shopCoins);
    if (!puedeSeguir) {
      setTimeout(() => {
        this.shopPhase = 'quiz';
        this.cdr.detectChanges();
      }, 1400);
    }
  }

  answerShopQuiz(answer: 'up' | 'down' | 'same'): void {
    if (answer === 'down') {
      this.shopQuizAnswered = true;
      this.shopFeedbackError = false;
      this.shopFeedback = '🎉 ¡Correcto! Cuando compras algo, el valor de la variable monedas disminuye.';
      setTimeout(() => {
        this.shopPhase = 'challenge';
        this.shopFeedback = '';
        this.cdr.detectChanges();
      }, 1600);
    } else {
      this.shopFeedbackError = true;
      this.shopFeedback = 'Piensa: al pagar, ¿tus monedas suben o bajan? Inténtalo de nuevo.';
    }
  }

  // ── Reto libre: quedar en exactamente 3 monedas ──
  buyChallengeItem(idx: number): void {
    if (this.challengeDone) return;
    const item = this.challengeItems[idx];
    if (this.challengeCoins < item.price) {
      this.challengeFeedbackError = true;
      this.challengeFeedback =
        '❌ No te alcanza. ' + item.name + ' cuesta ' + item.price + ' y tienes ' + this.challengeCoins + '.';
      return;
    }
    const antes = this.challengeCoins;
    this.challengeCoins -= item.price;
    this.challengeFeedbackError = false;
    this.challengeFeedback =
      antes + ' → ' + this.challengeCoins + ' (compraste ' + item.name.toLowerCase() + ' por ' + item.price + ')';
    if (this.challengeCoins === this.challengeGoal) {
      this.challengeDone = true;
      this.shopDone = true;
      this.challengeFeedback = '🎉 ¡Lo lograste! Te quedaste con exactamente ' + this.challengeGoal + ' monedas.';
    }
  }

  resetChallengeCoins(): void {
    this.challengeCoins = this.challengeStart;
    this.challengeFeedback = '';
    this.challengeFeedbackError = false;
    this.challengeDone = false;
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 5: VIDAS
  // ───────────────────────────────────────────────────────────
  resetLives(): void {
    this.livesPhase = 'decide';
    this.livesValue = 3;
    this.livesFeedback = '';
    this.livesFeedbackError = false;
    this.livesDone = false;

    this.livesDecideIndex = 0;
    this.livesDecideResolved = false;

    this.livesRoundEvent = this.pickLivesEvent();
    this.livesRoundCount = 0;
    this.livesGameOver = false;

    this.livesMissionValue = 3;
    this.livesMissionIndex = 0;
    this.livesMissionFeedback = '';
    this.livesMissionFailed = false;

    this.livesQuizAnswered = false;
  }

  // Corazones para dibujar el estado actual (parte 1 y 2)
  get livesHearts(): number[] {
    return Array.from({ length: this.livesValue }, (_, i) => i);
  }
  get livesMissionHearts(): number[] {
    return Array.from({ length: this.livesMissionValue }, (_, i) => i);
  }

  private clampLife(v: number): number {
    return Math.max(0, Math.min(this.LIVES_MAX, v));
  }

  private pickLivesEvent() {
    const i = Math.floor(Math.random() * this.livesRoundPool.length);
    return this.livesRoundPool[i];
  }

  // ── Parte 1: decidir qué pasa con la variable ──
  answerLivesDecide(choice: -1 | 0 | 1): void {
    if (this.livesDecideResolved) return;
    const ev = this.livesDecideEvents[this.livesDecideIndex];
    if (choice !== ev.delta) {
      this.livesFeedbackError = true;
      this.livesFeedback =
        ev.delta < 0 ? 'Un ataque te quita vidas. Intenta con ❤️ -1.'
                     : 'Un corazón te da vidas. Intenta con ❤️ +1.';
      return;
    }
    const antes = this.livesValue;
    this.livesValue = this.clampLife(this.livesValue + ev.delta);
    this.livesFeedbackError = false;
    this.livesDecideResolved = true;
    this.livesFeedback =
      '❤️ ' + antes + ' → ' + this.livesValue + (ev.delta < 0 ? ' ¡Perdiste una vida!' : ' 🎉');
  }

  nextLivesDecide(): void {
    if (this.livesDecideIndex < this.livesDecideEvents.length - 1) {
      this.livesDecideIndex++;
      this.livesDecideResolved = false;
      this.livesFeedback = '';
    } else {
      // pasar a la ronda interactiva
      this.livesPhase = 'round';
      this.livesValue = 3;
      this.livesRoundEvent = this.pickLivesEvent();
      this.livesRoundCount = 0;
      this.livesGameOver = false;
      this.livesFeedback = '';
    }
  }

  get livesDecideEvent() {
    return this.livesDecideEvents[this.livesDecideIndex];
  }

  // ── Parte 2: ronda interactiva ──
  reactLivesEvent(): void {
    if (this.livesGameOver) return;
    const ev = this.livesRoundEvent;
    const antes = this.livesValue;
    const nuevo = this.clampLife(antes + ev.delta);
    this.livesValue = nuevo;
    this.livesRoundCount++;

    if (nuevo === 0) {
      this.livesGameOver = true;
      this.livesFeedbackError = true;
      this.livesFeedback = '💀 Game Over. Te quedaste sin vidas.';
      return;
    }
    if (ev.delta > 0 && antes === this.LIVES_MAX) {
      this.livesFeedbackError = false;
      this.livesFeedback = '❤️ ' + this.LIVES_MAX + ' → ' + this.LIVES_MAX + ' 💡 ¡Ya tienes el máximo de vidas!';
    } else {
      this.livesFeedbackError = ev.delta < 0;
      this.livesFeedback = ev.emoji + ' ' + ev.label + ': ❤️ ' + antes + ' → ' + nuevo;
    }

    if (this.livesRoundCount >= this.livesRoundGoal) {
      this.livesPhase = 'mission';
      this.livesMissionValue = 3;
      this.livesMissionIndex = 0;
      this.livesMissionFeedback = '';
      this.livesMissionFailed = false;
      this.livesFeedback = '';
      return;
    }
    this.livesRoundEvent = this.pickLivesEvent();
  }

  restartLivesRound(): void {
    this.livesValue = 3;
    this.livesRoundCount = 0;
    this.livesGameOver = false;
    this.livesRoundEvent = this.pickLivesEvent();
    this.livesFeedback = '';
    this.livesFeedbackError = false;
  }

  // ── Parte 3: misión llegar al final con al menos 2 vidas ──
  get livesMissionStep() {
    return this.livesMissionSteps[this.livesMissionIndex];
  }

  advanceLivesMission(): void {
    if (this.livesMissionFailed || this.livesMissionIndex >= this.livesMissionSteps.length) return;
    const step = this.livesMissionSteps[this.livesMissionIndex];
    const antes = this.livesMissionValue;
    this.livesMissionValue = this.clampLife(antes + step.delta);
    this.livesMissionFeedback = step.emoji + ' ' + step.label + ': ❤️ ' + antes + ' → ' + this.livesMissionValue;
    this.livesMissionIndex++;

    if (this.livesMissionValue === 0) {
      this.livesMissionFailed = true;
      this.livesMissionFeedback = '💀 Game Over. Te quedaste sin vidas antes de la meta.';
      return;
    }

    if (this.livesMissionIndex >= this.livesMissionSteps.length) {
      if (this.livesMissionValue >= this.livesMissionMin) {
        this.livesMissionFeedback = '🏁 META 🎉 ¡Llegaste con ' + this.livesMissionValue + ' vidas!';
        setTimeout(() => {
          this.livesPhase = 'quiz';
          this.livesFeedback = '';
          this.cdr.detectChanges();
        }, 1600);
      } else {
        this.livesMissionFailed = true;
        this.livesMissionFeedback =
          '😢 Llegaste con ' + this.livesMissionValue + ' vida(s). Necesitabas al menos ' + this.livesMissionMin + '.';
      }
    }
  }

  restartLivesMission(): void {
    this.livesMissionValue = 3;
    this.livesMissionIndex = 0;
    this.livesMissionFeedback = '';
    this.livesMissionFailed = false;
  }

  // ── Parte 4: mini desafío final (2 → 1 → 2) ──
  answerLivesQuiz(value: number): void {
    if (this.livesQuizAnswered) return;
    if (value === 2) {
      this.livesQuizAnswered = true;
      this.livesFeedbackError = false;
      this.livesFeedback = '🎉 ¡Correcto! 2 → 1 → 2. Los eventos fueron cambiando el valor de la variable vidas.';
      this.livesDone = true;
    } else {
      this.livesFeedbackError = true;
      this.livesFeedback = 'Piensa paso a paso: monstruo (-1) y luego corazón (+1). Inténtalo otra vez.';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 6: NOMBRE
  // ───────────────────────────────────────────────────────────
  resetHero(): void {
    this.heroPhase = 'name';
    this.heroName = '';
    this.heroNewName = '';
    this.heroFeedback = '';
    this.heroFeedbackError = false;
    this.heroDone = false;
    this.heroTypeAnswered = false;
    this.heroFinalName = 'Mateo';
    this.heroFinalPet = 'Luna';
    this.heroFinalQuizAnswered = false;
  }

  // ── Parte 1: elegir el nombre ──
  saveHeroName(): void {
    if (this.heroName.trim().length === 0) {
      this.heroFeedbackError = true;
      this.heroFeedback = 'Escribe un nombre primero.';
      return;
    }
    this.heroName = this.heroName.trim();
    this.heroFeedbackError = false;
    this.heroFeedback = '';
    this.heroPhase = 'use';
  }

  // ── Parte 2: usar la variable → pasar a cambiarla ──
  goToChangeName(): void {
    this.heroNewName = '';
    this.heroFeedback = '';
    this.heroFeedbackError = false;
    this.heroPhase = 'change';
  }

  // ── Parte 3: cambiar el valor de la variable ──
  changeHeroName(): void {
    if (this.heroNewName.trim().length === 0) {
      this.heroFeedbackError = true;
      this.heroFeedback = 'Escribe un nombre nuevo para cambiar el valor.';
      return;
    }
    this.heroName = this.heroNewName.trim();
    this.heroFeedbackError = false;
    this.heroFeedback = '💡 ¡Exacto! La variable sigue siendo nombre, pero ahora guarda un valor diferente.';
  }

  goToTypePhase(): void {
    this.heroFeedback = '';
    this.heroFeedbackError = false;
    this.heroPhase = 'type';
  }

  // ── Parte 4: clasificar qué variable guarda texto ──
  answerHeroType(index: number): void {
    if (this.heroTypeAnswered) return;
    const chosen = this.heroTypeVars[index];
    if (chosen.isText) {
      this.heroTypeAnswered = true;
      this.heroFeedbackError = false;
      this.heroFeedback = '🎉 ¡Correcto! Algunas variables guardan números y otras pueden guardar texto.';
      setTimeout(() => {
        this.heroPhase = 'final';
        this.heroFeedback = '';
        this.cdr.detectChanges();
      }, 1600);
    } else {
      this.heroFeedbackError = true;
      this.heroFeedback = 'Esa guarda un número. El texto va entre comillas, como "Sofía".';
    }
  }

  // ── Desafío final: mensaje con dos variables ──
  answerHeroFinalQuiz(name: string): void {
    if (this.heroFinalQuizAnswered) return;
    if (name === 'Sara') {
      this.heroFinalQuizAnswered = true;
      this.heroFeedbackError = false;
      this.heroFeedback = '🎉 ¡Correcto! Al cambiar nombre = "Sara", el mensaje usa el nuevo valor.';
      this.heroDone = true;
    } else {
      this.heroFeedbackError = true;
      this.heroFeedback = 'Recuerda: solo cambió la variable nombre. La mascota sigue siendo Luna.';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 7: MOCHILA
  // ───────────────────────────────────────────────────────────
  resetBackpack(): void {
    this.backpack = { name: '', coins: 0, lives: 0, points: 0 };
    this.backpackPhase = 'edit';
    this.backpackFeedback = '';
    this.backpackAdventureStep = 0;
    this.backpackDone = false;
  }

  startBackpackAdventure(): void {
    if (!this.backpack.name.trim()) {
      this.backpackFeedback = 'Escribe el nombre del personaje';
      return;
    }
    this.backpackPhase = 'adventure';
    this.backpackFeedback = '';
  }

  backpackEvent(): void {
    const events = [
      () => { this.backpack.coins += 2; this.backpackFeedback = '+2 monedas'; },
      () => { this.backpack.lives -= 1; this.backpackFeedback = '-1 vida'; },
      () => { this.backpack.points += 5; this.backpackFeedback = '+5 puntos'; },
    ];
    if (this.backpackAdventureStep < events.length) {
      events[this.backpackAdventureStep]();
      this.backpackAdventureStep++;
      if (this.backpackAdventureStep >= events.length) {
        this.backpackPhase = 'done';
        this.backpackDone = true;
      }
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 8: EVALUACIÓN
  // ───────────────────────────────────────────────────────────
  resetQuiz(): void {
    this.quizAnswers = [null, null, null];
    this.quizFeedback = '';
    this.quizDone = false;
  }

  selectQuizAnswer(qIdx: number, ans: string): void {
    this.quizAnswers[qIdx] = ans;
  }

  checkQuiz(): void {
    const correct = this.quizAnswers.every((a, i) => a === this.quizCorrect[i]);
    if (correct) {
      this.quizFeedback = '¡Felicidades, completaste el Mundo 2! 🎉';
      this.quizDone = true;
      this.level3Unlocked = true;
    } else {
      this.quizFeedback = 'Algunas respuestas son incorrectas. Revisa e intenta de nuevo.';
    }
  }

  // ═══════════════════════════════════════════════════════════
  // MUNDO 3: MÉTODOS GENERALES
  // ═══════════════════════════════════════════════════════════
  nextWorld3Activity(): void {
    const reward: ActivityReward = { experience: 10, seeds: 1 };
    this.applyReward(reward);
    if (this.currentWorld3Activity < this.totalWorld3Activities - 1) {
      this.currentWorld3Activity++;
      this.resetCurrentWorld3Activity();
    }
  }

  skipWorld3Activity(): void {
    if (this.currentWorld3Activity < this.totalWorld3Activities - 1) {
      this.currentWorld3Activity++;
      this.resetCurrentWorld3Activity();
    }
  }

  world3ProgressPercent(): number {
    return Math.round((this.currentWorld3Activity / this.totalWorld3Activities) * 100);
  }

  resetWorld3Activities(): void {
    this.resetFork();
    this.resetDetector();
    this.resetDoor();
    this.resetIfLives();
    this.resetElse();
    this.resetGuardian();
    this.resetCross();
  }

  resetCurrentWorld3Activity(): void {
    switch (this.currentWorld3Activity) {
      case 0: this.resetFork(); break;
      case 1: this.resetDetector(); break;
      case 2: this.resetDoor(); break;
      case 3: this.resetIfLives(); break;
      case 4: this.resetElse(); break;
      case 5: this.resetGuardian(); break;
      case 6: this.resetCross(); break;
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 1: LA BIFURCACIÓN
  // ───────────────────────────────────────────────────────────
  resetFork(): void {
    this.forkIndex = 0;
    this.forkFeedback = '';
    this.forkFeedbackError = false;
    this.forkDone = false;
  }

  get forkScenario() {
    return this.forkScenarios[this.forkIndex];
  }

  // direction: 'right' (con llave) | 'left' (sin llave)
  chooseFork(direction: 'right' | 'left'): void {
    const sc = this.forkScenario;
    const correct = sc.hasKey ? 'right' : 'left';
    if (direction === correct) {
      this.forkFeedbackError = false;
      this.forkFeedback = sc.hasKey
        ? '✅ ¡Correcto! Si tienes la llave, tomas el camino de la derecha. 🚪➡️'
        : '✅ ¡Correcto! Si no tienes la llave, tomas el camino de la izquierda. ⬅️';
      if (this.forkIndex < this.forkScenarios.length - 1) {
        setTimeout(() => {
          this.forkIndex++;
          this.forkFeedback = '';
          this.cdr.detectChanges();
        }, 1400);
      } else {
        this.forkDone = true;
      }
    } else {
      this.forkFeedbackError = true;
      this.forkFeedback = '❌ Fíjate en la condición: ¿tienes la llave o no?';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 2: EL DETECTOR (¿ES IGUAL?)
  // ───────────────────────────────────────────────────────────
  resetDetector(): void {
    this.detectorIndex = 0;
    this.detectorFeedback = '';
    this.detectorFeedbackError = false;
    this.detectorDone = false;
  }

  get detectorRound() {
    return this.detectorRounds[this.detectorIndex];
  }

  answerDetector(equal: boolean): void {
    const r = this.detectorRound;
    const isEqual = r.value === r.goal;
    if (equal === isEqual) {
      this.detectorFeedbackError = false;
      this.detectorFeedback = isEqual
        ? '✅ ¡Sí! ' + r.value + ' == ' + r.goal + ' son iguales.'
        : '✅ ¡Correcto! ' + r.value + ' ≠ ' + r.goal + ', no son iguales.';
      if (this.detectorIndex < this.detectorRounds.length - 1) {
        setTimeout(() => {
          this.detectorIndex++;
          this.detectorFeedback = '';
          this.cdr.detectChanges();
        }, 1400);
      } else {
        this.detectorDone = true;
      }
    } else {
      this.detectorFeedbackError = true;
      this.detectorFeedback = '❌ Compara con cuidado: ¿' + r.value + ' es igual a ' + r.goal + '?';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 3: LA PUERTA DE LAS MONEDAS
  // ───────────────────────────────────────────────────────────
  resetDoor(): void {
    this.doorIndex = 0;
    this.doorFeedback = '';
    this.doorFeedbackError = false;
    this.doorOpen = false;
    this.doorDone = false;
  }

  get doorRound() {
    return this.doorRounds[this.doorIndex];
  }

  answerDoor(canPass: boolean): void {
    const r = this.doorRound;
    const actuallyCan = r.coins >= r.required;
    if (canPass === actuallyCan) {
      this.doorFeedbackError = false;
      this.doorOpen = actuallyCan;
      this.doorFeedback = actuallyCan
        ? '✅ ¡Sí! ' + r.coins + ' ≥ ' + r.required + ', la puerta se abre. 🚪'
        : '✅ ¡Correcto! ' + r.coins + ' < ' + r.required + ', la puerta sigue cerrada. 🔒';
      if (this.doorIndex < this.doorRounds.length - 1) {
        setTimeout(() => {
          this.doorIndex++;
          this.doorOpen = false;
          this.doorFeedback = '';
          this.cdr.detectChanges();
        }, 1600);
      } else {
        this.doorDone = true;
      }
    } else {
      this.doorFeedbackError = true;
      this.doorFeedback = '❌ Revisa: necesitas ' + r.required + ' o más y tienes ' + r.coins + '.';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 4: SI TIENES VIDAS...
  // ───────────────────────────────────────────────────────────
  resetIfLives(): void {
    this.ifLivesValue = 4;
    this.ifLivesFeedback = '';
    this.ifLivesReached0 = false;
    this.ifLivesReachedContinue = false;
    this.ifLivesDone = false;
  }

  get ifLivesHearts(): number[] {
    return Array.from({ length: this.ifLivesValue }, (_, i) => i);
  }

  ifLivesAdd(): void {
    if (this.ifLivesValue < 5) this.ifLivesValue++;
    this.evalIfLives();
  }

  ifLivesSub(): void {
    if (this.ifLivesValue > 0) this.ifLivesValue--;
    this.evalIfLives();
  }

  private evalIfLives(): void {
    if (this.ifLivesValue > 0) {
      this.ifLivesReached0 = false;
      this.ifLivesReachedContinue = true;
      this.ifLivesFeedback = '🏃 vidas > 0 → ¡Puedes continuar! (vidas = ' + this.ifLivesValue + ')';
    } else {
      this.ifLivesReached0 = true;
      this.ifLivesFeedback = '🛑 vidas = 0 → No puedes continuar.';
    }
  }

  finishIfLives(): void {
    this.ifLivesDone = true;
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 5: SI NO... TOMA OTRO CAMINO
  // ───────────────────────────────────────────────────────────
  resetElse(): void {
    this.elseIndex = 0;
    this.elseResult = null;
    this.elseFeedback = '';
    this.elseFeedbackError = false;
    this.elseDone = false;
  }

  get elseScenario() {
    return this.elseScenarios[this.elseIndex];
  }

  // choice: true = intenta el camino "SI", false = camino "SINO"
  chooseElse(choice: boolean): void {
    const sc = this.elseScenario;
    const shouldTakeIf = sc.hasIt;
    if (choice === shouldTakeIf) {
      this.elseResult = choice ? 'if' : 'else';
      this.elseFeedbackError = false;
      this.elseFeedback = choice
        ? '✅ La condición se cumple → ' + sc.ifText
        : '✅ La condición NO se cumple → ' + sc.elseText;
      if (this.elseIndex < this.elseScenarios.length - 1) {
        setTimeout(() => {
          this.elseIndex++;
          this.elseResult = null;
          this.elseFeedback = '';
          this.cdr.detectChanges();
        }, 1600);
      } else {
        this.elseDone = true;
      }
    } else {
      this.elseFeedbackError = true;
      this.elseFeedback = '❌ Mira la condición: ' + sc.question + ' La respuesta es ' + (sc.hasIt ? 'SÍ' : 'NO') + '.';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 6: EL GUARDIÁN DEL RÍO
  // ───────────────────────────────────────────────────────────
  resetGuardian(): void {
    this.guardianIndex = 0;
    this.guardianFeedback = '';
    this.guardianFeedbackError = false;
    this.guardianDone = false;
  }

  get guardianScenario() {
    return this.guardianScenarios[this.guardianIndex];
  }

  // Regla: vidas >= 3 Y llave = sí
  answerGuardian(canPass: boolean): void {
    const sc = this.guardianScenario;
    const actuallyCan = sc.lives >= 3 && sc.hasKey;
    if (canPass === actuallyCan) {
      this.guardianFeedbackError = false;
      if (actuallyCan) {
        this.guardianFeedback = '🎉 ¡Puede pasar! Tiene ' + sc.lives + ' vidas (≥ 3) y la llave. 🔑';
      } else if (!sc.hasKey) {
        this.guardianFeedback = '✅ Correcto: no puede pasar porque le falta la llave. 🔑❌';
      } else {
        this.guardianFeedback = '✅ Correcto: no puede pasar, tiene ' + sc.lives + ' vidas (menos de 3).';
      }
      if (this.guardianIndex < this.guardianScenarios.length - 1) {
        setTimeout(() => {
          this.guardianIndex++;
          this.guardianFeedback = '';
          this.cdr.detectChanges();
        }, 1800);
      } else {
        this.guardianDone = true;
      }
    } else {
      this.guardianFeedbackError = true;
      this.guardianFeedback = '❌ Recuerda: necesita 3 vidas o más Y la llave. Revisa ambas condiciones.';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 7: RETO FINAL - ¡CRUZA EL RÍO!
  // ───────────────────────────────────────────────────────────
  resetCross(): void {
    this.crossKey = false;
    this.crossCoins = 5;
    this.crossLives = 3;
    this.crossBoat = false;
    this.crossStep = 0;
    this.crossFeedback = '';
    this.crossFeedbackError = false;
    this.crossGameOver = false;
    this.crossDone = false;
  }

  get crossHearts(): number[] {
    return Array.from({ length: this.crossLives }, (_, i) => i);
  }

  // El niño consigue una llave antes del puente
  crossTakeKey(): void {
    this.crossKey = true;
    this.crossFeedback = '🔑 Recogiste la llave.';
    this.crossFeedbackError = false;
  }

  // Paso 0: puente (necesita llave)
  crossBridge(): void {
    if (this.crossKey) {
      this.crossFeedbackError = false;
      this.crossFeedback = '🌉 SI tienes la llave → cruzas el puente. ✅';
      this.crossStep = 1;
    } else {
      this.crossFeedbackError = true;
      this.crossFeedback = '🌉 No tienes la llave. Recoge la llave para cruzar el puente.';
    }
  }

  // Paso 1: tienda (necesita 5 monedas para el bote)
  crossBuyBoat(): void {
    if (this.crossCoins >= 5) {
      this.crossCoins -= 5;
      this.crossBoat = true;
      this.crossFeedbackError = false;
      this.crossFeedback = '🪙 SI tienes 5 monedas → compras el bote. 🛶 ✅';
      this.crossStep = 2;
    } else {
      this.crossFeedbackError = true;
      this.crossFeedback = '🪙 No te alcanza para el bote. Necesitas 5 monedas.';
    }
  }

  // Paso 2: monstruo (si tienes vidas continúas, si 0 game over)
  crossFightMonster(): void {
    this.crossLives -= 1;
    if (this.crossLives <= 0) {
      this.crossLives = 0;
      this.crossGameOver = true;
      this.crossFeedbackError = true;
      this.crossFeedback = '💀 Game Over. Te quedaste sin vidas.';
    } else {
      this.crossFeedbackError = false;
      this.crossFeedback = '❤️ El monstruo te quitó 1 vida (vidas = ' + this.crossLives + '), pero continúas. ✅';
      this.crossStep = 3;
    }
  }

  // Paso 3: meta (necesita bote y al menos 1 vida)
  crossFinish(): void {
    if (this.crossBoat && this.crossLives >= 1) {
      this.crossFeedbackError = false;
      this.crossFeedback = '🏁 ¡Cruzaste el río! Tienes el bote 🛶 y ' + this.crossLives + ' vida(s). 🎉';
      this.crossDone = true;
    } else {
      this.crossFeedbackError = true;
      this.crossFeedback = '🏁 Aún no puedes cruzar: necesitas el bote y al menos 1 vida.';
    }
  }

  restartCross(): void {
    this.resetCross();
  }
}
