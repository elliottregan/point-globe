/* eslint-disable import/prefer-default-export */
export const TOTAL_ARCS = 20;

export const COLOR_1 = '#ef0018';

// If curve distance is too large for a given sphere geometry, the curves will clip into the sphere
export const CURVE_MAX_DISTANCE = 225;

export function onLocationClick(event, { locationMarker }) {
  const thisCard = document.getElementById(locationMarker.object.name);

  document.querySelectorAll('.location').forEach((card) => card.classList.remove('visible'));
  if (thisCard) {
    thisCard.classList.add('visible');
  }
}
