# Caccia ai Numeri — PWA v5 (Primaria → Liceo)
Gioco didattico **multi-livello** secondo le **Indicazioni Nazionali**: copre **Primaria (1ª–5ª)**, **Medie (1ª–3ª)** e **Liceo scientifico (1ª–5ª)**.
Funziona come **PWA** su **PC, tablet, LIM, iPhone/iPad** anche **offline**.

## 🎯 Obiettivi per ordine di scuola (sintesi)
- **Primaria:** numeri, calcolo entro 100/1000, tabelline e divisioni, frazioni/decimali introduttivi, perimetro/area semplici, problemi contestualizzati.
- **Medie:** equazioni di 1° grado, teorema di Pitagora, percentuali/proporzioni, statistica descrittiva di base.
- **Liceo scientifico:** funzioni lineari e quadratiche, radici e discriminante (casi semplici), trigonometria su angoli notevoli; estendibile a limiti/derivate/integrali.

## 🧩 Livelli disponibili in app
- **Primaria:** 1ª, 2ª, 3ª, 4ª, 5ª
- **Medie:** 1ª, 2ª, 3ª
- **Liceo:** 1ª, 2ª, 3ª, 4ª, 5ª

Ogni livello propone un **mix** di generatori coerenti con l’età e i traguardi ministeriali. Il sistema è **estensibile**: basta aggiungere generatori in `app.js` e inserirli nella rotta desiderata.

## 🛠️ Sviluppo: come aggiungere un gioco
In `app.js` un generatore restituisce:
```js
return { name: "Titolo", prompt: "Domanda", choices: [..], correct: 0 };
```
Aggiungi la funzione e inseriscila nella rotta (es. `routes.media2.push(genNuovo());`).

## 📱 PWA & offline
- Installabile (Android/Chrome, Desktop Chrome/Edge).
- **Offline** via Service Worker.
- Bottone **Aggiorna App** per forzare l’update della cache (utile su iOS).

## 🔒 Privacy
Nessun backend, nessun tracciamento; eventuali dati futuri (report docente) in **localStorage** sul dispositivo.

## 👤 Crediti e licenza
© 2025 **PezzaliAPP** — Prototipo educativo. Uso libero a fini didattici (citare la fonte).
