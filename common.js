/* PhatPanda TV dashboards — shared JS */
(function(){
  window.$ = s => document.querySelector(s);
  window.$$ = s => Array.from(document.querySelectorAll(s));
  window.esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  window.pad = n => String(n).padStart(2,'0');

  /* ---- 1280x720 stage auto-scale ---- */
  function scale(){
    const s=document.getElementById('stage');
    if(!s) return;
    const k=Math.min(innerWidth/1280, innerHeight/720);
    s.style.transform='scale('+k+')';
  }
  window.addEventListener('resize', scale);
  window.scaleStage = scale;

  /* ---- live clock ---- */
  window.startClock = function(){
    function tick(){
      const c=$('#clock'); if(!c) return;
      const n=new Date(); let h=n.getHours(), m=n.getMinutes();
      const ap=h>=12?'PM':'AM'; h=h%12||12;
      c.textContent=h+':'+pad(m)+' '+ap;
    }
    tick(); setInterval(tick,1000);
  };

  /* ---- count-up ---- */
  window.countUp = function(el, from, to, dur){
    from=Number(from)||0; to=Number(to)||0;
    if(from===to){el.textContent=Math.round(to).toLocaleString(); return;}
    const t0=performance.now();
    (function step(t){
      let k=Math.min(1,(t-t0)/dur); k=1-Math.pow(1-k,3);
      el.textContent = Math.round(from+(to-from)*k).toLocaleString();
      if(k<1) requestAnimationFrame(step);
    })(t0);
  };

  /* ---- confetti ---- */
  const CC=['#72BC44','#FFFFFF','#9bd96a','#FFC24B','#000000'];
  let parts=[], raf=null, cv=null, cx=null;
  function loop(){
    cx.clearRect(0,0,1280,720);
    parts.forEach(p=>{
      p.vy+=0.14; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr;
      if(p.y>440) p.life-=0.012;
      cx.save(); cx.globalAlpha=Math.max(0,p.life);
      cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle=p.c;
      cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.6); cx.restore();
    });
    parts=parts.filter(p=>p.life>0 && p.y<760);
    if(parts.length) raf=requestAnimationFrame(loop);
    else { raf=null; cx.clearRect(0,0,1280,720); }
  }
  window.confetti = function(n){
    if(!cv){cv=document.getElementById('confetti'); if(!cv) return; cx=cv.getContext('2d');
      cv.width=1280; cv.height=720;}
    for(let i=0;i<n;i++){
      parts.push({x:Math.random()*1280, y:-20-Math.random()*240,
        vx:(Math.random()-0.5)*6, vy:2+Math.random()*5,
        s:5+Math.random()*8, c:CC[(Math.random()*CC.length)|0],
        r:Math.random()*6, vr:(Math.random()-0.5)*0.4, life:1});
    }
    if(!raf) raf=requestAnimationFrame(loop);
  };

  /* ---- audio ---- */
  let actx=null;
  function ctx(){
    if(!actx){try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}
    if(actx&&actx.state==='suspended') actx.resume();
    return actx;
  }
  window.fanfare = function(){
    const a=ctx(); if(!a) return;
    const t0=a.currentTime;
    [523.25,659.25,783.99,1046.5].forEach((f,i)=>{
      const o=a.createOscillator(), g=a.createGain(), t=t0+i*0.13;
      o.type='triangle'; o.frequency.value=f;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.28,t+0.04);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.55);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+0.6);
    });
  };
  window.airhorn = function(){
    const a=ctx(); if(!a) return; const t0=a.currentTime;
    [196,294].forEach(f=>{
      const o=a.createOscillator(), g=a.createGain();
      o.type='sawtooth'; o.frequency.setValueAtTime(f,t0);
      o.frequency.linearRampToValueAtTime(f*0.85,t0+0.6);
      g.gain.setValueAtTime(0,t0);
      g.gain.linearRampToValueAtTime(0.18,t0+0.05);
      g.gain.setValueAtTime(0.18,t0+0.55);
      g.gain.exponentialRampToValueAtTime(0.001,t0+1.0);
      o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0+1.05);
    });
  };

  /* ---- celebration overlay ---- */
  window.celebrate = function(opts){
    const ov=document.getElementById('overlay'); if(!ov) return;
    document.getElementById('ov-icon').textContent = opts.icon || '\u{1F389}';
    document.getElementById('ov-tag').textContent = opts.tag || 'GREAT!';
    document.getElementById('ov-name').textContent = opts.name || '';
    document.getElementById('ov-sub').textContent = opts.sub || '';
    ov.classList.remove('hidden');
    confetti(opts.confetti || 160);
    if(opts.sound === 'horn') airhorn(); else if(opts.sound !== false) fanfare();
    setTimeout(()=>confetti(80), 800);
    setTimeout(()=>confetti(80), 1600);
    ov.onclick = ()=>ov.classList.add('hidden');
    setTimeout(()=>ov.classList.add('hidden'), opts.duration || 8000);
  };

  /* ---- audio unlock + hint ---- */
  function unlock(){
    ctx();
    const h=document.querySelector('.sound-hint'); if(h) h.classList.add('hidden');
  }
  document.addEventListener('click', unlock);
  document.addEventListener('keydown', unlock);

  /* ---- boot helpers ---- */
  window.bootStage = function(){ scale(); startClock(); };
})();
