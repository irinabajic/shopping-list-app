import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {}

  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      await this.showAlert('Greška', 'Sva polja su obavezna.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showAlert('Greška', 'Lozinke se ne poklapaju.');
      return;
    }

    const ok = await this.auth.register(this.email, this.password);
    if (!ok) {
      await this.showAlert('Greška', 'Registracija neuspešna. Pokušaj ponovo.');
      return;
    }

    await this.showAlert('Uspeh', 'Uspešno ste se registrovali.');
    this.router.navigate(['/login']);
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
