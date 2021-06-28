import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import {
  polar2canvas,
  getPixel,
} from '../../utilities';
import {
  vertexShader,
  fragmentShader,
} from '../../shaders';
import animate from './animate';

export default function drawPoints(maskImageData) {
  // Create 60000 tiny dots and spiral them around the sphere.
  const DOT_COUNT = 40000;

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

  const numVertices = globalGeometry.attributes.position.count;
  const alphas = new Float32Array(numVertices * 1); // 1 values per vertex

  for (let i = 0; i < numVertices; i += 1) {
    // set alpha randomly
    alphas[i] = Math.random() * 0.25;
  }

  globalGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

  const newDotMaterial = new THREE.ShaderMaterial({
    // vertexColors: THREE.VertexColors,
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  animate(globalGeometry, 1);

  return new THREE.Points(globalGeometry, newDotMaterial);
}
