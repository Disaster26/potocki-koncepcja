/* menu mobilne */
(function(){
  const h=document.querySelector('.ham'),p=document.getElementById('panel'); if(!h||!p)return;
  const ustaw=o=>{h.setAttribute('aria-expanded',o);p.classList.toggle('otwarte',o);document.body.style.overflow=o?'hidden':''};
  h.addEventListener('click',()=>ustaw(h.getAttribute('aria-expanded')!=='true'));
  p.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>ustaw(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')ustaw(false)});
  matchMedia('(min-width:1081px)').addEventListener('change',e=>{if(e.matches)ustaw(false)});
})();

/* menu restauracji - przykladowe pozycje */
(function(){
  const box=document.getElementById('dania'); if(!box)return;
  const M={
    przystawki:[['Deska przekąsek dworskich','wędliny, pasztet, marynaty, pieczywo','42 zł','przekaski'],['Tatar wołowy','żółtko, ogórek, cebulka, grzanki','46 zł'],['Śledź w oleju','cebula, jabłko, ziemniak z koperkiem','28 zł'],['Pierogi z kaszanką','podsmażana cebula, jabłko','32 zł']],
    zupy:[['Żurek na zakwasie','biała kiełbasa, jajko, chrzan','22 zł'],['Rosół z kury','makaron domowy, natka','18 zł'],['Krem z pieczonej dyni','pestki, olej dyniowy','21 zł'],['Barszcz czerwony','pasztecik z mięsem','20 zł']],
    glowne:[['Schab po dworsku','pieczarki, ser, ziemniaki, surówka','52 zł'],['Polędwiczki w sosie kurkowym','kopytka, buraczki zasmażane','64 zł'],['Pierś z kaczki','modra kapusta, pyzy, sos wiśniowy','69 zł'],['Pstrąg z masłem ziołowym','ziemniaki, sałata z sosem','58 zł']],
    desery:[['Desery w pucharkach','tiramisu, panna cotta, sernik','19 zł','desery'],['Szarlotka na ciepło','lody waniliowe, bita śmietana','22 zł'],['Sernik baskijski','sos z owoców leśnych','21 zł'],['Kawa z ciastem dnia','kawa z ekspresu i ciasto','18 zł','kawa']],
    dzieci:[['Rosołek z makaronem','mała porcja','12 zł'],['Polędwiczki z kurczaka','frytki, surówka z marchewki','29 zł'],['Naleśniki z serem','sos owocowy','22 zł'],['Pierogi ruskie','mała porcja','19 zł']]
  };
  const rysuj=k=>{box.innerHTML=M[k].map(d=>'<div class="danie">'+(d[3]?'<img src="img/'+d[3]+'-800.webp" alt="'+d[0]+'" loading="lazy">':'<span class="bez">zdjęcie dania</span>')+'<div><h4>'+d[0]+'</h4><p>'+d[1]+'</p></div><span class="cena">'+d[2]+'</span></div>').join('')};
  const tabs=document.querySelectorAll('.zakladki button');
  tabs.forEach(b=>b.addEventListener('click',()=>{tabs.forEach(x=>x.setAttribute('aria-selected',x===b));rysuj(b.dataset.k)}));
  rysuj('przystawki');
})();

/* planer przyjecia */
(function(){
  const wyn=document.getElementById('wynik'),kal=document.getElementById('kal'),rg=document.getElementById('goscie'),gl=document.getElementById('gosc-l'); if(!wyn||!kal)return;
  const st={okazja:'Wesele',goscie:80,data:null};
  const dzis=new Date(); dzis.setHours(0,0,0,0);
  let mies=new Date(dzis.getFullYear(),dzis.getMonth(),1);
  /* przykladowe zajete terminy: wiekszosc sobot w sezonie + kilka dni */
  const zajety=d=>{const n=d.getDate(),w=d.getDay(),m=d.getMonth();return (w===6&&(n%3!==1||(m>=4&&m<=8)))||(n===12||n===23)};
  const MN=['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień'];
  const fmt=d=>d.getDate()+' '+['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'][d.getMonth()]+' '+d.getFullYear();
  function rysujKal(){
    const r=mies.getFullYear(),m=mies.getMonth(),dni=new Date(r,m+1,0).getDate(),start=(new Date(r,m,1).getDay()+6)%7;
    let h='<div class="kal-g"><button type="button" data-k="-1" aria-label="Poprzedni miesiąc">‹</button><b>'+MN[m]+' '+r+'</b><button type="button" data-k="1" aria-label="Następny miesiąc">›</button></div><div class="kal-s">'+['pn','wt','śr','cz','pt','sb','nd'].map(x=>'<span class="dn">'+x+'</span>').join('');
    for(let i=0;i<start;i++)h+='<span></span>';
    for(let n=1;n<=dni;n++){const d=new Date(r,m,n),prze=d<dzis,z=!prze&&zajety(d),w=st.data&&+st.data===+d;
      h+='<button type="button" data-d="'+n+'" class="'+(z?'zaj ':'')+(d.getDay()===6?'sob ':'')+(w?'wyb':'')+'"'+(prze?' disabled':'')+(z?' aria-disabled="true" title="termin zajęty"':'')+'>'+n+'</button>'}
    kal.innerHTML=h+'</div><div class="kal-leg"><span><i style="background:#16191f"></i>wybrany</span><span><i style="background:#e6dfd3"></i>zajęty (przekreślony)</span></div>';
  }
  kal.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.k){const nm=new Date(mies.getFullYear(),mies.getMonth()+ +b.dataset.k,1);if(nm<new Date(dzis.getFullYear(),dzis.getMonth(),1))return;mies=nm;rysujKal();return}
    const d=new Date(mies.getFullYear(),mies.getMonth(),+b.dataset.d);st.data=d;st.zaj=zajety(d);rysujKal();rysuj()});
  function rysuj(){
    const duza=st.goscie>40, sala=duza?['Sala bankietowa','sala'] : ['Sala kameralna','kameralna'];
    let stan=st.data?(st.zaj?'<span class="stan zaj">'+fmt(st.data)+' - termin zajęty, wybierz inny dzień</span>':'<span class="stan">'+fmt(st.data)+' - termin wolny</span>'):'<span class="stan" style="opacity:.75">Wybierz datę w kalendarzu</span>';
    wyn.innerHTML='<span class="w-t">Propozycja</span><h4>'+sala[0]+'</h4>'+stan+'<img src="img/'+sala[1]+'-800.webp" alt="'+sala[0]+'">'+
      '<ul class="podsum"><li><span>Okazja</span>'+st.okazja+'</li><li><span>Liczba gości</span>'+st.goscie+'</li><li><span>Noclegi dla gości</span>'+(st.okazja==='Wesele'||st.okazja==='Spotkanie firmowe'?'w pakiecie':'na życzenie')+'</li></ul>'+
      '<button type="button" class="btn btn-zloty" id="wyslij"'+(st.data&&!st.zaj?'':' disabled style="opacity:.55;cursor:not-allowed"')+'>Wyślij zapytanie o ten termin</button><p class="wyslano" id="wyslano"></p>';
  }
  wyn.addEventListener('click',e=>{if(e.target.id==='wyslij'&&st.data&&!st.zaj)document.getElementById('wyslano').textContent='Wizualizacja: w gotowej stronie zapytanie z tymi danymi trafi na recepcja@potockidwor.pl, a gość dostanie potwierdzenie.'});
  document.querySelectorAll('.chipy').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));st[g.dataset.p]=b.dataset.v;rysuj()}));
  rg.addEventListener('input',()=>{st.goscie=+rg.value;gl.textContent=rg.value;rysuj()});
  const f=document.querySelector('[data-firmowe]'); if(f)f.addEventListener('click',()=>{const b=document.querySelector('.chipy button[data-v="Spotkanie firmowe"]');if(b)b.click()});
  rysujKal();rysuj();
})();

/* mapa dojazdu */
(function(){
  const box=document.getElementById('mapa'); if(!box||!window.L)return;
  const ll=[50.6085,20.2364];
  const mapa=L.map(box,{scrollWheelZoom:false,tap:false}).setView(ll,13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapa);
  L.marker(ll,{icon:L.divIcon({className:'',html:'<div class="pin"></div>',iconSize:[22,22],iconAnchor:[11,22]})}).addTo(mapa).bindTooltip('Potocki Dwór',{direction:'top',offset:[0,-20],permanent:true});
})();

/* dolny pasek na telefonie dopiero po przewinieciu za przyciski z naglowka */
(function(){
  const m=document.querySelector('.mob'), t=document.querySelector('.hero-cta');
  if(!m)return; if(!t||!('IntersectionObserver' in window)){m.classList.add('widac');return}
  new IntersectionObserver(w=>w.forEach(x=>m.classList.toggle('widac',!x.isIntersecting&&x.boundingClientRect.top<0)),{threshold:0}).observe(t);
})();
