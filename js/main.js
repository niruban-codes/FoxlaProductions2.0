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
    src: "assets/videos/1.mp4", // Removed the ../
    left: "End-to-End", right: "Production"
  },
  commercial: {
    src: "assets/videos/2.mp4", // Removed the ../
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
  
  // Explicitly unmute and tell the browser to play
  vVideo.muted = false;
  vVideo.play().catch(e => console.log("Autoplay prevented:", e)); 
  
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
  
  // Starting dimensions (The small box)
  const baseW = isMobile ? 280 : 400;
  const baseH = isMobile ? 400 : 250;
  
  // ── NON-CROPPING FLOATING LIGHTBOX CALCULATION ──
  // Limit the max size to 85% of the screen on desktop (leaving a sleek margin)
  const margin = isMobile ? 0.95 : 0.85; 
  const availableW = window.innerWidth * margin;
  const availableH = window.innerHeight * margin;

  // Force a perfect 16:9 aspect ratio so the 1080p video never crops
  let maxW, maxH;
  if (availableW * (9 / 16) <= availableH) {
    maxW = availableW;
    maxH = availableW * (9 / 16);
  } else {
    maxH = availableH;
    maxW = availableH * (16 / 9);
  }

  // Calculate current dimensions based on scroll progress
  const curW = baseW + (maxW - baseW) * vProgress;
  const curH = baseH + (maxH - baseH) * vProgress;
  
  // Keep a slight rounded edge even when fully expanded for a premium feel
  const curBr = 24 - (12 * vProgress); 

  vWrapper.style.width = `${curW}px`;
  vWrapper.style.height = `${curH}px`;
  vWrapper.style.borderRadius = `${curBr}px`;
  
  // Overlay fades away as it gets bigger
  vOverlay.style.opacity = 0.6 * (1 - vProgress);
  vHint.style.opacity = 1 - (vProgress * 3); // Fades out quickly

  // Text splits and moves away
  const move = vProgress * (isMobile ? 120 : 80); 
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
/* ── 3D INFINITE GALLERY LOGIC (Images + Videos) ── */
function init3DGallery() {
  const container = document.getElementById("gallery-canvas-container");
  if (!container || !window.THREE) return;

  // 1. Setup Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 0;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // 2. Load Images & Videos (MIX AND MATCH HERE)
  // Just use your local paths. The code will automatically detect .mp4 files!
  // 2. Load Images & Videos
  // Make sure these paths exactly match your folder structure relative to index.html
  const mediaSources = [
    "assets/images/photography/1.jpeg",
    "assets/videos/1.mp4",
    "assets/images/photography/2.jpeg",
    "assets/videos/2.mp4",
    "assets/images/photography/3.jpeg",
    "assets/images/photography/4.jpeg",
    "assets/videos/3.mp4",
    "assets/images/photography/5.jpeg",
    "assets/images/photography/6.jpeg"
  ];

  const visibleCount = mediaSources.length; 
  const depthRange = 50;
  
  // Smart Texture Loader with Error Handling and CORS bypass
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous'); // Forces WebGL to accept the local file

  const textures = mediaSources.map(src => {
    if (src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm')) {
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous'; // Forces WebGL to accept the local video
      video.play().catch(e => console.log("Video autoplay blocked:", e));
      
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    } else {
      // Load image with error callback to help us debug
      return loader.load(
        src, 
        undefined, // onProgress
        function(err) { console.error("Error loading texture:", src, err); } // onError
      );
    }
  });

  // 3. Custom Physics & Blur Shaders
  const vShader = `
    uniform float scrollForce; uniform float time; uniform float isHovered;
    varying vec2 vUv;
    void main() {
      vUv = uv; vec3 pos = position;
      float curveIntensity = scrollForce * 0.3;
      float distanceFromCenter = length(pos.xy);
      float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
      
      float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
      float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
      float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
      
      float flagWave = 0.0;
      if (isHovered > 0.5) {
        float wavePhase = pos.x * 3.0 + time * 8.0;
        float dampening = smoothstep(-0.5, 0.5, pos.x);
        flagWave = sin(wavePhase) * 0.1 * dampening;
        flagWave += sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
      }
      
      pos.z -= (curve + clothEffect + flagWave);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fShader = `
    uniform sampler2D map; uniform float opacity; uniform float blurAmount; uniform float scrollForce;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(map, vUv);
      if (blurAmount > 0.0) {
        vec2 texelSize = 1.0 / vec2(800.0, 800.0);
        vec4 blurred = vec4(0.0); float total = 0.0;
        for (float x = -2.0; x <= 2.0; x += 1.0) {
          for (float y = -2.0; y <= 2.0; y += 1.0) {
            vec2 offset = vec2(x, y) * texelSize * blurAmount;
            float weight = 1.0 / (1.0 + length(vec2(x, y)));
            blurred += texture2D(map, vUv + offset) * weight; total += weight;
          }
        }
        color = blurred / total;
      }
      color.rgb += vec3(abs(scrollForce) * 0.005); 
      gl_FragColor = vec4(color.rgb, color.a * opacity);
    }
  `;

  // 4. Build 3D Meshes
  const materials = []; const meshes = []; const planesData = [];
  const geo = new THREE.PlaneGeometry(1, 1, 32, 32);

  for(let i=0; i < visibleCount; i++) {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        map: { value: null }, opacity: { value: 1.0 }, blurAmount: { value: 0.0 },
        scrollForce: { value: 0.0 }, time: { value: 0.0 }, isHovered: { value: 0.0 }
      },
      vertexShader: vShader, fragmentShader: fShader
    });
    materials.push(mat);
    const mesh = new THREE.Mesh(geo, mat); scene.add(mesh); meshes.push(mesh);

    const hAngle = (i * 2.618) % (Math.PI * 2);
    const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
    const x = (Math.sin(hAngle) * (i % 3) * 1.2 * 8) / 3;
    const y = (Math.cos(vAngle) * ((i + 1) % 4) * 0.8 * 8) / 4;

    planesData.push({
      index: i, z: ((depthRange / visibleCount) * i) % depthRange, imgIdx: i, x: x, y: y
    });
  }

 // 5. Scroll / Touch / Drag Controls
  let scrollVelocity = 0; let autoPlay = true; let lastInteraction = Date.now();

  // THE FIX: Allow natural page scrolling, but gently spin the gallery as they scroll past
  container.addEventListener('wheel', (e) => {
    // We removed e.preventDefault() and added { passive: true } so the page scrolls freely!
    scrollVelocity += e.deltaY * 0.004; 
    autoPlay = false; lastInteraction = Date.now();
  }, { passive: true });

  // Mobile Touch Controls
  let touchStartY = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY; autoPlay = false; lastInteraction = Date.now();
  }, { passive: true });
  
  container.addEventListener('touchmove', (e) => {
    scrollVelocity += (touchStartY - e.touches[0].clientY) * 0.05; touchStartY = e.touches[0].clientY;
  }, { passive: true });

  // Desktop Click & Drag Controls
  const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
  let isDragging = false; 
  let previousMouseY = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true; 
    previousMouseY = e.clientY; 
    autoPlay = false; 
    lastInteraction = Date.now();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    // Hover math for the cloth ripple effect
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Drag math to spin the gallery
    if (isDragging) {
      const deltaY = previousMouseY - e.clientY;
      scrollVelocity += deltaY * 0.05; // Drag sensitivity
      previousMouseY = e.clientY;
    }
  });

  // 6. Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.1);
    
    if (Date.now() - lastInteraction > 3000) autoPlay = true;
    if (autoPlay) scrollVelocity += 0.3 * delta;
    scrollVelocity *= 0.95; 

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);
    meshes.forEach(m => m.material.uniforms.isHovered.value = 0.0);
    if(intersects.length > 0) intersects[0].object.material.uniforms.isHovered.value = 1.0;

    planesData.forEach((plane, i) => {
      plane.z += scrollVelocity * delta * 10;
      
      if (plane.z >= depthRange) { plane.z -= depthRange; plane.imgIdx = (plane.imgIdx + 1) % mediaSources.length; } 
      else if (plane.z < 0) { plane.z += depthRange; plane.imgIdx = (plane.imgIdx - 1 + mediaSources.length) % mediaSources.length; }

      const mesh = meshes[i]; const mat = materials[i]; const tex = textures[plane.imgIdx];

      if(tex && tex.image) {
        mat.uniforms.map.value = tex;
        // Smart aspect ratio calculation for both Images and Videos
        const imgW = tex.image.videoWidth || tex.image.width || 1;
        const imgH = tex.image.videoHeight || tex.image.height || 1;
        const aspect = imgW / imgH;
        mesh.scale.set(aspect > 1 ? 2*aspect : 2, aspect > 1 ? 2 : 2/aspect, 1);
      } else {
        mesh.scale.set(3, 2, 1);
      }

      mesh.position.set(plane.x, plane.y, plane.z - (depthRange / 2));

      const nZ = plane.z / depthRange;
      let opacity = 1, blur = 0;

      if(nZ >= 0.05 && nZ <= 0.25) opacity = (nZ - 0.05) / 0.2;
      else if(nZ < 0.05) opacity = 0;
      else if(nZ >= 0.4 && nZ <= 0.43) opacity = 1 - ((nZ - 0.4) / 0.03);
      else if(nZ > 0.43) opacity = 0;

      if(nZ >= 0.0 && nZ <= 0.1) blur = 8.0 * (1 - (nZ / 0.1));
      else if(nZ < 0.0) blur = 8.0;
      else if(nZ >= 0.4 && nZ <= 0.43) blur = 8.0 * ((nZ - 0.4) / 0.03);
      else if(nZ > 0.43) blur = 8.0;

      mat.uniforms.opacity.value = Math.max(0, Math.min(1, opacity));
      mat.uniforms.blurAmount.value = Math.max(0, Math.min(8.0, blur));
      mat.uniforms.time.value = clock.getElapsedTime();
      mat.uniforms.scrollForce.value = scrollVelocity;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

setTimeout(init3DGallery, 500);