/* Clipse — protótipo navegável. Sem bibliotecas: molas, gestos e rotas escritos à mão. */
(function () {
'use strict';

const C = window.CLIPSE;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduzMovimento = () => document.documentElement.dataset.movimento === 'reduzido' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const telaLarga = () => window.matchMedia('(min-width: 760px)').matches;

/* ───────── Datas ───────── */
const LOGO = '<img class="logo-escuro" src="assets/horizontal-lua.svg" alt="Clipse" width="125" height="34"><img class="logo-claro" src="assets/horizontal-noite.svg" alt="Clipse" width="125" height="34">';
const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const hojeISO = () => iso(new Date());
const deISO = (s) => { const p = String(s).split('-').map(Number); return new Date(p[0], (p[1] || 1) - 1, p[2] || 1); };
const diasAtras = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d); };
const dataCurta = (s) => deISO(s).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');
const dataLonga = (s) => deISO(s).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
const diasEntre = (a, b) => Math.max(0, Math.round((deISO(b) - deISO(a)) / 864e5));
const preco = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0);
const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ───────── Lua: desenhada como se vê de Curitiba (hemisfério sul: a crescente acende pela esquerda) ───────── */
function caminhoLua(p, r, cx, cy) {
  p = ((p % 1) + 1) % 1;
  const k = Math.cos(2 * Math.PI * p);
  const rx = Math.max(0.01, Math.abs(k) * r);
  const cresce = p < 0.5;
  const gibosa = k < 0;
  const limbo = cresce ? 0 : 1;
  const term = cresce ? (gibosa ? 0 : 1) : (gibosa ? 1 : 0);
  const f = (n) => n.toFixed(2);
  return 'M' + f(cx) + ',' + f(cy - r) + 'A' + f(r) + ',' + f(r) + ' 0 0 ' + limbo + ' ' + f(cx) + ',' + f(cy + r) +
         'A' + f(rx) + ',' + f(r) + ' 0 0 ' + term + ' ' + f(cx) + ',' + f(cy - r) + 'Z';
}
function luaMini(p, tam, classe) {
  return '<svg class="lua-mini ' + (classe || '') + '" width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle class="lm-sombra" cx="12" cy="12" r="10.5"/><path class="lm-luz" d="' + caminhoLua(p, 10.5, 12, 12) + '"/></svg>';
}
function luaGrande(id, real) {
  const base = '<defs><clipPath id="' + id + '-clip"><path id="' + id + '-clip-p" d=""/></clipPath>';
  if (!real) {
    return '<svg class="lua-g" id="' + id + '" viewBox="0 0 200 200" aria-hidden="true">' + base + '</defs>' +
      '<circle class="lg-sombra" cx="100" cy="100" r="90"/>' +
      '<path class="lg-luz" id="' + id + '-luz" d=""/>' +
      '<g class="lg-crateras" clip-path="url(#' + id + '-clip)"><circle cx="70" cy="68" r="16"/><circle cx="130" cy="94" r="9"/><circle cx="92" cy="134" r="22"/><circle cx="142" cy="144" r="7"/><circle cx="120" cy="46" r="6"/></g>' +
      '</svg>';
  }
  /* Lua com volume: degradê que escurece na borda, mares escuros borrados, crateras e grão. As fases seguem o mesmo clip. */
  return '<svg class="lua-g real" id="' + id + '" viewBox="0 0 200 200" aria-hidden="true">' + base +
    '<radialGradient id="' + id + '-g" cx="0.38" cy="0.34" r="0.8"><stop offset="0" style="stop-color: color-mix(in srgb, var(--moon-light) 84%, #fff)"/><stop offset="0.6" style="stop-color: var(--moon-light)"/><stop offset="1" style="stop-color: color-mix(in srgb, var(--moon-light) 52%, #000)"/></radialGradient>' +
    '<radialGradient id="' + id + '-s" cx="0.5" cy="0.5" r="0.5"><stop offset="0" style="stop-color: var(--moon-light); stop-opacity: .07"/><stop offset="1" style="stop-color: var(--moon-light); stop-opacity: .02"/></radialGradient>' +
    '<filter id="' + id + '-m" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.6"/></filter>' +
    '<filter id="' + id + '-r" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.9 0 0 0 -0.78"/></filter></defs>' +
    '<circle class="lg-sombra" cx="100" cy="100" r="90"/>' +
    '<circle cx="100" cy="100" r="90" style="fill:url(#' + id + '-s)"/>' +
    '<path class="lg-luz" id="' + id + '-luz" d="" style="fill:url(#' + id + '-g)"/>' +
    '<g clip-path="url(#' + id + '-clip)">' +
      '<g style="fill: var(--eclipse); opacity: .14"><circle cx="70" cy="68" r="16"/><circle cx="130" cy="94" r="9"/><circle cx="92" cy="134" r="22"/><circle cx="142" cy="144" r="7"/><circle cx="120" cy="46" r="6"/></g>' +
    '</g></svg>';
}function pintarLuaGrande(id, p) {
  const a = $('#' + id + '-luz'), b = $('#' + id + '-clip-p');
  if (!a || !b) return;
  const d = caminhoLua(p, 90, 100, 100);
  a.setAttribute('d', d); b.setAttribute('d', d);
}

/* ───────── Ícones ───────── */
const IC = {
  inicio: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  folha: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  pessoas: '<circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.5"/><path d="M16 14.3a4.5 4.5 0 0 1 4.5 4.7"/>',
  mais: '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
  fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  baixo: '<path d="M6 9l6 6 6-6"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
  cadeado: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  soma: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  marca: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
  'g-intro': '<path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H19v15H6.5A1.5 1.5 0 0 0 5 20.5z"/><path d="M5 20.5v-15M9 8h6M9 12h6"/>',
  'g-motivos': '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  'g-riscos': '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  'g-rotina': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  'g-voltar': '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4.5h4.5"/>',
  'g-coracao': '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M8 11h2l1.5-2 2 4 1-2H16"/>',
  'g-gota': '<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.300 6-10.500 6-10.500z"/>',
  'g-figado': '<path d="M3.5 11c0-3 3-5 8-5 5 0 9 2 9 5.5 0 3.500-3 6.500-8 6.500-3 0-4.500-1.500-6-2.500C4.500 14.500 3.500 13 3.500 11z"/>',
  'g-perfil': '<circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3-6.500 7-6.500s7 2.500 7 6.500"/>',
  'g-pele': '<path d="M4 8h16M4 12h16M4 16h16"/>',
  'g-caixa': '<path d="M3.500 8l8.500-4 8.500 4v8l-8.500 4-8.500-4z"/><path d="M3.500 8l8.500 4 8.500-4M12 12v8"/>',
  'acess': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="8" r="1"/><path d="M7.5 10.5l4.5.8 4.5-.8M12 11.3V16M9.8 19.5l2.2-3.5 2.2 3.5"/>',
};
const ic = (n, t) => '<svg class="ic" width="' + (t || 22) + '" height="' + (t || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + '</svg>';

/* ───────── Mola: amortecimento (1 = sem quique) + resposta em segundos. Interrompível e sensível à velocidade. ───────── */
class Mola {
  constructor(valor, aoMudar, eps) {
    this.x = valor; this.v = 0; this.alvo = valor; this.aoMudar = aoMudar; this.eps = eps || 0.5;
    this.raf = 0; this.k = 0; this.c = 0; this.aoParar = null; this.t = 0;
    this.passo = this.passo.bind(this);
  }
  ir(alvo, o) {
    o = o || {};
    this.alvo = alvo;
    if (typeof o.velocidade === 'number' && isFinite(o.velocidade)) this.v = o.velocidade;
    const w = (2 * Math.PI) / (o.resposta || 0.4);
    this.k = w * w; this.c = 2 * (o.amortecimento == null ? 1 : o.amortecimento) * w;
    this.aoParar = o.aoParar || null;
    if (reduzMovimento()) { this.terminar(); return; }
    if (!this.raf) { this.t = performance.now(); this.raf = requestAnimationFrame(this.passo); }
  }
  terminar() {
    this.parar(); this.x = this.alvo; this.v = 0; this.aoMudar(this.x);
    const f = this.aoParar; this.aoParar = null; if (f) f();
  }
  fixar(x) { this.parar(); this.x = x; this.v = 0; this.alvo = x; this.aoParar = null; this.aoMudar(x); }
  parar() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; }
  passo(agora) {
    const dt = Math.min(0.064, Math.max(0.001, (agora - this.t) / 1000)); this.t = agora;
    const n = Math.ceil(dt / 0.004), h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -this.k * (this.x - this.alvo) - this.c * this.v;
      this.v += a * h; this.x += this.v * h;
    }
    if (Math.abs(this.v) < this.eps * 4 && Math.abs(this.x - this.alvo) < this.eps) { this.raf = 0; this.terminar(); return; }
    this.aoMudar(this.x);
    this.raf = requestAnimationFrame(this.passo);
  }
}
/* Projeção de momento (decaimento exponencial) e elástico de borda */
const projetar = (v, taxa) => { taxa = taxa || 0.998; return (v / 1000) * taxa / (1 - taxa); };
const elastico = (passou, dim, c) => { c = c || 0.55; return (passou * dim * c) / (dim + c * Math.abs(passou)); };
function velocidadeDe(hist) {
  if (hist.length < 2) return 0;
  const fim = hist[hist.length - 1];
  let ini = hist[0];
  for (let i = hist.length - 2; i >= 0; i--) { ini = hist[i]; if (fim.t - hist[i].t > 80) break; }
  const dt = (fim.t - ini.t) / 1000;
  return dt > 0.001 ? (fim.p - ini.p) / dt : 0;
}

/* ───────── Estado da jornada (fica neste navegador) ───────── */
const CHAVE = 'clipse.v1';
const PADRAO = () => ({
  v: 1, usuario: null, logado: false, exemplo: false, plano: 'gratuito', fase: null,
  historico: [], checkins: {}, diario: [], objetivos: [], voltas: [],
  salvos: { profissionais: [], locais: [], grupos: [], eventos: [] }, aulas: [], parceiro: null
});
let estado = PADRAO();
function lerLocal() { try { const t = localStorage.getItem(CHAVE); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function normalizar(d) {
  const b = PADRAO();
  if (!d || typeof d !== 'object') return b;
  const o = Object.assign(b, d);
  o.salvos = Object.assign(PADRAO().salvos, d.salvos || {});
  ['historico', 'diario', 'objetivos', 'voltas', 'aulas'].forEach((k) => { if (!Array.isArray(o[k])) o[k] = []; });
  Object.keys(o.salvos).forEach((k) => { if (!Array.isArray(o.salvos[k])) o.salvos[k] = []; });
  if (!o.checkins || typeof o.checkins !== 'object') o.checkins = {};
  o.historico = o.historico.filter((h) => h && C.fases[h.fase] && /^\d{4}-\d{2}-\d{2}$/.test(h.data)).sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
  if (!o.usuario || typeof o.usuario !== 'object') { o.usuario = null; o.logado = false; }
  if (!C.fases[o.fase]) o.fase = o.usuario ? 'crescente' : null;
  if (!NIVEL.hasOwnProperty(o.plano)) o.plano = 'gratuito';
  return o;
}
function gravar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); return true; } catch (e) { return false; } }

const NIVEL = { gratuito: 0, premium: 1, diamond: 2 };
const planoAtual = () => (estado.logado ? estado.plano : 'gratuito');
const temAcesso = (n) => NIVEL[planoAtual()] >= NIVEL[n];
const nomePlano = (id) => (C.planos.find((p) => p.id === id) || { nome: id }).nome;
const primeiroNome = () => String((estado.usuario && estado.usuario.nome) || '').split(' ')[0];

function perfilExemplo() {
  const e = PADRAO();
  e.usuario = { nome: 'Ana', email: '', desde: diasAtras(96) };
  e.logado = true; e.exemplo = true; e.plano = 'premium'; e.fase = 'crescente';
  e.historico = [
    { fase: 'crescente', data: diasAtras(96) }, { fase: 'cheia', data: diasAtras(80) },
    { fase: 'minguante', data: diasAtras(41) }, { fase: 'nova', data: diasAtras(27), motivo: 'Trabalho', nota: 'Fechamento de projeto, volto depois.' },
    { fase: 'crescente', data: diasAtras(6) }
  ];
  e.voltas = [{ data: diasAtras(6), dias: 21 }];
  e.checkins[diasAtras(6)] = { energia: 'baixa', fez: ['Caminhei'], nota: 'Vinte minutos no Barigui. Já valeu.' };
  e.checkins[diasAtras(4)] = { energia: 'ok', fez: ['Treinei'], nota: 'Metade da carga de antes.' };
  e.checkins[diasAtras(3)] = { energia: 'ok', fez: ['Descansei'], nota: '' };
  e.checkins[diasAtras(1)] = { energia: 'alta', fez: ['Treinei', 'Alonguei'], nota: 'O corpo lembrou.' };
  e.checkins[diasAtras(38)] = { energia: 'baixa', fez: ['Caminhei'], nota: '' };
  e.checkins[diasAtras(33)] = { energia: 'ok', fez: ['Treinei'], nota: '' };
  e.diario = [
    { id: 'd2', data: diasAtras(1), texto: 'Primeira semana de volta. Achei que ia estar pior. Não comparei com março e isso ajudou.' },
    { id: 'd1', data: diasAtras(27), texto: 'Parando por umas semanas por causa do trabalho. Deixo anotado para lembrar que foi uma escolha.' }
  ];
  e.objetivos = [
    { id: 'o1', texto: 'Treinar duas vezes por semana, mesmo que curto', rotina: false },
    { id: 'o2', texto: 'Dormir antes da meia-noite', rotina: true },
    { id: 'o3', texto: 'Voltar a correr 5 km sem pressa de tempo', rotina: false }
  ];
  e.salvos = { profissionais: ['pr3'], locais: ['l1', 'l8'], grupos: ['g2'], eventos: ['e4', 'm2'] };
  e.aulas = ['a1', 'a2', 'a4'];
  return e;
}

/* ───────── Acessibilidade: as escolhas ficam neste navegador ───────── */
const CHAVE_AC = 'clipse.a11y.v1';
const AC_PADRAO = { texto: 0, tema: 'noite', contraste: false, movimento: false, espaco: false, fonte: false, links: false };
let ac = Object.assign({}, AC_PADRAO);
function lerAcess() { try { const t = localStorage.getItem(CHAVE_AC); if (t) ac = Object.assign({}, AC_PADRAO, JSON.parse(t)); } catch (e) {} }
function aplicarAcess() {
  const h = document.documentElement.dataset;
  if (ac.tema === 'claro') h.theme = 'lua'; else delete h.theme;
  h.texto = String(Number(ac.texto) || 0);
  const liga = (k, nome, valor) => { if (ac[k]) h[nome] = valor; else delete h[nome]; };
  liga('contraste', 'contraste', 'alto'); liga('movimento', 'movimento', 'reduzido'); liga('espaco', 'espaco', '1'); liga('fonte', 'fonte', 'simples'); liga('links', 'links', '1');
  const tema = $('meta[name="theme-color"]'); if (tema) tema.content = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim();
}
function abrirAcess(foco) {
  const seg = (id, rotulo, ops, atual) => '<div class="ac-grupo"><p class="ac-t" id="ac-l-' + id + '">' + rotulo + '</p><div class="ac-seg" role="group" aria-labelledby="ac-l-' + id + '">' +
    ops.map((o) => '<button type="button" data-acao="ac-seg" data-grupo="' + id + '" data-id="' + o[0] + '" aria-pressed="' + (String(atual) === String(o[0])) + '">' + o[1] + '</button>').join('') + '</div></div>';
  const sw = (id, rotulo, desc) => '<button type="button" role="switch" class="ac-sw" data-acao="ac-sw" data-id="' + id + '" aria-checked="' + !!ac[id] + '"><span class="ac-sw-t"><b>' + rotulo + '</b><span>' + desc + '</span></span><span class="ac-trilho" aria-hidden="true"></span></button>';
  Folha.abrir({ titulo: 'Acessibilidade', html:
    seg('texto', 'Tamanho do texto', [[0, 'Padrão'], [1, 'Grande'], [2, 'Maior'], [3, 'Máximo']], ac.texto) +
    seg('tema', 'Tema', [['noite', 'Noite'], ['claro', 'Claro']], ac.tema) +
    '<div class="ac-lista">' +
      sw('contraste', 'Alto contraste', 'Texto e bordas mais fortes, sem transparências.') +
      sw('movimento', 'Reduzir movimento', 'Para animações, estrelas e efeitos de rolagem.') +
      sw('espaco', 'Mais espaço no texto', 'Aumenta o espaço entre linhas, letras e palavras.') +
      sw('fonte', 'Fonte simples', 'Troca a fonte da marca por uma mais comum.') +
      sw('links', 'Sublinhar links', 'Mostra todos os links sublinhados.') + '</div>' +
    '<div class="acoes"><button type="button" class="btn btn-sec btn-p" data-acao="ac-zerar">Restaurar o padrão</button></div>' +
    '<p class="meta">As escolhas ficam salvas neste navegador. A Clipse também respeita as configurações do seu aparelho.</p>' });
  if (foco) { const n = $(foco, $('#folha')); if (n) n.focus({ preventScroll: true }); }
}
function mudouAcess(foco) {
  try { localStorage.setItem(CHAVE_AC, JSON.stringify(ac)); } catch (e) {}
  aplicarAcess(); pintar(); abrirAcess(foco);
}
/* ───────── Aviso curto ───────── */
let tAviso = 0;
function avisar(txt) {
  const el = $('#aviso'); if (!el) return;
  el.textContent = txt; el.classList.add('on');
  clearTimeout(tAviso); tAviso = setTimeout(() => el.classList.remove('on'), 3600);
}

/* ───────── Folha: sobe de baixo no celular (arrastável), vira diálogo central em tela larga ───────── */
const Folha = (function () {
  let el, corpo, tit, cab, veu, mola;
  let aberta = false, h = 1, gatilho = null, largo = false, arr = null;
  function pintar(y) {
    const t = Math.min(1, Math.max(0, y / h));
    if (largo) { el.style.transform = 'translate(-50%, calc(-50% + ' + (t * 26).toFixed(1) + 'px)) scale(' + (1 - t * 0.04).toFixed(4) + ')'; el.style.opacity = (1 - t).toFixed(3); }
    else { el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)'; el.style.opacity = '1'; }
    veu.style.opacity = (1 - t).toFixed(3);
  }
  function montar() {
    el = $('#folha'); corpo = $('#folha-corpo'); tit = $('#folha-titulo'); cab = $('#folha-cabeca'); veu = $('#veu');
    mola = new Mola(0, pintar, 0.5);
    veu.addEventListener('click', () => fechar());
    cab.addEventListener('pointerdown', (e) => {
      if (largo || !aberta || e.button || e.target.closest('button')) return;
      try { cab.setPointerCapture(e.pointerId); } catch (x) {}
      mola.parar();
      arr = { id: e.pointerId, desloc: e.clientY - mola.x, hist: [{ t: e.timeStamp, p: e.clientY }] };
    });
    cab.addEventListener('pointermove', (e) => {
      if (!arr || e.pointerId !== arr.id) return;
      let y = e.clientY - arr.desloc;
      if (y < 0) y = -elastico(-y, h);
      mola.x = y; mola.v = 0; pintar(y);
      arr.hist.push({ t: e.timeStamp, p: e.clientY }); if (arr.hist.length > 8) arr.hist.shift();
    });
    const solta = (e) => {
      if (!arr || e.pointerId !== arr.id) return;
      const v = velocidadeDe(arr.hist); arr = null;
      if (mola.x + projetar(v) > h * 0.5) fechar(v);
      else mola.ir(0, { velocidade: v, amortecimento: Math.abs(v) > 300 ? 0.8 : 1, resposta: 0.3 });
    };
    cab.addEventListener('pointerup', solta); cab.addEventListener('pointercancel', solta);
    document.addEventListener('keydown', (e) => {
      if (!aberta) return;
      if (e.key === 'Escape') { e.preventDefault(); fechar(); return; }
      if (e.key !== 'Tab') return;
      const f = $$('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select,textarea,summary', el).filter((x) => x.offsetParent !== null);
      if (!f.length) { e.preventDefault(); return; }
      const pri = f[0], ult = f[f.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === pri || at === el)) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && at === ult) { e.preventDefault(); pri.focus(); }
    });
  }
  function abrir(o) {
    const visivel = !el.hidden;
    if (!visivel) gatilho = document.activeElement;
    tit.textContent = o.titulo || '';
    corpo.innerHTML = o.html || ''; corpo.scrollTop = 0;
    el.hidden = false; veu.hidden = false;
    document.documentElement.classList.add('travado');
    largo = telaLarga(); el.classList.toggle('largo', largo);
    h = largo ? 100 : Math.max(1, el.offsetHeight);
    if (!visivel) { mola.x = h; mola.v = 0; pintar(h); }
    aberta = true;
    mola.ir(0, { amortecimento: 1, resposta: 0.36 });
    if (o.aoMontar) o.aoMontar(corpo);
    el.focus({ preventScroll: true });
  }
  function fechar(vel) {
    if (!aberta) return;
    aberta = false;
    mola.ir(h, { velocidade: vel, amortecimento: 1, resposta: 0.3, aoParar: () => {
      el.hidden = true; veu.hidden = true; corpo.innerHTML = '';
      document.documentElement.classList.remove('travado');
      if (gatilho && document.contains(gatilho)) { try { gatilho.focus({ preventScroll: true }); } catch (x) {} }
      gatilho = null;
    } });
  }
  return { montar, abrir, fechar, get aberta() { return aberta; } };
})();

/* ───────── Vitrine: produtos compartilhados (db) com alternativa local ───────── */
const CHAVE_PROD = 'clipse.produtos.v1';
const Nuvem = { estado: 'aguardando', db: null, assets: null, produtos: null };
let gerindo = false;
let fotoPendente; // undefined = sem mudança, null = remover, objeto = nova foto

function produtosLocais() {
  try { const t = localStorage.getItem(CHAVE_PROD); if (t) { const l = JSON.parse(t); if (Array.isArray(l)) return l; } } catch (e) {}
  return C.produtosExemplo.map((p) => Object.assign({}, p));
}
function gravarProdutosLocais(l) { try { localStorage.setItem(CHAVE_PROD, JSON.stringify(l)); return true; } catch (e) { return false; } }
function produtosAtuais() {
  const l = (Nuvem.produtos || []).slice();
  l.sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0) || String(a.nome).localeCompare(String(b.nome)));
  return l;
}
function fotoSrc(p) {
  if (p.fotoData && /^data:image\/(jpeg|png|webp);base64,/.test(p.fotoData)) return p.fotoData;
  if (p.foto && /^[A-Za-z0-9_-]{8,64}$/.test(p.foto)) return '/_blob/' + p.foto;
  return '';
}
function atualizarProdutos() { if (rota === 'produtos') pintar(); }
function modoLocal(indisponivel) {
  Nuvem.estado = indisponivel ? 'indisponivel' : 'local';
  Nuvem.produtos = indisponivel ? C.produtosExemplo.map((p) => Object.assign({}, p)) : produtosLocais();
  atualizarProdutos();
}
async function ligarNuvem() {
  const tem = () => window.claude && typeof window.claude.use === 'function';
  if (!tem()) {
    await new Promise((ok) => { if (document.readyState === 'complete') setTimeout(ok, 300); else window.addEventListener('load', () => setTimeout(ok, 300), { once: true }); });
    if (!tem()) { modoLocal(false); return; }
  }
  const limite = setTimeout(() => { if (Nuvem.estado === 'aguardando') modoLocal(true); }, 10000);
  let db = null, user = null, assets = null;
  try { const r = await Promise.all([window.claude.use('db'), window.claude.use('user'), window.claude.use('assets')]); db = r[0]; user = r[1]; assets = r[2]; } catch (e) {}
  if (!db) { clearTimeout(limite); if (Nuvem.estado === 'aguardando') modoLocal(false); return; }
  let pode = false;
  try { pode = user ? !!(await user.canEdit()) : false; } catch (e) {}
  Nuvem.db = db; Nuvem.assets = assets;
  try {
    db.collection('produtos').onSnapshot((snap) => {
      clearTimeout(limite);
      Nuvem.estado = pode ? 'compartilhado' : 'leitura';
      Nuvem.produtos = snap.docs.map((d) => Object.assign({ id: d.id }, d.data() || {}));
      atualizarProdutos();
    }, () => { clearTimeout(limite); if (Nuvem.estado === 'aguardando') modoLocal(true); });
  } catch (e) { clearTimeout(limite); modoLocal(true); }
}
function lerValor(t) {
  const s = String(t || '').replace(/[^\d.,]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = parseFloat(s);
  return isFinite(n) && n >= 0 && n < 1e6 ? Math.round(n * 100) / 100 : null;
}
function reduzirImagem(arq, max, q) {
  return new Promise((ok, falha) => {
    const url = URL.createObjectURL(arq); const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * s)), hh = Math.max(1, Math.round(img.height * s));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = hh;
      const g = cv.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, hh); g.drawImage(img, 0, 0, w, hh);
      URL.revokeObjectURL(url);
      const dataURL = cv.toDataURL('image/jpeg', q);
      cv.toBlob((b) => { if (!b) falha(new Error('blob')); else ok({ blob: b, dataURL: dataURL, url: URL.createObjectURL(b) }); }, 'image/jpeg', q);
    };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error('imagem')); };
    img.src = url;
  });
}
async function salvarProduto(id, base) {
  const atual = id ? produtosAtuais().find((p) => p.id === id) : null;
  if (Nuvem.estado === 'compartilhado') {
    const dados = Object.assign({}, base, { ordem: atual && atual.ordem != null ? atual.ordem : Date.now(), foto: (atual && atual.foto) || '' });
    let antiga = '';
    if (fotoPendente === null) { antiga = dados.foto; dados.foto = ''; }
    else if (fotoPendente) {
      if (!Nuvem.assets) throw { code: 'sem_assets' };
      const r = await Nuvem.assets.upload(fotoPendente.blob, { type: 'image/jpeg' });
      antiga = dados.foto; dados.foto = r.id;
    }
    const col = Nuvem.db.collection('produtos');
    await (id ? col.doc(id) : col.doc()).set(dados);
    if (antiga && Nuvem.assets) { try { await Nuvem.assets.delete(antiga); } catch (e) {} }
    return;
  }
  if (Nuvem.estado !== 'local') throw { code: 'not_granted' };
  const lista = produtosLocais();
  const dados = Object.assign({}, base, { id: id || 'p' + novoId(), ordem: atual && atual.ordem != null ? atual.ordem : Date.now(), fotoData: (atual && atual.fotoData) || '' });
  if (fotoPendente === null) dados.fotoData = '';
  else if (fotoPendente) dados.fotoData = fotoPendente.dataURL;
  const i = lista.findIndex((p) => p.id === dados.id);
  if (i >= 0) lista[i] = dados; else lista.push(dados);
  if (!gravarProdutosLocais(lista)) throw { code: 'sem_espaco' };
  Nuvem.produtos = lista; atualizarProdutos();
}
async function excluirProduto(id) {
  const atual = produtosAtuais().find((p) => p.id === id);
  if (Nuvem.estado === 'compartilhado') {
    await Nuvem.db.collection('produtos').doc(id).delete();
    if (atual && atual.foto && Nuvem.assets) { try { await Nuvem.assets.delete(atual.foto); } catch (e) {} }
    return;
  }
  if (Nuvem.estado !== 'local') throw { code: 'not_granted' };
  const lista = produtosLocais().filter((p) => p.id !== id);
  gravarProdutosLocais(lista); Nuvem.produtos = lista; atualizarProdutos();
}
function mensagemErro(e) {
  const c = e && e.code;
  if (c === 'quota_exceeded' || c === 'quota_or_state') return 'O espaço da vitrine está cheio. Remova um produto ou uma foto e tente de novo.';
  if (c === 'too_large') return 'A foto ficou grande demais. Escolha uma imagem menor.';
  if (c === 'unsupported_type') return 'Esse tipo de arquivo não é aceito. Use JPG, PNG ou WebP.';
  if (c === 'invalid_argument' || c === 'not_granted' || c === 'revoked') return 'Você não tem permissão para editar a vitrine nesta visita.';
  if (c === 'sem_espaco') return 'Este navegador ficou sem espaço para guardar a foto. Salve sem foto ou use uma imagem menor.';
  if (c === 'sem_assets') return 'O envio de fotos não está disponível nesta visita. Salve sem foto.';
  return 'Não consegui salvar agora. Tente de novo em instantes.';
}

/* ───────── Peças de página ───────── */
const topo = (titulo, lide) => '<header class="pg-topo"><h1>' + titulo + '</h1>' + (lide ? '<p class="lide">' + lide + '</p>' : '') + '</header>';
const selo = (plano) => '<span class="selo selo-' + plano + '">' + nomePlano(plano) + '</span>';
const notaIlustrativa = (txt) => '<p class="nota-prot">' + txt + '</p>';
function botaoSalvar(tipo, id, rotulos) {
  const on = estado.logado && estado.salvos[tipo].indexOf(id) >= 0;
  rotulos = rotulos || ['Salvar na minha rede', 'Salvo na minha rede'];
  return '<button type="button" class="btn btn-sec btn-p' + (on ? ' on' : '') + '" data-acao="salvar" data-tipo="' + tipo + '" data-id="' + id + '" aria-pressed="' + on + '">' + (on ? ic('check', 16) : '') + '<span>' + (on ? rotulos[1] : rotulos[0]) + '</span></button>';
}

/* ───────── Páginas ───────── */
let rota = 'inicio';
let heroi = null;
let filtroProf = 'Todos';
let filtroLocal = 'todos';
let selLocal = null;
let abaJornada = 'hoje';
let animarLuaDe = null;

const MANIFESTO = 'Cada pessoa tem a própria jornada, sem promessa e sem atalho. Ninguém precisa ser perfeito: pausar faz parte do ciclo, voltar também. O tempo faz parte do resultado, e toda atividade cabe, da academia à caminhada.';

/* Os 28 dias da vitrine: uma volta inteira do ciclo, com a pausa em branco */
function cicloVitrine() {
  const hist = [{ fase: 'cheia', data: diasAtras(27) }, { fase: 'minguante', data: diasAtras(17) }, { fase: 'nova', data: diasAtras(11) }, { fase: 'crescente', data: diasAtras(6) }];
  const com = [26, 24, 23, 21, 19, 18, 15, 13, 5, 3, 2, 1, 0];
  let cel = '';
  for (let i = 27; i >= 0; i--) {
    const dia = diasAtras(i), f = faseNoDia(dia, hist);
    cel += '<li class="' + (i === 0 ? 'hoje' : '') + '"><span class="ciclo-lua">' + luaMini(C.fases[f].p, 24) + '</span><span class="ciclo-dia">' + deISO(dia).getDate() + '</span>' + (com.indexOf(i) >= 0 ? '<span class="ciclo-ponto"></span>' : '') + '</li>';
  }
  return cel;
}

/* Uma fase no centro, quatro caminhos saindo dela; os pulsos correm pelas linhas */
function hubSVG() {
  const nos = [['Aulas', 66, 22], ['Profissionais', 66, 98], ['Grupos', 334, 22], ['Mapa', 334, 98]];
  const curva = (n) => 'M200 60Q' + (n[1] < 200 ? 130 : 270) + ' 60 ' + n[1] + ' ' + n[2];
  return '<svg class="hub" viewBox="0 0 400 120" aria-hidden="true" focusable="false">' +
    nos.map((n) => '<path class="hub-liga" d="' + curva(n) + '"/>').join('') +
    nos.map((n, i) => '<path class="hub-pulso" pathLength="100" style="--d:' + (i * 0.6).toFixed(1) + 's" d="' + curva(n) + '"/>').join('') +
    '<circle cx="200" cy="60" r="20" style="fill:var(--surface);stroke:var(--line-strong)"/><g transform="translate(186 46)">' + luaMini(0.25, 28) + '</g>' +
    nos.map((n) => '<g class="hub-no"><rect x="' + (n[1] - 46) + '" y="' + (n[2] - 12) + '" width="92" height="24" rx="12"/><text x="' + n[1] + '" y="' + (n[2] + 4) + '">' + n[0] + '</text></g>').join('') +
  '</svg>';
}

function pgInicio() {
  const logado = estado.logado;
  const premium = C.planos.find((p) => p.id === 'premium');
  const hrefJor = '#' + (logado ? 'minha-jornada' : 'entrar');
  const acaoJor = logado ? 'Abrir minha jornada' : 'Começar minha jornada';
  const rotuloFase = { nova: 'Nova', crescente: 'Crescente', cheia: 'Cheia', minguante: 'Minguante' };
  const abrev = { Segunda: 'Seg', 'Terça': 'Ter', Quarta: 'Qua', Quinta: 'Qui', Sexta: 'Sex', 'Sábado': 'Sáb', Domingo: 'Dom' };
  const mins = C.aulas.map((a) => a.min), gratis = C.locais.filter((l) => /^(Gratuito|Grupo gratuito)/.test(l.beneficio)).length;
  const crescente = C.fases.crescente;

  const hero =
  '<section class="tela heroi profundo" aria-labelledby="h-hero">' +
    '<canvas class="esfera" id="esfera-clipse" aria-hidden="true"></canvas>' +
    '<div class="wrap heroi-grade">' +
      '<div class="heroi-texto">' +
        '<h1 class="display" id="h-hero" data-enter style="--i:0">Fitness natural para quem treina, pausa e volta.</h1>' +
        '<p class="lide" data-enter style="--i:1">A Clipse junta aulas curtas, nutricionistas, personais, psicólogos e grupos de treino numa jornada em fases, sem pressa, sem comparação e sem promessa de resultado rápido.</p>' +
        '<div class="acoes" data-enter style="--i:2"><a class="btn btn-pri" href="' + hrefJor + '">' + acaoJor + '</a><a class="btn btn-sec" href="#por-que-natural">Entender o que é natural</a></div>' +
        '<ul class="fatos" data-enter style="--i:3">' +
          '<li><strong>' + C.planos[0].valor + '</strong><span>para começar</span></li>' +
          '<li><strong>' + premium.valor + '</strong><span>por mês no Premium</span></li>' +
          '<li><strong>Curitiba</strong><span>piloto com ' + C.locais.length + ' locais</span></li>' +
        '</ul>' +
      '</div>' +
      '<div class="heroi-lua" data-enter style="--i:2">' +
        '<div class="palco" id="palco" role="slider" tabindex="0" aria-label="Fase da lua. Arraste para os lados ou use as setas." aria-valuemin="1" aria-valuemax="4" aria-valuenow="3" aria-valuetext="Lua cheia">' +
          '<div class="halo" aria-hidden="true"></div>' + luaGrande('lua-heroi', true) +
        '</div>' +
        '<div class="trilho" role="group" aria-label="As quatro fases">' +
          C.ordemFases.map((id) => '<button type="button" class="trilho-item" data-acao="heroi-fase" data-fase="' + id + '" aria-pressed="false">' + luaMini(C.fases[id].p, 22) + '<span>' + rotuloFase[id] + '</span></button>').join('') +
        '</div>' +
        '<p class="legenda-fase" id="legenda-fase" aria-live="polite"></p>' +
      '</div>' +
    '</div>' +
  '</section>';

  const fases =
  '<section class="tela fases" id="fases" aria-labelledby="h-fases"><div class="fases-pino"><div class="wrap fases-grade">' +
    '<div class="fases-lua" aria-hidden="true"><div class="halo"></div>' + luaGrande('lua-fases') + '</div>' +
    '<div class="fases-texto"><h2 id="h-fases">As quatro fases da Clipse</h2>' +
      '<ol class="fases-passos" id="fases-passos">' + C.ordemFases.map((id, i) => { const f = C.fases[id];
        return '<li' + (i === 0 ? ' class="on"' : '') + '><span class="fp-n">Fase ' + (i + 1) + ' de 4</span><h3>' + f.nome + '</h3><p class="fp-s">' + f.curta + '</p><p>' + f.texto + '</p></li>'; }).join('') + '</ol>' +
      '<div class="fases-pontos" id="fases-pontos" aria-hidden="true"><i class="on"></i><i></i><i></i><i></i></div>' +
    '</div>' +
  '</div></div></section>';

  const jornada =
  '<section class="tela" data-theme="lua" aria-labelledby="h-jor"><div class="wrap duas-col">' +
    '<div class="col-texto"><h2 id="h-jor">Minha jornada, em fases e sem cobrança</h2>' +
      '<p class="lide">Escolha a sua fase, faça um check-in de cinco minutos e veja os últimos 28 dias como a lua os veria. Dia sem registro fica em branco.</p>' +
      '<ul class="ticks">' +
        '<li>' + ic('check', 18) + '<span>Check-in com a energia do dia e uma linha sua</span></li>' +
        '<li>' + ic('check', 18) + '<span>Pausa vira Lua nova, e cada volta vira um marco</span></li>' +
        '<li>' + ic('check', 18) + '<span>Diário e objetivos em texto livre, só para você</span></li>' +
      '</ul>' +
      '<div class="acoes"><a class="btn btn-pri" href="' + hrefJor + '">' + acaoJor + '</a>' + (logado ? '' : '<button type="button" class="btn btn-sec" data-acao="exemplo">Ver com perfil de exemplo</button>') + '</div>' +
    '</div>' +
    '<div class="af-cena"><div class="app-frame" data-theme="noite" aria-hidden="true" inert>' +
      '<div class="af-barra"><i></i><i></i><i></i><span>clipse / minha jornada</span></div>' +
      '<div class="af-corpo">' +
        '<div class="af-topo">' + luaMini(crescente.p, 52, 'sol') + '<div><small>Oi, Ana</small><b>' + crescente.nome + '</b><small>' + crescente.curta + '</small></div></div>' +
        '<div class="af-bloco"><p class="af-rotulo">Como está a energia hoje?</p><div class="af-chips"><span class="af-chip">Baixa</span><span class="af-chip">Ok</span><span class="af-chip on">Alta</span></div>' +
          '<p class="af-rotulo">O que rolou hoje?</p><div class="af-chips"><span class="af-chip on">Treinei</span><span class="af-chip">Caminhei</span><span class="af-chip on">Alonguei</span><span class="af-chip">Descansei</span></div></div>' +
        '<div class="af-bloco"><p class="af-rotulo">Últimos 28 dias</p><ol class="ciclo">' + cicloVitrine() + '</ol></div>' +
      '</div>' +
    '</div></div>' +
  '</div></section>';

  const cartao = (href, vis, t, d, loop) => '<li><a class="b-link" href="#' + href + '"' + (loop ? ' data-loop' : '') + '><div class="b-vis" aria-hidden="true">' + vis + '</div><div class="b-txt"><h3>' + t + '</h3><p>' + d + '</p></div></a></li>';
  const reune =
  '<section class="tela" aria-labelledby="h-reune"><div class="wrap">' +
    '<div class="cab-tela"><h2 id="h-reune">O que a Clipse reúne</h2><p class="lide">Conteúdo, pessoas e lugares, todos ligados à fase em que você está.</p></div>' +
    '<ul class="bento">' +
      cartao('por-que-natural', C.aulas.slice(0, 3).map((a) => '<div class="bv-aula"><span class="aula-ic">' + ic('play', 13) + '</span><span>' + a.t + '</span><small>' + a.min + ' min</small></div>').join(''),
        'Aulas curtas', 'Vídeos de ' + Math.min.apply(null, mins) + ' a ' + Math.max.apply(null, mins) + ' minutos, gravados por profissionais, e um guia digital em cinco capítulos.') +
      cartao('programacao', '<div class="bv-semana">' + C.semana.map((e) => '<div class="bv-dia"><i class="' + (e.tipo === 'Presencial' ? 'pr' : e.tipo === 'Ao vivo' ? 'vv' : '') + '"></i><span>' + abrev[e.dia] + '</span></div>').join('') + '</div>',
        'Programação da semana', 'Aula na segunda, corrida no parque na quinta, encontro no sábado. Você participa do que couber.') +
      cartao('profissionais', '<div class="bv-gente">' + C.profissionais.slice(0, 5).map((p) => '<div class="avatar av-' + p.area.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '') + '">' + iniciais(p.nome) + '</div>').join('') + '</div><div class="bv-papeis"><span class="selo">Nutrição</span><span class="selo">Treino</span><span class="selo">Psicologia</span></div>',
        'Profissionais', 'Nutricionistas, personal trainers e psicólogos que respeitam o ponto em que você está.') +
      cartao('minha-jornada', hubSVG(), 'Tudo ligado à sua fase', 'Em cada fase a Clipse sugere aulas, profissionais, grupos e encontros diferentes.', true) +
    '</ul>' +
  '</div></section>';

  const manifesto =
  '<section class="tela manifesto" id="manifesto" aria-labelledby="h-mani"><div class="manifesto-pino"><div class="wrap">' +
    '<h2 id="h-mani">O jeito da Clipse</h2>' +
    '<p class="manifesto-texto" id="manifesto-texto">' + MANIFESTO.split(' ').map((w) => '<span class="w">' + w + '</span>').join(' ') + '</p>' +
  '</div></div></section>';

  const curitiba =
  '<section class="tela" data-theme="lua" aria-labelledby="h-cur"><div class="wrap duas-col">' +
    '<div class="col-texto"><h2 id="h-cur">O piloto é em Curitiba</h2>' +
      '<p class="lide">Encontros gratuitos em parques, academias e clínicas alinhadas ao natural, e grupos para treinar perto de casa.</p>' +
      '<ul class="numeros"><li><strong>' + C.locais.length + '</strong><span>locais no mapa</span></li><li><strong>' + C.grupos.length + '</strong><span>grupos de treino</span></li><li><strong>' + gratis + '</strong><span>encontros gratuitos</span></li></ul>' +
      '<a class="btn btn-sec" href="#curitiba">Ver o mapa de Curitiba</a>' +
    '</div>' +
    '<a class="mapa-card" href="#curitiba" aria-label="Abrir o mapa de Curitiba" data-loop>' + mapaHome() + '</a>' +
  '</div></section>';

  const historias =
  '<section class="tela" aria-labelledby="h-his"><div class="wrap hist-grade">' +
    '<div><h2 id="h-his">Histórias de retorno</h2>' +
      '<figure class="hist-quote"><blockquote>Registrar as minhas voltas me mostrou que eu nunca parei de verdade.</blockquote><figcaption>Aline, personagem ilustrativa. <a href="#historias">Ler as histórias de retorno</a></figcaption></figure></div>' +
    '<div class="hist-lista">' + C.historias.slice(0, 3).map((h) => '<a class="hist-card" href="#historias"><p class="hist-fases">' + luaMini(C.fases[h.de].p, 22) + ic('seta', 14) + luaMini(C.fases[h.para].p, 22) + '<span>' + h.pausa + '</span></p><h3>' + h.t + '</h3><p class="meta">' + h.quem + '</p></a>').join('') + '</div>' +
  '</div></section>';

  const planos =
  '<section class="tela" data-theme="lua" aria-labelledby="h-pl"><div class="wrap">' +
    '<div class="cab-tela"><h2 id="h-pl">Três planos, um deles grátis</h2><p class="lide">Dá para começar de graça e mudar quando fizer sentido. Sem fidelidade.</p></div>' +
    '<div class="planos-m">' + C.planos.map((p) => '<a class="plano-m' + (p.id === 'premium' ? ' pre' : '') + '" href="#planos"><h3>' + p.nome + '</h3><p class="plano-valor"><strong>' + p.valor + '</strong>' + (p.periodo ? '<span>' + p.periodo + '</span>' : '') + '</p><p class="meta">' + p.linha + '</p><ul class="plano-itens">' +
      p.itens.slice(0, 4).map((i) => '<li>' + ic('check', 16) + '<span>' + i + '</span></li>').join('') + '</ul></a>').join('') + '</div>' +
    '<a class="btn btn-sec" href="#planos">Comparar os planos</a>' +
  '</div></section>';

  const fecho =
  '<section class="tela fecho" aria-labelledby="h-fecho">' +
    '<div class="fecho-lua" aria-hidden="true"><div class="halo"></div>' + luaGrande('lua-fecho') + '</div>' +
    '<div class="wrap"><div class="fecho-in"><h2 class="display" id="h-fecho">Como a lua, todo mundo tem fases.</h2><p class="lide">Escolha a sua e comece pelo que couber hoje.</p>' +
      '<div class="acoes"><a class="btn btn-pri" href="' + hrefJor + '">' + acaoJor + '</a><a class="btn btn-sec" href="#planos">Ver os planos</a></div></div></div>' +
  '</section>';

  return hero + fases + jornada + reune + manifesto + curitiba + historias + planos + fecho;
}

function linhaAula(a) {
  const livre = temAcesso(a.plano);
  const vista = estado.logado && estado.aulas.indexOf(a.id) >= 0;
  return '<li><button type="button" class="aula" data-acao="aula" data-id="' + a.id + '">' +
    '<span class="aula-ic' + (livre ? '' : ' travada') + '">' + ic(livre ? 'play' : 'cadeado', 18) + '</span>' +
    '<span class="aula-txt"><span class="aula-t">' + a.t + '</span><span class="aula-meta">' + a.min + ' min, com ' + esc(a.por) + ', ' + esc(a.papel) + '</span></span>' +
    (vista ? '<span class="selo selo-vista">' + ic('check', 14) + 'Assistida</span>' : selo(a.plano)) +
  '</button></li>';
}
function pgNatural() {
  const minGuia = C.guia.reduce((s, g) => s + g.min, 0), mins = C.aulas.map((a) => a.min);
  const primeira = C.aulas[0];
  return '<div class="nat-hero"><div>' + topo('Por que natural', 'Na Clipse, natural é cuidar do corpo sem hormônios, anabolizantes ou canetas emagrecedoras usados só por estética ou desempenho.') + '</div>' +
    '<aside class="nat-def" data-aba="entra"><div class="nat-palco" aria-hidden="true"><div class="nat-lua"></div><div class="nat-cobre"></div></div>' +
      '<p class="nat-frase">Natural é um caminho, e cada pessoa anda nele no próprio ritmo.</p>' +
      '<div class="nat-abas" role="tablist" aria-label="O que a Clipse entende por natural">' +
        '<button type="button" role="tab" id="nat-t-entra" aria-selected="true" aria-controls="nat-p-entra" data-acao="nat-aba" data-id="entra">Quem entra</button>' +
        '<button type="button" role="tab" id="nat-t-medico" aria-selected="false" tabindex="-1" aria-controls="nat-p-medico" data-acao="nat-aba" data-id="medico">Tratamento médico</button></div>' +
      '<div class="nat-paineis"><p role="tabpanel" id="nat-p-entra" aria-labelledby="nat-t-entra">Vale para quem compete no fisiculturismo natural e para quem só quer treinar, correr ou fazer yoga e se sentir bem.</p>' +
      '<p role="tabpanel" id="nat-p-medico" aria-labelledby="nat-t-medico" hidden>É outra conversa. Quem usa hormônio ou medicamento com indicação e acompanhamento segue o que o médico orientou.</p></div></aside></div>' +
  '<section class="bloco tom-claro" data-theme="lua"><div class="nat-cab"><span class="rotulo">' + C.motivos.length + ' motivos</span><h2>Motivos para ficar no natural</h2></div>' +
    '<ol class="nat-cards">' + C.motivos.map((m, i) => '<li><span class="num">' + (i + 1) + '</span><h3>' + m.t + '</h3><p>' + m.d + '</p></li>').join('') +
      '<li class="nat-cta"><h3>Comece pela aula mais curta</h3><p>' + primeira.t + ', com ' + esc(primeira.por) + '. ' + primeira.min + ' minutos.</p><button type="button" class="btn btn-pri btn-p" data-acao="aula" data-id="' + primeira.id + '">' + ic('play', 16) + '<span>Ver a aula</span></button></li></ol>' +
  '</section>' +
  '<section class="bloco painel-risco"><div class="risco-grade"><div class="risco-lado"><h2>O que o antes e depois não mostra</h2>' +
      '<p class="sub">Efeitos associados ao uso de esteroides anabolizantes por estética ou desempenho, sem indicação médica.</p>' +
      '<p class="destaque">Para estética ou desempenho, não existe dose considerada segura. Desde 2023, o Conselho Federal de Medicina proíbe médicos de prescreverem esteroides anabolizantes com essa finalidade.</p>' +
      '<p>Se você usa ou já usou e quer parar, procure um endocrinologista. Parar com acompanhamento é mais seguro.</p>' +
      '<p class="fontes">Fontes: Conselho Federal de Medicina, Resolução nº 2.333/2023. Sociedade Brasileira de Endocrinologia e Metabologia, alertas sobre o uso de anabolizantes para fins estéticos.</p></div>' +
    '<dl class="riscos">' + C.riscos.map((r) => '<div><dt>' + r.t + '</dt><dd>' + r.d + '</dd></div>').join('') + '</dl></div>' +
  '</section>' +
  '<section class="bloco tom-claro" data-theme="lua"><div class="nat-cab"><span class="rotulo">' + C.aulas.length + ' aulas, de ' + Math.min.apply(null, mins) + ' a ' + Math.max.apply(null, mins) + ' minutos</span><h2>Aulas</h2><p class="sub">Vídeos curtos, gravados por profissionais. Cabem no intervalo do almoço.</p></div>' +
    '<ul class="aulas">' + C.aulas.map(linhaAula).join('') + '</ul>' +
  '</section>' +
  '<section class="bloco nat-guia"><div class="nat-cab"><span class="rotulo">' + C.guia.length + ' capítulos, ' + minGuia + ' minutos de leitura</span><h2>Guia digital</h2><p class="sub">Cinco capítulos para ler no seu tempo. A versão completa em PDF entra na próxima etapa do projeto.</p><a class="btn btn-sec" href="#guia">Abrir o guia</a></div>' +
    '<div class="acordeao">' + C.guia.map((g, i) => '<details><summary><span class="num">' + (i + 1) + '</span><span class="sum-t">' + g.t + '</span><span class="sum-m">' + g.min + ' min</span>' + ic('baixo', 18) + '</summary><p>' + g.d + '</p></details>').join('') + '</div>' +
  '</section>';
}
function linhaEvento(e, quando) {
  const on = estado.logado && estado.salvos.eventos.indexOf(e.id) >= 0;
  return '<li class="evento">' +
    '<div class="ev-quando">' + quando + '</div>' +
    '<div class="ev-txt"><h3>' + e.t + '</h3><p>' + e.d + '</p><p class="meta">' + (e.tipo ? e.tipo + ', ' : '') + esc(e.onde) + '</p></div>' +
    '<div class="ev-lado">' + selo(e.plano) +
      '<button type="button" class="btn btn-sec btn-p' + (on ? ' on' : '') + '" data-acao="salvar" data-tipo="eventos" data-id="' + e.id + '" aria-pressed="' + on + '">' + (on ? ic('check', 16) : '') + '<span>' + (on ? 'Na minha rede' : 'Tenho interesse') + '</span></button>' +
    '</div></li>';
}
function pgProgramacao() {
  return topo('Programação', 'A semana da Clipse tem um ritmo fixo. Você participa do que couber na sua.') +
  '<section class="bloco"><h2>Toda semana</h2>' +
    '<ul class="eventos">' + C.semana.map((e) => linhaEvento(e, '<strong>' + e.dia + '</strong><span>' + e.hora + '</span>')).join('') + '</ul>' +
  '</section>' +
  '<section class="bloco"><h2>O tema de cada semana</h2><p class="sub">O conteúdo gira em um ciclo de quatro semanas. Aula, leitura e encontros seguem o tema.</p>' +
    '<ol class="temas">' + C.temas.map((t, i) => '<li><span class="tema-n">Semana ' + (i + 1) + '</span><h3>' + t.t + '</h3><p>' + t.d + '</p></li>').join('') + '</ol>' +
  '</section>' +
  '<section class="bloco"><h2>Uma vez por mês</h2>' +
    '<ul class="eventos">' + C.mensais.map((e) => linhaEvento(e, '<span>' + e.quando + '</span>')).join('') + '</ul>' +
  '</section>' +
  notaIlustrativa('Programação ilustrativa. Horários e locais serão definidos com os parceiros.');
}

function iniciais(nome) { return nome.split(' ').map((p) => p[0]).slice(0, 2).join(''); }
function pgProfissionais() {
  const areas = ['Todos', 'Nutrição', 'Treino', 'Psicologia'];
  const lista = C.profissionais.filter((p) => filtroProf === 'Todos' || p.area === filtroProf);
  return topo('Profissionais', 'Nutricionistas, personal trainers e psicólogos que trabalham sem atalho e respeitam a sua fase.') +
  '<div class="filtros" role="group" aria-label="Filtrar por área">' + areas.map((a) => '<button type="button" class="filtro" data-acao="filtro-prof" data-id="' + a + '" aria-pressed="' + (filtroProf === a) + '">' + a + '</button>').join('') + '</div>' +
  '<h2 class="oculto">Pessoas do time</h2><ul class="gente">' + lista.map((p) =>
    '<li class="pessoa"><div class="avatar av-' + p.area.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '') + '" aria-hidden="true">' + iniciais(p.nome) + '</div>' +
    '<div class="pessoa-txt"><h3>' + p.nome + '</h3><p class="papel">' + p.papel + '</p><p>' + p.foco + '</p><p class="meta">' + p.onde + '</p>' +
    '<div class="acoes"><button type="button" class="btn btn-sec btn-p" data-acao="prof" data-id="' + p.id + '">Ver perfil</button>' + botaoSalvar('profissionais', p.id) + '</div></div></li>').join('') + '</ul>' +
  '<section class="bloco prosa"><h2>Como funciona o acompanhamento</h2>' +
    '<p>No Premium, os profissionais aparecem nas aulas, nos encontros ao vivo e na aula geral mensal de psicologia.</p>' +
    '<p>No Diamond, nutricionista e personal acompanham você de perto, com plano e treino ajustados à fase da sua lua. As aulas de psicologia são coletivas e não substituem terapia.</p>' +
    '<a class="btn btn-sec" href="#planos">Ver os planos</a>' +
  '</section>' +
  notaIlustrativa('Perfis ilustrativos. Os nomes são fictícios.');
}

function pgPlanos() {
  const atual = planoAtual();
  const marca = (v) => (v === true ? '<span class="sim">' + ic('check', 16) + '<span class="oculto">Incluído</span></span>' : v === false ? '<span class="nao"><span aria-hidden="true">–</span><span class="oculto">Não incluído</span></span>' : esc(v));
  return topo('Planos', 'Dá para começar de graça e mudar quando fizer sentido. Sem fidelidade.') +
  '<ul class="planos">' + C.planos.map((p) => {
    const seu = estado.logado && atual === p.id;
    return '<li class="plano plano-' + p.id + (seu ? ' seu' : '') + '">' +
      '<div class="plano-topo"><h2>' + p.nome + '</h2>' + (seu ? '<span class="selo selo-seu">Seu plano</span>' : '') + '</div>' +
      '<p class="plano-linha">' + p.linha + '</p>' +
      '<p class="plano-valor"><strong>' + p.valor + '</strong>' + (p.periodo ? '<span>' + p.periodo + '</span>' : '') + '</p>' +
      '<ul class="plano-itens">' + p.itens.map((i) => '<li>' + ic('check', 16) + '<span>' + i + '</span></li>').join('') + '</ul>' +
      (seu ? '' : '<button type="button" class="btn ' + (p.id === 'premium' ? 'btn-pri' : 'btn-sec') + '" data-acao="plano" data-id="' + p.id + '">Escolher ' + p.nome + '</button>') +
    '</li>';
  }).join('') + '</ul>' +
  '<section class="bloco"><h2>O que entra em cada plano</h2>' +
    '<div class="rolagem"><table class="comparativo"><thead><tr><th scope="col">Recurso</th>' + C.planos.map((p) => '<th scope="col">' + p.nome + '</th>').join('') + '</tr></thead>' +
    '<tbody>' + C.comparativo.map((l) => '<tr><th scope="row">' + l[0] + '</th><td>' + marca(l[1]) + '</td><td>' + marca(l[2]) + '</td><td>' + marca(l[3]) + '</td></tr>').join('') + '</tbody></table></div>' +
  '</section>' +
  notaIlustrativa('Valores ilustrativos. Neste protótipo a troca de plano é simulada e nada é cobrado.');
}

const FORMA_PINO = {
  parque: (x, y) => '<circle class="pino-forma" cx="' + x + '" cy="' + y + '" r="6.5"/>',
  corrida: (x, y) => '<path class="pino-forma" d="M' + x + ' ' + (y - 8) + 'l7.5 13h-15z"/>',
  academia: (x, y) => '<rect class="pino-forma" x="' + (x - 6) + '" y="' + (y - 6) + '" width="12" height="12" rx="2.5"/>',
  saude: (x, y) => '<path class="pino-forma" d="M' + (x - 2.6) + ' ' + (y - 7.5) + 'h5.2v4.9h4.9v5.2h-4.9v4.9h-5.2v-4.9h-4.9v-5.2h4.9z"/>'
};
function locaisVisiveis() { return C.locais.filter((l) => filtroLocal === 'todos' || l.cat === filtroLocal); }
function mapaBase() {
  return '<g class="mapa-aneis" aria-hidden="true"><circle cx="160" cy="160" r="46"/><circle cx="160" cy="160" r="92"/><circle cx="160" cy="160" r="138"/></g>' +
    '<g class="mapa-bairros" aria-hidden="true">' + C.bairrosMapa.map((b) => '<text x="' + b.x + '" y="' + b.y + '">' + b.t + '</text>').join('') + '</g>' +
    '<g class="mapa-norte" aria-hidden="true"><path d="M296 34V16m0 0-5 7m5-7 5 7"/><text x="296" y="48">N</text></g>';
}
function mapaHome() {
  return '<svg class="mapa" viewBox="0 0 320 300" aria-hidden="true" focusable="false">' + mapaBase() +
    C.locais.map((l, i) => '<g class="pino-h" style="--d:' + (i * 0.2).toFixed(1) + 's"><circle class="pino-onda" cx="' + l.x + '" cy="' + l.y + '" r="7"/>' + FORMA_PINO[l.cat](l.x, l.y) + '</g>').join('') + '</svg>';
}
function mapaSVG() {
  return '<svg class="mapa" viewBox="0 0 320 300" role="group" aria-label="Mapa esquemático de Curitiba com os locais parceiros">' + mapaBase() +
    locaisVisiveis().map((l) => '<g class="pino' + (l.id === selLocal ? ' on' : '') + '" data-acao="local" data-id="' + l.id + '" role="button" tabindex="0" aria-label="' + esc(l.nome) + ', ' + esc(l.bairro) + '" aria-pressed="' + (l.id === selLocal) + '">' +
      '<circle class="pino-toque" cx="' + l.x + '" cy="' + l.y + '" r="15"/>' + (l.id === selLocal ? '<circle class="pino-anel" cx="' + l.x + '" cy="' + l.y + '" r="13"/>' : '') + FORMA_PINO[l.cat](l.x, l.y) + '</g>').join('') +
  '</svg>';
}
function detalheLocal() {
  const l = C.locais.find((x) => x.id === selLocal);
  if (!l || (filtroLocal !== 'todos' && l.cat !== filtroLocal)) return '<p class="local-dica">Toque em um ponto do mapa ou em um item da lista para ver os detalhes.</p>';
  return '<div class="local-det"><p class="papel">' + C.categoriasLocal[l.cat] + ', ' + esc(l.bairro) + '</p><h3>' + l.nome + '</h3><p>' + l.d + '</p><p class="beneficio">' + l.beneficio + '</p>' + botaoSalvar('locais', l.id) + '</div>';
}
function pgCuritiba() {
  const cats = [['todos', 'Todos']].concat(Object.keys(C.categoriasLocal).map((k) => [k, C.categoriasLocal[k]]));
  return topo('Curitiba', 'O piloto da Clipse acontece aqui. Parques com encontros gratuitos e espaços parceiros alinhados ao natural.') +
  '<div class="filtros" role="group" aria-label="Filtrar por tipo de local">' + cats.map((c) => '<button type="button" class="filtro" data-acao="filtro-local" data-id="' + c[0] + '" aria-pressed="' + (filtroLocal === c[0]) + '">' + (c[0] !== 'todos' ? '<svg class="leg" width="14" height="14" viewBox="-9 -9 18 18" aria-hidden="true">' + FORMA_PINO[c[0]](0, 0) + '</svg>' : '') + c[1] + '</button>').join('') + '</div>' +
  '<div class="cidade">' +
    '<div class="cidade-mapa" id="cidade-mapa">' + mapaSVG() + '<p class="meta">Mapa esquemático, fora de escala.</p><div id="local-detalhe" aria-live="polite">' + detalheLocal() + '</div></div>' +
    '<ul class="locais">' + locaisVisiveis().map((l) => '<li><button type="button" class="local' + (l.id === selLocal ? ' on' : '') + '" data-acao="local" data-id="' + l.id + '" data-rolar="1" aria-pressed="' + (l.id === selLocal) + '">' +
      '<svg class="leg" width="16" height="16" viewBox="-9 -9 18 18" aria-hidden="true">' + FORMA_PINO[l.cat](0, 0) + '</svg>' +
      '<span class="local-txt"><span class="local-nome">' + l.nome + '</span><span class="meta">' + esc(l.bairro) + '</span></span><span class="local-ben">' + l.beneficio + '</span></button></li>').join('') + '</ul>' +
  '</div>' +
  '<section class="bloco faixa"><div><h2>Tem um espaço em Curitiba?</h2><p>Academias, estúdios, clínicas e grupos gratuitos podem entrar no mapa.</p><a class="btn btn-sec" href="#seja-parceiro">Seja parceiro</a></div></section>' +
  notaIlustrativa('Parceiros ilustrativos. Os parques são reais, e os encontros neles são propostas do projeto.');
}

function pgComunidade() {
  return topo('Comunidade', 'Grupos para praticar junto, por afinidade e por região. Entrar é uma escolha sua: dá para viver a Clipse só com a sua rotina.') +
  '<section class="bloco"><h2>Como os grupos funcionam</h2>' +
    '<ul class="lista-ideias tres">' +
      '<li><h3>Sem ranking</h3><p>Ninguém posta número, tempo ou carga para comparar.</p></li>' +
      '<li><h3>Sem cobrança por presença</h3><p>Quem some por um tempo é recebido de volta do mesmo jeito.</p></li>' +
      '<li><h3>Quem tem constância acompanha</h3><p>Em cada grupo, algumas pessoas se oferecem para treinar com quem está voltando.</p></li>' +
    '</ul>' +
  '</section>' +
  '<section class="bloco"><h2>Grupos em Curitiba e online</h2>' +
    '<ul class="grupos">' + C.grupos.map((g) => {
      const on = estado.logado && estado.salvos.grupos.indexOf(g.id) >= 0;
      return '<li class="grupo' + (on ? ' on' : '') + '"><div class="grupo-txt"><p class="papel">' + g.ativ + ', ritmo ' + g.ritmo.toLowerCase() + '</p><h3>' + g.nome + '</h3><p>' + g.d + '</p>' +
        '<p class="meta">' + esc(g.regiao) + '. ' + g.quando + '.</p><p class="grupo-gente">' + luaMini(0.25, 16) + '<span>' + g.gente + ' pessoas, ' + g.voltando + ' voltando agora</span></p></div>' +
        '<button type="button" class="btn btn-sec' + (on ? ' on' : '') + ' btn-p" data-acao="grupo" data-id="' + g.id + '" aria-pressed="' + on + '">' + (on ? 'Sair do grupo' : 'Entrar no grupo') + '</button></li>';
    }).join('') + '</ul>' +
  '</section>' +
  notaIlustrativa('Grupos e números ilustrativos. A participação em grupos faz parte do Premium.');
}

/* ── Minha jornada ── */
function faseNoDia(dia, hist) { let f = null; for (const h of (hist || estado.historico)) { if (h.data <= dia) f = h.fase; else break; } return f; }
function desdeQuando() { const h = estado.historico; for (let i = h.length - 1; i >= 0; i--) { if (h[i].fase === estado.fase) { let j = i; while (j > 0 && h[j - 1].fase === estado.fase) j--; return h[j].data; } } return hojeISO(); }
const SUGESTOES = {
  cheia: [['aula', 'a8', 'Aula: Treinar para os próximos 30 anos'], ['pg', 'comunidade', 'Grupos para treinar junto'], ['pg', 'programacao', 'A programação desta semana']],
  minguante: [['aula', 'a5', 'Aula: Rotina puxada, o mínimo que mantém você por perto'], ['pg', 'curitiba', 'Encontros abertos perto de você'], ['aula', 'a2', 'Aula: Tempo também é resultado']],
  nova: [['aula', 'a2', 'Aula: Tempo também é resultado'], ['pg', 'historias', 'Histórias de quem parou e voltou'], ['aula', 'a7', 'Aula: Com quem você está se comparando?']],
  crescente: [['aula', 'a4', 'Aula: Voltando depois de uma pausa'], ['pg', 'programacao', 'Encontro de volta, no último sábado do mês'], ['pg', 'profissionais', 'Profissionais que acompanham retomadas']]
};
function bloqueioInline(msg) {
  return '<div class="bloqueio">' + ic('cadeado', 22) + '<div><p><strong>' + msg + '</strong></p><p class="meta">Neste protótipo a troca de plano é simulada. Nada é cobrado.</p>' +
    '<div class="acoes"><button type="button" class="btn btn-pri btn-p" data-acao="plano" data-id="premium">Simular Premium</button><a class="btn btn-sec btn-p" href="#planos">Ver planos</a></div></div></div>';
}
function jHoje() {
  const hoje = hojeISO(), ck = estado.checkins[hoje] || {}, fez = ck.fez || [];
  const energias = [['baixa', 'Baixa'], ['ok', 'Ok'], ['alta', 'Alta']];
  const feitos = ['Treinei', 'Caminhei', 'Alonguei', 'Descansei'];
  return '' +
  '<section class="bloco-j"><h2>Para a sua fase</h2><ul class="sugestoes">' + (SUGESTOES[estado.fase] || []).map((s) =>
    s[0] === 'aula' ? '<li><button type="button" class="sugestao" data-acao="aula" data-id="' + s[1] + '"><span>' + s[2] + '</span>' + ic('seta', 16) + '</button></li>'
                    : '<li><a class="sugestao" href="#' + s[1] + '"><span>' + s[2] + '</span>' + ic('seta', 16) + '</a></li>').join('') + '</ul></section>' +
  '<section class="bloco-j"><h2>Check-in de hoje</h2>' +
    '<form class="checkin" data-form="checkin">' +
      '<fieldset><legend>Como está a energia?</legend><div class="segmento">' + energias.map((e) => '<input type="radio" name="energia" id="en-' + e[0] + '" value="' + e[0] + '"' + (ck.energia === e[0] ? ' checked' : '') + '><label for="en-' + e[0] + '">' + e[1] + '</label>').join('') + '</div></fieldset>' +
      '<fieldset><legend>O que rolou hoje?</legend><div class="chips">' + feitos.map((f, i) => '<input type="checkbox" name="fez" id="fz-' + i + '" value="' + f + '"' + (fez.indexOf(f) >= 0 ? ' checked' : '') + '><label for="fz-' + i + '">' + f + '</label>').join('') + '</div></fieldset>' +
      '<label for="ck-nota">Uma linha sobre o dia (opcional)</label><input type="text" id="ck-nota" name="nota" maxlength="140" value="' + esc(ck.nota || '') + '">' +
      '<div class="acoes"><button class="btn btn-pri">' + (estado.checkins[hoje] ? 'Atualizar check-in' : 'Salvar check-in') + '</button></div>' +
      '<p class="meta">Tudo aqui é opcional. Dia sem registro fica em branco, sem cobrança.</p>' +
    '</form></section>' +
  '<section class="bloco-j"><h2>Objetivos</h2><p class="sub">Em texto livre, do seu jeito. Nenhum número é obrigatório.</p>' +
    (estado.objetivos.length ? '<ul class="objetivos">' + estado.objetivos.map((o) =>
      '<li class="' + (o.rotina ? 'feito' : '') + '"><button type="button" class="obj-marca" data-acao="toggle-objetivo" data-id="' + esc(o.id) + '" aria-pressed="' + !!o.rotina + '" aria-label="Já faz parte da rotina">' + ic('check', 16) + '</button>' +
      '<span class="obj-t">' + esc(o.texto) + (o.rotina ? '<span class="meta">Já faz parte da rotina</span>' : '') + '</span>' +
      '<button type="button" class="btn-x" data-acao="del-objetivo" data-id="' + esc(o.id) + '" aria-label="Remover objetivo">' + ic('fechar', 16) + '</button></li>').join('') + '</ul>' : '') +
    '<form class="linha-form" data-form="objetivo"><label class="oculto" for="obj-novo">Novo objetivo</label><input type="text" id="obj-novo" name="texto" maxlength="120" placeholder="Ex.: subir a escada do prédio sem cansar" required><button class="btn btn-sec">Adicionar</button></form>' +
  '</section>';
}
function jCiclo() {
  if (!temAcesso('premium')) return bloqueioInline('O ciclo de 28 dias e as voltas fazem parte do Premium.');
  const hoje = hojeISO(); let cel = '';
  for (let i = 27; i >= 0; i--) {
    const dia = diasAtras(i), f = faseNoDia(dia), ck = estado.checkins[dia];
    cel += '<li class="' + (dia === hoje ? 'hoje' : '') + '"><span class="ciclo-lua">' + (f ? luaMini(C.fases[f].p, 26) : '<span class="lua-vazia"></span>') + '</span>' +
      '<span class="ciclo-dia" aria-hidden="true">' + deISO(dia).getDate() + '</span>' + (ck ? '<span class="ciclo-ponto" aria-hidden="true"></span>' : '') +
      '<span class="oculto">' + dataLonga(dia) + ': ' + (f ? C.fases[f].nome : 'sem fase registrada') + (ck ? ', com check-in' : '') + '</span></li>';
  }
  const voltas = estado.voltas.slice().reverse();
  const hist = estado.historico.slice().reverse();
  return '' +
  '<section class="bloco-j"><h2>Últimos 28 dias</h2><ol class="ciclo">' + cel + '</ol>' +
    '<p class="meta">O ponto marca os dias com check-in. Dias sem registro ficam em branco. Aqui não tem sequência para manter.</p></section>' +
  '<section class="bloco-j"><h2>Voltas</h2>' +
    (voltas.length ? '<ul class="voltas">' + voltas.map((v) => '<li>' + luaMini(0, 20) + ic('seta', 14) + luaMini(0.25, 20) + '<span><strong>' + dataLonga(v.data) + '</strong>' + (v.dias ? ' depois de ' + v.dias + (v.dias === 1 ? ' dia' : ' dias') + ' de pausa' : '') + '</span></li>').join('') + '</ul>'
                   : '<p class="vazio">Nenhuma volta registrada ainda. Ela aparece aqui quando você sair da Lua nova.</p>') +
  '</section>' +
  '<section class="bloco-j"><h2>Suas fases</h2><ul class="historico">' + hist.map((h) => '<li>' + luaMini(C.fases[h.fase].p, 20) + '<span><strong>' + C.fases[h.fase].nome + '</strong> desde ' + dataLonga(h.data) + (h.motivo ? '<span class="meta">Motivo: ' + esc(h.motivo) + (h.nota ? '. ' + esc(h.nota) : '') + '</span>' : (h.nota ? '<span class="meta">' + esc(h.nota) + '</span>' : '')) + '</span></li>').join('') + '</ul></section>';
}
function jDiario() {
  if (!temAcesso('premium')) return bloqueioInline('O diário faz parte do Premium.');
  return '' +
  '<section class="bloco-j"><h2>Diário</h2><p class="sub">Anotações livres. Só você vê.</p>' +
    '<form class="form" data-form="diario"><label for="di-texto">O que você quer guardar de hoje?</label><textarea id="di-texto" name="texto" rows="3" maxlength="600" required></textarea>' +
      '<label for="di-foto">Foto (opcional)</label><input type="file" id="di-foto" name="foto" accept="image/png,image/jpeg,image/webp">' +
      '<div class="acoes"><button class="btn btn-pri">Guardar no diário</button></div></form>' +
    (estado.diario.length ? '<ul class="diario">' + estado.diario.map((d) =>
      '<li><div class="di-topo"><time datetime="' + esc(d.data) + '">' + dataLonga(d.data) + '</time><button type="button" class="btn-x" data-acao="del-diario" data-id="' + esc(d.id) + '" aria-label="Apagar anotação">' + ic('fechar', 16) + '</button></div>' +
      '<p>' + esc(d.texto) + '</p>' + (d.foto && /^data:image\//.test(d.foto) ? '<img class="di-foto" src="' + esc(d.foto) + '" alt="Foto da anotação">' : '') + '</li>').join('') + '</ul>'
      : '<p class="vazio">Seu diário está vazio. A primeira anotação pode ser uma frase.</p>') +
  '</section>';
}
function jRede() {
  const s = estado.salvos;
  const grupo = (titulo, itens, vazio, link) => '<section class="bloco-j"><h2>' + titulo + '</h2>' + (itens.length ? '<ul class="rede">' + itens.join('') + '</ul>' : '<p class="vazio">' + vazio + ' <a href="#' + link[0] + '">' + link[1] + '</a></p>') + '</section>';
  const item = (tipo, id, nome, meta) => '<li><span class="rede-t"><strong>' + nome + '</strong><span class="meta">' + meta + '</span></span><button type="button" class="btn-x" data-acao="tirar-salvo" data-tipo="' + tipo + '" data-id="' + id + '" aria-label="Tirar da minha rede">' + ic('fechar', 16) + '</button></li>';
  const profs = s.profissionais.map((id) => C.profissionais.find((p) => p.id === id)).filter(Boolean).map((p) => item('profissionais', p.id, p.nome, p.papel));
  const locais = s.locais.map((id) => C.locais.find((p) => p.id === id)).filter(Boolean).map((l) => item('locais', l.id, l.nome, esc(l.bairro)));
  const grupos = s.grupos.map((id) => C.grupos.find((p) => p.id === id)).filter(Boolean).map((g) => item('grupos', g.id, g.nome, g.quando));
  const todosEv = C.semana.concat(C.mensais);
  const eventos = s.eventos.map((id) => todosEv.find((p) => p.id === id)).filter(Boolean).map((e) => item('eventos', e.id, e.t, e.dia ? e.dia + ', ' + e.hora : e.quando));
  return grupo('Profissionais', profs, 'Nenhum profissional salvo.', ['profissionais', 'Conhecer os profissionais']) +
    grupo('Lugares', locais, 'Nenhum lugar salvo.', ['curitiba', 'Abrir o mapa de Curitiba']) +
    grupo('Grupos', grupos, 'Você não está em nenhum grupo, e tudo bem.', ['comunidade', 'Ver os grupos']) +
    grupo('Programação', eventos, 'Nenhum evento marcado.', ['programacao', 'Ver a programação']) +
    '<section class="bloco-j conta"><h2>Conta</h2>' +
      '<p>Plano ' + nomePlano(estado.plano) + '. <a href="#planos">Mudar de plano</a></p>' +
      '<p class="meta">Login simulado. Sua jornada fica salva só neste navegador.</p>' +
      '<div class="acoes"><button type="button" class="btn btn-sec btn-p" data-acao="sair">Sair</button><button type="button" class="btn btn-perigo btn-p" data-acao="apagar">Apagar minha jornada</button></div>' +
    '</section>';
}
function pgJornada() {
  if (!estado.logado) {
    return topo('Minha jornada', 'Um registro do seu caminho em fases. Sem sequência obrigatória, sem ranking e sem meta imposta.') +
    '<section class="bloco"><ul class="lista-ideias">' +
      '<li><h3>Sua fase</h3><p>Lua cheia, minguante, nova ou crescente. Você escolhe e troca quando quiser.</p></li>' +
      '<li><h3>Check-in leve</h3><p>Como está a energia e o que rolou no dia. Tudo opcional.</p></li>' +
      '<li><h3>Pausas e voltas</h3><p>A pausa entra no ciclo. Cada volta vira um marco.</p></li>' +
      '<li><h3>Diário e objetivos</h3><p>Em texto livre, só para você.</p></li>' +
    '</ul><div class="acoes"><a class="btn btn-pri" href="#entrar">Entrar</a><button type="button" class="btn btn-sec" data-acao="exemplo">Ver com perfil de exemplo</button></div></section>';
  }
  const f = C.fases[estado.fase];
  const abas = [['hoje', 'Hoje'], ['ciclo', 'Ciclo'], ['diario', 'Diário'], ['rede', 'Rede']];
  const painel = { hoje: jHoje, ciclo: jCiclo, diario: jDiario, rede: jRede }[abaJornada]();
  return '' +
  '<section class="jornada-topo">' +
    '<div class="jt-lua"><div class="halo" aria-hidden="true"></div>' + luaGrande('lua-jornada') + '</div>' +
    '<div class="jt-txt"><p class="ola">Oi, ' + esc(primeiroNome()) + (estado.exemplo ? ' <span class="selo">Perfil de exemplo</span>' : '') + '</p>' +
      '<h1>' + f.nome + '</h1><p class="lide">' + f.curta + '. ' + f.texto + '</p>' +
      '<p class="meta">Nesta fase desde ' + dataLonga(desdeQuando()) + '.</p>' +
      '<button type="button" class="btn btn-sec" data-acao="mudar-fase">Mudar fase</button></div>' +
  '</section>' +
  '<div class="abas" role="tablist" aria-label="Seções da jornada">' + abas.map((a) => '<button type="button" role="tab" id="aba-' + a[0] + '" aria-selected="' + (abaJornada === a[0]) + '" aria-controls="painel-jornada" tabindex="' + (abaJornada === a[0] ? 0 : -1) + '" data-acao="aba-jornada" data-id="' + a[0] + '">' + a[1] + '</button>').join('') + '</div>' +
  '<div id="painel-jornada" role="tabpanel" aria-labelledby="aba-' + abaJornada + '">' + painel + '</div>';
}

function cartaoProduto(p, i) {
  const src = fotoSrc(p);
  return '<li class="prod"><div class="prod-img"><div class="prod-arte" aria-hidden="true">' + luaMini([0.5, 0.25, 0.75, 0.12, 0.38, 0.62, 0.88][i % 7], 72) + '</div>' +
    (src ? '<img src="' + esc(src) + '" alt="" loading="lazy" data-some="1">' : '') + '</div>' +
    '<h3>' + esc(p.nome) + '</h3><p class="prod-cat">' + esc(p.categoria || '') + '</p>' + (p.descricao ? '<p class="prod-desc">' + esc(p.descricao) + '</p>' : '') +
    '<p class="prod-valor">' + preco(p.valor) + '</p>' +
    (gerindo ? '<button type="button" class="btn btn-sec btn-p" data-acao="produto-editar" data-id="' + esc(p.id) + '">Editar</button>' : '') + '</li>';
}
function pgProdutos() {
  const st = Nuvem.estado, lista = produtosAtuais();
  const podeGerir = st === 'compartilhado' || st === 'local';
  if (!podeGerir) gerindo = false;
  let corpo;
  if (st === 'aguardando') corpo = '<ul class="vitrine" aria-busy="true">' + [1, 2, 3, 4].map(() => '<li class="prod esqueleto"><div class="prod-img"></div><div class="esq-l"></div><div class="esq-l curta"></div></li>').join('') + '</ul><p class="meta">Carregando a vitrine.</p>';
  else if (!lista.length) corpo = '<p class="vazio">' + (podeGerir ? 'A vitrine está vazia. Adicione o primeiro produto.' : 'A vitrine ainda não tem produtos.') + '</p>';
  else corpo = '<ul class="vitrine">' + lista.map(cartaoProduto).join('') + '</ul>';
  const nota = { compartilhado: 'O que você salvar aqui aparece para todo mundo que abrir o site.', local: 'Modo local: as mudanças ficam salvas só neste navegador.', indisponivel: 'Não deu para carregar a vitrine agora. Estes são produtos de exemplo.' }[st] || '';
  return topo('Produtos', 'A vitrine da Clipse. Por enquanto é só para ver: a venda entra numa próxima etapa.') +
    (podeGerir ? '<div class="painel-gerir"><div><strong>Painel da vitrine</strong><p class="meta">' + nota + '</p></div><div class="acoes">' +
      (gerindo ? '<button type="button" class="btn btn-pri btn-p" data-acao="produto-novo">' + ic('soma', 16) + '<span>Adicionar produto</span></button>' : '') +
      '<button type="button" class="btn btn-sec btn-p" data-acao="gerir" aria-pressed="' + gerindo + '">' + (gerindo ? 'Concluir' : 'Gerenciar vitrine') + '</button></div></div>'
      : (nota ? '<p class="meta">' + nota + '</p>' : '')) +
    '<section class="bloco"><h2 class="oculto">Produtos da vitrine</h2>' + corpo + '</section>' +
    notaIlustrativa('Produtos e valores ilustrativos.');
}

function pgParceiro() {
  const p = estado.parceiro;
  const tipos = ['Academia ou estúdio', 'Clínica ou consultório', 'Profissional autônomo', 'Grupo ou projeto gratuito', 'Outro'];
  const form = p
    ? '<div class="confirmado" role="status"><h3>Interesse registrado neste protótipo</h3><p>Nada foi enviado. Na versão final, a equipe Clipse recebe estes dados e responde em até três dias úteis.</p>' +
      '<dl class="resumo"><div><dt>Espaço</dt><dd>' + esc(p.negocio) + '</dd></div><div><dt>Tipo</dt><dd>' + esc(p.tipo) + '</dd></div>' + (p.bairro ? '<div><dt>Bairro</dt><dd>' + esc(p.bairro) + '</dd></div>' : '') + '<div><dt>Contato</dt><dd>' + esc(p.contato) + '</dd></div></dl>' +
      '<button type="button" class="btn btn-sec btn-p" data-acao="parceiro-editar">Editar dados</button></div>'
    : '<form class="form" data-form="parceiro">' +
      '<label for="pa-negocio">Nome do espaço ou do profissional</label><input type="text" id="pa-negocio" name="negocio" maxlength="80" required>' +
      '<div class="duas"><div><label for="pa-tipo">Tipo</label><select id="pa-tipo" name="tipo">' + tipos.map((t) => '<option>' + t + '</option>').join('') + '</select></div>' +
      '<div><label for="pa-bairro">Bairro</label><input type="text" id="pa-bairro" name="bairro" maxlength="40"></div></div>' +
      '<label for="pa-contato">E-mail ou WhatsApp para retorno</label><input type="text" id="pa-contato" name="contato" maxlength="80" required>' +
      '<label for="pa-msg">Conte um pouco sobre o espaço (opcional)</label><textarea id="pa-msg" name="msg" rows="3" maxlength="500"></textarea>' +
      '<div class="acoes"><button class="btn btn-pri">Registrar interesse</button></div>' +
      '<p class="meta">Protótipo: os dados ficam só neste navegador e nada é enviado.</p></form>';
  return topo('Seja parceiro', 'Para academias, estúdios, clínicas, profissionais e grupos de Curitiba que acreditam em treino sem atalho.') +
  '<section class="bloco"><h2>O que o parceiro ganha</h2><ul class="lista-ideias tres">' +
    '<li><h3>Lugar no mapa</h3><p>Seu espaço aparece na página de Curitiba e na programação.</p></li>' +
    '<li><h3>Gente chegando com contexto</h3><p>Pessoas indicadas pela comunidade, muitas voltando a treinar.</p></li>' +
    '<li><h3>Um posicionamento claro</h3><p>O selo de espaço alinhado ao natural diz o que você defende.</p></li></ul></section>' +
  '<section class="bloco"><h2>Como funciona</h2><ol class="passos">' +
    '<li><h3>Você conta sobre o seu espaço</h3><p>Pelo formulário desta página.</p></li>' +
    '<li><h3>A equipe Clipse conversa com você</h3><p>Para entender o trabalho e conferir o alinhamento com o natural.</p></li>' +
    '<li><h3>Seu espaço entra no ar</h3><p>No mapa, na programação e na rede dos membros.</p></li></ol></section>' +
  '<section class="bloco"><h2>Duas formas de participar</h2><ul class="lista-ideias">' +
    '<li><h3>Parceiro com benefício</h3><p>Você oferece um desconto ou uma condição especial aos membros. Sem mensalidade.</p></li>' +
    '<li><h3>Parceiro em destaque</h3><p>Uma mensalidade fixa coloca o espaço em destaque no mapa e traz eventos da programação para dentro dele.</p></li></ul>' +
    '<p class="meta">Modelo em estudo no projeto.</p></section>' +
  '<section class="bloco prosa"><h2>O que a Clipse pede</h2><p>Não vender nem indicar hormônios ou anabolizantes para estética, e receber sem cobrança quem está voltando.</p></section>' +
  '<section class="bloco"><h2>Quero ser parceiro</h2>' + form + '</section>';
}

function pgHistorias() {
  return topo('Histórias de retorno', 'Parar acontece com quase todo mundo. Aqui, quem voltou conta como foi.') +
  notaIlustrativa('Histórias ilustrativas, inspiradas nos perfis que apareceram na pesquisa do projeto. Os nomes e os relatos são fictícios.') +
  '<ul class="historias">' + C.historias.map((h) =>
    '<li><article><p class="hist-fases">' + luaMini(C.fases[h.de].p, 22) + ic('seta', 14) + luaMini(C.fases[h.para].p, 22) + '<span>' + h.pausa + '</span></p>' +
    '<h2>' + h.t + '</h2><p>' + h.d + '</p><p class="meta">' + h.quem + '</p></article></li>').join('') + '</ul>' +
  '<section class="bloco faixa"><div><h2>A sua volta também conta</h2><p>Na sua jornada, cada volta fica registrada como um marco.</p><a class="btn btn-pri" href="#minha-jornada">Abrir minha jornada</a></div></section>';
}

function pgPerguntas() {
  return topo('Perguntas frequentes', 'O que a Clipse é, como funciona e o que ela não promete.') +
  '<div class="acordeao faq">' + C.perguntas.map((q) => '<details><summary><span class="sum-t">' + q.p + '</span>' + ic('baixo', 18) + '</summary><p>' + q.r + '</p></details>').join('') + '</div>' +
  '<section class="bloco faixa"><div><h2>Ficou alguma dúvida?</h2><p>Os profissionais respondem perguntas ao vivo toda semana.</p><a class="btn btn-sec" href="#programacao">Ver a programação</a></div></section>';
}

function pgSobre() {
  return topo('Sobre a Clipse', 'Uma plataforma para viver o fitness natural no próprio tempo.') +
  '<section class="bloco sobre-nome"><div class="sobre-luas" aria-hidden="true">' + C.ordemFases.map((id) => luaMini(C.fases[id].p, 44)).join('') + '</div>' +
    '<div class="prosa"><h2>O nome</h2><p>A lua tem fases, e as pessoas também. E a lua brilha com o sol: sem luz artificial, no ritmo dela.</p><p>Clipse vem de eclipse e guarda essa ideia. Quem está na Lua nova continua sendo lua.</p></div></section>' +
  '<section class="bloco"><h2>O que guia a Clipse</h2><p class="sub">A essência é pertencer ao caminho natural. Quatro diretrizes saem dela.</p>' +
    '<ul class="lista-ideias">' +
      '<li><h3>Transparente</h3><p>Cada pessoa com a própria jornada, sem firula e sem promessa.</p></li>' +
      '<li><h3>Inclusiva</h3><p>Público aberto. Toda atividade e todo ponto de partida cabem.</p></li>' +
      '<li><h3>Ressignificada</h3><p>Tudo bem não ser perfeito na jornada. O tempo faz parte do resultado.</p></li>' +
      '<li><h3>Constante</h3><p>O que se busca num estilo de vida fitness: seguir por perto, por anos.</p></li>' +
    '</ul></section>' +
  '<section class="bloco prosa"><h2>De onde vem</h2>' +
    '<p>A Clipse nasceu de um Trabalho de Conclusão de Curso em Design na PUCPR, em 2026, sobre fisiculturismo natural e a cultura do resultado imediato.</p>' +
    '<p>A pesquisa ouviu pessoas que treinam, pausam e voltam. A maior trava apareceu na volta, quando o empenho de antes parece distante. A plataforma existe para cuidar desse momento.</p>' +
    '<p>O piloto é pensado para Curitiba. Projeto de Victor Bergmann.</p></section>' +
  '<section class="bloco prosa"><h2>Este site</h2><p>É um protótipo navegável. Perfis, parceiros, histórias e valores são ilustrativos, e o login é simulado.</p></section>';
}

function pgEntrar() {
  const u = estado.usuario;
  return topo('Entrar', 'Crie a sua jornada em um minuto. O login é simulado: nada é enviado e tudo fica neste navegador.') +
  (u && !estado.logado ? '<section class="bloco continuar"><p>Tem uma jornada de <strong>' + esc(u.nome) + '</strong> guardada neste navegador.</p><div class="acoes"><button type="button" class="btn btn-pri" data-acao="continuar">Continuar como ' + esc(String(u.nome).split(' ')[0]) + '</button></div></section>' : '') +
  '<section class="bloco"><form class="form form-entrar" data-form="entrar">' +
    (u ? '<h2>Criar uma jornada nova</h2><p class="meta">Criar uma jornada nova apaga a que está guardada neste navegador.</p>' : '') +
    '<label for="en-nome">Como você quer ser chamado?</label><input type="text" id="en-nome" name="nome" maxlength="40" autocomplete="given-name" required>' +
    '<label for="en-email">E-mail (opcional)</label><input type="email" id="en-email" name="email" maxlength="80" autocomplete="email">' +
    '<fieldset><legend>Em que fase você está hoje?</legend><div class="escolha-fase">' + ['crescente', 'cheia', 'minguante', 'nova'].map((id, i) =>
      '<input type="radio" name="fase" id="ef-' + id + '" value="' + id + '"' + (i === 0 ? ' checked' : '') + '><label for="ef-' + id + '">' + luaMini(C.fases[id].p, 30) + '<span><strong>' + C.fases[id].nome + '</strong><span>' + C.fases[id].curta + '</span></span></label>').join('') + '</div></fieldset>' +
    '<div class="acoes"><button class="btn ' + (u && !estado.logado ? 'btn-sec' : 'btn-pri') + '">Criar minha jornada</button><button type="button" class="btn btn-sec" data-acao="exemplo">Ver com perfil de exemplo</button></div>' +
  '</form></section>';
}

/* ───────── Guia digital ───────── */
function pgGuia() {
  const caps = C.guia.map((g, i) => Object.assign({ n: i + 1, t: g.t, min: g.min, d: g.d }, C.guiaCaps[i]));
  const total = caps.reduce((s, c) => s + c.min, 0);
  const pos = [[14, 33], [50, 16], [86, 33], [76, 85], [24, 85]];
  const ir = (n, rotulo) => '<button type="button" class="btn btn-sec btn-p" data-acao="guia-ir" data-id="' + n + '">' + rotulo + '</button>';
  const lado = (c) => '<div class="gd-lado"><span class="gd-n" aria-hidden="true">' + c.n + '</span><span class="gd-ic">' + ic(c.icone, 26) + '</span><div><p class="rotulo">Capítulo ' + c.n + ' de ' + caps.length + '</p><h2>' + c.t + '</h2><p class="meta">' + c.min + ' min de leitura</p></div></div>';
  const aulaBtn = (id, rotulo) => '<button type="button" class="btn btn-sec btn-p" data-acao="aula" data-id="' + id + '">' + ic('play', 16) + '<span>' + rotulo + '</span></button>';

  /* mapa mental: centro, cinco ramos e os pulsos que correm pelas linhas */
  const linhas = pos.map((p, i) => { const x = p[0] * 10, y = p[1] * 6.2; const d = 'M500 322Q500 ' + y.toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0); return '<path class="hub-liga" d="' + d + '"/><path class="hub-pulso" pathLength="100" style="--d:' + (i * 0.5).toFixed(1) + 's" d="' + d + '"/>'; }).join('');
  const no = (c, i) => '<button type="button" class="mm-no" style="left:' + pos[i][0] + '%;top:' + pos[i][1] + '%" data-acao="guia-ir" data-id="' + c.n + '"><span class="mm-ic">' + ic(c.icone, 22) + '</span><span class="mm-txt"><span class="mm-n">Capítulo ' + c.n + ' · ' + c.min + ' min</span><b>' + c.t + '</b><span class="mm-ch">' + c.chaves.join(' · ') + '</span></span></button>';
  const mapa =
    '<div class="mapa-mental" data-loop><svg class="mm-linhas" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true" focusable="false">' + linhas + '</svg>' +
      '<div class="mm-centro" style="left:50%;top:52%">' + luaMini(0.5, 52, 'sol') + '<b>Natural</b><span>no seu tempo</span></div>' + caps.map(no).join('') + '</div>' +
    '<ol class="mm-lista">' + caps.map((c) => '<li><button type="button" class="mm-no" data-acao="guia-ir" data-id="' + c.n + '"><span class="mm-ic">' + ic(c.icone, 22) + '</span><span class="mm-txt"><span class="mm-n">Capítulo ' + c.n + ' · ' + c.min + ' min</span><b>' + c.t + '</b><span class="mm-ch">' + c.chaves.join(' · ') + '</span></span></button></li>').join('') + '</ol>';

  /* capítulo 1 */
  const cap1 = caps[0];
  const para = [[0.5, 'Quem treina', 'e quer seguir por perto, no seu ritmo.'], [0, 'Quem pausou', 'e quer voltar sem se comparar com o que fazia antes.'], [0.25, 'Quem está começando', 'e precisa de um primeiro passo que caiba na semana.']];
  const c1 =
    '<p class="gd-lide">' + cap1.d + '</p>' +
    '<div class="gd-bloco"><h3>Para quem a Clipse existe</h3><ul class="gd-tres">' + para.map((p) => '<li>' + luaMini(p[0], 34) + '<b>' + p[1] + '</b><span>' + p[2] + '</span></li>').join('') + '</ul></div>' +
    '<div class="gd-bloco"><h3>Qual é a sua fase?</h3><p class="meta">Escolha a sua e vá direto ao capítulo indicado.</p><ul class="gd-fases">' +
      C.ordemFases.map((id) => { const f = C.fases[id], n = C.guiaFases[id]; return '<li><button type="button" class="gd-fase" data-acao="guia-ir" data-id="' + n + '">' + luaMini(f.p, 38) + '<span class="gd-fase-t"><b>' + f.nome + '</b><span>' + f.curta + '</span></span><span class="gd-fase-v">Capítulo ' + n + ic('seta', 16) + '</span></button></li>'; }).join('') + '</ul></div>' +
    '<div class="gd-bloco"><h3>Como usar este guia</h3><ol class="gd-passos">' +
      '<li><b>Leia na ordem</b><span>São cinco capítulos curtos, de ' + Math.min.apply(null, caps.map((c) => c.min)) + ' a ' + Math.max.apply(null, caps.map((c) => c.min)) + ' minutos.</span></li>' +
      '<li><b>Vá direto à sua fase</b><span>Use o quadro acima e abra o capítulo indicado.</span></li>' +
      '<li><b>Use as aulas de apoio</b><span>Cada capítulo aponta uma aula curta sobre o mesmo tema.</span></li></ol></div>';

  /* capítulo 2 */
  const c2 =
    '<p class="gd-lide">' + caps[1].d + '</p>' +
    '<ol class="gd-cards">' + C.motivos.map((m, i) => '<li><span class="num">' + (i + 1) + '</span><h3>' + m.t + '</h3><p>' + m.d + '</p></li>').join('') + '</ol>' +
    '<div class="gd-frase"><p>Natural leva tempo. É por isso que dura.</p>' +
      '<div class="gd-tempo" aria-hidden="true"><span><i></i>Semanas</span><span><i></i>Meses</span><span><i></i>Anos</span></div></div>';

  /* capítulo 3 */
  const c3 =
    '<p class="gd-lide">' + caps[2].d + '</p>' +
    '<div class="gd-alerta"><p class="gd-alerta-t">Para estética ou desempenho, não existe dose considerada segura.</p><p>Desde 2023, o Conselho Federal de Medicina proíbe médicos de prescreverem esteroides anabolizantes com essa finalidade. Tratamento médico, com indicação e acompanhamento, é outra conversa.</p></div>' +
    '<ul class="gd-riscos">' + C.riscos.map((r, i) => '<li><span class="gd-ic gd-ic-sm">' + ic(C.guiaRiscos[i], 22) + '</span><h3>' + r.t + '</h3><p>' + r.d + '</p></li>').join('') + '</ul>' +
    '<div class="gd-ajuda"><div><h3>Onde buscar ajuda</h3><p>Se você usa ou já usou e quer parar, procure um endocrinologista. Parar com acompanhamento é mais seguro.</p></div>' + aulaBtn('a3', 'Ver a aula sobre hormônios') + '</div>' +
    '<p class="fontes">Fontes: Conselho Federal de Medicina, Resolução nº 2.333/2023. Sociedade Brasileira de Endocrinologia e Metabologia, alertas sobre o uso de anabolizantes para fins estéticos.</p>';

  /* capítulo 4 */
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], marcados = [1, 3, 5];
  const c4 =
    '<p class="gd-lide">' + caps[3].d + '</p>' +
    '<div class="gd-bloco"><h3>Quando só dá para fazer uma coisa, escolha a que for possível hoje</h3><ol class="gd-escada">' +
      '<li style="--n:1"><b>O mínimo que mantém você por perto</b><span>Quando a semana aperta, mover o corpo um pouco já conta.</span></li>' +
      '<li style="--n:1.7"><b>Um treino de 20 minutos</b><span>Curto, simples e possível de encaixar.</span></li>' +
      '<li style="--n:2.4"><b>O treino completo</b><span>Volta quando a semana deixar, sem cobrança.</span></li></ol></div>' +
    '<div class="gd-bloco"><h3>Exemplo de uma semana cheia</h3><ul class="gd-semana" aria-label="Exemplo ilustrativo de semana com três treinos curtos">' +
      dias.map((d, i) => '<li class="' + (marcados.indexOf(i) >= 0 ? 'on' : '') + '"><i></i><span>' + d + '</span>' + (marcados.indexOf(i) >= 0 ? '<small>20 min</small>' : '<small></small>') + '</li>').join('') + '</ul><p class="meta">Exemplo ilustrativo. O seu ritmo é o que você consegue sustentar.</p></div>' +
    '<div class="gd-ajuda"><div><h3>Aula de apoio</h3><p>Rotina puxada: o mínimo que mantém você por perto.</p></div>' + aulaBtn('a5', 'Ver a aula') + '</div>';

  /* capítulo 5 */
  const c5 =
    '<p class="gd-lide">' + caps[4].d + '</p>' +
    '<div class="gd-bloco"><h3>Duas semanas para o corpo lembrar</h3><ol class="gd-roteiro">' +
      '<li>' + luaMini(0, 40) + '<p class="rotulo">Semana 1</p><b>Metade do que você fazia antes</b><span>Comece pequeno. Só observe como o corpo responde.</span></li>' +
      '<li>' + luaMini(0.25, 40, 'sol') + '<p class="rotulo">Semana 2</p><b>Um pouco mais, se o corpo pedir</b><span>Sem se comparar com o ritmo de antes.</span></li></ol></div>' +
    '<ul class="gd-tres gd-ideias"><li><b>A volta pesa mais na cabeça do que no corpo.</b></li><li><b>Fotos antigas são memória, não cobrança.</b></li><li><b>Voltar é um marco, não um recomeço do zero.</b></li></ul>' +
    '<div class="gd-ajuda"><div><h3>Aula de apoio</h3><p>Voltando depois de uma pausa.</p></div>' + aulaBtn('a4', 'Ver a aula') + '</div>';

  const corpos = [c1, c2, c3, c4, c5];
  const levar = ['Natural é um caminho, e cada pessoa anda nele no próprio ritmo.', 'O tempo faz parte do resultado.', 'Para estética ou desempenho, não existe dose segura. Parar com acompanhamento é mais seguro.', 'Quando a semana aperta, o mínimo já conta.', 'Voltar depois de uma pausa começa pela metade.'];

  return topo('Guia digital', 'Cinco capítulos para ler na ordem ou para ir direto ao que faz sentido na sua fase. ' + total + ' minutos no total, de graça.') +
  '<section class="bloco gd-mapa" aria-label="Mapa do guia">' + mapa + '</section>' +
  '<nav class="gd-nav" aria-label="Capítulos do guia"><div class="gd-nav-in">' + caps.map((c) => '<button type="button" data-acao="guia-ir" data-id="' + c.n + '"><span>' + c.n + '</span>' + c.t + '</button>').join('') + '</div><i class="gd-prog" id="gd-prog" aria-hidden="true"></i></nav>' +
  '<div class="gd-conteudo">' + caps.map((c, i) => '<section class="gd-cap' + (c.n % 2 === 0 ? ' tom-claro" data-theme="lua' : '') + '" id="gd-cap-' + c.n + '" aria-labelledby="gd-h-' + c.n + '">' + lado(c).replace('<h2>', '<h2 id="gd-h-' + c.n + '">') + '<div class="gd-corpo">' + corpos[i] + '</div></section>').join('') + '</div>' +
  '<section class="bloco gd-levar" aria-labelledby="gd-h-levar"><h2 id="gd-h-levar">Para levar</h2><ul>' + levar.map((l) => '<li>' + ic('check', 18) + '<span>' + l + '</span></li>').join('') + '</ul>' +
    '<div class="acoes"><a class="btn btn-pri" href="#' + (estado.logado ? 'minha-jornada' : 'entrar') + '">' + (estado.logado ? 'Abrir minha jornada' : 'Começar minha jornada') + '</a><a class="btn btn-sec" href="#por-que-natural">Voltar para Por que natural</a></div>' +
    '<p class="meta">O conteúdo da Clipse é informativo e não substitui o acompanhamento de médico, nutricionista, psicólogo ou profissional de educação física.</p></section>';
}

const PAGINAS = {
  'inicio': pgInicio, 'por-que-natural': pgNatural, 'programacao': pgProgramacao, 'profissionais': pgProfissionais,
  'planos': pgPlanos, 'curitiba': pgCuritiba, 'comunidade': pgComunidade, 'minha-jornada': pgJornada,
  'produtos': pgProdutos, 'seja-parceiro': pgParceiro, 'historias': pgHistorias, 'perguntas': pgPerguntas,
  'sobre': pgSobre, 'entrar': pgEntrar, 'guia': pgGuia
};

/* ───────── Lua do início: arraste para mudar de fase ───────── */
/* ───────── Texto que reage ao mouse: letras engrossam e sobem perto do cursor, palavras acendem ───────── */
function textoReativo(el, o) {
  if (!el || reduzMovimento() || !window.matchMedia('(hover: hover)').matches) return null;
  o = Object.assign({ unidade: 'letra', raio: 130, peso: 0, sobe: 0, brilho: false }, o || {});
  const txt = el.textContent.trim();
  el.textContent = '';
  const itens = [], palavras = txt.split(' ');
  palavras.forEach((pal, i) => {
    const grupo = document.createElement('span'); grupo.className = 'tr-p'; grupo.setAttribute('aria-hidden', 'true');
    (o.unidade === 'letra' ? Array.from(pal) : [pal]).forEach((t) => {
      const s = document.createElement('span'); s.className = 'tr-c'; s.textContent = t; grupo.appendChild(s);
      itens.push({ el: s, x: 0, y: 0, w: 0, v: 0 });
    });
    el.appendChild(grupo);
    if (i < palavras.length - 1) el.appendChild(document.createTextNode(' '));
  });
  const lido = document.createElement('span'); lido.className = 'oculto'; lido.textContent = txt; el.appendChild(lido);
  const base = parseFloat(getComputedStyle(el).fontWeight) || 600;
  let medido = false, alvoX = -1e5, alvoY = -1e5, raf = 0, tAnt = 0, tRedim = 0;

  function medir() {
    if (o.peso) itens.forEach((l) => { l.el.style.width = ''; });
    itens.forEach((l) => { const r = l.el.getBoundingClientRect(); l.x = r.left + r.width / 2 + window.scrollX; l.y = r.top + r.height / 2 + window.scrollY - (o.sobe ? -0 : 0); l.w = r.width; });
    if (o.peso) itens.forEach((l) => { l.el.style.width = l.w + 'px'; });
    medido = true;
  }
  function zerar(l) { l.v = 0; l.el.style.fontWeight = ''; l.el.style.transform = ''; l.el.style.color = ''; }
  function passo(t) {
    const dt = Math.min(0.05, tAnt ? (t - tAnt) / 1000 : 0.016); tAnt = t;
    const k = 1 - Math.exp(-dt * 10);
    let ativo = false;
    for (const l of itens) {
      const d = Math.hypot(alvoX - l.x, alvoY - l.y);
      const alvo = d < o.raio ? Math.pow(1 - d / o.raio, 2) : 0;
      if (alvo === 0 && l.v < 0.004) { if (l.v !== 0) zerar(l); continue; }
      l.v += (alvo - l.v) * k; ativo = true;
      if (o.peso) l.el.style.fontWeight = Math.min(700, Math.round(base + o.peso * l.v));
      if (o.sobe) l.el.style.transform = 'translateY(' + (-o.sobe * l.v).toFixed(2) + 'px)';
      if (o.brilho) l.el.style.color = 'color-mix(in srgb, var(--ink) ' + Math.round(l.v * 100) + '%, var(--ink-muted))';
    }
    raf = ativo ? requestAnimationFrame(passo) : 0;
  }
  const mover = (e) => { if (!medido) medir(); alvoX = e.pageX; alvoY = e.pageY; if (!raf) { tAnt = 0; raf = requestAnimationFrame(passo); } };
  const sair = () => { alvoX = alvoY = -1e5; if (!raf) { tAnt = 0; raf = requestAnimationFrame(passo); } };
  const redim = () => { clearTimeout(tRedim); medido = false; tRedim = setTimeout(medir, 200); };
  document.addEventListener('pointermove', mover, { passive: true });
  document.documentElement.addEventListener('pointerleave', sair);
  window.addEventListener('resize', redim);
  const tInicial = setTimeout(medir, 1300);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { medido = false; });
  return { destruir() { cancelAnimationFrame(raf); clearTimeout(tRedim); clearTimeout(tInicial); document.removeEventListener('pointermove', mover); document.documentElement.removeEventListener('pointerleave', sair); window.removeEventListener('resize', redim); } };
}
let esferaHeroi = null, textosHeroi = [];
function limparHeroi() {
  if (esferaHeroi) { esferaHeroi.destruir(); esferaHeroi = null; }
  textosHeroi.forEach((x) => { if (x) x.destruir(); }); textosHeroi = [];
}
function montarHeroi() {
  const palco = $('#palco'); if (!palco) { heroi = null; return; }
  const inicial = C.fases[estado.logado && estado.fase ? estado.fase : 'cheia'].p;
  let idx = -1;
  const legenda = (p) => {
    const i = ((Math.round(p * 4) % 4) + 4) % 4; if (i === idx) return; idx = i;
    const id = C.ordemFases[i], f = C.fases[id];
    $('#legenda-fase').innerHTML = '<strong>' + f.nome + ', ' + f.curta.toLowerCase() + '</strong><span>' + f.texto + '</span>';
    palco.setAttribute('aria-valuenow', String(i + 1)); palco.setAttribute('aria-valuetext', f.nome + ', ' + f.curta.toLowerCase());
    $$('.trilho-item').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fase === id)));
  };
  const mola = new Mola(inicial, (p) => { pintarLuaGrande('lua-heroi', p); legenda(p); }, 0.0006);
  mola.fixar(inicial);
  const ir = (alvo, v) => mola.ir(alvo, { velocidade: v, amortecimento: v && Math.abs(v) > 0.5 ? 0.8 : 1, resposta: 0.5 });
  let arr = null;
  palco.addEventListener('pointerdown', (e) => {
    if (e.button) return;
    try { palco.setPointerCapture(e.pointerId); } catch (x) {}
    mola.parar();
    arr = { id: e.pointerId, x0: e.clientX, p0: mola.x, larg: palco.offsetWidth || 300, hist: [{ t: e.timeStamp, p: e.clientX }], moveu: false };
    palco.classList.add('agarrado');
  });
  palco.addEventListener('pointermove', (e) => {
    if (!arr || e.pointerId !== arr.id) return;
    const dx = e.clientX - arr.x0; if (Math.abs(dx) > 5) arr.moveu = true;
    mola.x = arr.p0 + (dx / arr.larg) * 0.5; mola.v = 0; mola.alvo = mola.x; mola.aoMudar(mola.x);
    arr.hist.push({ t: e.timeStamp, p: e.clientX }); if (arr.hist.length > 8) arr.hist.shift();
  });
  const solta = (e, cancelou) => {
    if (!arr || e.pointerId !== arr.id) return;
    const a = arr; arr = null; palco.classList.remove('agarrado');
    if (cancelou) { ir(Math.round(mola.x * 4) / 4, 0); return; }
    if (!a.moveu) { ir(Math.round(mola.x * 4) / 4 + 0.25, 0); return; }
    const vpx = velocidadeDe(a.hist);
    const fim = mola.x + (projetar(vpx, 0.99) / a.larg) * 0.5;
    ir(Math.round(fim * 4) / 4, (vpx / a.larg) * 0.5);
  };
  palco.addEventListener('pointerup', (e) => solta(e, false));
  palco.addEventListener('pointercancel', (e) => solta(e, true));
  palco.addEventListener('keydown', (e) => {
    const base = Math.round(mola.alvo * 4) / 4;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); ir(base + 0.25, 0); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); ir(base - 0.25, 0); }
  });
  const cv = $('#esfera-clipse');
  if (cv && window.iniciarEsferaClipse) esferaHeroi = window.iniciarEsferaClipse(cv, { forma: ['pontos', 'luas', 'logo'].includes(new URLSearchParams(location.search).get('esfera')) ? new URLSearchParams(location.search).get('esfera') : 'estrelas', tema: document.documentElement.dataset.theme === 'lua' ? 'lua' : 'noite', ancora: (r) => { const p = palco.getBoundingClientRect(); return { x: p.left - r.left + p.width / 2, y: p.top - r.top + p.height / 2, raio: p.height * 0.62 }; } });
  textosHeroi = [textoReativo($('#h-hero'), { unidade: 'letra', raio: 130, peso: 100, sobe: 4 }), textoReativo($('.heroi .lide'), { unidade: 'palavra', raio: 120, brilho: true })];
  heroi = { irFase: (id) => { const p = C.fases[id].p; ir(p + Math.round(mola.x - p), 0); } };
}

/* ───────── Casca: topo, abas, rodapé ───────── */
const main = $('#conteudo');
function listaPaginas(comDescricao) {
  const grupos = [];
  C.paginas.forEach((p) => { let g = grupos.find((x) => x.nome === p.grupo); if (!g) { g = { nome: p.grupo, itens: [] }; grupos.push(g); } g.itens.push(p); });
  return grupos.map((g) => '<div class="menu-grupo"><h3>' + g.nome + '</h3><ul>' + g.itens.map((p) =>
    '<li><a href="#' + p.id + '" data-nav="' + p.id + '">' + p.nome + (comDescricao && p.linha ? '<span>' + p.linha + '</span>' : '') + '</a></li>').join('') + '</ul></div>').join('');
}
function montarCasca() {
  const principais = ['por-que-natural', 'programacao', 'profissionais', 'planos', 'curitiba', 'comunidade'];
  $('#marca').innerHTML = LOGO;
  $('#tabbar').innerHTML =
    '<a href="#inicio" data-nav="inicio">' + ic('inicio', 24) + '<span>Início</span></a>' +
    '<a href="#por-que-natural" data-nav="por-que-natural">' + ic('folha', 24) + '<span>Natural</span></a>' +
    '<a href="#minha-jornada" data-nav="minha-jornada"><span id="tab-lua" class="tab-lua"></span><span>Jornada</span></a>' +
    '<a href="#comunidade" data-nav="comunidade">' + ic('pessoas', 24) + '<span>Comunidade</span></a>' +
    '<button type="button" id="tab-mais" data-acao="menu">' + ic('mais', 24) + '<span>Mais</span></button>';
  $('#nav-topo').innerHTML = principais.map((id) => { const p = C.paginas.find((x) => x.id === id); return '<a href="#' + id + '" data-nav="' + id + '">' + p.nome + '</a>'; }).join('') +
    '<button type="button" class="nav-mais" data-acao="menu" aria-expanded="false" aria-controls="popover">Mais' + ic('baixo', 16) + '</button>';
  $('#popover').innerHTML = listaPaginas(false);
  $('#rodape').innerHTML = '<div class="rodape-in">' +
    '<div class="rodape-marca"><a class="marca" href="#inicio" aria-label="Clipse, página inicial">' + LOGO + '</a><p>Fitness natural, no seu tempo. Piloto em Curitiba.</p></div>' +
    '<nav class="rodape-nav" aria-label="Mapa do site">' + listaPaginas(false) + '</nav>' +
    '<div class="rodape-avisos"><p><strong>Aviso de saúde.</strong> O conteúdo da Clipse é informativo e não substitui o acompanhamento de médico, nutricionista, psicólogo ou profissional de educação física.</p>' +
    '<p>Protótipo acadêmico de um TCC de Design na PUCPR, 2026. Perfis, parceiros, histórias e valores são ilustrativos.</p><p><button type="button" class="link" data-acao="acessibilidade">Opções de acessibilidade</button></p></div></div>';
  atualizarConta();
}
function atualizarConta() {
  const c = $('#conta');
  c.innerHTML = '<button type="button" class="btn-ac" data-acao="acessibilidade" aria-haspopup="dialog" aria-label="Opções de acessibilidade">' + ic('acess', 22) + '</button>' + (estado.logado
    ? '<a class="conta-on" href="#minha-jornada" data-nav="minha-jornada" aria-label="Minha jornada, ' + esc(C.fases[estado.fase].nome) + '">' + luaMini(C.fases[estado.fase].p, 22, 'sol') + '<span>' + esc(primeiroNome()) + '</span></a>'
    : '<a class="btn btn-sec btn-p" href="#entrar">Entrar</a>');
  const tj = $('#tab-lua'); if (tj) tj.innerHTML = luaMini(estado.logado ? C.fases[estado.fase].p : 0.25, 24, estado.logado ? 'sol' : 'apagada');
}
function marcarNav() {
  $$('[data-nav]').forEach((a) => { if (a.dataset.nav === rota) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const naBarra = ['inicio', 'por-que-natural', 'minha-jornada', 'comunidade'].indexOf(rota) >= 0 || rota === 'entrar';
  const m = $('#tab-mais'); if (m) m.classList.toggle('on', !naBarra);
  const nm = $('.nav-mais'); if (nm) nm.classList.toggle('on', ['produtos', 'historias', 'seja-parceiro', 'perguntas', 'sobre', 'guia'].indexOf(rota) >= 0);
}
function fecharPopover() { const p = $('#popover'); if (p && !p.hidden) { p.hidden = true; const b = $('.nav-mais'); if (b) b.setAttribute('aria-expanded', 'false'); } }

/* ───────── Rotas ───────── */
function rotaDaUrl() { const h = (location.hash || '').replace(/^#/, ''); return PAGINAS[h] ? h : 'inicio'; }
/* ───────── Momentos da home: a rolagem só move o que está dentro da própria seção ───────── */
let semMov = null, luaFases = null;
function desligarMov() { if (luaFases) { luaFases.parar(); luaFases = null; } if (semMov) { window.removeEventListener('scroll', semMov); window.removeEventListener('resize', semMov); semMov = null; } }
const limitar = (v) => Math.min(1, Math.max(0, v));
function progresso(el) { const total = el.offsetHeight - window.innerHeight; return total > 0 ? limitar(-el.getBoundingClientRect().top / total) : 0; }
function ligarMovimentos() {
  desligarMov();
  const fases = $('#fases'), mani = $('#manifesto');
  if (!fases && !mani) return;
  if (reduzMovimento()) { pintarLuaGrande('lua-fases', 0.5); return; }
  const passos = $$('#fases-passos li'), pontos = $$('#fases-pontos i'), palavras = $$('.w', mani || document);
  const ult = palavras.map(() => -1);
  let idxAnt = -1;
  luaFases = new Mola(0, (p) => pintarLuaGrande('lua-fases', p), 0.0006);
  const atualizar = () => {
    if (fases) {
      const i = Math.min(3, Math.floor(progresso(fases) * 4));
      if (i !== idxAnt) {
        if (idxAnt < 0) luaFases.fixar(i * 0.25); else luaFases.ir(i * 0.25, { amortecimento: 1, resposta: 0.5 });
        idxAnt = i; passos.forEach((el, k) => el.classList.toggle('on', k === i)); pontos.forEach((el, k) => el.classList.toggle('on', k === i));
      }
    }
    if (mani) {
      const alvo = limitar((progresso(mani) - 0.1) / 0.72) * palavras.length;
      palavras.forEach((w, k) => { const l = Math.round(limitar(alvo - k) * 20) / 20; if (l !== ult[k]) { ult[k] = l; w.style.setProperty('--l', l); } });
    }
  };
  let raf = 0;
  semMov = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; atualizar(); }); };
  window.addEventListener('scroll', semMov, { passive: true });
  window.addEventListener('resize', semMov);
  atualizar();
}
/* Loops curtos dos cards: começam quando o card aparece, repetem duas vezes e recomeçam no hover */
function ligarLoops() {
  const els = $$('[data-loop]'); if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('vivo')); return; }
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('vivo'); io.unobserve(en.target); } }), { threshold: 0.4 });
  els.forEach((e) => io.observe(e));
}
function tituloDaPagina() {
  const p = C.paginas.find((x) => x.id === rota);
  document.title = rota === 'inicio' ? 'Clipse: fitness natural para quem treina, pausa e volta' : (p ? p.nome : rota === 'entrar' ? 'Entrar' : 'Clipse') + ' | Clipse';
}

/* Guia: barra de progresso e capítulo atual na navegação fixa */
let guiaFim = null;
function desligarGuia() { if (guiaFim) { guiaFim(); guiaFim = null; } }
function ligarGuia() {
  desligarGuia();
  const caps = $$('.gd-cap'), chips = $$('.gd-nav [data-id]'), barra = $('#gd-prog'), corpo = $('.gd-conteudo');
  if (!caps.length || !barra || !corpo) return;
  const atualizar = () => {
    const r = corpo.getBoundingClientRect(), total = Math.max(1, r.height - window.innerHeight * 0.5);
    barra.style.transform = 'scaleX(' + Math.max(0, Math.min(1, (-r.top + window.innerHeight * 0.3) / total)).toFixed(3) + ')';
    let atual = -1; caps.forEach((c, i) => { if (c.getBoundingClientRect().top < window.innerHeight * 0.4) atual = i; });
    chips.forEach((b, i) => { if (i === atual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  };
  let raf = 0; const f = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; atualizar(); }); };
  window.addEventListener('scroll', f, { passive: true }); window.addEventListener('resize', f); atualizar();
  guiaFim = () => { window.removeEventListener('scroll', f); window.removeEventListener('resize', f); };
}
function aposPintar() {
  limparHeroi();
  if (rota === 'inicio') { montarHeroi(); pintarLuaGrande('lua-fecho', C.fases.crescente.p); ligarMovimentos(); ligarLoops(); }
  else { heroi = null; desligarMov(); }
  if (rota === 'guia') { ligarGuia(); ligarLoops(); } else desligarGuia();
  if (rota === 'minha-jornada' && estado.logado) {
    const alvo = C.fases[estado.fase].p;
    if (animarLuaDe != null && !reduzMovimento()) {
      const m = new Mola(animarLuaDe, (p) => pintarLuaGrande('lua-jornada', p), 0.0006);
      m.fixar(animarLuaDe); m.ir(alvo + Math.round(animarLuaDe - alvo), { amortecimento: 0.85, resposta: 0.7 });
    } else pintarLuaGrande('lua-jornada', alvo);
    animarLuaDe = null;
  }
}
function navegar(primeira) {
  let r = rotaDaUrl();
  if (r === 'entrar' && estado.logado) { location.hash = 'minha-jornada'; return; }
  Folha.fechar(); fecharPopover();
  rota = r;
  main.innerHTML = '<div class="pagina pg-' + r + ' nova' + (primeira ? '' : ' troca') + '">' + PAGINAS[r]() + '</div>';
  tituloDaPagina(); aposPintar(); marcarNav(); atualizarConta();
  if (!primeira) { window.scrollTo(0, 0); try { main.focus({ preventScroll: true }); } catch (e) {} }
}
function pintar() {
  const y = window.scrollY, at = document.activeElement;
  let foco = null;
  if (at && main.contains(at)) {
    const q = (v) => (window.CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/"/g, '\\"'));
    if (at.id) foco = '#' + q(at.id);
    else if (at.dataset && at.dataset.acao) foco = '[data-acao="' + q(at.dataset.acao) + '"]' + (at.dataset.id ? '[data-id="' + q(at.dataset.id) + '"]' : '') + (at.dataset.tipo ? '[data-tipo="' + q(at.dataset.tipo) + '"]' : '');
  }
  main.innerHTML = '<div class="pagina pg-' + rota + '">' + PAGINAS[rota]() + '</div>';
  aposPintar(); marcarNav(); atualizarConta();
  window.scrollTo(0, y);
  if (foco) { try { const n = main.querySelector(foco); if (n) n.focus({ preventScroll: true }); } catch (e) {} }
}

/* ───────── Folhas de conteúdo ───────── */
function pedirEntrada(msg) {
  Folha.abrir({ titulo: 'Entre para guardar', html: '<p>' + msg + '</p><p class="meta">O login é simulado e os dados ficam só neste navegador.</p>' +
    '<div class="acoes"><a class="btn btn-pri" href="#entrar" data-acao="fechar-folha">Entrar</a><button type="button" class="btn btn-sec" data-acao="exemplo">Ver com perfil de exemplo</button></div>' });
}
function abrirBloqueio(msg, plano) {
  Folha.abrir({ titulo: 'Plano ' + nomePlano(plano), html: '<p>' + msg + '</p><p class="meta">Neste protótipo a troca de plano é simulada. Nada é cobrado.</p><div class="acoes">' +
    (estado.logado ? '<button type="button" class="btn btn-pri" data-acao="plano" data-id="' + plano + '">Simular ' + nomePlano(plano) + '</button>' : '<a class="btn btn-pri" href="#entrar" data-acao="fechar-folha">Entrar para continuar</a>') +
    '<a class="btn btn-sec" href="#planos" data-acao="fechar-folha">Ver planos</a></div>' });
}
function abrirAula(id) {
  const a = C.aulas.find((x) => x.id === id); if (!a) return;
  if (!temAcesso(a.plano)) { abrirBloqueio('Esta aula faz parte do ' + nomePlano(a.plano) + '.', a.plano); return; }
  const vista = estado.logado && estado.aulas.indexOf(id) >= 0;
  Folha.abrir({ titulo: a.t, html:
    '<div class="player"><span class="player-play" aria-hidden="true">' + ic('play', 28) + '</span><span class="player-nota">Vídeo ilustrativo. A gravação entra na versão final.</span></div>' +
    '<p class="meta">' + a.min + ' minutos, com ' + esc(a.por) + ', ' + esc(a.papel) + '.</p>' +
    '<h3>Nesta aula</h3><ul class="pontos">' + a.resumo.map((r) => '<li>' + r + '</li>').join('') + '</ul>' +
    '<div class="acoes"><button type="button" class="btn ' + (vista ? 'btn-sec' : 'btn-pri') + '" data-acao="aula-vista" data-id="' + id + '">' + (vista ? 'Desmarcar como assistida' : 'Marcar como assistida') + '</button></div>' });
}
function abrirProf(id) {
  const p = C.profissionais.find((x) => x.id === id); if (!p) return;
  Folha.abrir({ titulo: p.nome, html: '<p class="papel">' + p.papel + ', ' + p.onde + '</p><p>' + p.bio + '</p><h3>Como acompanha na Clipse</h3><p>' + p.como + '</p>' +
    '<p class="meta">Perfil ilustrativo.</p><div class="acoes">' + botaoSalvar('profissionais', p.id) + '<a class="btn btn-sec btn-p" href="#planos" data-acao="fechar-folha">Ver planos</a></div>' });
}
function abrirFases() {
  Folha.abrir({ titulo: 'Em que fase você está?', html: '<p class="meta">Você escolhe, e dá para trocar quando quiser.</p><div class="opcoes-fase">' +
    ['cheia', 'minguante', 'nova', 'crescente'].map((id) => { const f = C.fases[id], on = estado.fase === id;
      return '<button type="button" class="opcao-fase' + (on ? ' on' : '') + '" data-acao="escolher-fase" data-fase="' + id + '" aria-pressed="' + on + '">' + luaMini(f.p, 36) + '<span class="of-t"><strong>' + f.nome + (on ? ', sua fase atual' : '') + '</strong><span>' + f.curta + '. ' + f.texto + '</span></span></button>'; }).join('') + '</div>' });
}
function abrirPausa() {
  const motivos = ['Trabalho', 'Estudos', 'Saúde', 'Família', 'Viagem', 'Cansaço', 'Outro'];
  Folha.abrir({ titulo: 'Lua nova', html: '<form class="form" data-form="pausa"><p>Pausar faz parte do ciclo. Sua jornada fica guardada.</p>' +
    '<fieldset><legend>Quer registrar o motivo? É opcional e só você vê.</legend><div class="chips">' + motivos.map((m, i) => '<input type="radio" name="motivo" id="mo-' + i + '" value="' + m + '"><label for="mo-' + i + '">' + m + '</label>').join('') + '</div></fieldset>' +
    '<label for="pausa-nota">Um recado para você (opcional)</label><input type="text" id="pausa-nota" name="nota" maxlength="120">' +
    '<div class="acoes"><button class="btn btn-pri">Entrar na Lua nova</button></div></form>' });
}
function mudarFase(id, extra) {
  const ant = estado.fase;
  if (ant === id || !C.fases[id]) { Folha.fechar(); return; }
  const hoje = hojeISO(), item = { fase: id, data: hoje };
  if (extra && extra.motivo) item.motivo = extra.motivo;
  if (extra && extra.nota) item.nota = extra.nota;
  let volta = null;
  if (ant === 'nova') {
    let ini = hoje; for (let i = estado.historico.length - 1; i >= 0; i--) { if (estado.historico[i].fase === 'nova') ini = estado.historico[i].data; else break; }
    volta = { data: hoje, dias: diasEntre(ini, hoje) }; estado.voltas.push(volta);
  }
  estado.historico.push(item); estado.fase = id; gravar();
  Folha.fechar();
  animarLuaDe = C.fases[ant] ? C.fases[ant].p : null;
  abaJornada = 'hoje';
  if (rota === 'minha-jornada') { pintar(); window.scrollTo(0, 0); }
  avisar(volta ? 'Volta registrada. É a sua ' + estado.voltas.length + 'ª volta.' : 'Fase atualizada: ' + C.fases[id].nome + '.');
}
function abrirProduto(id) {
  const p = id ? produtosAtuais().find((x) => x.id === id) : null;
  if (id && !p) return;
  fotoPendente = undefined;
  const src = p ? fotoSrc(p) : '';
  const comFoto = Nuvem.estado === 'local' || !!Nuvem.assets;
  Folha.abrir({ titulo: p ? 'Editar produto' : 'Novo produto', html:
    '<form class="form" data-form="produto" data-id="' + (p ? esc(p.id) : '') + '">' +
    '<label for="pd-nome">Nome</label><input type="text" id="pd-nome" name="nome" maxlength="60" required value="' + (p ? esc(p.nome) : '') + '">' +
    '<div class="duas"><div><label for="pd-cat">Categoria</label><select id="pd-cat" name="categoria">' + C.categoriasProduto.map((c) => '<option' + (p && p.categoria === c ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></div>' +
    '<div><label for="pd-valor">Valor em reais</label><input type="text" id="pd-valor" name="valor" inputmode="decimal" placeholder="89,90" required value="' + (p ? esc((Number(p.valor) || 0).toFixed(2).replace('.', ',')) : '') + '"></div></div>' +
    '<label for="pd-desc">Descrição curta</label><input type="text" id="pd-desc" name="descricao" maxlength="90" value="' + (p ? esc(p.descricao || '') : '') + '">' +
    (comFoto ? '<label for="pd-foto">Foto</label><div class="foto-campo"><div class="foto-previa" id="pd-previa">' + (src ? '<img src="' + esc(src) + '" alt="">' : '<span>Sem foto</span>') + '</div>' +
      '<div class="foto-lado"><input type="file" id="pd-foto" name="foto" accept="image/png,image/jpeg,image/webp">' +
      '<button type="button" class="link" id="pd-tirar" data-acao="produto-tirar-foto"' + (src ? '' : ' hidden') + '>Remover foto</button><p class="meta">JPG, PNG ou WebP. A imagem é reduzida antes de salvar.</p></div></div>'
      : '<p class="meta">O envio de fotos não está disponível nesta visita.</p>') +
    '<p class="erro" id="pd-erro" role="alert" hidden></p>' +
    '<div class="acoes"><button class="btn btn-pri" id="pd-salvar">Salvar produto</button>' + (p ? '<button type="button" class="btn btn-perigo" data-acao="produto-excluir" data-id="' + esc(p.id) + '">Excluir</button>' : '') + '</div></form>',
    aoMontar: (c) => {
      const campo = $('#pd-foto', c); if (!campo) return;
      campo.addEventListener('change', async () => {
        const arq = campo.files && campo.files[0]; if (!arq) return;
        try {
          fotoPendente = await reduzirImagem(arq, 1000, 0.84);
          $('#pd-previa').innerHTML = '<img src="' + fotoPendente.url + '" alt="">'; $('#pd-tirar').hidden = false; erroProduto('');
        } catch (e) { erroProduto('Não consegui ler essa imagem. Escolha outro arquivo.'); }
      });
    } });
}
function erroProduto(msg) { const e = $('#pd-erro'); if (!e) return; e.textContent = msg; e.hidden = !msg; }
function confirmar(titulo, msg, rotulo, acao) {
  Folha.abrir({ titulo: titulo, html: '<p>' + msg + '</p><div class="acoes"><button type="button" class="btn btn-perigo" data-acao="' + acao + '">' + rotulo + '</button><button type="button" class="btn btn-sec" data-acao="fechar-folha">Cancelar</button></div>' });
}

/* ───────── Ações ───────── */
function alternarSalvo(tipo, id) {
  const l = estado.salvos[tipo]; if (!l) return false;
  const i = l.indexOf(id); if (i >= 0) l.splice(i, 1); else l.push(id);
  gravar(); return i < 0;
}
const ACOES = {
  'menu': (el) => {
    if (telaLarga()) { const p = $('#popover'), abrir = p.hidden; p.hidden = !abrir; el.setAttribute('aria-expanded', String(abrir)); if (abrir) marcarNav(); }
    else Folha.abrir({ titulo: 'Todas as páginas', html: '<nav class="menu-folha" aria-label="Todas as páginas">' + listaPaginas(true) + '</nav>', aoMontar: marcarNav });
  },
  'nat-aba': (el) => {
    const c = el.closest('.nat-def'); if (!c) return;
    c.dataset.aba = el.dataset.id;
    $$('[role="tab"]', c).forEach((b) => { const on = b === el; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    $$('[role="tabpanel"]', c).forEach((p) => { p.hidden = p.id !== 'nat-p-' + el.dataset.id; });
  },
  'guia-ir': (el) => { const s = $('#gd-cap-' + el.dataset.id); if (s) s.scrollIntoView({ behavior: reduzMovimento() ? 'auto' : 'smooth', block: 'start' }); },
  'acessibilidade': () => abrirAcess(),
  'ac-seg': (el) => { const g = el.dataset.grupo; ac[g] = g === 'texto' ? Number(el.dataset.id) : el.dataset.id; mudouAcess('[data-acao="ac-seg"][data-grupo="' + g + '"][data-id="' + el.dataset.id + '"]'); },
  'ac-sw': (el) => { ac[el.dataset.id] = !ac[el.dataset.id]; mudouAcess('[data-acao="ac-sw"][data-id="' + el.dataset.id + '"]'); },
  'ac-zerar': () => { ac = Object.assign({}, AC_PADRAO); mudouAcess('[data-acao="ac-zerar"]'); },
  'fechar-folha': () => Folha.fechar(),
  'heroi-fase': (el) => { if (heroi) heroi.irFase(el.dataset.fase); },
  'aula': (el) => abrirAula(el.dataset.id),
  'aula-vista': (el) => {
    if (!estado.logado) { pedirEntrada('Entre na sua jornada para guardar as aulas que você assistiu.'); return; }
    const id = el.dataset.id, i = estado.aulas.indexOf(id);
    if (i >= 0) estado.aulas.splice(i, 1); else estado.aulas.push(id);
    gravar(); Folha.fechar(); pintar(); avisar(i >= 0 ? 'Aula desmarcada.' : 'Aula marcada como assistida.');
  },
  'salvar': (el) => {
    if (!estado.logado) { pedirEntrada('Entre na sua jornada para montar a sua rede.'); return; }
    const entrou = alternarSalvo(el.dataset.tipo, el.dataset.id);
    if (Folha.aberta) Folha.fechar();
    pintar(); avisar(entrou ? 'Salvo na sua rede.' : 'Tirado da sua rede.');
  },
  'tirar-salvo': (el) => { alternarSalvo(el.dataset.tipo, el.dataset.id); pintar(); avisar('Tirado da sua rede.'); },
  'filtro-prof': (el) => { filtroProf = el.dataset.id; pintar(); },
  'prof': (el) => abrirProf(el.dataset.id),
  'plano': (el) => {
    const id = el.dataset.id;
    if (!estado.logado) { Folha.fechar(); location.hash = 'entrar'; avisar('Entre para escolher um plano.'); return; }
    if (!NIVEL.hasOwnProperty(id)) return;
    estado.plano = id; gravar(); Folha.fechar(); pintar();
    avisar('Plano ' + nomePlano(id) + ' ativado na simulação. Nada foi cobrado.');
  },
  'filtro-local': (el) => { filtroLocal = el.dataset.id; pintar(); },
  'local': (el) => {
    selLocal = selLocal === el.dataset.id && !el.dataset.rolar ? null : el.dataset.id;
    const rolar = !!el.dataset.rolar; pintar();
    if (rolar) { const m = $('#cidade-mapa'); if (m && !telaLarga()) m.scrollIntoView({ behavior: reduzMovimento() ? 'auto' : 'smooth', block: 'start' }); }
  },
  'grupo': (el) => {
    if (!estado.logado) { pedirEntrada('Entre na sua jornada para participar de um grupo.'); return; }
    const id = el.dataset.id, dentro = estado.salvos.grupos.indexOf(id) >= 0;
    if (!dentro && !temAcesso('premium')) { abrirBloqueio('A participação em grupos faz parte do Premium.', 'premium'); return; }
    alternarSalvo('grupos', id); pintar(); avisar(dentro ? 'Você saiu do grupo.' : 'Você entrou no grupo.');
  },
  'aba-jornada': (el) => { abaJornada = el.dataset.id; pintar(); const a = $('#aba-' + abaJornada); if (a) a.focus({ preventScroll: true }); },
  'mudar-fase': () => abrirFases(),
  'escolher-fase': (el) => { const id = el.dataset.fase; if (id === 'nova' && estado.fase !== 'nova') abrirPausa(); else mudarFase(id); },
  'toggle-objetivo': (el) => { const o = estado.objetivos.find((x) => x.id === el.dataset.id); if (o) { o.rotina = !o.rotina; gravar(); pintar(); } },
  'del-objetivo': (el) => { estado.objetivos = estado.objetivos.filter((x) => x.id !== el.dataset.id); gravar(); pintar(); },
  'del-diario': (el) => { estado.diario = estado.diario.filter((x) => x.id !== el.dataset.id); gravar(); pintar(); avisar('Anotação apagada.'); },
  'sair': () => { estado.logado = false; gravar(); location.hash = 'inicio'; avisar('Você saiu. Sua jornada continua guardada neste navegador.'); },
  'apagar': () => confirmar('Apagar minha jornada', 'Isso apaga fases, check-ins, diário, objetivos e rede deste navegador. Não dá para desfazer.', 'Apagar tudo', 'apagar-sim'),
  'apagar-sim': () => { estado = PADRAO(); gravar(); abaJornada = 'hoje'; Folha.fechar(); if (rota === 'inicio') pintar(); else location.hash = 'inicio'; avisar('Jornada apagada deste navegador.'); },
  'continuar': () => { estado.logado = true; gravar(); location.hash = 'minha-jornada'; },
  'exemplo': () => {
    if (estado.usuario && !estado.exemplo) { confirmar('Perfil de exemplo', 'Entrar com o perfil de exemplo substitui a jornada de ' + esc(estado.usuario.nome) + ' guardada neste navegador.', 'Substituir e entrar', 'exemplo-sim'); return; }
    ACOES['exemplo-sim']();
  },
  'exemplo-sim': () => {
    estado = perfilExemplo(); gravar(); abaJornada = 'hoje'; Folha.fechar();
    if (rota === 'minha-jornada') pintar(); else location.hash = 'minha-jornada';
    avisar('Você entrou com a Ana, um perfil de exemplo.');
  },
  'gerir': () => { gerindo = !gerindo; pintar(); },
  'produto-novo': () => abrirProduto(null),
  'produto-editar': (el) => abrirProduto(el.dataset.id),
  'produto-tirar-foto': (el) => { fotoPendente = null; const pv = $('#pd-previa'); if (pv) pv.innerHTML = '<span>Sem foto</span>'; const c = $('#pd-foto'); if (c) c.value = ''; el.hidden = true; },
  'produto-excluir': async (el) => {
    if (!el.dataset.certo) { el.dataset.certo = '1'; el.textContent = 'Confirmar exclusão'; return; }
    el.disabled = true;
    try { await excluirProduto(el.dataset.id); Folha.fechar(); avisar('Produto excluído.'); }
    catch (e) { el.disabled = false; erroProduto(mensagemErro(e)); }
  },
  'parceiro-editar': () => { estado.parceiro = null; gravar(); pintar(); },
  'pular': () => { try { main.focus(); } catch (e) {} main.scrollIntoView(); }
};
const FORMS = {
  'entrar': (f) => {
    const d = new FormData(f), nome = String(d.get('nome') || '').trim(); if (!nome) return;
    const fase = C.fases[d.get('fase')] ? d.get('fase') : 'crescente';
    estado = PADRAO();
    estado.usuario = { nome: nome, email: String(d.get('email') || '').trim(), desde: hojeISO() };
    estado.logado = true; estado.fase = fase; estado.historico = [{ fase: fase, data: hojeISO() }];
    gravar(); abaJornada = 'hoje'; location.hash = 'minha-jornada';
    avisar('Jornada criada. Boas-vindas, ' + nome.split(' ')[0] + '.');
  },
  'checkin': (f) => {
    const d = new FormData(f);
    estado.checkins[hojeISO()] = { energia: d.get('energia') || '', fez: d.getAll('fez'), nota: String(d.get('nota') || '').trim() };
    gravar(); pintar(); avisar('Check-in salvo.');
  },
  'objetivo': (f) => {
    const t = String(new FormData(f).get('texto') || '').trim(); if (!t) return;
    estado.objetivos.push({ id: 'o' + novoId(), texto: t, rotina: false }); gravar(); pintar();
    const c = $('#obj-novo'); if (c) c.focus({ preventScroll: true });
  },
  'diario': async (f) => {
    const d = new FormData(f), texto = String(d.get('texto') || '').trim(); if (!texto) return;
    const item = { id: 'd' + novoId(), data: hojeISO(), texto: texto };
    const arq = d.get('foto');
    if (arq && arq.size) { try { item.foto = (await reduzirImagem(arq, 720, 0.78)).dataURL; } catch (e) {} }
    estado.diario.unshift(item);
    if (!gravar() && item.foto) { delete item.foto; gravar(); pintar(); avisar('Anotação guardada sem a foto: este navegador ficou sem espaço.'); return; }
    pintar(); avisar('Guardado no diário.');
  },
  'pausa': (f) => { const d = new FormData(f); mudarFase('nova', { motivo: d.get('motivo') || '', nota: String(d.get('nota') || '').trim() }); },
  'parceiro': (f) => {
    const d = new FormData(f), negocio = String(d.get('negocio') || '').trim(), contato = String(d.get('contato') || '').trim();
    if (!negocio || !contato) return;
    estado.parceiro = { negocio: negocio, tipo: String(d.get('tipo') || ''), bairro: String(d.get('bairro') || '').trim(), contato: contato, msg: String(d.get('msg') || '').trim(), data: hojeISO() };
    gravar(); pintar(); avisar('Interesse registrado neste protótipo.');
  },
  'produto': async (f) => {
    const d = new FormData(f), nome = String(d.get('nome') || '').trim(), valor = lerValor(d.get('valor'));
    if (!nome) { erroProduto('Dê um nome ao produto.'); return; }
    if (valor === null) { erroProduto('Informe o valor em reais, como 89,90.'); return; }
    const b = $('#pd-salvar'); b.disabled = true; b.textContent = 'Salvando';
    try {
      await salvarProduto(f.dataset.id || null, { nome: nome, categoria: String(d.get('categoria') || 'Outros'), valor: valor, descricao: String(d.get('descricao') || '').trim() });
      Folha.fechar(); avisar('Produto salvo.');
    } catch (e) { b.disabled = false; b.textContent = 'Salvar produto'; erroProduto(mensagemErro(e)); }
  }
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-acao]');
  const elo = e.target.closest('a[href^="#"]');
  const pop = $('#popover');
  if (pop && !pop.hidden && (elo || !e.target.closest('#popover')) && !(el && el.dataset.acao === 'menu')) fecharPopover();
  if (elo && !(el && el.dataset.acao === 'pular')) {
    if (elo.closest('#folha')) Folha.fechar();
    if (elo.getAttribute('href').slice(1) === rota) window.scrollTo({ top: 0, behavior: reduzMovimento() ? 'auto' : 'smooth' });
  }
  if (!el) return;
  const f = ACOES[el.dataset.acao]; if (!f) return;
  if (el.tagName !== 'A' || el.dataset.acao === 'pular') e.preventDefault();
  f(el, e);
});
document.addEventListener('submit', (e) => {
  const f = e.target.closest('form[data-form]'); if (!f) return;
  e.preventDefault();
  const h = FORMS[f.dataset.form]; if (h) h(f, e);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharPopover();
  const t = e.target;
  if ((e.key === 'Enter' || e.key === ' ') && t && t.matches && t.matches('g[role="button"][data-acao]')) { e.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && t && t.matches && t.matches('[role="tab"]')) {
    const abas = $$('[role="tab"]', t.parentNode), i = abas.indexOf(t), n = abas[(i + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length];
    if (n) { e.preventDefault(); n.click(); }
  }
});
document.addEventListener('pointerover', (e) => {
  const c = e.target.closest && e.target.closest('[data-loop]');
  if (!c || !c.classList.contains('vivo') || c.contains(e.relatedTarget)) return;
  c.classList.remove('vivo'); void c.offsetWidth; c.classList.add('vivo');
});
document.addEventListener('error', (e) => { const t = e.target; if (t && t.tagName === 'IMG' && t.dataset && t.dataset.some) t.remove(); }, true);
window.addEventListener('hashchange', () => navegar(false));

/* ───────── Partida ───────── */
function iniciar(guardado) {
  lerAcess(); aplicarAcess();
  const tema = $('meta[name="theme-color"]'); if (tema) tema.content = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim();
  estado = normalizar(guardado && guardado.v ? guardado : lerLocal());
  Folha.montar(); montarCasca(); navegar(true); ligarNuvem();
}
const quente = window.claude && window.claude.hot;
try { if (quente && quente.snapshot) quente.snapshot(() => JSON.parse(JSON.stringify(estado))); } catch (e) {}
if (quente && quente.ready) quente.ready(iniciar); else iniciar((quente && quente.data) || {});
})();
