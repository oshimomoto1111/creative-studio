/**
 * ============================================================================
 * ATELIER VOID / VISION — RELATIVISTIC THREE.JS COSMIC PARTICLE SIMULATION
 * 
 * Cinematic Timeline Sequence:
 * 1. The Big Bang (0.0s - 1.5s): Total blackness followed by explosive radial
 *    burst of fine stellar dust expanding across the entire viewport.
 * 2. The Implosion (1.5s - 3.0s): Deceleration at peak expansion followed by
 *    violent gravitational collapse towards the singularity.
 * 3. The Void & Accretion Loop (3.0s+): Absolute pitch-black event horizon
 *    occluding background matter, flanked by a hyper-fast Keplerian accretion
 *    disk and relativistic gravitational lensing arch (Interstellar/Gargantua).
 * ============================================================================
 */

(function initCosmicParticleSimulation() {
  function startEngine() {
    if (typeof THREE === 'undefined') {
      setTimeout(startEngine, 50);
      return;
    }

    const canvas = document.getElementById('blackHoleCanvas');
    if (!canvas) return;

    // -------------------------------------------------------------------------
    // 1. SCENE, CAMERA & HARDWARE-ACCELERATED RENDERER
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();
    
    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 0, 46);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // -------------------------------------------------------------------------
    // 2. PROCEDURAL HIGH-LUMINANCE PARTICLE GLOW TEXTURE
    // -------------------------------------------------------------------------
    function generateParticleTexture() {
      const size = 64;
      const cvs = document.createElement('canvas');
      cvs.width = cvs.height = size;
      const ctx = cvs.getContext('2d');
      const center = size / 2;

      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.15, 'rgba(255, 245, 210, 0.95)');
      gradient.addColorStop(0.35, 'rgba(229, 169, 60, 0.55)');
      gradient.addColorStop(0.65, 'rgba(217, 119, 6, 0.18)');
      gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(cvs);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    const particleTexture = generateParticleTexture();

    // -------------------------------------------------------------------------
    // 3. SINGULARITY CONTAINER & RESPONSIVE POSITIONING
    // -------------------------------------------------------------------------
    const cosmosGroup = new THREE.Group();
    scene.add(cosmosGroup);

    function updateSingularityPosition() {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        cosmosGroup.position.set(8.5, 0.5, 0);
      } else {
        cosmosGroup.position.set(0, 2.5, 0);
      }
    }
    updateSingularityPosition();

    // -------------------------------------------------------------------------
    // 4. THE EVENT HORIZON ("THE VOID") & RELATIVISTIC PHOTON RING
    // -------------------------------------------------------------------------
    const EH_RADIUS = 3.65;

    // Solid Black Sphere: occludes all particles behind it
    const sphereGeo = new THREE.SphereGeometry(EH_RADIUS, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eventHorizon = new THREE.Mesh(sphereGeo, sphereMat);
    eventHorizon.scale.set(0.001, 0.001, 0.001);
    eventHorizon.renderOrder = 1;
    cosmosGroup.add(eventHorizon);

    // Hyper-Radiant Photon Ring (Inner edge of accretion disk)
    const ringGeo = new THREE.RingGeometry(EH_RADIUS + 0.02, EH_RADIUS + 0.28, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const photonRing = new THREE.Mesh(ringGeo, ringMat);
    cosmosGroup.add(photonRing);

    // Soft Amber Accretion Rim Halo
    const haloGeo = new THREE.RingGeometry(EH_RADIUS + 0.25, EH_RADIUS + 1.4, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xe5a93c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const photonHalo = new THREE.Mesh(haloGeo, haloMat);
    cosmosGroup.add(photonHalo);

    // Initial Flash Particle for the exact Big Bang Ignition
    const flashGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const centralFlash = new THREE.Mesh(flashGeo, flashMat);
    cosmosGroup.add(centralFlash);

    // -------------------------------------------------------------------------
    // 5. RELATIVISTIC PARTICLE SIMULATION DATA (GPU BUFFERGEOMETRY)
    // -------------------------------------------------------------------------
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 12000 : 22000;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Particle metadata arrays
    const bangDirX = new Float32Array(PARTICLE_COUNT);
    const bangDirY = new Float32Array(PARTICLE_COUNT);
    const bangDirZ = new Float32Array(PARTICLE_COUNT);
    const bangMaxDist = new Float32Array(PARTICLE_COUNT);

    const orbitRadius = new Float32Array(PARTICLE_COUNT);
    const orbitAngle = new Float32Array(PARTICLE_COUNT);
    const orbitSpeed = new Float32Array(PARTICLE_COUNT);
    const orbitYOffset = new Float32Array(PARTICLE_COUNT);
    const isLensingArch = new Uint8Array(PARTICLE_COUNT);

    const baseColorR = new Float32Array(PARTICLE_COUNT);
    const baseColorG = new Float32Array(PARTICLE_COUNT);
    const baseColorB = new Float32Array(PARTICLE_COUNT);

    // Palette Colors
    const colWhiteHot = new THREE.Color(0xffffff);
    const colBrightGold = new THREE.Color(0xfcd34d);
    const colSolarAmber = new THREE.Color(0xe5a93c);
    const colDeepFire = new THREE.Color(0xd97706);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 1. BIG BANG: Spherical velocity vector with wide camera-frustum dispersion
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const sinPhi = Math.sin(phi);
      bangDirX[i] = sinPhi * Math.cos(theta);
      bangDirY[i] = sinPhi * Math.sin(theta) * 0.9;
      bangDirZ[i] = Math.cos(phi) * 0.75 + (Math.random() - 0.5) * 0.5;

      // Distance to screen borders
      bangMaxDist[i] = 38.0 + Math.random() * 55.0;

      // 2. ACCRETION DISK / INTERSTELLAR CONFIGURATION
      const archProbability = Math.random();
      const isArch = archProbability < 0.28; // 28% particles in the vertical lensing arch
      isLensingArch[i] = isArch ? 1 : 0;

      if (!isArch) {
        // Equatorial Disk: Power distribution dense near photon ring (4.0 to 19.5)
        const radNorm = Math.pow(Math.random(), 1.6);
        orbitRadius[i] = 4.0 + radNorm * 15.5;
        orbitYOffset[i] = (Math.random() - 0.5) * 0.55 * (orbitRadius[i] / 15.0);
      } else {
        // Gravitational Lensing Arch: looping vertically over and under the sphere
        const radNorm = Math.pow(Math.random(), 1.4);
        orbitRadius[i] = 3.9 + radNorm * 9.5;
        orbitYOffset[i] = (Math.random() - 0.5) * 0.35;
      }

      orbitAngle[i] = Math.random() * Math.PI * 2.0;

      // Keplerian velocity: v ~ 1 / sqrt(r)
      orbitSpeed[i] = (1.8 / Math.pow(orbitRadius[i], 0.85)) * (0.85 + Math.random() * 0.3);

      // Temperature-based Color assignment
      const tempFactor = 1.0 - (orbitRadius[i] - 4.0) / 15.5;
      let pColor;
      if (tempFactor > 0.75) {
        pColor = colWhiteHot.clone().lerp(colBrightGold, (1.0 - tempFactor) * 4.0);
      } else if (tempFactor > 0.4) {
        pColor = colBrightGold.clone().lerp(colSolarAmber, (0.75 - tempFactor) * 2.8);
      } else {
        pColor = colSolarAmber.clone().lerp(colDeepFire, (0.4 - tempFactor) * 2.5);
      }

      baseColorR[i] = pColor.r;
      baseColorG[i] = pColor.g;
      baseColorB[i] = pColor.b;

      colors[i * 3]     = baseColorR[i];
      colors[i * 3 + 1] = baseColorG[i];
      colors[i * 3 + 2] = baseColorB[i];

      // Initial positions at origin (hidden before launch)
      positions[i * 3]     = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 1.6 : 2.1,
      map: particleTexture,
      transparent: true,
      opacity: 1.0,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(geometry, material);
    cosmosGroup.add(particleSystem);

    // -------------------------------------------------------------------------
    // 6. DISK ORBIT COORDINATE TRANSFORMS (EQUATORIAL & LENSING ARCH)
    // -------------------------------------------------------------------------
    const DISK_TILT_X = 0.36; // ~21 degrees forward tilt toward camera
    const DISK_TILT_Z = 0.08;

    function getOrbitCoordinates(i, currentAngle) {
      const r = orbitRadius[i];
      const cosA = Math.cos(currentAngle);
      const sinA = Math.sin(currentAngle);

      if (isLensingArch[i] === 0) {
        // Equatorial Disk
        let x = r * cosA;
        let y = orbitYOffset[i];
        let z = r * sinA;

        // Apply Disk Incline
        const cosX = Math.cos(DISK_TILT_X);
        const sinX = Math.sin(DISK_TILT_X);
        const yTilted = y * cosX - z * sinX;
        const zTilted = y * sinX + z * cosX;

        return [x, yTilted, zTilted];
      } else {
        // Relativistic Lensing Halo (Arches around the photon sphere)
        // Upper and lower ring that wraps the top and bottom of the event horizon
        let x = r * cosA;
        let y = r * sinA * 0.96;
        let z = (cosA > 0 ? 1 : -1) * (EH_RADIUS * 0.3) + orbitYOffset[i];

        return [x, y, z];
      }
    }

    // -------------------------------------------------------------------------
    // 7. TIME SEQUENCER & CINEMATIC PHASES
    // -------------------------------------------------------------------------
    let startTime = performance.now();

    window.replayBigBangSequence = function() {
      startTime = performance.now();
    };

    const replayBtn = document.getElementById('replayBigBangBtn');
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.replayBigBangSequence();
      });
    }

    // Interactive Gyroscopic Mouse Parallax
    const mouse = { x: 0, y: 0 };
    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // -------------------------------------------------------------------------
    // 8. RENDER LOOP (LOCKED 60 FPS)
    // -------------------------------------------------------------------------
    let lastTime = performance.now();

    function animate() {
      requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000.0, 0.1);
      lastTime = now;

      const t = (now - startTime) / 1000.0; // Timeline time in seconds

      // Gyroscopic Damping on Mouse
      const targetRotX = mouse.y * 0.22;
      const targetRotY = mouse.x * 0.30;
      cosmosGroup.rotation.x += (targetRotX - cosmosGroup.rotation.x) * 0.05;
      cosmosGroup.rotation.y += (targetRotY - cosmosGroup.rotation.y) * 0.05;

      const posAttr = geometry.attributes.position;
      const colAttr = geometry.attributes.color;

      // =======================================================================
      // PHASE 1: THE BIG BANG (0.0s - 1.5s)
      // =======================================================================
      if (t < 1.5) {
        eventHorizon.scale.set(0.001, 0.001, 0.001);
        photonRing.material.opacity = 0;
        photonHalo.material.opacity = 0;

        if (t < 0.04) {
          // Total blackness before detonation
          centralFlash.material.opacity = 0;
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3]     = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
          }
        } else {
          // Explosive Radial Surge
          const p1 = (t - 0.04) / 1.46; // 0.0 -> 1.0
          // Cubic ease-out: explosive burst decelerating gently at the periphery
          const easeOut = 1.0 - Math.pow(1.0 - Math.min(p1, 1.0), 3.2);

          // Central Ignition Flash
          if (t < 0.35) {
            const flashP = (t - 0.04) / 0.31;
            centralFlash.material.opacity = (1.0 - flashP) * 0.9;
            centralFlash.scale.setScalar(1.0 + flashP * 4.0);
          } else {
            centralFlash.material.opacity = 0;
          }

          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const d = bangMaxDist[i] * easeOut;
            positions[i * 3]     = bangDirX[i] * d;
            positions[i * 3 + 1] = bangDirY[i] * d;
            positions[i * 3 + 2] = bangDirZ[i] * d;

            // Incandescent golden-white glow during the explosion
            const boost = (1.0 - p1) * 0.5;
            colors[i * 3]     = Math.min(1.0, baseColorR[i] + boost);
            colors[i * 3 + 1] = Math.min(1.0, baseColorG[i] + boost);
            colors[i * 3 + 2] = Math.min(1.0, baseColorB[i] + boost);
          }
        }
      }
      // =======================================================================
      // PHASE 2: LA IMPLOSIÓN (1.5s - 3.0s)
      // =======================================================================
      else if (t < 3.0) {
        centralFlash.material.opacity = 0;
        const p2 = (t - 1.5) / 1.5; // 0.0 -> 1.0
        // Runaway gravitational acceleration curve
        const gravCurve = Math.pow(p2, 2.7);

        // Horizon Void Formation (materializes from t = 2.4s to 3.0s)
        if (t >= 2.3) {
          const ehP = (t - 2.3) / 0.7;
          const ehScale = Math.min(1.0, Math.pow(ehP, 2.2));
          eventHorizon.scale.set(ehScale, ehScale, ehScale);
          photonRing.material.opacity = ehScale * 0.95;
          photonHalo.material.opacity = ehScale * 0.35;
        } else {
          eventHorizon.scale.set(0.001, 0.001, 0.001);
          photonRing.material.opacity = 0;
          photonHalo.material.opacity = 0;
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          // Apex position from Big Bang
          const bx = bangDirX[i] * bangMaxDist[i];
          const by = bangDirY[i] * bangMaxDist[i];
          const bz = bangDirZ[i] * bangMaxDist[i];

          // Advance orbital angle with increasing angular momentum
          orbitAngle[i] += orbitSpeed[i] * dt * (1.0 + gravCurve * 3.0);
          const [ox, oy, oz] = getOrbitCoordinates(i, orbitAngle[i]);

          // Runaway pull inwards with spiral vortex
          positions[i * 3]     = bx * (1.0 - gravCurve) + ox * gravCurve;
          positions[i * 3 + 1] = by * (1.0 - gravCurve) + oy * gravCurve;
          positions[i * 3 + 2] = bz * (1.0 - gravCurve) + oz * gravCurve;

          // Color returns to steady-state temperature palette
          colors[i * 3]     = baseColorR[i];
          colors[i * 3 + 1] = baseColorG[i];
          colors[i * 3 + 2] = baseColorB[i];
        }
      }
      // =======================================================================
      // PHASE 3: EL AGUJERO NEGRO / EL "VOID" (3.0s+ LOOP CONTINUO)
      // =======================================================================
      else {
        // Void is fully locked in core
        eventHorizon.scale.set(1.0, 1.0, 1.0);

        // Subtle Relativistic Photon Ring Pulsation
        const pulse = Math.sin(t * 3.5);
        photonRing.material.opacity = 0.92 + pulse * 0.08;
        photonHalo.material.opacity = 0.32 + pulse * 0.06;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          // Advance Keplerian orbit
          orbitAngle[i] += orbitSpeed[i] * dt;

          // Subtle Inflow Advection towards singularity
          orbitRadius[i] -= 0.06 * dt;
          if (orbitRadius[i] < 3.85) {
            // Particle swallowed by horizon, respawn at outer rim
            orbitRadius[i] = 18.0 + Math.random() * 2.0;
          }

          const [ox, oy, oz] = getOrbitCoordinates(i, orbitAngle[i]);
          positions[i * 3]     = ox;
          positions[i * 3 + 1] = oy;
          positions[i * 3 + 2] = oz;

          // Relativistic Doppler Beaming: Left side approaches observer, boost intensity
          const dopplerFactor = ox < 0 ? (1.0 + Math.min(Math.abs(ox) / 12.0, 0.45)) : (1.0 - Math.min(ox / 18.0, 0.3));
          colors[i * 3]     = Math.min(1.0, baseColorR[i] * dopplerFactor);
          colors[i * 3 + 1] = Math.min(1.0, baseColorG[i] * dopplerFactor);
          colors[i * 3 + 2] = Math.min(1.0, baseColorB[i] * dopplerFactor);
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    // -------------------------------------------------------------------------
    // 9. WINDOW RESIZE OBSERVER
    // -------------------------------------------------------------------------
    function onResize() {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      updateSingularityPosition();
    }

    window.addEventListener('resize', onResize);

    // Start 60 FPS Animation
    animate();
  }

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
  } else {
    startEngine();
  }
})();
