import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/game-state.service';
import { type ActivityReward } from '../../models/activities';

/**
 * MUNDO 3 - RÍO (CONDICIONALES)
 * Contiene 7 actividades sobre condicionales.
 */
@Component({
  selector: 'app-world-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-3.html',
  styleUrl: './world-3.css',
})
export class World3Component implements OnInit {
  @Output() exitToForest = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef, private game: GameStateService) {
    this.resetWorld3Activities();
  }

  ngOnInit(): void {
    this.startW3Dialogue();
  }

  currentWorld3Activity = 0;
  totalWorld3Activities = 7;

  // ═══════════════════════════════════════════════════════════
  // INTRO CON DIÁLOGO (Coco la rana presenta el mundo de condicionales)
  // ═══════════════════════════════════════════════════════════
  showW3Intro = true;

  /** Personaje guía de este mundo. */
  readonly w3Character = '🐸';

  private readonly w3Dialogue: string[] = [
    '¡Croac! Soy Coco, la rana guardiana del Río. 🐸',
    'Bienvenid@ al Río de los Condicionales. ¡Aquí tomaremos decisiones!',
    'Un condicional es preguntarse: SI pasa algo... entonces hago esto. 🤔',
    'Por ejemplo: SI tienes la llave 🔑, entonces la puerta se abre.',
    'Y SI NO la tienes, ¡tendrás que buscar otro camino! 🌊',
    '¿List@ para decidir y cruzar el río conmigo? ¡Salta! 🪷',
  ];

  w3DialogueIndex = 0;
  w3DisplayedText = '';
  w3Typing = false;
  private w3TypeTimer: any = null;

  private startW3Dialogue(): void {
    this.w3DialogueIndex = 0;
    this.typeW3Line();
  }

  private typeW3Line(): void {
    clearInterval(this.w3TypeTimer);
    const full = this.w3Dialogue[this.w3DialogueIndex];
    this.w3DisplayedText = '';
    this.w3Typing = true;
    let i = 0;
    this.w3TypeTimer = setInterval(() => {
      this.w3DisplayedText = full.slice(0, ++i);
      if (i >= full.length) {
        clearInterval(this.w3TypeTimer);
        this.w3Typing = false;
      }
      this.cdr.detectChanges();
    }, 32);
  }

  get w3DialogueFinished(): boolean {
    return this.w3DialogueIndex >= this.w3Dialogue.length - 1 && !this.w3Typing;
  }

  advanceW3Dialogue(): void {
    if (this.w3Typing) {
      clearInterval(this.w3TypeTimer);
      this.w3DisplayedText = this.w3Dialogue[this.w3DialogueIndex];
      this.w3Typing = false;
      return;
    }
    if (this.w3DialogueIndex < this.w3Dialogue.length - 1) {
      this.w3DialogueIndex++;
      this.typeW3Line();
    }
  }

  startWorld3(): void {
    clearInterval(this.w3TypeTimer);
    this.showW3Intro = false;
  }

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

  // Actividad 4 – Si tienes vidas... (condiciones encadenadas)
  ifLivesPhase: 'explore' | 'order' | 'predict' = 'explore';
  ifLivesValue = 3;
  ifLivesDone = false;

  // Fase 2: ordenar las condiciones (el reto de programación)
  readonly livesConditionCards: { id: string; text: string; action: string }[] = [
    { id: 'gt2', text: 'SI vidas > 2', action: '🗡️ Enfrentar al enemigo' },
    { id: 'gt0', text: 'SI vidas > 0', action: '🏃 Continuar' },
    { id: 'eq0', text: 'SI vidas = 0', action: '💀 Game Over' },
  ];
  private readonly livesOrderCorrect: string[] = ['gt2', 'gt0', 'eq0'];
  livesOrderPool: string[] = [];
  livesOrderPlaced: string[] = [];
  livesOrderFeedback = '';
  livesOrderError = false;
  livesOrderOk = false;

  // Fase 3: predecir el resultado antes de ejecutar
  predictLives = 3;
  predictChoice: 'fight' | 'careful' | 'seek' | 'over' | null = null;
  predictRevealed = false;
  predictCorrect = false;
  predictFeedback = '';

  // Actividad 5 – La puerta (if / else)
  elsePhase: 'explore' | 'classify' = 'explore';
  elseDone = false;

  // Fase 1: probar la puerta (SI tienes llave → abrir / SI NO → buscar)
  elseHasKey = true;
  elseRan = false;
  elseFeedback = '';
  elseFeedbackError = false;

  // Fase 2: reto extra – clasificar situaciones sin ejecutar
  elseSituations: { id: number; keys: number; choice: 'open' | 'search' | null }[] = [];
  elseChecked = false;
  elseAllCorrect = false;
  elseClassifyFeedback = '';

  // Actividad 6 – El guardián del río (condición compuesta con Y / AND)
  guardianPhase: 'explore' | 'final' = 'explore';
  guardianDone = false;

  // Fase 1: cambiar variables, predecir y comprobar
  guardianKey = true;
  guardianCoins = 5;
  guardianPrediction: boolean | null = null;
  guardianRan = false;
  guardianFeedback = '';
  guardianFeedbackError = false;

  // Fase 2: reto final – 4 personajes
  guardianChars: { id: number; name: string; emoji: string; hasKey: boolean; coins: number; selected: boolean }[] = [];
  guardianChecked = false;
  guardianAllCorrect = false;
  guardianFinalFeedback = '';

  // Actividad 7 – Reto final: ¡La gran aventura del río!
  // El niño analiza sus variables, las prepara y decide cuándo ejecutar.
  crossLives = 2;
  crossCoins = 3;
  crossKey = false;
  crossItem = false;
  crossResult: 'none' | 'win' | 'missing' | 'over' = 'none';
  crossFeedback = '';
  crossFeedbackError = false;
  crossDone = false;

  // ═══════════════════════════════════════════════════════════
  // MÉTODOS GENERALES
  // ═══════════════════════════════════════════════════════════
  nextWorld3Activity(): void {
    const reward: ActivityReward = { experience: 10, seeds: 1 };
    this.game.applyReward(reward);
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
    this.ifLivesPhase = 'explore';
    this.ifLivesValue = 3;
    this.ifLivesDone = false;
    this.resetLivesOrder();
    this.newPrediction();
  }

  get ifLivesHearts(): number[] {
    return Array.from({ length: this.ifLivesValue }, (_, i) => i);
  }

  ifLivesAdd(): void {
    if (this.ifLivesValue < 4) this.ifLivesValue++;
  }

  ifLivesSub(): void {
    if (this.ifLivesValue > 0) this.ifLivesValue--;
  }

  /** Devuelve el resultado según las 4 situaciones de vidas. */
  livesOutcome(v: number): { key: 'fight' | 'careful' | 'seek' | 'over'; emoji: string; label: string; cls: string } {
    if (v > 2) return { key: 'fight', emoji: '🗡️', label: 'Enfrentar al enemigo', cls: 'fight' };
    if (v === 2) return { key: 'careful', emoji: '🏃', label: 'Continuar con cuidado', cls: 'ok' };
    if (v === 1) return { key: 'seek', emoji: '💚', label: 'Buscar una vida extra', cls: 'seek' };
    return { key: 'over', emoji: '💀', label: 'Game Over', cls: 'stop' };
  }

  get ifLivesCurrentOutcome() {
    return this.livesOutcome(this.ifLivesValue);
  }

  goToLivesOrder(): void {
    this.ifLivesPhase = 'order';
    this.resetLivesOrder();
  }

  goToLivesPredict(): void {
    this.ifLivesPhase = 'predict';
    this.newPrediction();
  }

  // ── Fase 2: ordenar condiciones ──
  resetLivesOrder(): void {
    this.livesOrderPool = this.shuffleIds(this.livesConditionCards.map((c) => c.id));
    this.livesOrderPlaced = [];
    this.livesOrderFeedback = '';
    this.livesOrderError = false;
    this.livesOrderOk = false;
  }

  private shuffleIds(ids: string[]): string[] {
    const arr = [...ids];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Evita que salga ya ordenado de casualidad
    if (arr.join() === this.livesOrderCorrect.join()) {
      return [arr[1], arr[0], arr[2]];
    }
    return arr;
  }

  conditionCard(id: string) {
    return this.livesConditionCards.find((c) => c.id === id)!;
  }

  placeCondition(id: string): void {
    if (this.livesOrderOk) return;
    this.livesOrderPool = this.livesOrderPool.filter((x) => x !== id);
    this.livesOrderPlaced.push(id);
    this.livesOrderFeedback = '';
    this.livesOrderError = false;
  }

  removeCondition(index: number): void {
    if (this.livesOrderOk) return;
    const [id] = this.livesOrderPlaced.splice(index, 1);
    if (id) this.livesOrderPool.push(id);
    this.livesOrderFeedback = '';
    this.livesOrderError = false;
  }

  checkLivesOrder(): void {
    if (this.livesOrderPlaced.length < this.livesConditionCards.length) {
      this.livesOrderError = true;
      this.livesOrderFeedback = '👀 Coloca las 3 condiciones en orden antes de comprobar.';
      return;
    }
    if (this.livesOrderPlaced.join() === this.livesOrderCorrect.join()) {
      this.livesOrderOk = true;
      this.livesOrderError = false;
      this.livesOrderFeedback = '✅ ¡Orden perfecto! Se revisa primero la más exigente (vidas > 2) y al final vidas = 0.';
    } else {
      this.livesOrderError = true;
      this.livesOrderFeedback = '❌ El orden importa: empieza por la condición más exigente (vidas > 2) y termina con vidas = 0.';
    }
  }

  // ── Fase 3: predecir el resultado ──
  newPrediction(): void {
    this.predictLives = Math.floor(Math.random() * 4); // 0..3
    this.predictChoice = null;
    this.predictRevealed = false;
    this.predictCorrect = false;
    this.predictFeedback = '';
  }

  get predictHearts(): number[] {
    return Array.from({ length: this.predictLives }, (_, i) => i);
  }

  choosePrediction(choice: 'fight' | 'careful' | 'seek' | 'over'): void {
    if (this.predictRevealed) return;
    this.predictChoice = choice;
  }

  revealPrediction(): void {
    if (!this.predictChoice) return;
    const real = this.livesOutcome(this.predictLives);
    this.predictRevealed = true;
    this.predictCorrect = this.predictChoice === real.key;
    this.predictFeedback = this.predictCorrect
      ? '🎉 ¡Predicción correcta! Con ' + this.predictLives + ' ❤️ → ' + real.emoji + ' ' + real.label + '.'
      : '🤔 Casi. Con ' + this.predictLives + ' ❤️ el programa elige → ' + real.emoji + ' ' + real.label + '.';
  }

  finishIfLives(): void {
    this.ifLivesDone = true;
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 5: SI NO... TOMA OTRO CAMINO
  // ───────────────────────────────────────────────────────────
  resetElse(): void {
    this.elsePhase = 'explore';
    this.elseDone = false;
    this.elseHasKey = true;
    this.elseRan = false;
    this.elseFeedback = '';
    this.elseFeedbackError = false;
    this.resetElseClassify();
  }

  // ── Fase 1: probar la puerta ──
  toggleElseKey(hasKey: boolean): void {
    this.elseHasKey = hasKey;
    this.elseRan = false;
    this.elseFeedback = '';
    this.elseFeedbackError = false;
  }

  runElseDoor(): void {
    this.elseRan = true;
    if (this.elseHasKey) {
      this.elseFeedbackError = false;
      this.elseFeedback = '🔓 SI tienes la llave → ¡La puerta se abre!';
    } else {
      this.elseFeedbackError = true;
      this.elseFeedback = '🔎 SI NO tienes la llave → ¡Debes buscarla!';
    }
  }

  goToElseClassify(): void {
    this.elsePhase = 'classify';
    this.resetElseClassify();
  }

  // ── Fase 2: reto extra – clasificar sin ejecutar ──
  resetElseClassify(): void {
    this.elseSituations = [
      { id: 1, keys: 0, choice: null },
      { id: 2, keys: 1, choice: null },
      { id: 3, keys: 3, choice: null },
      { id: 4, keys: 0, choice: null },
    ];
    this.elseChecked = false;
    this.elseAllCorrect = false;
    this.elseClassifyFeedback = '';
  }

  assignElse(id: number, choice: 'open' | 'search'): void {
    if (this.elseChecked) return;
    const s = this.elseSituations.find((x) => x.id === id);
    if (s) s.choice = choice;
  }

  get elseAllAssigned(): boolean {
    return this.elseSituations.every((s) => s.choice !== null);
  }

  /** Rama correcta según la condición llave > 0. */
  elseExpected(keys: number): 'open' | 'search' {
    return keys > 0 ? 'open' : 'search';
  }

  isElseCorrect(s: { keys: number; choice: 'open' | 'search' | null }): boolean {
    return s.choice === this.elseExpected(s.keys);
  }

  checkElseClassify(): void {
    if (!this.elseAllAssigned) {
      this.elseClassifyFeedback = '👀 Asigna un camino a cada situación antes de ejecutar.';
      this.elseAllCorrect = false;
      return;
    }
    this.elseChecked = true;
    this.elseAllCorrect = this.elseSituations.every((s) => this.isElseCorrect(s));
    this.elseClassifyFeedback = this.elseAllCorrect
      ? '🎉 ¡Todas correctas! SI llave > 0 abre la puerta; SI NO, toca buscar la llave.'
      : '🤔 Revisa las marcadas en rojo: SI llave > 0 → abrir, SI NO → buscar.';
  }

  finishElse(): void {
    this.elseDone = true;
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 6: EL GUARDIÁN DEL RÍO
  // ───────────────────────────────────────────────────────────
  resetGuardian(): void {
    this.guardianPhase = 'explore';
    this.guardianDone = false;
    this.guardianKey = true;
    this.guardianCoins = 5;
    this.guardianPrediction = null;
    this.guardianRan = false;
    this.guardianFeedback = '';
    this.guardianFeedbackError = false;
    this.resetGuardianFinal();
  }

  // ── Fase 1: variables + predicción ──
  /** Regla: tiene llave Y monedas >= 5. */
  guardianRule(hasKey: boolean, coins: number): boolean {
    return hasKey && coins >= 5;
  }

  get guardianCanCross(): boolean {
    return this.guardianRule(this.guardianKey, this.guardianCoins);
  }

  toggleGuardianKey(hasKey: boolean): void {
    this.guardianKey = hasKey;
    this.guardianPrediction = null;
    this.guardianRan = false;
    this.guardianFeedback = '';
  }

  guardianCoinsAdd(): void {
    if (this.guardianCoins < 10) this.guardianCoins++;
    this.guardianPrediction = null;
    this.guardianRan = false;
    this.guardianFeedback = '';
  }

  guardianCoinsSub(): void {
    if (this.guardianCoins > 0) this.guardianCoins--;
    this.guardianPrediction = null;
    this.guardianRan = false;
    this.guardianFeedback = '';
  }

  predictGuardian(canCross: boolean): void {
    if (this.guardianRan) return;
    this.guardianPrediction = canCross;
  }

  runGuardian(): void {
    if (this.guardianPrediction === null) return;
    this.guardianRan = true;
    const real = this.guardianCanCross;
    const hit = this.guardianPrediction === real;
    this.guardianFeedbackError = !hit;
    const result = real
      ? '🌉 ¡Puede cruzar! Tiene la llave 🔑 Y ' + this.guardianCoins + ' monedas (≥ 5).'
      : '🧙 El guardián no lo deja pasar: ' + (!this.guardianKey ? 'falta la llave 🔑.' : 'solo tiene ' + this.guardianCoins + ' monedas (< 5).');
    this.guardianFeedback = (hit ? '🎉 ¡Predicción correcta! ' : '🤔 Fallaste la predicción. ') + result;
  }

  goToGuardianFinal(): void {
    this.guardianPhase = 'final';
    this.resetGuardianFinal();
  }

  // ── Fase 2: reto final con 4 personajes ──
  resetGuardianFinal(): void {
    this.guardianChars = [
      { id: 1, name: 'Ana', emoji: '🧒', hasKey: true, coins: 8, selected: false },
      { id: 2, name: 'Beto', emoji: '👦', hasKey: true, coins: 3, selected: false },
      { id: 3, name: 'Caro', emoji: '👧', hasKey: false, coins: 10, selected: false },
      { id: 4, name: 'Dani', emoji: '🧑', hasKey: true, coins: 6, selected: false },
    ];
    this.guardianChecked = false;
    this.guardianAllCorrect = false;
    this.guardianFinalFeedback = '';
  }

  toggleGuardianChar(id: number): void {
    if (this.guardianChecked) return;
    const c = this.guardianChars.find((x) => x.id === id);
    if (c) c.selected = !c.selected;
  }

  charCanCross(c: { hasKey: boolean; coins: number }): boolean {
    return this.guardianRule(c.hasKey, c.coins);
  }

  isGuardianCharCorrect(c: { hasKey: boolean; coins: number; selected: boolean }): boolean {
    return c.selected === this.charCanCross(c);
  }

  checkGuardianFinal(): void {
    this.guardianChecked = true;
    this.guardianAllCorrect = this.guardianChars.every((c) => this.isGuardianCharCorrect(c));
    this.guardianFinalFeedback = this.guardianAllCorrect
      ? '🎉 ¡Perfecto! Solo cruzan quienes tienen llave 🔑 Y 5 o más monedas 🪙.'
      : '🤔 Revisa: para cruzar hacen falta las DOS condiciones a la vez (llave Y monedas ≥ 5).';
  }

  finishGuardian(): void {
    this.guardianDone = true;
  }

  // ───────────────────────────────────────────────────────────
  // ACTIVIDAD 7: RETO FINAL - ¡CRUZA EL RÍO!
  // ───────────────────────────────────────────────────────────
  resetCross(): void {
    this.crossLives = 2;
    this.crossCoins = 3;
    this.crossKey = false;
    this.crossItem = false;
    this.crossResult = 'none';
    this.crossFeedback = '';
    this.crossFeedbackError = false;
    this.crossDone = false;
  }

  get crossHearts(): number[] {
    return Array.from({ length: this.crossLives }, (_, i) => i);
  }

  // ── Condiciones de cada obstáculo ──
  get crossBridgeOk(): boolean {
    return this.crossKey && this.crossCoins >= 5; // 🌉 llave Y monedas >= 5
  }
  get crossCrocOk(): boolean {
    return this.crossLives > 2; // 🐊 vidas > 2
  }
  get crossGuardianOk(): boolean {
    return this.crossItem; // 🧙 objeto especial
  }
  get crossAllOk(): boolean {
    return this.crossBridgeOk && this.crossCrocOk && this.crossGuardianOk;
  }

  private crossMissingList(): string {
    const missing: string[] = [];
    if (!this.crossBridgeOk) missing.push('🌉 puente (llave 🔑 Y 5 monedas 🪙)');
    if (!this.crossCrocOk) missing.push('🐊 cocodrilo (más de 2 vidas ❤️)');
    if (!this.crossGuardianOk) missing.push('🧙 guardián (objeto especial 🎒)');
    return missing.join(', ');
  }

  // ── Acciones para preparar al personaje (analizar variables) ──
  private clearCrossRun(): void {
    if (this.crossResult !== 'over') this.crossResult = 'none';
    this.crossFeedback = '';
    this.crossFeedbackError = false;
  }

  crossFindKey(): void {
    this.crossKey = true;
    this.clearCrossRun();
  }

  crossEarnCoins(): void {
    this.crossCoins = Math.min(this.crossCoins + 3, 12);
    this.clearCrossRun();
  }

  crossRest(): void {
    this.crossLives = Math.min(this.crossLives + 1, 5);
    this.clearCrossRun();
  }

  crossTakeItem(): void {
    this.crossItem = true;
    this.clearCrossRun();
  }

  // ── Ejecutar con comprobación (camino seguro) ──
  crossCheckAndCross(): void {
    if (this.crossAllOk) {
      this.crossResult = 'win';
      this.crossFeedbackError = false;
      this.crossFeedback = '🏆 ¡Lo lograste! Cumpliste todas las condiciones y cruzaste el río. 🌉';
      this.crossDone = true;
    } else {
      this.crossResult = 'missing';
      this.crossFeedbackError = true;
      this.crossFeedback = '🔎 Te falta algo. Revisa tus variables: ' + this.crossMissingList() + '.';
    }
  }

  // ── Ejecutar arriesgándose (camino peligroso) ──
  crossRush(): void {
    if (this.crossAllOk) {
      this.crossResult = 'win';
      this.crossFeedbackError = false;
      this.crossFeedback = '🏆 ¡Lo lograste! Te arriesgaste... y estabas list@ de verdad. 🌉';
      this.crossDone = true;
    } else {
      this.crossResult = 'over';
      this.crossFeedbackError = true;
      this.crossFeedback = '💀 Game Over. Tomaste una decisión incorrecta sin cumplir: ' + this.crossMissingList() + '.';
    }
  }

  restartCross(): void {
    this.resetCross();
  }
}
