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
