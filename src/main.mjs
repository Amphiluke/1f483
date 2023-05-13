import {Man} from "./man.mjs";
import {sanitizeText, sleep} from "./utils.mjs";

[...document.body.querySelectorAll("[data-dancing-men]")].forEach(container => {
  let text = sanitizeText(container.textContent);
  container.innerHTML = "";
  let man = null;
  for (let char of text) {
    if (char === " ") {
      man?.renderFlag(true);
    } else {
      man = new Man({container, char, size: 60});
      man.crop();
    }
  }
});

let dancingMan = new Man({container: document.querySelector(".paper")});

for (let char of sanitizeText("AB CD EF GH IJ KL MN OP QR ST UV WX YZ")) {
  if (char === " ") {
    dancingMan.renderFlag(true);
  } else {
    await sleep(1500);
    await dancingMan.danceChar(char);
  }
}
