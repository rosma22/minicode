import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/game-state.service';
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
} from '../../models/activities';

/**
 * MUNDO 1 - SEMILLAS (SECUENCIAS)
 * Contiene 5 actividades: Sándwich, Planta, Ruta, Mochila y Reto final.
 */
@Component({
  selector: 'app-world-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-1.html',
  styleUrl: './world-1.css',
})
export class World1Component implements OnInit {
  @Output() unlockWorld2 = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef, private game: GameStateService) {
    this.resetWorld1Activities();
  }

  ngOnInit(): void {
    this.startDialogue();
  }

  currentActivity = 0;
  totalActivities = 5;

  // ═══════════════════════════════════════════════════════════
  // INTRO CON DIÁLOGO (el personaje aparece en grande y "habla")
  // ═══════════════════════════════════════════════════════════
  showIntro = true;

  /** Líneas que Nori va diciendo; avanzan al hacer click. */
  private readonly dialogue: string[] = [
    '¡Hola! Soy Nori 👋 Soy un astronauta explorador.',
    'Bienvenid@ al Bosque de Algoritmos. ¡Qué emoción que me acompañes!',
    'En este mundo vas a aprender las secuencias: una lista de pasos en orden. 🧩',
    'Es como una receta: si sigues los pasos en el orden correcto, ¡todo sale bien! 🥪',
    'Recuerda: cada acción es un paso y el orden importa muchísimo. 🔢',
    '¿List@ para la aventura? Resolveremos 5 retos juntos. 🚀',
  ];

  dialogueIndex = 0;      // línea actual
  displayedText = '';     // texto ya "escrito" en pantalla
  typing = false;         // true mientras aparecen las letras
  private typeTimer: any = null;

  /** Al abrir la intro empieza a escribir la primera línea. */
  private startDialogue(): void {
    this.dialogueIndex = 0;
    this.typeLine();
  }

  /** Escribe la línea actual letra por letra (efecto de habla). */
  private typeLine(): void {
    clearInterval(this.typeTimer);
    const full = this.dialogue[this.dialogueIndex];
    this.displayedText = '';
    this.typing = true;
    let i = 0;
    this.typeTimer = setInterval(() => {
      this.displayedText = full.slice(0, ++i);
      if (i >= full.length) {
        clearInterval(this.typeTimer);
        this.typing = false;
      }
      this.cdr.detectChanges();
    }, 32);
  }

  /** true cuando ya se mostró la última línea completa. */
  get dialogueFinished(): boolean {
    return this.dialogueIndex >= this.dialogue.length - 1 && !this.typing;
  }

  /**
   * Click sobre la escena:
   * - Si está escribiendo, completa la línea al instante.
   * - Si terminó la línea, pasa a la siguiente.
   */
  advanceDialogue(): void {
    if (this.typing) {
      clearInterval(this.typeTimer);
      this.displayedText = this.dialogue[this.dialogueIndex];
      this.typing = false;
      return;
    }
    if (this.dialogueIndex < this.dialogue.length - 1) {
      this.dialogueIndex++;
      this.typeLine();
    }
  }

  /** Cierra la intro y comienza con las actividades. */
  startWorld(): void {
    clearInterval(this.typeTimer);
    this.showIntro = false;
  }

  // Actividad 1 – Sándwich
  sandwichStep: 'intro' | 'game' | 'done' = 'intro';
  sandwichOptions: string[] = [];
  sandwichBuild: string[] = [];
  sandwichFeedback = '';
  sandwichDone = false;
  draggingIngredient: string | null = null;
  dropReady = false;

  // Actividad 2 – Planta
  plantStage: 'empty' | 'seed' | 'sprout' | 'flower' = 'empty';
  plantActions: PlantAction[] = [];
  plantSequence: PlantAction[] = [];
  plantFeedback = '';
  plantDone = false;
  plantRunning = false;
  plantActiveStep = -1;

  // Actividad 3 – Ruta (grid 4x5)
  routeBuild: RouteMove[] = [];
  routeFeedback = '';
  routeDone = false;
  routeRunning = false;
  routeCharPos = { x: 0, y: 4 };
  routeGoal = { x: 3, y: 2 };
  routeObstacles: { x: number; y: number; emoji: string }[] = [
    { x: 1, y: 1, emoji: '🪨' },
    { x: 3, y: 4, emoji: '🌳' },
  ];
  routeCharDirection: 'right' | 'left' | 'up' | 'down' = 'right';
  routeHitObstacle = false;
  routeCurrentStep = -1;
  routeGridRows = 5;
  routeGridCols = 4;

  // Actividad 4 – Depuración (mochila)
  packingBuild: PackingStep[] = [...PACKING_INITIAL_ORDER];
  packingFeedback = '';
  packingDone = false;
  packingSelectedIdx: number | null = null;
  packingPacking = false;
  packingItemsIn: PackingStep[] = [];
  packingClosed = false;
  packingShake = false;

  // Actividad 5 – Reto final
  finalBuild: FinalBlock[] = [];
  finalFeedback = '';
  finalDone = false;
  finalRunning = false;
  finalCharPos = { x: 0, y: 2 };
  finalStartPos = { x: 0, y: 2 };
  finalSeedPos = { x: 2, y: 0 };
  finalResources: { x: number; y: number; type: FinalResource; collected: boolean }[] = [
    { x: 1, y: 2, type: 'water', collected: false },
    { x: 2, y: 1, type: 'sun', collected: false },
    { x: 1, y: 0, type: 'soil', collected: false },
  ];
  finalCollected: FinalResource[] = [];
  finalPlanted = false;
  finalCurrentStep = -1;
  finalSeedStageIndex = 0;
  finalGrowing = false;

  // ═══════════════════════════════════════════════════════════
  // MÉTODOS GENERALES
  // ═══════════════════════════════════════════════════════════
  nextActivity(): void {
    const reward: ActivityReward = { experience: 10, seeds: 1 };
    this.game.applyReward(reward);
    if (this.currentActivity < this.totalActivities - 1) {
      this.currentActivity++;
      this.resetCurrentActivity();
    } else {
      this.game.level2Unlocked = true;
    }
  }

  skipActivity(): void {
    if (this.currentActivity < this.totalActivities - 1) {
      this.currentActivity++;
      this.resetCurrentActivity();
    } else {
      this.game.level2Unlocked = true;
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
      '🍅': 'tomato-layer',
      '🧀': 'cheese-layer',
      '🥪': 'close-layer',
    };
    return map[emoji] || '';
  }

  getIngredientName(emoji: string): string {
    const names: Record<string, string> = {
      '🍞': 'Pan',
      '🥬': 'Lechuga',
      '🍅': 'Tomate',
      '🧀': 'Queso',
      '🥪': 'Cerrar',
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
    setTimeout(() => this.runPlantStep(0), 400);
  }

  private runPlantStep(idx: number): void {
    if (idx >= this.plantSequence.length) {
      this.finishPlantRun();
      return;
    }

    this.plantActiveStep = idx;
    const action = this.plantSequence[idx];

    setTimeout(() => {
      if (PLANT_GROWTH_ORDER[idx] !== action) {
        this.plantActiveStep = -1;
        this.plantRunning = false;
        this.plantFeedback = `¡Ups! El paso ${idx + 1} no va en ese orden. Recuerda: primero Plantar 🌱, luego Regar 💧 y al final Sol ☀️.`;
        this.plantStage = 'empty';
        this.plantActions = [];
        this.cdr.detectChanges();
        return;
      }

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
    this.routeCharPos = { x: 0, y: 4 };
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
    return this.routeObstacles.some((o) => o.x === x && o.y === y);
  }

  getObstacleEmoji(x: number, y: number): string {
    const obstacle = this.routeObstacles.find((o) => o.x === x && o.y === y);
    return obstacle ? obstacle.emoji : '';
  }

  runRoute(): void {
    if (this.routeRunning || this.routeDone || this.routeBuild.length === 0) {
      return;
    }

    this.routeRunning = true;
    this.routeCharPos = { x: 0, y: 4 };
    this.routeFeedback = '';
    this.routeHitObstacle = false;
    this.routeCurrentStep = -1;

    let stepIndex = 0;

    const executeStep = () => {
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

      if (newX < 0 || newX > 3 || newY < 0 || newY > 4) {
        this.routeRunning = false;
        this.routeCurrentStep = -1;
        this.routeFeedback = '¡Nori se salió del camino! 😵';
        this.cdr.detectChanges();
        return;
      }

      if (this.isObstacle(newX, newY)) {
        this.routeHitObstacle = true;
        this.routeRunning = false;
        this.routeCurrentStep = -1;
        this.routeFeedback = '¡Nori chocó con un obstáculo! 💥';
        this.cdr.detectChanges();
        return;
      }

      this.routeCharPos = { x: newX, y: newY };
      stepIndex++;

      if (newX === this.routeGoal.x && newY === this.routeGoal.y) {
        this.routeRunning = false;
        this.routeCurrentStep = -1;
        this.routeFeedback = '¡Nori llegó a casa! 🎉';
        this.routeDone = true;
        this.cdr.detectChanges();
        return;
      }

      this.cdr.detectChanges();

      setTimeout(() => executeStep(), 600);
    };

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
      this.packingFeedback = 'El orden no es correcto. Intercambia los pasos.';
      this.packingShake = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.packingShake = false;
        this.cdr.detectChanges();
      }, 600);
      return;
    }

    this.packingPacking = true;
    this.packingItemsIn = [];
    this.packingClosed = false;
    this.packingFeedback = 'Empacando... 🎒';
    this.cdr.detectChanges();
    this.packItemsStep(0);
  }

  private packItemsStep(idx: number): void {
    const itemsToPack: PackingStep[] = this.packingBuild.filter((s) => s !== 'close');

    if (idx >= itemsToPack.length) {
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

  // Otorga la recompensa final y pide al shell desbloquear/abrir el Mundo 2
  unlockAndOpenWorld2(): void {
    if (!this.game.level2Unlocked) {
      this.game.applyReward({ experience: 10, seeds: 1 });
      this.game.level2Unlocked = true;
    }
    this.unlockWorld2.emit();
  }
}
