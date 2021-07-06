/* eslint-disable no-use-before-define */
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import { ARC_MAX_DISTANCE, TOTAL_ARCS } from '../../constants';
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
  render,
} from '../../scene';
import data from '../../data/member_companies.json';

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

      for (let i = 0; i < points[0].length; i += 1) {
        const locationPointGroup = new THREE.Group();
        locationPointGroup.name = `Location__${i}`;
        locationPointGroup.add(points[0][i]); // point
        locationPointGroup.add(points[1][i]); // ring
        locationPointGroup.add(points[2][i]); // hitbox
        scene.add(locationPointGroup);
      }

      for (let i = 0; i < TOTAL_ARCS; i += 1) {
        drawArc(drawCurve(...getRandomPointPositions()));
      }

      let current;
      let lastContent;
      let lastUpdated = 0;
      setInterval(() => {
        current = null;
        // eslint-disable-next-line prefer-destructuring
        current = window.document.getElementsByClassName('location visible')[0];
        if (current && current.childNodes) {
          const content = current.textContent;
          if (content !== lastContent) {
            lastContent = content;
            lastUpdated = 0;
            return;
          }
        }

        lastUpdated += 1;

        // 15 Seconds since Last Location Popup Change
        if (lastUpdated > 150) {
          // Pick a Random Location
          const random = Math.round(Math.random() * 80);
          const selection = window.document.getElementById(`Location__${random}`);
          if (current && current.classList) {
            current.classList.remove('visible');
          }

          if (selection && selection.classList) {
            selection.classList.add('visible');
          }

          lastContent = selection.textContent;
          lastUpdated = 0;
        }
      }, 100);
    }

    function getRandomPointPositions() {
      const points = collectPoints(data);
      const randPoints = getRandomArrayElements(points[0], 2);
      const a = randPoints[0].position;
      const b = randPoints[1].position;
      const distance = a.clone().sub(b).length();

      if (distance > ARC_MAX_DISTANCE) {
        return getRandomPointPositions();
      }
      return [a, b];
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
