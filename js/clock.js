const RADIANS = Math.PI * 2.0;
const DAY_MILLIS = 86400000;
const DAY_FRACTION = 1.0 / DAY_MILLIS;
// Tropical year in 1990
const YEAR_MILLIS = 31556925.9747 * 1000;
const YEAR_FRACTION = 1.0 / YEAR_MILLIS;

function rotate(x, y, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: (cos * x) + (sin * y),
    y: (cos * y) - (sin * x)
  };
}

function describeArc(radius, startAngle, endAngle){
  const start = rotate(radius, 0, startAngle);
  const end = rotate(radius, 0, endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

function arcs(id, r, normal) {
  const id_elapsed = `${id}-elapsed`;
  const id_remaining = `${id}-remaining`;
  const elapsed = (normal * RADIANS);
  
  document.getElementById(id_elapsed)
    .setAttribute(
      "d",
      describeArc(r, 0, elapsed, 1)
    );
  
  document.getElementById(id_remaining)
    .setAttribute(
      "d",
      describeArc(r, elapsed, RADIANS, 1)
    );
}

function updateNormalTime () {
  let millis = Date.now();
  
  let normal_time = (millis % DAY_MILLIS) * DAY_FRACTION;
  arcs("clock", 45, normal_time);
  let normal_time_string = normal_time.toString().padEnd(18, '0');
  document.getElementById("clock-normal").textContent = normal_time_string;

  let normal_date = (millis % YEAR_MILLIS) * YEAR_FRACTION;
  arcs("calendar", 45, normal_date);
  let normal_date_string = normal_date.toString().padEnd(19, '0') + '⟲';
  document.getElementById("calendar-normal").textContent  = normal_date_string;

  requestAnimationFrame(updateNormalTime);
}

window.addEventListener("load", updateNormalTime, false);
