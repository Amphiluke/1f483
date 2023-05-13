import {Metrics} from "./metrics.mjs";
import {minMax} from "./utils.mjs";

export class Man {
  #svg;
  #group;
  #head;
  #body;
  #flag;

  #metrics;

  constructor({container, char = "", size = 500}) {
    this.#metrics = new Metrics({char, size});
    this.#prepareSVG(container, size);
    this.render();
  }

  #prepareSVG(container, size) {
    let strokeWidth = Math.max(size * 0.02, 3.5);
    container.insertAdjacentHTML("beforeend", `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="man">
        <g class="man-group">
          <circle cx="0" cy="0" r="${this.#metrics.head.radius}" class="man-head" fill="currentColor"/>
          <path d="M 0 0" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" fill="none" class="man-body"/>
          <path d="M 0 0" stroke="#b00" stroke-width="${strokeWidth * 0.6}" fill="#b00" class="man-flag"/>
        </g>
      </svg>`.trim());
    this.#svg = container.lastChild;
    this.#group = this.#svg.querySelector(".man-group");
    this.#head = this.#svg.querySelector(".man-head");
    this.#body = this.#svg.querySelector(".man-body");
    this.#flag = this.#svg.querySelector(".man-flag");
  }

  render() {
    let metrics = this.#metrics;
    this.#head.setAttribute("cx", metrics.head.pos.x);
    this.#head.setAttribute("cy", metrics.head.pos.y);
    this.#body.setAttribute("d", `
      M ${metrics.head.pos.x} ${metrics.head.pos.y}
      L ${metrics.thighLeft.pos.x} ${metrics.thighLeft.pos.y}
        ${metrics.kneeLeft.pos.x} ${metrics.kneeLeft.pos.y}
        ${metrics.heelLeft.pos.x} ${metrics.heelLeft.pos.y}
        ${metrics.toeLeft.pos.x} ${metrics.toeLeft.pos.y}
      M ${metrics.thighRight.pos.x} ${metrics.thighRight.pos.y}
      L ${metrics.kneeRight.pos.x} ${metrics.kneeRight.pos.y}
        ${metrics.heelRight.pos.x} ${metrics.heelRight.pos.y}
        ${metrics.toeRight.pos.x} ${metrics.toeRight.pos.y}
      M ${metrics.shoulderLeft.pos.x} ${metrics.shoulderLeft.pos.y}
      L ${metrics.elbowLeft.pos.x} ${metrics.elbowLeft.pos.y}
        ${metrics.wristLeft.pos.x} ${metrics.wristLeft.pos.y}
      M ${metrics.shoulderRight.pos.x} ${metrics.shoulderRight.pos.y}
      L ${metrics.elbowRight.pos.x} ${metrics.elbowRight.pos.y}
        ${metrics.wristRight.pos.x} ${metrics.wristRight.pos.y}
    `);
    this.#group.setAttribute("transform", `rotate(${metrics.flipPoint.angle} ${metrics.flipPoint.pos.x} ${metrics.flipPoint.pos.y})`);
  }

  renderFlag(isVisible) {
    this.#flag.setAttribute("visibility", isVisible ? "visible" : "hidden");
    if (!isVisible) {
      return;
    }
    let isFlipped = this.#metrics.flipPoint.angle > 0;
    let dx = this.#metrics.elbowLeft.distance / 2;
    let dy = -dx * 1.75;
    if (isFlipped) {
      dx = -dx;
      dy = -dy;
    }
    let {x, y} = this.#metrics.getFlagPos();
    this.#flag.setAttribute("d", `
      M ${x} ${y}
      L ${x} ${y + dy}
        ${x + dx} ${y + dy}
        ${x + dx} ${y + dy / 2}
        ${x} ${y + dy / 2}
      Z
    `);
  }

  danceChar(char) {
    return new Promise(resolve => {
      this.renderFlag(false);
      let moveIterator = this.#metrics.getMoveIterator(char);
      let stepFn = () => {
        let {done} = moveIterator.next();
        this.render();
        if (done) {
          resolve();
        } else {
          requestAnimationFrame(stepFn);
        }
      };
      requestAnimationFrame(stepFn);
    });
  }

  crop() {
    let metrics = this.#metrics;
    let {min, max} = minMax(
      metrics.elbowLeft.pos.x,
      metrics.wristLeft.pos.x,
      metrics.elbowRight.pos.x,
      metrics.wristRight.pos.x,
      metrics.kneeLeft.pos.x,
      metrics.heelLeft.pos.x,
      metrics.toeLeft.pos.x,
      metrics.kneeRight.pos.x,
      metrics.heelRight.pos.x,
      metrics.toeRight.pos.x
    );
    let padding = Math.ceil(this.#svg.viewBox.baseVal.width * 0.1);
    let width = Math.ceil(max - min + padding * 2);
    if (this.#svg.width.baseVal.value > width) {
      this.#svg.setAttribute("width", width);
      this.#svg.setAttribute("viewBox", `${min - padding} 0 ${width} ${this.#svg.viewBox.baseVal.height}`);
    }
  }
}
