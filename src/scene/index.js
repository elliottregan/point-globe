/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
import * as THREE from 'three';
import { GLOBE_HOVER_FREEZE_ENABLED, onLocationClick } from '../constants';
import { clearHighlightedPoint, highlightPoint } from './highlightPoint';

let canvas;
const camDistance = 350;

const raycaster = new THREE.Raycaster();
const mouse2 = new THREE.Vector2();

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
let hover = false;
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

export function getCamera() {
  return camera;
}

export function isHovering() {
  return hover;
}

export function render() {
  if (!hover || !GLOBE_HOVER_FREEZE_ENABLED) {
    target.x += 0.00075;
    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  camera.position.x = camDistance * Math.sin(rotation.x) * Math.cos(rotation.y);
  camera.position.y = camDistance * Math.sin(rotation.y);
  camera.position.z = camDistance * Math.cos(rotation.x) * Math.cos(rotation.y);

  renderer.render(scene, camera);
}

let lastClicked = null;

function onMouseDown(event) {
  // Determine if the user is clicking a location marker or attempting to grab the globe
  const rect = renderer.domElement.getBoundingClientRect();
  mouse2.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  mouse2.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  raycaster.setFromCamera(mouse2, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (!intersects || !intersects[0]) {
    clearHighlightedPoint();
    const selection = window.document.getElementsByClassName('location visible')[0];
    if (selection && selection.classList) {
      selection.classList.remove('visible');
    }
  }

  /**
   * Find all intersected objects, and filter by those in a named group only.
   *
   * Each marker consists of a:
   * - point (colored dot)
   * - ring (a ring around the marker)
   * - hitbox (a sphere object that is used for detecting clicks)
   */
  const filter = intersects.filter((intersect) => intersect.object.parent?.name);
  if (filter.length > 0) {
    const locationMarkerGroup = filter[0].object.parent;
    // Ignore second clicks on already highlighted markers (avoids edge cases)
    if (lastClicked?.uuid === locationMarkerGroup.uuid) {
      return;
    }

    clearHighlightedPoint();
    highlightPoint(locationMarkerGroup);

    if (filter[0]) {
      canvas.style.cursor = 'pointer';
      onLocationClick(event, {
        locationId: filter[0].object.parent.name,
      });
      lastClicked = locationMarkerGroup;
    }
  } else {
    event.preventDefault();

    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mousemove', onMouseDownMove, false);
    canvas.removeEventListener('mousemove', onMouseHoverMove, false);
    canvas.style.cursor = 'grabbing';

    mouseOnDown.x = -event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;
  }
}

function onMouseDownMove(event) {
  mouse.x = event.touches ? -event.touches[0].clientX : -event.clientX;
  mouse.y = event.touches ? event.touches[0].clientY : event.clientY;

  target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005;
  target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005;

  target.y = target.y > PI_HALF ? PI_HALF : target.y;
  target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
}

function onMouseUp() {
  canvas.removeEventListener('mousemove', onMouseDownMove, false);
  canvas.removeEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mousemove', onMouseHoverMove, false);
  canvas.style.cursor = 'grab';
}

function onMouseOver() {
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mousemove', onMouseHoverMove, false);
}

function onMouseHoverMove() {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse2.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  mouse2.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  raycaster.setFromCamera(mouse2, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  hover = !!intersects[0];
  canvas.style.cursor = hover ? 'pointer' : 'grab';
}

function onMouseOut() {
  canvas.removeEventListener('mousedown', onMouseDown, false);
  canvas.removeEventListener('mousemove', onMouseHoverMove, false);
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
  const light = new THREE.PointLight('#aaa', 0.35);

  thisScene.add(camera);
  camera.add(light);
  light.position.set(camDistance / 2, camDistance / 2, 0);
  light.target = camera;
  scene = thisScene;
  canvas.appendChild(renderer.domElement);

  // Events
  canvas.addEventListener('mouseover', onMouseOver, false);
  canvas.addEventListener('mouseout', onMouseOut, false);
  window.addEventListener('resize', onWindowResize, false);

  return thisScene;
}
