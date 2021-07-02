import * as THREE from 'three';
import { rgbToHsl } from '../../utilities';
import {
  ARC_COLOR_BEGIN,
  ARC_COLOR_END,
  ARC_DISTANCE_OFFSET,
  ARC_LENGTH_OFFSET,
} from '../../constants';

export default function drawCurve(a, b) {
  const distance = a.clone().sub(b).length();
  let distanceOffset = distance - ARC_DISTANCE_OFFSET;
  if (distanceOffset < 0) {
    distanceOffset = 0;
  }

  const mid = a.clone().lerp(b, 0.5);
  const midOffset = ARC_LENGTH_OFFSET + (distanceOffset * 2);
  const midLength = mid.length() + midOffset;
  mid.normalize();
  mid.multiplyScalar(midLength + distance * 0.25);

  const normal = new THREE.Vector3().subVectors(a, b);
  normal.normalize();

  const midStart = mid.clone().add(normal.clone().multiplyScalar(distance * 0.25));
  const midEnd = mid.clone().add(normal.clone().multiplyScalar(distance * -0.25));

  const splineCurveA = new THREE.CubicBezierCurve3(a, a, midStart, mid);
  const splineCurveB = new THREE.CubicBezierCurve3(mid, midEnd, b, b);

  let points = splineCurveA.getPoints(100);
  points = points.splice(0, points.length - 1);
  points = points.concat(splineCurveB.getPoints(100));
  points.push(new THREE.Vector3(0, 0, 0));

  const color = new THREE.Color();
  const colorBegin = ARC_COLOR_BEGIN;
  const colorEnd = ARC_COLOR_END;
  const colorDiffR = -(colorBegin[0] - colorEnd[0]);
  const colorDiffG = -(colorBegin[1] - colorEnd[1]);
  const colorDiffB = -(colorBegin[2] - colorEnd[2]);
  const colors = [];
  const pointCount = points.length;
  const vertices = [];
  for (let i = 0; i < pointCount; i += 1) {
    const point = points[i];
    const ratio = i / pointCount;
    const deltaR = colorDiffR * ratio;
    const deltaG = colorDiffG * ratio;
    const deltaB = colorDiffB * ratio;
    const hsl = rgbToHsl(colorBegin[0] + deltaR, colorBegin[1] + deltaG, colorBegin[2] + deltaB);
    color.setHSL(hsl[0], 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
    vertices.push(point.x, point.y, point.z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setDrawRange(0, 0);

  const material = new THREE.LineBasicMaterial({
    linewidth: 2,
    opacity: 0.75,
    transparent: true,
    vertexColors: true,
  });

  const line = new THREE.Line(geometry, material);
  line.currentPoint = 0;
  return line;
}
