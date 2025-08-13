import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private http = inject(HttpClient);
  private base = environment.firebaseDbUrl;
  private path = 'users/demoUser/items';

  getItems() {
    return this.http.get<Record<string, { name: string; qty?: number; purchased: boolean }> | null>(
      `${this.base}/${this.path}.json`
    );
  }

  addItem(name: string, qty?: number) {
    return this.http.post<{ name: string }>(
      `${this.base}/${this.path}.json`,
      { name, qty: qty ?? undefined, purchased: false }
    );
  }

  togglePurchased(id: string, nextValue: boolean) {
    return this.http.patch(`${this.base}/${this.path}/${id}.json`, { purchased: nextValue });
  }

  deleteItem(id: string) {
    return this.http.delete(`${this.base}/${this.path}/${id}.json`);
  }

  // ==== LISTE ====
getLists() {
  return this.http.get<Record<string, { name: string }> | null>(
    `${this.base}/users/demoUser/lists.json`
  );
}

createList(name: string) {
  return this.http.post<{ name: string }>(
    `${this.base}/users/demoUser/lists.json`,
    { name }
  );
}

// Helper za stavke po listi:
getItemsByList(listId: string) {
  return this.http.get<Record<string, { name: string; qty?: number; purchased: boolean }> | null>(
    `${this.base}/users/demoUser/itemsByList/${listId}.json`
  );
}
addItemToList(listId: string, name: string, qty?: number) {
  return this.http.post<{ name: string }>(
    `${this.base}/users/demoUser/itemsByList/${listId}.json`,
    { name, qty: qty ?? undefined, purchased: false }
  );
}
togglePurchasedInList(listId: string, id: string, next: boolean) {
  return this.http.patch(
    `${this.base}/users/demoUser/itemsByList/${listId}/${id}.json`,
    { purchased: next }
  );
}
deleteItemInList(listId: string, id: string) {
  return this.http.delete(
    `${this.base}/users/demoUser/itemsByList/${listId}/${id}.json`
  );
}
}