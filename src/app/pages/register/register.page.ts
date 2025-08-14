import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router, private alertCtrl: AlertController) {}

  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      await this.showAlert('Greška', 'Sva polja su obavezna.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showAlert('Greška', 'Lozinke se ne poklapaju.');
      return;
    }

    const user = { email: this.email, password: this.password };
    localStorage.setItem('user', JSON.stringify(user));

    await this.showAlert('Uspeh', 'Registracija uspešna. Možete se ulogovati.');
    this.router.navigate(['/start']);
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
