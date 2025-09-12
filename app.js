// Percorsi di Matematica — PWA v5 (organizzata per anno con categorie)
(function(){
  // Install prompt
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    var btn = document.getElementById('installBtn');
    if (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function(){
        try { btn.hidden = true; deferredPrompt.prompt(); deferredPrompt = null; } catch (err) {}
      });
    }
  });

  // SW
  // --- Aggiornamento automatico ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            const confirmed = confirm("È disponibile una nuova versione dell'app. Vuoi aggiornare ora?");
            if (confirmed) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          }
        });
      });
    });
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      try{ populatePaths(); }catch(e){}; window.location.reload();
      refreshing = true;
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){ navigator.serviceWorker.register('service-worker.js'); });
  }

  // Helpers
  function $(id){return document.getElementById(id);}
  function show(id){$(id).classList.remove('hidden');}
  function hide(id){$(id).classList.add('hidden');}

  // LIM
  var limBtn = $('limBtn'), statusBar = $('statusBar'), updateBtn = $('updateBtn');
  function applyLIM(on){
    document.body.classList.toggle('lim', !!on);
    limBtn.textContent = on ? 'LIM: ON' : 'Modalità LIM';
    statusBar.style.display = on ? 'block' : 'none';
    try { localStorage.setItem('limMode', on? '1':'0'); } catch(e){}
  }
  limBtn.addEventListener('click', function(){ applyLIM(!document.body.classList.contains('lim')); });
  try { applyLIM(localStorage.getItem('limMode')==='1'); } catch(e){}

  if (updateBtn){
    updateBtn.addEventListener('click', function(){
      if ('caches' in window) {
        caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ return caches.delete(k); })); }).then(function(){ location.reload(true); });
      } else { location.reload(true); }
    });
  }

  // Utils
  function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function choice(arr){return arr[rand(0,arr.length-1)];}
  function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

  // ---------- GENERATORS (multiple choice) ----------
  // Primaria
  function genAdd20(){ return function(){ var x=rand(1,20), y=rand(1,20), r=x+y; var o=shuffle([r,r+1,r-1,r+2]); return {name:'Addizioni entro 20', prompt:x+' + '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genSub20(){ return function(){ var x=rand(5,20), y=rand(1,10), r=x-y; var o=shuffle([r,r+1,r-1,r+2]); return {name:'Sottrazioni entro 20', prompt:x+' - '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genCompare20(){ return function(){ var a=rand(1,20), b=rand(1,20); var ans = a>b?'>':(a<b?'<':'=');
    var o=shuffle(['>','<','=']); return {name:'Confronto numeri', prompt:a+' ? '+b, choices:o, correct:o.indexOf(ans)}; };}
  function genShapes1(){ return function(){ var qs=[{p:'Quanti lati ha un triangolo?',a:'3'},{p:'Quanti lati ha un quadrato?',a:'4'},{p:'È una figura chiusa?',a:'Sì'}];
    var q=qs[rand(0,qs.length-1)]; var o=shuffle([q.a,'2','5','No','Sì'].filter(function(x,i,arr){return arr.indexOf(x)===i;})); return {name:'Figure semplici', prompt:q.p, choices:o, correct:o.indexOf(q.a)}; };}

  function genAddCarry(){ return function(){ var x=rand(10,90), y=rand(10,90), r=x+y; var o=shuffle([r,r+1,r-1,r+10]); return {name:'Addizioni con cambio', prompt:x+' + '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genSubBorrow(){ return function(){ var x=rand(20,99), y=rand(10,19), r=x-y; var o=shuffle([r,r+1,r-1,r+10]); return {name:'Sottrazioni con prestito', prompt:x+' - '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genTablesBase(){ return function(){ var t=choice([2,5,10]), b=rand(1,10), r=t*b; var o=shuffle([r,r+t,r-t,r+rand(2,9)]); return {name:'Tabelline '+t, prompt:t+' × '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genPerimeterRect(){ return function(){ var w=rand(2,15), h=rand(2,15), r=2*(w+h); var o=shuffle([r,r+2,r-2,r+4]); return {name:'Perimetro rettangolo', prompt:'w='+w+', h='+h+' ⇒ P = ?', choices:o, correct:o.indexOf(r)};};}

  function genTablesFull(){ return function(){ var a=rand(2,10), b=rand(1,10), r=a*b; var o=shuffle([r,r+a,r-a,r+rand(2,9)]); return {name:'Tabelline '+a, prompt:a+' × '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genDivisionSimple(){ return function(){ var a=[2,3,4,5,6,7,8,9][rand(0,7)], b=rand(1,10), r=a*b; var q=r/a; var o=shuffle([q,q+1,q-1,q+2]); return {name:'Divisioni semplici', prompt:r+' ÷ '+a+' = ?', choices:o, correct:o.indexOf(q)};};}
  function genPerimeterMix(){ return function(){ var fig=choice(['quadrato','rettangolo','triangolo equil.']); if(fig==='quadrato'){ var l=rand(2,15), r=4*l; var o=shuffle([r,r+2,r-2,r+4]); return {name:'Perimetro quadrato', prompt:'lato='+l+' ⇒ P = ?', choices:o, correct:o.indexOf(r)}; } if(fig==='triangolo equil.'){ var l=rand(2,15), r=3*l; var o=shuffle([r,r+3,r-3,r+6]); return {name:'Perimetro triangolo equilatero', prompt:'lato='+l+' ⇒ P = ?', choices:o, correct:o.indexOf(r)};} return genPerimeterRect()(); };}
  function genWordMult(){ return function(){ var k=rand(2,9), n=rand(2,8), r=k*n; var o=shuffle([r,r+1,r-1,r+2]); return {name:'Problemi moltiplicativi', prompt:'Ho '+n+' sacchetti da '+k+' caramelle. Quante caramelle?', choices:o, correct:o.indexOf(r)};};}

  function genFractionsEq(){ return function(){ var n=rand(1,5), d=rand(2,9); if(n>=d){n=d-1;} var k=rand(2,5); var r=(n*k)+'/'+(d*k);
    var o=shuffle([r,(n*(k+1))+'/'+(d*(k+1)),(n*k+1)+'/'+(d*k),(n*k)+'/'+(d*k+1)]); return {name:'Frazioni equivalenti', prompt:'Equivalente di '+n+'/'+d+' ?', choices:o, correct:o.indexOf(r)};};}
  function genMultipliDivisori(){ return function(){ var n=rand(6,30); var m=choice([2,3,5]); var isMult = (n % m === 0) ? 'Sì' : 'No'; var o=shuffle(['Sì','No']); return {name:'Multipli e divisori', prompt:n+' è multiplo di '+m+' ?', choices:o, correct:o.indexOf(isMult)};};}
  function genDecimalsSum10(){ return function(){ var a=(rand(10,95)/10).toFixed(1), b=(rand(10,95)/10).toFixed(1); var r=(parseFloat(a)+parseFloat(b)).toFixed(1);
    var o=shuffle([r,(+r+0.1).toFixed(1),(+r-0.1).toFixed(1),(+r+1).toFixed(1)]); return {name:'Decimali (somma)', prompt:a+' + '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genAreaRectTri(){ return function(){ if(Math.random()<0.5){ var b=rand(2,20), h=rand(2,20), r=b*h; var o=shuffle([r,r+2,r-2,r+4]); return {name:'Area rettangolo', prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; } else { var b=rand(2,20), h=rand(2,20), r=Math.round(0.5*b*h); var o=shuffle([r,r+1,r-1,r+2]); return {name:'Area triangolo', prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; } };}

  function genPercSimple(){ return function(){ var p=choice([10,20,25,50]), n=rand(40,400); var r=Math.round(n*p/100); var o=shuffle([r,r+5,Math.max(0,r-5),r+10]); return {name:'Percentuali', prompt:p+'% di '+n+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genProportionFill(){ return function(){ var a=rand(2,12), b=a*rand(2,9), k=rand(2,9); var c=k, d=k*a; // a:b = c:?
    var o=shuffle([d,d+1,d-1,d+2]); return {name:'Proporzioni semplici', prompt:a+':'+b+' = '+c+': ?', choices:o, correct:o.indexOf(d)};};}
  function genVolumeCuboid(){ return function(){ var w=rand(2,10), h=rand(2,10), l=rand(2,10), r=w*h*l; var o=shuffle([r,r+5,r-5,r+10]); return {name:'Volume parallelepipedo', prompt:'w='+w+', h='+h+', l='+l+' ⇒ V = ?', choices:o, correct:o.indexOf(r)};};}
  function genMoneyTime(){ return function(){ var h=rand(1,3), m=choice([10,15,20,30,45]); var total=h*60+m; var o=shuffle([total,total+5,total-5,total+10]); return {name:'Tempo (minuti totali)', prompt:h+'h '+m+'min ⇒ ? min', choices:o, correct:o.indexOf(total)};};}

  // Medie
  function genEq1(){ return function(){ var a=rand(1,9), x=rand(1,12), b=rand(-9,9), c=a*x + b; var r=x; var o=shuffle([r,r+1,r-1,r+2]); return {name:'Equazione 1° grado', prompt:a+'x '+(b>=0?'+ '+b:b)+' = '+c+' ⇒ x = ?', choices:o, correct:o.indexOf(r)};};}
  function genPitagora(){ return function(){ var a=choice([3,5,6,8]), b=choice([4,12,8,15]); var c=Math.round(Math.sqrt(a*a+b*b)); var o=shuffle([c,c+1,c-1,c+2]); return {name:'Teorema di Pitagora', prompt:'a='+a+', b='+b+' ⇒ c = ?', choices:o, correct:o.indexOf(c)};};}
  function genPercent(){ return function(){ var p=choice([10,12.5,20,25,30,50]), n=rand(40,400); var r=Math.round(n*p/100); var o=shuffle([r,r+5,Math.max(0,r-5),r+10]); return {name:'Percentuale', prompt:p+'% di '+n+' = ?', choices:o, correct:o.indexOf(r)};};}

  // Liceo (semplici)
  function genLinearFuncValue(){ return function(){ var m=rand(-5,5); if(m===0)m=1; var q=rand(-10,10), x=rand(-5,5); var r=m*x+q; var o=shuffle([r,r+1,r-1,r+2]); return {name:'f(x)=mx+q', prompt:'f(x)='+m+'x'+(q>=0?'+':'')+q+', x='+x+' ⇒ f(x)= ?', choices:o, correct:o.indexOf(r)};};}
  function genQuadraticRootsSimple(){ return function(){ var r1=rand(-5,5), r2=rand(-5,5); var b=-(r1+r2), c=r1*r2; var sum=r1+r2; var o=shuffle([sum,sum+1,sum-1,sum+2]); return {name:'Quadratica (somma radici)', prompt:'x² '+(b>=0?'+ ':'')+b+'x '+(c>=0?'+ ':'')+c+' = 0 ⇒ somma radici?', choices:o, correct:o.indexOf(sum)};};}
  function genTrigNotable(){ return function(){ var angles=[0,30,45,60,90], a=choice(angles), which=choice(['sin','cos']); var exact={'sin0':'0','sin30':'1/2','sin45':'√2/2','sin60':'√3/2','sin90':'1','cos0':'1','cos30':'√3/2','cos45':'√2/2','cos60':'1/2','cos90':'0'}[which+String(a)]; var o=shuffle([exact,'0','1/2','√2/2','√3/2']); return {name:'Trigonometria', prompt: which+'('+a+'°) = ?', choices:o, correct:o.indexOf(exact)};};}

  
  // ---------- INFORMATICA (Primaria) ----------
  function genInfoMouseKeyboard(){
    return function(){
      var qs = [
        {p:'Quale dispositivo muove il puntatore sullo schermo?', a:'Mouse', o:['Mouse','Tastiera','Monitor','Stampante']},
        {p:'Quale tasto inserisce uno spazio tra le parole?', a:'Barra spaziatrice', o:['Barra spaziatrice','Invio','Shift','Esc']},
        {p:'Quale tasto va a capo in un testo?', a:'Invio', o:['Invio','Barra spaziatrice','Tab','Ctrl']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: mouse e tastiera', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoHWvsSW(){
    return function(){
      var items = [
        {p:'Che cos\'è "monitor"?', a:'Hardware', o:['Hardware','Software','Rete','Dati']},
        {p:'Che cos\'è "browser"?', a:'Software', o:['Software','Hardware','Password','Cartella']},
        {p:'Che cos\'è "tastiera"?', a:'Hardware', o:['Hardware','Software','Rete','File']}
      ];
      var q = items[Math.floor(Math.random()*items.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: hardware o software', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoSequenceUnplugged(){
    return function(){
      var qs = [
        {p:'Una sequenza di passi per risolvere un problema si chiama…', a:'Algoritmo', o:['Algoritmo','Password','Rete','Cartella']},
        {p:'Se un robot non esegue correttamente un passo, dobbiamo…', a:'Fare debug (correggere)', o:['Fare debug (correggere)','Spegnere internet','Cambiare monitor','Stampare']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: unplugged', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoAppsBase(){
    return function(){
      var qs = [
        {p:'Quale programma è adatto per fare presentazioni?', a:'Presentazioni', o:['Presentazioni','Videoscrittura','Foglio di calcolo','Editor di codice']},
        {p:'Per scrivere un testo uso…', a:'Videoscrittura', o:['Videoscrittura','Presentazioni','Browser','Editor foto']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: app educative', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoFiles(){
    return function(){
      var qs = [
        {p:'Quale di queste è un\'immagine?', a:'.jpg', o:['.jpg','.docx','.pptx','.xlsx']},
        {p:'Una cartella può contenere…', a:'File e altre cartelle', o:['File e altre cartelle','Solo immagini','Solo testi','Solo programmi']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: file e cartelle', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoNetiquette(){
    return function(){
      var qs = [
        {p:'Prima di usare una foto trovata online, è bene…', a:'Verificare diritti e attribuzione', o:['Verificare diritti e attribuzione','Condividerla subito','Modificarla e basta','Ignorare l\'autore']},
        {p:'È corretto condividere dati personali in pubblico?', a:'No', o:['No','Sì','Solo a volte','Dipende dalla foto']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: cittadinanza digitale', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoPassword(){
    return function(){
      var qs = [
        {p:'Quale password è più sicura?', a:'G7!m_4zQ', o:['G7!m_4zQ','123456','password','qwerty']},
        {p:'Una buona password dovrebbe essere…', a:'Lunga e con simboli/numeri', o:['Lunga e con simboli/numeri','Breve e semplice','Uguale per tutti i siti','Il tuo nome']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: sicurezza (password)', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoBlocks(){
    return function(){
      var qs = [
        {p:'Nel coding a blocchi, "ripeti 10 volte" è un…', a:'Ciclo (loop)', o:['Ciclo (loop)','Evento','Variabile','Immagine']},
        {p:'Un blocco "se … allora" serve per…', a:'Prendere decisioni (condizioni)', o:['Prendere decisioni (condizioni)','Disegnare','Salvare file','Aumentare il volume']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: coding a blocchi', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }
  function genInfoInternetBase(){
    return function(){
      var qs = [
        {p:'Un "browser" serve per…', a:'Navigare su internet', o:['Navigare su internet','Scrivere presentazioni','Stampare','Disegnare']},
        {p:'Una ricerca efficace online richiede…', a:'Parole chiave', o:['Parole chiave','Emoji','Password','Screenshot']}
      ];
      var q = qs[Math.floor(Math.random()*qs.length)];
      var opts = q.o.slice().sort(()=>Math.random()-0.5);
      return { name:'Informatica: Internet e ricerca', prompt:q.p, choices:opts, correct:opts.indexOf(q.a) };
    };
  }

  // ---------- ROUTE MAP (anno -> categorie -> [generators]) ----------
  var routeMap = {
    primaria1: {
      name: '1ª primaria',
      paths: {
        'Addizioni entro 20': [genAdd20()],
        'Sottrazioni entro 20': [genSub20()],
        'Confronto numeri': [genCompare20()],
        'Figure semplici': [genShapes1()]
      
        'Informatica: mouse e tastiera': [genInfoMouseKeyboard()],
        'Informatica: hardware o software': [genInfoHWvsSW()],
        'Informatica: unplugged (sequenze)': [genInfoSequenceUnplugged()],
        'Informatica: app educative': [genInfoAppsBase()],}
    },
    primaria2: {
      name: '2ª primaria',
      paths: {
        'Addizioni con cambio': [genAddCarry()],
        'Sottrazioni con prestito': [genSubBorrow()],
        'Tabelline 2/5/10': [genTablesBase()],
        'Geometria: perimetro': [genPerimeterRect()]
      
        'Informatica: file e cartelle': [genInfoFiles()],
        'Informatica: app educative': [genInfoAppsBase()],
        'Informatica: cittadinanza digitale': [genInfoNetiquette()],
        'Informatica: mouse e tastiera': [genInfoMouseKeyboard()],}
    },
    primaria3: {
      name: '3ª primaria',
      paths: {
        'Tabelline complete': [genTablesFull()],
        'Divisioni semplici': [genDivisionSimple()],
        'Perimetro figure': [genPerimeterMix()],
        'Problemi moltiplicativi': [genWordMult()]
      
        'Informatica: coding a blocchi': [genInfoBlocks()],
        'Informatica: unplugged (sequenze)': [genInfoSequenceUnplugged()],
        'Informatica: sicurezza (password)': [genInfoPassword()],
        'Informatica: file e cartelle': [genInfoFiles()],}
    },
    primaria4: {
      name: '4ª primaria',
      paths: {
        'Frazioni equivalenti': [genFractionsEq()],
        'Multipli e divisori': [genMultipliDivisori()],
        'Decimali (somma)': [genDecimalsSum10()],
        'Area rettangolo/triangolo': [genAreaRectTri()]
      
        'Informatica: Internet e ricerca': [genInfoInternetBase()],
        'Informatica: cittadinanza digitale': [genInfoNetiquette()],
        'Informatica: hardware o software': [genInfoHWvsSW()],
        'Informatica: coding a blocchi': [genInfoBlocks()],}
    },
    primaria5: {
      name: '5ª primaria',
      paths: {
        'Percentuali': [genPercSimple()],
        'Proporzioni semplici': [genProportionFill()],
        'Volume parallelepipedo': [genVolumeCuboid()],
        'Tempo e monete': [genMoneyTime()]
      
        'Informatica: Internet e ricerca': [genInfoInternetBase()],
        'Informatica: sicurezza (password)': [genInfoPassword()],
        'Informatica: cittadinanza digitale': [genInfoNetiquette()],
        'Informatica: file e cartelle': [genInfoFiles()],}
    },
    // Medie (bozza con 3 categorie standard)
    media1: { name:'1ª media', paths: {'Equazioni 1°': [genEq1()], 'Pitagora': [genPitagora()], 'Percentuali': [genPercent()]} },
    media2: { name:'2ª media', paths: {'Equazioni 1°': [genEq1()], 'Pitagora': [genPitagora()], 'Percentuali': [genPercent()]} },
    media3: { name:'3ª media', paths: {'Equazioni 1°': [genEq1()], 'Pitagora': [genPitagora()], 'Percentuali': [genPercent()]} },
    // Liceo (bozza)
    liceo1: { name:'1ª liceo', paths: {'f(x)=mx+q': [genLinearFuncValue()], 'Equazioni 1°': [genEq1()]} },
    liceo2: { name:'2ª liceo', paths: {'f(x)=mx+q': [genLinearFuncValue()], 'Quadratica (somma radici)': [genQuadraticRootsSimple()]} },
    liceo3: { name:'3ª liceo', paths: {'Quadratica (somma radici)': [genQuadraticRootsSimple()], 'Trigonometria': [genTrigNotable()]} },
    liceo4: { name:'4ª liceo', paths: {'Trigonometria': [genTrigNotable()], 'f(x)=mx+q': [genLinearFuncValue()]} },
    liceo5: { name:'5ª liceo', paths: {'Trigonometria': [genTrigNotable()], 'Quadratica (somma radici)': [genQuadraticRootsSimple()], 'f(x)=mx+q': [genLinearFuncValue()]} }
  };

  // ---------- STATE ----------
  var level=0, stars=0, done=0, total=8;
  var currentQuestion=null, currentRoute=[genAddCarry()], currentGradeKey='primaria2', currentPathName='Addizioni con cambio';

  
  // Populate percorso select based on grade (robust)
  function populatePaths(){
    var gradeSel = $('livello');
    var perSel = $('percorso');
    if (!perSel) return;
    var selGrade = (gradeSel && gradeSel.value) ? gradeSel.value : 'primaria2';
    var info = (typeof routeMap !== 'undefined' && routeMap[selGrade]) ? routeMap[selGrade] : routeMap['primaria2'];
    perSel.innerHTML = '';
    var first = null;
    if (info && info.paths){
      Object.keys(info.paths).forEach(function(k){
        var opt = document.createElement('option');
        opt.value = k;
        opt.textContent = k;
        perSel.appendChild(opt);
        if (!first) first = k;
      });
      if (first) perSel.value = first;
    }
    if ($('gradeName')) $('gradeName').textContent = (info && info.name) ? info.name : selGrade;
  }


  function startGame(){
    currentGradeKey = $('livello').value;
    currentPathName = $('percorso').value;
    var pathGenerators = routeMap[currentGradeKey].paths[currentPathName];
    currentRoute = pathGenerators && pathGenerators.length ? pathGenerators : [genAddCarry()];
    level=0; stars=0; done=0; total=8;
    hide('intro'); hide('howto'); hide('summary'); show('game');
    $('stars').textContent = stars;
    $('progress').textContent = done;
    $('total').textContent = total;
    $('levelName').textContent = currentPathName;
    $('gradeName').textContent = routeMap[currentGradeKey].name;
    nextQuestion(true);
    window.scrollTo(0,0);
  }

  function nextQuestion(resetTitle){
    $('nextBtn').classList.add('hidden');
    $('choices').innerHTML='';
    // If a path provides one generator, repeat it; if more, rotate by 'level'
    var gen = currentRoute[Math.min(level, currentRoute.length-1)];
    currentQuestion = gen();
    if (resetTitle) $('levelName').textContent = currentPathName;
    $('prompt').textContent = currentQuestion.prompt;
    for (var i=0;i<currentQuestion.choices.length;i++){
      (function(idx){
        var c = currentQuestion.choices[idx];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice';
        btn.textContent = String(c);
        btn.addEventListener('click', function(){ selectChoice(idx, btn); }, { once:true });
        $('choices').appendChild(btn);
      })(i);
    }
  }

  function selectChoice(idx, el){
    var correct = idx === currentQuestion.correct;
    el.classList.add(correct ? 'correct' : 'wrong');
    var nodes = document.querySelectorAll('.choice');
    for (var i=0;i<nodes.length;i++){ nodes[i].disabled = true; }
    if (correct){
      stars += 1; done += 1;
      $('stars').textContent = stars;
      $('progress').textContent = done;
    }
    if (done >= total){
      endGame();
    } else {
      if (done % 2 === 0){
        level = Math.min(level + 1, currentRoute.length - 1);
      }
      $('nextBtn').classList.remove('hidden');
      window.scrollTo(0,0);
    }
  }

  function endGame(){
    hide('game'); show('summary');
    $('finalStars').textContent = stars.toFixed(1);
    $('feedback').textContent = (stars >= total*0.9) ? 'Ottimo lavoro!' : (stars >= total*0.6) ? 'Ben fatto! Continua ad allenarti.' : 'Buon inizio! Riprova per migliorare.';
    window.scrollTo(0,0);
  }

  // Wire UI
  document.addEventListener('DOMContentLoaded', function(){
    try{ populatePaths(); }catch(e){}
    populatePaths();
    $('livello').addEventListener('change', populatePaths);
    $('menuBtn').addEventListener('click', function(){ hide('game'); show('intro'); window.scrollTo(0,0); });
    $('howBtn').addEventListener('click', function(){ hide('intro'); show('howto'); });
    $('backIntro').addEventListener('click', function(){ hide('howto'); show('intro'); });
    $('playBtn').addEventListener('click', startGame);
    $('againBtn').addEventListener('click', startGame);
    $('homeBtn').addEventListener('click', function(){ hide('summary'); show('intro'); });
    $('skipBtn').addEventListener('click', function(){ stars = Math.max(0, stars - 0.5); nextQuestion(false); });
    $('nextBtn').addEventListener('click', function(){ nextQuestion(false); });
  });
})();