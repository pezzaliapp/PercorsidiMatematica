// Caccia ai Numeri — PWA v5 (multi-livello, iPhone-friendly)
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
        try {
          btn.hidden = true;
          deferredPrompt.prompt();
          deferredPrompt = null;
        } catch (err) {}
      });
    }
  });

  // Service Worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('service-worker.js');
    });
  }

  // Shorthands
  function $(id){return document.getElementById(id);}
  function show(id){$(id).classList.remove('hidden');}
  function hide(id){$(id).classList.add('hidden');}

  // LIM
  var limBtn = $('limBtn'), statusBar = $('statusBar'), updateBtn = $('updateBtn');
  function applyLIM(on){
    document.body.classList.toggle('lim', !!on);
    limBtn.textContent = on ? 'LIM: ON' : 'Modalità LIM';
    statusBar.style.display = on ? 'block' : 'none';
    try { localStorage.setItem('limMode','' + (on?1:0)); } catch(e){}
  }
  limBtn.addEventListener('click', function(){ applyLIM(!document.body.classList.contains('lim')); });
  try { applyLIM(localStorage.getItem('limMode')==='1'); } catch(e){}

  // Update App button: clear caches and reload
  if (updateBtn){
    updateBtn.addEventListener('click', function(){
      if ('caches' in window) {
        caches.keys().then(function(keys){
          return Promise.all(keys.map(function(k){ return caches.delete(k); }));
        }).then(function(){ location.reload(true); });
      } else {
        location.reload(true);
      }
    });
  }

  // Random utils
  function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function choice(arr){return arr[rand(0,arr.length-1)];}
  function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

  // --------- GENERATORS (multiple choice) ---------
  // Primaria
  function genAdd20(){ // entro 20
    return function(){
      var x=rand(1,20), y=rand(1,20), res=x+y;
      var opts=shuffle([res,res+1,res-1,res+2]);
      return { name:'Addizioni entro 20', prompt: x+' + '+y+' = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genSub20(){
    return function(){
      var x=rand(5,20), y=rand(1,10), res=x-y;
      var opts=shuffle([res,res+1,res-1,res+2]);
      return { name:'Sottrazioni entro 20', prompt: x+' - '+y+' = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genAddCarry(){
    return function(){
      var x=rand(10,90), y=rand(10,90), res=x+y;
      var opts=shuffle([res,res+1,res-1,res+10]);
      return { name:'Addizioni con cambio', prompt: x+' + '+y+' = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genSubBorrow(){
    return function(){
      var x=rand(20,99), y=rand(10,19), res=x-y;
      var opts=shuffle([res,res+1,res-1,res+10]);
      return { name:'Sottrazioni con prestito', prompt: x+' - '+y+' = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genTablesFull(){
    return function(){
      var a=rand(2,10), b=rand(1,10), res=a*b;
      var opts=shuffle([res,res+a,res-a,res+rand(2,9)]);
      return { name:'Tabelline '+a, prompt: a+' × '+b+' = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genDivisionSimple(){
    return function(){
      var a=[2,3,4,5,6,7,8,9][rand(0,7)], b=rand(1,10), res=a*b;
      var q = res / a;
      var opts=shuffle([q,q+1,q-1,q+2]);
      return { name:'Divisioni semplici', prompt: (res+' ÷ '+a+' = ?'), choices:opts, correct:opts.indexOf(q) };
    };
  }
  function genFractionsEq(){
    return function(){
      var n=rand(1,5), d=rand(2,9); if(n>=d){n=d-1;}
      var k=rand(2,5);
      var res=(n*k)+'/'+(d*k);
      var opts=shuffle([res,(n*(k+1))+'/'+(d*(k+1)),(n*k+1)+'/'+(d*k),(n*k)+'/'+(d*k+1)]);
      return { name:'Frazioni equivalenti', prompt: 'Equivalente di '+n+'/'+d+' ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genDecimalsSum10(){
    return function(){
      var a=(rand(10,95)/10).toFixed(1), b=(rand(10,95)/10).toFixed(1);
      var res=(parseFloat(a)+parseFloat(b)).toFixed(1);
      var opts=shuffle([res,(parseFloat(res)+0.1).toFixed(1),(parseFloat(res)-0.1).toFixed(1),(parseFloat(res)+1).toFixed(1)]);
      return { name:'Decimali (somma)', prompt: a+' + '+b+' = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genPerimeterRect(){
    return function(){
      var w=rand(2,15), h=rand(2,15), res=2*(w+h);
      var opts=shuffle([res,res+2,res-2,res+4]);
      return { name:'Perimetro rettangolo', prompt: 'w='+w+', h='+h+' ⇒ P = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }

  // Medie
  function genEq1(){ // ax + b = c
    return function(){
      var a=rand(1,9), x=rand(1,12), b=rand(-9,9), c=a*x + b;
      var res=x;
      var opts=shuffle([res,res+1,res-1,res+2]);
      return { name:'Equazione 1° grado', prompt: a+'x '+(b>=0?'+ '+b:b)+' = '+c+' ⇒ x = ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genPitagora(){
    return function(){
      var a=[3,5,6,8][rand(0,3)], b=[4,12,8,15][rand(0,3)];
      var c=Math.round(Math.sqrt(a*a+b*b));
      var opts=shuffle([c,c+1,c-1,c+2]);
      return { name:'Teorema di Pitagora', prompt: 'a='+a+', b='+b+' ⇒ c = ?', choices:opts, correct:opts.indexOf(c) };
    };
  }
  function genPercent(){
    return function(){
      var p=[10,12.5,20,25,30,50][rand(0,5)], n=rand(40,400);
      var res=(n*p/100);
      var opts=shuffle([res, res+5, Math.max(0,res-5), res+10].map(function(v){return Math.round(v);}));
      return { name:'Percentuale', prompt: p+'% di '+n+' = ?', choices:opts, correct:opts.indexOf(Math.round(res)) };
    };
  }

  // Liceo
  function genLinearFuncValue(){
    return function(){
      var m=rand(-5,5); if(m===0)m=1;
      var q=rand(-10,10), x=rand(-5,5);
      var res=m*x+q;
      var opts=shuffle([res,res+1,res-1,res+2]);
      return { name:'f(x)=mx+q', prompt: 'f(x)='+m+'x'+(q>=0?'+':'')+q+',  x='+x+' ⇒ f(x)= ?', choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genQuadraticRootsSimple(){
    return function(){
      // Use a perfect-square discriminant for integer roots
      var r1=rand(-5,5), r2=rand(-5,5);
      var a=1, b=-(r1+r2), c=r1*r2;
      var text='x² '+(b>=0?'+ ':'')+b+'x '+(c>=0?'+ ':'')+c+' = 0  ⇒ somma radici?';
      var res = r1 + r2;
      var opts=shuffle([res,res+1,res-1,res+2]);
      return { name:'Quadratica (radici)', prompt: text, choices:opts, correct:opts.indexOf(res) };
    };
  }
  function genTrigNotable(){
    return function(){
      var angles=[0,30,45,60,90];
      var a=choice(angles);
      var which=choice(['sin','cos']);
      function val(angle,fn){
        var rad = angle*Math.PI/180;
        if(fn==='sin') return Math.sin(rad);
        return Math.cos(rad);
      }
      var res = val(a,which);
      // present results rounded with common exact values text
      var exact = {
        'sin0':'0','sin30':'1/2','sin45':'√2/2','sin60':'√3/2','sin90':'1',
        'cos0':'1','cos30':'√3/2','cos45':'√2/2','cos60':'1/2','cos90':'0'
      }[which+String(a)] || String(Math.round(res*100)/100);
      var optsText = shuffle([exact,'0','1/2','√2/2','√3/2']);
      return { name:'Trigonometria', prompt: which+'('+a+'°) = ?', choices:optsText, correct:optsText.indexOf(exact) };
    };
  }

  // --------- ROUTES by level ---------
  var routes = {
    primaria1: [genAdd20(), genSub20()],
    primaria2: [genAddCarry(), genSubBorrow(), genTablesFull(), genPerimeterRect()],
    primaria3: [genTablesFull(), genDivisionSimple(), genPerimeterRect()],
    primaria4: [genFractionsEq(), genDecimalsSum10(), genPerimeterRect()],
    primaria5: [genFractionsEq(), genDecimalsSum10(), genDivisionSimple()],

    media1: [genEq1(), genPercent(), genPitagora()],
    media2: [genEq1(), genPitagora(), genPercent()],
    media3: [genEq1(), genPitagora(), genPercent()],

    liceo1: [genLinearFuncValue(), genEq1()],
    liceo2: [genLinearFuncValue(), genQuadraticRootsSimple()],
    liceo3: [genQuadraticRootsSimple(), genTrigNotable()],
    liceo4: [genTrigNotable(), genLinearFuncValue()],
    liceo5: [genTrigNotable(), genQuadraticRootsSimple(), genLinearFuncValue()]
  };

  // State
  var level=0, stars=0, done=0, total=8;
  var currentQuestion=null, currentRoute=routes.primaria2;

  function startGame(){
    var sel = $('livello').value || 'primaria2';
    currentRoute = routes[sel] || routes.primaria2;
    level=0; stars=0; done=0; total=8;
    hide('intro'); hide('howto'); hide('summary'); show('game');
    $('stars').textContent = stars;
    $('progress').textContent = done;
    $('total').textContent = total;
    $('levelName').textContent = currentRoute[0]().name;
    nextQuestion(true);
    window.scrollTo(0,0);
  }

  function nextQuestion(resetTitle){
    $('nextBtn').classList.add('hidden');
    $('choices').innerHTML='';
    var gen = currentRoute[Math.min(level, currentRoute.length-1)];
    currentQuestion = gen();
    if (resetTitle) $('levelName').textContent = currentQuestion.name;
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
        $('levelName').textContent = currentRoute[level]().name;
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