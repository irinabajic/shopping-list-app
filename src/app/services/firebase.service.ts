import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private async buildUrl(path: string): Promise<string> {
    const uid = this.auth.uid();
    if (!uid) throw new Error('Korisnik nije ulogovan.');

    const token = await this.auth.idToken();
    return `${environment.firebaseDbUrl}/users/${uid}/${path}.json?auth=${token}`;
  }

  // ==== ITEMS (GLOBAL) ====
  async getItems() {
    const url = await this.buildUrl('items');
    return this.http.get<Record<string, { name: string; qty?: number; purchased: boolean }> | null>(url).toPromise();
  }

  async addItem(name: string, qty?: number) {
    const url = await this.buildUrl('items');
    return this.http.post(url, { name, qty: qty ?? undefined, purchased: false }).toPromise();
  }

  async togglePurchased(id: string, nextValue: boolean) {
    const url = await this.buildUrl(`items/${id}`);
    return this.http.patch(url, { purchased: nextValue }).toPromise();
  }

  async deleteItem(id: string) {
    const url = await this.buildUrl(`items/${id}`);
    return this.http.delete(url).toPromise();
  }

  // ==== LISTE ====
  async getLists() {
    const url = await this.buildUrl('lists');
    return this.http.get<Record<string, { name: string }> | null>(url).toPromise();
  }

  async createList(name: string) {
    const url = await this.buildUrl('lists');
    return this.http.post(url, { name }).toPromise();
  }

  async renameList(listId: string, newName: string) {
    const url = await this.buildUrl(`lists/${listId}`);
    return this.http.patch(url, { name: newName }).toPromise();
  }

  async deleteListAndItems(listId: string) {
    const urlList = await this.buildUrl(`lists/${listId}`);
    const urlItems = await this.buildUrl(`itemsByList/${listId}`);
    await Promise.all([
      this.http.delete(urlList).toPromise(),
      this.http.delete(urlItems).toPromise()
    ]);
  }

  getCurrentUser() {
    return localStorage.getItem('user'); 
  }

  async getItemsByList(listId: string) {
    const url = await this.buildUrl(`itemsByList/${listId}`);
    return this.http.get<Record<string, { name: string; qty?: number; purchased: boolean }> | null>(url).toPromise();
  }

  async addItemToList(listId: string, name: string, qty?: number) {
    const url = await this.buildUrl(`itemsByList/${listId}`);
    return this.http.post(url, { name, qty: qty ?? undefined, purchased: false }).toPromise();
  }

  async togglePurchasedInList(listId: string, id: string, next: boolean) {
    const url = await this.buildUrl(`itemsByList/${listId}/${id}`);
    return this.http.patch(url, { purchased: next }).toPromise();
  }

  async deleteItemInList(listId: string, id: string) {
    const url = await this.buildUrl(`itemsByList/${listId}/${id}`);
    return this.http.delete(url).toPromise();
  }

  async updateItemInList(listId: string, id: string, patch: { name?: string; qty?: number }) {
    const url = await this.buildUrl(`itemsByList/${listId}/${id}`);
    return this.http.patch(url, patch).toPromise();
  }

  async deletePurchasedInList(listId: string, ids: string[]) {
    return Promise.all(ids.map(async id => {
      const url = await this.buildUrl(`itemsByList/${listId}/${id}`);
      return this.http.delete(url).toPromise();
    }));
  }
}
