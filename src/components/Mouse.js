// Mouse Class //
export default class Mouse {
  constructor(element) {
    this.element = element || window;
    this.x = ~~(document.documentElement.clientWidth, window.innerWidth || 0) / 2;
    this.y = ~~(document.documentElement.clientHeight, window.innerHeight || 0) / 2;
    this.pointer = this.pointer.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.events = ['mouseenter', 'mousemove'];
    this.events.forEach((eventName) => {
      this.element.addEventListener(eventName, this.getCoordinates);
    });
  }
  getCoordinates(event) {
    event.preventDefault();
    this.x = event.pageX;
    this.y = event.pageY;
  }
  pointer() {
    return {
      x: this.x,
      y: this.y
    };
  }
}
