// Schedule only requested frames; reset the clock after idle or suspension.
export function createRenderLoop(draw, {request = requestAnimationFrame, cancel = cancelAnimationFrame} = {}) {
 let pending = null, previous = null, enabled = true;
 function invalidate() {
  if (enabled && pending === null) pending = request(tick);
 }
 function tick(now) {
  pending = null;
  const dt = previous === null ? 0 : Math.min((now - previous) / 1000, .1);
  previous = now;
  if (draw(now, dt)) invalidate();
  if (pending === null) previous = null;
 }
 function setEnabled(value) {
  enabled = value;
  if (!value) {
   if (pending !== null) cancel(pending);
   pending = null;
   previous = null;
  } else invalidate();
 }
 return {invalidate, setEnabled};
}
