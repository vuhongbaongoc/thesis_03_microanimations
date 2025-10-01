window.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.querySelector('.title');
    const text = 'Micro–Animation'; // en dash between Micro and Animation
  
    // Build per-letter spans with randomized flicker timings
    titleEl.innerHTML = '';
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      // Randomize each letter’s flicker feel
      const dur  = 700 + Math.random() * 700;   // 0.7s–1.4s
      const delay = Math.random() * 500;        // 0–0.5s
      span.style.animationDuration = `${dur}ms`;
      span.style.animationDelay = `${delay}ms`;
      titleEl.appendChild(span);
    });
  
    // 1) Let it flicker for a few seconds...
    const FLICKER_MS = 2400;  // adjust for longer/shorter flicker
    setTimeout(() => {
      // 2) Snap to solid black
      titleEl.classList.add('solid');
  
      // 3) After a brief beat, move to final layout:
      setTimeout(() => {
        // Shrink/fade the big title
        titleEl.classList.add('exiting');
  
        // Show corner labels
        document.body.classList.add('show-corners');
  
        // Optionally remove the title from flow after transition ends
        titleEl.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity') {
            titleEl.style.display = 'none';
          }
        }, { once: true });
  
      }, 500); // hold solid for a moment before moving
    }, FLICKER_MS);
  });

  /* ===== Build the auto-scrolling carousel =====
   Put your ~60 clips in: /page-1/videos/ named 1.mp4 ... 60.mp4
   (or edit the array if you have different filenames/paths) */
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  // Example: 60 files named 1.mp4 … 60.mp4 in ./videos/
  const sources = Array.from({ length: 60 }, (_, i) => `./videos/${i + 1}.mp4`);

  function addSet(list) {
    list.forEach(src => {
      const card = document.createElement('div');
      card.className = 'card';

      const v = document.createElement('video');
      v.muted = true;                 // required for autoplay
      v.loop = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.setAttribute('preload', 'metadata');
      v.src = src;

      card.appendChild(v);
      track.appendChild(card);
    });
  }

  // Add one full set, then duplicate once for seamless -50% CSS scroll
  addSet(sources);
  addSet(sources);

  // NOTE: We do NOT pause videos on hover — only the track animation pauses via CSS.
})();


// Build the auto-scrolling carousel ON DEMAND (after the intro)
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track || track.children.length) return; // avoid double-build

  // Example: 60 files named 1.mp4 … 60.mp4 in ./videos/
  const sources = Array.from({ length: 60 }, (_, i) => `./videos/${i + 1}.mp4`);

  function addSet(list) {
    list.forEach(src => {
      const card = document.createElement('div');
      card.className = 'card';

      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
      v.setAttribute('preload','metadata');
      v.src = src;

      card.appendChild(v);
      track.appendChild(card);
    });
  }

  // Duplicate once for seamless -50% CSS scroll
  addSet(sources);
  addSet(sources);
}
