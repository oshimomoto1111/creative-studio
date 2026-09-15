/**
 * ============================================================================
 * ATELIER VOID / VISION — CONTINUOUS RELATIVISTIC BLACK HOLE ENGINE
 * 
 * 100% Continuous Fluid Plasma Light (Zero Dots / Grain)
 * 
 * Cinematic Timeline:
 * 1. The Big Bang (0.0s - 1.5s): Total darkness followed by an expansive
 *    continuous shockwave burst radiating outward across the entire screen.
 * 2. The Implosion (1.5s - 3.0s): Deceleration at peak expansion followed by
 *    violent gravitational suction into the core singularity.
 * 3. The Void & Accretion Loop (3.0s+): Absolute pitch-black event horizon,
 *    razor-sharp photon ring, and continuous, fluid Keplerian accretion disk
 *    with relativistic lensing arch (Interstellar / Gargantua).
 * ============================================================================
 */

(function initContinuousBlackHole() {
  function launch() {
    if (typeof THREE === 'undefined') {
      setTimeout(launch, 50);
      return;
    }

    const canvas = document.getElementById('blackHoleCanvas');
    if (!canvas) return;

    // -------------------------------------------------------------------------
    // 1. SCENE, CAMERA & HARDWARE RENDERER
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();

    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 42);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // -------------------------------------------------------------------------
    // 2. ROOT BLACK HOLE GROUP & RESPONSIVE POSITIONING
    // -------------------------------------------------------------------------
    const cosmosGroup = new THREE.Group();
    scene.add(cosmosGroup);

    function updateCosmosPosition() {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        cosmosGroup.position.set(8.5, 0.2, 0);
      } else {
        cosmosGroup.position.set(0, 2.2, 0);
      }
    }
    updateCosmosPosition();

    // -------------------------------------------------------------------------
    // 3. GLSL CONTINUOUS PLASMA SHADER
    // -------------------------------------------------------------------------
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uInnerRadius;
      uniform float uOuterRadius;
      uniform float uDopplerStrength;
      uniform float uOpacity;
      uniform float uBrightness;
      uniform float uSpeedMultiplier;

      varying vec2 vUv;
      varying vec3 vPosition;

      // Fast continuous procedural 2D noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.55;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 3; ++i) {
          v += a * smoothNoise(p);
          p = rot * p * 2.1 + vec2(uTime * 0.15);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        float r = length(vPosition.xy);
        float phi = atan(vPosition.y, vPosition.x);

        // Normalize radius
        float rNorm = clamp((r - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);

        // Differential Keplerian fluid velocity (inner layers orbit faster)
        float keplerSpeed = (2.2 / pow(max(r, 1.0) / uInnerRadius, 0.72)) * uSpeedMultiplier;
        float flowPhi = phi + uTime * keplerSpeed;

        // Continuous smooth plasma turbulence in polar coordinates
        vec2 polarP = vec2(rNorm * 4.5, flowPhi * 3.5 / 3.14159);
        float plasma = fbm(polarP);

        // Continuous radial falloff curve: peak luminance near inner edge, smooth decay outward
        float radial = sin(rNorm * 3.14159) * pow(1.0 - rNorm * 0.65, 1.35);
        radial = clamp(radial * 1.65, 0.0, 1.0);

        // Relativistic Doppler Beaming:
        // Left side approaches observer -> brighter & whiter
        // Right side recedes -> darker & warmer amber
        float doppler = 1.0 - (vPosition.x / uOuterRadius) * uDopplerStrength;
        doppler = clamp(doppler, 0.35, 1.85);

        // Fluid continuous color gradient
        vec3 colWhiteHot   = vec3(1.0, 1.0, 1.0);
        vec3 colBrightGold  = vec3(1.0, 0.88, 0.48);
        vec3 colSolarAmber  = vec3(0.92, 0.62, 0.16);
        vec3 colDeepOrange  = vec3(0.82, 0.36, 0.05);

        float heat = clamp(radial * doppler + (plasma - 0.5) * 0.28, 0.0, 1.0);
        vec3 color;
        if (heat > 0.72) {
          color = mix(colBrightGold, colWhiteHot, (heat - 0.72) * 3.57);
        } else if (heat > 0.38) {
          color = mix(colSolarAmber, colBrightGold, (heat - 0.38) * 2.94);
        } else {
          color = mix(colDeepOrange, colSolarAmber, heat * 2.63);
        }

        // Feathered alpha falloff at boundaries
        float innerFeather = smoothstep(0.0, 0.06, rNorm);
        float outerFeather = 1.0 - smoothstep(0.78, 1.0, rNorm);
        float alpha = innerFeather * outerFeather * (0.75 + plasma * 0.25) * uOpacity;

        // Apply Doppler radiance boost
        color *= (1.0 + (1.0 - rNorm) * 0.7 * doppler) * uBrightness;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // -------------------------------------------------------------------------
    // 4. THE EVENT HORIZON ("THE VOID")
    // -------------------------------------------------------------------------
    const EH_RADIUS = 3.65;

    // Solid Black Sphere: occludes all rear light
    const sphereGeo = new THREE.SphereGeometry(EH_RADIUS, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eventHorizon = new THREE.Mesh(sphereGeo, sphereMat);
    eventHorizon.scale.set(0.001, 0.001, 0.001);
    eventHorizon.renderOrder = 2; // Render to depth buffer
    cosmosGroup.add(eventHorizon);

    // Continuous Razor-Sharp Photon Ring (White-Hot Edge)
    const photonRingGeo = new THREE.RingGeometry(EH_RADIUS + 0.01, EH_RADIUS + 0.26, 128);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    cosmosGroup.add(photonRing);

    // Continuous Soft Amber Corona Halo
    const haloGeo = new THREE.RingGeometry(EH_RADIUS + 0.22, EH_RADIUS + 1.2, 128);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xe5a93c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const photonHalo = new THREE.Mesh(haloGeo, haloMat);
    cosmosGroup.add(photonHalo);

    // -------------------------------------------------------------------------
    // 5. CONTINUOUS EQUATORIAL ACCRETION DISK (ZERO DOTS)
    // -------------------------------------------------------------------------
    const DISK_INNER = 3.75;
    const DISK_OUTER = 16.5;

    const diskGeo = new THREE.RingGeometry(DISK_INNER, DISK_OUTER, 180, 48);
    const diskUniforms = {
      uTime: { value: 0 },
      uInnerRadius: { value: DISK_INNER },
      uOuterRadius: { value: DISK_OUTER },
      uDopplerStrength: { value: 0.65 },
      uOpacity: { value: 0 },
      uBrightness: { value: 1.15 },
      uSpeedMultiplier: { value: 1.0 }
    };

    const diskMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: diskUniforms,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
    // Incline disk 22 degrees toward camera
    accretionDisk.rotation.x = 0.38;
    accretionDisk.rotation.z = 0.05;
    cosmosGroup.add(accretionDisk);

    // -------------------------------------------------------------------------
    // 6. CONTINUOUS GRAVITATIONAL LENSING ARCH (INTERSTELLAR VERTICAL HALO)
    // -------------------------------------------------------------------------
    const ARCH_INNER = 3.7;
    const ARCH_OUTER = 11.2;

    const archGeo = new THREE.RingGeometry(ARCH_INNER, ARCH_OUTER, 180, 32);
    const archUniforms = {
      uTime: { value: 0 },
      uInnerRadius: { value: ARCH_INNER },
      uOuterRadius: { value: ARCH_OUTER },
      uDopplerStrength: { value: 0.4 },
      uOpacity: { value: 0 },
      uBrightness: { value: 1.0 },
      uSpeedMultiplier: { value: 0.85 }
    };

    const archMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: archUniforms,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lensingArch = new THREE.Mesh(archGeo, archMat);
    // Vertical orientation wrapping behind and over the black hole
    lensingArch.position.z = -0.5;
    cosmosGroup.add(lensingArch);

    // -------------------------------------------------------------------------
    // 7. BIG BANG CONTINUOUS SHOCKWAVE & FLASH
    // -------------------------------------------------------------------------
    const shockwaveGeo = new THREE.RingGeometry(0.5, 3.5, 96);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    cosmosGroup.add(shockwave);

    const flashGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const flashSphere = new THREE.Mesh(flashGeo, flashMat);
    cosmosGroup.add(flashSphere);

    // -------------------------------------------------------------------------
    // 8. TIMELINE CONTROLLER & PHASES
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

    // Gyroscopic mouse parallax
    const mouse = { x: 0, y: 0 };
    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // -------------------------------------------------------------------------
    // 9. ANIMATION LOOP (LOCKED 60 FPS)
    // -------------------------------------------------------------------------
    let lastTime = performance.now();

    function animate() {
      requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000.0, 0.1);
      lastTime = now;

      const t = (now - startTime) / 1000.0;

      // Gyroscopic Damping
      const targetRotX = mouse.y * 0.18;
      const targetRotY = mouse.x * 0.25;
      cosmosGroup.rotation.x += (targetRotX - cosmosGroup.rotation.x) * 0.05;
      cosmosGroup.rotation.y += (targetRotY - cosmosGroup.rotation.y) * 0.05;

      diskUniforms.uTime.value = t;
      archUniforms.uTime.value = t;

      // =======================================================================
      // PHASE 1: EL BIG BANG (0.0s - 1.5s)
      // =======================================================================
      if (t < 1.5) {
        eventHorizon.scale.set(0.001, 0.001, 0.001);
        photonRingMat.opacity = 0;
        photonHaloMat.opacity = 0;

        if (t < 0.04) {
          // Total blackness before ignition
          flashSphere.scale.set(0.001, 0.001, 0.001);
          flashMat.opacity = 0;
          shockwave.scale.set(0.001, 0.001, 0.001);
          shockwaveMat.opacity = 0;
          diskUniforms.uOpacity.value = 0;
          archUniforms.uOpacity.value = 0;
        } else {
          const p1 = (t - 0.04) / 1.46; // 0.0 -> 1.0
          // Cubic ease-out expansion across entire viewport
          const easeOut = 1.0 - Math.pow(1.0 - Math.min(p1, 1.0), 3.0);

          // Central Igniting Flash
          if (t < 0.35) {
            const fp = (t - 0.04) / 0.31;
            flashSphere.scale.setScalar(0.5 + fp * 6.0);
            flashMat.opacity = (1.0 - fp) * 0.95;
          } else {
            flashMat.opacity = 0;
          }

          // Expanding continuous shockwave wave
          const shockScale = 0.5 + easeOut * 22.0;
          shockwave.scale.set(shockScale, shockScale, shockScale);
          shockwaveMat.opacity = (1.0 - easeOut) * 0.85;

          // Continuous accretion disk expands outward like cosmic fluid
          const burstScale = 0.05 + easeOut * 2.8;
          accretionDisk.scale.set(burstScale, burstScale, burstScale);
          lensingArch.scale.set(burstScale, burstScale, burstScale);

          diskUniforms.uOpacity.value = Math.min(1.0, easeOut * 1.3);
          archUniforms.uOpacity.value = Math.min(1.0, easeOut * 1.1);
          diskUniforms.uBrightness.value = 1.0 + (1.0 - p1) * 1.5; // High ignition radiance
          archUniforms.uBrightness.value = 1.0 + (1.0 - p1) * 1.2;
        }
      }
      // =======================================================================
      // PHASE 2: LA IMPLOSIÓN (1.5s - 3.0s)
      // =======================================================================
      else if (t < 3.0) {
        flashMat.opacity = 0;
        shockwaveMat.opacity = 0;

        const p2 = (t - 1.5) / 1.5; // 0.0 -> 1.0
        // Accelerating gravitational suction curve
        const grav = Math.pow(p2, 2.6);

        // Disk contracts from peak burst scale (2.85) down to 1.0
        const currentScale = 2.85 * (1.0 - grav) + 1.0 * grav;
        accretionDisk.scale.set(currentScale, currentScale, currentScale);
        lensingArch.scale.set(currentScale, currentScale, currentScale);

        // Angular velocity spins up as matter gets compacted
        diskUniforms.uSpeedMultiplier.value = 1.0 + (1.0 - grav) * 2.5;
        archUniforms.uSpeedMultiplier.value = 0.85 + (1.0 - grav) * 2.0;

        diskUniforms.uOpacity.value = 1.0;
        archUniforms.uOpacity.value = 1.0;
        diskUniforms.uBrightness.value = 1.15;
        archUniforms.uBrightness.value = 1.0;

        // Central Void Horizon Materializes (from 2.2s to 3.0s)
        if (t >= 2.2) {
          const ehP = (t - 2.2) / 0.8;
          const ehScale = Math.min(1.0, Math.pow(ehP, 2.2));
          eventHorizon.scale.set(ehScale, ehScale, ehScale);
          photonRingMat.opacity = ehScale * 0.95;
          photonHaloMat.opacity = ehScale * 0.38;
        } else {
          eventHorizon.scale.set(0.001, 0.001, 0.001);
          photonRingMat.opacity = 0;
          photonHaloMat.opacity = 0;
        }
      }
      // =======================================================================
      // PHASE 3: EL AGUJERO NEGRO / EL "VOID" (3.0s+ LOOP CONTINUO)
      // =======================================================================
      else {
        // Horizon locked in center
        eventHorizon.scale.set(1.0, 1.0, 1.0);
        accretionDisk.scale.set(1.0, 1.0, 1.0);
        lensingArch.scale.set(1.0, 1.0, 1.0);

        diskUniforms.uSpeedMultiplier.value = 1.0;
        archUniforms.uSpeedMultiplier.value = 0.85;
        diskUniforms.uOpacity.value = 1.0;
        archUniforms.uOpacity.value = 1.0;
        diskUniforms.uBrightness.value = 1.15;
        archUniforms.uBrightness.value = 1.0;

        // Subtle continuous photon ring pulsation
        const pulse = Math.sin(t * 3.0);
        photonRingMat.opacity = 0.92 + pulse * 0.08;
        photonHaloMat.opacity = 0.35 + pulse * 0.06;
      }

      renderer.render(scene, camera);
    }

    // -------------------------------------------------------------------------
    // 10. RESIZE OBSERVER
    // -------------------------------------------------------------------------
    function onResize() {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      updateCosmosPosition();
    }

    window.addEventListener('resize', onResize);

    // Launch Loop
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', launch);
  } else {
    launch();
  }
})();
