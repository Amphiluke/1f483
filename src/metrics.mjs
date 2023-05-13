import {polarToCartesian, minMax} from "./utils.mjs";
import {charMetricsMap} from "./char-metrics-map.mjs";

export let metrics = {
  head: {pos: {x: 250, y: 125}},
  shoulderLeft: {angle: 103, pos: {x: 250, y: 160}},
  elbowLeft: {angle: 90, distance: 70, pos: null},
  wristLeft: {distance: 70, pos: null},
  shoulderRight: {angle: 77, pos: {x: 250, y: 160}},
  elbowRight: {angle: 90, distance: 70, pos: null},
  wristRight: {distance: 70, pos: null},
  thighLeft: {angle: 105, pos: {x: 250, y: 275}},
  kneeLeft: {angle: 90, distance: 75, pos: null},
  heelLeft: {angle: 180, distance: 75, pos: null},
  toeLeft: {distance: 15, pos: null},
  thighRight: {angle: 75, pos: {x: 250, y: 275}},
  kneeRight: {angle: 90, distance: 75, pos: null},
  heelRight: {angle: 0, distance: 75, pos: null},
  toeRight: {distance: 15, pos: null},

  floor: {pos: {y: 422}},
  flipPoint: {angle: 0, pos: {x: 250, y: 261}},
};

export function getFlagPos() {
  let {head, wristLeft, wristRight, flipPoint} = metrics;
  let isFlipped = flipPoint.angle > 0;
  let [flagWrist, freeWrist] = isFlipped ? [wristLeft, wristRight] : [wristRight, wristLeft];
  if (Math.abs(freeWrist.pos.x - head.pos.x) > Math.abs(flagWrist.pos.x - head.pos.x)) {
    flagWrist = freeWrist;
  }
  return flagWrist.pos;
}

export function* getMoveIterator(letter) {
  let {sl, el, sr, er, tl, kl, hl, tr, kr, hr, fp} = charMetricsMap.get(letter);
  if (fp !== metrics.flipPoint.angle) {
    yield* rotate("flipPoint", fp, 5);
  }
  let limbIterators = [
    rotate("shoulderLeft", sl),
    rotate("elbowLeft", el),
    rotate("shoulderRight", sr),
    rotate("elbowRight", er),
    rotate("thighLeft", tl),
    rotate("kneeLeft", kl),
    rotate("heelLeft", hl),
    rotate("thighRight", tr),
    rotate("kneeRight", kr),
    rotate("heelRight", hr),
  ];
  while (!limbIterators.map(iterator => iterator.next()).every(({done}) => done)) {
    updateMetrics();
    yield;
  }
}

function* rotate(metric, toAngle, step = 1) {
  let increment = toAngle > metrics[metric].angle ? step : -step;
  while (Math.abs(toAngle - metrics[metric].angle) > step / 10) {
    metrics[metric].angle += increment;
    yield;
  }
  metrics[metric].angle %= 360;
}

function updateMetrics() {
  let headPos = metrics.head.pos;
  let shoulderLeftPos = metrics.shoulderLeft.pos;
  let shoulderRightPos = metrics.shoulderRight.pos;
  let elbowLeftPos = polarToCartesian(metrics.shoulderLeft.angle, metrics.elbowLeft.distance, shoulderLeftPos);
  let elbowRightPos = polarToCartesian(metrics.shoulderRight.angle, metrics.elbowRight.distance, shoulderRightPos);
  let wristLeftPos = polarToCartesian(metrics.elbowLeft.angle, metrics.wristLeft.distance, elbowLeftPos);
  let wristRightPos = polarToCartesian(metrics.elbowRight.angle, metrics.wristRight.distance, elbowRightPos);
  let thighLeftPos = metrics.thighLeft.pos;
  let thighRightPos = metrics.thighRight.pos;
  let kneeLeftPos = polarToCartesian(metrics.thighLeft.angle, metrics.kneeLeft.distance, thighLeftPos);
  let kneeRightPos = polarToCartesian(metrics.thighRight.angle, metrics.kneeRight.distance, thighRightPos);
  let heelLeftPos = polarToCartesian(metrics.kneeLeft.angle, metrics.heelLeft.distance, kneeLeftPos);
  let heelRightPos = polarToCartesian(metrics.kneeRight.angle, metrics.heelRight.distance, kneeRightPos);
  let toeLeftPos = polarToCartesian(metrics.heelLeft.angle, metrics.toeLeft.distance, heelLeftPos);
  let toeRightPos = polarToCartesian(metrics.heelRight.angle, metrics.toeRight.distance, heelRightPos);

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
  let deltaY = metrics.floor.pos.y - max;
  metrics.head.pos = {x: headPos.x, y: headPos.y + deltaY};
  metrics.shoulderLeft.pos = {x: shoulderLeftPos.x, y: shoulderLeftPos.y + deltaY};
  metrics.shoulderRight.pos = {x: shoulderRightPos.x, y: shoulderRightPos.y + deltaY};
  metrics.elbowLeft.pos = {x: elbowLeftPos.x, y: elbowLeftPos.y + deltaY};
  metrics.elbowRight.pos = {x: elbowRightPos.x, y: elbowRightPos.y + deltaY};
  metrics.wristLeft.pos = {x: wristLeftPos.x, y: wristLeftPos.y + deltaY};
  metrics.wristRight.pos = {x: wristRightPos.x, y: wristRightPos.y + deltaY};
  metrics.thighLeft.pos = {x: thighLeftPos.x, y: thighLeftPos.y + deltaY};
  metrics.thighRight.pos = {x: thighRightPos.x, y: thighRightPos.y + deltaY};
  metrics.kneeLeft.pos = {x: kneeLeftPos.x, y: kneeLeftPos.y + deltaY};
  metrics.kneeRight.pos = {x: kneeRightPos.x, y: kneeRightPos.y + deltaY};
  metrics.heelLeft.pos = {x: heelLeftPos.x, y: heelLeftPos.y + deltaY};
  metrics.heelRight.pos = {x: heelRightPos.x, y: heelRightPos.y + deltaY};
  metrics.toeLeft.pos = {x: toeLeftPos.x, y: toeLeftPos.y + deltaY};
  metrics.toeRight.pos = {x: toeRightPos.x, y: toeRightPos.y + deltaY};
  metrics.flipPoint.pos.y = (min + max) / 2;
}

updateMetrics();
