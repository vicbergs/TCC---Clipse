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

  /* Uma lua da logo: luz pela esquerda na crescente (hemisfério sul), fase p de 0 a 1. */
  function desenharLua(ctx, x, y, r, p, luz, sombra) {
    ctx.fillStyle = sombra; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    p = ((p % 1) + 1) % 1;
    const k = Math.cos(6.2832 * p), rx = Math.max(0.01, Math.abs(k) * r), cresce = p < 0.5, gibosa = k < 0;
    ctx.fillStyle = luz; ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, cresce);
    ctx.ellipse(x, y, rx, r, 0, Math.PI / 2, -Math.PI / 2, cresce ? gibosa : !gibosa);
    ctx.fill();
  }

  /* Campo estelar: grãos finos em 3D que ocupam o herói inteiro, com algumas estrelas bem brilhantes em sol.
     O mouse move a câmera (paralaxe) e acende os grãos perto do cursor. A rolagem acelera a viagem pelo campo. */
  function iniciarCampoEstelar(canvas, opcoes) {
    const pequena = window.innerWidth < 700;
    const o = Object.assign({ tema: 'noite', graos: pequena ? 900 : 2200, brilhantes: pequena ? 7 : 15 }, opcoes || {});
    const tema = TEMAS[o.tema] || TEMAS.noite, escuro = o.tema !== 'lua';
    const ctx = canvas.getContext('2d');
    const [pr, pg, pb] = tema.poeira, [sr, sg, sb] = tema.sol;
    const N = o.graos + o.brilhantes, ZMAX = 3, ZMIN = 0.18;
    const X = new Float32Array(N), Y = new Float32Array(N), Z = new Float32Array(N), S = new Float32Array(N), F = new Float32Array(N), V = new Float32Array(N), Q = new Uint8Array(N);
    function nasce(i, z) { X[i] = (Math.random() * 2 - 1) * 2.4; Y[i] = (Math.random() * 2 - 1) * 2.4; Z[i] = z; }
    for (let i = 0; i < N; i++) {
      nasce(i, ZMIN + Math.random() * (ZMAX - ZMIN));
      S[i] = Math.random(); F[i] = Math.random() * 6.2832; V[i] = 0.5 + Math.random() * 1.4; Q[i] = Math.random() < 0.12 ? 1 : 0;
    }
    // sprite do brilho das estrelas sol: núcleo quase branco, halo em sol
    const brilho = document.createElement('canvas'); brilho.width = brilho.height = 128;
    const bc = brilho.getContext('2d'), gr = bc.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,250,235,1)'); gr.addColorStop(0.08, 'rgba(255,236,190,0.95)');
    gr.addColorStop(0.22, 'rgba(' + sr + ',' + sg + ',' + sb + ',0.55)'); gr.addColorStop(0.55, 'rgba(' + sr + ',' + sg + ',' + sb + ',0.12)'); gr.addColorStop(1, 'rgba(' + sr + ',' + sg + ',' + sb + ',0)');
    bc.fillStyle = gr; bc.fillRect(0, 0, 128, 128);

    let w = 0, h = 0, dpr = 1, f = 1, asp = 1;
    let parado = reduzMovimento(), rafId = 0, tAnt = 0, seg = 0;
    let mx = 0, my = 0, alvoM = 0, forcaM = 0, camX = 0, camY = 0, alvoCX = 0, alvoCY = 0;
    let scrollAnt = window.scrollY, impulso = 0;

    function medir() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, r.width); h = Math.max(1, r.height); asp = h / w;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      f = Math.max(w, h) * 0.72;
    }
    medir();
    function aoMover(e) {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { alvoM = 0; return; }
      mx = x; my = y; alvoM = 1; alvoCX = (x / w - 0.5) * 0.9; alvoCY = (y / h - 0.5) * 0.9 * asp;
    }
    const aoSair = () => { alvoM = 0; alvoCX = alvoCY = 0; };
    function aoRolar() { const y = window.scrollY, d = y - scrollAnt; scrollAnt = y; impulso = Math.max(-2.5, Math.min(2.5, impulso + d * 0.004)); }

    function quadro(t) {
      const dt = Math.min(0.05, tAnt ? (t - tAnt) / 1000 : 0.016); tAnt = t;
      if (!parado) {
        seg += dt;
        forcaM += (alvoM - forcaM) * (1 - Math.exp(-dt * 6));
        camX += (alvoCX - camX) * (1 - Math.exp(-dt * 2.2)); camY += (alvoCY - camY) * (1 - Math.exp(-dt * 2.2));
        impulso *= Math.exp(-dt * 1.4);
      }
      const ang = seg * 0.012, ca = Math.cos(ang), sa = Math.sin(ang), vz = 0.045 + impulso * 0.5;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const brilhantes = [];
      ctx.fillStyle = 'rgba(' + pr + ',' + pg + ',' + pb + ',1)';
      for (let i = 0; i < N; i++) {
        const sol = i >= o.graos;
        if (!parado) {
          Z[i] -= vz * (sol ? 0.55 : 1) * dt * (0.7 + S[i] * 0.6);
          if (Z[i] < ZMIN) nasce(i, ZMAX * (0.92 + Math.random() * 0.08));
          else if (Z[i] > ZMAX) nasce(i, ZMIN + Math.random() * 0.25);
        }
        const xr = X[i] * ca - Y[i] * sa, yr = (X[i] * sa + Y[i] * ca) * asp;
        const k = f / Z[i];
        let sx = cx + (xr - camX) * k, sy = cy + (yr - camY) * k;
        if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue;
        const entra = Math.min(1, (ZMAX - Z[i]) / 0.5) * Math.min(1, (Z[i] - ZMIN) / 0.2);
        const pisca = parado ? 1 : 0.7 + 0.3 * Math.sin(seg * V[i] * 1.6 + F[i]);
        const perto = 1 - Z[i] / ZMAX;
        if (sol) { brilhantes.push(i, sx, sy, entra, pisca, perto); continue; }
        let tam = (0.7 + S[i] * 1.0) * (0.6 + perto * 1.6), a = (0.34 + perto * 0.6) * pisca * entra;
        if (forcaM > 0.01) {
          const dx = sx - mx, dy = sy - my, d2 = dx * dx + dy * dy;
          if (d2 < 19600) { const d = Math.sqrt(d2) || 1, g = (1 - d / 140) * (1 - d / 140) * forcaM; sx += dx / d * g * 14; sy += dy / d * g * 14; a = Math.min(1, a + g * 0.6); tam += g * 1.1; }
        }
        if (Q[i]) ctx.fillStyle = 'rgba(' + sr + ',' + sg + ',' + sb + ',' + a.toFixed(3) + ')';
        else ctx.fillStyle = 'rgba(' + pr + ',' + pg + ',' + pb + ',' + a.toFixed(3) + ')';
        const s2 = Math.max(0.6, tam * dpr * 0.8) / dpr;
        ctx.fillRect(sx - s2 / 2, sy - s2 / 2, s2, s2);
      }
      // estrelas sol brilhantes, somadas à luz do fundo
      ctx.globalCompositeOperation = escuro ? 'lighter' : 'source-over';
      for (let j = 0; j < brilhantes.length; j += 6) {
        const sx = brilhantes[j + 1], sy = brilhantes[j + 2], e = brilhantes[j + 3], p = brilhantes[j + 4], perto = brilhantes[j + 5];
        const raio = (16 + perto * 46) * (0.85 + 0.15 * p);
        ctx.globalAlpha = Math.min(1, (0.55 + perto * 0.5) * e);
        ctx.drawImage(brilho, sx - raio, sy - raio, raio * 2, raio * 2);
        ctx.globalAlpha = 0.32 * e * p; ctx.strokeStyle = 'rgba(255,236,190,0.8)'; ctx.lineWidth = 0.8;
        const L = raio * 1.25; ctx.beginPath(); ctx.moveTo(sx - L, sy); ctx.lineTo(sx + L, sy); ctx.moveTo(sx, sy - L * 0.8); ctx.lineTo(sx, sy + L * 0.8); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      if (!parado) rafId = requestAnimationFrame(quadro);
    }

    let tRedim = 0, tTarde = 0;
    const aoRedimensionar = () => { clearTimeout(tRedim); tRedim = setTimeout(medir, 150); };
    const aoVisibilidade = () => { if (document.hidden) cancelAnimationFrame(rafId); else if (!parado) { tAnt = 0; rafId = requestAnimationFrame(quadro); } };
    window.addEventListener('resize', aoRedimensionar); document.addEventListener('visibilitychange', aoVisibilidade);
    if (!parado) { window.addEventListener('pointermove', aoMover, { passive: true }); document.documentElement.addEventListener('pointerleave', aoSair); window.addEventListener('scroll', aoRolar, { passive: true }); }
    tTarde = setTimeout(medir, 1300);
    if (parado) quadro(0); else rafId = requestAnimationFrame(quadro);
    return {
      medir: medir,
      destruir: function () {
        cancelAnimationFrame(rafId); clearTimeout(tRedim); clearTimeout(tTarde);
        window.removeEventListener('resize', aoRedimensionar); document.removeEventListener('visibilitychange', aoVisibilidade);
        window.removeEventListener('pointermove', aoMover); window.removeEventListener('scroll', aoRolar); document.documentElement.removeEventListener('pointerleave', aoSair);
      }
    };
  }

  function iniciarEsferaClipse(canvas, opcoes) {
    if (!canvas) return null;
    if (!opcoes || !opcoes.forma || opcoes.forma === 'estrelas') return iniciarCampoEstelar(canvas, opcoes);
    const pequena = window.innerWidth < 700;
    const o = Object.assign({
      forma: 'pontos',
      pontos: pequena ? 1800 : 3200,
      tema: 'noite',
      velocidadeGiro: 0.055,
      velocidadeFaixa: 0.085,
      inclinacao: -0.30,
      escala: 0.37,
      ancora: null,
      mouse: true
    }, opcoes || {});

    const luas = o.forma === 'luas', logo = o.forma === 'logo';
    let giroImp = 0;
    if (luas) o.pontos = pequena ? 260 : 520;
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
        giroImp += impulso * dt;
        giroImp += (Math.round(giroImp / 6.2832) * 6.2832 - giroImp) * (1 - Math.exp(-dt * 0.9));
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

        if (luas) {
          const rr = (3 + prof * 5 + brilho * 3.5) * Math.min(1, R / 260 + 0.35);
          const a = Math.min(0.95, 0.25 + prof * 0.45 + brilho * 0.5) * flick;
          const cor = pr + (sr - pr) * brilho | 0, cg = pg + (sg - pg) * brilho | 0, cb = pb + (sb - pb) * brilho | 0;
          const bd = x2 * lx + y2 * ly + z2 * lz;
          desenharLua(ctx, sx, sy, rr, 0.5 - bd * 0.5 + brilho * 0.0, 'rgba(' + cor + ',' + cg + ',' + cb + ',' + a.toFixed(3) + ')', 'rgba(' + pr + ',' + pg + ',' + pb + ',' + (a * 0.16).toFixed(3) + ')');
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + ((pr + (sr - pr) * brilho) | 0) + ',' + ((pg + (sg - pg) * brilho) | 0) + ',' + ((pb + (sb - pb) * brilho) | 0) + ',' + alfa.toFixed(3) + ')';
        ctx.arc(sx, sy, Math.max(0.4, tam), 0, 6.2832);
        ctx.fill();
      }
      if (logo) desenharAneis(seg);
      if (!parado) rafId = requestAnimationFrame(quadro);
    }

    /* Seis luas como no símbolo da logo: anéis empilhados, a menor (central) em sol, vistos em 3D. */
    function desenharAneis(seg) {
      const ry = (parado ? 0 : Math.sin(seg * 0.32) * 0.3) + yawM * 1.3 + giroImp;
      const incl = -0.12 + pitchM * 1.2 + impulsoY * 0.25 + (parado ? 0 : Math.sin(seg * 0.23) * 0.06);
      const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(incl), sX = Math.sin(incl);
      const f = R * 3.1, [pr, pg, pb] = tema.poeira, [sr, sg, sb] = tema.sol;
      const lista = [];
      for (let i = 0; i < 6; i++) lista.push({ i: i, z: (i - 2.5) * R * 0.1 });
      const proj = (x, y, z) => {
        const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
        const y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
        const p = f / (f + z2);
        return [cx + x1 * p, cy + y2 * p, z2];
      };
      lista.sort((a, b) => (proj(0, 0, b.z)[2]) - (proj(0, 0, a.z)[2]));
      for (const a of lista) {
        const r = R * (0.72 + 0.075 * a.i), esp = R * 0.03, off = -R * 0.012 * (5 - a.i);
        ctx.beginPath();
        for (const rr of [r + esp, r - esp]) {
          for (let k = 0; k <= 80; k++) {
            const ang = (k / 80) * 6.2832 * (rr === r + esp ? 1 : -1);
            const p = proj(Math.cos(ang) * rr * 0.86, Math.sin(ang) * rr + off, a.z);
            if (k === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
          }
          ctx.closePath();
        }
        const sol = a.i === 0, prof = (a.i + 1) / 6;
        ctx.fillStyle = sol ? 'rgba(' + sr + ',' + sg + ',' + sb + ',0.95)' : 'rgba(' + pr + ',' + pg + ',' + pb + ',' + (0.9 - prof * 0.45).toFixed(2) + ')';
        ctx.fill('nonzero');
      }
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
