import {Man} from "./man.mjs";
import {$, sanitizeText, sleep} from "./utils.mjs";

let dancingMan = new Man({container: $(".paper")});

export async function* danceIterator(text) {
  for (let char of sanitizeText(text)) {
    if (char === " ") {
      dancingMan.renderFlag(true);
    } else {
      await sleep(750);
      await dancingMan.danceChar(char);
      yield char;
    }
  }
}
