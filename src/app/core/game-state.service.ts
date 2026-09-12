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

  // TODO: volver a false antes de publicar (habilitado para desarrollo)
  level2Unlocked = true;
  level3Unlocked = true;

  applyReward(reward: ActivityReward): void {
    this.experience += reward.experience;
    this.seeds += reward.seeds;
  }
}
