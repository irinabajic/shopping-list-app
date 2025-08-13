import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Item = { id: string; name: string; qty?: number; purchased: boolean };

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './list-detail.page.html',
})
export class ListDetailPage {
  constructor(private toast: ToastController) {}
  newItemName = '';
  newItemQty?: number;
  items: Item[] = [];

  private async present(msg: string) {
    const t = await this.toast.create({ message: msg, duration: 1200, position: 'bottom' });
    await t.present();
  }

  addItem(): void {
    const name = this.newItemName.trim();
    if (!name) { 
      this.present('Ne možete dodati praznu stavku.');
      return; 
    }

    const it: Item = { id: crypto.randomUUID(), name, qty: this.newItemQty || undefined, purchased: false };
    this.items = [it, ...this.items];
    this.newItemName = '';
    this.newItemQty = undefined;
    this.present('Stavka dodata.');
  }

  togglePurchased(it: Item): void { it.purchased = !it.purchased; }

  removeItem(it: Item): void {
    this.items = this.items.filter(x => x.id !== it.id);
    this.present('Stavka obrisana.');
  }
}