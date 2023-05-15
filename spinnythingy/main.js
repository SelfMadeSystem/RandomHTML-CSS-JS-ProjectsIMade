const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class SpinnyThingy {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.angle = 0;
    this.speed = 0.0125;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  update() {
    this.angle += this.speed;
  }
}

const spinnyThingy = new SpinnyThingy(100, 100, 50, 50, 'red');

function update() {
  spinnyThingy.update();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spinnyThingy.draw();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// setInterval(() => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
// , 1000);