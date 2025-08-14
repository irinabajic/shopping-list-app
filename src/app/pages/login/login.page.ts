import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private firebase: FirebaseService
  ) {}

  async login() {
    if (!this.email || !this.password) {
      await this.showAlert('Greška', 'Sva polja su obavezna.');
      return;
    }

    const ok = await this.auth.login(this.email, this.password);
    if (!ok) {
      await this.showAlert('Greška', 'Pogrešan email ili lozinka.');
      return;
    }
     localStorage.setItem('user', JSON.stringify({ email: this.email }));
 
    // Ako login uspe, proveri da li korisnik već ima liste
    try {
      const lists = await this.firebase.getLists();
      if (!lists || Object.keys(lists).length === 0) {
        // Ako nema lista, kreiraj podrazumevanu
        await this.firebase.createList('Moja prva lista');
      }

      // Preusmeri na stranicu lists
      this.router.navigate(['/lists']);
    } catch (err) {
      console.error(err);
      await this.showAlert('Greška', 'Neuspešno učitavanje podataka.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
