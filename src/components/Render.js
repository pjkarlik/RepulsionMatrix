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
  distance = (x1, y1, x2, y2) => {
    const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return distance;
  };
  getHue = (i, k) => {
    const hue = (i * this.steps + k * this.steps / this.grid) * 0.8;
    return hue;
  }
  createPoints = () => {
    for (let i = 0; i < this.rows; i++) {
      for (let k = 0; k < this.cols; k++) {
        const hue = this.getHue(i, k);
        const point = new Particle({
          x: i * this.grid + this.grid / 2,
          y: k * this.grid + this.grid / 2,
          dx: i * this.grid + this.grid / 2,
          dy: k * this.grid + this.grid / 2,
          mouse: this.mouse,
          radius: this.grid * 0.03,
          color: hue,
          repulsion: 5000,
        });
        this.points.push(point);
      }
    }
  };

  draw = (config) => {
    this.surface.beginPath();
    const hsRadius = config.radius * 0.1;
    const lightness = ~~(60 - (50 / hsRadius));
    const saturation = ~~(100 - ~~((100 / hsRadius) * 0.01));
    this.surface.fillStyle = `hsl(${config.color}, ${saturation}%, ${lightness}% )`;
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
    this.surface.fillStyle = `rgba(15,15,15,${0.2})`;
    this.surface.fillRect(0, 0, this.viewport.width, this.viewport.height);

    // Draw pointer dot
    const mouse = this.mouse.pointer();
    const normalize = {
      i: ~~(mouse.x / this.grid),
      k: ~~(mouse.y / this.grid),
    };
    const hue = this.getHue(normalize.i, normalize.k);
    this.draw({
      x: mouse.x,
      y: mouse.y,
      color: hue,
      radius: 55,
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
