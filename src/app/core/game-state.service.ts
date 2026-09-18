import { Injectable } from '@angular/core';
import type { ActivityReward } from '../models/activities';

/**
 * Estado global del jugador compartido entre todos los mundos:
 * experiencia, semillas y desbloqueo de mundos.
 */
@Injectable({ providedIn: 'root' })
export class GameStateService {
  experience = 0;
  seeds = 0;

  // Los mundos 2 y 3 comienzan bloqueados; se desbloquean al avanzar.
  level2Unlocked = false;
  level3Unlocked = false;

  applyReward(reward: ActivityReward): void {
    this.experience += reward.experience;
    this.seeds += reward.seeds;
  }

  /** Desbloquea todos los mundos (p. ej. para el rol profesor). */
  unlockAll(): void {
    this.level2Unlocked = true;
    this.level3Unlocked = true;
  }
}
