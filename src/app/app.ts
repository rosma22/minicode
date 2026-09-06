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

type Screen = 'forest' | 'world-1' | 'world-2';

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
  level2Unlocked = false;

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

  // Actividad 2 – Planta
  plantStage: 'seed' | 'sprout' | 'flower' = 'seed';
  plantActions: PlantAction[] = [];
  plantFeedback = '';
  plantDone = false;

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
  totalWorld2Activities = 11;

  // Actividad 1 – Cajas mágicas
  magicItems = [
    { emoji: '🪙', label: 'moneda', placed: false },
    { emoji: '❤️', label: 'corazón', placed: false },
    { emoji: '⭐', label: 'estrella', placed: false },
  ];
  magicBoxes = [
    { accepts: 'moneda', filled: false, emoji: '' },
    { accepts: 'corazón', filled: false, emoji: '' },
    { accepts: 'estrella', filled: false, emoji: '' },
  ];
  magicFeedback = '';
  magicDone = false;

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

  // Actividad 3 – Cambiar valor
  changeValue = 5;
  changeTarget = 8;
  changeFeedback = '';
  changeDone = false;

  // Actividad 4 – Tienda
  shopCoins = 10;
  shopItems = [
    { emoji: '🍎', name: 'Manzana', price: 3, bought: false },
    { emoji: '🧃', name: 'Jugo', price: 4, bought: false },
    { emoji: '🍪', name: 'Galleta', price: 2, bought: false },
  ];
  shopFeedback = '';
  shopDone = false;

  // Actividad 5 – Vidas
  livesValue = 3;
  livesTarget = 5;
  livesFeedback = '';
  livesDone = false;
  livesEvents = [
    { emoji: '💥', label: 'Daño', delta: -1 },
    { emoji: '❤️', label: 'Corazón', delta: +1 },
    { emoji: '💥', label: 'Daño', delta: -1 },
    { emoji: '❤️', label: 'Corazón', delta: +1 },
    { emoji: '❤️', label: 'Corazón', delta: +1 },
    { emoji: '❤️', label: 'Corazón', delta: +1 },
  ];
  livesEventIndex = 0;

  // Actividad 6 – Nombre
  heroName = '';
  heroNameSaved = false;
  heroFeedback = '';
  heroDone = false;

  // Actividad 7 – Marcador
  starScore = 0;
  starGoal = 5;
  starsCollected: boolean[] = [false, false, false, false, false];
  starFeedback = '';
  starDone = false;

  // Actividad 8 – Mochila de variables
  backpack = { name: '', coins: 0, lives: 0, points: 0 };
  backpackPhase: 'edit' | 'adventure' | 'done' = 'edit';
  backpackFeedback = '';
  backpackAdventureStep = 0;
  backpackDone = false;

  // Actividad 9 – Arreglar variables
  debugOptions = [
    { label: '🪙 monedas', correct: 'coins' },
    { label: '❤️ vidas', correct: 'lives' },
    { label: '📛 nombre', correct: 'name' },
  ];
  debugSlots: Record<string, string> = { coins: '', lives: '', name: '' };
  debugSelected: string | null = null;
  debugFeedback = '';
  debugDone = false;

  // Actividad 10 – Gran aventura
  advCoins = 5;
  advLives = 3;
  advPoints = 0;
  advStep = 0;
  advEvents = [
    { text: '¡Encontraste 3 monedas!', action: () => (this.advCoins += 3) },
    { text: 'Una trampa te quita 1 vida', action: () => (this.advLives -= 1) },
    { text: 'Recoges 10 puntos', action: () => (this.advPoints += 10) },
    { text: '¡Un cofre con 5 monedas!', action: () => (this.advCoins += 5) },
    { text: 'Encuentras un corazón +1 vida', action: () => (this.advLives += 1) },
  ];
  advFeedback = '';
  advDone = false;

  // Actividad 11 – Evaluación final
  quizAnswers: (string | null)[] = [null, null, null];
  quizCorrect = ['6', 'texto', 'cambiar'];
  quizFeedback = '';
  quizDone = false;

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
    this.plantStage = 'seed';
    this.plantActions = [];
    this.plantFeedback = '';
    this.plantDone = false;
  }

  plantEmoji(): string {
    return this.plantStage === 'seed' ? '🌱' : this.plantStage === 'sprout' ? '🌿' : '🌻';
  }

  doPlantAction(action: PlantAction): void {
    const idx = this.plantActions.length;
    if (PLANT_GROWTH_ORDER[idx] === action) {
      this.plantActions.push(action);
      this.plantFeedback = action === 'plant' ? '¡Plantaste la semilla!' : action === 'water' ? '¡Regaste la planta!' : '¡Le diste sol!';
      if (action === 'plant') this.plantStage = 'seed';
      else if (action === 'water') this.plantStage = 'sprout';
      else if (action === 'sun') {
        this.plantStage = 'flower';
        this.plantDone = true;
      }
    } else {
      this.plantFeedback = 'Ese no es el paso correcto. Piensa en el orden.';
    }
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
    const ok = PACKING_CORRECT_ORDER.every((s, i) => this.packingBuild[i] === s);
    if (ok) {
      this.packingFeedback = '¡Mochila lista! 🎉';
      this.packingDone = true;
    } else {
      this.packingFeedback = 'El orden no es correcto. Intercambia los pasos.';
    }
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
    this.resetStar();
    this.resetBackpack();
    this.resetDebug();
    this.resetAdventure();
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
      case 6: this.resetStar(); break;
      case 7: this.resetBackpack(); break;
      case 8: this.resetDebug(); break;
      case 9: this.resetAdventure(); break;
      case 10: this.resetQuiz(); break;
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 1: CAJAS MÁGICAS
  // ───────────────────────────────────────────────────────────
  resetMagic(): void {
    this.magicItems = [
      { emoji: '🪙', label: 'moneda', placed: false },
      { emoji: '❤️', label: 'corazón', placed: false },
      { emoji: '⭐', label: 'estrella', placed: false },
    ];
    this.magicBoxes = [
      { accepts: 'moneda', filled: false, emoji: '' },
      { accepts: 'corazón', filled: false, emoji: '' },
      { accepts: 'estrella', filled: false, emoji: '' },
    ];
    this.magicFeedback = '';
    this.magicDone = false;
  }

  dropMagicItem(item: { emoji: string; label: string; placed: boolean }, boxIdx: number): void {
    const box = this.magicBoxes[boxIdx];
    if (box.filled || item.placed) return;
    if (box.accepts === item.label) {
      box.filled = true;
      box.emoji = item.emoji;
      item.placed = true;
      this.magicFeedback = '¡Correcto!';
      if (this.magicBoxes.every((b) => b.filled)) this.magicDone = true;
    } else {
      this.magicFeedback = 'Esa caja no es para ' + item.label;
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
    if (this.openBoxes.every((b) => b.revealed)) {
      this.openPhase = 'question';
      this.openQuestion = '¿Cuántas monedas tiene Nori?';
      this.openAnswer = 5;
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
    this.changeValue = 5;
    this.changeTarget = 8;
    this.changeFeedback = '';
    this.changeDone = false;
  }

  changeAdd(): void {
    this.changeValue++;
    this.checkChange();
  }

  changeSub(): void {
    if (this.changeValue > 0) this.changeValue--;
    this.checkChange();
  }

  checkChange(): void {
    if (this.changeValue === this.changeTarget) {
      this.changeFeedback = '¡Llegaste a ' + this.changeTarget + '! 🎉';
      this.changeDone = true;
    } else {
      this.changeFeedback = '';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 4: TIENDA
  // ───────────────────────────────────────────────────────────
  resetShop(): void {
    this.shopCoins = 10;
    this.shopItems = [
      { emoji: '🍎', name: 'Manzana', price: 3, bought: false },
      { emoji: '🧃', name: 'Jugo', price: 4, bought: false },
      { emoji: '🍪', name: 'Galleta', price: 2, bought: false },
    ];
    this.shopFeedback = '';
    this.shopDone = false;
  }

  buyItem(idx: number): void {
    const item = this.shopItems[idx];
    if (item.bought || this.shopCoins < item.price) {
      this.shopFeedback = 'No tienes suficientes monedas';
      return;
    }
    this.shopCoins -= item.price;
    item.bought = true;
    this.shopFeedback = '¡Compraste ' + item.name + '!';
    if (this.shopItems.every((i) => i.bought)) this.shopDone = true;
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 5: VIDAS
  // ───────────────────────────────────────────────────────────
  resetLives(): void {
    this.livesValue = 3;
    this.livesTarget = 5;
    this.livesFeedback = '';
    this.livesDone = false;
    this.livesEventIndex = 0;
  }

  applyLifeEvent(): void {
    if (this.livesEventIndex >= this.livesEvents.length) return;
    const ev = this.livesEvents[this.livesEventIndex];
    this.livesValue += ev.delta;
    this.livesFeedback = ev.delta > 0 ? '¡+1 vida!' : '-1 vida';
    this.livesEventIndex++;
    if (this.livesValue >= this.livesTarget) {
      this.livesDone = true;
      this.livesFeedback = '¡Alcanzaste ' + this.livesTarget + ' vidas! 🎉';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 6: NOMBRE
  // ───────────────────────────────────────────────────────────
  resetHero(): void {
    this.heroName = '';
    this.heroNameSaved = false;
    this.heroFeedback = '';
    this.heroDone = false;
  }

  saveHeroName(): void {
    if (this.heroName.trim().length > 0) {
      this.heroNameSaved = true;
      this.heroFeedback = '¡Hola, ' + this.heroName + '! Tu nombre está guardado.';
      this.heroDone = true;
    } else {
      this.heroFeedback = 'Escribe un nombre primero';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 7: MARCADOR
  // ───────────────────────────────────────────────────────────
  resetStar(): void {
    this.starScore = 0;
    this.starsCollected = [false, false, false, false, false];
    this.starFeedback = '';
    this.starDone = false;
  }

  collectStar(idx: number): void {
    if (this.starsCollected[idx]) return;
    this.starsCollected[idx] = true;
    this.starScore++;
    this.starFeedback = '¡+1 estrella!';
    if (this.starScore >= this.starGoal) {
      this.starDone = true;
      this.starFeedback = '¡Conseguiste 5 estrellas! 🎉';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 8: MOCHILA
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
  // ACTIVIDAD 9: ARREGLAR
  // ───────────────────────────────────────────────────────────
  resetDebug(): void {
    this.debugOptions = [
      { label: '🪙 monedas', correct: 'coins' },
      { label: '❤️ vidas', correct: 'lives' },
      { label: '📛 nombre', correct: 'name' },
    ];
    this.debugSlots = { coins: '', lives: '', name: '' };
    this.debugSelected = null;
    this.debugFeedback = '';
    this.debugDone = false;
  }

  selectDebugOption(opt: { label: string; correct: string }): void {
    this.debugSelected = opt.correct;
  }

  assignDebugSlot(slot: string): void {
    if (!this.debugSelected) return;
    if (this.debugSelected === slot) {
      this.debugSlots[slot] = this.debugOptions.find((o) => o.correct === slot)?.label || '';
      this.debugFeedback = '¡Correcto!';
      this.debugSelected = null;
      if (Object.values(this.debugSlots).every((v) => v)) this.debugDone = true;
    } else {
      this.debugFeedback = 'Esa no es la caja correcta';
    }
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 10: GRAN AVENTURA
  // ───────────────────────────────────────────────────────────
  resetAdventure(): void {
    this.advCoins = 5;
    this.advLives = 3;
    this.advPoints = 0;
    this.advStep = 0;
    this.advFeedback = '';
    this.advDone = false;
  }

  advanceAdventure(): void {
    if (this.advStep >= this.advEvents.length) return;
    const ev = this.advEvents[this.advStep];
    ev.action();
    this.advFeedback = ev.text;
    this.advStep++;
    if (this.advStep >= this.advEvents.length) this.advDone = true;
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 11: EVALUACIÓN
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
    } else {
      this.quizFeedback = 'Algunas respuestas son incorrectas. Revisa e intenta de nuevo.';
    }
  }
}
