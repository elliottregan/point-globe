import * as TWEEN from 'tween.js';
import {
  genRandDecimal,
} from '../../utilities';

export const drawCurveIn = (line) => new TWEEN.Tween(line)
  .to(
    {
      currentPoint: 200,
    },
    2000,
  )
  .delay(genRandDecimal(100, 5000))
  .easing(TWEEN.Easing.Cubic.Out)
  .onUpdate(() => {
    line.geometry.setDrawRange(0, line.currentPoint);
  });

export const drawCurveOut = (line) => new TWEEN.Tween(line)
  .to(
    {
      currentPoint: 0,
    },
    2000,
  )
  .easing(TWEEN.Easing.Cubic.Out)
  .onUpdate(() => {
    line.geometry.setDrawRange(0, line.currentPoint);
  });
