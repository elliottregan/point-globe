/* eslint-disable import/prefer-default-export */
export const TOTAL_ARCS = 20;

export const COLOR_1 = '#ef0018';

export function onLocationClick(event, { locationMarker }) {
  const thisCard = document.getElementById(locationMarker.object.name);

  document.querySelectorAll('.location').forEach((card) => card.classList.remove('visible'));
  if (thisCard) {
    thisCard.classList.add('visible');
  }
}
