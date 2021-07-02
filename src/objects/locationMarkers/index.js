import * as THREE from 'three';
// import * as TWEEN from 'tween.js';
import { BRAND_COLORS, COLOR_1 } from '../../constants';
import {
  getRandomArrayElements,
  latLongToVector3,
} from '../../utilities';

const GLOBE_RADIUS = 150;

function drawPoint(lat, lng, r, i, color = COLOR_1) {
  const position = latLongToVector3(lat, lng, GLOBE_RADIUS);
  const pointGeometry = new THREE.SphereGeometry(r, 32, 32);
  const pointMaterial = new THREE.MeshBasicMaterial({
    color,
    opacity: 1,
  });

  const point = new THREE.Mesh(pointGeometry, pointMaterial);
  point.position.set(position.x, position.y, position.z);
  point.name = `point__Location__${i}`;
  point.lookAt(new THREE.Vector3(0, 0, 0));

  return point;
}

function drawRing(lat, lng, r, i, color = COLOR_1) {
  const position = latLongToVector3(lat, lng, GLOBE_RADIUS);
  const ringRadius = r + 5;
  const ringStroke = 0.8;
  const pointRingGeometry = new THREE.RingGeometry(
    ringRadius,
    ringRadius + ringStroke,
    32,
    1,
    0,
    4,
  );
  const pointRingMaterial = new THREE.MeshBasicMaterial({
    color,
    opacity: 0,
    transparent: true,
    // renderOrder: 2,
    depthTest: false,
    side: THREE.DoubleSide,
  });

  const pointRing = new THREE.Mesh(pointRingGeometry, pointRingMaterial);
  pointRing.position.set(position.x, position.y, position.z);
  pointRing.scale.set(0, 0, 0);
  pointRing.lookAt(new THREE.Vector3(0, 0, 0));
  pointRing.name = `pointRing__Location__${i}`;

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
  hitBox.name = `hitbox__Location__${i}`;

  return hitBox;
}

export default function collectPoints(locationData) {
  const points = [];
  const rings = [];
  const hitboxes = [];
  for (let i = 0; i < locationData.features.length; i += 1) {
    const lng = locationData.features[i].geometry.coordinates[0];
    const lat = locationData.features[i].geometry.coordinates[1];
    const color = getRandomArrayElements(BRAND_COLORS)[0];
    const locationMarker = drawPoint(lat, lng, 1, i, color);
    const markerRing = drawRing(lat, lng, 1, i, color);
    const hitbox = drawHitbox(lat, lng, 1, i);
    points.push(locationMarker);
    rings.push(markerRing);
    hitboxes.push(hitbox);
  }
  return [points, rings, hitboxes];
}
