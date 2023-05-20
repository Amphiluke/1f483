import {Man} from "./man.mjs";
import {sanitizeText, sleep} from "./utils.mjs";

[...document.body.querySelectorAll("[data-dancing-men]")].forEach(container => {
  let text = sanitizeText(container.textContent);
  let size = Number(container.dataset.dancingMen);
  container.innerHTML = "";
  let man = null;
  for (let char of text) {
    if (char === " ") {
      man?.renderFlag(true);
    } else {
      man = new Man({container, char, size});
      man.crop();
    }
  }
});

let dancingMan = new Man({container: document.body.querySelector(".paper")});
let danceComplete = document.body.querySelector(".dance-complete");
let dancePending = document.body.querySelector(".dance-pending");

for (let char of sanitizeText(dancePending.textContent)) {
  if (char === " ") {
    dancingMan.renderFlag(true);
  } else {
    await sleep(750);
    await dancingMan.danceChar(char);
    let pendingContent = dancePending.textContent;
    let charPos = pendingContent.toLowerCase().indexOf(char) + 1;
    danceComplete.textContent += pendingContent.slice(0, charPos);
    dancePending.textContent = pendingContent.slice(charPos);
  }
}
