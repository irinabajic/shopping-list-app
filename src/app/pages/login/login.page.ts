import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private alertCtrl: AlertController) {}

  async login() {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      await this.showAlert('Greška', 'Nema registrovanog korisnika. Registrujte se prvo.');
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (this.email === parsedUser.email && this.password === parsedUser.password) {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/lists']);
    } else {
      await this.showAlert('Greška', 'Pogrešan email ili lozinka.');
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
