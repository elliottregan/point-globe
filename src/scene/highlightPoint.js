import { state } from './state';
import { scalePoint, deflatePoint } from './tweens';

export function highlightPoint(pointObject) {
  state.highlightedPoint = pointObject;
  state.currentTweenAnimation = scalePoint(state.highlightedPoint).start();
}

export function clearHighlightedPoint() {
  if (state.highlightedPoint) {
    state.currentTweenAnimation.stop();
    deflatePoint(state.highlightedPoint).start();
    state.highlightedPoint = null;
  }
}
