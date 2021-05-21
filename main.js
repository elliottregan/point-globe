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
  latLongToVector3,
  getRandomArrayElements,
  genRandDecimal,
} from './src/utilities';
import data from './src/data/member_companies.json';

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
  const camDistance = 350;
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

    camera = new THREE.PerspectiveCamera(camDistance / 5, w / h, 1, camDistance * 2);
    scene = new THREE.Scene();
    scene.add(camera);

    // Light

    const light = new THREE.PointLight('#fafafa', 0.35);
    camera.add(light);
    light.position.set(camDistance / 2, camDistance / 2, 0);
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
    const earthMaterial = new THREE.MeshLambertMaterial({
      emissive: 0x000,
      opacity: 0.9,
      transparent: true,
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    function addDots(maskImageData) {
      // Create 60000 tiny dots and spiral them around the sphere.
      const DOT_COUNT = 50000;

      const vector = new THREE.Vector3();
      const positions = [];
      const dotMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
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

        if (Object.values(pixelData).reduce((a, b) => a + b) <= 255 * 3) {
          const dotGeometry = new THREE.CircleBufferGeometry(genRandDecimal(0.4, 0.5, 3), 8);
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
      const dots = new THREE.Mesh(globalGeometry, dotMaterial);
      scene.add(dots);
    }

    const points = collectPoints(data);

    for (let i = 0; i < points.length; i++) {
      const randPoints = getRandomArrayElements(points, 2)
      const newLine = drawCurve(randPoints[0].position, randPoints[1].position);

      new TWEEN.Tween(newLine)
        .to(
          {
            currentPoint: 200,
          },
          2000,
        )
        .delay(i * 350 + 1500)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
          newLine.geometry.setDrawRange(0, newLine.currentPoint);
        })
        .start();
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

  function collectPoints(data) {
    const points = [];
    for (let i = 0; i < data['features'].length; i++) {
      const lng = data['features'][i]['geometry']['coordinates'][0];
      const lat = data['features'][i]['geometry']['coordinates'][1];
      points.push(new AddPoint(lat, lng, 1, i));
    }
    return points;
  }

  function AddPoint(lat, lng, r, i) {
    const position = latLongToVector3(lat, lng, radius);

    const pointGeometry = new THREE.SphereGeometry(r, 32, 32);
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: '#ef0018',
      opacity: 1,
      // side: THREE.DoubleSide,
      // transparent: true,
    });

    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(position.x, position.y, position.z);
    point.scale.set(0.01, 0.01, 0.01);
    point.lookAt(center);
    scene.add(point);

    new TWEEN.Tween(point.scale)
      .to(
        {
          x: 1,
          y: 1,
          z: 1,
        },
        1000,
      )
      .delay(i * 350 + 1500)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    const pointRingGeometry = new THREE.RingGeometry(r + 0.5, r + 1.5, 32);
    const pointRingMaterial = new THREE.MeshBasicMaterial({
      color: '#ef0018',
      opacity: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const pointRing = new THREE.Mesh(pointRingGeometry, pointRingMaterial);
    pointRing.position.set(position.x, position.y, position.z);
    pointRing.scale.set(0.01, 0.01, 0.01);
    pointRing.lookAt(center);
    scene.add(pointRing);

    new TWEEN.Tween(pointRing.scale)
      .to(
        {
          x: 1,
          y: 1,
          z: 1,
        },
        1500,
      )
      .delay(i * 350 + 1500)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    return point;
  }

  function drawCurve(a, b, i) {
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
    points.push(center);

    const lineGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    for (let ii = 0; ii < points.length; ii++) {
      positions[ii * 3 + 0] = points[ii].x;
      positions[ii * 3 + 1] = points[ii].y;
      positions[ii * 3 + 2] = points[ii].z;
    }
    lineGeometry.addAttribute(
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

    scene.add(line);
    return line;
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

    camera.position.x = camDistance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = camDistance * Math.sin(rotation.y);
    camera.position.z = camDistance * Math.cos(rotation.x) * Math.cos(rotation.y);

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
