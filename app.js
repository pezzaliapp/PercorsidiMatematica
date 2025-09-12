// Percorsi di Matematica — v6.1 (clean build)
(function(){
  // ---------- ROUTE MAP (define first) ----------
  // Generators utils
  function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function choice(arr){return arr[rand(0,arr.length-1)];}
  function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

  // Basic math generators (reused)
  function genAddCarry(){ return function(){ var x=rand(10,90), y=rand(10,90), r=x+y; var o=shuffle([r,r+1,r-1,r+10]); return {name:'Addizioni con cambio', prompt:x+' + '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genSubBorrow(){ return function(){ var x=rand(20,99), y=rand(10,19), r=x-y; var o=shuffle([r,r+1,r-1,r+10]); return {name:'Sottrazioni con prestito', prompt:x+' - '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genTablesBase(){ return function(){ var t=choice([2,5,10]), b=rand(1,10), r=t*b; var o=shuffle([r,r+t,r-t,r+rand(2,9)]); return {name:'Tabelline '+t, prompt:t+' × '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genPerimeterRect(){ return function(){ var w=rand(2,15), h=rand(2,15), r=2*(w+h); var o=shuffle([r,r+2,r-2,r+4]); return {name:'Perimetro rettangolo', prompt:'w='+w+', h='+h+' ⇒ P = ?', choices:o, correct:o.indexOf(r)};};}
  function genTablesFull(){ return function(){ var a=rand(2,10), b=rand(1,10), r=a*b; var o=shuffle([r,r+a,r-a,r+rand(2,9)]); return {name:'Tabelline '+a, prompt:a+' × '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genDivisionSimple(){ return function(){ var a=[2,3,4,5,6,7,8,9][rand(0,7)], b=rand(1,10), r=a*b; var q=r/a; var o=shuffle([q,q+1,q-1,q+2]); return {name:'Divisioni semplici', prompt:r+' ÷ '+a+' = ?', choices:o, correct:o.indexOf(q)};};}

  // --- Additional math generators (Primaria/Medie/Liceo) ---
  function genFractionsEq(){ return function(){ var n=rand(1,5), d=rand(2,9); if(n>=d){n=d-1;} var k=rand(2,5); var r=(n*k)+'/'+(d*k);
    var o=shuffle([r,(n*(k+1))+'/'+(d*(k+1)),(n*k+1)+'/'+(d*k),(n*k)+'/'+(d*k+1)]); return {name:'Frazioni equivalenti', prompt:'Equivalente di '+n+'/'+d+' ?', choices:o, correct:o.indexOf(r)};};}
  function genDecimalsSum10(){ return function(){ var a=(rand(10,95)/10).toFixed(1), b=(rand(10,95)/10).toFixed(1); var r=(parseFloat(a)+parseFloat(b)).toFixed(1);
    var o=shuffle([r,(+r+0.1).toFixed(1),(+r-0.1).toFixed(1),(+r+1).toFixed(1)]); return {name:'Decimali (somma)', prompt:a+' + '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genAreaRectTri(){ return function(){ if(Math.random()<0.5){ var b=rand(2,20), h=rand(2,20), r=b*h; var o=shuffle([r,r+2,r-2,r+4]); return {name:'Area rettangolo', prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; } else { var b=rand(2,20), h=rand(2,20), r=Math.round(0.5*b*h); var o=shuffle([r,r+1,r-1,r+2]); return {name:'Area triangolo', prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; } };}
  function genVolumeCuboid(){ return function(){ var w=rand(2,10), h=rand(2,10), l=rand(2,10), r=w*h*l; var o=shuffle([r,r+5,r-5,r+10]); return {name:'Volume parallelepipedo', prompt:'w='+w+', h='+h+', l='+l+' ⇒ V = ?', choices:o, correct:o.indexOf(r)};};}
  function genProportionFill(){ return function(){ var a=rand(2,12), b=a*rand(2,9), k=rand(2,9); var c=k, d=k*a; var o=shuffle([d,d+1,d-1,d+2]); return {name:'Proporzioni semplici', prompt:a+':'+b+' = '+c+': ?', choices:o, correct:o.indexOf(d)};};}
  // Medie
  function genEq1(){ return function(){ var a=rand(1,9), x=rand(1,12), b=rand(-9,9), c=a*x + b; var r=x; var o=shuffle([r,r+1,r-1,r+2]); return {name:'Equazione 1° grado', prompt:a+'x '+(b>=0?'+ '+b:b)+' = '+c+' ⇒ x = ?', choices:o, correct:o.indexOf(r)};};}
  function genPitagora(){ return function(){ var a=[3,5,6,8][rand(0,3)], b=[4,12,8,15][rand(0,3)]; var c=Math.round(Math.sqrt(a*a+b*b)); var o=shuffle([c,c+1,c-1,c+2]); return {name:'Teorema di Pitagora', prompt:'a='+a+', b='+b+' ⇒ c = ?', choices:o, correct:o.indexOf(c)};};}
  function genPercent(){ return function(){ var p=[10,12.5,20,25,30,50][rand(0,5)], n=rand(40,400); var r=Math.round(n*p/100); var o=shuffle([r,r+5,Math.max(0,r-5),r+10]); return {name:'Percentuale', prompt:p+'% di '+n+' = ?', choices:o, correct:o.indexOf(r)};};}
  // Liceo
  function genLinearFuncValue(){ return function(){ var m=rand(-5,5); if(m===0)m=1; var q=rand(-10,10), x=rand(-5,5); var r=m*x+q; var o=shuffle([r,r+1,r-1,r+2]); return {name:'f(x)=mx+q', prompt:'f(x)='+m+'x'+(q>=0?'+':'')+q+', x='+x+' ⇒ f(x)= ?', choices:o, correct:o.indexOf(r)};};}
  function genQuadraticRootsSimple(){ return function(){ var r1=rand(-5,5), r2=rand(-5,5); var b=-(r1+r2), c=r1*r2; var sum=r1+r2; var o=shuffle([sum,sum+1,sum-1,sum+2]); return {name:'Quadratica (somma radici)', prompt:'x² '+(b>=0?'+ ':'')+b+'x '+(c>=0?'+ ':'')+c+' = 0 ⇒ somma radici?', choices:o, correct:o.indexOf(sum)};};}
  function genTrigNotable(){ return function(){ var angles=[0,30,45,60,90], a=angles[rand(0,angles.length-1)], which=['sin','cos'][rand(0,1)];
    var exact={'sin0':'0','sin30':'1/2','sin45':'√2/2','sin60':'√3/2','sin90':'1','cos0':'1','cos30':'√3/2','cos45':'√2/2','cos60':'1/2','cos90':'0'}[which+String(a)];
    var opts=['0','1/2','√2/2','√3/2', exact]; var o=[]; while(opts.length){ o.push(opts.splice(rand(0,opts.length-1),1)[0]); }
    return {name:'Trigonometria', prompt: which+'('+a+'°) = ?', choices:o, correct:o.indexOf(exact)};};}

  // Informatica generators
  function genInfoMouseKeyboard(){ return function(){ var qs=[{p:'Quale dispositivo muove il puntatore?',a:'Mouse',o:['Mouse','Tastiera','Monitor','Stampante']},{p:'Quale tasto crea uno spazio?',a:'Barra spaziatrice',o:['Barra spaziatrice','Invio','Shift','Esc']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {name:'Informatica: mouse e tastiera',prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genInfoFiles(){ return function(){ var qs=[{p:'Quale è un\'immagine?',a:'.jpg',o:['.jpg','.docx','.pptx','.xlsx']},{p:'Una cartella può contenere…',a:'File e altre cartelle',o:['File e altre cartelle','Solo immagini','Solo testi','Solo programmi']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {name:'Informatica: file e cartelle',prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genInfoBlocks(){ return function(){ var qs=[{p:'"Ripeti 10 volte" è un…',a:'Ciclo (loop)',o:['Ciclo (loop)','Evento','Variabile','Immagine']},{p:'"Se … allora" serve per…',a:'Prendere decisioni',o:['Prendere decisioni','Disegnare','Salvare file','Aumentare il volume']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {name:'Informatica: coding a blocchi',prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genInfoNet(){ return function(){ var qs=[{p:'Un browser serve per…',a:'Navigare su internet',o:['Navigare su internet','Stampare','Disegnare','Presentazioni']},{p:'Una ricerca efficace richiede…',a:'Parole chiave',o:['Parole chiave','Emoji','Password','Screenshot']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {name:'Informatica: Internet e ricerca',prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}

  
  // --- Informatica (Medie) generators ---
  function genICTSearchOps(){ return function(){
    var qs=[
      {p:'Per cercare una frase esatta su Internet si usano…', a:'Le virgolette " "', o:['Le virgolette " "','Il cancelletto #','Le parentesi ()','L’asterisco *']},
      {p:'Quale operatore restringe la ricerca a entrambe le parole?', a:'AND', o:['AND','OR','NEAR','NOT']},
      {p:'Con quale operatore escludi un termine?', a:'-', o:['-','+','?','~']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: ricerca avanzata', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}
  function genICTSpreadsheet(){ return function(){
    var qs=[
      {p:'In un foglio di calcolo, A1 indica…', a:'Colonna A, riga 1', o:['Colonna A, riga 1','Area 1','Riga A, colonna 1','Foglio 1']},
      {p:'La funzione per sommare un intervallo è…', a:'=SOMMA()', o:['=SOMMA()','=MEDIA()','=SE()','=SOMMA.SE()']},
      {p:'Per la media di B1:B5 uso…', a:'=MEDIA(B1:B5)', o:['=MEDIA(B1:B5)','=SOMMA(B1:B5)','=MAX(B1:B5)','=VAL(B1:B5)']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: fogli di calcolo', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}
  function genICT2FA(){ return function(){
    var qs=[
      {p:'La “doppia autenticazione” (2FA) serve a…', a:'Aumentare la sicurezza dell’accesso', o:['Aumentare la sicurezza dell’accesso','Memorizzare password','Navigare più veloce','Bloccare la pubblicità']},
      {p:'Un esempio di 2FA è…', a:'Codice OTP via app/sms', o:['Codice OTP via app/sms','Indovinare una password','Scrivere in maiuscolo','Fare screenshot']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: sicurezza (2FA)', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}
  function genICTPrivacy(){ return function(){
    var qs=[
      {p:'Un dato personale è…', a:'Informazione che identifica una persona', o:['Informazione che identifica una persona','Qualsiasi numero','Un file grande','Un colore']},
      {p:'È buona norma condividere pubblicamente il codice fiscale?', a:'No', o:['No','Sì','Solo a scuola','Dipende dal social']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: dati e privacy', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}
  function genICTCopyright(){ return function(){
    var qs=[
      {p:'Per riutilizzare un’immagine è bene verificare…', a:'La licenza (es. Creative Commons)', o:['La licenza (es. Creative Commons)','Il numero di like','La risoluzione','Il colore dominante']},
      {p:'CC BY richiede di…', a:'Attribuire l’autore', o:['Attribuire l’autore','Pagare sempre','Non condividere','Usare solo offline']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: copyright e licenze', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}
  function genICTEmail(){ return function(){
    var qs=[
      {p:'“CC” in una email significa…', a:'Copia conoscenza', o:['Copia conoscenza','Contatto chiuso','Carattere comune','Codice controllato']},
      {p:'L’oggetto della mail serve a…', a:'Riassumere il contenuto', o:['Riassumere il contenuto','Mettere emoji','Nascondere il messaggio','Inserire link lunghi']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: email e netiquette', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}
  function genICTNetworks(){ return function(){
    var qs=[
      {p:'In un URL, “https” indica…', a:'Connessione cifrata', o:['Connessione cifrata','Download automatico','Sito lento','Errore di rete']},
      {p:'“www.esempio.it/pagina” — “pagina” è…', a:'Il percorso (path)', o:['Il percorso (path)','Il dominio','Il protocollo','La porta']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: reti e web', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}
  function genICTFlowchart(){ return function(){
    var qs=[
      {p:'Nel flowchart, il rombo rappresenta…', a:'Una decisione (condizione)', o:['Una decisione (condizione)','L’inizio/fine','Un processo','Un connettore']},
      {p:'Il simbolo ovale in un flowchart indica…', a:'Inizio/Fine', o:['Inizio/Fine','Ciclo','Dati','Errore']}
    ]; var q=qs[Math.floor(Math.random()*qs.length)]; var o=q.o.slice().sort(()=>Math.random()-0.5);
    return {name:'Informatica: algoritmi e flowchart', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}

  var routeMap = {
    primaria1: { name:'1ª primaria', paths:{
      'Addizioni con cambio (semplici)': [genAddCarry()],
      'Sottrazioni con prestito (semplici)': [genSubBorrow()],
      'Tabelline 2/5/10': [genTablesBase()],
      'Geometria: perimetro': [genPerimeterRect()],
      'Informatica: mouse e tastiera': [genInfoMouseKeyboard()]
    }},
    primaria2: { name:'2ª primaria', paths:{
      'Addizioni con cambio': [genAddCarry()],
      'Sottrazioni con prestito': [genSubBorrow()],
      'Tabelline 2/5/10': [genTablesBase()],
      'Geometria: perimetro': [genPerimeterRect()],
      'Informatica: file e cartelle': [genInfoFiles()]
    }},
    primaria3: { name:'3ª primaria', paths:{
      'Tabelline complete': [genTablesFull()],
      'Divisioni semplici': [genDivisionSimple()],
      'Informatica: coding a blocchi': [genInfoBlocks()],
      'Informatica: Internet e ricerca': [genInfoNet()]
    }},

    primaria4: { name:'4ª primaria', paths:{
      'Frazioni equivalenti': [genFractionsEq()],
      'Multipli/Divisori & Decimali': [genDecimalsSum10()],
      'Area (rettangolo/triangolo)': [genAreaRectTri()],
      'Proporzioni semplici': [genProportionFill()],
      'Informatica: Internet e ricerca': [genInfoNet()]
    }},
    primaria5: { name:'5ª primaria', paths:{
      'Percentuali': [genPercent()],
      'Proporzioni semplici': [genProportionFill()],
      'Volume parallelepipedo': [genVolumeCuboid()],
      'Decimali (somma)': [genDecimalsSum10()],
      'Informatica: sicurezza e file': [genInfoFiles()]
    }},
    media1: { name:'1ª media', paths:{
      'Equazioni di 1° grado': [genEq1()],
      'Percentuali': [genPercent()],
      'Pitagora': [genPitagora()]
      'Informatica: ricerca avanzata': [genICTSearchOps()],
      'Informatica: email e netiquette': [genICTEmail()],
      'Informatica: dati e privacy': [genICTPrivacy()],
      'Informatica: fogli di calcolo': [genICTSpreadsheet()],
    }},
    media2: { name:'2ª media', paths:{
      'Equazioni di 1° grado': [genEq1()],
      'Pitagora': [genPitagora()],
      'Percentuali': [genPercent()]
      'Informatica: reti e web': [genICTNetworks()],
      'Informatica: sicurezza (2FA)': [genICT2FA()],
      'Informatica: copyright e licenze': [genICTCopyright()],
      'Informatica: fogli di calcolo': [genICTSpreadsheet()],
    }},
    media3: { name:'3ª media', paths:{
      'Equazioni di 1° grado': [genEq1()],
      'Pitagora': [genPitagora()],
      'Percentuali': [genPercent()]
      'Informatica: algoritmi e flowchart': [genICTFlowchart()],
      'Informatica: ricerca avanzata': [genICTSearchOps()],
      'Informatica: sicurezza (2FA)': [genICT2FA()],
      'Informatica: reti e web': [genICTNetworks()],
    }},
    liceo1: { name:'1ª liceo', paths:{
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Equazioni di 1° grado': [genEq1()]
    }},
    liceo2: { name:'2ª liceo', paths:{
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Quadratica (somma radici)': [genQuadraticRootsSimple()]
    }},
    liceo3: { name:'3ª liceo', paths:{
      'Quadratica (somma radici)': [genQuadraticRootsSimple()],
      'Trigonometria (angoli notevoli)': [genTrigNotable()]
    }},
    liceo4: { name:'4ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()]
    }},
    liceo5: { name:'5ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'Quadratica (somma radici)': [genQuadraticRootsSimple()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()]
    }},

  };
  // Minimal sets for demo; altri anni possono essere aggiunti allo stesso modo.

  // ---------- UI/State ----------
  function $(id){return document.getElementById(id);}
  function show(id){$(id).classList.remove('hidden');}
  function hide(id){$(id).classList.add('hidden');}

  // Fill grade selector and paths
  function fillGradeSelector(){
    var g = $('livello'); if(!g) return;
    g.innerHTML = '';
    Object.keys(routeMap).forEach(function(key){
      var opt = document.createElement('option'); opt.value = key; opt.textContent = routeMap[key].name; g.appendChild(opt);
    });
    g.value = 'primaria2';
  }

  function populatePaths(){
    var g = $('livello'), p = $('percorso'); if(!g || !p) return;
    var key = g.value || 'primaria2';
    var info = routeMap[key] || routeMap['primaria2'];
    p.innerHTML = '';
    Object.keys(info.paths).forEach(function(name){
      var opt = document.createElement('option'); opt.value = name; opt.textContent = name; p.appendChild(opt);
    });
    if (!p.options.length) {
      // final fallback
      var def = routeMap['primaria2'];
      Object.keys(def.paths).forEach(function(name){
        var opt = document.createElement('option'); opt.value = name; opt.textContent = name; p.appendChild(opt);
      });
    }
  }

  var level=0, stars=0, done=0, total=8;
  var currentRoute=[genAddCarry()], currentPathName='', currentGradeKey='primaria2', currentQuestion=null;

  function startGame(){
    var g = $('livello'), p = $('percorso');
    currentGradeKey = g.value || 'primaria2';
    currentPathName = p.value;
    var info = routeMap[currentGradeKey];
    currentRoute = (info && info.paths[currentPathName]) ? info.paths[currentPathName] : [genAddCarry()];
    level=0; stars=0; done=0; total=8;
    hide('intro'); hide('howto'); hide('summary'); show('game');
    $('stars').textContent = stars; $('progress').textContent = done; $('total').textContent = total;
    $('levelName').textContent = currentPathName; $('gradeName').textContent = info.name;
    nextQuestion(true); window.scrollTo(0,0);
  }

  function nextQuestion(resetTitle){
    $('nextBtn').classList.add('hidden'); $('choices').innerHTML='';
    var gen = currentRoute[Math.min(level, currentRoute.length-1)];
    currentQuestion = gen();
    if (resetTitle) $('levelName').textContent = currentPathName;
    $('prompt').textContent = currentQuestion.prompt;
    currentQuestion.choices.forEach(function(c,idx){
      var btn = document.createElement('button'); btn.type='button'; btn.className='choice'; btn.textContent=String(c);
      btn.addEventListener('click', function(){ selectChoice(idx, btn); }, { once:true }); $('choices').appendChild(btn);
    });
  }

  function selectChoice(idx, el){
    var correct = idx === currentQuestion.correct;
    el.classList.add(correct ? 'correct' : 'wrong');
    document.querySelectorAll('.choice').forEach(function(n){ n.disabled = true; });
    if (correct){ stars+=1; done+=1; $('stars').textContent=stars; $('progress').textContent=done; }
    if (done >= total){ endGame(); } else {
      if (done % 2 === 0){ level = Math.min(level + 1, currentRoute.length - 1); }
      $('nextBtn').classList.remove('hidden'); window.scrollTo(0,0);
    }
  }

  function endGame(){
    hide('game'); show('summary');
    $('finalStars').textContent = stars.toFixed(1);
    $('feedback').textContent = (stars >= total*0.9) ? 'Ottimo lavoro!' : (stars >= total*0.6) ? 'Ben fatto! Continua ad allenarti.' : 'Buon inizio! Riprova.';
    window.scrollTo(0,0);
  }

  // ---------- Install prompt ----------
  var deferredPrompt=null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferredPrompt=e;
    var btn=$('installBtn'); if(btn){ btn.hidden=false; btn.onclick=function(){ try{ btn.hidden=true; deferredPrompt.prompt(); deferredPrompt=null; }catch(_){} }; }
  });

  // ---------- Service Worker (auto-update with notice) ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('service-worker.js').then(function(reg){
        reg.addEventListener('updatefound', function(){
          var nw=reg.installing; if(!nw) return;
          nw.addEventListener('statechange', function(){
            if (nw.state==='installed' && navigator.serviceWorker.controller){
              var n=$('updateNotice'); if(n) n.style.display='block';
              nw.postMessage({type:'SKIP_WAITING'});
            }
          });
        });
      });
    });
    var refreshing=false;
    navigator.serviceWorker.addEventListener('controllerchange', function(){
      if (refreshing) return; refreshing=true; window.location.reload();
    });
  }

  // ---------- UI wires ----------
  function $(id){return document.getElementById(id);}
  document.addEventListener('DOMContentLoaded', function(){
    // LIM
    $('limBtn').addEventListener('click', function(){
      document.body.classList.toggle('lim'); this.textContent = document.body.classList.contains('lim') ? 'LIM: ON' : 'Modalità LIM';
      $('statusBar').style.display = document.body.classList.contains('lim') ? 'block' : 'none';
    });
    $('updateBtn').addEventListener('click', function(){ if('caches' in window){ caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>location.reload(true)); } else { location.reload(true); } });

    // Selects
    fillGradeSelector();
    populatePaths();
    $('livello').addEventListener('change', populatePaths);
    $('refreshPathsBtn').addEventListener('click', populatePaths);

    // Buttons
    $('playBtn').addEventListener('click', startGame);
    $('howBtn').addEventListener('click', function(){ hide('intro'); show('howto'); });
    $('backIntro').addEventListener('click', function(){ hide('howto'); show('intro'); });
    $('menuBtn').addEventListener('click', function(){ hide('game'); show('intro'); window.scrollTo(0,0); });
    $('againBtn').addEventListener('click', startGame);
    $('homeBtn').addEventListener('click', function(){ hide('summary'); show('intro'); });
    $('skipBtn').addEventListener('click', function(){ stars=Math.max(0, stars-0.5); nextQuestion(false); });
    $('nextBtn').addEventListener('click', function(){ nextQuestion(false); });
  });

})();