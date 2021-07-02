import { Vector3 } from 'three';

function latLongToVector3(lat, lon, r) {
  // http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs

  const phi = (lat * Math.PI) / 180;
  const theta = ((lon - 180) * Math.PI) / 180;

  const x = -r * Math.cos(phi) * Math.cos(theta);
  const y = r * Math.sin(phi);
  const z = r * Math.cos(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
}

function cartesian2polar(position) {
  const r = Math.sqrt(
    position.x * position.x
        + position.z * position.z
        + position.y * position.y,
  );
  let x = Math.round(position.x * 10000) / 10000;
  let z = Math.round(position.z * 10000) / 10000;

  if (Object.is(x, -0)) {
    x = 0;
  }
  if (Object.is(z, -0)) {
    z = 0;
  }

  return {
    r,
    phi: Math.acos(position.y / r),
    theta: Math.atan2(z, x),
  };
}

function polar2cartesian(polar) {
  return {
    x: polar.distance * Math.cos(polar.radians),
    z: polar.distance * Math.sin(polar.radians),
  };
}

function polar2canvas({ phi, theta }) {
  return {
    y: phi / Math.PI,
    x: (theta + 0.5 * Math.PI) / (2 * Math.PI),
  };
}

function getImageData(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
}

function getPixel(imagedata, x, y) {
  const position = (Math.round(x) + imagedata.width * Math.round(y)) * 4;
  const { data } = imagedata;
  return {
    r: data[position],
    g: data[position + 1],
    b: data[position + 2],
    a: data[position + 3],
  };
}

function getRandomArrayElements(arr, count = 1) {
  const shuffled = arr.slice(0); let i = arr.length; const min = i - count; let temp; let
    index;
  // eslint-disable-next-line no-plusplus
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function genRandDecimal(min, max, decimalPlaces = 1) {
  const rand = Math.random() * (max - min) + min;
  const power = decimalPlaces ** 10;
  return Math.floor(rand * power) / power;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param Number red - The red color value
 * @param Number green - The green color value
 * @param Number blue - The blue color value
 * @return Array - The HSL representation
 */
function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // eslint-disable-next-line default-case
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [h, s, l];
}

export {
  latLongToVector3,
  cartesian2polar,
  polar2canvas,
  polar2cartesian,
  getImageData,
  getPixel,
  getRandomArrayElements,
  genRandDecimal,
  rgbToHsl,
};
