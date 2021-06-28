/* eslint-disable import/prefer-default-export */
export const TOTAL_ARCS = 20;

export const COLOR_1 = '#ef0018';

export const GLOBE_DOT_MIN_OPACITY = 0.125;
export const GLOBE_DOT_RADIUS = 2.9;

export function onLocationClick(event, { locationMarker }) {
  const thisCard = document.getElementById(locationMarker.object.name);

  document.querySelectorAll('.location').forEach((card) => card.classList.remove('visible'));
  if (thisCard) {
    thisCard.classList.add('visible');
  }
}
