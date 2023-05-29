import {Man} from "./man.mjs";
import {$, sanitizeText, sleep} from "./utils.mjs";
import {preferences} from "./preferences.mjs";

let dancingMan = new Man({container: $(".paper")});

export async function* danceIterator(text) {
  for (let char of sanitizeText(text)) {
    if (char === " ") {
      dancingMan.renderFlag(true);
      if (!preferences.charPause) {
        await sleep(500);
      }
    } else {
      if (preferences.charPause) {
        await sleep(750);
      }
      await dancingMan.danceChar(char);
      yield char;
    }
  }
}
