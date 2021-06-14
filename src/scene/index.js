/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
import * as THREE from 'three';

let canvas;
const camDistance = 350;

const PI_HALF = Math.PI / 2;
const mouse = {
  x: 0,
  y: 0,
};
const mouseOnDown = {
  x: 0,
  y: 0,
};
const rotation = {
  x: Math.PI * 1.9,
  y: Math.PI / 6,
};
const target = {
  x: Math.PI * 1.9,
  y: Math.PI / 6,
};
const targetOnDown = {
  x: 0,
  y: 0,
};

const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(camDistance / 5, w / h, 1, camDistance * 2);

let renderer;

let scene;

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.autoClear = false;
  // renderer.setPixcanvasRatio(window.devicePixcanvasRatio);
  renderer.setSize(w, h);
}

export function render() {
  target.x += 0.00075;

  rotation.x += (target.x - rotation.x) * 0.1;
  rotation.y += (target.y - rotation.y) * 0.1;

  camera.position.x = camDistance * Math.sin(rotation.x) * Math.cos(rotation.y);
  camera.position.y = camDistance * Math.sin(rotation.y);
  camera.position.z = camDistance * Math.cos(rotation.x) * Math.cos(rotation.y);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.render(scene, camera);
}

function onMouseDown(event) {
  event.preventDefault();

  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mousemove', onMouseMove, false);
  canvas.addEventListener('mouseout', onMouseOut, false);

  mouseOnDown.x = -event.clientX;
  mouseOnDown.y = event.clientY;

  targetOnDown.x = target.x;
  targetOnDown.y = target.y;
}

function onMouseMove(event) {
  mouse.x = event.touches ? -event.touches[0].clientX : -event.clientX;
  mouse.y = event.touches ? event.touches[0].clientY : event.clientY;

  target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005;
  target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005;

  target.y = target.y > PI_HALF ? PI_HALF : target.y;
  target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
}

function onMouseUp() {
  canvas.removeEventListener('mousemove', onMouseMove, false);
  canvas.removeEventListener('mouseup', onMouseUp, false);
  canvas.removeEventListener('mouseout', onMouseOut, false);
}

function onMouseOut() {
  canvas.removeEventListener('mouseup', onMouseUp, false);
  canvas.removeEventListener('mouseout', onMouseOut, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function createScene(el) {
  canvas = el;
  createRenderer();
  const thisScene = new THREE.Scene();
  const light = new THREE.PointLight('#fafafa', 0.35);

  thisScene.add(camera);
  camera.add(light);
  light.position.set(camDistance / 2, camDistance / 2, 0);
  light.target = camera;
  scene = thisScene;
  canvas.appendChild(renderer.domElement);

  // Events
  canvas.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('resize', onWindowResize, false);

  return thisScene;
}
