(() => {
  const experience = document.querySelector('[data-discovery-map]');
  if (!experience) return;

  const MAP_WIDTH = 2400;
  const MAP_HEIGHT = 1698;
  const MAP_LEFT = 69;
  const MAP_RIGHT = 2337;
  const ROW_BOUNDARIES = [90, 195, 308, 419, 540, 655, 769, 882, 994, 1107, 1388];
  const CARDS_URL = 'assets/products/mighty-bible-discovery/sample-cards/cards.json';
  const CARD_ROOT = 'assets/products/mighty-bible-discovery/sample-cards';

  const drawButton = experience.querySelector('[data-map-draw]');
  const faceButton = experience.querySelector('[data-map-face-toggle]');
  const select = experience.querySelector('[data-map-select]');
  const cardCover = experience.querySelector('[data-map-card-cover]');
  const cardFigure = experience.querySelector('[data-map-card-figure]');
  const cardImage = experience.querySelector('[data-map-card-image]');
  const emptyState = experience.querySelector('[data-map-empty]');
  const details = experience.querySelector('[data-map-details]');
  const status = experience.querySelector('[data-map-status]');
  const codeDisplay = experience.querySelector('[data-map-current-code]');
  const anchorDisplay = experience.querySelector('[data-map-current-anchor]');
  const markerLayer = experience.querySelector('[data-map-markers]');
  const cellHighlight = experience.querySelector('[data-map-cell]');
  const mapScroll = experience.querySelector('[data-map-scroll]');
  const mapCanvas = experience.querySelector('[data-map-canvas]');
  const zoomInButton = experience.querySelector('[data-map-zoom-in]');
  const zoomOutButton = experience.querySelector('[data-map-zoom-out]');
  const zoomResetButton = experience.querySelector('[data-map-zoom-reset]');
  const zoomValue = experience.querySelector('[data-map-zoom-value]');

  const fields = {
    type: experience.querySelector('[data-map-field="type"]'),
    zone: experience.querySelector('[data-map-field="zone"]'),
    era: experience.querySelector('[data-map-field="era"]'),
    trail: experience.querySelector('[data-map-field="trail"]'),
    read: experience.querySelector('[data-map-field="read"]'),
    moment: experience.querySelector('[data-map-field="moment"]'),
    connected: experience.querySelector('[data-map-field="connected"]'),
    fact: experience.querySelector('[data-map-field="fact"]'),
    question: experience.querySelector('[data-map-field="question"]')
  };

  let cards = [];
  let drawBag = [];
  let selectedIndex = -1;
  let showingBack = false;
  let zoom = 1;

  const sendEvent = (name, detail = {}) => {
    try {
      if (typeof recordEvent === 'function') {
        recordEvent(name, detail);
      } else {
        window.dispatchEvent(new CustomEvent('mbot:analytics', { detail: { event: name, ...detail } }));
      }
    } catch (error) {
      // Analytics must never interrupt the discovery experience.
    }
  };

  const earnDiscoveryBadge = () => {
    try {
      if (typeof awardBadge === 'function') {
        awardBadge('discovery-mapper', 'Discovery Mapper earned — the mark is stored only on this device.');
      }
    } catch (error) {
      // Local progress is optional; the map remains fully usable without it.
    }
  };

  const cardPath = (card, face) => `${CARD_ROOT}/${face}s/${card.slug}-${face}.webp`;

  const displayTitle = title => title.replace(/\n/g, ' ');

  const shuffle = values => {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  };

  const fillBag = () => {
    drawBag = shuffle(cards.map((card, index) => index));
    if (drawBag.length > 1 && drawBag[drawBag.length - 1] === selectedIndex) {
      [drawBag[0], drawBag[drawBag.length - 1]] = [drawBag[drawBag.length - 1], drawBag[0]];
    }
  };

  const getCellRectangle = mapCode => {
    const match = /^([A-R])-(0[1-9]|10)$/.exec(mapCode);
    if (!match) return null;
    const column = match[1].charCodeAt(0) - 65;
    const row = Number(match[2]) - 1;
    const columnWidth = (MAP_RIGHT - MAP_LEFT) / 18;
    return {
      left: MAP_LEFT + column * columnWidth,
      top: ROW_BOUNDARIES[row],
      width: columnWidth,
      height: ROW_BOUNDARIES[row + 1] - ROW_BOUNDARIES[row]
    };
  };

  const placeCellHighlight = card => {
    const rectangle = getCellRectangle(card.map_code);
    if (!rectangle) {
      cellHighlight.hidden = true;
      return;
    }
    cellHighlight.hidden = false;
    cellHighlight.style.left = `${(rectangle.left / MAP_WIDTH) * 100}%`;
    cellHighlight.style.top = `${(rectangle.top / MAP_HEIGHT) * 100}%`;
    cellHighlight.style.width = `${(rectangle.width / MAP_WIDTH) * 100}%`;
    cellHighlight.style.height = `${(rectangle.height / MAP_HEIGHT) * 100}%`;
  };

  const scrollMarkerIntoView = marker => {
    if (!marker || !mapScroll || !mapCanvas) return;
    requestAnimationFrame(() => {
      if (mapCanvas.scrollWidth <= mapScroll.clientWidth && mapCanvas.scrollHeight <= mapScroll.clientHeight) return;
      const left = marker.offsetLeft - mapScroll.clientWidth / 2;
      const top = marker.offsetTop - mapScroll.clientHeight / 2;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      mapScroll.scrollTo({ left, top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  };

  const renderCardFace = () => {
    if (selectedIndex < 0) return;
    const card = cards[selectedIndex];
    const face = showingBack ? 'back' : 'front';
    cardImage.src = cardPath(card, face);
    cardImage.alt = `${displayTitle(card.title)} sample discovery card — ${face}`;
    faceButton.textContent = showingBack ? 'Show Card Front' : 'Reveal Card Back';
    faceButton.setAttribute('aria-pressed', String(showingBack));
  };

  const renderCard = (index, source = 'selection') => {
    const card = cards[index];
    if (!card) return;

    selectedIndex = index;
    showingBack = false;
    select.value = String(index);
    cardCover.hidden = true;
    cardFigure.hidden = false;
    emptyState.hidden = true;
    details.hidden = false;
    faceButton.hidden = false;
    drawButton.textContent = 'Draw Another Card';

    renderCardFace();
    new Image().src = cardPath(card, 'back');

    codeDisplay.textContent = card.map_code;
    anchorDisplay.textContent = card.map_anchor;
    fields.type.textContent = card.type;
    fields.zone.textContent = card.zone;
    fields.era.textContent = card.era;
    fields.trail.textContent = `${card.trail_id} · ${card.trail}`;
    fields.read.textContent = card.read;
    fields.moment.textContent = card.moment;
    fields.connected.textContent = card.connected;
    fields.fact.textContent = card.fact;
    fields.question.textContent = card.question;

    placeCellHighlight(card);
    const markers = markerLayer.querySelectorAll('[data-map-marker]');
    markers.forEach((marker, markerIndex) => {
      const isActive = markerIndex === index;
      marker.dataset.active = String(isActive);
      marker.setAttribute('aria-pressed', String(isActive));
      marker.tabIndex = isActive ? 0 : -1;
    });

    const activeMarker = markers[index];
    scrollMarkerIntoView(activeMarker);
    status.textContent = `${displayTitle(card.title)} drawn. Map code ${card.map_code}. ${card.map_anchor} is now highlighted.`;
    earnDiscoveryBadge();
    sendEvent('discovery_map_card_selected', {
      card: displayTitle(card.title),
      map_code: card.map_code,
      source
    });
  };

  const drawCard = () => {
    if (!cards.length) return;
    if (!drawBag.length) fillBag();
    renderCard(drawBag.pop(), 'random-draw');
  };

  const setZoom = nextZoom => {
    zoom = Math.min(2, Math.max(1, Math.round(nextZoom * 4) / 4));
    mapCanvas.style.width = `${zoom * 100}%`;
    zoomValue.textContent = `${Math.round(zoom * 100)}%`;
    zoomOutButton.disabled = zoom <= 1;
    zoomInButton.disabled = zoom >= 2;
    if (selectedIndex >= 0) {
      scrollMarkerIntoView(markerLayer.querySelectorAll('[data-map-marker]')[selectedIndex]);
    }
  };

  const buildMarkers = () => {
    const fragment = document.createDocumentFragment();
    cards.forEach((card, index) => {
      const marker = document.createElement('button');
      marker.type = 'button';
      marker.className = 'discovery-map-marker';
      marker.dataset.mapMarker = '';
      marker.dataset.active = 'false';
      marker.style.left = `${(card.map_anchor_xy[0] / MAP_WIDTH) * 100}%`;
      marker.style.top = `${(card.map_anchor_xy[1] / MAP_HEIGHT) * 100}%`;
      marker.setAttribute('aria-label', `Open ${displayTitle(card.title)}, ${card.map_code}, ${card.map_anchor}`);
      marker.setAttribute('aria-pressed', 'false');
      marker.tabIndex = index === 0 ? 0 : -1;
      marker.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><b>${card.map_code}</b>`;
      marker.addEventListener('click', () => renderCard(index, 'map-marker'));
      marker.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1;
        const nextIndex = (index + direction + cards.length) % cards.length;
        markerLayer.querySelectorAll('[data-map-marker]')[nextIndex].focus();
      });
      fragment.append(marker);
    });
    markerLayer.append(fragment);
  };

  const initialise = async () => {
    try {
      const response = await fetch(CARDS_URL);
      if (!response.ok) throw new Error(`Card data returned ${response.status}`);
      const loadedCards = await response.json();
      if (!Array.isArray(loadedCards) || loadedCards.length !== 10) throw new Error('Expected ten sample cards');
      if (loadedCards.some(card => !card.slug || !card.map_code || !card.map_anchor || !Array.isArray(card.map_anchor_xy))) {
        throw new Error('Sample card data is incomplete');
      }
      cards = loadedCards;
      cards.forEach((card, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${String(index + 1).padStart(2, '0')} · ${displayTitle(card.title)} · ${card.map_code}`;
        select.append(option);
      });
      buildMarkers();
      fillBag();
      drawButton.disabled = false;
      drawButton.textContent = 'Draw a Discovery Card';
      select.disabled = false;
      experience.dataset.mapState = 'ready';
      status.textContent = 'The map is ready. Draw a card or choose one of the ten sample discoveries.';
      sendEvent('discovery_map_ready', { sample_count: cards.length });
    } catch (error) {
      drawButton.disabled = true;
      select.disabled = true;
      status.textContent = 'The interactive card layer could not load. The complete Bible Discovery Map remains available below.';
      experience.dataset.mapState = 'error';
    }
  };

  drawButton.addEventListener('click', drawCard);
  faceButton.addEventListener('click', () => {
    if (selectedIndex < 0) return;
    showingBack = !showingBack;
    renderCardFace();
    sendEvent('discovery_map_card_flipped', {
      card: displayTitle(cards[selectedIndex].title),
      face: showingBack ? 'back' : 'front'
    });
  });
  select.addEventListener('change', () => {
    if (select.value === '') return;
    renderCard(Number(select.value), 'card-selector');
  });
  zoomInButton.addEventListener('click', () => setZoom(zoom + 0.25));
  zoomOutButton.addEventListener('click', () => setZoom(zoom - 0.25));
  zoomResetButton.addEventListener('click', () => setZoom(1));

  setZoom(1);
  initialise();
})();
