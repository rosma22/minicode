import { Injectable, signal, computed } from '@angular/core';

/**
 * Roles disponibles. El rol determina los permisos del usuario:
 *  - 'estudiante': juega y avanza por los mundos (rol por defecto).
 *  - 'profesor':   además puede administrar (p. ej. desbloquear todos
 *                  los mundos o reiniciar el progreso).
 */
export type Role = 'estudiante' | 'profesor';

/** Permisos que se pueden otorgar según el rol. */
export type Permission = 'jugar' | 'desbloquear-todo' | 'reiniciar-progreso';

/** Usuario tal como se guarda (incluye la contraseña en texto plano, ver nota). */
interface StoredUser {
  username: string;
  password: string;
  role: Role;
}

/** Usuario expuesto a la app (sin la contraseña). */
export interface AuthUser {
  username: string;
  role: Role;
}

const USERS_KEY = 'minicode.users';
const SESSION_KEY = 'minicode.session';

/** Permisos otorgados a cada rol. */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  estudiante: ['jugar'],
  profesor: ['jugar', 'desbloquear-todo', 'reiniciar-progreso'],
};

/**
 * Usuarios predefinidos que se crean automáticamente la primera vez que
 * arranca la app (si aún no hay usuarios guardados). Útil para poder entrar
 * sin registrarse. Puedes cambiar estos nombres/contraseñas a tu gusto.
 */
const DEFAULT_USERS: StoredUser[] = [
  // Administrador (profesor): tiene todos los permisos.
  { username: 'admin', password: 'admin123', role: 'profesor' },

  // Estudiantes de ejemplo.
  { username: 'nori', password: 'nori123', role: 'estudiante' },
  { username: 'lucas', password: 'lucas123', role: 'estudiante' },
  { username: 'sofia', password: 'sofia123', role: 'estudiante' },
];

/**
 * Autenticación sencilla basada en `localStorage`.
 *
 * NOTA DE SEGURIDAD: al no existir backend, los usuarios y contraseñas se
 * guardan localmente en el navegador/Electron. Es suficiente para una app
 * educativa local, pero NO debe usarse con credenciales reales ni en un
 * entorno multiusuario expuesto a internet.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Usuario autenticado (o null si no hay sesión). */
  private readonly _currentUser = signal<AuthUser | null>(this.loadSession());

  constructor() {
    this.seedDefaultUsers();
  }

  /** Señal de solo lectura del usuario actual. */
  readonly currentUser = this._currentUser.asReadonly();

  /** true si hay una sesión iniciada. */
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  /** Registra un usuario nuevo e inicia sesión. Devuelve error si ya existe. */
  register(username: string, password: string, role: Role = 'estudiante'): { ok: boolean; error?: string } {
    const name = username.trim();
    if (!name || !password) {
      return { ok: false, error: 'Escribe un nombre de usuario y una contraseña.' };
    }

    const users = this.loadUsers();
    if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
      return { ok: false, error: 'Ese nombre de usuario ya existe.' };
    }

    users.push({ username: name, password, role });
    this.saveUsers(users);
    this.startSession({ username: name, role });
    return { ok: true };
  }

  /** Inicia sesión con un usuario existente. */
  login(username: string, password: string): { ok: boolean; error?: string } {
    const name = username.trim();
    const user = this.loadUsers().find(
      (u) => u.username.toLowerCase() === name.toLowerCase() && u.password === password,
    );

    if (!user) {
      return { ok: false, error: 'Usuario o contraseña incorrectos.' };
    }

    this.startSession({ username: user.username, role: user.role });
    return { ok: true };
  }

  /** Cierra la sesión actual. */
  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  /** Comprueba si el usuario actual tiene un permiso concreto. */
  hasPermission(permission: Permission): boolean {
    const user = this._currentUser();
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  }

  // ── Persistencia ────────────────────────────────────────────────────────

  /**
   * Asegura que los usuarios predefinidos existan. Añade los que falten a la
   * lista guardada sin sobrescribir los que el usuario haya registrado por su
   * cuenta (se comparan por nombre, sin distinguir mayúsculas).
   */
  private seedDefaultUsers(): void {
    const users = this.loadUsers();
    let changed = false;

    for (const defaultUser of DEFAULT_USERS) {
      const exists = users.some(
        (u) => u.username.toLowerCase() === defaultUser.username.toLowerCase(),
      );
      if (!exists) {
        users.push(defaultUser);
        changed = true;
      }
    }

    if (changed) {
      this.saveUsers(users);
    }
  }

  private startSession(user: AuthUser): void {
    this._currentUser.set(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  private loadSession(): AuthUser | null {
    return this.readJson<AuthUser>(SESSION_KEY);
  }

  private loadUsers(): StoredUser[] {
    return this.readJson<StoredUser[]>(USERS_KEY) ?? [];
  }

  private saveUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private readJson<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }
}
