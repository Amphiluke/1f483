export function polarToCartesian(angle, radius, origin) {
  let deg = angle * Math.PI / 180;
  return {
    x: radius * Math.cos(deg) + origin.x,
    y: radius * Math.sin(deg) + origin.y,
  };
}

export function minMax(...numbers) {
  return {min: Math.min(...numbers), max: Math.max(...numbers)};
}

export function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export function sanitizeText(text) {
  return text.trim().toLowerCase().replace(/[^a-z]+/g, " ");
}

export function $(selector, parent = document.body) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document.body) {
  return [...parent.querySelectorAll(selector)];
}
