(() => {
  'use strict';

  const CARDS = [{"id":"HMM-001","name":"Enoch","title":"The Man Who Walked with God","role":"FAITHFUL WITNESS","index":0},{"id":"HMM-002","name":"Noah","title":"The Ark Builder","role":"BUILDER & PATRIARCH","index":1},{"id":"HMM-003","name":"Abraham","title":"Father of Faith","role":"PATRIARCH","index":2},{"id":"HMM-004","name":"Sarah","title":"Mother of Promise","role":"MATRIARCH","index":3},{"id":"HMM-005","name":"Isaac","title":"Son of Promise","role":"PATRIARCH","index":4},{"id":"HMM-006","name":"Rebekah","title":"The Decisive Bride","role":"MATRIARCH","index":5},{"id":"HMM-007","name":"Jacob","title":"The Wrestler","role":"PATRIARCH","index":6},{"id":"HMM-008","name":"Joseph","title":"The Dreamer","role":"GOVERNOR","index":7},{"id":"HMM-009","name":"Moses","title":"The Deliverer","role":"DELIVERER & PROPHET","index":8},{"id":"HMM-010","name":"Aaron","title":"The High Priest","role":"HIGH PRIEST","index":9},{"id":"HMM-011","name":"Miriam","title":"The Song Leader","role":"PROPHETESS","index":10},{"id":"HMM-012","name":"Joshua","title":"The Conqueror","role":"COMMANDER","index":11},{"id":"HMM-013","name":"Caleb","title":"The Wholehearted Scout","role":"SCOUT & WARRIOR","index":12},{"id":"HMM-014","name":"Rahab","title":"The Scarlet Cord","role":"COURAGEOUS WITNESS","index":13},{"id":"HMM-015","name":"Deborah","title":"The Fearless Judge","role":"JUDGE & PROPHETESS","index":14},{"id":"HMM-016","name":"Gideon","title":"The Three-Hundred Commander","role":"JUDGE & WARRIOR","index":15},{"id":"HMM-017","name":"Samson","title":"The Strongman","role":"JUDGE & WARRIOR","index":16},{"id":"HMM-018","name":"Ruth","title":"The Loyal One","role":"FAITHFUL WITNESS","index":17},{"id":"HMM-019","name":"Boaz","title":"The Kinsman-Redeemer","role":"KINSMAN & LEADER","index":18},{"id":"HMM-020","name":"Hannah","title":"The Prayer Warrior","role":"WOMAN OF PRAYER","index":19},{"id":"HMM-021","name":"Samuel","title":"The Listening Prophet","role":"PROPHET & JUDGE","index":20},{"id":"HMM-022","name":"Jonathan","title":"The Loyal Prince","role":"PRINCE & WARRIOR","index":21},{"id":"HMM-023","name":"David","title":"The Shepherd King","role":"KING & WARRIOR","index":22},{"id":"HMM-024","name":"Abigail","title":"The Wise Peacemaker","role":"WISE PEACEMAKER","index":23},{"id":"HMM-025","name":"Solomon","title":"The Wise King","role":"KING","index":24},{"id":"HMM-026","name":"Nathan","title":"The Truth-Teller","role":"PROPHET","index":25},{"id":"HMM-027","name":"Benaiah","title":"The Lion-Pit Warrior","role":"COMMANDER","index":26},{"id":"HMM-028","name":"Elijah","title":"The Fire Prophet","role":"PROPHET","index":27},{"id":"HMM-029","name":"Elisha","title":"The Double-Portion Prophet","role":"PROPHET","index":28},{"id":"HMM-030","name":"Hezekiah","title":"The Reforming King","role":"KING","index":29},{"id":"HMM-031","name":"Josiah","title":"The Scripture King","role":"KING","index":30},{"id":"HMM-032","name":"Isaiah","title":"The Visionary Prophet","role":"PROPHET","index":31},{"id":"HMM-033","name":"Jeremiah","title":"The Unshaken Prophet","role":"PROPHET","index":32},{"id":"HMM-034","name":"Ezekiel","title":"The Watchman","role":"PROPHET","index":33},{"id":"HMM-035","name":"Daniel","title":"The Lion's Den Statesman","role":"PROPHET & STATESMAN","index":34},{"id":"HMM-036","name":"Shadrach","title":"The Furnace Faithful","role":"FAITHFUL EXILE","index":35},{"id":"HMM-037","name":"Meshach","title":"The Unbowed Exile","role":"FAITHFUL EXILE","index":36},{"id":"HMM-038","name":"Abednego","title":"The Unshaken Exile","role":"FAITHFUL EXILE","index":37},{"id":"HMM-039","name":"Esther","title":"The Courageous Queen","role":"QUEEN","index":38},{"id":"HMM-040","name":"Mordecai","title":"The Watchful Adviser","role":"ROYAL ADVISER","index":39},{"id":"HMM-041","name":"Ezra","title":"The Scripture Scribe","role":"SCRIBE & PRIEST","index":40},{"id":"HMM-042","name":"Nehemiah","title":"The Wall Builder","role":"GOVERNOR & BUILDER","index":41},{"id":"HMM-043","name":"Job","title":"The Enduring Servant","role":"FAITHFUL SUFFERER","index":42},{"id":"HMM-044","name":"Mary (Mother of Jesus)","title":"The Willing Servant","role":"MOTHER OF JESUS","index":43},{"id":"HMM-045","name":"Joseph of Nazareth","title":"The Faithful Guardian","role":"GUARDIAN","index":44},{"id":"HMM-046","name":"Elizabeth","title":"The Faithful Mother","role":"FAITHFUL WITNESS","index":45},{"id":"HMM-047","name":"John the Baptist","title":"The Voice in the Wilderness","role":"PROPHET & FORERUNNER","index":46},{"id":"HMM-048","name":"Peter","title":"The Rock","role":"APOSTLE","index":47},{"id":"HMM-049","name":"Andrew","title":"The Bringer","role":"APOSTLE","index":48},{"id":"HMM-050","name":"James (Son of Zebedee)","title":"The Son of Thunder","role":"APOSTLE","index":49},{"id":"HMM-051","name":"John (Apostle)","title":"The Faithful Witness","role":"APOSTLE","index":50},{"id":"HMM-052","name":"Matthew","title":"The Called Collector","role":"APOSTLE","index":51},{"id":"HMM-053","name":"Thomas","title":"The Honest Believer","role":"APOSTLE","index":52},{"id":"HMM-054","name":"Philip","title":"The Inviter","role":"APOSTLE","index":53},{"id":"HMM-055","name":"Mary Magdalene","title":"The First Witness","role":"DISCIPLE & WITNESS","index":54},{"id":"HMM-056","name":"Stephen","title":"The Fearless Witness","role":"WITNESS & MARTYR","index":55},{"id":"HMM-057","name":"Barnabas","title":"The Encourager","role":"MISSIONARY & MENTOR","index":56},{"id":"HMM-058","name":"Paul","title":"The Unstoppable Missionary","role":"APOSTLE & MISSIONARY","index":57},{"id":"HMM-059","name":"Timothy","title":"The Young Leader","role":"PASTOR & MISSIONARY","index":58},{"id":"HMM-060","name":"Silas","title":"The Midnight Singer","role":"MISSIONARY","index":59},{"id":"HMM-061","name":"Priscilla","title":"The Skilled Teacher","role":"TEACHER & MISSIONARY","index":60},{"id":"HMM-062","name":"Aquila","title":"The Faithful Partner","role":"TEACHER & MISSIONARY","index":61},{"id":"HMM-063","name":"Lydia","title":"The Open-Hearted Host","role":"HOST & CHURCH SUPPORTER","index":62},{"id":"HMM-064","name":"Phoebe","title":"The Trusted Servant","role":"SERVANT & BENEFACTOR","index":63}];
  const STORAGE_KEY = 'mbot-mighty-vault-v1';
  const RARITIES = {
    standard: { label: 'Standard', weight: 72, points: 1 },
    rare: { label: 'Gold Foil', weight: 20, points: 3 },
    epic: { label: 'Royal Foil', weight: 7, points: 8 },
    legendary: { label: 'Crown Relic', weight: 1, points: 20 }
  };
  const RANK = { standard: 0, rare: 1, epic: 2, legendary: 3 };
  const ATLAS_URL = 'assets/mighty-vault-card-atlas.webp?v=20260902-final';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const byId = id => CARDS.find(card => card.id === id);

  const today = () => {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  };
  const dayDiff = (a, b) => Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000);
  const blankState = () => ({ collection: {}, points: 0, streak: 0, lastOpen: null, pending: null });

  let storageWorks = true;
  let memoryState = blankState();
  function normalize(raw) {
    const base = blankState();
    if (!raw || typeof raw !== 'object') return base;
    base.collection = raw.collection && typeof raw.collection === 'object' ? raw.collection : {};
    base.points = Number.isFinite(Number(raw.points)) ? Number(raw.points) : 0;
    base.streak = Number.isFinite(Number(raw.streak)) ? Number(raw.streak) : 0;
    base.lastOpen = typeof raw.lastOpen === 'string' ? raw.lastOpen : null;
    base.pending = Array.isArray(raw.pending) ? raw.pending.filter(d => byId(d.id) && RARITIES[d.rarity]) : null;
    return base;
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return normalize(raw ? JSON.parse(raw) : blankState());
    } catch (err) {
      storageWorks = false;
      return normalize(memoryState);
    }
  }
  function save(next) {
    memoryState = normalize(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
      storageWorks = true;
    } catch (err) {
      storageWorks = false;
    }
  }

  let state = load();
  let filter = 'all';

  function spriteStyle(index) {
    const special = {
      61: 'assets/vault-aquila.webp?v=20260902-final',
      62: 'assets/vault-lydia.webp?v=20260902-final',
      63: 'assets/vault-phoebe.webp?v=20260902-final'
    };
    if (special[index]) return `background-image:url('${special[index]}');background-position:center;background-size:cover;`;
    const col = index % 8;
    const row = Math.floor(index / 8);
    const step = 100 / 7;
    return `background-image:url('${ATLAS_URL}');background-position:${(col * step).toFixed(4)}% ${(row * step).toFixed(4)}%;`;
  }
  function bestVariant(entry) {
    if (!entry) return null;
    const variants = entry.variants || {};
    return Object.keys(variants).filter(k => (variants[k] || 0) > 0).sort((a, b) => RANK[b] - RANK[a])[0] || 'standard';
  }
  function uniqueCount() {
    return CARDS.reduce((n, card) => n + (state.collection[card.id]?.total > 0 ? 1 : 0), 0);
  }
  function rareCount() {
    return Object.values(state.collection).reduce((n, entry) => n + Object.entries(entry.variants || {}).filter(([k, v]) => k !== 'standard' && v > 0).length, 0);
  }
  function rarityRoll(minimum = 'standard') {
    const r = Math.random() * 100;
    let key = r < 1 ? 'legendary' : r < 8 ? 'epic' : r < 28 ? 'rare' : 'standard';
    if (RANK[key] < RANK[minimum]) key = minimum;
    return key;
  }
  function chooseCard({ forceNew = false, exclude = new Set() } = {}) {
    let pool = CARDS.filter(card => !exclude.has(card.id));
    if (forceNew) {
      const missing = pool.filter(card => !state.collection[card.id]?.total);
      if (missing.length) pool = missing;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function createPack() {
    const t = today();
    if (state.pending?.length) return state.pending;
    if (state.lastOpen === t) return null;

    const previous = state.lastOpen;
    state.streak = previous && dayDiff(previous, t) === 1 ? state.streak + 1 : 1;
    const pack = [];
    const used = new Set();
    const guaranteeNew = uniqueCount() < 40;
    for (let i = 0; i < 3; i++) {
      const card = chooseCard({ forceNew: i === 0 && guaranteeNew, exclude: used });
      if (!card) break;
      used.add(card.id);
      const minimum = state.streak % 7 === 0 && i === 2 ? 'rare' : 'standard';
      pack.push({ id: card.id, rarity: rarityRoll(minimum) });
    }
    state.pending = pack;
    save(state);
    return pack;
  }
  function collectPending() {
    if (!state.pending?.length) return;
    for (const draw of state.pending) {
      const entry = state.collection[draw.id] || { total: 0, variants: { standard: 0, rare: 0, epic: 0, legendary: 0 } };
      if (entry.total > 0) state.points += RARITIES[draw.rarity].points;
      entry.total += 1;
      entry.variants[draw.rarity] = (entry.variants[draw.rarity] || 0) + 1;
      state.collection[draw.id] = entry;
    }
    state.lastOpen = today();
    state.pending = null;
    save(state);
    renderAll();
    const collection = $('#collection');
    if (collection) collection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cardArt(card, extraClass = '') {
    return `<div class="vault-card-art ${extraClass}" style="${spriteStyle(card.index)}"></div>`;
  }
  function setHidden(el, hidden) {
    if (!el) return;
    el.hidden = hidden;
    el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }
  function renderStats() {
    const u = uniqueCount();
    const total = CARDS.length;
    const unique = $('[data-unique-count]'); if (unique) unique.textContent = String(u);
    const liveTotal = $('[data-live-total]'); if (liveTotal) liveTotal.textContent = String(total);
    const points = $('[data-points]'); if (points) points.textContent = String(state.points);
    const streak = $('[data-streak]'); if (streak) streak.textContent = String(state.streak);
    const rare = $('[data-rare-count]'); if (rare) rare.textContent = String(rareCount());
    const progressCopy = $('[data-progress-copy]'); if (progressCopy) progressCopy.textContent = `${u} of ${total} heroes collected`;
    const progressBar = $('[data-progress-bar]'); if (progressBar) progressBar.style.width = `${Math.round((u / total) * 100)}%`;
    const storageNote = $('[data-storage-status]');
    if (storageNote) storageNote.textContent = storageWorks ? 'Saved on this device' : 'Temporary session mode — browser storage is unavailable';
  }
  function showPack(pack, { scroll = false } = {}) {
    const closed = $('[data-pack-closed]');
    const reveal = $('[data-pack-reveal]');
    const grid = $('[data-reveal-grid]');
    setHidden(closed, true);
    setHidden(reveal, false);
    if (grid) {
      grid.innerHTML = pack.map(draw => {
        const card = byId(draw.id);
        const owned = state.collection[card.id]?.total > 0;
        return `<article class="vault-reveal-card"><div class="vault-reveal-art">${cardArt(card)}<span class="vault-foil ${draw.rarity === 'standard' ? '' : draw.rarity}"></span></div><div class="vault-reveal-meta"><span class="vault-rarity-label">${RARITIES[draw.rarity].label}</span><strong>${card.name}</strong><small>${owned ? 'Duplicate · Vault Points awarded when collected' : 'NEW HERO'}</small></div></article>`;
      }).join('');
    }
    if (scroll && reveal) requestAnimationFrame(() => reveal.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }
  function renderPackStatus() {
    const status = $('[data-pack-status]');
    const available = state.lastOpen !== today() || !!state.pending?.length;
    $$('[data-open-pack]').forEach(button => {
      button.disabled = !available;
      button.setAttribute('aria-disabled', String(!available));
    });
    if (status) status.textContent = state.pending?.length ? 'Pack opened — add it to your Vault' : available ? 'Available today' : 'Come back tomorrow for your next free pack';
    if (state.pending?.length) showPack(state.pending);
    else {
      setHidden($('[data-pack-closed]'), false);
      setHidden($('[data-pack-reveal]'), true);
    }
  }
  function renderGrid() {
    const grid = $('[data-vault-grid]');
    if (!grid) return;
    const cards = CARDS.filter(card => {
      const entry = state.collection[card.id];
      const owned = !!entry?.total;
      const best = bestVariant(entry);
      if (filter === 'owned') return owned;
      if (filter === 'missing') return !owned;
      if (filter === 'rare') return owned && RANK[best] >= 1;
      return true;
    });
    grid.innerHTML = cards.map(card => {
      const entry = state.collection[card.id];
      const owned = !!entry?.total;
      const best = bestVariant(entry) || 'standard';
      return `<button class="vault-slot ${owned ? 'is-owned' : 'is-missing'}" type="button" data-card-id="${card.id}" aria-label="${owned ? `Open ${card.name} card details` : `${card.name} not yet collected`}">${cardArt(card)}${owned ? `<span class="vault-foil ${best === 'standard' ? '' : best}"></span><i class="vault-variant-dot ${best}"></i>` : ''}<span class="vault-slot-label">${card.name}</span></button>`;
    }).join('');
    $$('[data-card-id]', grid).forEach(button => button.addEventListener('click', () => openModal(button.dataset.cardId)));
  }
  function openModal(id) {
    const card = byId(id);
    const entry = state.collection[id];
    if (!card || !entry?.total) return;
    const best = bestVariant(entry);
    const art = $('[data-modal-art]'); if (art) art.setAttribute('style', spriteStyle(card.index));
    const foil = $('[data-modal-foil]'); if (foil) foil.className = `vault-foil ${best === 'standard' ? '' : best}`;
    const rarity = $('[data-modal-rarity]'); if (rarity) rarity.textContent = RARITIES[best].label;
    const name = $('[data-modal-name]'); if (name) name.textContent = card.name;
    const title = $('[data-modal-title]'); if (title) title.textContent = card.title;
    const role = $('[data-modal-role]'); if (role) role.textContent = card.role;
    const count = $('[data-modal-count]'); if (count) count.textContent = `Owned copies: ${entry.total}`;
    setHidden($('[data-vault-modal]'), false);
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    setHidden($('[data-vault-modal]'), true);
    document.body.style.overflow = '';
  }
  function renderAll() {
    renderStats();
    renderPackStatus();
    renderGrid();
  }
  function openPack() {
    const pack = createPack();
    if (pack?.length) showPack(pack, { scroll: true });
    renderStats();
    renderPackStatus();
  }

  function bind() {
    $$('[data-open-pack]').forEach(button => button.addEventListener('click', openPack));
    const collect = $('[data-collect-pack]'); if (collect) collect.addEventListener('click', collectPending);
    $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.filter;
      $$('[data-filter]').forEach(x => x.classList.toggle('is-active', x === button));
      renderGrid();
    }));
    $$('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
    $$('[data-sprite-index]').forEach(el => el.setAttribute('style', spriteStyle(Number(el.dataset.spriteIndex))));
  }

  try {
    bind();
    renderAll();
    document.documentElement.dataset.vaultReady = 'true';
  } catch (err) {
    console.error('Mighty Vault failed to initialize', err);
    const status = $('[data-pack-status]');
    if (status) status.textContent = 'The Vault could not start. Refresh this page to try again.';
    document.documentElement.dataset.vaultReady = 'error';
  }
})();
