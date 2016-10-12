import Particle from './Particle';
import Mouse from './Mouse';
// Render Class //
export default class Render {
  constructor(element) {
    this.element = element;
    this.mouse = new Mouse();
    this.canvas = this.createCanvas('canvas');
    this.grid = 30;
    this.rows = ~~(this.width / this.grid);
    this.cols = ~~(this.height / this.grid);
    this.steps = 360 / this.rows;
    this.points = [];
    this.baseHue = 0;
    window.addEventListener('resize', this.resetCanvas);
    this.createPoints();
    this.renderLoop();
  }

  setViewport = (element) => {
    const canvasElement = element;
    const width = ~~(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = ~~(document.documentElement.clientHeight, window.innerHeight || 0);
    this.width = width;
    this.height = height;
    canvasElement.width = this.width;
    canvasElement.height = this.height;
  };

  createCanvas = (name) => {
    const canvasElement = document.createElement('canvas');
    canvasElement.id = name;
    this.setViewport(canvasElement);
    this.element.appendChild(canvasElement);
    this.surface = canvasElement.getContext('2d');
    this.surface.scale(1, 1);
    return canvasElement;
  };

  resetCanvas = () => {
    window.cancelAnimationFrame(this.animation);
    this.points = [];
    this.setViewport(this.canvas);
    this.rows = ~~(this.width / this.grid);
    this.cols = ~~(this.height / this.grid);
    this.steps = 360 / this.rows;
    this.createPoints();
    this.renderLoop();
  };

  createPoints = () => {
    for (let i = 0; i < this.rows; i++) {
      for (let k = 0; k < this.cols; k++) {
        const hue = i * this.steps + k * this.steps;
        const point = new Particle({
          x: i * this.grid + this.grid / 2,
          y: k * this.grid + this.grid / 2,
          dx: i * this.grid + this.grid / 2,
          dy: k * this.grid + this.grid / 2,
          mouse: this.mouse,
          radius: k * this.steps * 0.04,
          color: `hsl(${hue}, 100%, 50%)`,
          repulsion: 5000,
        });
        this.points.push(point);
      }
    }
  };

  draw = (config) => {
    this.surface.beginPath();
    // this.surface.lineWidth = 0.5;
    this.surface.fillStyle = config.color;
    this.surface.arc(config.x, config.y, config.radius, 0, 2 * Math.PI, false);
    this.surface.fill();
  };

  compare = (a, b) => {
    if (a.radius < b.radius) {
      return -1;
    }
    if (a.radius > b.radius) {
      return 1;
    }
    return 0;
  };

  renderLoop = () => {
    this.surface.globalCompositeOperation = 'source-over';
    this.surface.fillStyle = `rgba(75,75,75,${0.2})`;
    this.surface.fillRect(0, 0, this.width, this.height);

    // Draw pointer dot
    const mouse = this.mouse.pointer();
    const hue = (mouse.x / this.grid) * this.steps + (mouse.y / this.grid) * this.steps;
    this.draw({
      x: mouse.x,
      y: mouse.y,
      color: `hsl(${hue}, 100%, 50%)`,
      radius: 35,
    });
    // Sort Array for Highest to lowest
    const pointArray = this.points.sort((a, b) => {
      const check = this.compare(a, b);
      return check;
    });
    // Draw Array
    for (let x = 0; x < this.points.length; x++) {
      const point = pointArray[x];
      point.update(mouse);
      this.draw(point);
    }

    this.animation = window.requestAnimationFrame(this.renderLoop);
  };
}
