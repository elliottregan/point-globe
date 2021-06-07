/* eslint-disable no-use-before-define */
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import {
  polar2canvas,
  getPixel,
} from '../utilities';

const testUrl = '/public/images/checker-test.png';
const cloudsUrl = '/public/images/noise.png';
const cutoutUrl = '/public/images/earthspec1k.jpg';
const textureLoader = new THREE.TextureLoader();

export function drawDots(maskImageData) {
  // Create 60000 tiny dots and spiral them around the sphere.
  const DOT_COUNT = 40000;

  const cloudsAlpha = textureLoader.load(cloudsUrl);

  const vector = new THREE.Vector3();
  const positions = [];
  for (let i = DOT_COUNT; i >= 0; i -= 1) {
    // A hexagon with a radius of 2 pixels looks like a circle
    const r = 150;
    const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
    const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;

    // Pass the angle between this dot an the Y-axis (phi)
    // Pass this dot’s angle around the y axis (theta)
    // Scale each position by 600 (the radius of the globe)
    vector.setFromSphericalCoords(r, phi, theta);

    const polarCoords = {
      r,
      phi,
      theta: theta % (2 * Math.PI),
    };

    const samplePosition = polar2canvas(polarCoords);
    samplePosition.x *= maskImageData.width;
    samplePosition.y *= maskImageData.height;

    const pixelData = getPixel(
      maskImageData,
      samplePosition.x,
      samplePosition.y,
    );

    if (Object.values(pixelData).reduce((a, b) => a + b) <= 255 * 3) {
      const dotGeometry = new THREE.CircleBufferGeometry(0.3, 8);
      dotGeometry.lookAt(vector);

      // Move the dot to the newly calculated position
      dotGeometry.translate(vector.x, vector.y, vector.z);
      dotGeometry.renderOrder = 1;

      positions.push(dotGeometry);
    }
  }

  const globalGeometry = BufferGeometryUtils.mergeBufferGeometries(
    positions,
  );

  const dotMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    // opacity: 0.6,
    transparent: true,
    // map: cloudsAlpha,
    alphaMap: cloudsAlpha,
  });

  animate(dotMaterial, 1);

  dotMaterial.alphaMap.magFilter = THREE.NearestFilter;
  dotMaterial.alphaMap.wrapT = THREE.RepeatWrapping;
  dotMaterial.alphaMap.repeat.y = 1;

  return new THREE.Mesh(globalGeometry, dotMaterial);
}

function translateClouds(material, time) {
  // eslint-disable-next-line no-param-reassign
  material.alphaMap.offset.y = time * 0.0002;
}

function animate(material, time) {
  translateClouds(material, time);
  requestAnimationFrame(() => {
    animate(material, time);
  });
  // eslint-disable-next-line no-param-reassign
  time += 1;
}

export function drawCurve(a, b) {
  const distance = a.clone().sub(b).length();

  const mid = a.clone().lerp(b, 0.5);
  const midLength = mid.length();
  mid.normalize();
  mid.multiplyScalar(midLength + distance * 0.25);

  const normal = new THREE.Vector3().subVectors(a, b);
  normal.normalize();

  const midStart = mid
    .clone()
    .add(normal.clone().multiplyScalar(distance * 0.25));
  const midEnd = mid
    .clone()
    .add(normal.clone().multiplyScalar(distance * -0.25));

  const splineCurveA = new THREE.CubicBezierCurve3(a, a, midStart, mid);
  const splineCurveB = new THREE.CubicBezierCurve3(mid, midEnd, b, b);

  let points = splineCurveA.getPoints(100);
  points = points.splice(0, points.length - 1);
  points = points.concat(splineCurveB.getPoints(100));
  points.push(new THREE.Vector3(0, 0, 0));

  const lineGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(points.length * 3);
  for (let ii = 0; ii < points.length; ii += 1) {
    positions[ii * 3 + 0] = points[ii].x;
    positions[ii * 3 + 1] = points[ii].y;
    positions[ii * 3 + 2] = points[ii].z;
  }
  lineGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
  );
  lineGeometry.setDrawRange(0, 0);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color('#ff3600'),
    linewidth: 8,
    opacity: 0.75,
    transparent: true,
  });

  const line = new THREE.Line(lineGeometry, lineMaterial);
  line.currentPoint = 0;
  return line;
}
