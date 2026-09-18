import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from './core/game-state.service';
import { AuthService } from './core/auth.service';
import { AuthComponent } from './auth/auth';
import { ForestComponent } from './worlds/forest/forest';
import { World1Component } from './worlds/world-1-seeds/world-1';
import { World2Component } from './worlds/world-2-path/world-2';
import { World3Component } from './worlds/world-3-river/world-3';

type Screen = 'forest' | 'world-1' | 'world-2' | 'world-3';

/**
 * Shell de la aplicación: cabecera con las estadísticas del jugador
 * y navegación entre las pantallas (bosque y mundos).
 * Cada mundo es un componente independiente.
 *
 * Si no hay sesión iniciada se muestra la pantalla de acceso (login/registro).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AuthComponent,
    ForestComponent,
    World1Component,
    World2Component,
    World3Component,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  currentScreen: Screen = 'forest';

  constructor(public game: GameStateService, public auth: AuthService) {
    // Si ya había una sesión activa al arrancar, aplica sus permisos.
    this.applyRolePermissions();
  }

  /** Al iniciar sesión se vuelve al bosque y se aplican los permisos del rol. */
  onAuthenticated(): void {
    this.applyRolePermissions();
    this.currentScreen = 'forest';
  }

  /** El profesor (permiso 'desbloquear-todo') tiene todos los mundos abiertos. */
  private applyRolePermissions(): void {
    if (this.auth.hasPermission('desbloquear-todo')) {
      this.game.unlockAll();
    }
  }

  /** Cierra la sesión y vuelve a la pantalla de acceso. */
  logout(): void {
    this.auth.logout();
    this.currentScreen = 'forest';
  }

  openWorld1(): void {
    this.currentScreen = 'world-1';
  }

  openWorld2(): void {
    if (this.game.level2Unlocked) {
      this.currentScreen = 'world-2';
    }
  }

  openWorld3(): void {
    if (this.game.level3Unlocked) {
      this.currentScreen = 'world-3';
    }
  }

  backToForest(): void {
    this.currentScreen = 'forest';
  }
}
