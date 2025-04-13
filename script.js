const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const fireworkSound = document.getElementById("fireworkSound");

let fireworks = [];
let isRunning = false;
let intervalId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height / 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.particles = [];
    this.exploded = false;
    this.velocity = -Math.random() * 3 - 4;
  }

  update() {
    if (!this.exploded) {
      this.y += this.velocity;
      if (this.y <= this.targetY) {
        this.explode();
        this.exploded = true;
        playSound();
      }
    }
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    this.particles.forEach(p => p.draw());
  }

  explode() {
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 5 + 1;
    this.angle = Math.random() * 2 * Math.PI;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.gravity = 0.05;
    this.alpha = 1;
    this.color = color;
  }

  update() {
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach(f => {
    f.update();
    f.draw();
  });

  fireworks = fireworks.filter(f => f.particles.length > 0 || !f.exploded);
}

function playSound() {
  fireworkSound.currentTime = 0;
  fireworkSound.play();
}

function startFireworks() {
  if (isRunning) return;

  intervalId = setInterval(() => {
    fireworks.push(new Firework());
  }, 800);

  startBtn.textContent = "Stop";
  isRunning = true;
}

function stopFireworks() {
  clearInterval(intervalId);
  startBtn.textContent = "Start";
  isRunning = false;
}

startBtn.addEventListener("click", () => {
  isRunning ? stopFireworks() : startFireworks();
});

animate();
