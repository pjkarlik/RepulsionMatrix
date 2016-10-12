// Particle Class
export default class Particle {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.dx = config.dx;
    this.dy = config.dy;
    this.color = config.color;
    this.radius = config.radius;
    this.repulsion = config.repulsion;
  }
  distance = (x1, y1, x2, y2) => {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
  };
  update = (mouse) => {
    const angle = Math.atan2(this.x - mouse.x, this.y - mouse.y);
    const dist = this.repulsion / this.distance(mouse.x, mouse.y, this.x, this.y);
    this.radius = ~~(Math.abs(dist) / 4);
    this.x += (Math.sin(angle) * dist) + (this.dx - this.x);
    this.y += (Math.cos(angle) * dist) + (this.dy - this.y);
  };
}
