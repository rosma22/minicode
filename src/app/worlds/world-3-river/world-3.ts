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
