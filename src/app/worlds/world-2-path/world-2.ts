import { Component, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../core/game-state.service';
import { type ActivityReward } from '../../models/activities';

/**
 * MUNDO 2 - SENDERO (VARIABLES)
 * Contiene 8 actividades sobre variables.
 */
@Component({
  selector: 'app-world-2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './world-2.html',
  styleUrl: './world-2.css',
})
export class World2Component {
  @Output() unlockWorld3 = new EventEmitter<void>();
  @Output() backToForest = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef, private game: GameStateService) {
    this.resetWorld2Activities();
  }

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
  // MÉTODOS GENERALES
  // ═══════════════════════════════════════════════════════════
  nextWorld2Activity(): void {
    const reward: ActivityReward = { experience: 10, seeds: 1 };
    this.game.applyReward(reward);
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
      this.game.level3Unlocked = true;
    } else {
      this.quizFeedback = 'Algunas respuestas son incorrectas. Revisa e intenta de nuevo.';
    }
  }

  // Otorga la recompensa final del Mundo 2, desbloquea y pide abrir el Mundo 3
  unlockAndOpenWorld3(): void {
    this.game.level3Unlocked = true;
    this.unlockWorld3.emit();
  }
}
