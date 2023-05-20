import {Man} from "./man.mjs";
import {$, $$, sanitizeText} from "./utils.mjs";
import {danceIterator} from "./dancing-man.mjs";

$$("[data-dancing-men]").forEach(container => {
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

let currentDanceIterator = null;

async function dance(text) {
  if (currentDanceIterator) {
    await currentDanceIterator.return();
  }
  let textContainer = $(".text-container");
  textContainer.innerHTML = `<span class="dance-complete"></span><span class="dance-pending">${text}</span>`;
  let danceComplete = $(".dance-complete");
  let dancePending = $(".dance-pending");
  currentDanceIterator = danceIterator(text);
  for await (let char of currentDanceIterator) {
    let pendingContent = dancePending.textContent;
    let charPos = pendingContent.toLowerCase().indexOf(char) + 1;
    danceComplete.textContent += pendingContent.slice(0, charPos);
    dancePending.textContent = pendingContent.slice(charPos);
  }
  if (dancePending.textContent.length) {
    danceComplete.textContent += dancePending.textContent;
    dancePending.textContent = "";
  }
}

dance($(".text-edit").value);

$(".edit-button").addEventListener("click", () => {
  $(".text-form").classList.add("edit-mode");
  $(".text-edit").focus();
});

$(".dance-button").addEventListener("click", () => {
  $(".text-form").classList.remove("edit-mode");
  dance($(".text-edit").value);
});
