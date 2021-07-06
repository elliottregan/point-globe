/* eslint-disable import/prefer-default-export */

/**
 * Arc Color (RGB) that the start of the Arc should be drawn with.
 *
 * @note If set to a different color than ARC_COLOR_END, it will apply a Smooth Gradient to the
 * Arc Color, easing between the two colors (BEGIN and END).
 */
export const ARC_COLOR_BEGIN = [255, 0, 0]; // Red

/**
 * Arc Color (RGB) that the end of the Arc should be drawn with.
 *
 * @note If set to a different color than ARC_COLOR_BEGIN, it will apply a Smooth Gradient to the
 * Arc Color, easing between the two colors (BEGIN and END).
 */
export const ARC_COLOR_END = [140, 0, 255]; // Purple

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
export const ARC_MAX_DISTANCE = 250;

export const COLOR_1 = '#ef0018';
export const BRAND_COLORS = [COLOR_1, '#DB1F3B', '#CE1D41', '#C11B47', '#B41A4D', '#A71853', '#9A1659', '#8C1460', '#791269'];

export const GLOBE_DOT_MIN_OPACITY = 0.125;
export const GLOBE_DOT_RADIUS = 2.9;

/**
 * Amount of Time, in milliseconds, before Auto-Selection of Location Markers should begin after no
 * User-Selection has occurred.
 *
 * @note This also determines the amount of time between each Auto-Selection of Location Markers
 * once "autoplay" has begun.
 */
export const MARKER_AUTO_SELECT_DELAY = 1000;

/**
 * The Maximum Distance from the Camera at which Auto-Selected Location Markers can be chosen.
 */
export const MARKER_AUTO_SELECT_MAX_DISTANCE = 0.75;

export const TOTAL_ARCS = 20;

export function onLocationClick(event, { locationId }) {
  const thisCard = document.getElementById(locationId);

  document.querySelectorAll('.location').forEach((card) => card.classList.remove('visible'));
  if (thisCard) {
    thisCard.classList.add('visible');
  }
}
