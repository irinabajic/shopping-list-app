import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);

  // === VALIDACIJA EMAIL-a (zadržavamo tvoju proveru) ===
  private validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // === REGISTRACIJA (Firebase Auth) ===
  // Vraća true ako je prošlo, false ako nije (kao tvoja stara verzija), ali je sada ASINHRONO.
  async register(email: string, password: string): Promise<boolean> {
    if (!this.validateEmail(email) || password.length < 6) {
      return false;
    }
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch {
      // npr. ako email već postoji
      return false;
    }
  }

  // === LOGIN (Firebase Auth) ===
  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch {
      return false;
    }
  }

  // === LOGOUT ===
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // === STATUS ===
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  // === Korisni dodaci za bazu (trebaće nam) ===
  uid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  /** Token za REST pozive ka Realtime DB: dodaje se kao ?auth=ID_TOKEN */
  async idToken(): Promise<string> {
    const u = this.auth.currentUser;
    if (!u) throw new Error('Nema ulogovanog korisnika.');
    return await u.getIdToken();
  }
}

