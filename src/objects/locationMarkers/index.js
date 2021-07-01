import * as THREE from 'three';
// import * as TWEEN from 'tween.js';
import { BRAND_COLORS, COLOR_1 } from '../../constants';
import {
  getRandomArrayElements,
  latLongToVector3,
} from '../../utilities';

const GLOBE_RADIUS = 150;

function drawPoint(lat, lng, r) {
  const position = latLongToVector3(lat, lng, GLOBE_RADIUS);
  const color = getRandomArrayElements(BRAND_COLORS)[0];
  console.log(color);
  const pointGeometry = new THREE.SphereGeometry(r, 32, 32);
  const pointMaterial = new THREE.MeshBasicMaterial({
    color,
    opacity: 1,
  });

  const point = new THREE.Mesh(pointGeometry, pointMaterial);
  point.position.set(position.x, position.y, position.z);
  point.lookAt(new THREE.Vector3(0, 0, 0));

  return point;
}

function drawRing(lat, lng, r) {
  const position = latLongToVector3(lat, lng, GLOBE_RADIUS);
  const pointRingGeometry = new THREE.RingGeometry(r + 2.8, r + 3, 16);
  const pointRingMaterial = new THREE.MeshBasicMaterial({
    color: COLOR_1,
    side: THREE.DoubleSide,
  });

  const pointRing = new THREE.Mesh(pointRingGeometry, pointRingMaterial);
  pointRing.position.set(position.x, position.y, position.z);
  // pointRing.scale.set(0.01, 0.01, 0.01);
  pointRing.lookAt(new THREE.Vector3(0, 0, 0));

  // new TWEEN.Tween(pointRing.scale)
  //   .to(
  //     {
  //       x: 1,
  //       y: 1,
  //       z: 1,
  //     },
  //     1500,
  //   )
  //   .delay(i * 350 + 1500)
  //   .easing(TWEEN.Easing.Cubic.Out)
  //   .start();

  return pointRing;
}

function drawHitbox(lat, lng, r, i) {
  const position = latLongToVector3(lat, lng, GLOBE_RADIUS);
  const hitboxGeometry = new THREE.SphereGeometry(r + 4.5, 8, 8);
  const hitboxMaterial = new THREE.MeshBasicMaterial({
    color: '#00ff00',
    opacity: 0,
    transparent: true,
  });

  const hitBox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);

  hitBox.position.set(position.x, position.y, position.z);
  hitBox.name = `Location__${i}`;

  return hitBox;
}

export default function collectPoints(locationData) {
  const points = [];
  const rings = [];
  const hitboxes = [];
  for (let i = 0; i < locationData.features.length; i += 1) {
    const lng = locationData.features[i].geometry.coordinates[0];
    const lat = locationData.features[i].geometry.coordinates[1];
    const locationMarker = drawPoint(lat, lng, 1, i);
    const markerRing = drawRing(lat, lng, 1, i);
    const hitbox = drawHitbox(lat, lng, 1, i);
    points.push(locationMarker);
    rings.push(markerRing);
    hitboxes.push(hitbox);
  }
  return [points, rings, hitboxes];
}
