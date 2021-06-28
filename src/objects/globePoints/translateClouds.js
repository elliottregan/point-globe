import { GLOBE_DOT_MIN_OPACITY } from '../../constants';

export default function translateClouds(geometry) {
  const alphas = geometry.attributes.alpha;
  const { count } = alphas;

  for (let i = 0; i < count; i += 1) {
    // dynamically change alphas
    alphas.array[i] -= 0.01;
    if (alphas.array[i] < GLOBE_DOT_MIN_OPACITY) {
      alphas.array[i] = Math.random() / 2;
    }
  }
  alphas.needsUpdate = true; // important for shader updates!
}
