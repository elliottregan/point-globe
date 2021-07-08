/* eslint-disable no-use-before-define */
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import {
  ARC_MAX_DISTANCE,
  MARKER_AUTO_SELECT_DELAY,
  MARKER_AUTO_SELECT_INIT_AFTER,
  MARKER_AUTO_SELECT_MAX_DISTANCE,
  TOTAL_ARCS,
} from '../../constants';
import drawCurve from '../drawCurve';
import drawPoints from '../globePoints';
import {
  getImageData,
  getRandomArrayElements,
  genRandDecimal,
} from '../../utilities';
import {
  drawCurveIn,
  drawCurveOut,
} from './tweens';
import collectPoints from '../locationMarkers';
import { drawEarth } from '../sphere';
import {
  createScene,
  getCamera,
  isHovering,
  render,
} from '../../scene';
import data from '../../data/member_companies.json';
import { clearHighlightedPoint, highlightPoint } from '../../scene/highlightPoint';

// eslint-disable-next-line import/prefer-default-export
export class Earth {
  constructor(el, { mapUrl }) {
    let scene;

    // -------------------------------------
    //   Init
    // -------------------------------------
    function init() {
      const earth = drawEarth();
      scene = createScene(el);
      scene.add(earth);

      const textureLoader = new THREE.TextureLoader();
      const earthCutout = textureLoader.load(mapUrl, () => {
        const imageData = getImageData(earthCutout.image);
        const points = drawPoints(imageData);
        scene.add(points);
      });

      const points = collectPoints(data);

      const locationPointGroups = [];
      for (let i = 0; i < points[0].length; i += 1) {
        const locationPointGroup = new THREE.Group();
        locationPointGroup.name = `Location__${i}`;
        locationPointGroup.add(points[0][i]); // point
        locationPointGroup.add(points[1][i]); // ring
        locationPointGroup.add(points[2][i]); // hitbox
        scene.add(locationPointGroup);
        locationPointGroups.push(locationPointGroup);
      }

      for (let i = 0; i < TOTAL_ARCS; i += 1) {
        drawArc(drawCurve(...getRandomPointPositions()));
      }

      const camera = getCamera();
      let current;
      const delay = MARKER_AUTO_SELECT_DELAY / 100; // Normalize Millisecond Config to "tick count"
      let lastContent;
      let lastUpdated = 0;
      let lastRandom;
      const raycaster = new THREE.Raycaster();
      setInterval(() => {
        if (isHovering()) {
          return;
        }

        // eslint-disable-next-line prefer-destructuring
        current = window.document.getElementsByClassName('globe-location-card visible')[0];
        if (current && current.childNodes) {
          const content = current.textContent;
          if (content !== lastContent) {
            lastContent = content;
            lastUpdated = 0;
            return;
          }
        }

        lastUpdated += 1;

        // Wait x Seconds since Last Location Popup Change
        if (lastUpdated > delay) {
          onAutoUpdate();
        }
      }, 100);

      // Start AutoUpdate x Seconds After Page Load
      if (MARKER_AUTO_SELECT_INIT_AFTER > 0) {
        setTimeout(() => {
          // Safely RayCast in Loop via Max Attempts
          for (let attempts = 0; attempts < 100; attempts += 1) {
            if (onAutoUpdate()) {
              break;
            }
          }
        }, MARKER_AUTO_SELECT_INIT_AFTER);
      }

      function onAutoUpdate() {
        // Pick a Random Location
        const random = Math.round(Math.random() * (locationPointGroups.length - 1));

        // Prevent Re-Selection of Same Random Point Twice in a Row
        if (random === lastRandom) {
          return false;
        }

        const group = locationPointGroups[random];
        const a = camera.position.normalize();
        const b = group.children[2].position.normalize();
        const distance = a.clone().sub(b).length();
        if (distance > MARKER_AUTO_SELECT_MAX_DISTANCE) {
          return false;
        }

        raycaster.set(a, b);
        const result = raycaster.intersectObjects(scene.children, true);
        if (!result || !result.length > 0) {
          return false;
        }

        const selection = window.document.getElementById(`Location__${random}`);
        if (selection && selection.classList) {
          selection.classList.add('visible');
          clearHighlightedPoint();
          highlightPoint(group);
        }

        if (current && current.classList) {
          current.classList.remove('visible');
        }

        lastContent = selection.textContent;
        lastRandom = random;
        lastUpdated = 0;
        return true;
      }
    }

    function getRandomPointPositions() {
      const points = collectPoints(data);
      const randPoints = getRandomArrayElements(points[0], 2);
      const a = randPoints[0].position;
      const b = randPoints[1].position;
      const distance = a.clone().sub(b).length();
      return distance > ARC_MAX_DISTANCE ? getRandomPointPositions() : [a, b];
    }

    function drawArc(newLine) {
      scene.add(newLine);

      /*
        Draw the curve, draw it out, remove it from the scene,
      */
      drawCurveIn(newLine)
        .chain(drawCurveOut(newLine)
          .onComplete(() => {
            scene.remove(newLine);
            setTimeout(() => {
              drawArc(drawCurve(...getRandomPointPositions()));
            }, genRandDecimal(0, 2500));
          }))
        .start();
    }

    function animate(time) {
      render();
      TWEEN.update(time);
      requestAnimationFrame(animate);
    }

    init();
    animate();
  }
}
