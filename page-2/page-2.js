// ----- Configuration -------------------------------------------------
const TOTAL = 60;                                // number of tiles
const BLANK_INDEXES = [6, 14, 29, 41, 55];       // tiles that stay as perpetual spinners

// Map each index (1-based) to a category A/B/C/D
const CAT_OF = {
  // A = Animations
    1: "A", 2: "A", 3: "A", 4: "A", 5: "A", 6: "A", 7: "A", 8: "A", 11: "A", 12:"A", 14: "A", 15: "A", 16: "A",17: "A",18: "A",19: "A", 20: "A", 21: "A", 22: "A", 25: "A", 26: "A", 27: "A", 28: "A", 29: "A", 30: "A", 31: "A", 32: "A",
    
  // B = loaders
    9: "B", 10: "B", 13: "B", 33: "B", 34: "B", 35: "B", 37: "B", 38: "B", 39: "B", 40: "B", 41: "B", 42: "B", 43: "B", 44: "B", 45: "B", 46: "B", 47: "B", 48: "B", 49: "B", 50: "B", 51: "B",

  // C = Verification & Gating 
    23: "C", 24: "C", 

  // D = skeleton & placeholders
    36: "D", 52: "D", 53: "D", 54: "D", 55: "D", 56: "D", 57: "D", 58: "D", 59: "D",  
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
