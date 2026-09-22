// Phase 3 – Three.js Serum Droplet
// Lazy-loaded after LCP via requestIdleCallback in main.js

let renderer, scene, camera, droplet, microDroplets, animId;
let baseX = 0, baseY = 0, baseScale = 1;
let isVisible = true;
let uTime = { value: 0 };
let uAmp = { value: 0.18 };
let uFreq = { value: 1.4 };
let uDrop = { value: 1.0 };
let uMouse = { value: { x: 0, y: 0 } };

// FPS guard
let frameCount = 0, fpsStart = 0, qualified = false, lowPerf = false;

export async function initDroplet() {
  // Skip if no WebGL
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!ctx) return;
  } catch (_) { return; }

  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js').catch(() => ({ RoomEnvironment: null }));

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  document.body.prepend(canvas);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !lowPerf });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  // Environment
  if (RoomEnvironment) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    scene.environment = envTexture;
    pmrem.dispose();
  }

  // Warm edge light
  const edgeLight = new THREE.DirectionalLight(0xF4E4C0, 1.4);
  edgeLight.position.set(2, 3, 2);
  scene.add(edgeLight);
  const fill = new THREE.DirectionalLight(0xB8766A, 0.4);
  fill.position.set(-3, -1, 1);
  scene.add(fill);

  // Droplet geometry + shader noise
  const detail = window.innerWidth <= 768 ? 32 : 64;
  const geo = new THREE.IcosahedronGeometry(1, detail);

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xC9A96E),
    metalness: 0.35,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    iridescence: 0.38,
    iridescenceIOR: 1.6,
    transmission: window.innerWidth > 768 ? 0.18 : 0,
    ior: 1.45,
    thickness: 1.2,
  });

  // Vertex noise via onBeforeCompile
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.uniforms.uAmp = uAmp;
    shader.uniforms.uFreq = uFreq;
    shader.uniforms.uDrop = uDrop;
    shader.uniforms.uMouse = uMouse;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uAmp;
      uniform float uFreq;
      uniform float uDrop;
      uniform vec2 uMouse;

      // 3D Simplex-like noise
      vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
      vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
      vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.792842914-0.8537347209*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1./6.,1./3.);
        const vec4 D=vec4(0.,0.5,1.,2.);
        vec3 i=floor(v+dot(v,C.yyy));
        vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);
        vec3 l=1.-g;
        vec3 i1=min(g.xyz,l.zxy);
        vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;
        vec3 x2=x0-i2+C.yyy;
        vec3 x3=x0-D.yyy;
        i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
        float n_=.142857142857;
        vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);
        vec4 y_=floor(j-7.*x_);
        vec4 x=x_*ns.x+ns.yyyy;
        vec4 y=y_*ns.x+ns.yyyy;
        vec4 h=1.-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);
        vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.+1.;
        vec4 s1=floor(b1)*2.+1.;
        vec4 sh=-step(h,vec4(0.));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
        vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);
        vec3 p1=vec3(a0.zw,h.y);
        vec3 p2=vec3(a1.xy,h.z);
        vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
        m=m*m;
        return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      vec3 transformed = position;
      float n = snoise(position * uFreq + uTime * 0.38);
      // Drop shape: pull vertices toward tip based on uDrop
      float drop = uDrop * smoothstep(0.2, 1.0, (position.y + 1.) * 0.5) * 0.55;
      transformed += normal * (n * uAmp - drop);
      // Mouse ripple
      float mouseDist = length(vec2(position.x - uMouse.x, position.y - uMouse.y));
      transformed += normal * sin(mouseDist * 6. - uTime * 4.) * 0.018 * (1. - smoothstep(0., 1.2, mouseDist));
      `
    );
  };

  droplet = new THREE.Mesh(geo, mat);
  layoutDroplet();
  scene.add(droplet);

  // Micro droplets
  const microGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const microMat = new THREE.MeshPhysicalMaterial({ color: 0xC9A96E, metalness: 0.5, roughness: 0.1, transparent: true, opacity: 0.55 });
  const count = 24;
  microDroplets = new THREE.InstancedMesh(microGeo, microMat, count);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    dummy.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2 - 2);
    dummy.scale.setScalar(0.5 + Math.random());
    dummy.updateMatrix();
    microDroplets.setMatrixAt(i, dummy.matrix);
  }
  scene.add(microDroplets);

  // Mouse influence
  window.addEventListener('mousemove', (e) => {
    uMouse.value.x = (e.clientX / window.innerWidth - 0.5) * 2;
    uMouse.value.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    layoutDroplet();
  });

  // Pause on hidden
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) animate();
    else cancelAnimationFrame(animId);
  });

  // Entry animation: drop falls in (uDrop 1→0 over 1.5s)
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  // Delay to align with H1 line entrance
  setTimeout(() => {
    gsap.to(uDrop, { value: 0, duration: 1.5, ease: 'expo.out' });
    gsap.fromTo(droplet.position, { y: baseY + 3 }, { y: baseY, duration: 1.5, ease: 'expo.out' });
  }, 400);

  // Scroll choreography
  const heroSection = document.querySelector('.hero');
  const studioSection = document.getElementById('studio');
  const kontaktSection = document.getElementById('kontakt');

  if (heroSection) {
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        droplet.position.x = baseX + self.progress * 1.2;
        uAmp.value = 0.18 - self.progress * 0.08;
      },
    });
  }

  if (studioSection) {
    ScrollTrigger.create({
      trigger: studioSection,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
      onUpdate: (self) => {
        droplet.scale.setScalar(baseScale * (1 - self.progress * 0.3));
        const rose = new THREE.Color(0xB8766A);
        const gold = new THREE.Color(0xC9A96E);
        mat.color.lerpColors(gold, rose, self.progress * 0.5);
      },
    });
  }

  // Hide between leistungen and FAQ
  const leistungenEl = document.getElementById('leistungen');
  const faqEl = document.querySelector('[aria-labelledby="faq-h2"]');
  if (leistungenEl && faqEl) {
    ScrollTrigger.create({
      trigger: leistungenEl,
      start: 'top 30%',
      endTrigger: faqEl,
      end: 'bottom 70%',
      onEnter: () => { canvas.style.opacity = '0'; cancelAnimationFrame(animId); },
      onLeave: () => { canvas.style.opacity = '1'; animate(); },
      onEnterBack: () => { canvas.style.opacity = '0'; cancelAnimationFrame(animId); },
      onLeaveBack: () => { canvas.style.opacity = '1'; animate(); },
    });
    canvas.style.transition = 'opacity 0.6s ease';
  }

  // Kontakt: return to center, grow
  if (kontaktSection) {
    ScrollTrigger.create({
      trigger: kontaktSection,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: (self) => {
        droplet.position.x = 0;
        droplet.scale.setScalar(baseScale * (0.85 + self.progress * 0.45));
        droplet.position.z = -1 - self.progress * 0.5;
        uAmp.value = 0.12 + self.progress * 0.1;
      },
    });
  }

  animate();
  fpsStart = performance.now();
}

// Größe und Position an die Viewport-Breite koppeln – dieselben
// Schwellen wie die CSS-Media-Queries, damit Layout und 3D zusammenpassen.
function layoutDroplet() {
  if (!droplet) return;
  const w = window.innerWidth;
  if (w <= 768) {
    baseScale = 0.42; baseX = 1.15; baseY = -1.35;
  } else if (w <= 1024) {
    baseScale = 0.5; baseX = 1.6; baseY = 0.1;
  } else if (w <= 1440) {
    baseScale = 0.62; baseX = 1.9; baseY = 0.1;
  } else {
    baseScale = 0.72; baseX = 2.15; baseY = 0.1;
  }
  droplet.scale.setScalar(baseScale);
  droplet.position.set(baseX, baseY, droplet.position.z);
}

function animate() {
  animId = requestAnimationFrame(animate);
  if (!isVisible) return;

  uTime.value += 0.008;
  if (droplet) {
    droplet.rotation.y += 0.003;
    droplet.position.y = baseY + Math.sin(uTime.value * 0.7) * 0.06;
  }

  // FPS check for first 2s
  if (!qualified) {
    frameCount++;
    const elapsed = performance.now() - fpsStart;
    if (elapsed > 2000) {
      const fps = (frameCount / elapsed) * 1000;
      qualified = true;
      if (fps < 45) {
        lowPerf = true;
        // Reduce quality
        if (droplet) {
          const simpleGeo = new THREE.IcosahedronGeometry(1, 16);
          droplet.geometry.dispose();
          droplet.geometry = simpleGeo;
        }
        // Disable bloom (not implemented yet, guard here)
      }
    }
  }

  renderer.render(scene, camera);
}

// Auto-init when module is loaded
initDroplet().catch(() => {});
