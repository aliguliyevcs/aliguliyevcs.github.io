(function(){
  const html = document.documentElement;
  const themeBtn = () => document.querySelector('[data-action="theme"]');
  const langBtn = () => document.querySelector('[data-action="lang"]');

  // Restore prefs
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  const savedLang = localStorage.getItem("lang") || "az";

  function setTheme(next){
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    if(themeBtn()) themeBtn().textContent = next === "dark" ? "☀️ Light" : "🌙 Dark";
  }
  function toggleTheme(){
    const now = html.getAttribute("data-theme") === "dark" ? "light":"dark";
    setTheme(now);
  }
  function setLang(lang){
    localStorage.setItem("lang", lang);
    // Apply i18n
    const dict = (window.I18N && window.I18N[lang]) || {};
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      if(dict[key]) el.textContent = dict[key];
    });
    if(langBtn()) langBtn().textContent = lang === "az" ? "EN" : "AZ";
    document.querySelectorAll("[data-i18n-title]").forEach(el=>{
      const key = el.getAttribute("data-i18n-title");
      if(dict[key]) el.setAttribute("title", dict[key]);
    });
    document.title = dict["hero.title"] ? dict["hero.title"] + " · CV" : document.title;
  }
  function toggleLang(){
    const now = localStorage.getItem("lang") || savedLang;
    const next = now === "az" ? "en" : "az";
    setLang(next);
  }

  window.addEventListener("DOMContentLoaded", ()=>{
    setTheme(savedTheme);
    setLang(savedLang);
    if(themeBtn()) themeBtn().addEventListener("click", toggleTheme);
    if(langBtn()) langBtn().addEventListener("click", toggleLang);
  });
})();

// Typing effect for mission line (simple)
function typeLine(el, full){
  if(!el) return;
  el.textContent = "";
  let i=0;
  function step(){
    el.textContent = full.slice(0, i) + (i % 2 === 0 ? "" : "");
    i++;
    if(i<=full.length) requestAnimationFrame(step);
    else el.classList.add("caret");
  }
  step();
}

// Animated counters
function animateCounters(){
  const els = document.querySelectorAll(".num[data-count]");
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target; io.unobserve(el);
        const target = +el.getAttribute("data-count");
        let cur = 0;
        const dur = 1200, start = performance.now();
        function tick(t){
          const k = Math.min(1, (t-start)/dur);
          cur = Math.floor(target * (0.5 - Math.cos(Math.PI*k)/2));
          el.textContent = cur.toString();
          if(k<1) requestAnimationFrame(tick); else el.textContent = target;
        }
        requestAnimationFrame(tick);
      }
    });
  }, {threshold:0.4});
  els.forEach(el=>io.observe(el));
}

// Matrix rain
function startMatrix(){
  const c = document.getElementById("matrixCanvas");
  if(!c) return;
  const ctx = c.getContext("2d");
  function resize(){ c.width = c.clientWidth; c.height = c.clientHeight; cols = Math.floor(c.width/14); drops = Array(cols).fill(1); }
  let cols=0, drops=[];
  resize(); window.addEventListener("resize", resize);
  const glyphs = "01$#@*+-/\|";
  function draw(){
    const theme = document.documentElement.getAttribute("data-theme");
    ctx.fillStyle = theme === "dark" ? "rgba(11,15,16,0.1)" : "rgba(250,250,250,0.08)";
    ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle = theme === "dark" ? "#22c55e" : "#0891b2";
    ctx.font = "14px monospace";
    for(let i=0;i<drops.length;i++){
      const txt = glyphs[Math.floor(Math.random()*glyphs.length)];
      ctx.fillText(txt, i*14, drops[i]*18);
      if(drops[i]*18 > c.height && Math.random() > 0.975){ drops[i]=0; }
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Mailto sender
function sendMail(){
  const to = "aliq509@sabah.edu.az";
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg").value.trim();
  const subject = encodeURIComponent("CV Saytı | Yeni mesaj: " + name);
  const body = encodeURIComponent("Ad: " + name + "\nEmail: " + email + "\n\nMesaj:\n" + msg);
  window.location.href = "mailto:"+to+"?subject="+subject+"&body="+body;
}

window.addEventListener("DOMContentLoaded", ()=>{
  // typing target: the mission line (second <span> in terminal after cat mission.txt)
  const lines = document.querySelectorAll(".term-body span");
  if(lines && lines[3]){
    const text = lines[3].textContent;
    typeLine(lines[3], text);
  }
  animateCounters();
  startMatrix();
});


function copyID(id){
  navigator.clipboard.writeText(id).then(()=>{
    const prev = document.activeElement && document.activeElement.textContent;
    if(document.activeElement) {
      document.activeElement.textContent = "✓ Copied";
      setTimeout(()=>{ document.activeElement.textContent = "Copy ID"; }, 1200);
    }
  });
}
