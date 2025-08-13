import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

type ShoppingItem = { id: string; name: string; qty?: number; purchased: boolean };

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './list-detail.page.html',
})
export class ListDetailPage {
  constructor(private toast: ToastController) {}

  private fb = inject(FirebaseService);

  newItemName = '';
  newItemQty?: number;
  items: ShoppingItem[] = [];

  ionViewWillEnter() {
  this.fb.getItems().subscribe(res => {
    this.items = res
      ? Object.entries(res).map(([id, v]: [string, any]) => ({
          id,
          name: v.name,
          qty: v.qty,
          purchased: !!v.purchased
        }))
      : [];
  });
}

  private async present(msg: string) {
    const t = await this.toast.create({ message: msg, duration: 1200, position: 'bottom' });
    await t.present();
  }

  async addItem(): Promise<void> {
  const name = this.newItemName.trim();
  if (!name) { this.present('Ne možete dodati praznu stavku.'); return; }

  try {
    const resp = await this.fb.addItem(name, this.newItemQty).toPromise(); // { name: "<noviId>" }
    const newId = resp!.name;
    const it: ShoppingItem = { id: newId, name, qty: this.newItemQty || undefined, purchased: false };
    this.items = [it, ...this.items];
    this.newItemName = '';
    this.newItemQty = undefined;
    this.present('Stavka dodata.');
  } catch {
    this.present('Greška pri dodavanju.');
  }
}

  async togglePurchased(it: ShoppingItem): Promise<void> {
  try {
    await this.fb.togglePurchased(it.id, !it.purchased).toPromise();
    it.purchased = !it.purchased;
  } catch {
    this.present('Greška pri označavanju.');
  }
}

 async removeItem(it: ShoppingItem): Promise<void> {
  try {
    await this.fb.deleteItem(it.id).toPromise();
    this.items = this.items.filter(x => x.id !== it.id);
    this.present('Stavka obrisana.');
  } catch {
    this.present('Greška pri brisanju.');
  }
}}