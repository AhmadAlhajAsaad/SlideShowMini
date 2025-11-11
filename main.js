(function(){
  const images = Array.from(document.querySelectorAll('.slider-container img'));
  const slideNumber = document.getElementById('slide-number');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const playBtn = document.getElementById('play');
  const indicators = document.getElementById('indicators');
  const progressBar = document.querySelector('.progress .bar');

  // settings
  const AUTOPLAY_MS = 3000; // Duration of each segment
  let current = 0;
  let timer = null;
  let isPlaying = false;

  // Create indicators by number of images
  function buildIndicators(){
    indicators.innerHTML = '';
    images.forEach((_, i) => {
      const dot = document.createElement('li');
      dot.setAttribute('data-index', String(i));
      indicators.appendChild(dot);
    });
  }

  // Configure the progress bar
  function resetProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // transition
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${AUTOPLAY_MS}ms linear`;
    if (isPlaying) progressBar.style.width = '100%';
  }

  //Update general status
  function update(){
    images.forEach((img, i) => img.classList.toggle('active', i === current));
    slideNumber.textContent = `Slide #${current + 1} of ${images.length}`;

    // Update indicators
    Array.from(indicators.children).forEach((li, i) => {
      li.classList.toggle('active', i === current);
    });

    //Buttons (if you want to disable rotation, activate this)
    // prevBtn.disabled = current === 0;
    // nextBtn.disabled = current === images.length - 1;

    resetProgress();
  }

  // Circular mobility
  function goTo(idx) {
    const len = images.length;
    current = (idx + len) % len;
    update();
  }
  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  // Auto on/off
  function play(){
    if (isPlaying) return;
    isPlaying = true;
    playBtn.textContent = 'Pause';
    resetProgress();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function pause(){
    isPlaying = false;
    playBtn.textContent = 'Play';
    if (timer) clearInterval(timer);
    timer = null;
    if (progressBar) progressBar.style.width = '0%';
  }
  function togglePlay(){
    isPlaying ? pause() : play();
  }

  // Button events
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  playBtn.addEventListener('click', togglePlay);

  // Indicators (direct jump)
  indicators.addEventListener('click', (e) => {
    const li = e.target;
    if (li && li.tagName === 'LI') {
      const idx = Number(li.getAttribute('data-index'));
      if (!Number.isNaN(idx)) goTo(idx);
    }
  });

  // keyboard events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key.toLowerCase() === ' ') { e.preventDefault(); togglePlay(); }
  });

  // Stop/play when passing the mouse
  const container = document.querySelector('.slider-container');
  container.addEventListener('mouseenter', () => { if (isPlaying) pause(); });
  container.addEventListener('mouseleave', () => { if (!isPlaying) play(); });

  // Stop when focus is lost (other tab)
  window.addEventListener('blur', pause);

  //Pull on mobile(Swipe)
  let startX = 0, isTouching = false;
  container.addEventListener('touchstart', (e) => {
    isTouching = true;
    startX = e.touches[0].clientX;
  }, {passive:true});
  container.addEventListener('touchend', (e) => {
    if (!isTouching) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    isTouching = false;
  });

  // init
  buildIndicators();
  update();
  // Turn on automatically from the beginning (you can turn it off if you want)
  play();
})();