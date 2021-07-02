import { state } from './state';
import {
  scalePoint, scaleRing, deflatePoint, deflateRing, spinRing,
} from './tweens';

function getPointMarker(group) {
  return group.children.find((obj) => obj?.name.includes('point__Location'));
}

function getPointRing(group) {
  return group.children.find((obj) => obj?.name.includes('pointRing__Location'));
}

export function highlightPoint(locationMarkerGroup) {
  const pointObject = getPointMarker(locationMarkerGroup);
  const ringObject = getPointRing(locationMarkerGroup);

  state.highlightedPoint = pointObject;
  state.highlightedPointRing = ringObject;

  state.currentTweenAnimation = scalePoint(state.highlightedPoint).start();
  state.currentRingAnimation = scaleRing(ringObject).start();
  state.previousSpinAnimation = state.currentSpinAnimation;
  state.currentSpinAnimation = spinRing(ringObject).start();
}

export function clearHighlightedPoint() {
  if (state.highlightedPoint) {
    state.currentTweenAnimation.stop();
    state.currentRingAnimation.stop();

    deflatePoint(state.highlightedPoint).start();
    deflateRing(state.highlightedPointRing)
      .onComplete(() => {
        state.previousSpinAnimation.stop();
      })
      .start();

    state.highlightedPoint = null;
    state.highlightedPointRing = null;
  }
}
