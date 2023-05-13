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

for (let char of sanitizeText("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z")) {
  if (char !== " ") {
    await sleep(1500);
  }
  await dancingMan.danceChar(char);
}
