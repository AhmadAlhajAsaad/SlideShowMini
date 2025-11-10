(function () {
  // picking up items
  const images = Array.from(document.querySelectorAll('.slider-container img'));
  const slideNumber = document.getElementById('slide-number');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const indicatorsWrap = document.querySelector('#indicators ul');

  let current = 0; // Current slide index(0-based)

  // We automatically build box indicators based on the number of images
  function buildIndicators() {
    indicatorsWrap.innerHTML = '';
    images.forEach((_, i) => {
      const li = document.createElement('li');
      li.setAttribute('data-index', String(i));
      indicatorsWrap.appendChild(li);
    });
  }

  // Update general status (activated image + slide number + activate/disable buttons + indicators)
  function update() {
    images.forEach((img, i) => img.classList.toggle('active', i === current));

    const total = images.length;
    slideNumber.textContent = `Slide #${current + 1} of ${total}`;

    //Activate/disable buttons at the ends
    if (current === 0) {
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.classList.remove('disabled');
    }

    if (current === total - 1) {
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.classList.remove('disabled');
    }

    // case of indicators
    Array.from(indicatorsWrap.children).forEach((li, i) => {
      li.classList.toggle('active', i === current);
    });
  }

  // Button events
  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current -= 1;
      update();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (current < images.length - 1) {
      current += 1;
      update();
    }
  });

  //Click on indicators
  indicatorsWrap.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.tagName === 'LI') {
      const idx = Number(t.getAttribute('data-index'));
      if (!Number.isNaN(idx)) {
        current = idx;
        update();
      }
    }
  });

  // Keyboard navigation (optional)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && current > 0) {
      current -= 1;
      update();
    }
    if (e.key === 'ArrowRight' && current < images.length - 1) {
      current += 1;
      update();
    }
  });

  // running start
  buildIndicators();
  update();
})();