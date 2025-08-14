import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private currentUser: User | null = null;

  constructor() {
    // sluša promene stanja
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }
  async register(email: string, password: string): Promise<boolean> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (err: any) {
      console.error('Greška prilikom registracije:', err.code, err.message);
      alert('Greška: ' + err.message); // privremeno za debug
      return false;
    }
  }
  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (err) {
      console.error('Greška pri logovanju:', err);
      return false;
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  uid(): string | null {
    return this.currentUser ? this.currentUser.uid : null;
  }

  async idToken(): Promise<string | null> {
    if (!this.currentUser) return null;
    return await this.currentUser.getIdToken();
  }
}

