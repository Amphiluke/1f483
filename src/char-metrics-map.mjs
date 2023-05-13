/**
 * @typedef {Object} CharMetrics
 * @property {Number} sl - Left shoulder polar angle
 * @property {Number} el - Left elbow polar angle
 * @property {Number} sr - Right shoulder polar angle
 * @property {Number} er - Right elbow polar angle
 * @property {Number} tl - Left thigh polar angle
 * @property {Number} kl - Left knee polar angle
 * @property {Number} hl - Left heel polar angle
 * @property {Number} tr - Right thigh polar angle
 * @property {Number} kr - Right knee polar angle
 * @property {Number} hr - Right heel polar angle
 * @property {Number} fp - Flip point polar angle
 */

/** @type {Map<String, CharMetrics>} */
export let charMetricsMap = new Map([
  ["a", {sl: 220, el: 220, sr: -40, er: -40, tl: 90, kl: 90, hl: 180, tr: 15, kr: 110, hr: 10, fp: 0}],
  ["b", {sl: 90, el: 270, sr: 90, er: -90, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["c", {sl: 220, el: 220, sr: 90, er: -90, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["d", {sl: 90, el: 270, sr: -40, er: -40, tl: 120, kl: 120, hl: 200, tr: 60, kr: 60, hr: -20, fp: 180}],
  ["e", {sl: 220, el: 220, sr: -40, er: -40, tl: 120, kl: 120, hl: 200, tr: 60, kr: 60, hr: -20, fp: 0}],
  ["f", {sl: 190, el: 290, sr: -40, er: -40, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["g", {sl: 90, el: 270, sr: -40, er: -40, tl: 120, kl: 120, hl: 200, tr: 60, kr: 60, hr: -20, fp: 180}],
  ["h", {sl: 220, el: 220, sr: -40, er: -40, tl: 90, kl: 90, hl: 180, tr: 90, kr: 90, hr: 0, fp: 0}],
  ["i", {sl: 220, el: 220, sr: -40, er: -40, tl: 180, kl: 180, hl: 270, tr: 90, kr: 90, hr: 0, fp: 0}],
  ["j", {sl: 90, el: 270, sr: -40, er: -40, tl: 160, kl: 70, hl: 155, tr: 90, kr: 90, hr: 0, fp: 0}],
  ["k", {sl: 135, el: 45, sr: -40, er: -40, tl: 120, kl: 120, hl: 200, tr: 60, kr: 60, hr: -20, fp: 0}],
  ["l", {sl: 190, el: 290, sr: 45, er: 135, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["m", {sl: 220, el: 220, sr: -40, er: -40, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["n", {sl: 135, el: 45, sr: -40, er: -40, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["o", {sl: 220, el: 220, sr: -40, er: -40, tl: 165, kl: 70, hl: 170, tr: 90, kr: 90, hr: 0, fp: 0}],
  ["p", {sl: 90, el: 270, sr: 90, er: -90, tl: 135, kl: 135, hl: 225, tr: 90, kr: 90, hr: 0, fp: 0}],
  ["q", {sl: 90, el: 270, sr: 90, er: -90, tl: 90, kl: 90, hl: 180, tr: 45, kr: 45, hr: -45, fp: 0}],
  ["r", {sl: 220, el: 220, sr: -40, er: -40, tl: 90, kl: 90, hl: 180, tr: 10, kr: 10, hr: -80, fp: 0}],
  ["s", {sl: 185, el: 276, sr: -5, er: -95, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["t", {sl: 220, el: 220, sr: -40, er: -40, tl: 120, kl: 120, hl: 200, tr: 60, kr: 60, hr: -20, fp: 180}],
  ["u", {sl: 220, el: 220, sr: -40, er: -40, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 180}],
  ["v", {sl: 90, el: 270, sr: 90, er: -90, tl: 180, kl: 180, hl: 270, tr: 90, kr: 90, hr: 0, fp: 0}],
  ["w", {sl: 90, el: 270, sr: 90, er: -90, tl: 90, kl: 90, hl: 180, tr: 0, kr: 0, hr: -90, fp: 0}],
  ["x", {sl: 90, el: 270, sr: -40, er: -40, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 180}],
  ["y", {sl: 90, el: 270, sr: -40, er: -40, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 0}],
  ["z", {sl: 220, el: 220, sr: 90, er: -90, tl: 160, kl: 70, hl: 155, tr: 20, kr: 110, hr: 25, fp: 180}],
]);
