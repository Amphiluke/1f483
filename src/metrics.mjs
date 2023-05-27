import {polarToCartesian, minMax} from "./utils.mjs";
import {charMetricsMap} from "./char-metrics-map.mjs";

export class Metrics {
  head = {radius: 0, pos: null};
  shoulderLeft = {angle: 90, pos: null};
  elbowLeft = {angle: 90, distance: 0, pos: null};
  wristLeft = {distance: 0, pos: null};
  shoulderRight = {angle: 90, pos: null};
  elbowRight = {angle: 90, distance: 0, pos: null};
  wristRight = {distance: 0, pos: null};
  thighLeft = {angle: 90, pos: null};
  kneeLeft = {angle: 90, distance: 0, pos: null};
  heelLeft = {angle: 180, distance: 0, pos: null};
  toeLeft = {distance: 0, pos: null};
  thighRight = {angle: 90, pos: null};
  kneeRight = {angle: 90, distance: 0, pos: null};
  heelRight = {angle: 0, distance: 0, pos: null};
  toeRight = {distance: 0, pos: null};

  floor = {pos: null};
  flipPoint = {angle: 0, pos: null};

  constructor({char = "", size = 500}) {
    this.setSize(size);
    this.setChar(char);
  }

  setSize(size) {
    this.head.radius = size * 0.05;
    this.head.pos = {x: size * 0.5, y: size * 0.25};
    this.shoulderLeft.pos = {x: this.head.pos.x, y: size * 0.32};
    this.shoulderRight.pos = {...this.shoulderLeft.pos};
    this.thighLeft.pos = {x: this.head.pos.x, y: size * 0.55};
    this.thighRight.pos = {...this.thighLeft.pos};
    this.floor.pos = {y: size * 0.844};
    this.elbowLeft.distance = this.elbowRight.distance = this.wristLeft.distance = this.wristRight.distance = size * 0.14;
    this.kneeLeft.distance = this.kneeRight.distance = this.heelLeft.distance = this.heelRight.distance = size * 0.15;
    this.toeLeft.distance = this.toeRight.distance = size * 0.03;
    this.flipPoint.pos = {x: this.head.pos.x, y: (this.head.pos.y + this.thighLeft.pos.y + this.kneeLeft.distance + this.heelLeft.distance) * 0.5};
  }

  setChar(char) {
    let charMetrics = charMetricsMap.get(char);
    if (!charMetrics) {
      return;
    }
    this.shoulderLeft.angle = charMetrics.sl;
    this.elbowLeft.angle = charMetrics.el;
    this.shoulderRight.angle = charMetrics.sr;
    this.elbowRight.angle = charMetrics.er;
    this.thighLeft.angle = charMetrics.tl;
    this.kneeLeft.angle = charMetrics.kl;
    this.heelLeft.angle = charMetrics.hl;
    this.thighRight.angle = charMetrics.tr;
    this.kneeRight.angle = charMetrics.kr;
    this.heelRight.angle = charMetrics.hr;
    this.flipPoint.angle = charMetrics.fp;
    this.#updateMetrics();
  }

  getFlagPos() {
    let {head, wristLeft, wristRight, flipPoint} = this;
    let isFlipped = flipPoint.angle > 0;
    let [flagWrist, freeWrist] = isFlipped ? [wristLeft, wristRight] : [wristRight, wristLeft];
    if (Math.abs(freeWrist.pos.x - head.pos.x) > Math.abs(flagWrist.pos.x - head.pos.x)) {
      flagWrist = freeWrist;
    }
    return flagWrist.pos;
  }

  * getMoveIterator(char) {
    let {sl, el, sr, er, tl, kl, hl, tr, kr, hr, fp} = charMetricsMap.get(char);
    if (fp !== this.flipPoint.angle) {
      yield* this.rotate("flipPoint", fp, 5);
    }
    let limbIterators = [
      this.rotate("shoulderLeft", sl),
      this.rotate("elbowLeft", el),
      this.rotate("shoulderRight", sr),
      this.rotate("elbowRight", er),
      this.rotate("thighLeft", tl),
      this.rotate("kneeLeft", kl),
      this.rotate("heelLeft", hl),
      this.rotate("thighRight", tr),
      this.rotate("kneeRight", kr),
      this.rotate("heelRight", hr),
    ];
    while (!limbIterators.map(iterator => iterator.next()).every(({done}) => done)) {
      this.#updateMetrics();
      yield;
    }
  }

  * rotate(metric, toAngle, step = 2) {
    let metricProp = this[metric];
    if (metricProp.angle < toAngle) {
      while (metricProp.angle < toAngle) {
        metricProp.angle = Math.min(metricProp.angle + step, toAngle);
        yield;
      }
    } else {
      while (metricProp.angle > toAngle) {
        metricProp.angle = Math.max(metricProp.angle - step, toAngle);
        yield;
      }
    }
  }

  #updateMetrics() {
    let headPos = this.head.pos;
    let shoulderLeftPos = this.shoulderLeft.pos;
    let shoulderRightPos = this.shoulderRight.pos;
    let elbowLeftPos = polarToCartesian(this.shoulderLeft.angle, this.elbowLeft.distance, shoulderLeftPos);
    let elbowRightPos = polarToCartesian(this.shoulderRight.angle, this.elbowRight.distance, shoulderRightPos);
    let wristLeftPos = polarToCartesian(this.elbowLeft.angle, this.wristLeft.distance, elbowLeftPos);
    let wristRightPos = polarToCartesian(this.elbowRight.angle, this.wristRight.distance, elbowRightPos);
    let thighLeftPos = this.thighLeft.pos;
    let thighRightPos = this.thighRight.pos;
    let kneeLeftPos = polarToCartesian(this.thighLeft.angle, this.kneeLeft.distance, thighLeftPos);
    let kneeRightPos = polarToCartesian(this.thighRight.angle, this.kneeRight.distance, thighRightPos);
    let heelLeftPos = polarToCartesian(this.kneeLeft.angle, this.heelLeft.distance, kneeLeftPos);
    let heelRightPos = polarToCartesian(this.kneeRight.angle, this.heelRight.distance, kneeRightPos);
    let toeLeftPos = polarToCartesian(this.heelLeft.angle, this.toeLeft.distance, heelLeftPos);
    let toeRightPos = polarToCartesian(this.heelRight.angle, this.toeRight.distance, heelRightPos);
  
    let {min, max} = minMax(
      headPos.y,
      shoulderLeftPos.y,
      shoulderRightPos.y,
      elbowLeftPos.y,
      elbowRightPos.y,
      wristLeftPos.y,
      wristRightPos.y,
      thighLeftPos.y,
      thighRightPos.y,
      kneeLeftPos.y,
      kneeRightPos.y,
      heelLeftPos.y,
      heelRightPos.y,
      toeLeftPos.y,
      toeRightPos.y
    );
    let deltaY = this.floor.pos.y - max;
    this.head.pos = {x: headPos.x, y: headPos.y + deltaY};
    this.shoulderLeft.pos = {x: shoulderLeftPos.x, y: shoulderLeftPos.y + deltaY};
    this.shoulderRight.pos = {x: shoulderRightPos.x, y: shoulderRightPos.y + deltaY};
    this.elbowLeft.pos = {x: elbowLeftPos.x, y: elbowLeftPos.y + deltaY};
    this.elbowRight.pos = {x: elbowRightPos.x, y: elbowRightPos.y + deltaY};
    this.wristLeft.pos = {x: wristLeftPos.x, y: wristLeftPos.y + deltaY};
    this.wristRight.pos = {x: wristRightPos.x, y: wristRightPos.y + deltaY};
    this.thighLeft.pos = {x: thighLeftPos.x, y: thighLeftPos.y + deltaY};
    this.thighRight.pos = {x: thighRightPos.x, y: thighRightPos.y + deltaY};
    this.kneeLeft.pos = {x: kneeLeftPos.x, y: kneeLeftPos.y + deltaY};
    this.kneeRight.pos = {x: kneeRightPos.x, y: kneeRightPos.y + deltaY};
    this.heelLeft.pos = {x: heelLeftPos.x, y: heelLeftPos.y + deltaY};
    this.heelRight.pos = {x: heelRightPos.x, y: heelRightPos.y + deltaY};
    this.toeLeft.pos = {x: toeLeftPos.x, y: toeLeftPos.y + deltaY};
    this.toeRight.pos = {x: toeRightPos.x, y: toeRightPos.y + deltaY};
    this.flipPoint.pos.y = (min + max) / 2;
  }
}
