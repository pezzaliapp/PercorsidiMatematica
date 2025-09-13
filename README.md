# Caccia ai Numeri — PWA v4.1
Gioco didattico **per scuola primaria (classe seconda)**: addizioni con cambio, sottrazioni con prestito, tabelline (2/5/10), geometria di base.
Funziona come **Progressive Web App (PWA)**: utilizzabile su **PC, tablet, LIM, iPhone** anche **offline**.

---

## 🎯 Obiettivi didattici
- Consolidare i **numeri entro 100** e il calcolo mentale.
- Eseguire **addizioni** e **sottrazioni** con passaggio (cambio/prestito).
- Introdurre le **moltiplicazioni** come **addizioni ripetute** (tabelline 2–5–10).
- Riconoscere **figure geometriche** elementari e proprietà (lati/facce).
- Favorire **attenzione**, **motivazione** e **cooperazione** tramite gioco.

**Riferimento Indicazioni Nazionali (MIM):** area **Numeri**, **Spazio e figure**, **Problemi**.

---

## 👩‍🏫 A chi è adatto
- **Docenti** di scuola primaria (soprattutto **2ª**; utile anche per 1ª come consolidamento e 3ª come ripasso).
- **Alunni** dai 7 agli 8 anni.
- **Situazioni d’aula** con LIM o tablet; adatto anche a uso **individuale** a casa.

---

## 🚀 Come si usa (docente)
1. Apri la pagina web della PWA.
2. Nel **Menu** scegli il **Percorso** (Mix guidato / Addizioni / Sottrazioni / Tabelline / Geometria).
3. Premi **Inizia l’avventura**.
4. Gli alunni toccano la risposta: se è corretta, ottengono ⭐ e si avanza.
5. Il pulsante **Menu** riporta alla schermata iniziale per cambiare gioco in qualunque momento.
6. **Modalità LIM** (opzionale): testi e pulsanti più grandi per la proiezione in classe.

> Suggerimento: usa la modalità **Mix guidato** per alternare automaticamente i quattro giochi.

---

## 🧩 Giochi inclusi (v4.1)
- **Addizioni con cambio**: es. `27 + 15 = ?`
- **Sottrazioni con prestito**: es. `52 - 19 = ?`
- **Tabelline 2/5/10**: es. `5 * 7 = ?`
- **Geometria base**: domande su triangolo, quadrato, cubo (lati/facce).

---

## 📱 PWA e modalità offline
- La PWA può essere **installata** (Android/Chrome, Desktop/Chrome/Edge).  
- Funziona **offline** grazie al **Service Worker**.
- Bottone **Aggiorna App**: cancella la cache e ricarica i file (utile dopo un aggiornamento).

> **iPhone/iPad**: apri la prima volta in **Safari** (anche in modalità privata), poi aggiungi a **Schermata Home**.

---

## 🛠️ Installazione sul proprio sito
1. Copia tutti i file della cartella nella directory del tuo hosting (es. `/CacciaAiNumeriPWA/`).
2. Assicurati che la struttura resti intatta (**manifest.json**, **service-worker.js**, cartella **icons/**).
3. Apri l’URL pubblico (es. `https://tuodominio.it/CacciaAiNumeriPWA/`).
4. Per aggiornare client già in cache clicca **Aggiorna App** o apri in finestra **privata**.

---

## 🔧 Risoluzione problemi (tipici su iPhone)
- **I pulsanti non rispondono**: ricarica in **finestra privata** di Safari; poi tocca **Aggiorna App**.
- **Vedo la versione vecchia**: la cache di Safari è aggressiva → usa **Aggiorna App**; se serve, chiudi tutte le schede e riapri.
- **Audio non parte**: i suoni vengono sbloccati dopo il **primo tap** dell’utente (regola autoplay di iOS).

---

## 🔒 Privacy
- Nessun tracciamento esterno, nessun backend.
- Eventuali dati locali (in futuro: report docente) sono salvati in **localStorage** sul dispositivo dell’utente.

---

## 🗺️ Roadmap (espansioni proposte)
- ⏱️ **Timer** grande per sfide a tempo (es. 60s).
- 🔔 **Suoni** (ding/buzzer) per feedback immediato.
- 📊 **Report docente**: log domande/risposte e punteggio per sessione (localStorage + esportazione CSV).
- 🌍 **Multilingua**: IT/EN/FR/DE.
- 🧠 **Nuovi moduli**: frazioni equivalenti, misura (monete/tempo), problemi a scelta multipla legati a contesti reali.

---

## 🧪 Come estendere (per sviluppatori)
- I giochi sono definiti in `app.js` come **generatori** che ritornano `{ name, prompt, choices, correct }`.
- Aggiungi un nuovo gioco creando una funzione del tipo:
  ```js
  function genMioGioco(){
    return function(){
      var domanda = "...";
      var scelte = [/* ... */];
      var corretta = 0; // indice della soluzione corretta
      return { name:"Titolo", prompt: domanda, choices: scelte, correct: corretta };
    };
  }
  ```
- Inserisci il generatore nel **percorso** desiderato:
  ```js
  routes.mix.push(genMioGioco());
  // oppure
  routes.add = [genAddCarry(), genMioGioco()];
  ```

---

## 👤 Crediti e licenza
- © 2025 **PezzaliAPP** — Prototipo educativo open per docenti e famiglie.
- Licenza: uso libero a fini didattici (citare la fonte).

