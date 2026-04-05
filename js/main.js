/* ── CURSOR ── */
const cur = document.getElementById("cur"), ring = document.getElementById("cur-ring");
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
(function t() {
  cur.style.left = mx + "px"; cur.style.top = my + "px";
  rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
  ring.style.left = rx + "px"; ring.style.top = ry + "px";
  requestAnimationFrame(t);
})();
document.querySelectorAll("a,button,.pi,.svc,.ab-fr, .st-card, .st-dot").forEach((el) => {
  el.addEventListener("mouseenter", () => document.body.classList.add("ch"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("ch"));
});

/* ── NAV ── */
const nv = document.getElementById("nav"), nul = document.getElementById("nul"), ntog = document.getElementById("ntog");
window.addEventListener("scroll", () => nv.classList.toggle("stuck", scrollY > 55));
ntog.addEventListener("click", () => nul.classList.toggle("open"));
nul.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nul.classList.remove("open")));

/* ── HERO SHADER (WITH MOUSE PARALLAX) ── */
(function () {
  const c = document.getElementById("hc"), gl = c.getContext("webgl2");
  if (!gl) return;
  const vs = `#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}`;
  const fs = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 R;
uniform float T;
uniform vec2 M;
#define FC gl_FragCoord.xy
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=0.,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*n(p);p*=2.*m;a*=.5;}return t;}
float cl(vec2 p){float d=1.,t=0.;for(float i=0.;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(){
  vec2 mouseOffset = (M / R - 0.5) * 0.4; 
  vec2 uv=(FC-.5*R)/min(R.x,R.y) + mouseOffset;
  vec2 st=uv*vec2(2.,1.);
  vec3 col=vec3(0.);
  float bg=cl(vec2(st.x+T*.28,-st.y));
  uv*=1.-.3*(sin(T*.14)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.38+.1*uv.x);
    float d=length(uv);
    vec3 w=cos(sin(i)*vec3(1.,.55,.08))+1.;
    col+=.0011/d*w;
    float b=n(i+uv+bg*1.73);
    col+=.0018*b/length(max(uv,vec2(b*uv.x*.02,uv.y)));
    col=mix(col,vec3(bg*.16,bg*.09,bg*.03),d);
  }
  col.r*=1.35 + (mouseOffset.x * 0.2); 
  col.g*=.82; col.b*=.48;
  O=vec4(col,1.);
}`;
  function ms(t, s) { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return sh; }
  const p = gl.createProgram(); gl.attachShader(p, ms(gl.VERTEX_SHADER, vs)); gl.attachShader(p, ms(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); gl.useProgram(p);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(p, "position"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(p, "R"), uT = gl.getUniformLocation(p, "T"), uM = gl.getUniformLocation(p, "M");
  function rz() { c.width = c.offsetWidth * Math.min(devicePixelRatio, 1.5); c.height = c.offsetHeight * Math.min(devicePixelRatio, 1.5); gl.viewport(0, 0, c.width, c.height); }
  rz(); window.addEventListener("resize", rz);
  const t0 = performance.now();
  (function lp(now) {
    gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, (now - t0) * 0.001); gl.uniform2f(uM, mx, my); 
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); requestAnimationFrame(lp);
  })(t0);
})();

/* ── PREMIUM AURORA SPOTLIGHT SHADER ── */
(function () {
  const vs = `#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}`;
  const fs = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 R;
uniform float T;
uniform vec3 C1; // Base Dark Background
uniform vec3 C2; // Primary Gold Orb
uniform vec3 C3; // Secondary Warm Orb
#define FC gl_FragCoord.xy

void main() {
  vec2 uv = FC / R;
  vec2 p = uv;
  p.x *= R.x / R.y;
  
  float time = T * 0.08; 
  
  // Plot 3 massive, slow-drifting coordinates
  vec2 pos1 = vec2(0.5 * (R.x/R.y) + sin(time) * 0.35, 0.5 + cos(time * 1.1) * 0.25);
  vec2 pos2 = vec2(0.5 * (R.x/R.y) + cos(time * 0.8) * 0.4, 0.5 + sin(time * 0.9) * 0.3);
  vec2 pos3 = vec2(0.5 * (R.x/R.y) + sin(time * 1.4) * 0.25, 0.5 + cos(time * 0.6) * 0.4);
  
  // Generate ultra-soft, massive radial gradients
  float orb1 = smoothstep(1.3, 0.0, length(p - pos1));
  float orb2 = smoothstep(1.6, 0.0, length(p - pos2));
  float orb3 = smoothstep(1.1, 0.0, length(p - pos3));
  
  // Paint the canvas
  vec3 color = C1;
  color += C2 * orb1 * 0.45; 
  color += C3 * orb2 * 0.35; 
  color += mix(C2, C3, 0.5) * orb3 * 0.25; 
  
  O = vec4(color, 1.0);
}`;

  const CFG = {
    about:    { C1: [0.03, 0.03, 0.04], C2: [0.45, 0.35, 0.15], C3: [0.25, 0.18, 0.08] },
    services: { C1: [0.02, 0.02, 0.02], C2: [0.35, 0.25, 0.10], C3: [0.20, 0.15, 0.05] },
    portfolio:{ C1: [0.03, 0.04, 0.04], C2: [0.45, 0.35, 0.15], C3: [0.30, 0.20, 0.10] },
    process:  { C1: [0.02, 0.02, 0.03], C2: [0.40, 0.30, 0.12], C3: [0.25, 0.15, 0.05] },
    reel:     { C1: [0.08, 0.02, 0.02], C2: [0.50, 0.35, 0.15], C3: [0.35, 0.15, 0.10] },
    contact:  { C1: [0.03, 0.03, 0.04], C2: [0.45, 0.35, 0.15], C3: [0.25, 0.18, 0.08] },
  };

  document.querySelectorAll(".sc").forEach((cv) => {
    const key = cv.dataset.s, cfg = CFG[key];
    if (!cfg) return;
    const gl = cv.getContext("webgl2");
    if (!gl) return;
    function ms(t, s) { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return sh; }
    const p = gl.createProgram(); gl.attachShader(p, ms(gl.VERTEX_SHADER, vs)); gl.attachShader(p, ms(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); gl.useProgram(p);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(p, "position"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3fv(gl.getUniformLocation(p, "C1"), cfg.C1); gl.uniform3fv(gl.getUniformLocation(p, "C2"), cfg.C2); gl.uniform3fv(gl.getUniformLocation(p, "C3"), cfg.C3);
    const uR = gl.getUniformLocation(p, "R"), uT = gl.getUniformLocation(p, "T");
    const par = cv.parentElement;
    function rz() { const dpr = Math.min(devicePixelRatio, 1.0); cv.width = par.offsetWidth * dpr; cv.height = par.offsetHeight * dpr; gl.viewport(0, 0, cv.width, cv.height); }
    rz(); window.addEventListener("resize", rz);
    const t0 = performance.now(); let run = false, raf = null;
    function lp(now) { gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, (now - t0) * 0.001); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); raf = requestAnimationFrame(lp); }
    new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !run) { run = true; raf = requestAnimationFrame(lp); } 
        else if (!e.isIntersecting && run) { run = false; cancelAnimationFrame(raf); }
      });
    }, { threshold: 0.01 }).observe(par);
  });
})();

/* ── REVEAL ── */
new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("v"); }); }, { threshold: 0.1 }).observe || (() => {})();
const ro = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("v"); }); }, { threshold: 0.1 });
document.querySelectorAll(".r,.kpi").forEach((el) => ro.observe(el));

/* ── PORTFOLIO FILTER ── */
document.querySelectorAll(".pfb").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".pfb").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});

/* ── PHOTOGRAPHY VERTICAL STACK LOGIC (React/Framer Motion Clone) ── */
const photoImages = [
  "assets/images/photography/1.jpeg",
  "assets/images/photography/2.jpeg",
  "assets/images/photography/3.jpeg",
  "assets/images/photography/4.jpeg",
  "assets/images/photography/5.jpeg",
  "assets/images/photography/6.jpeg"
];

const modal = document.getElementById("photo-modal");
const closeBtn = document.getElementById("pm-close");
const photoExploreBtn = document.getElementById("btn-photo-explore");
const stackContainer = document.getElementById("stack-container");
const stackNav = document.getElementById("stack-nav");
const stCurr = document.getElementById("st-curr");
const stTot = document.getElementById("st-tot");

let currentIndex = 0;
let lastNavTime = 0;
const navCooldown = 400; // ms

// Init UI
if(stTot) stTot.textContent = String(photoImages.length).padStart(2, "0");

photoImages.forEach((src, i) => {
  const card = document.createElement("div");
  card.className = "st-card";
  card.style.backgroundImage = `url(${src})`;
  card.draggable = false; // Prevent default image dragging
  stackContainer.appendChild(card);

  const dot = document.createElement("button");
  dot.className = "st-dot";
  dot.setAttribute("aria-label", `Go to image ${i + 1}`);
  dot.addEventListener("click", () => {
    if (i !== currentIndex) {
      currentIndex = i;
      updateStack();
    }
  });
  stackNav.appendChild(dot);
});

const cards = document.querySelectorAll(".st-card");
const dots = document.querySelectorAll(".st-dot");

function updateStack() {
  stCurr.textContent = String(currentIndex + 1).padStart(2, "0");

  cards.forEach((card, i) => {
    const total = photoImages.length;
    let diff = i - currentIndex;
    
    // Circular logic
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    let y = 0, scale = 1, opacity = 1, zIndex = 5, rotateX = 0;

    // The exact math from the React component
    if (diff === 0) {
      y = 0; scale = 1; opacity = 1; zIndex = 5; rotateX = 0;
      card.classList.add('is-current');
    } else if (diff === -1) {
      y = -160; scale = 0.82; opacity = 0.6; zIndex = 4; rotateX = 8;
      card.classList.remove('is-current');
    } else if (diff === -2) {
      y = -280; scale = 0.7; opacity = 0.3; zIndex = 3; rotateX = 15;
      card.classList.remove('is-current');
    } else if (diff === 1) {
      y = 160; scale = 0.82; opacity = 0.6; zIndex = 4; rotateX = -8;
      card.classList.remove('is-current');
    } else if (diff === 2) {
      y = 280; scale = 0.7; opacity = 0.3; zIndex = 3; rotateX = -15;
      card.classList.remove('is-current');
    } else {
      y = diff > 0 ? 400 : -400; scale = 0.6; opacity = 0; zIndex = 0; rotateX = diff > 0 ? -20 : 20;
      card.classList.remove('is-current');
    }

    card.style.transform = `translateY(${y}px) scale(${scale}) rotateX(${rotateX}deg)`;
    card.style.opacity = opacity;
    card.style.zIndex = zIndex;
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function navigateStack(direction) {
  const now = Date.now();
  if (now - lastNavTime < navCooldown) return;
  lastNavTime = now;

  if (direction > 0) {
    currentIndex = currentIndex === photoImages.length - 1 ? 0 : currentIndex + 1;
  } else {
    currentIndex = currentIndex === 0 ? photoImages.length - 1 : currentIndex - 1;
  }
  updateStack();
}

// 1. Mouse Wheel Support
if(modal) {
  modal.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > 30) {
      navigateStack(e.deltaY > 0 ? 1 : -1);
    }
  }, { passive: true });
}

// 2. Drag Support (Mimicking Framer Motion `drag="y"`)
let startY = 0;
let isDragging = false;

if(stackContainer) {
  stackContainer.addEventListener("pointerdown", (e) => {
    startY = e.clientY;
    isDragging = true;
  });
}

window.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  
  const deltaY = e.clientY - startY;
  const threshold = 50; // pixels to trigger swipe
  
  if (deltaY < -threshold) {
    navigateStack(1); // Swipe up -> next
  } else if (deltaY > threshold) {
    navigateStack(-1); // Swipe down -> prev
  }
});

// Modal Toggles
if(photoExploreBtn) {
  photoExploreBtn.addEventListener("click", () => {
    modal.classList.add("active");
    updateStack(); // Initialize first render
  });
}

if(closeBtn) {
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
}
/* ── CINEMATIC VIDEO EXPANSION LOGIC ── */
// Ensure you replace these URLs with your actual local paths (e.g., 'assets/videos/production.mp4')
const videoData = {
  production: {
    src: "https://videos.pexels.com/video-files/5752729/5752729-hd_1920_1080_30fps.mp4",
    left: "End-to-End", right: "Production"
  },
  commercial: {
    src: "https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4",
    left: "Commercial", right: "Campaigns"
  }
};

const vModal = document.getElementById("video-modal");
const vClose = document.getElementById("vm-close");
const vWrapper = document.getElementById("vm-wrapper");
const vVideo = document.getElementById("vm-video");
const vOverlay = document.getElementById("vm-overlay");
const vLeft = document.getElementById("vm-title-left");
const vRight = document.getElementById("vm-title-right");
const vTabs = document.querySelectorAll(".vm-tab");
const vHint = document.getElementById("vm-hint");
const vExploreBtns = document.querySelectorAll(".btn-video-explore");

let vProgress = 0; // 0 = minimized, 1 = full screen
let vActiveKey = "production";

function initVideoModal(key) {
  vActiveKey = key;
  const data = videoData[key];
  vVideo.src = data.src;
  vLeft.textContent = data.left;
  vRight.textContent = data.right;
  
  vTabs.forEach(t => {
    t.classList.toggle("active", t.dataset.target === key);
  });
  
  vProgress = 0;
  updateVideoLayout();
  vModal.classList.add("active");
}

function updateVideoLayout() {
  // Clamp progress between 0 and 1
  vProgress = Math.max(0, Math.min(vProgress, 1));
  
  const isMobile = window.innerWidth < 768;
  const baseW = isMobile ? 280 : 400;
  const baseH = isMobile ? 400 : 250;
  const maxW = window.innerWidth;
  const maxH = window.innerHeight;

  // Calculate current dimensions
  const curW = baseW + (maxW - baseW) * vProgress;
  const curH = baseH + (maxH - baseH) * vProgress;
  const curBr = 24 * (1 - vProgress); // Border radius goes to 0 at full screen

  vWrapper.style.width = `${curW}px`;
  vWrapper.style.height = `${curH}px`;
  vWrapper.style.borderRadius = `${curBr}px`;
  
  // Overlay fades away as it gets bigger
  vOverlay.style.opacity = 0.6 * (1 - vProgress);
  vHint.style.opacity = 1 - (vProgress * 3); // Fades out quickly

  // Text moves away based on progress
  const move = vProgress * (isMobile ? 120 : 80); // vw movement
  if(isMobile) {
    vLeft.style.transform = `translateY(-${move}vh)`;
    vRight.style.transform = `translateY(${move}vh)`;
  } else {
    vLeft.style.transform = `translateX(-${move}vw)`;
    vRight.style.transform = `translateX(${move}vw)`;
  }
  
  vLeft.style.opacity = Math.max(0, 1 - vProgress * 1.5);
  vRight.style.opacity = Math.max(0, 1 - vProgress * 1.5);
}

// 1. Open Modal Triggers
vExploreBtns.forEach(btn => {
  btn.addEventListener("click", () => initVideoModal(btn.dataset.vid));
});

// 2. Tab Switcher
vTabs.forEach(tab => {
  tab.addEventListener("click", () => initVideoModal(tab.dataset.target));
});

// 3. Scroll / Wheel Interaction
vModal.addEventListener("wheel", (e) => {
  // Increase progress based on scroll delta
  vProgress += e.deltaY * 0.0015; 
  updateVideoLayout();
}, { passive: true });

// 4. Touch / Drag Interaction
let vTouchStartY = 0;
vModal.addEventListener("touchstart", (e) => {
  vTouchStartY = e.touches[0].clientY;
}, { passive: true });

vModal.addEventListener("touchmove", (e) => {
  const touchY = e.touches[0].clientY;
  const deltaY = vTouchStartY - touchY;
  
  vProgress += deltaY * 0.003;
  updateVideoLayout();
  
  vTouchStartY = touchY;
}, { passive: true });

// 5. Close Trigger
vClose.addEventListener("click", () => {
  vModal.classList.remove("active");
  setTimeout(() => { vVideo.src = ""; }, 500); // clear memory
});