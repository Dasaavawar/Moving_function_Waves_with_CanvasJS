const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
ctx.scale(2, 2);

class Point {
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 0.05;
    this.cur = index;
    this.max = Math.random() * 100 + 80;
  }
  update() {
    this.cur += this.speed;
    this.y = this.fixedY + (Math.sin(this.cur) * this.max);
  }

}

class Wave {
  constructor(index, totalPoints, color) {
    this.index = index;
    this.totalPoints = totalPoints;
    this.color = color;
    this.points = [];

  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.centerX = stageWidth / 2;
    this.centerY = stageHeight / 2;

    this.pointGap = this.stageWidth / (this.totalPoints - 1);

    this.init();
  }

  init() {
    this.points = [];
    for (let i = 0; i < this.totalPoints; i++) {
      const point = new Point(
        this.index + i,
        this.pointGap * i,
        this.centerY,
      );
      this.points[i] = point;
    }

  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#ff0000';
    let prevX = this.points[0].x;
    let prevY = this.points[0].y;
    ctx.moveTo(prevX, prevY);
    for (let i = 1; i < this.totalPoints; i++) {
      if (i < this.totalPoints - 1) {
        this.points[i].update();
      }
      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      ctx.lineTo(cx, cy);
      ctx.quadraticCurveTo(prevX, prevY, cx, cy);

      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    ctx.lineTo(prevX, prevY);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(0, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.points[0].y);
    
    ctx.fill();
    ctx.closePath();

  }
}

class WaveGroup {
  constructor() {
    this.totalWaves = 3;
    this.totalPoints = 6;
    this.color = ['rgba(0, 199, 235, 0.4)', 'rgba(0, 146, 199, 0.4)', 'rgba(0, 87, 158, 0.4)'];
    this.waves = [];
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = new Wave(
        i,
        this.totalPoints,
        this.color[i],
      );
      this.waves[i] = wave;
    }
  }

  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.resize(stageWidth, stageHeight);
    }
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  }

  draw(ctx) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.draw(ctx);
    }
  }

}

class init {
  constructor() {
    this.waveGroup = new WaveGroup();
    this.waveGroup.resize(window.innerWidth, window.innerHeight);

    this.animate = this.animate.bind(this); // bind `this` keyword here

    // Start the animation loop
    this.resize();
    this.animate();
  }

  animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;

    // Update and draw the wave
    this.waveGroup.draw(ctx);

    // Request the next frame of the animation
    requestAnimationFrame(this.animate);
  }

  resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.waveGroup.resize(canvas.width, canvas.height);
  }
  
}

const animation = new init();

window.addEventListener('resize',
  function () {
    animation.resize();
  })

