const menuButton = document.querySelector('.menu-button');
const primaryNav = document.querySelector('#primary-nav');

if (menuButton && primaryNav) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    primaryNav.dataset.open = 'false';
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    primaryNav.dataset.open = String(!isOpen);
  });

  primaryNav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && primaryNav.dataset.open === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
}

const recordEvent = (name, detail = {}) => {
  const safeDetail = { event: name, ...detail };
  window.dispatchEvent(new CustomEvent('mbot:analytics', { detail: safeDetail }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(safeDetail);
};

const passportKey = 'mbot-mission-passport-v1';
const badgeNames = ['truth-reader', 'product-explorer', 'discovery-mapper', 'pathfinder', 'first-draw', 'hero-challenger'];

const readPassport = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(passportKey) || '[]');
    return new Set(stored.filter(name => badgeNames.includes(name)));
  } catch (error) {
    return new Set();
  }
};

const writePassport = badges => {
  try {
    localStorage.setItem(passportKey, JSON.stringify([...badges]));
  } catch (error) {
    // The experience remains usable when private browsing blocks storage.
  }
};

const passportBadges = readPassport();

const renderPassport = message => {
  const passport = document.querySelector('[data-passport]');
  const count = document.querySelector('[data-passport-count]');
  const status = document.querySelector('[data-passport-status]');
  if (!passport || !count) return;

  badgeNames.forEach(name => {
    const item = passport.querySelector(`[data-badge="${name}"]`);
    if (item) item.dataset.earned = String(passportBadges.has(name));
  });

  count.textContent = `${passportBadges.size} / ${badgeNames.length}`;
  if (status && message) status.textContent = message;
};

const awardBadge = (name, message) => {
  if (!badgeNames.includes(name)) return;
  const isNew = !passportBadges.has(name);
  passportBadges.add(name);
  writePassport(passportBadges);
  renderPassport(message);
  if (isNew) recordEvent('passport_badge_earned', { badge: name });
};

document.querySelectorAll('[data-component-explorer]').forEach(explorer => {
  const image = explorer.querySelector('[data-explorer-image]');
  const title = explorer.querySelector('[data-explorer-title]');
  const description = explorer.querySelector('[data-explorer-description]');
  const choices = explorer.querySelectorAll('.explorer-thumbnails button');
  if (!image || !title || !description) return;

  choices.forEach(choice => choice.addEventListener('click', () => {
    choices.forEach(item => item.setAttribute('aria-pressed', 'false'));
    choice.setAttribute('aria-pressed', 'true');
    image.src = choice.dataset.src;
    image.alt = choice.dataset.alt;
    title.textContent = choice.dataset.title;
    description.textContent = choice.dataset.description;
    awardBadge('product-explorer', 'Product Explorer earned — the mark is stored only on this device.');
    if ((choice.dataset.src || '').includes('bible-discovery-map')) {
      awardBadge('discovery-mapper', 'Discovery Mapper earned — the mark is stored only on this device.');
    }
    recordEvent('component_selected', { component: choice.dataset.title || 'approved-component' });
  }));
});

const finder = document.querySelector('[data-product-finder]');
if (finder) {
  const title = finder.querySelector('[data-finder-title]');
  const format = finder.querySelector('[data-finder-format]');
  const age = finder.querySelector('[data-finder-age]');
  const description = finder.querySelector('[data-finder-description]');
  const link = finder.querySelector('[data-finder-link]');
  const choices = finder.querySelectorAll('.finder-choices button');

  choices.forEach(choice => choice.addEventListener('click', () => {
    choices.forEach(item => item.setAttribute('aria-pressed', 'false'));
    choice.setAttribute('aria-pressed', 'true');
    title.textContent = choice.dataset.title;
    format.textContent = choice.dataset.format;
    age.textContent = choice.dataset.age;
    description.textContent = choice.dataset.description;
    link.href = choice.dataset.target;
    link.textContent = `Explore ${choice.dataset.title}`;
    recordEvent('product_finder_selected', { product: choice.dataset.title });
  }));
}

document.querySelectorAll('#families a').forEach(link => {
  link.addEventListener('click', () => {
    awardBadge('pathfinder', 'Pathfinder earned — the mark is stored only on this device.');
    recordEvent('audience_path_selected', { destination: link.getAttribute('href') });
  });
});

document.querySelectorAll('[data-passport-action]').forEach(button => {
  button.addEventListener('click', () => {
    awardBadge(button.dataset.passportAction, 'Truth Reader earned — the mark is stored only on this device.');
  });
});

const resetPassport = document.querySelector('[data-passport-reset]');
if (resetPassport) {
  resetPassport.addEventListener('click', () => {
    passportBadges.clear();
    writePassport(passportBadges);
    renderPassport('Mission Passport reset on this device.');
    recordEvent('passport_reset');
  });
}

renderPassport();

const signupForm = document.querySelector('#signupForm');
const formNote = document.querySelector('#formNote');
const submitButton = document.querySelector('#submitBtn');

if (signupForm && formNote && submitButton) {
  signupForm.addEventListener('submit', async event => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Joining…';
    formNote.textContent = 'Submitting your details…';

    try {
      const response = await fetch(signupForm.action, {
        method: 'POST',
        body: new FormData(signupForm),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission failed');
      signupForm.reset();
      formNote.dataset.state = 'success';
      formNote.textContent = 'Success — welcome to the Mighty Boys of Truth launch community.';
      submitButton.textContent = 'Joined Successfully';
      recordEvent('adult_signup_submitted', { outcome: 'success' });
      setTimeout(() => location.href = 'thank-you.html', 900);
    } catch (error) {
      formNote.dataset.state = 'error';
      formNote.textContent = 'We could not submit your details. Please try again in a moment.';
      submitButton.disabled = false;
      submitButton.textContent = 'Join the Adult Launch List';
      recordEvent('adult_signup_submitted', { outcome: 'failure' });
    }
  });
}

const enquiryForm = document.querySelector('#enquiryForm');
const enquiryNote = document.querySelector('#enquiryNote');
const enquiryButton = document.querySelector('#enquiryBtn');

if (enquiryForm && enquiryNote && enquiryButton) {
  const enquiryType = enquiryForm.querySelector('#enquiryType');
  const requestedType = new URLSearchParams(location.search).get('type');
  const typeMap = {
    family: 'Family or parent',
    group: 'Church or ministry',
    'church-school': 'Church or ministry',
    trade: 'Retail or distribution'
  };
  if (enquiryType && typeMap[requestedType]) enquiryType.value = typeMap[requestedType];

  enquiryForm.addEventListener('submit', async event => {
    event.preventDefault();
    enquiryButton.disabled = true;
    enquiryButton.textContent = 'Sending…';
    enquiryNote.textContent = 'Sending your adult enquiry…';

    try {
      const response = await fetch(enquiryForm.action, {
        method: 'POST',
        body: new FormData(enquiryForm),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission failed');
      enquiryForm.reset();
      enquiryNote.dataset.state = 'success';
      enquiryNote.textContent = 'Thank you — your enquiry has been sent.';
      enquiryButton.textContent = 'Enquiry Sent';
      recordEvent('adult_enquiry_submitted', { outcome: 'success' });
    } catch (error) {
      enquiryNote.dataset.state = 'error';
      enquiryNote.textContent = 'We could not send your enquiry. Please try again or use the email link.';
      enquiryButton.disabled = false;
      enquiryButton.textContent = 'Send Adult Enquiry';
      recordEvent('adult_enquiry_submitted', { outcome: 'failure' });
    }
  });
}

const shareButton = document.querySelector('[data-share-button]');
if (shareButton) {
  shareButton.addEventListener('click', async () => {
    const data = {
      title: 'Mighty Boys of Truth',
      text: 'Discover Mighty Boys of Truth — Christian Tools for Raising Mighty Boys.',
      url: 'https://astros-spheres.github.io/mighty-boys-of-truth/'
    };
    recordEvent('share_selected');
    if (navigator.share) {
      try { await navigator.share(data); } catch (error) { /* User cancelled. */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(data.url);
      shareButton.textContent = 'Website Link Copied';
    } catch (error) {
      location.href = data.url;
    }
  });
}

const productPath = location.pathname.match(/mighty-(365|bible-discovery|hero-matchup|bible-battle)\.html$/);
if (productPath) recordEvent('product_view', { product: productPath[1] });

const drawDemo = document.querySelector('[data-draw-demo]');
if (drawDemo) {
  const samples = [
    {
      id: 'm365-family-respect-morning',
      title: 'Family & Respect · Morning Sample',
      src: 'assets/products/mighty-365/core-card-morning-family-respect.webp',
      alt: 'Approved Mighty 365 Family and Respect morning sample card'
    },
    {
      id: 'm365-wisdom-choices-evening',
      title: 'Wisdom & Choices · Evening Sample',
      src: 'assets/products/mighty-365/core-card-evening-wisdom-choices.webp',
      alt: 'Approved Mighty 365 Wisdom and Choices evening sample card'
    }
  ];
  const storageKey = 'mbot-daily-sample-v1';
  const revealButton = drawDemo.querySelector('[data-draw-reveal]');
  const anotherButton = drawDemo.querySelector('[data-draw-another]');
  const image = drawDemo.querySelector('[data-draw-image]');
  const cover = drawDemo.querySelector('[data-draw-cover]');
  const title = drawDemo.querySelector('[data-draw-title]');
  const status = drawDemo.querySelector('[data-draw-status]');
  const today = new Date().toISOString().slice(0, 10);
  let currentIndex = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved.date === today && Number.isInteger(saved.index)) {
      currentIndex = Math.abs(saved.index) % samples.length;
    } else {
      currentIndex = Math.floor(Math.random() * samples.length);
      localStorage.setItem(storageKey, JSON.stringify({ date: today, index: currentIndex }));
    }
  } catch (error) {
    currentIndex = new Date().getUTCDate() % samples.length;
  }

  const reveal = (index, eventName) => {
    const sample = samples[index];
    image.src = sample.src;
    image.alt = sample.alt;
    image.hidden = false;
    cover.hidden = true;
    title.textContent = sample.title;
    status.textContent = 'Approved sample revealed. Read the card artwork, then return whenever you are ready.';
    anotherButton.hidden = false;
    revealButton.textContent = 'Reveal Today’s Sample Again';
    awardBadge('first-draw', 'First Draw earned — the mark is stored only on this device.');
    recordEvent(eventName, { sample: sample.id });
  };

  revealButton.addEventListener('click', () => {
    recordEvent('card_draw_started', { mode: 'daily' });
    reveal(currentIndex, 'card_revealed');
  });

  anotherButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % samples.length;
    reveal(currentIndex, 'sample_card_revealed');
  });
}

const heroDemo = document.querySelector('[data-hero-demo]');
if (heroDemo) {
  const heroes = {
    abraham: { name: 'Abraham', title: 'Father of Faith', image: 'assets/products/mighty-hero-matchup/hero-abraham.webp', stats: { Courage: 84, Faith: 100, Strength: 62, Wisdom: 86, Leadership: 83, Endurance: 90, Legacy: 96 } },
    moses: { name: 'Moses', title: 'Lawgiver of Israel', image: 'assets/products/mighty-hero-matchup/hero-moses.webp', stats: { Courage: 89, Faith: 93, Strength: 74, Wisdom: 91, Leadership: 100, Endurance: 94, Legacy: 98 } },
    gideon: { name: 'Gideon', title: 'Reluctant Champion', image: 'assets/products/mighty-hero-matchup/hero-gideon.webp', stats: { Courage: 88, Faith: 82, Strength: 76, Wisdom: 73, Leadership: 80, Endurance: 79, Legacy: 75 } },
    david: { name: 'David', title: 'Shepherd King', image: 'assets/products/mighty-hero-matchup/hero-david.webp', stats: { Courage: 92, Faith: 94, Strength: 78, Wisdom: 84, Leadership: 93, Endurance: 86, Legacy: 95 } },
    elijah: { name: 'Elijah', title: 'Prophet of Fire', image: 'assets/products/mighty-hero-matchup/hero-elijah.webp', stats: { Courage: 95, Faith: 96, Strength: 71, Wisdom: 87, Leadership: 78, Endurance: 92, Legacy: 89 } },
    esther: { name: 'Esther', title: 'Queen of Courage', image: 'assets/products/mighty-hero-matchup/hero-esther.webp', stats: { Courage: 100, Faith: 88, Strength: 58, Wisdom: 90, Leadership: 85, Endurance: 86, Legacy: 91 } },
    paul: { name: 'Paul', title: 'Missionary Apostle', image: 'assets/products/mighty-hero-matchup/hero-paul.webp', stats: { Courage: 91, Faith: 95, Strength: 64, Wisdom: 92, Leadership: 90, Endurance: 99, Legacy: 100 } }
  };
  const heroKeys = Object.keys(heroes);
  const stats = ['Courage', 'Faith', 'Strength', 'Wisdom', 'Leadership', 'Endurance', 'Legacy'];
  const selectA = heroDemo.querySelector('[data-hero-a]');
  const selectB = heroDemo.querySelector('[data-hero-b]');
  const statSelect = heroDemo.querySelector('[data-hero-stat]');
  const imageA = heroDemo.querySelector('[data-hero-image-a]');
  const imageB = heroDemo.querySelector('[data-hero-image-b]');
  const scoreA = heroDemo.querySelector('[data-hero-score-a]');
  const scoreB = heroDemo.querySelector('[data-hero-score-b]');
  const labelA = heroDemo.querySelector('[data-hero-label-a]');
  const labelB = heroDemo.querySelector('[data-hero-label-b]');
  const result = heroDemo.querySelector('[data-hero-result]');
  const compareButton = heroDemo.querySelector('[data-hero-compare]');
  const randomButton = heroDemo.querySelector('[data-hero-random]');
  const swapButton = heroDemo.querySelector('[data-hero-swap]');

  const renderHeroes = () => {
    const a = heroes[selectA.value];
    const b = heroes[selectB.value];
    imageA.src = a.image;
    imageA.alt = `${a.name}, ${a.title}, approved Mighty Hero Matchup card`;
    imageB.src = b.image;
    imageB.alt = `${b.name}, ${b.title}, approved Mighty Hero Matchup card`;
    labelA.textContent = `${a.name} · ${a.title}`;
    labelB.textContent = `${b.name} · ${b.title}`;
    scoreA.textContent = '—';
    scoreB.textContent = '—';
    result.textContent = 'Choose a statistic, then compare the printed card values.';
  };

  const compare = () => {
    if (selectA.value === selectB.value) {
      result.textContent = 'Choose two different heroes for this comparison.';
      return;
    }
    const stat = statSelect.value;
    const a = heroes[selectA.value];
    const b = heroes[selectB.value];
    const aScore = a.stats[stat];
    const bScore = b.stats[stat];
    scoreA.textContent = `${stat}: ${aScore}`;
    scoreB.textContent = `${stat}: ${bScore}`;
    if (aScore === bScore) result.textContent = `${stat} is tied at ${aScore}.`;
    else {
      const winner = aScore > bScore ? a : b;
      const winningScore = Math.max(aScore, bScore);
      const otherScore = Math.min(aScore, bScore);
      result.textContent = `${winner.name} wins this ${stat} comparison, ${winningScore} to ${otherScore}.`;
    }
    awardBadge('hero-challenger', 'Hero Challenger earned — the mark is stored only on this device.');
    recordEvent('battle_round_completed', { heroA: selectA.value, heroB: selectB.value, stat });
  };

  [selectA, selectB].forEach(select => select.addEventListener('change', renderHeroes));
  statSelect.addEventListener('change', () => {
    scoreA.textContent = '—';
    scoreB.textContent = '—';
    result.textContent = 'Ready for a new approved-stat comparison.';
  });
  compareButton.addEventListener('click', compare);
  randomButton.addEventListener('click', () => {
    const first = Math.floor(Math.random() * heroKeys.length);
    let second = Math.floor(Math.random() * heroKeys.length);
    if (second === first) second = (second + 1) % heroKeys.length;
    selectA.value = heroKeys[first];
    selectB.value = heroKeys[second];
    statSelect.value = stats[Math.floor(Math.random() * stats.length)];
    renderHeroes();
    compare();
    recordEvent('battle_demo_started', { mode: 'random' });
  });
  swapButton.addEventListener('click', () => {
    const current = selectA.value;
    selectA.value = selectB.value;
    selectB.value = current;
    renderHeroes();
  });
  renderHeroes();
}

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // The website remains fully usable if offline support is unavailable.
    });
  });
}
