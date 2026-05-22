/* ════════════════════════════════════════════
   main.js — Poemas para Ania
   ════════════════════════════════════════════ */

// ── 1. CARGAR Y PARSEAR EL MARKDOWN ──────────

async function loadPoems() {
  try {
    const res = await fetch('data/Ania_Poemas.md?v=' + new Date().getTime());
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