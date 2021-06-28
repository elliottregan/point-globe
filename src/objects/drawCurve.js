import * as THREE from 'three';

export default function drawCurve(a, b) {
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
    linewidth: 2,
    opacity: 0.75,
    transparent: true,
  });

  const line = new THREE.Line(lineGeometry, lineMaterial);
  line.currentPoint = 0;
  return line;
}
