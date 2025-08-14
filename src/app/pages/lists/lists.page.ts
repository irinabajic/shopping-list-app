import { Component, inject } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

type ShoppingList = { id: string; name: string };

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './lists.page.html',
})
export class ListsPage {
  private fb = inject(FirebaseService);
  private toast = inject(ToastController);
  private alert = inject(AlertController);
  private router = inject(Router);

  lists: ShoppingList[] = [];
  newListName = '';

  async ionViewWillEnter() {
    try {
      const res = await this.fb.getLists();
      this.lists = res
        ? Object.entries(res).map(([id, v]) => ({ id, name: (v as any).name }))
        : [];
    } catch (err) {
      console.error(err);
      (await this.toast.create({
        message: 'Greška pri učitavanju lista',
        duration: 1500
      })).present();
    }
  }

  async addList() {
    const name = this.newListName.trim();
    if (!name) {
      (await this.toast.create({
        message: 'Naziv je prazan',
        duration: 1200
      })).present();
      return;
    }

    try {
      const resp: any = await this.fb.createList(name);
      const id = resp?.name; // RTDB: { name: "<generatedId>" }
      if (id) {
        this.lists = [{ id, name }, ...this.lists];
        this.newListName = '';
        (await this.toast.create({
          message: 'Lista dodata',
          duration: 1200
        })).present();
      }
    } catch (err) {
      console.error(err);
      (await this.toast.create({
        message: 'Greška pri dodavanju liste',
        duration: 1500
      })).present();
    }
  }

  open(l: ShoppingList) {
    this.router.navigate(['/list', l.id, l.name]);
  }

  async rename(l: ShoppingList) {
    const a = await this.alert.create({
      header: 'Preimenuj listu',
      inputs: [{ name: 'name', type: 'text', value: l.name, placeholder: 'Naziv liste' }],
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Sačuvaj',
          handler: async (data) => {
            const name = (data?.name || '').trim();
            if (!name) return false;
            try {
              await this.fb.renameList(l.id, name);
              l.name = name;
              (await this.toast.create({
                message: 'Lista preimenovana',
                duration: 1200
              })).present();
            } catch (err) {
              console.error(err);
              (await this.toast.create({
                message: 'Greška pri preimenovanju liste',
                duration: 1500
              })).present();
            }
            return true;
          }
        }
      ]
    });
    await a.present();
  }

  async remove(l: ShoppingList) {
    const a = await this.alert.create({
      header: 'Obriši listu?',
      message: `Obriši "${l.name}" i sve stavke unutar nje.`,
      buttons: [
        { text: 'Ne', role: 'cancel' },
        {
          text: 'Da, obriši',
          role: 'destructive',
          handler: async () => {
            try {
              await this.fb.deleteListAndItems(l.id);
              this.lists = this.lists.filter(x => x.id !== l.id);
              (await this.toast.create({
                message: 'Lista obrisana',
                duration: 1200
              })).present();
            } catch (err) {
              console.error(err);
              (await this.toast.create({
                message: 'Greška pri brisanju liste',
                duration: 1500
              })).present();
            }
          }
        }
      ]
    });
    await a.present();
  }

    async logout() {
  const alert = await this.alert.create({
    header: 'Odjava',
    message: 'Da li ste sigurni da zelite da se odjavite?',
    buttons: [
      {
        text: 'Otkazi',
        role: 'cancel'
      },
      {
        text: 'Da, odjavi me',
        handler: async () => {
          try {
            const { getAuth, signOut } = await import('@angular/fire/auth');
            const auth = getAuth();
            await signOut(auth);
          } catch (e) {
            console.warn('Odjava (fallback):', e);
          } finally {
            this.router.navigateByUrl('/start');
            (await this.toast.create({
              message: 'Odjava uspešna',
              duration: 1200
            })).present();
          }
        }
      }
    ]
  });

  await alert.present();
}

}
