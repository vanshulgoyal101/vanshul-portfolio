// src/utils/magnetic.js

// Fraction of the cursor's offset from centre that a magnetic element follows.
export const FOLLOW_RATIO = 0.15;

// Pull grows linearly until the cursor sits `range` px from centre, then
// saturates — so large buttons and small icons both stay put under the pointer.
export const magneticOffset = (distanceX, distanceY, range) => {
  const x = distanceX * FOLLOW_RATIO;
  const y = distanceY * FOLLOW_RATIO;
  const travel = Math.hypot(x, y);
  const maxTravel = Math.abs(range) * FOLLOW_RATIO;

  if (travel <= maxTravel || travel === 0) return { x, y };

  const scale = maxTravel / travel;
  return { x: x * scale, y: y * scale };
};
