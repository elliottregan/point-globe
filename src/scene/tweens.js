import * as TWEEN from 'tween.js';

export const scalePoint = (point) => new TWEEN.Tween(point.scale)
  .to(
    {
      x: 4,
      y: 4,
      z: 4,
    },
    1000,
  )
  .easing(TWEEN.Easing.Elastic.Out);

export const deflatePoint = (point) => new TWEEN.Tween(point.scale)
  .to(
    {
      x: 1,
      y: 1,
      z: 1,
    },
    400,
  )
  .easing(TWEEN.Easing.Sinusoidal.InOut);
