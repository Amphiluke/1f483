import {metrics, getMoveIterator, getFlagPos} from "./metrics.mjs";

let group = document.getElementById("man-group");
let head = document.getElementById("man-head");
let body = document.getElementById("man-body");
let flag = document.getElementById("man-flag");

function render() {
  head.setAttribute("cx", metrics.head.pos.x);
  head.setAttribute("cy", metrics.head.pos.y);
  body.setAttribute("d", `
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
  group.setAttribute("transform", `rotate(${metrics.flipPoint.angle} ${metrics.flipPoint.pos.x} ${metrics.flipPoint.pos.y})`);
}

function renderFlag(isVisible) {
  flag.setAttribute("visibility", isVisible ? "visible" : "hidden");
  if (!isVisible) {
    return;
  }
  let isFlipped = metrics.flipPoint.angle > 0;
  let [dx, dy] = isFlipped ? [-30, 50] : [30, -50];
  let { x, y } = getFlagPos();
  flag.setAttribute("d", `
    M ${x} ${y}
    L ${x} ${y + dy}
      ${x + dx} ${y + dy}
      ${x + dx} ${y + dy / 2}
      ${x} ${y + dy / 2}
    Z
  `);
}

function danceLetter(letter) {
  return new Promise(resolve => {
    let lowerCaseLetter = letter.toLowerCase();
    let moveIterator = getMoveIterator(lowerCaseLetter);
    requestAnimationFrame(function step() {
      let { done } = moveIterator.next();
      render();
      if (done) {
        renderFlag(letter !== lowerCaseLetter);
        setTimeout(resolve, 1500);
      } else {
        requestAnimationFrame(step);
      }
    });
    renderFlag(false);
  });
}

render();

for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  await danceLetter(letter);
}
