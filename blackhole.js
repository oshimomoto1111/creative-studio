/**
 * ============================================================================
 * ATELIER VOID — RELATIVISTIC BLACK HOLE WEBGL SHADER ENGINE
 * Inspired by Kip Thorne's raytraced Schwarzschild / Kerr Black Hole ("Gargantua")
 * 
 * Features:
 * - Real-time GPU raymarching in curved spacetime (null geodesics)
 * - Upper and lower gravitational lensing arcs (deflected back of accretion disk)
 * - Equatorial accretion disk slicing across the event horizon
 * - Relativistic Doppler beaming (hotter/brighter on approaching side)
 * - Multi-octave procedural plasma turbulence & accretion filaments
 * - Razor-sharp glowing photon ring at the shadow boundary
 * - Interactive mouse/touch camera perspective tilting
 * ============================================================================
 */

(function initRelativisticBlackHole() {
  const canvas = document.getElementById('blackHoleCanvas');
  if (!canvas) return;

  // Try WebGL2 first, fallback to WebGL
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, depth: false }) ||
             canvas.getContext('webgl', { alpha: true, antialias: true, depth: false });

  if (!gl) {
    console.warn('WebGL not supported for Black Hole shader.');
    return;
  }

  // Vertex Shader: Fullscreen quad
  const vsSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment Shader: Relativistic Raymarching of Gargantua
  const fsSource = `
    precision highp float;
    varying vec2 v_uv;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    #define RS 0.74              // Schwarzschild Event Horizon Radius
    #define RIN (RS * 1.15)      // Inner Accretion Disk Edge
    #define ROUT (RS * 3.4)      // Outer Accretion Disk Edge
    #define STEPS 58             // Raymarching Integration Steps
    #define DT 0.078             // Geodesic Step Size

    // Camera matrix
    mat3 setCamera(vec3 ro, vec3 ta, float cr) {
      vec3 cw = normalize(ta - ro);
      vec3 cp = vec3(sin(cr), cos(cr), 0.0);
      vec3 cu = normalize(cross(cw, cp));
      vec3 cv = normalize(cross(cu, cw));
      return mat3(cu, cv, cw);
    }

    // Thermal color spectrum: Deep Crimson -> Fiery Amber -> Golden Yellow -> Incandescent White
    vec3 blackHoleColor(float t, float doppler) {
      t = clamp(t, 0.0, 1.0);
      vec3 c0 = vec3(0.12, 0.015, 0.005);  // Outer dark ember
      vec3 c1 = vec3(0.85, 0.24, 0.03);   // Fiery orange-red
      vec3 c2 = vec3(1.0, 0.65, 0.18);    // Solar amber (#E5A93C)
      vec3 c3 = vec3(1.0, 0.92, 0.70);    // Radiant gold
      vec3 c4 = vec3(1.0, 1.0, 1.0);      // Incandescent core white

      vec3 col;
      if (t < 0.25) {
        col = mix(c0, c1, t / 0.25);
      } else if (t < 0.55) {
        col = mix(c1, c2, (t - 0.25) / 0.30);
      } else if (t < 0.82) {
        col = mix(c2, c3, (t - 0.55) / 0.27);
      } else {
        col = mix(c3, c4, (t - 0.82) / 0.18);
      }

      // Doppler shift: boost brightness and shift hotter toward white
      col *= doppler;
      if (doppler > 1.25) {
        col = mix(col, vec3(1.0, 0.98, 0.95) * doppler, clamp((doppler - 1.25) * 0.7, 0.0, 1.0));
      }
      return col;
    }

    void main() {
      // Normalized coordinates centered at origin [-aspect, aspect] x [-1, 1]
      vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);

      // Camera position with subtle interactive mouse tilt
      float camTiltY = 0.38 + u_mouse.y * 0.25;
      float camTiltX = -u_mouse.x * 0.35;
      vec3 ro = vec3(sin(camTiltX) * 4.2, camTiltY * 2.8, -cos(camTiltX) * 4.2);
      vec3 ta = vec3(0.0, -0.05, 0.0);

      mat3 cam = setCamera(ro, ta, 0.0);
      vec3 rd = cam * normalize(vec3(p, 1.85));

      // Raymarching variables in curved spacetime
      vec3 pos = ro;
      vec3 vel = rd;
      vec3 accColor = vec3(0.0);
      float accAlpha = 0.0;
      bool hitHorizon = false;
      float minRadius = 999.0;

      for (int i = 0; i < STEPS; i++) {
        float r2 = dot(pos, pos);
        float r = sqrt(r2);
        minRadius = min(minRadius, r);

        // Check if light ray penetrated the Event Horizon
        if (r < RS) {
          hitHorizon = true;
          break;
        }

        // Null Geodesic Acceleration (General Relativity bending approximation)
        // a = -1.5 * RS * pos * |v|^2 / r^5
        float invR5 = 1.0 / (r2 * r2 * r);
        vec3 gAcc = -1.5 * RS * pos * dot(vel, vel) * invR5;
        vel += gAcc * DT;
        vel = normalize(vel);

        vec3 nextPos = pos + vel * DT;

        // Check for Accretion Disk Crossing (y = 0 plane intersection)
        if (pos.y * nextPos.y < 0.0) {
          float tPlane = -pos.y / (nextPos.y - pos.y);
          vec3 hitP = pos + (nextPos - pos) * tPlane;
          float hitR = length(hitP.xz);

          if (hitR >= RIN && hitR <= ROUT) {
            // Normalized radial coordinate across disk [0, 1]
            float u = (hitR - RIN) / (ROUT - RIN);

            // Radial density profile (sharp inner peak, smooth exponential outer taper)
            float innerFalloff = smoothstep(0.0, 0.12, u);
            float outerFalloff = pow(1.0 - smoothstep(0.12, 1.0, u), 2.2);
            float density = innerFalloff * outerFalloff;

            // Keplerian orbital speed: faster near singularity, slower outside
            float hitPhi = atan(hitP.z, hitP.x);
            float omega = 1.6 * sqrt(RS / (hitR * hitR * hitR));
            float rotPhi = hitPhi - omega * u_time * 1.15;

            // Multi-scale procedural plasma filaments and turbulent swirls
            float f1 = sin(rotPhi * 5.0 + hitR * 14.0);
            float f2 = sin(rotPhi * 13.0 - hitR * 28.0 + u_time * 1.5);
            float f3 = sin(rotPhi * 29.0 + hitR * 65.0 - u_time * 2.8);
            float filament = 0.52 + 0.28 * f1 + 0.14 * f2 + 0.06 * f3;

            // Relativistic Doppler Beaming factor:
            // Matter moving toward the viewer is boosted exponentially in brightness
            vec3 orbitVelocity = normalize(vec3(-hitP.z, 0.0, hitP.x));
            float vDotD = dot(orbitVelocity, -vel);
            float doppler = pow(clamp(1.0 + 0.62 * vDotD, 0.25, 2.4), 3.2);

            // Thermal emission intensity
            float intensity = pow(density * filament, 0.85) * 1.6;
            vec3 diskCol = blackHoleColor(intensity, doppler);

            // Layered alpha accumulation
            float segmentAlpha = clamp(density * 1.35, 0.0, 1.0);
            accColor += diskCol * segmentAlpha * (1.0 - accAlpha);
            accAlpha += segmentAlpha * (1.0 - accAlpha);

            if (accAlpha >= 0.98) break;
          }
        }

        pos = nextPos;
      }

      // Razor-sharp photon ring right on the event horizon boundary
      if (!hitHorizon && minRadius > RS && minRadius < RS * 1.55) {
        float photonDist = abs(minRadius - RS * 1.045);
        float photonGlow = exp(-photonDist * 55.0) * 1.95;
        accColor += vec3(1.0, 0.92, 0.78) * photonGlow;
      }

      // If the ray plunged into the Event Horizon, force pure black shadow
      if (hitHorizon) {
        // Only allow disk light that was in FRONT of the event horizon
        accColor *= smoothstep(0.0, 0.1, accAlpha);
      }

      // Soft ambient gravitational lens glow around the black hole
      float centerDist = length(p);
      float ambientHalo = exp(-centerDist * 2.2) * 0.22;
      accColor += vec3(0.9, 0.45, 0.1) * ambientHalo;

      // Tone mapping & Gamma Correction (ACES filmic curve)
      vec3 finalCol = accColor / (accColor + vec3(0.85));
      finalCol = pow(finalCol, vec3(1.0 / 2.0));

      // Alpha channel for transparent HTML blending
      float finalAlpha = clamp(length(finalCol) * 1.4, 0.0, 1.0);
      gl_FragColor = vec4(finalCol, finalAlpha);
    }
  `;

  // Compile Shader Helper
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Black Hole Shader Compilation Error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Black Hole Program Link Error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Setup Fullscreen Quad Buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0,
  ]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
  const uTimeLoc = gl.getUniformLocation(program, 'u_time');
  const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');

  let mouseX = 0.0;
  let mouseY = 0.0;
  let targetMouseX = 0.0;
  let targetMouseY = 0.0;

  window.addEventListener('pointermove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) - 0.5;
    targetMouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = Math.floor(rect.width * dpr);
    const displayHeight = Math.floor(rect.height * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // Animation Loop
  const startTime = performance.now();

  function render() {
    resize();

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const currentTime = (performance.now() - startTime) * 0.001;

    gl.useProgram(program);
    gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(uTimeLoc, currentTime);
    gl.uniform2f(uMouseLoc, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
