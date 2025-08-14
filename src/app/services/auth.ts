import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly LOGGED_IN_KEY = 'loggedInUser';

  // Registracija korisnika
  register(email: string, password: string): boolean {
    if (!this.validateEmail(email) || password.length < 6) {
      return false; // email loš ili lozinka prekratka
    }

    let users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');

    // Provera da li email već postoji
    if (users.find((u: any) => u.email === email)) {
      return false; // korisnik već postoji
    }

    users.push({ email, password });
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }

  // Login
  login(email: string, password: string): boolean {
    let users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    let user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(this.LOGGED_IN_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  // Logout
  logout() {
    localStorage.removeItem(this.LOGGED_IN_KEY);
  }

  // Provera da li je korisnik ulogovan
  isLoggedIn(): boolean {
    return localStorage.getItem(this.LOGGED_IN_KEY) !== null;
  }

  // Provera ispravnosti email formata
  private validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
