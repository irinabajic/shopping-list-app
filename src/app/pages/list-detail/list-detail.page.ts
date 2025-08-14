import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { AlertController } from '@ionic/angular';

type ShoppingItem = { id: string; name: string; qty?: number; purchased: boolean };

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './list-detail.page.html',
})
export class ListDetailPage {
  constructor(private toast: ToastController) {}

  private route = inject(ActivatedRoute);
  private fb = inject(FirebaseService);
  private alert = inject(AlertController);

  listId = '';
  listName = '';

  newItemName = '';
  newItemQty?: number;
  items: ShoppingItem[] = [];

  async ionViewWillEnter() {
    this.listId = this.route.snapshot.paramMap.get('id') || '';
    this.listName = this.route.snapshot.paramMap.get('name') || '';

    try {
      const res = await this.fb.getItemsByList(this.listId);
      this.items = res
        ? Object.entries(res).map(([id, v]: [string, any]) => ({
            id,
            name: v.name,
            qty: v.qty,
            purchased: !!v.purchased
          }))
        : [];
      this.sortItems();
    } catch (e) {
      this.present('Greška pri učitavanju stavki.');
      console.error(e);
    }
  }

  private async present(msg: string) {
    const t = await this.toast.create({ message: msg, duration: 1200, position: 'bottom' });
    await t.present();
  }

  async addItem(): Promise<void> {
    const name = this.newItemName.trim();
    if (!name) {
      this.present('Ne možete dodati praznu stavku.');
      return;
    }

    try {
      // fb.addItemToList vraća { name: "<firebase-generated-id>" }
      const resp: any = await this.fb.addItemToList(this.listId, name, this.newItemQty);
      const newId = resp?.name;
      if (newId) {
        this.items = [{ id: newId, name, qty: this.newItemQty || undefined, purchased: false }, ...this.items];
        this.newItemName = '';
        this.newItemQty = undefined;
        this.present('Stavka dodata.');
      } else {
        this.present('Neočekivan odgovor pri dodavanju.');
      }
    } catch (e) {
      this.present('Greška pri dodavanju.');
      console.error(e);
    }
  }

  async togglePurchased(it: ShoppingItem): Promise<void> {
    try {
      await this.fb.togglePurchasedInList(this.listId, it.id, !it.purchased);
      it.purchased = !it.purchased;
      this.sortItems();
    } catch (e) {
      this.present('Greška pri označavanju.');
      console.error(e);
    }
  }

  async removeItem(it: ShoppingItem): Promise<void> {
    try {
      await this.fb.deleteItemInList(this.listId, it.id);
      this.items = this.items.filter(x => x.id !== it.id);
      this.present('Stavka obrisana.');
    } catch (e) {
      this.present('Greška pri brisanju.');
      console.error(e);
    }
  }

  async edit(it: ShoppingItem): Promise<void> {
    const a = await this.alert.create({
      header: 'Izmena stavke',
      inputs: [
        { name: 'name', type: 'text', value: it.name, placeholder: 'Naziv' },
        { name: 'qty',  type: 'number', value: it.qty ?? '', placeholder: 'Količina (opciono)' },
      ],
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Sačuvaj',
          handler: async (data) => {
            const name = (data?.name || '').trim();
            const qtyRaw = (data?.qty ?? '').toString().trim();
            const qty = qtyRaw === '' ? undefined : Number(qtyRaw);
            if (!name) return false; // blokiraj prazno ime

            try {
              await this.fb.updateItemInList(this.listId, it.id, { name, qty });
              it.name = name;
              it.qty = qty;
              this.present('Stavka izmenjena.');
            } catch (e) {
              this.present('Greška pri izmeni.');
              console.error(e);
            }
            return true;
          }
        }
      ]
    });
    await a.present();
  }

  private sortItems() {
    // nekupjene gore, kupljene dole; zadrži redosled unutar grupa
    this.items = [
      ...this.items.filter(i => !i.purchased),
      ...this.items.filter(i => i.purchased)
    ];
  }

  async clearPurchased(): Promise<void> {
    const ids = this.items.filter(i => i.purchased).map(i => i.id);
    if (!ids.length) {
      this.present('Nema kupljenih za brisanje.');
      return;
    }

    try {
      await this.fb.deletePurchasedInList(this.listId, ids); // helper iz servisa
      this.items = this.items.filter(i => !i.purchased);
      this.present('Kupljene stavke obrisane.');
    } catch (e) {
      this.present('Greška pri brisanju kupljenih.');
      console.error(e);
    }
  }
}
