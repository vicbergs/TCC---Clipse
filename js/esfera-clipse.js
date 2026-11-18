/*
 * Esfera Clipse: fundo animado em canvas puro (sem bibliotecas, sem WebGL).
 * Esfera de poeira de pontos com uma faixa de luz em sol que varre por cima.
 * Reage ao mouse (a esfera gira na direção do cursor e os pontos perto dele se afastam e acendem)
 * e à rolagem (cada rolagem dá um impulso de giro que desacelera sozinho).
 *
 * iniciarEsferaClipse(canvas, { tema, ancora })
 *   ancora(rectDoCanvas) -> { x, y, raio } em px do canvas, para prender a esfera a outro elemento.
 */
(function (global) {
  'use strict';

  const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TEMAS = {
    noite: { poeira: [242, 237, 227], sol: [232, 169, 58] },
    lua: { poeira: [20, 24, 38], sol: [126, 82, 8] }
  };

  function fibonacciEsfera(n) {
    const pts = new Float32Array(n * 3);
    const ouro = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const raio = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = ouro * i;
      pts[i * 3] = Math.cos(theta) * raio;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = Math.sin(theta) * raio;
    }
    return pts;
  }

  function iniciarEsferaClipse(canvas, opcoes) {
    if (!canvas) return null;
    const pequena = window.innerWidth < 700;
    const o = Object.assign({
      pontos: pequena ? 1800 : 3200,
      tema: 'noite',
      velocidadeGiro: 0.055,
      velocidadeFaixa: 0.085,
      inclinacao: -0.30,
      escala: 0.37,
      ancora: null,
      mouse: true
    }, opcoes || {});

    const tema = TEMAS[o.tema] || TEMAS.noite;
    const ctx = canvas.getContext('2d');
    const pontos = fibonacciEsfera(o.pontos);
    const n = o.pontos;
    const fase = new Float32Array(n), vel = new Float32Array(n);
    for (let i = 0; i < n; i++) { fase[i] = Math.random() * Math.PI * 2; vel[i] = 0.6 + Math.random() * 0.9; }

    const idx = Array.from({ length: n }, (_, i) => i);
    const zOrd = new Float32Array(n), telaX = new Float32Array(n), telaY = new Float32Array(n), telaZ = new Float32Array(n);

    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 1;
    let rafId = 0, parado = reduzMovimento(), tAnt = 0, giro = 0;
    // reação ao mouse e à rolagem
    let mx = 0, my = 0, alvoM = 0, forcaM = 0, alvoYaw = 0, alvoPitch = 0, yawM = 0, pitchM = 0;
    let scrollAnt = window.scrollY, impulso = 0, impulsoY = 0;

    function medir() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const a = o.ancora && o.ancora(r);
      if (a) { cx = a.x; cy = a.y; R = a.raio; } else { cx = w / 2; cy = h / 2; R = Math.min(w, h) * o.escala; }
    }
    medir();

    function aoMover(e) {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { alvoM = 0; return; }
      mx = x; my = y; alvoM = 1;
      alvoYaw = (x - cx) / (w / 2); alvoPitch = (y - cy) / (h / 2);
    }
    const aoSair = () => { alvoM = 0; };
    function aoRolar() {
      const y = window.scrollY, d = y - scrollAnt; scrollAnt = y;
      impulso = Math.max(-3, Math.min(3, impulso + d * 0.0045));
      impulsoY = Math.max(-1.5, Math.min(1.5, impulsoY + d * 0.002));
    }

    function quadro(t) {
      const dt = Math.min(0.05, tAnt ? (t - tAnt) / 1000 : 0.016); tAnt = t;
      const seg = parado ? 14 : t / 1000;
      if (!parado) {
        forcaM += (alvoM - forcaM) * (1 - Math.exp(-dt * 6));
        yawM += (alvoM * alvoYaw * 0.5 - yawM) * (1 - Math.exp(-dt * 3));
        pitchM += (alvoM * alvoPitch * 0.3 - pitchM) * (1 - Math.exp(-dt * 3));
        giro += (o.velocidadeGiro + impulso) * dt;
        impulso *= Math.exp(-dt * 1.6);
        impulsoY *= Math.exp(-dt * 2.2);
      }
      const ry = (parado ? seg * o.velocidadeGiro : giro) + yawM;
      const cosY = Math.cos(ry), senY = Math.sin(ry);
      const incl = o.inclinacao + pitchM + impulsoY * 0.25;
      const cosX = Math.cos(incl), senX = Math.sin(incl);
      const f = R * 3.1;

      const largura = 0.21 + Math.sin(seg * 0.07) * 0.09;
      const ang = seg * o.velocidadeFaixa + 0.6;
      let lx = Math.cos(ang), ly = Math.sin(ang) * 0.55, lz = 0.32;
      const lm = Math.hypot(lx, ly, lz); lx /= lm; ly /= lm; lz /= lm;

      for (let i = 0; i < n; i++) {
        const x = pontos[i * 3], y = pontos[i * 3 + 1], z = pontos[i * 3 + 2];
        const x1 = x * cosY + z * senY, z1 = -x * senY + z * cosY;
        const y2 = y * cosX - z1 * senX, z2 = y * senX + z1 * cosX;
        telaX[i] = x1; telaY[i] = y2; telaZ[i] = z2; zOrd[i] = z2;
      }
      idx.sort((a, b) => zOrd[b] - zOrd[a]);

      const raioM = R * 0.5, [pr, pg, pb] = tema.poeira, [sr, sg, sb] = tema.sol;
      const usaMouse = o.mouse && forcaM > 0.01;
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < n; k++) {
        const i = idx[k], x2 = telaX[i], y2 = telaY[i], z2 = telaZ[i];
        const persp = f / (f + z2);
        let sx = cx + x2 * R * persp, sy = cy + y2 * R * persp;

        let brilho = Math.max(0, 1 - Math.abs(x2 * lx + y2 * ly + z2 * lz) / largura);
        brilho = Math.pow(brilho, 1.6);

        if (usaMouse) {
          const dx = sx - mx, dy = sy - my, d2 = dx * dx + dy * dy;
          if (d2 < raioM * raioM) {
            const d = Math.sqrt(d2) || 1, q = 1 - d / raioM, p = q * q * forcaM;
            sx += (dx / d) * p * 30; sy += (dy / d) * p * 30;
            brilho = Math.min(1, brilho + p * 0.95);
          }
        }

        const flick = parado ? 1 : 0.82 + 0.18 * Math.sin(seg * vel[i] + fase[i]);
        const prof = Math.max(0, Math.min(1, (persp - 0.75) / 0.5));
        const tam = (0.55 + prof * 1.15 + brilho * 1.3) * dpr * 0.72;
        const alfa = Math.min(0.95, (0.07 + prof * 0.22) * flick + brilho * 0.8 * flick);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + ((pr + (sr - pr) * brilho) | 0) + ',' + ((pg + (sg - pg) * brilho) | 0) + ',' + ((pb + (sb - pb) * brilho) | 0) + ',' + alfa.toFixed(3) + ')';
        ctx.arc(sx, sy, Math.max(0.4, tam), 0, 6.2832);
        ctx.fill();
      }
      if (!parado) rafId = requestAnimationFrame(quadro);
    }

    let tRedim = 0, tTarde = 0;
    const aoRedimensionar = () => { clearTimeout(tRedim); tRedim = setTimeout(medir, 150); };
    const aoVisibilidade = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else if (!parado) { tAnt = 0; rafId = requestAnimationFrame(quadro); }
    };
    window.addEventListener('resize', aoRedimensionar);
    document.addEventListener('visibilitychange', aoVisibilidade);
    if (!parado) {
      if (o.mouse) { window.addEventListener('pointermove', aoMover, { passive: true }); document.documentElement.addEventListener('pointerleave', aoSair); }
      window.addEventListener('scroll', aoRolar, { passive: true });
    }
    tTarde = setTimeout(medir, 1300); // depois da entrada do herói, quando o elemento âncora já parou

    if (parado) quadro(0); else rafId = requestAnimationFrame(quadro);

    return {
      medir: medir,
      destruir: function () {
        cancelAnimationFrame(rafId); clearTimeout(tRedim); clearTimeout(tTarde);
        window.removeEventListener('resize', aoRedimensionar);
        document.removeEventListener('visibilitychange', aoVisibilidade);
        window.removeEventListener('pointermove', aoMover);
        window.removeEventListener('scroll', aoRolar);
        document.documentElement.removeEventListener('pointerleave', aoSair);
      }
    };
  }

  global.iniciarEsferaClipse = iniciarEsferaClipse;
})(window);
