import Particle from './Particle';
import Mouse from './Mouse';
import Canvas from './Canvas';
// Render Class //
export default class Render {
  constructor(element) {
    this.element = element;
    this.mouse = new Mouse();
    this.can = new Canvas();
    this.viewport = this.can.createCanvas('canvas');
    this.surface = this.viewport.surface;
    this.canvas = this.viewport.canvas;
    this.grid = 30;
    this.rows = ~~(this.viewport.width / this.grid);
    this.cols = ~~(this.viewport.height / this.grid);
    this.steps = 360 / this.rows;
    this.points = [];
    this.baseHue = 0;
    window.addEventListener('resize', this.resetCanvas);
    this.createPoints();
    this.renderLoop();
  }

  resetCanvas = () => {
    window.cancelAnimationFrame(this.animation);
    this.points = [];
    this.viewport = this.can.setViewport(this.canvas);
    this.surface = this.viewport.surface;
    this.canvas = this.viewport.canvas;
    this.rows = ~~(this.viewport.width / this.grid);
    this.cols = ~~(this.viewport.height / this.grid);
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
  /* eslint-disable no-nested-ternary */
  compare = (a, b) => {
    const result = (a.radius < b.radius) ? -1 : (a.radius > b.radius) ? 1 : 0;
    return result;
  };
  /* eslint-enable no-nested-ternary */
  renderLoop = () => {
    this.surface.globalCompositeOperation = 'source-over';
    this.surface.fillStyle = `rgba(75,75,75,${0.2})`;
    this.surface.fillRect(0, 0, this.viewport.width, this.viewport.height);

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
