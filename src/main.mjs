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
  textContainer.textContent = text;
  let textNode = textContainer.firstChild;

  let pengingRange = new Range();
  pengingRange.setStart(textNode, 0);
  pengingRange.setEnd(textNode, text.length);

  if (CSS.highlights) {
    CSS.highlights.clear();
    CSS.highlights.set("pending-highlight", new Highlight(pengingRange));
  }

  currentDanceIterator = danceIterator(text);
  let lowerCaseText = text.toLowerCase();
  let lastPos = -1;
  for await (let char of currentDanceIterator) {
    lastPos = lowerCaseText.indexOf(char, lastPos + 1);
    pengingRange.setStart(textNode, lastPos + 1);
  }
  pengingRange.collapse();
}

let queryText = new URLSearchParams(location.search).get("text");
if (queryText) {
  $(".text-edit").value = queryText;
}

dance($(".text-edit").value);

$(".edit-button").addEventListener("click", () => {
  $(".text-form").classList.add("edit-mode");
  $(".text-edit").focus();
});

$(".text-form").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.classList.remove("edit-mode");
  dance($(".text-edit").value);
});
