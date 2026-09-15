/**
 * VISION (ATELIER VOID) — CINEMATIC CORE SCRIPTS
 * Modules:
 * 1. Ambient Gravitational Particle Canvas
 * 2. Pointer Spotlight Tracker
 * 3. Web Audio Ambient Drone Synthesizer
 * 4. Portfolio Category Filter Engine
 * 5. Case Study Modal Controller
 * 6. Interactive Scope Chips & Inquiry Form
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. AMBIENT GRAVITATIONAL PARTICLE CANVAS
  // =========================================================================
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseAlpha = Math.random() * 0.35 + 0.1;
        this.alpha = this.baseAlpha;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }

        // Repulsion physics from mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          this.alpha = 0.85;
          this.x -= (dx / dist) * 1.4;
          this.y -= (dy / dist) * 1.4;
        } else {
          this.alpha = this.baseAlpha;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 169, 60, ${this.alpha})`;
        ctx.fill();
      }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 75);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(renderParticles);
    }
    renderParticles();

    // =========================================================================
    // 2. POINTER SPOTLIGHT TRACKER
    // =========================================================================
    const spotlight = document.getElementById('spotlight');
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (spotlight) {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
      }
    });
  }


  // =========================================================================
  // 3. WEB AUDIO AMBIENT DRONE SYNTHESIZER
  // =========================================================================
  let audioCtx = null;
  let isPlaying = false;
  let osc1 = null;
  let osc2 = null;
  let gainNode = null;
  let filter = null;

  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }

      if (!isPlaying) {
        audioCtx.resume();
        osc1 = audioCtx.createOscillator();
        osc2 = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        filter = audioCtx.createBiquadFilter();

        // 55 Hz (Fundamental A1) + 110 Hz Harmonic (A2)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

        // Lowpass warm filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, audioCtx.currentTime);

        // Soft fade-in ramp
        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();

        isPlaying = true;
        if (audioIcon) audioIcon.textContent = '🔊';
        if (audioText) audioText.textContent = 'SOUND: ON';
        audioToggle.style.borderColor = 'var(--solar-amber)';
        audioToggle.style.color = 'var(--solar-amber)';
      } else {
        // Soft fade-out ramp
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch (e) {
            // Cleanup safe guard
          }
          isPlaying = false;
        }, 1200);

        if (audioIcon) audioIcon.textContent = '🔈';
        if (audioText) audioText.textContent = 'SOUND: OFF';
        audioToggle.style.borderColor = '';
        audioToggle.style.color = '';
      }
    });
  }


  // =========================================================================
  // 4. PORTFOLIO FILTER ENGINE
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  window.filterWorks = function(category) {
    filterBtns.forEach(btn => {
      btn.classList.remove('active', 'border-amber-400', 'bg-amber-400/10', 'text-amber-300');
      btn.classList.add('border-white/10', 'text-neutral-400');
    });

    const activeBtn = document.querySelector(`[data-filter="${category}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active', 'border-amber-400', 'bg-amber-400/10', 'text-amber-300');
      activeBtn.classList.remove('border-white/10', 'text-neutral-400');
    }

    portfolioCards.forEach(card => {
      const cardCats = card.getAttribute('data-category') || '';
      if (category === 'all' || cardCats.includes(category)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };


  // =========================================================================
  // 5. CASE STUDY MODAL DIALOG
  // =========================================================================
  const modal = document.getElementById('caseModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSector = document.getElementById('modalSector');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalImg = document.getElementById('modalImg');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const returnModalBtn = document.getElementById('returnModalBtn');

  window.openCaseModal = function(title, sector, category, desc, image) {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalSector) modalSector.textContent = sector;
    if (modalCategory) modalCategory.textContent = category;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalImg) {
      modalImg.src = image || 'assets/projects/duke-city-fencing/poster.svg';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (returnModalBtn) returnModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Attach card click handlers directly from data attributes
  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || 'Project Title';
      const sector = card.getAttribute('data-sector') || 'Sector';
      const discipline = card.getAttribute('data-discipline') || 'Discipline';
      const desc = card.getAttribute('data-desc') || 'Case description...';
      const image = card.getAttribute('data-image') || '';
      openCaseModal(title, sector, discipline, desc, image);
    });
  });


  // =========================================================================
  // 6. SCOPE CHIPS & FORM HANDLING
  // =========================================================================
  const chips = document.querySelectorAll('.scope-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  const inquiryForm = document.getElementById('inquiryForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formSuccess) formSuccess.classList.remove('hidden');
    });
  }

  if (resetFormBtn && inquiryForm) {
    resetFormBtn.addEventListener('click', () => {
      inquiryForm.reset();
      chips.forEach(chip => chip.classList.remove('selected'));
      if (formSuccess) formSuccess.classList.add('hidden');
    });
  }

});
