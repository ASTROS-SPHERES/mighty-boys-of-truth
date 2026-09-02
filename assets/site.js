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

// Homepage Mighty Vault entry point. This is intentionally injected from the shared site script
// so the approved vault artwork and direct navigation remain available without duplicating markup.
(() => {
  const path = location.pathname.replace(/\/+$/, '');
  const isHome = path === '' || path.endsWith('/mighty-boys-of-truth') || path.endsWith('/index.html');
  if (!isHome) return;

  const nav = document.querySelector('#primary-nav');
  if (nav && !nav.querySelector('a[href="mighty-vault.html"]')) {
    const heroLink = nav.querySelector('a[href="mighty-hero-matchup.html"]');
    const vaultLink = document.createElement('a');
    vaultLink.href = 'mighty-vault.html';
    vaultLink.textContent = 'Mighty Vault';
    vaultLink.className = 'nav-vault-link';
    if (heroLink) heroLink.insertAdjacentElement('afterend', vaultLink);
    else nav.prepend(vaultLink);
  }

  const hero = document.querySelector('section.hero');
  if (hero && !document.querySelector('.homepage-vault-entry')) {
    const section = document.createElement('section');
    section.className = 'homepage-vault-entry';
    section.setAttribute('aria-label', 'Mighty Vault');
    section.innerHTML = `
      <div class="shell">
        <a class="homepage-vault-entry-link" href="mighty-vault.html" aria-label="Enter the Mighty Vault — draw daily and collect 64 heroes">
          <img src="assets/mighty-vault-home-entry.webp" alt="Mighty Vault — Draw Daily, Collect 64 Heroes. Enter the Vault." width="550" height="310" decoding="async">
        </a>
        <p class="homepage-vault-entry-note">Open one free Hero pack every day, collect all 64 Bible heroes and discover rare digital foil variants.</p>
      </div>`;
    hero.insertAdjacentElement('afterend', section);
  }

  if (!document.querySelector('#homepage-vault-entry-styles')) {
    const style = document.createElement('style');
    style.id = 'homepage-vault-entry-styles';
    style.textContent = `
      .homepage-vault-entry{padding:clamp(28px,5vw,64px) 0;background:linear-gradient(180deg,#06152e 0%,#0a1c36 100%)}
      .homepage-vault-entry-link{display:block;max-width:1100px;margin:0 auto;border-radius:22px;overflow:hidden;border:1px solid rgba(217,167,45,.7);box-shadow:0 22px 55px rgba(0,0,0,.42);outline-offset:5px;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
      .homepage-vault-entry-link img{display:block;width:100%;height:auto}
      .homepage-vault-entry-link:hover,.homepage-vault-entry-link:focus-visible{transform:translateY(-3px);border-color:#f0c45a;box-shadow:0 28px 65px rgba(0,0,0,.5)}
      .homepage-vault-entry-note{max-width:900px;margin:18px auto 0;text-align:center;color:#e9edf5;font-size:clamp(.95rem,1.8vw,1.08rem)}
      .nav-vault-link{font-weight:800!important;color:#d9a72d!important}
      @media(max-width:700px){.homepage-vault-entry{padding:22px 0}.homepage-vault-entry-link{border-radius:14px}.homepage-vault-entry-note{margin-top:13px;padding:0 8px}}
    `;
    document.head.appendChild(style);
  }

  document.querySelectorAll('.homepage-vault-entry-link,.nav-vault-link').forEach(link => {
    link.addEventListener('click', () => recordEvent('mighty_vault_entry_selected', { source: link.classList.contains('nav-vault-link') ? 'homepage-nav' : 'homepage-vault-art' }));
  });
})();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // The website remains fully usable if offline support is unavailable.
    });
  });
}
