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

document.querySelectorAll('[data-matchup-carousel]').forEach(carousel => {
  const posters = [...carousel.querySelectorAll('[data-carousel-stage] figure')];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const count = carousel.querySelector('[data-carousel-count]');
  const title = carousel.querySelector('[data-carousel-title]');
  let active = 0;

  const showPoster = index => {
    active = (index + posters.length) % posters.length;
    posters.forEach((poster, posterIndex) => {
      poster.setAttribute('aria-hidden', posterIndex === active ? 'false' : 'true');
    });
    count.textContent = `${active + 1} / ${posters.length}`;
    title.textContent = posters[active].querySelector('figcaption').textContent;
  };

  const markExplored = () => awardBadge('hero-challenger', 'Hero Challenger earned — the mark is stored only on this device.');
  previous.addEventListener('click', () => {
    showPoster(active - 1);
    markExplored();
  });
  next.addEventListener('click', () => {
    showPoster(active + 1);
    markExplored();
  });
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPoster(active - 1);
    if (event.key === 'ArrowRight') showPoster(active + 1);
  });
  showPoster(0);
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // The website remains fully usable if offline support is unavailable.
    });
  });
}
