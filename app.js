// v6.3 — deterministic initialization with Informatica (Primaria, Medie, Liceo)
(function(){
  // Helpers
  function $(id){ return document.getElementById(id); }
  function on(el, ev, fn){ if(el && el.addEventListener){ el.addEventListener(ev, fn); } }

  // Utils
  function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function choice(arr){return arr[rand(0,arr.length-1)];}
  function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

  // Generators (math)
  function genAddCarry(){ return function(){ var x=rand(10,90), y=rand(10,90), r=x+y; var o=shuffle([r,r+1,r-1,r+10]); return {prompt:x+' + '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genSubBorrow(){ return function(){ var x=rand(20,99), y=rand(10,19), r=x-y; var o=shuffle([r,r+1,r-1,r+10]); return {prompt:x+' - '+y+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genTablesBase(){ return function(){ var t=choice([2,5,10]), b=rand(1,10), r=t*b; var o=shuffle([r,r+t,r-t,r+rand(2,9)]); return {prompt:t+' × '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genPerimeterRect(){ return function(){ var w=rand(2,15), h=rand(2,15), r=2*(w+h); var o=shuffle([r,r+2,r-2,r+4]); return {prompt:'w='+w+', h='+h+' ⇒ P = ?', choices:o, correct:o.indexOf(r)};};}
  function genTablesFull(){ return function(){ var a=rand(2,10), b=rand(1,10), r=a*b; var o=shuffle([r,r+a,r-a,r+rand(2,9)]); return {prompt:a+' × '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genDivisionSimple(){ return function(){ var a=[2,3,4,5,6,7,8,9][rand(0,7)], b=rand(1,10), r=a*b; var q=r/a; var o=shuffle([q,q+1,q-1,q+2]); return {prompt:r+' ÷ '+a+' = ?', choices:o, correct:o.indexOf(q)};};}
  function genFractionsEq(){ return function(){ var n=rand(1,5), d=rand(2,9); if(n>=d){n=d-1;} var k=rand(2,5); var r=(n*k)+'/'+(d*k);
    var o=shuffle([r,(n*(k+1))+'/'+(d*(k+1)),(n*k+1)+'/'+(d*k),(n*k)+'/'+(d*k+1)]); return {prompt:'Equivalente di '+n+'/'+d+' ?', choices:o, correct:o.indexOf(r)};};}
  function genDecimalsSum10(){ return function(){ var a=(rand(10,95)/10).toFixed(1), b=(rand(10,95)/10).toFixed(1); var r=(parseFloat(a)+parseFloat(b)).toFixed(1);
    var o=shuffle([r,(+r+0.1).toFixed(1),(+r-0.1).toFixed(1),(+r+1).toFixed(1)]); return {prompt:a+' + '+b+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genAreaRectTri(){ return function(){ if(Math.random()<0.5){ var b=rand(2,20), h=rand(2,20), r=b*h; var o=shuffle([r,r+2,r-2,r+4]); return {prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; } else { var b=rand(2,20), h=rand(2,20), r=Math.round(0.5*b*h); var o=shuffle([r,r+1,r-1,r+2]); return {prompt:'b='+b+', h='+h+' ⇒ A = ?', choices:o, correct:o.indexOf(r)}; } };}
  function genVolumeCuboid(){ return function(){ var w=rand(2,10), h=rand(2,10), l=rand(2,10), r=w*h*l; var o=shuffle([r,r+5,r-5,r+10]); return {prompt:'w='+w+', h='+h+', l='+l+' ⇒ V = ?', choices:o, correct:o.indexOf(r)};};}
  function genProportionFill(){ return function(){ var a=rand(2,12), b=a*rand(2,9), k=rand(2,9); var c=k, d=k*a; var o=shuffle([d,d+1,d-1,d+2]); return {prompt:a+':'+b+' = '+c+': ?', choices:o, correct:o.indexOf(d)};};}
  function genEq1(){ return function(){ var a=rand(1,9), x=rand(1,12), b=rand(-9,9), c=a*x + b; var r=x; var o=shuffle([r,r+1,r-1,r+2]); return {prompt:a+'x '+(b>=0?'+ '+b:b)+' = '+c+' ⇒ x = ?', choices:o, correct:o.indexOf(r)};};}
  function genPitagora(){ return function(){ var a=[3,5,6,8][rand(0,3)], b=[4,12,8,15][rand(0,3)]; var c=Math.round(Math.sqrt(a*a+b*b)); var o=shuffle([c,c+1,c-1,c+2]); return {prompt:'a='+a+', b='+b+' ⇒ c = ?', choices:o, correct:o.indexOf(c)};};}
  function genPercent(){ return function(){ var p=[10,12.5,20,25,30,50][rand(0,5)], n=rand(40,400); var r=Math.round(n*p/100); var o=shuffle([r,r+5,Math.max(0,r-5),r+10]); return {prompt:p+'% di '+n+' = ?', choices:o, correct:o.indexOf(r)};};}
  function genLinearFuncValue(){ return function(){ var m=rand(-5,5); if(m===0)m=1; var q=rand(-10,10), x=rand(-5,5); var r=m*x+q; var o=shuffle([r,r+1,r-1,r+2]); return {prompt:'f(x)='+m+'x'+(q>=0?'+':'')+q+', x='+x+' ⇒ f(x)= ?', choices:o, correct:o.indexOf(r)};};}
  function genQuadraticRootsSimple(){ return function(){ var r1=rand(-5,5), r2=rand(-5,5); var sum=r1+r2; var o=shuffle([sum,sum+1,sum-1,sum+2]); return {prompt:'Somma delle radici di (x - '+r1+')(x - '+r2+') = 0 ?', choices:o, correct:o.indexOf(sum)};};}
  function genTrigNotable(){ return function(){ var angles=[0,30,45,60,90], a=angles[rand(0,angles.length-1)], which=['sin','cos'][rand(0,1)];
    var exact={'sin0':'0','sin30':'1/2','sin45':'√2/2','sin60':'√3/2','sin90':'1','cos0':'1','cos30':'√3/2','cos45':'√2/2','cos60':'1/2','cos90':'0'}[which+String(a)];
    var opts=['0','1/2','√2/2','√3/2', exact]; var o=[]; while(opts.length){ o.push(opts.splice(rand(0,opts.length-1),1)[0]); }
    return {prompt: which+'('+a+'°) = ?', choices:o, correct:o.indexOf(exact)};};}
  // Generators (informatica)
  function genInfoMouseKeyboard(){ return function(){ var qs=[{p:'Quale dispositivo muove il puntatore?',a:'Mouse',o:['Mouse','Tastiera','Monitor','Stampante']},{p:'Quale tasto crea uno spazio?',a:'Barra spaziatrice',o:['Barra spaziatrice','Invio','Shift','Esc']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genInfoFiles(){ return function(){ var qs=[{p:'Quale è un\\'immagine?',a:'.jpg',o:['.jpg','.docx','.pptx','.xlsx']},{p:'Una cartella può contenere…',a:'File e altre cartelle',o:['File e altre cartelle','Solo immagini','Solo testi','Solo programmi']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genInfoBlocks(){ return function(){ var qs=[{p:'\"Ripeti 10 volte\" è un…',a:'Ciclo (loop)',o:['Ciclo (loop)','Evento','Variabile','Immagine']},{p:'\"Se … allora\" serve per…',a:'Prendere decisioni',o:['Prendere decisioni','Disegnare','Salvare file','Aumentare il volume']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genInfoNet(){ return function(){ var qs=[{p:'Un browser serve per…',a:'Navigare su internet',o:['Navigare su internet','Stampare','Disegnare','Presentazioni']},{p:'Una ricerca efficace richiede…',a:'Parole chiave',o:['Parole chiave','Emoji','Password','Screenshot']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  // Informatica (Medie/Liceo)
  function genICTSearchOps(){ return function(){ var qs=[{p:'Per cercare una frase esatta si usano…',a:'Le virgolette \" \"',o:['Le virgolette \" \"','Il cancelletto #','Le parentesi ()','L’asterisco *']},{p:'Quale operatore esclude un termine?',a:'-',o:['-','+','?','~']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genICT2FA(){ return function(){ var qs=[{p:'La 2FA serve a…',a:'Aumentare la sicurezza',o:['Aumentare la sicurezza','Navigare più veloce','Bloccare pubblicità','Salvare password']}]; var q=qs[0]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genCS_OSvsSW(){ return function(){ var qs=[{p:'Il kernel appartiene a…',a:'Sistema operativo',o:['Sistema operativo','Applicazione','Firmware','Driver video']},{p:'Un driver è…',a:'Software che controlla l’hardware',o:['Software che controlla l’hardware','Una memoria di massa','Un tipo di processore','Una rete privata']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genCS_NetworksLiceo(){ return function(){ var qs=[{p:'HTTPS usa tipicamente la porta…',a:'443',o:['443','80','21','25']},{p:'Il DNS serve a…',a:'Risoluzione dei nomi in indirizzi IP',o:['Risoluzione dei nomi in indirizzi IP','Criptare i file','Comprimere immagini','Bilanciare il carico']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genCS_DBConcepts(){ return function(){ var qs=[{p:'In un database relazionale, una riga si chiama…',a:'Tupla/record',o:['Tupla/record','Chiave esterna','Indice','Vista']},{p:'La chiave primaria serve a…',a:'Identificare univocamente i record',o:['Identificare univocamente i record','Criptare i dati','Descrivere il dominio','Unire due tabelle']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genCS_AlgoComplex(){ return function(){ var qs=[{p:'Un algoritmo in O(n) ha complessità…',a:'Lineare',o:['Lineare','Costante','Quadratica','Esponenziale']},{p:'La “ricorsione” è…',a:'Una funzione che richiama se stessa',o:['Una funzione che richiama se stessa','Un tipo di variabile','Una tabella di database','Una rete privata']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}
  function genCS_SecurityAdv(){ return function(){ var qs=[{p:'Il phishing è…',a:'Tentativo di furto credenziali con messaggi ingannevoli',o:['Tentativo di furto credenziali con messaggi ingannevoli','Un backup online','Una firma digitale','Un firewall hardware']},{p:'L’autenticazione forte può includere…',a:'Biometria o token hardware',o:['Biometria o token hardware','Solo password breve','Cookie pubblicitari','Screenshot di conferma']}]; var q=qs[rand(0,qs.length-1)]; var o=q.o.slice(); shuffle(o); return {prompt:q.p,choices:o,correct:o.indexOf(q.a)};};}

  // Route map
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
      'Decimali (somma)': [genDecimalsSum10()],
      'Area (rettangolo/triangolo)': [genAreaRectTri()],
      'Proporzioni semplici': [genProportionFill()],
      'Informatica: Internet e ricerca': [genInfoNet()]
    }},
    primaria5: { name:'5ª primaria', paths:{
      'Percentuali': [genPercent()],
      'Proporzioni': [genProportionFill()],
      'Volume parallelepipedo': [genVolumeCuboid()],
      'Decimali (somma)': [genDecimalsSum10()],
      'Informatica: sicurezza e file': [genInfoFiles()]
    }},
    media1: { name:'1ª media', paths:{
      'Equazioni di 1° grado': [genEq1()],
      'Percentuali': [genPercent()],
      'Pitagora': [genPitagora()],
      'Informatica: ricerca avanzata': [genICTSearchOps()]
    }},
    media2: { name:'2ª media', paths:{
      'Equazioni di 1° grado': [genEq1()],
      'Pitagora': [genPitagora()],
      'Percentuali': [genPercent()],
      'Informatica: sicurezza (2FA)': [genICT2FA()]
    }},
    media3: { name:'3ª media', paths:{
      'Equazioni di 1° grado': [genEq1()],
      'Pitagora': [genPitagora()],
      'Percentuali': [genPercent()],
      'Informatica: ricerca avanzata': [genICTSearchOps()]
    }},
    liceo1: { name:'1ª liceo', paths:{
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Equazioni di 1° grado': [genEq1()],
      'Informatica: sistemi operativi e software': [genCS_OSvsSW()]
    }},
    liceo2: { name:'2ª liceo', paths:{
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Quadratica (somma radici)': [genQuadraticRootsSimple()],
      'Informatica: reti e protocolli': [genCS_NetworksLiceo()]
    }},
    liceo3: { name:'3ª liceo', paths:{
      'Quadratica (somma radici)': [genQuadraticRootsSimple()],
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'Informatica: basi di dati (concetti)': [genCS_DBConcepts()]
    }},
    liceo4: { name:'4ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Informatica: algoritmi e complessità (base)': [genCS_AlgoComplex()]
    }},
    liceo5: { name:'5ª liceo', paths:{
      'Trigonometria (angoli notevoli)': [genTrigNotable()],
      'Quadratica (somma radici)': [genQuadraticRootsSimple()],
      'f(x)=mx+q (valori)': [genLinearFuncValue()],
      'Informatica: sicurezza e privacy (avanzato)': [genCS_SecurityAdv()]
    }}
  };

  // Export for debugging and bootstrap
  try{ window.routeMap = routeMap; }catch(e){}

  // State
  var currentRoute=[], currentPathName='', currentGradeKey='primaria2', level=0, stars=0, done=0, total=8, currentQuestion=null;

  function populatePaths(){
    var g = $('livello'), p = $('percorso'); if(!g || !p) return;
    var key = g.value || 'primaria2'; var info = routeMap[key] || routeMap['primaria2'];
    p.innerHTML = '';
    Object.keys(info.paths).forEach(function(name){
      var opt = document.createElement('option'); opt.value = name; opt.textContent = name; p.appendChild(opt);
    });
    // default select first
    if (p.options.length) p.selectedIndex = 0;
  }

  function startGame(){
    var g = $('livello'), p = $('percorso'); if(!g||!p||!p.value) return;
    currentGradeKey = g.value; currentPathName = p.value;
    var info = routeMap[currentGradeKey];
    currentRoute = info.paths[currentPathName];
    level=0; stars=0; done=0; total=8;
    $('stars').textContent = stars; $('progress').textContent = done; $('total').textContent = total;
    $('levelName').textContent = currentPathName; $('gradeName').textContent = info.name;
    $('intro').classList.add('hidden'); $('summary').classList.add('hidden'); $('game').classList.remove('hidden');
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
    el.classList.add(correct ? 'correct' : 'wrong'); document.querySelectorAll('.choice').forEach(n=>n.disabled=true);
    if (correct){ stars+=1; done+=1; $('stars').textContent=stars; $('progress').textContent=done; }
    if (done >= total){ endGame(); } else { if (done % 2 === 0){ level = Math.min(level + 1, currentRoute.length - 1); } $('nextBtn').classList.remove('hidden'); }
  }
  function endGame(){
    $('game').classList.add('hidden'); $('summary').classList.remove('hidden');
    $('finalStars').textContent = stars.toFixed(1);
    $('feedback').textContent = (stars >= total*0.9) ? 'Ottimo lavoro!' : (stars >= total*0.6) ? 'Ben fatto! Continua ad allenarti.' : 'Buon inizio! Riprova.';
  }

  // Install prompt
  var deferredPrompt=null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferredPrompt=e; var btn=$('installBtn');
    if(btn){ btn.hidden=false; btn.onclick=function(){ try{ btn.hidden=true; deferredPrompt.prompt(); deferredPrompt=null; }catch(_){} }; }
  });

  // Service Worker auto-update
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
    var refreshing=false; navigator.serviceWorker.addEventListener('controllerchange', function(){ if(refreshing) return; refreshing=true; window.location.reload(); });
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', function(){
    // LIM
    on($('limBtn'),'click', function(){ document.body.classList.toggle('lim'); this.textContent = document.body.classList.contains('lim') ? 'LIM: ON' : 'Modalità LIM'; $('statusBar').style.display = document.body.classList.contains('lim') ? 'block' : 'none'; });
    on($('updateBtn'),'click', function(){ if('caches' in window){ caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>location.reload(true)); } else { location.reload(true); } });

    // Selects
    populatePaths(); // default uses selected 2ª primaria
    on($('livello'),'change', populatePaths);
    on($('refreshPathsBtn'),'click', populatePaths);

    // Buttons
    on($('playBtn'),'click', startGame);
    on($('howBtn'),'click', function(){ $('intro').classList.add('hidden'); $('howto').classList.remove('hidden'); });
    on($('backIntro'),'click', function(){ $('howto').classList.add('hidden'); $('intro').classList.remove('hidden'); });
    on($('menuBtn'),'click', function(){ $('game').classList.add('hidden'); $('intro').classList.remove('hidden'); });
    on($('againBtn'),'click', startGame);
    on($('homeBtn'),'click', function(){ $('summary').classList.add('hidden'); $('intro').classList.remove('hidden'); });
    on($('skipBtn'),'click', function(){ stars=Math.max(0, stars-0.5); nextQuestion(false); });
    on($('nextBtn'),'click', function(){ nextQuestion(false); });
  });

  // Expose funcs (debug/bootstrap)
  try{ window.populatePaths=populatePaths; }catch(e){}

})();