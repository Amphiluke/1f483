import {$} from "./utils.mjs";

// Cache is used to reduce frequency of reading localStorage
let cache = {
  charPause: localStorage.getItem("charPause") === "yes",
  speed: Number(localStorage.getItem("speed")) || 2,
};

export let preferences = {
  get charPause() {
    return cache.charPause;
  },
  set charPause(enabled) {
    localStorage.setItem("charPause", enabled ? "yes" : "no");
    cache.charPause = !!enabled;
  },

  get speed() {
    return cache.speed;
  },
  set speed(value) {
    localStorage.setItem("speed", value.toString());
    cache.speed = Number(value);
  }
};

let preferencesForm = $(".paper");
let preferencesBtn = $(".preferences-button");
let charPauseCtrl = $("#char-pause");
let speedCtrl = $("#speed");

charPauseCtrl.checked = preferences.charPause;
speedCtrl.value = preferences.speed.toString();

preferencesBtn.addEventListener("click", () => {
  preferencesForm.classList.toggle("preferences-mode");
});

speedCtrl.addEventListener("change", () => {
  preferences.speed = speedCtrl.value;
});

$(".ticks", preferencesForm).addEventListener("click", ({target}) => {
  let {speed} = target.dataset;
  if (speed) {
    preferences.speed = speedCtrl.value = speed;
  }
});

charPauseCtrl.addEventListener("change", () => {
  preferences.charPause = charPauseCtrl.checked;
});

preferencesForm.addEventListener("submit", e => e.preventDefault());
