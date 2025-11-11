(function () {
  const images = Array.from(document.querySelectorAll('.slider-container img'));
  const slideNumber = document.getElementById('slide-number');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const indicators = document.getElementById('indicators');
  const thumbs = document.getElementById('thumbs');
  const themeToggle = document.getElementById('theme-toggle');

  let current = 0; // 0-based

  // === Building indicators dynamically ===
  function buildIndicators() {
    indicators.innerHTML = '';
    images.forEach((_, i) => {
      const li = document.createElement('li');
      li.dataset.index = String(i);
      indicators.appendChild(li);
    });
  }

  // === Update interface ===
  function update() {
    images.forEach((img, i) => img.classList.toggle('active', i === current));
    const total = images.length;
    slideNumber.textContent = `Slide #${current + 1} of ${total}`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === images.length - 1;

    Array.from(indicators.children).forEach((li, i) => {
      li.classList.toggle('active', i === current);
    });

    // Then we update the status of the thumbnails
    Array.from(thumbs.children).forEach((t, i) => {
      t.classList.toggle('active', i === current);
    });

    // Upload the following image in advance to smooth the transition (prefetch)
    const nextIdx = Math.min(current + 1, images.length - 1);
    const nextImg = images[nextIdx];
    if (nextImg && nextImg.loading === 'lazy') {
      // Read src to launch the download
      const pre = new Image();
      pre.src = nextImg.src;
    }
  }

  // === Button events ===
  prevBtn.addEventListener('click', () => {
    if (current > 0) { current--; update(); }
  });
  nextBtn.addEventListener('click', () => {
    if (current < images.length - 1) { current++; update(); }
  });

  // ===Indicator events===
  indicators.addEventListener('click', (e) => {
    const li = e.target;
    if (li && li.tagName === 'LI') {
      const idx = Number(li.dataset.index);
      if (!Number.isNaN(idx)) {
        current = idx; update();
      }
    }
  });

  // === Microevents===
  thumbs.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset.index) {
      const idx = Number(t.dataset.index);
      if (!Number.isNaN(idx)) {
        current = idx; update();
      }
    }
  });

  // ===Keyboard navigation===
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && current > 0) { current--; update(); }
    if (e.key === 'ArrowRight' && current < images.length - 1) { current++; update(); }
  });

  // === Switch theme ===
  function applyThemeFromStorage() {
    const saved = localStorage.getItem('ssm-theme') || 'light';
    if (saved === 'dark') {
      document.body.classList.add('dark');
      themeToggle.textContent = '☀️ Light';
    } else {
      document.body.classList.remove('dark');
      themeToggle.textContent = '🌙 Dark';
    }
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('ssm-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  });

  // === Additional Lazy Loading via IntersectionObserver (Incentives Loading on Approach) ===
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // If the image has not been downloaded yet, reading it will launch the download
          const _ = img.src;
          io.unobserve(img);
        }
      });
    }, { root: document.querySelector('.slider-container'), threshold: 0.1 });

    images.forEach((img, i) => {
      if (i !== 0) io.observe(img);
    });
  }

  // init
  buildIndicators();
  applyThemeFromStorage();
  update();
})();