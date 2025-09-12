# Percorsi di Matematica — PWA v5
Applicazione didattica **Progressive Web App** organizzata **per anno scolastico** con **categorie dedicate**, in linea con le **Indicazioni Nazionali** del Ministero dell’Istruzione.

---

## 🎯 Obiettivi
- **Scuola primaria (1ª–5ª):**
  - Ogni anno propone almeno **4 percorsi** specifici.
  - Progressione graduale dai numeri entro 20 fino a frazioni, decimali e percentuali.
- **Scuola secondaria di I grado (medie, 1ª–3ª):**
  - Equazioni di primo grado, teorema di Pitagora, percentuali e proporzioni.
- **Liceo scientifico (1ª–5ª):**
  - Funzioni lineari e quadratiche, radici, trigonometria su angoli notevoli.
  - Estendibile in futuro a logaritmi, limiti, derivate e integrali.

---

## 🧩 Percorsi inclusi

### Scuola primaria
- **1ª primaria:**  
  Addizioni entro 20 · Sottrazioni entro 20 · Confronto numeri · Figure semplici  

- **2ª primaria:**  
  Addizioni con cambio · Sottrazioni con prestito · Tabelline 2/5/10 · Geometria: perimetro  

- **3ª primaria:**  
  Tabelline complete · Divisioni semplici · Perimetro figure · Problemi moltiplicativi  

- **4ª primaria:**  
  Frazioni equivalenti · Multipli e divisori · Decimali (somma) · Area rettangolo/triangolo  

- **5ª primaria:**  
  Percentuali · Proporzioni · Volume parallelepipedo · Tempo e monete  

### Scuola secondaria di I grado
- **1ª media:** Equazioni di 1° grado · Teorema di Pitagora · Percentuali  
- **2ª media:** Equazioni di 1° grado · Teorema di Pitagora · Percentuali  
- **3ª media:** Equazioni di 1° grado · Teorema di Pitagora · Percentuali  

### Liceo scientifico
- **1ª liceo:** Funzioni lineari (f(x)=mx+q) · Equazioni di 1° grado  
- **2ª liceo:** Funzioni lineari · Equazioni quadratiche (radici)  
- **3ª liceo:** Equazioni quadratiche · Trigonometria (angoli notevoli)  
- **4ª liceo:** Trigonometria · Funzioni lineari  
- **5ª liceo:** Trigonometria · Equazioni quadratiche · Funzioni lineari  

---

## 📱 Utilizzo
1. Apri la pagina `index.html` dal tuo sito o hosting (es. GitHub Pages).  
2. Seleziona **Anno/Grado** e poi **Percorso**.  
3. Premi **Inizia l’avventura**.  
4. Usa la **Modalità LIM** per la proiezione in aula.  
5. Se serve aggiornare la cache, clicca su **Aggiorna App**.

---

## 🛠️ Estensione
Ogni percorso è definito in `app.js` dentro `routeMap`.  
Un generatore restituisce sempre un oggetto del tipo:

```js
{
  name: "Titolo",
  prompt: "Domanda",
  choices: [...],
  correct: 0
}

Per aggiungere nuovi esercizi:
	•	scrivi una funzione generatrice,
	•	inseriscila nel percorso corrispondente in routeMap.

⸻

🔒 Privacy
	•	Nessun backend, nessun tracciamento esterno.
	•	Eventuali dati futuri (es. report per il docente) sono salvati solo in localStorage sul dispositivo.

⸻

© 2025 PezzaliAPP — Uso libero a fini didattici.
