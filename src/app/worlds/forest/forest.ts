import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/game-state.service';

/**
 * Pantalla inicial: el mapa del Bosque con los accesos a cada mundo.
 * Emite un evento por mundo para que el shell (App) cambie de pantalla.
 *
 * El personaje (explorador) comienza al inicio del sendero y "camina"
 * hasta el mundo desbloqueado más avanzado cada vez que se entra al bosque.
 */
@Component({
  selector: 'app-forest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forest.html',
  styleUrl: './forest.css',
})
export class ForestComponent implements OnInit {
  @Output() openWorld1 = new EventEmitter<void>();
  @Output() openWorld2 = new EventEmitter<void>();
  @Output() openWorld3 = new EventEmitter<void>();

  /** true mientras el personaje se desplaza por el sendero. */
  walking = false;
  /** false = el personaje sigue al inicio del sendero; true = ya avanzó al mundo. */
  private arrived = false;

  /** Coordenadas (en %) del personaje a lo largo del sendero. */
  private readonly positions: Record<string, { left: string; top: string }> = {
    start: { left: '9%', top: '86%' },
    w1: { left: '20%', top: '76%' },
    w2: { left: '42%', top: '64%' },
    w3: { left: '66%', top: '40%' },
  };

  constructor(public game: GameStateService) {}

  /** Mundo desbloqueado más avanzado (destino del personaje). */
  get currentWorld(): number {
    if (this.game.level3Unlocked) return 3;
    if (this.game.level2Unlocked) return 2;
    return 1;
  }

  /** Posición actual del personaje: al inicio o sobre el mundo alcanzado. */
  get characterPos(): { left: string; top: string } {
    return this.arrived ? this.positions['w' + this.currentWorld] : this.positions['start'];
  }

  ngOnInit(): void {
    // Arranca al inicio del sendero y camina hacia el mundo desbloqueado.
    setTimeout(() => {
      this.walking = true;
      this.arrived = true;
    }, 500);
    // Deja de caminar al llegar (coincide con la duración de la transición CSS).
    setTimeout(() => {
      this.walking = false;
    }, 500 + 2600);
  }
}
