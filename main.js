/**
 * VISION STUDIO — CORE INTERACTION ENGINE
 * Modules:
 * 1. Live Studio Utility Clock (Albuquerque MST)
 * 2. Ambient Cursor Spotlight Tracker
 * 3. &Walsh Floating Cursor Preview Physics (Lerp)
 * 4. PORTO ROCHA Dual View Switcher (Grid vs Index)
 * 5. Modern Top-Layer Case Study Modal Dialog
 * 6. Commission Inquiry Form & Scope Chips
 * 7. Web Audio Warm Harmonic Pad Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. LIVE STUDIO UTILITY CLOCK (Albuquerque, NM MST)
  // =========================================================================
  const clockEl = document.getElementById('studioClock');
  function updateStudioClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      // Format to America/Denver (Albuquerque)
      const options = {
        timeZone: 'America/Denver',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.formatToParts(now);
      const timeStr = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}:${parts.find(p => p.type === 'second').value}`;
      clockEl.textContent = `${timeStr} MST`;
    } catch (err) {
      // Fallback if timezone lookup fails
      const fallback = new Date().toTimeString().split(' ')[0];
      clockEl.textContent = `${fallback} MST`;
    }
  }
  updateStudioClock();
  setInterval(updateStudioClock, 1000);


  // =========================================================================
  // 2. AMBIENT CURSOR SPOTLIGHT TRACKER
  // =========================================================================
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderSpotlight() {
      // Gentle smoothing
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      spotlight.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
      spotlight.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);
      requestAnimationFrame(renderSpotlight);
    }
    requestAnimationFrame(renderSpotlight);
  }


  // =========================================================================
  // 3. &WALSH FLOATING CURSOR PREVIEW PHYSICS
  // =========================================================================
  const previewEl = document.getElementById('floatingPreview');
  const previewImg = document.getElementById('previewImage');
  const previewTag = document.getElementById('previewTag');
  const previewTitle = document.getElementById('previewTitle');

  if (previewEl && previewImg && previewTag && previewTitle) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;

    window.addEventListener('mousemove', (e) => {
      // Offset slightly to the top-right of cursor
      targetX = e.clientX + 30;
      targetY = e.clientY - 40;

      // Keep preview within screen bounds
      const maxX = window.innerWidth - 340;
      const maxY = window.innerHeight - 240;
      if (targetX > maxX) targetX = e.clientX - 340;
      if (targetY > maxY) targetY = maxY;
      if (targetY < 20) targetY = 20;
    }, { passive: true });

    function renderPreview() {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        previewEl.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) scale(1)`;
      }
      requestAnimationFrame(renderPreview);
    }
    requestAnimationFrame(renderPreview);

    // Bind triggers
    const triggers = document.querySelectorAll('.preview-trigger, .service-row, .index-row');
    triggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', () => {
        const img = trigger.getAttribute('data-preview-img');
        const title = trigger.getAttribute('data-preview-title');
        const tag = trigger.getAttribute('data-preview-tag');

        if (img) previewImg.src = img;
        if (title) previewTitle.textContent = title;
        if (tag) previewTag.textContent = tag;

        isHovering = true;
        previewEl.classList.add('active');
      });

      trigger.addEventListener('mouseleave', () => {
        isHovering = false;
        previewEl.classList.remove('active');
      });
    });
  }


  // =========================================================================
  // 4. PORTO ROCHA DUAL VIEW SWITCHER (GRID vs INDEX)
  // =========================================================================
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewIndexBtn = document.getElementById('viewIndexBtn');
  const archiveGrid = document.getElementById('archiveGrid');
  const archiveIndex = document.getElementById('archiveIndex');

  if (viewGridBtn && viewIndexBtn && archiveGrid && archiveIndex) {
    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('active');
      viewGridBtn.setAttribute('aria-pressed', 'true');
      viewIndexBtn.classList.remove('active');
      viewIndexBtn.setAttribute('aria-pressed', 'false');

      archiveGrid.classList.remove('hidden');
      archiveIndex.classList.add('hidden');
    });

    viewIndexBtn.addEventListener('click', () => {
      viewIndexBtn.classList.add('active');
      viewIndexBtn.setAttribute('aria-pressed', 'true');
      viewGridBtn.classList.remove('active');
      viewGridBtn.setAttribute('aria-pressed', 'false');

      archiveIndex.classList.remove('hidden');
      archiveGrid.classList.add('hidden');
    });
  }


  // =========================================================================
  // 5. MODERN TOP-LAYER CASE STUDY MODAL DIALOG
  // =========================================================================
  const modal = document.getElementById('caseStudyModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalActionBtn = document.getElementById('modalActionBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const modalProjectTag = document.getElementById('modalProjectTag');
  const modalProjectYear = document.getElementById('modalProjectYear');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectSubtitle = document.getElementById('modalProjectSubtitle');
  const modalProjectImage = document.getElementById('modalProjectImage');
  const modalMetaClient = document.getElementById('modalMetaClient');
  const modalMetaLocation = document.getElementById('modalMetaLocation');
  const modalMetaServices = document.getElementById('modalMetaServices');
  const modalMetaStatus = document.getElementById('modalMetaStatus');
  const modalNarrativeChallenge = document.getElementById('modalNarrativeChallenge');
  const modalNarrativeStrategy = document.getElementById('modalNarrativeStrategy');

  // Case study project registry
  const projectsData = {
    'duke-city-fencing': {
      tag: 'SPORTS EXCELLENCE',
      year: '2025',
      title: 'Duke City Fencing Club',
      subtitle: 'Brand Reinvention, Modern Web Architecture & High-Speed Cinematography',
      image: 'assets/projects/duke-city-fencing/poster.svg',
      client: 'Duke City Fencing Club',
      location: 'Albuquerque, NM',
      services: 'Identity, Web Overhaul, Campaign Film',
      status: 'Live in Production',
      challenge: 'Duke City Fencing Club needed to break free from dusty recreational sports tropes and establish a commanding visual identity honoring the elite, razor-sharp speed of Olympic saber and foil in the American Southwest.',
      strategy: 'We built a high-contrast brutalist design system grounded in obsidian and electric amber. We directed and produced high-speed promotional footage showcasing the raw kinetic tension between blade and athlete, paired with an instantaneous class booking platform.'
    },
    'parkingly': {
      tag: 'VENTURE DESIGN & UI/UX',
      year: '2025',
      title: 'Parkingly Platform',
      subtitle: 'Zero-Friction Urban Mobility Ecosystem & Product Design System',
      image: 'assets/projects/parkingly/poster.svg',
      client: 'Parkingly Inc.',
      location: 'San Francisco / Global',
      services: 'Product Strategy, UI/UX, Launch Campaign',
      status: 'Venture Live',
      challenge: 'Urban parking is notoriously fragmented, stressful, and clunky. Parkingly needed an intuitive, tactile digital product and an authoritative brand posture to convert busy drivers in high-density metropolitan markets.',
      strategy: 'We crafted an intelligent interface architecture featuring one-tap geospatial reservations, real-time bay sensor status, and high-visibility typography that cuts through street glare. The brand identity balances civic reliability with high-tech momentum.'
    },
    'gastronomy': {
      tag: 'HAUTE CUISINE & SPATIAL',
      year: '2024—2026',
      title: 'Auteur Gastronomy & Spatial Experience',
      subtitle: 'Multi-Sensory Hospitality Identity & Degustation Plating Choreography',
      image: 'assets/projects/gastronomy/poster.svg',
      client: 'Vision Hospitality Group',
      location: 'Albuquerque // Mexico City',
      services: 'Culinary Direction, Spatial Branding, Degustation',
      status: 'Ongoing Program',
      challenge: 'High-concept tasting menus often suffer from generic minimalist branding that lacks the emotional heat and tactile intensity of executive kitchen craft.',
      strategy: 'Directing fifteen years of executive chef mastery into physical and visual design. We engineered bespoke bronze-foil menu artifacts, choreographed multi-course lighting and soundtrack transitions, and codified plating guidelines inspired by architectural brutalism.'
    },
    'motion-reel': {
      tag: 'CINEMATOGRAPHY & SOUND',
      year: '2024—2026',
      title: 'Commercial Film & Movement Direction',
      subtitle: '4K / 120 FPS Optical Direction, ACES Color Science & Spatial Audio',
      image: 'assets/projects/motion-reel/poster.svg',
      client: 'Global Commissions',
      location: 'International Broadcast / Web',
      services: '120 FPS High-Speed, ACES Color, Sound Design',
      status: 'Commission Roster',
      challenge: 'Commercial storytelling in the luxury and performance space is crowded with derivative, oversaturated content that fades from memory in seconds.',
      strategy: 'We capture movement with optical discipline. Utilizing anamorphic optics, high-frame-rate shutter timing, and customized low-end spatial audio mastering, we create visceral brand films that freeze time and command undivided attention.'
    }
  };

  function openCaseStudy(projectId) {
    const data = projectsData[projectId] || projectsData['duke-city-fencing'];
    if (!modal) return;

    modalProjectTag.textContent = data.tag;
    modalProjectYear.textContent = data.year;
    modalProjectTitle.textContent = data.title;
    modalProjectSubtitle.textContent = data.subtitle;
    modalProjectImage.src = data.image;
    modalMetaClient.textContent = data.client;
    modalMetaLocation.textContent = data.location;
    modalMetaServices.textContent = data.services;
    modalMetaStatus.textContent = data.status;
    modalNarrativeChallenge.textContent = data.challenge;
    modalNarrativeStrategy.textContent = data.strategy;

    modal.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    if (!modal) return;
    modal.close();
    document.body.style.overflow = '';
  }

  // Trigger buttons
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project');
      openCaseStudy(projectId);
    });
  });

  // Project cards click
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      openCaseStudy(projectId);
    });
  });

  // Index rows click
  document.querySelectorAll('.index-row').forEach(row => {
    row.addEventListener('click', () => {
      const projectId = row.getAttribute('data-project');
      openCaseStudy(projectId);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCaseStudy);
  if (modalActionBtn) modalActionBtn.addEventListener('click', closeCaseStudy);

  // Close on backdrop click (Modern light-dismiss pattern)
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCaseStudy();
      }
    });

    modal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });
  }


  // =========================================================================
  // 6. COMMISSION INQUIRY FORM & SCOPE CHIPS
  // =========================================================================
  const scopeChips = document.querySelectorAll('.scope-chip');
  const inquiryForm = document.getElementById('inquiryForm');
  const formFeedback = document.getElementById('formFeedback');

  scopeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedScopes = Array.from(document.querySelectorAll('.scope-chip.selected'))
                                  .map(c => c.textContent.trim());
      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const company = document.getElementById('clientCompany').value.trim();
      const budget = document.getElementById('projectBudget').value;
      const brief = document.getElementById('projectBrief').value.trim();

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>ENCRYPTING &amp; TRANSMITTING...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>COMMISSION BRIEF TRANSMITTED ✓</span>';

        if (formFeedback) {
          formFeedback.className = 'p-4 rounded-lg text-xs font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 block';
          formFeedback.innerHTML = `
            <strong>INQUIRY RECEIVED FOR ${name.toUpperCase()}</strong><br>
            Selected Scopes: ${selectedScopes.length ? selectedScopes.join(', ') : 'Comprehensive Architecture'}<br>
            Oscar &amp; the VISION team will review your brief within 24 hours. A confirmation has been routed to <code>${email}</code>.
          `;
        }

        // Reset form inputs after delay
        setTimeout(() => {
          inquiryForm.reset();
          scopeChips.forEach(c => c.classList.remove('selected'));
          submitBtn.innerHTML = '<span>TRANSMIT COMMISSION BRIEF ↗</span>';
        }, 6000);
      }, 1000);
    });
  }


  // =========================================================================
  // 7. WEB AUDIO WARM HARMONIC PAD SYNTHESIZER
  // =========================================================================
  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let oscillators = [];

  function initAudioEngine() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Filter for luxurious warm analog character
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, audioCtx.currentTime);
    filter.Q.setValueAtTime(2.5, audioCtx.currentTime);

    // Warm chord notes: D2, A2, D3, F#3 (Deep cinematic grounding)
    const freqs = [73.42, 110.00, 146.83, 185.00];

    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Subtle detune for natural analog chorus drift
      osc.detune.setValueAtTime((idx - 1.5) * 4, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      oscillators.push(osc);
    });

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', async () => {
      if (!audioCtx) initAudioEngine();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      if (!isPlaying) {
        // Fade in smoothly (no click)
        masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 1.2);
        isPlaying = true;
        audioIcon.textContent = '🔊';
        audioText.textContent = 'SOUND: ON';
        audioToggle.classList.add('border-amberAccent/80', 'text-amberAccent');
      } else {
        // Fade out smoothly
        masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        isPlaying = false;
        audioIcon.textContent = '🔈';
        audioText.textContent = 'SOUND: OFF';
        audioToggle.classList.remove('border-amberAccent/80', 'text-amberAccent');
      }
    });
  }

});
