/* eslint-disable import/prefer-default-export */
export const COLOR_1 = '#ef0018';

/**
 * Maximum Length of Globe Curves that are drawn between Globe Points
 *
 * @note If curve distance is too large for a given sphere, the curves will clip into the sphere
 */
export const CURVE_MAX_DISTANCE = 225;

export const GLOBE_DOT_MIN_OPACITY = 0.125;
export const GLOBE_DOT_RADIUS = 2.9;

export const TOTAL_ARCS = 20;

export function onLocationClick(event, { locationMarker }) {
  const thisCard = document.getElementById(locationMarker.object.name);

  document.querySelectorAll('.location').forEach((card) => card.classList.remove('visible'));
  if (thisCard) {
    thisCard.classList.add('visible');
  }
}
