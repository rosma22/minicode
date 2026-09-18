import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Role } from '../core/auth.service';

/**
 * Pantalla de acceso: permite iniciar sesión o registrarse.
 * Al autenticarse correctamente emite `authenticated` para que el
 * shell (App) muestre el juego.
 */
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthComponent {
  @Output() authenticated = new EventEmitter<void>();

  /** Modo actual del formulario. */
  mode: 'login' | 'register' = 'login';

  username = '';
  password = '';
  role: Role = 'estudiante';
  error = '';

  constructor(private auth: AuthService) {}

  /** Cambia entre iniciar sesión y registrarse. */
  switchMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.error = '';
  }

  /** Envía el formulario según el modo activo. */
  submit(): void {
    const result =
      this.mode === 'login'
        ? this.auth.login(this.username, this.password)
        : this.auth.register(this.username, this.password, this.role);

    if (result.ok) {
      this.error = '';
      this.authenticated.emit();
    } else {
      this.error = result.error ?? 'Ocurrió un error.';
    }
  }
}
