# Shopping List (Ionic + Angular + Firebase)

## Pokretanje
1) Node LTS + Ionic CLI
2) npm install
3) U `src/environments/environment.ts` postavi `firebaseDbUrl`
4) ionic serve → otvori http://localhost:8100/lists

## Funkcije
- Liste: dodavanje, preimenovanje, brisanje (briše i sve stavke)
- Stavke: dodavanje, izmena (naziv/količina), brisanje, označavanje kupljeno/vrati
- Sortiranje: kupljene idu na kraj
- “Obriši sve kupljene”
- Firebase Realtime DB (REST)

## Struktura podataka
/users/demoUser/lists/{listId} -> { name }
/users/demoUser/itemsByList/{listId}/{itemId} -> { name, qty, purchased }
