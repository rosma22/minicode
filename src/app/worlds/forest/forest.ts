import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/game-state.service';

/**
 * Pantalla inicial: el mapa del Bosque con los accesos a cada mundo.
 * Emite un evento por mundo para que el shell (App) cambie de pantalla.
 */
@Component({
  selector: 'app-forest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forest.html',
  styleUrl: './forest.css',
})
export class ForestComponent {
  @Output() openWorld1 = new EventEmitter<void>();
  @Output() openWorld2 = new EventEmitter<void>();
  @Output() openWorld3 = new EventEmitter<void>();

  constructor(public game: GameStateService) {}
}
