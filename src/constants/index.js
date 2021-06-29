/* eslint-disable import/prefer-default-export */
export const COLOR_1 = '#ef0018';

/**
 * Arc Point Distance at which Arc Length should begin increasing linearly to account for Arcs with
 * exceptionally large distance (ex: across globe, 180 degrees).
 *
 * @note This dynamically adds scaling extra height to Arc Mid-Points when the distance between the
 * Two Arc Points is > ARC_DISTANCE_OFFSET, which prevents large Arcs from clipping into the Globe.
 *
 * @note The final Arc Length Offset is: ARC_LENGTH_OFFSET + ((distance - ARC_DISTANCE_OFFSET) * 2)
 */
export const ARC_DISTANCE_OFFSET = 225;

/**
 * Minimum Arc Length to be Added to Calculated Arc Length (based on distance)
 *
 * @note This adds extra height to all Arc Mid-Points by increasing the total length of a given Arc
 * without changing the distance between the two points.
 */
export const ARC_LENGTH_OFFSET = 10;

/**
 * Maximum Distance Allowed between Two Arc Points in order to draw an Arc
 *
 * @note This will prevent Arcs from being drawn between points with distance > ARC_MAX_DISTANCE
 */
export const ARC_MAX_DISTANCE = 300;

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
