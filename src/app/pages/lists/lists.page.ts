import { Component, inject } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
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
  private router = inject(Router);

  lists: ShoppingList[] = [];
  newListName = '';

  ionViewWillEnter() {
    this.fb.getLists().subscribe(res => {
      this.lists = res ? Object.entries(res).map(([id, v]) => ({ id, name: v.name })) : [];
    });
  }

  async addList() {
    const name = this.newListName.trim();
    if (!name) { (await this.toast.create({message:'Naziv je prazan',duration:1200})).present(); return; }
    const resp = await this.fb.createList(name).toPromise(); // { name: "<id>" }
    const id = resp!.name;
    this.lists = [{ id, name }, ...this.lists];
    this.newListName = '';
    (await this.toast.create({message:'Lista dodata',duration:1200})).present();
  }

  open(l: ShoppingList) {
    this.router.navigate(['/list', l.id, l.name]);
  }
}
