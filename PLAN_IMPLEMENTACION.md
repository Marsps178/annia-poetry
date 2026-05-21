# Plan de Implementación — Poemas para Ania
> Sitio estático para GitHub Pages con HTML + CSS + JS separados y poemas en Markdown

---

## Estructura de archivos final

```
poemas-ania/               ← carpeta raíz del repositorio
│
├── index.html             ← estructura base de la página
├── css/
│   └── style.css          ← todos los estilos
├── js/
│   └── main.js            ← lógica: leer markdown, construir el sitio, animaciones
├── data/
│   └── Ania_Poemas.md     ← el archivo markdown con todos los poemas
└── README.md              ← descripción del repo (opcional)
```

> **Clave:** `main.js` hace un `fetch('data/Ania_Poemas.md')`, parsea el markdown y construye el HTML dinámicamente. Así solo editas el `.md` para agregar o cambiar poemas — nunca tocas el HTML.

---

## Fase 1 — Crear la carpeta y los archivos vacíos

Crea la carpeta `poemas-ania/` en tu computadora. Dentro crea exactamente esta estructura:

```
poemas-ania/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── data/
    └── Ania_Poemas.md     ← copia aquí el archivo .md que ya tienes
```

**Acción:** Copia el archivo `Ania_Poemas.md` que ya generamos a la carpeta `data/`.

---

## Fase 2 — `index.html`

Este archivo solo tiene la estructura esqueleto. No contiene los poemas — esos los inyecta JavaScript.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Poemas para Ania</title>

  <!-- Google Fonts (CDN, sin instalar nada) -->
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@300;400&family=EB+Garamond:ital@0;1&display=swap" rel="stylesheet">

  <!-- Tu CSS -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Canvas para las estrellas animadas -->
  <canvas id="stars-canvas"></canvas>

  <!-- Botón menú móvil -->
  <button id="menu-toggle" aria-label="Abrir menú" onclick="toggleSidebar()">
    <span></span><span></span><span></span>
  </button>

  <!-- Barra lateral de navegación -->
  <nav id="sidebar">
    <div id="sidebar-header">
      <div id="sidebar-label">Colección</div>
      <div id="sidebar-title">Poemas para Ania</div>
    </div>
    <!-- Los links se generan aquí dinámicamente por JS -->
    <div id="sidebar-nav"></div>
  </nav>

  <!-- Contenido principal -->
  <main id="main">

    <!-- Pantalla de entrada (hero) -->
    <section id="hero">
      <div id="hero-ornament">✦ &nbsp; para ti &nbsp; ✦</div>
      <h1>Poemas<br>para Ania</h1>
      <div id="hero-divider"></div>
      <div id="hero-sub">Escritos con el corazón</div>
      <div id="hero-scroll" onclick="scrollToPoems()">
        <div class="scroll-line"></div>
        leer
      </div>
    </section>

    <!-- Aquí JS inyecta los poemas -->
    <section id="poems">
      <div id="loading">Cargando poemas…</div>
    </section>

    <!-- Cierre -->
    <footer id="closing">
      <div id="closing-glyph">✦</div>
      <p>Escritos para quedarse,<br>como tú te quedaste.</p>
    </footer>

  </main>

  <!-- Tu JS — va al final del body -->
  <script src="js/main.js"></script>

</body>
</html>
```

---

## Fase 3 — `css/style.css`

Copia y pega este CSS completo en `css/style.css`:

```css
/* ── Reset y variables ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold:       #c9a84c;
  --gold-dim:   #a07830;
  --gold-glow:  rgba(201,168,76,0.15);
  --white:      #f0ead8;
  --white-dim:  rgba(240,234,216,0.6);
  --white-faint:rgba(240,234,216,0.15);
  --bg:         #06050e;
  --sidebar-w:  280px;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 19px;
  line-height: 1.85;
  overflow-x: hidden;
}

/* ── Canvas estrellas ── */
#stars-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* ── Sidebar ── */
#sidebar {
  position: fixed;
  left: 0; top: 0; bottom: 0;
  width: var(--sidebar-w);
  background: rgba(6,5,14,0.92);
  border-right: 1px solid rgba(201,168,76,0.2);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(12px);
}

#sidebar-header {
  padding: 2.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(201,168,76,0.15);
  flex-shrink: 0;
}

#sidebar-label {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.9;
}

#sidebar-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 23px;
  font-weight: 300;
  color: var(--white);
  margin-top: 0.4rem;
  line-height: 1.3;
}

#sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(201,168,76,0.2) transparent;
}

#sidebar-nav::-webkit-scrollbar { width: 3px; }
#sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(201,168,76,0.25);
  border-radius: 2px;
}

/* ── Links de navegación ── */
.nav-item {
  display: block;
  padding: 0.55rem 1.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 15.5px;
  color: var(--white-dim);
  text-decoration: none;
  border-left: 2px solid transparent;
  cursor: pointer;
  line-height: 1.35;
  transition: all 0.25s ease;
}

.nav-item:hover {
  color: var(--gold);
  border-left-color: rgba(201,168,76,0.4);
  background: var(--gold-glow);
  padding-left: 1.8rem;
}

.nav-item.active {
  color: var(--gold);
  border-left-color: var(--gold);
  background: var(--gold-glow);
}

.nav-num {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.15em;
  opacity: 0.45;
  margin-right: 0.5rem;
}

/* ── Main ── */
#main {
  margin-left: var(--sidebar-w);
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

/* ── Hero ── */
#hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 3rem;
  position: relative;
}

#hero-ornament {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.5em;
  color: var(--gold);
  opacity: 0.7;
  text-transform: uppercase;
  margin-bottom: 2rem;
  animation: fadeInUp 1.2s ease both;
}

#hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 1.1;
  animation: fadeInUp 1.4s ease 0.2s both;
  text-shadow: 0 0 60px rgba(201,168,76,0.2);
}

#hero-divider {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  margin: 2rem auto;
  animation: fadeInUp 1.4s ease 0.4s both;
}

#hero-sub {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 0.4em;
  color: var(--gold);
  opacity: 0.65;
  animation: fadeInUp 1.4s ease 0.6s both;
}

#hero-scroll {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: fadeInUp 1.4s ease 1s both;
  color: var(--white-dim);
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.3em;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s;
}

#hero-scroll:hover { opacity: 0.9; }

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, var(--gold));
  animation: scrollPulse 2s ease-in-out infinite;
}

/* ── Poemas ── */
#poems {
  padding: 0 4rem 8rem;
  max-width: 780px;
}

#loading {
  padding: 4rem;
  color: var(--white-dim);
  font-style: italic;
  font-size: 16px;
  opacity: 0.5;
}

.poem-block {
  padding: 5rem 0;
  border-bottom: 1px solid rgba(201,168,76,0.08);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.poem-block.visible {
  opacity: 1;
  transform: translateY(0);
}

.poem-block:last-child { border-bottom: none; }

.poem-number {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.5em;
  color: var(--gold);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.poem-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 300;
  font-style: italic;
  color: var(--white);
  margin-bottom: 2.2rem;
  line-height: 1.2;
  padding-left: 1.2rem;
  border-left: 1.5px solid rgba(201,168,76,0.4);
}

.poem-body {
  color: var(--white-dim);
  font-size: 18px;
  line-height: 1.9;
}

.poem-body p { margin-bottom: 1.1rem; }
.poem-body p:last-child { margin-bottom: 0; }

/* Versos (líneas cortas en itálica) */
.verse-line {
  display: block;
  font-style: italic;
  color: rgba(240,234,216,0.55);
  line-height: 1.65;
}

.verse-stanza { margin-bottom: 1.5rem; }

/* ── Footer ── */
#closing {
  text-align: center;
  padding: 5rem 3rem 8rem;
  max-width: 500px;
  margin: 0 auto;
}

#closing-glyph {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  color: var(--gold);
  opacity: 0.4;
  margin-bottom: 1.5rem;
}

#closing p {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.1rem;
  color: var(--white-dim);
  letter-spacing: 0.05em;
}

/* ── Botón móvil ── */
#menu-toggle {
  display: none;
  position: fixed;
  top: 1.2rem; left: 1.2rem;
  z-index: 200;
  background: rgba(6,5,14,0.85);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 6px;
  width: 40px; height: 40px;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  backdrop-filter: blur(8px);
}

#menu-toggle span {
  display: block;
  width: 18px; height: 1px;
  background: var(--gold);
}

/* ── Animaciones ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
  50%       { opacity: 1;   transform: scaleY(1);   }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  :root { --sidebar-w: 260px; }

  #sidebar { transform: translateX(-100%); }
  #sidebar.open { transform: translateX(0); }

  #main { margin-left: 0; }
  #poems { padding: 0 1.8rem 6rem; }
  #hero  { padding: 5rem 2rem 4rem; }
  #menu-toggle { display: flex; }
}
```

---

## Fase 4 — `js/main.js`

Este archivo hace tres cosas:
1. **Fetch** del archivo `Ania_Poemas.md`
2. **Parsea** el markdown para extraer títulos y contenido de cada poema
3. **Construye** el HTML del sidebar y los bloques de poemas, y lanza las animaciones

```js
/* ════════════════════════════════════════════
   main.js — Poemas para Ania
   ════════════════════════════════════════════ */

// ── 1. CARGAR Y PARSEAR EL MARKDOWN ──────────

async function loadPoems() {
  try {
    const res = await fetch('data/Ania_Poemas.md');
    if (!res.ok) throw new Error('No se pudo cargar el archivo de poemas');
    const text = await res.text();
    const poems = parseMarkdown(text);
    buildSite(poems);
  } catch (err) {
    document.getElementById('loading').textContent =
      'Error al cargar los poemas. Verifica que el archivo data/Ania_Poemas.md existe.';
    console.error(err);
  }
}

// ── 2. PARSEAR MARKDOWN ───────────────────────
// Divide el archivo por los títulos ## y extrae el contenido de cada sección

function parseMarkdown(text) {
  // Separar por encabezados ##
  const sections = text.split(/^## /m).slice(1); // slice(1) omite el título principal (#)

  return sections.map(section => {
    const lines = section.trim().split('\n');
    const title = lines[0].trim();

    // Contenido: todo después del título, sin los separadores ---
    const rawContent = lines.slice(1).join('\n')
      .replace(/^---$/gm, '')  // quitar líneas separadoras
      .trim();

    // Detectar si el poema es en verso (líneas muy cortas) o prosa (párrafos largos)
    const paragraphs = rawContent.split(/\n\n+/).filter(p => p.trim());
    const avgLen = paragraphs.reduce((sum, p) => sum + p.length, 0) / (paragraphs.length || 1);
    const isVerse = avgLen < 120; // heurística: si los párrafos son cortos, es verso

    return { title, paragraphs, isVerse };
  }).filter(p => p.title); // filtrar entradas vacías
}

// ── 3. CONSTRUIR EL SITIO ─────────────────────

function buildSite(poems) {
  const nav = document.getElementById('sidebar-nav');
  const poemsSection = document.getElementById('poems');

  // Limpiar el mensaje de carga
  poemsSection.innerHTML = '';

  poems.forEach((poem, i) => {

    // — NAV ITEM —
    const navItem = document.createElement('button');
    navItem.className = 'nav-item';
    navItem.id = 'nav-' + i;
    navItem.innerHTML =
      `<span class="nav-num">${String(i + 1).padStart(2, '0')}</span>${poem.title}`;
    navItem.addEventListener('click', () => {
      document.getElementById('poem-' + i)
        .scrollIntoView({ behavior: 'smooth' });
      // cerrar sidebar en móvil
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
    nav.appendChild(navItem);

    // — BLOQUE DE POEMA —
    const block = document.createElement('article');
    block.className = 'poem-block';
    block.id = 'poem-' + i;

    // Construir el cuerpo según tipo
    let bodyHTML = '';
    if (poem.isVerse) {
      bodyHTML = poem.paragraphs.map(stanza => {
        const lines = stanza.trim().split('\n')
          .map(l => `<span class="verse-line">${l.trim()}</span>`)
          .join('');
        return `<div class="verse-stanza">${lines}</div>`;
      }).join('');
    } else {
      bodyHTML = poem.paragraphs.map(p =>
        `<p>${p.replace(/\n/g, ' ').trim()}</p>`
      ).join('');
    }

    block.innerHTML = `
      <div class="poem-number">${String(i + 1).padStart(2, '0')} / ${String(poems.length).padStart(2, '0')}</div>
      <h2 class="poem-title">${poem.title}</h2>
      <div class="poem-body">${bodyHTML}</div>
    `;

    poemsSection.appendChild(block);
  });

  // Actualizar el contador en el hero
  const sub = document.getElementById('hero-sub');
  if (sub) sub.textContent = `${poems.length} poemas · Escritos con el corazón`;

  // Iniciar observador para animaciones
  initScrollObserver();
}

// ── 4. ANIMACIÓN AL HACER SCROLL ─────────────

function initScrollObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      // Resaltar el nav item correspondiente
      const idx = entry.target.id.replace('poem-', '');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const navEl = document.getElementById('nav-' + idx);
      if (navEl) {
        navEl.classList.add('active');
        navEl.scrollIntoView({ block: 'nearest' });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  document.querySelectorAll('.poem-block').forEach(b => observer.observe(b));
}

// ── 5. ESTRELLAS ANIMADAS ─────────────────────

function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let frame = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 4500);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.008 + 0.003,
        phase: Math.random() * Math.PI * 2,
        gold:  Math.random() < 0.08
      });
    }
  }

  function spawnShootingStar() {
    shootingStars.push({
      x:     Math.random() * canvas.width * 0.7,
      y:     Math.random() * canvas.height * 0.4,
      len:   Math.random() * 120 + 60,
      speed: Math.random() * 8 + 5,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      life:  1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Estrella fugaz aleatoria
    if (frame % 220 === 0 && Math.random() < 0.6) spawnShootingStar();

    // Estrellas fijas
    stars.forEach(s => {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(frame * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? `rgba(201,168,76,${a * 0.8})`
        : `rgba(240,234,216,${a})`;
      ctx.fill();
    });

    // Estrellas fugaces
    shootingStars = shootingStars.filter(s => s.life > 0);
    shootingStars.forEach(s => {
      s.x    += Math.cos(s.angle) * s.speed;
      s.y    += Math.sin(s.angle) * s.speed;
      s.life -= 0.018;

      const grad = ctx.createLinearGradient(
        s.x, s.y,
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      grad.addColorStop(0, `rgba(255,245,210,${s.life})`);
      grad.addColorStop(1, 'rgba(255,245,210,0)');

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ── 6. SIDEBAR MÓVIL ──────────────────────────

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Scroll al primer poema desde el hero
function scrollToPoems() {
  const first = document.getElementById('poem-0');
  if (first) first.scrollIntoView({ behavior: 'smooth' });
}

// ── INICIAR TODO ──────────────────────────────
initStars();
loadPoems();
```

---

## Fase 5 — El archivo de poemas `data/Ania_Poemas.md`

El JavaScript lee este archivo y construye la página automáticamente. El formato que debe respetar:

```
# Poemas para Ania        ← título principal (se ignora al parsear)

---

## Título del poema 1     ← cada ## es un poema nuevo

Contenido del poema...

---

## Título del poema 2

Contenido del poema...
```

**Reglas simples:**
- Un `##` = un poema. El texto que sigue es el título.
- Separa párrafos con una línea en blanco.
- Las líneas `---` son decorativas, el parser las elimina.
- Para agregar un poema nuevo: agrega `## Nuevo título` al final y su contenido.

Ya tienes el archivo `Ania_Poemas.md` generado y listo. Solo muévelo a `data/`.

---

## Fase 6 — Subir a GitHub Pages

### Paso 1 — Crear el repositorio
1. Ve a [github.com](https://github.com) e inicia sesión
2. Clic en **"New repository"**
3. Nombre: `poemas-ania` (o el que quieras)
4. Visibilidad: **Public** (requerido para GitHub Pages gratis)
5. Clic en **"Create repository"**

### Paso 2 — Subir los archivos
En la página del repositorio vacío, clic en **"uploading an existing file"** y arrastra toda la carpeta `poemas-ania/` con esta estructura:

```
index.html
css/style.css
js/main.js
data/Ania_Poemas.md
```

Clic en **"Commit changes"**.

### Paso 3 — Activar GitHub Pages
1. Ve a **Settings** (en tu repositorio)
2. En el menú izquierdo: **Pages**
3. En "Source": selecciona **Deploy from a branch**
4. Branch: **main** — Folder: **/ (root)**
5. Clic en **Save**

Espera 1-2 minutos. La URL aparecerá en la misma página:

```
https://tu-usuario.github.io/poemas-ania/
```

---

## Fase 7 — Cómo agregar o editar poemas en el futuro

Para agregar un poema nuevo, **solo editas `data/Ania_Poemas.md`**:

```markdown
## Mi nuevo poema

Primera estrofa del poema,
puede ser en verso
o en prosa larga.

Segunda estrofa aquí.

---
```

Guardas el archivo, lo vuelves a subir a GitHub (reemplazando el anterior), y el sitio se actualiza automáticamente en minutos. No tienes que tocar ni el HTML, ni el CSS, ni el JS.

---

## Resumen de pasos

| Paso | Qué hacer | Archivo |
|------|-----------|---------|
| 1 | Crear la estructura de carpetas | — |
| 2 | Pegar el código del esqueleto | `index.html` |
| 3 | Pegar todos los estilos | `css/style.css` |
| 4 | Pegar la lógica JavaScript | `js/main.js` |
| 5 | Copiar el archivo de poemas | `data/Ania_Poemas.md` |
| 6 | Crear repo en GitHub y subir los 4 archivos | GitHub |
| 7 | Activar GitHub Pages en Settings | GitHub |
| 8 | Esperar 1-2 min y abrir la URL | ✓ Listo |

---

> Para agregar poemas en el futuro: edita solo `data/Ania_Poemas.md` y vuelve a subir ese archivo.
