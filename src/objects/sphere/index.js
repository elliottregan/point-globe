/* eslint-disable import/prefer-default-export */
import * as THREE from 'three';

export function drawEarth(radius = 150) {
  const earthGeometry = new THREE.SphereGeometry(radius, 50, 30);
  const earthMaterial = new THREE.MeshLambertMaterial({
    emissive: 0x000,
    opacity: 0.9,
    transparent: true,
  });

  return new THREE.Mesh(earthGeometry, earthMaterial);
}
