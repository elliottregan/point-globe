/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import './style.css';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as TWEEN from 'tween.js';
import {
  polar2canvas,
  getImageData,
  getPixel,
} from './src/utilities';

function Earth(el) {
  let camera; let scene; let renderer; let w; let
    h;

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

  const center = new THREE.Vector3(0, 0, 0);
  const distance = 350;
  const PI_HALF = Math.PI / 2;
  const radius = 150;

  const cutoutUrl = 'https://i.ibb.co/ZxCTMYv/earthspec1k.jpg';
  // const cutoutUrl = 'https://i.ibb.co/ZXTXYt8/test-grid.png';
  // -------------------------------------
  //   Init
  // -------------------------------------

  function init() {
    w = window.innerWidth;
    h = window.innerHeight;

    camera = new THREE.PerspectiveCamera(distance / 5, w / h, 1, distance * 2);
    scene = new THREE.Scene();
    scene.add(camera);

    // Light

    const light = new THREE.PointLight('#fafafa', 0.35);
    camera.add(light);
    light.position.set(distance / 2, distance / 2, 0);
    light.target = camera;

    // Earth

    THREE.ImageUtils.crossOrigin = '';
    const textureLoader = new THREE.TextureLoader();

    const earthCutout = textureLoader.load(cutoutUrl, () => {
      const imageData = getImageData(earthCutout.image);
      addDots(imageData);
    });
    // earthCutout.wrapS = THREE.RepeatWrapping;
    // earthCutout.wrapT = THREE.RepeatWrapping;
    // earthCutout.repeat.set(1, 1);

    const earthGeometry = new THREE.SphereGeometry(radius, 50, 30);
    const earthMaterial = new THREE.MeshPhongMaterial({
      emissive: '#000',
      specular: '#000',
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    function addDots(maskImageData) {
      // Create 60000 tiny dots and spiral them around the sphere.
      const DOT_COUNT = 40000;

      const vector = new THREE.Vector3();
      const positions = [];
      const dotMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        // side: THREE.DoubleSide
      });

      for (let i = DOT_COUNT; i >= 0; i--) {
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

        if (Object.values(pixelData).reduce((a, b) => a + b) <= 255 * 2) {
          const dotGeometry = new THREE.CircleBufferGeometry(1, 5);
          dotGeometry.lookAt(vector);

          // Move the dot to the newly calculated position
          dotGeometry.translate(vector.x, vector.y, vector.z);

          positions.push(dotGeometry);
        }
      }

      const globalGeometry = BufferGeometryUtils.mergeBufferGeometries(
        positions,
      );
      const dots = new THREE.Mesh(globalGeometry, dotMaterial);
      scene.add(dots);
    }

    // Renderer

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);

    // Events
    el.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);

    // DOM

    el.appendChild(renderer.domElement);
  }

  // -------------------------------------
  //   Interactivity
  // -------------------------------------

  function onMouseDown(event) {
    event.preventDefault();

    el.addEventListener('mouseup', onMouseUp, false);
    el.addEventListener('mousemove', onMouseMove, false);
    el.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = -event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;
  }

  function onMouseMove(event) {
    mouse.x = -event.clientX;
    mouse.y = event.clientY;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005;
    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005;

    target.y = target.y > PI_HALF ? PI_HALF : target.y;
    target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
  }

  function onMouseUp(event) {
    el.removeEventListener('mousemove', onMouseMove, false);
    el.removeEventListener('mouseup', onMouseUp, false);
    el.removeEventListener('mouseout', onMouseOut, false);
  }

  function onMouseOut(event) {
    el.removeEventListener('mouseup', onMouseUp, false);
    el.removeEventListener('mouseout', onMouseOut, false);
  }

  function onWindowResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // -------------------------------------
  //   Animate
  // -------------------------------------

  function animate(time) {
    render();
    TWEEN.update(time);
    requestAnimationFrame(animate);
  }

  // -------------------------------------
  //   Render
  // -------------------------------------

  function render() {
    if (el.style.cursor !== 'move') target.x += 0.00075;

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    camera.lookAt(center);
    renderer.render(scene, camera);
  }

  // -------------------------------------
  //   Start
  // -------------------------------------

  init();
  animate();

  this.animate = animate;
  return this;
}

const container = document.getElementById('container');
const planet = new Earth(container);
