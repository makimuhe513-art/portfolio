// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Reveal content as it enters the viewport
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Back-to-top control and current year
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 500), { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();

// Decorative animated lightning: occasional branching bolts behind the content.
const canvas = document.getElementById('lightning');
const ctx = canvas.getContext('2d');
let w, h, dpr;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize); resize();
let bolt = null, flash = 0, nextStrike = performance.now() + 1800;
function makeBolt() {
  const x = w * (0.12 + Math.random() * 0.76);
  const points = [{x, y:0}];
  let cx = x, cy = 0;
  while (cy < h * (0.25 + Math.random() * 0.45)) {
    cy += 18 + Math.random() * 34;
    cx += (Math.random() - .5) * 65;
    points.push({x:cx, y:cy});
  }
  const branches = [];
  for (let i = 2; i < points.length - 1; i += 2) {
    if (Math.random() > .5) {
      let bx = points[i].x, by = points[i].y;
      const branch = [{x:bx,y:by}];
      for (let j=0;j<3;j++){ bx += (Math.random()-.5)*50; by += 15+Math.random()*25; branch.push({x:bx,y:by}); }
      branches.push(branch);
    }
  }
  return {points, branches};
}
function drawPath(points, alpha, width) {
  if (!points.length) return;
  ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => ctx.lineTo(p.x,p.y));
  ctx.strokeStyle = `rgba(255,65,78,${alpha})`; ctx.lineWidth = width;
  ctx.shadowColor = '#ff2638'; ctx.shadowBlur = 18; ctx.stroke(); ctx.shadowBlur = 0;
}
function animate(now) {
  ctx.clearRect(0,0,w,h);
  if (now > nextStrike && !bolt) {
    bolt = makeBolt(); flash = 1;
    nextStrike = now + 2400 + Math.random()*5000;
  }
  if (bolt) {
    const alpha = Math.max(0, flash);
    drawPath(bolt.points, alpha*.7, 1.5);
    bolt.branches.forEach(b => drawPath(b, alpha*.35, 1));
    flash -= .075;
    if (flash <= 0) bolt = null;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
