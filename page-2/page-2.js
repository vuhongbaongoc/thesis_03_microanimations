// ----- Configuration -------------------------------------------------
const TOTAL = 60;                                // number of tiles
const BLANK_INDEXES = [6, 14, 29, 41, 55];       // tiles that stay as perpetual spinners

// Map each index (1-based) to a category A/B/C/D
const CAT_OF = {
    1: "A", 2: "B", 3: "C", 4: "D",
    5: "A", 6: "A", 7: "C", 8: "B",
    // ...keep going for all your clips
  };
  
const SRC_FOR = (i) => `../page-1/videos/${i}.mp4`; // adjust to your path if different
const REVEAL_MS = 5000;                          // ~5s spinner per tile

// ----- Build grid ----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');

  for (let i = 1; i <= TOTAL; i++) {
    const cat = CAT_OF[i] || "A";   // fallback to "A" if not specified
    const tile = document.createElement('figure');
    tile.className = 'tile';
    tile.dataset.cat = cat;

    // some tiles are loading-only forever
    if (BLANK_INDEXES.includes(i)) {
      tile.classList.add('loading-only');
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      tile.appendChild(spinner);
      grid.appendChild(tile);
      continue;
    }

    // normal tiles: spinner + media
    const wrap = document.createElement('div');
    wrap.className = 'media-wrap';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    const vid = document.createElement('video');
    vid.muted = true;
    vid.loop = true;
    vid.autoplay = true;
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', '');
    vid.setAttribute('preload', 'metadata');
    vid.src = SRC_FOR(i);

    wrap.appendChild(vid);
    tile.appendChild(wrap);
    tile.appendChild(spinner);
    grid.appendChild(tile);

    // reveal each tile after ~5s
    setTimeout(() => {
      tile.classList.add('ready');
      // ensure playback has started (Safari sometimes needs a nudge)
      vid.play().catch(() => {/* ignore */});
    }, REVEAL_MS);
  }

  // ----- Category filtering -----
  const setFilter = (cat) => {
    grid.dataset.filter = cat; // triggers CSS hiding
    document.querySelectorAll('.filter').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.filter === cat)
    );
  };

  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  // Optionally set an initial filter here:
  // setFilter('A');

  // Performance: pause videos when far offscreen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (target.tagName !== 'VIDEO') return;
        if (isIntersecting) target.play().catch(()=>{});
        else target.pause();
      });
    }, { rootMargin: '200px' });

    grid.querySelectorAll('video').forEach(v => io.observe(v));
  }
});
