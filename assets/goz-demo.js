/* ============================================================
   goz.ai — Demo Try-It-Now
   ------------------------------------------------------------
   - Fingerprint del dispositivo (canvas + webgl + hw + screen)
   - IP via ipify (fallback ipapi)
   - Rate limit en MULTIPLES capas:
       * localStorage
       * sessionStorage
       * IndexedDB
       * cookies (1 año)
   - Watermark FUERTE en TODA la imagen (tiled + rotado + sombra)
   - Stub de API (reemplazar generateImageAPI con tu endpoint real)
   ============================================================ */

(function () {
  'use strict';

  // ============= CONFIG =============
  const CONFIG = {
    /* === ENDPOINT — backend Next.js (projeto hot/web) === */
    API_URL: 'http://localhost:3000/api/public-generate', // ← TROCA para sua URL de produção
    MAX_FREE_GENERATIONS: 1,
    STORAGE_KEY: 'goz_dgens_v1',
    COOKIE_NAME: 'goz_dg',
    IDB_NAME: 'goz_demo',
    IDB_STORE: 'gens',
    MAX_FILE_MB: 8,
    REGISTER_URL: 'https://app.goz.ai/registro?utm_source=lp&utm_medium=ads&utm_campaign=demo',
    WATERMARK: {
      text: 'goz.ai · PRUEBA · goz.ai',
      fontFamily: 'Inter, sans-serif',
      fontWeightMain: '900',
      fontWeightSub: '600',
      angle: -28,                // grados
      opacity: 0.42,             // 0-1
      densityX: 3,               // veces que se repite horizontal
      densityY: 5,               // veces que se repite vertical
      colorMain: 'rgba(255,255,255,0.42)',
      colorStroke: 'rgba(0,0,0,0.55)',
      cornerLabel: 'PRUEBA GRATIS · goz.ai'
    }
  };

  // ============= STATE =============
  const $ = (id) => document.getElementById(id);
  const stages = {
    upload: () => $('demoStageUpload'),
    preview: () => $('demoStagePreview'),
    loading: () => $('demoStageLoading'),
    result: () => $('demoStageResult'),
    blocked: () => $('demoStageBlocked')
  };

  let currentFile = null;
  let currentPreviewURL = null;
  let resultCanvas = null;

  // ============= FINGERPRINT =============
  function hash32(str) {
    let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  function canvasFingerprint() {
    try {
      const c = document.createElement('canvas');
      c.width = 240; c.height = 60;
      const ctx = c.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px "Arial"';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('goz.ai🔥+18,~?', 2, 15);
      ctx.fillStyle = 'rgba(102,204,0,0.7)';
      ctx.fillText('goz.ai🔥+18,~?', 4, 17);
      return c.toDataURL();
    } catch (e) { return 'no-canvas'; }
  }

  function webglFingerprint() {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return 'no-webgl';
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
      const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      return vendor + '|' + renderer;
    } catch (e) { return 'no-webgl'; }
  }

  async function getFingerprint() {
    const parts = [
      navigator.userAgent || '',
      navigator.language || '',
      (navigator.languages || []).join(','),
      navigator.platform || '',
      navigator.hardwareConcurrency || 0,
      navigator.deviceMemory || 0,
      screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
      screen.availWidth + 'x' + screen.availHeight,
      new Date().getTimezoneOffset(),
      Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      canvasFingerprint(),
      webglFingerprint(),
      (navigator.plugins ? navigator.plugins.length : 0),
      (navigator.maxTouchPoints || 0)
    ].join('::');
    return hash32(parts);
  }

  // ============= IP =============
  async function getIP() {
    const sources = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://api.bigdatacloud.net/data/client-ip'
    ];
    for (const url of sources) {
      try {
        const r = await fetch(url, { cache: 'no-store' });
        if (!r.ok) continue;
        const j = await r.json();
        const ip = j.ip || j.ipAddress || j.IPv4 || null;
        if (ip) return ip;
      } catch (e) { /* try next */ }
    }
    return 'unknown';
  }

  // ============= STORAGE (multi-layer) =============
  function setCookie(name, value, days) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + days * 86400000);
      document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
    } catch (e) {}
  }

  function getCookie(name) {
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  function idbOpen() {
    return new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(CONFIG.IDB_NAME, 1);
        req.onupgradeneeded = () => {
          req.result.createObjectStore(CONFIG.IDB_STORE, { keyPath: 'id' });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) { reject(e); }
    });
  }

  async function idbGet(id) {
    try {
      const db = await idbOpen();
      return await new Promise((res) => {
        const tx = db.transaction(CONFIG.IDB_STORE, 'readonly');
        const r = tx.objectStore(CONFIG.IDB_STORE).get(id);
        r.onsuccess = () => res(r.result ? r.result.value : null);
        r.onerror = () => res(null);
      });
    } catch (e) { return null; }
  }

  async function idbSet(id, value) {
    try {
      const db = await idbOpen();
      return await new Promise((res) => {
        const tx = db.transaction(CONFIG.IDB_STORE, 'readwrite');
        tx.objectStore(CONFIG.IDB_STORE).put({ id, value });
        tx.oncomplete = () => res(true);
        tx.onerror = () => res(false);
      });
    } catch (e) { return false; }
  }

  function readAllStorages(key) {
    const values = [];
    try { const v = localStorage.getItem(key); if (v) values.push(v); } catch (e) {}
    try { const v = sessionStorage.getItem(key); if (v) values.push(v); } catch (e) {}
    try { const v = getCookie(CONFIG.COOKIE_NAME); if (v) values.push(v); } catch (e) {}
    return values;
  }

  function writeAllStorages(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
    try { sessionStorage.setItem(key, value); } catch (e) {}
    try { setCookie(CONFIG.COOKIE_NAME, value, 365); } catch (e) {}
  }

  /* Devuelve {count, records[]} con la suma máxima detectada en cualquier capa */
  async function readUsage(deviceKey) {
    const all = [];
    // localStorage / sessionStorage / cookie
    for (const raw of readAllStorages(CONFIG.STORAGE_KEY)) {
      try {
        const obj = JSON.parse(raw);
        if (obj && Array.isArray(obj.records)) all.push(obj);
      } catch (e) {}
    }
    // IndexedDB (por device key)
    const idbVal = await idbGet(deviceKey);
    if (idbVal && idbVal.records) all.push(idbVal);

    if (all.length === 0) return { count: 0, records: [] };

    // unimos por timestamp único
    const map = new Map();
    all.forEach(o => o.records.forEach(r => {
      if (r && r.ts) map.set(r.ts + ':' + (r.dk || ''), r);
    }));
    const merged = Array.from(map.values()).sort((a, b) => a.ts - b.ts);
    // Contamos solo registros del mismo device key (o legados sin dk)
    const mineCount = merged.filter(r => !r.dk || r.dk === deviceKey).length;
    return { count: Math.max(mineCount, all.reduce((m, o) => Math.max(m, o.records.length), 0)), records: merged };
  }

  async function pushUsage(deviceKey, ip) {
    const { records } = await readUsage(deviceKey);
    records.push({ ts: Date.now(), dk: deviceKey, ip: ip || 'unknown' });
    const payload = JSON.stringify({ records, updatedAt: Date.now() });
    writeAllStorages(CONFIG.STORAGE_KEY, payload);
    await idbSet(deviceKey, { records });
  }

  // ============= WATERMARK =============
  /* Aplica watermark FUERTE sobre TODA la imagen.
     - Diagonal repetida
     - Doble capa (sombra + texto)
     - Etiqueta de esquina
     - Borde sutil
  */
  function applyWatermark(canvas, sourceImg) {
    const cfg = CONFIG.WATERMARK;
    const w = sourceImg.naturalWidth || sourceImg.width;
    const h = sourceImg.naturalHeight || sourceImg.height;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // 1. Imagen base
    ctx.drawImage(sourceImg, 0, 0, w, h);

    // 2. Tinte muy leve para integrar marca
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, w, h);

    // 3. Watermark TILED rotado
    const fontSize = Math.max(18, Math.floor(Math.min(w, h) / 22));
    ctx.save();
    ctx.globalAlpha = cfg.opacity;
    ctx.font = cfg.fontWeightMain + ' ' + fontSize + 'px ' + cfg.fontFamily;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(w / 2, h / 2);
    ctx.rotate(cfg.angle * Math.PI / 180);

    const text = cfg.text;
    const metrics = ctx.measureText(text);
    const stepX = Math.max(metrics.width * 1.15, w / cfg.densityX);
    const stepY = Math.max(fontSize * 3.2, h / cfg.densityY);
    // dibujamos en una grilla amplia para cubrir todo tras rotación
    const span = Math.max(w, h) * 1.6;
    for (let y = -span; y <= span; y += stepY) {
      const offX = (Math.floor(y / stepY) % 2 === 0) ? 0 : stepX / 2;
      for (let x = -span + offX; x <= span; x += stepX) {
        // sombra
        ctx.strokeStyle = cfg.colorStroke;
        ctx.lineWidth = Math.max(2, fontSize / 10);
        ctx.strokeText(text, x, y);
        // texto principal
        ctx.fillStyle = cfg.colorMain;
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();

    // 4. Etiqueta inferior sólida
    drawCornerLabel(ctx, w, h, cfg.cornerLabel, fontSize);

    // 5. Borde con marca
    drawBranding(ctx, w, h);
  }

  function drawCornerLabel(ctx, w, h, text, refFont) {
    const pad = Math.max(16, Math.floor(w * 0.018));
    const fs = Math.max(14, Math.floor(refFont * 0.7));
    ctx.save();
    ctx.font = '800 ' + fs + 'px Inter, sans-serif';
    const tw = ctx.measureText(text).width;
    const boxW = tw + pad * 2;
    const boxH = fs + pad;
    const x = w - boxW - pad;
    const y = h - boxH - pad;

    // box bg gradiente verde goz.ai
    const grad = ctx.createLinearGradient(x, y, x + boxW, y + boxH);
    grad.addColorStop(0, 'rgba(0,161,60,0.92)');
    grad.addColorStop(1, 'rgba(0,107,37,0.92)');
    ctx.fillStyle = grad;
    roundRect(ctx, x, y, boxW, boxH, 8);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + pad, y + boxH / 2);
    ctx.restore();
  }

  function drawBranding(ctx, w, h) {
    // borde inferior con franja semitransparente
    const stripH = Math.max(6, Math.floor(h * 0.012));
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(0,161,60,0)');
    grad.addColorStop(0.5, 'rgba(0,161,60,0.85)');
    grad.addColorStop(1, 'rgba(0,161,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, h - stripH, w, stripH);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ============= API REAL (Replicate via Next.js route) =============
  /* Chama POST /api/public-generate (projeto hot/web) que:
       1. valida + rate-limit por cookie httpOnly
       2. roda bytedance/seedream-4.5 com UNDRESS_PROMPT
       3. aplica watermark FORTE no servidor (sharp + SVG)
       4. devolve { ok, outputUrl: dataURI }
     Como o watermark já vem do servidor, NÃO aplicamos o do client em cima
     (ver `applyWatermark` mais abaixo — agora opcional). */
  async function generateImageAPI(file, onProgress) {
    onProgress && onProgress('Subiendo imagen…');
    const fd = new FormData();
    fd.append('image', file);
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 120000);

    let res;
    try {
      onProgress && onProgress('Generando con goz.ai…');
      res = await fetch(CONFIG.API_URL, {
        method: 'POST',
        body: fd,
        credentials: 'include', // envia/recebe cookie anon
        signal: ac.signal
      });
    } catch (e) {
      clearTimeout(timeout);
      throw new Error(ac.signal.aborted ? 'Tiempo de espera agotado' : 'Error de conexión');
    }
    clearTimeout(timeout);

    let json;
    try { json = await res.json(); } catch { throw new Error('Respuesta inválida del servidor'); }

    if (!res.ok || !json.ok) {
      const msg = json?.error || `Error ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }

    onProgress && onProgress('Aplicando refinamiento…');
    // outputUrl é data:image/jpeg;base64,...
    // O fetch transforma em blob via outra chamada (data URI funciona em <img src>, mas precisamos blob)
    const blobRes = await fetch(json.outputUrl);
    const blob = await blobRes.blob();
    return { blob, alreadyWatermarked: true };
  }

  // ============= HELPERS =============
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function showStage(name) {
    Object.keys(stages).forEach(k => {
      const el = stages[k]();
      if (el) el.hidden = (k !== name);
    });
  }

  function fileToImage(fileOrBlob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(fileOrBlob);
      const img = new Image();
      img.onload = () => resolve({ img, url });
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
      img.src = url;
    });
  }

  // ============= UI WIRING =============
  function wireUpload() {
    const input = $('demoFile');
    const drop = $('demoDrop');
    if (!input || !drop) return;

    input.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) handleFile(f);
    });

    ['dragover', 'dragenter'].forEach(ev => {
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(ev => {
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('dragover'); });
    });
    drop.addEventListener('drop', (e) => {
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });

    const changeBtn = $('demoChangeBtn');
    if (changeBtn) changeBtn.addEventListener('click', resetToUpload);

    const genBtn = $('demoGenerateBtn');
    if (genBtn) genBtn.addEventListener('click', startGeneration);

    const dlBtn = $('demoDownloadBtn');
    if (dlBtn) dlBtn.addEventListener('click', downloadResult);
  }

  function handleFile(file) {
    if (!file.type.startsWith('image/')) { alert('Por favor sube una imagen válida'); return; }
    if (file.size > CONFIG.MAX_FILE_MB * 1024 * 1024) {
      alert('La imagen es muy grande (máx ' + CONFIG.MAX_FILE_MB + 'MB)');
      return;
    }
    currentFile = file;
    if (currentPreviewURL) URL.revokeObjectURL(currentPreviewURL);
    currentPreviewURL = URL.createObjectURL(file);
    const img = $('demoPreviewImg');
    if (img) img.src = currentPreviewURL;
    showStage('preview');
  }

  function resetToUpload() {
    currentFile = null;
    if (currentPreviewURL) { URL.revokeObjectURL(currentPreviewURL); currentPreviewURL = null; }
    const inp = $('demoFile');
    if (inp) inp.value = '';
    showStage('upload');
  }

  async function startGeneration() {
    if (!currentFile) return;
    showStage('loading');
    const titleEl = $('demoLoaderTitle');
    const stepEl = $('demoLoaderStep');
    if (titleEl) titleEl.textContent = 'Generando…';

    // 1. Re-check rate limit (defensa contra abrir varias pestañas)
    const [fp, ip] = await Promise.all([getFingerprint(), getIP()]);
    const deviceKey = hash32(fp + '|' + ip);
    const usage = await readUsage(deviceKey);
    if (usage.count >= CONFIG.MAX_FREE_GENERATIONS) {
      showStage('blocked');
      return;
    }

    // 2. Llamada API
    let result;
    try {
      result = await generateImageAPI(currentFile, (s) => { if (stepEl) stepEl.textContent = s; });
    } catch (e) {
      if (e && e.status === 429) {
        // server rate-limit (cookie anon ya usado) → estado bloqueado
        await pushUsage(deviceKey, ip); // sincroniza el lado client
        showStage('blocked');
        return;
      }
      alert((e && e.message) ? ('Error: ' + e.message) : 'Hubo un error al generar. Intenta de nuevo.');
      showStage('preview');
      return;
    }

    // 3. Cargar imagen resultante y aplicar watermark
    const source = result.blob || (result.url ? await fetch(result.url).then(r => r.blob()) : null);
    if (!source) { alert('Respuesta de API inválida'); showStage('preview'); return; }
    let imgWrap;
    try { imgWrap = await fileToImage(source); } catch (e) { alert('Error al cargar resultado'); showStage('preview'); return; }

    const canvas = $('demoResultCanvas');
    if (result.alreadyWatermarked) {
      // servidor já aplicou watermark forte — só desenha
      canvas.width = imgWrap.img.naturalWidth;
      canvas.height = imgWrap.img.naturalHeight;
      canvas.getContext('2d').drawImage(imgWrap.img, 0, 0);
    } else {
      if (stepEl) stepEl.textContent = 'Aplicando marca de agua…';
      await sleep(250);
      applyWatermark(canvas, imgWrap.img);
    }
    resultCanvas = canvas;
    URL.revokeObjectURL(imgWrap.url);

    // 4. Registrar uso en TODAS las capas
    await pushUsage(deviceKey, ip);

    showStage('result');
  }

  function downloadResult() {
    if (!resultCanvas) return;
    resultCanvas.toBlob((blob) => {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = 'goz-demo-watermark.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/jpeg', 0.92);
  }

  // ============= INIT =============
  async function init() {
    wireUpload();

    // chequeo inicial: si ya consumió, ir directo a blocked
    try {
      const fp = await getFingerprint();
      const ip = await getIP();
      const deviceKey = hash32(fp + '|' + ip);
      const usage = await readUsage(deviceKey);
      if (usage.count >= CONFIG.MAX_FREE_GENERATIONS) {
        showStage('blocked');
      }
    } catch (e) {
      // si falla la detección, dejamos el upload visible (fail-open en UX)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
