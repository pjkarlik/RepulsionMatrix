// Particle Class
export default class Particle {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.dx = config.dx;
    this.dy = config.dy;
    this.color = config.color;
    this.radius = this.base = config.radius;
    this.repulsion = config.repulsion;
  }
  distance = (x1, y1, x2, y2) => {
    const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return distance;
  };
  update = (mouse) => {
    const angle = Math.atan2(this.x - mouse.x, this.y - mouse.y);
    const baseDiff = this.distance(mouse.x, mouse.y, this.x, this.y);
    const dist = this.repulsion / baseDiff;
    const size = ~~(Math.round(this.base + dist * 0.5));
    this.radius = size > 100 ? this.radius : size;
    this.x += ((Math.sin(angle) * dist) + (this.dx - this.x)) * 0.04;
    this.y += ((Math.cos(angle) * dist) + (this.dy - this.y)) * 0.04;
  };
}
