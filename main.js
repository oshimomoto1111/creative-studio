/**
 * LOVERBOY NEIGHBORHOOD COFFEE — CORE INTERACTIVE ENGINE
 * Modules:
 * 1. Real-Time Nob Hill Albuquerque Window Operating Hours
 * 2. Interactive "Selfie Mirror" (Webcam Stream, Stickers & Polaroid Snap)
 * 3. Menu Item Detail Modal & Quick Notes
 * 4. Ambient Neon Cursor Flare
 * 5. Loverboy Window Jams (Lo-Fi 70s Soul & Vinyl Synthesizer)
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. REAL-TIME NOB HILL ALBUQUERQUE WINDOW OPERATING HOURS
  // =========================================================================
  const liveStatusText = document.getElementById('liveStatusText');
  const statusIndicatorDot = document.getElementById('statusIndicatorDot');
  const localClockDisplay = document.getElementById('localClockDisplay');
  const footerStatusBadge = document.getElementById('footerStatusBadge');

  function calculateWindowStatus() {
    try {
      const now = new Date();
      
      // Format to America/Denver (Albuquerque, NM)
      const options = {
        timeZone: 'America/Denver',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        weekday: 'short'
      };
      
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.formatToParts(now);
      
      const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
      const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);
      const second = parts.find(p => p.type === 'second').value;
      const weekday = parts.find(p => p.type === 'weekday').value; // Mon, Tue, etc.
      
      const currentTimeDecimal = hour + (minute / 60);

      // Schedule:
      // Mon - Fri: 7:00 AM (7.0) to 3:00 PM (15.0)
      // Sat - Sun: 7:30 AM (7.5) to 4:00 PM (16.0)
      const isWeekend = (weekday === 'Sat' || weekday === 'Sun');
      const openTime = isWeekend ? 7.5 : 7.0;
      const closeTime = isWeekend ? 16.0 : 15.0;
      const closeStr = isWeekend ? '4:00 PM' : '3:00 PM';
      const openStr = isWeekend ? '7:30 AM' : '7:00 AM';

      const isOpen = (currentTimeDecimal >= openTime && currentTimeDecimal < closeTime);

      // Update Tickers
      if (localClockDisplay) {
        localClockDisplay.textContent = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${second} MST`;
      }

      if (isOpen) {
        if (statusIndicatorDot) {
          statusIndicatorDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]';
        }
        if (liveStatusText) {
          liveStatusText.textContent = `● OPEN NOW // NOB HILL WINDOW POURING UNTIL ${closeStr} MST`;
        }
        if (footerStatusBadge) {
          footerStatusBadge.className = 'text-emerald-400 font-bold';
          footerStatusBadge.textContent = `● OPEN NOW (Until ${closeStr})`;
        }
      } else {
        if (statusIndicatorDot) {
          statusIndicatorDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]';
        }
        if (liveStatusText) {
          liveStatusText.textContent = `○ WINDOW CLOSED // CATCH US TOMORROW AT ${openStr} MST`;
        }
        if (footerStatusBadge) {
          footerStatusBadge.className = 'text-rose-400 font-bold';
          footerStatusBadge.textContent = `○ CLOSED (Opens ${openStr})`;
        }
      }
    } catch (err) {
      console.error('Error calculating window hours:', err);
    }
  }

  calculateWindowStatus();
  setInterval(calculateWindowStatus, 1000);


  // =========================================================================
  // 2. INTERACTIVE "SELFIE MIRROR" (WEBCAM, STICKERS & POLAROID SNAP)
  // =========================================================================
  const toggleCameraBtn = document.getElementById('toggleCameraBtn');
  const snapPolaroidBtn = document.getElementById('snapPolaroidBtn');
  const mirrorVideo = document.getElementById('mirrorVideo');
  const mirrorDefaultView = document.getElementById('mirrorDefaultView');
  const stickersLayer = document.getElementById('stickersLayer');
  const stickerBtns = document.querySelectorAll('.sticker-btn');
  const clearStickersBtn = document.getElementById('clearStickersBtn');
  const mirrorFeedback = document.getElementById('mirrorFeedback');
  const snapshotCanvas = document.getElementById('snapshotCanvas');

  let mediaStream = null;
  let isCameraActive = false;

  // Toggle Live Mirror Camera
  if (toggleCameraBtn && mirrorVideo && mirrorDefaultView) {
    toggleCameraBtn.addEventListener('click', async () => {
      if (!isCameraActive) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 720 },
              height: { ideal: 960 },
              facingMode: 'user'
            },
            audio: false
          });

          mirrorVideo.srcObject = mediaStream;
          mirrorVideo.classList.remove('hidden');
          mirrorDefaultView.classList.add('hidden');
          isCameraActive = true;
          toggleCameraBtn.innerHTML = '<span>TURN OFF CAMERA ✕</span>';
          toggleCameraBtn.classList.replace('bg-cherryRed', 'bg-zinc-800');

          showFeedback('Mirror Camera Active! Strike a pose 💋');
        } catch (err) {
          console.warn('Camera access denied or unavailable:', err);
          showFeedback('Camera unavailable or permission denied. You can still use stickers!');
        }
      } else {
        // Stop Camera
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
        mirrorVideo.classList.add('hidden');
        mirrorDefaultView.classList.remove('hidden');
        isCameraActive = false;
        toggleCameraBtn.innerHTML = '<span>TURN ON MIRROR CAMERA 📷</span>';
        toggleCameraBtn.classList.replace('bg-zinc-800', 'bg-cherryRed');
        showFeedback('Mirror camera turned off.');
      }
    });
  }

  // Stamp Stickers on the Mirror
  stickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-sticker');
      if (!emoji || !stickersLayer) return;

      const sticker = document.createElement('div');
      sticker.className = 'mirror-sticker pointer-events-auto';
      sticker.textContent = emoji;

      // Random position around center
      const randomTop = Math.floor(Math.random() * 60 + 20); // 20% to 80%
      const randomLeft = Math.floor(Math.random() * 60 + 20); // 20% to 80%
      const randomRotate = Math.floor(Math.random() * 40 - 20); // -20deg to 20deg

      sticker.style.top = `${randomTop}%`;
      sticker.style.left = `${randomLeft}%`;
      sticker.style.transform = `rotate(${randomRotate}deg)`;

      // Click sticker to remove it
      sticker.title = 'Click to remove';
      sticker.addEventListener('click', () => {
        sticker.remove();
      });

      stickersLayer.appendChild(sticker);
      showFeedback(`Added ${emoji} sticker!`);
    });
  });

  // Clear all stickers
  if (clearStickersBtn && stickersLayer) {
    clearStickersBtn.addEventListener('click', () => {
      stickersLayer.innerHTML = '';
      showFeedback('Stickers cleared.');
    });
  }

  // Snap & Download Polaroid
  if (snapPolaroidBtn && snapshotCanvas) {
    snapPolaroidBtn.addEventListener('click', () => {
      const ctx = snapshotCanvas.getContext('2d');
      const width = 600;
      const height = 750;

      snapshotCanvas.width = width;
      snapshotCanvas.height = height;

      // 1. Draw Classic White Polaroid Base
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 2. Photo Area (Dark inset)
      const photoX = 40;
      const photoY = 40;
      const photoWidth = 520;
      const photoHeight = 520;

      ctx.fillStyle = '#140c0d';
      ctx.fillRect(photoX, photoY, photoWidth, photoHeight);

      // 3. Draw Camera Video Feed OR Default Graphic
      if (isCameraActive && mirrorVideo && mirrorVideo.readyState >= 2) {
        ctx.save();
        // Flip horizontally to match mirror preview
        ctx.translate(photoX + photoWidth, photoY);
        ctx.scale(-1, 1);
        ctx.drawImage(mirrorVideo, 0, 0, photoWidth, photoHeight);
        ctx.restore();
      } else {
        // Fallback: draw dark romantic gradient & heart
        const grad = ctx.createLinearGradient(photoX, photoY, photoX + photoWidth, photoY + photoHeight);
        grad.addColorStop(0, '#4A0E17');
        grad.addColorStop(1, '#0f0a0a');
        ctx.fillStyle = grad;
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight);

        ctx.fillStyle = '#FF4081';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LOVERBOY', width / 2, 280);

        ctx.fillStyle = '#F8F2E2';
        ctx.font = '20px sans-serif';
        ctx.fillText('NEIGHBORHOOD COFFEE', width / 2, 320);

        ctx.fillStyle = '#FF4081';
        ctx.font = '48px sans-serif';
        ctx.fillText('💋 ☕ 🌹', width / 2, 400);
      }

      // 4. Render Stamped Stickers onto Canvas
      const activeStickers = stickersLayer ? stickersLayer.querySelectorAll('.mirror-sticker') : [];
      ctx.font = '42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      activeStickers.forEach(s => {
        const topPct = parseFloat(s.style.top) / 100;
        const leftPct = parseFloat(s.style.left) / 100;
        const x = photoX + (photoWidth * leftPct);
        const y = photoY + (photoHeight * topPct);
        ctx.fillText(s.textContent, x, y);
      });

      // 5. Polaroid Bottom Text
      ctx.fillStyle = '#D81E34';
      ctx.font = 'bold 24px cursive, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LOVERBOY NOB HILL, ABQ', width / 2, 630);

      ctx.fillStyle = '#333333';
      ctx.font = '13px monospace';
      ctx.fillText('TAG @LOVERBOYCOFFEE • SPREAD THE LOVE ♥', width / 2, 675);

      // 6. Trigger Instant Download
      const dataUrl = snapshotCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `loverboy-polaroid-${Date.now()}.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      showFeedback('📸 Polaroid saved to downloads! Share on IG: @loverboycoffee');
    });
  }

  function showFeedback(msg) {
    if (!mirrorFeedback) return;
    mirrorFeedback.textContent = msg;
    mirrorFeedback.classList.remove('hidden');
    setTimeout(() => {
      mirrorFeedback.classList.add('hidden');
    }, 4000);
  }


  // =========================================================================
  // 3. MENU ITEM DETAIL MODAL DIALOG
  // =========================================================================
  const menuModal = document.getElementById('menuDetailModal');
  const modalItemName = document.getElementById('modalItemName');
  const modalItemPrice = document.getElementById('modalItemPrice');
  const modalItemDesc = document.getElementById('modalItemDesc');
  const modalItemNotes = document.getElementById('modalItemNotes');
  const closeMenuModalBtn = document.getElementById('closeMenuModalBtn');
  const modalOrderWindowBtn = document.getElementById('modalOrderWindowBtn');
  const menuModalBackdrop = document.getElementById('menuModalBackdrop');

  window.openMenuDetail = function(name, price, desc, notes) {
    if (!menuModal) return;
    if (modalItemName) modalItemName.textContent = name;
    if (modalItemPrice) modalItemPrice.textContent = price;
    if (modalItemDesc) modalItemDesc.textContent = desc;
    if (modalItemNotes) modalItemNotes.textContent = notes || 'Hand-crafted at the Nob Hill window.';

    menuModal.showModal();
    document.body.style.overflow = 'hidden';
  };

  function closeMenuModal() {
    if (!menuModal) return;
    menuModal.close();
    document.body.style.overflow = '';
  }

  if (closeMenuModalBtn) closeMenuModalBtn.addEventListener('click', closeMenuModal);
  if (modalOrderWindowBtn) modalOrderWindowBtn.addEventListener('click', () => {
    closeMenuModal();
    const hoursSection = document.getElementById('hours');
    if (hoursSection) hoursSection.scrollIntoView({ behavior: 'smooth' });
  });

  if (menuModal) {
    menuModal.addEventListener('click', (e) => {
      if (e.target === menuModal || e.target === menuModalBackdrop) {
        closeMenuModal();
      }
    });

    menuModal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });
  }


  // =========================================================================
  // 4. AMBIENT NEON CURSOR FLARE
  // =========================================================================
  const neonFlare = document.getElementById('neonFlare');
  if (neonFlare) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderFlare() {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      neonFlare.style.setProperty('--mouse-x', `${curX.toFixed(1)}px`);
      neonFlare.style.setProperty('--mouse-y', `${curY.toFixed(1)}px`);
      requestAnimationFrame(renderFlare);
    }
    requestAnimationFrame(renderFlare);
  }


  // =========================================================================
  // 5. LOVERBOY WINDOW JAMS (LO-FI 70S SOUL & VINYL SYNTHESIZER)
  // =========================================================================
  const radioToggleBtn = document.getElementById('radioToggleBtn');
  const radioIcon = document.getElementById('radioIcon');
  const radioStatus = document.getElementById('radioStatus');
  const mixtapePlayBtn = document.getElementById('mixtapePlayBtn');

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let chordOscillators = [];
  let chordInterval = null;

  function initRadioEngine() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Warm analog lowpass filter for 70s vinyl tone
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.8, audioCtx.currentTime);

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // 70s Soul Chord Progressions (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 196.00, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7
    ];

    let chordIndex = 0;

    function playChord(chord) {
      // Clear old oscillators
      chordOscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      chordOscillators = [];

      chord.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Gentle chorus drift
        osc.detune.setValueAtTime((idx - 1.5) * 5, audioCtx.currentTime);

        oscGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        chordOscillators.push(osc);
      });
    }

    playChord(chords[0]);

    chordInterval = setInterval(() => {
      if (isPlaying) {
        chordIndex = (chordIndex + 1) % chords.length;
        playChord(chords[chordIndex]);
      }
    }, 4000);
  }

  function toggleRadio() {
    if (!audioCtx) initRadioEngine();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      masterGain.gain.linearRampToValueAtTime(0.28, audioCtx.currentTime + 1.5);
      isPlaying = true;
      if (radioIcon) radioIcon.textContent = '🎶';
      if (radioStatus) radioStatus.textContent = 'RADIO: ON';
      if (mixtapePlayBtn) mixtapePlayBtn.textContent = 'PAUSE ❚❚';
    } else {
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
      isPlaying = false;
      if (radioIcon) radioIcon.textContent = '📻';
      if (radioStatus) radioStatus.textContent = 'RADIO: OFF';
      if (mixtapePlayBtn) mixtapePlayBtn.textContent = 'PLAY ✦';
    }
  }

  if (radioToggleBtn) radioToggleBtn.addEventListener('click', toggleRadio);
  if (mixtapePlayBtn) mixtapePlayBtn.addEventListener('click', toggleRadio);

});
