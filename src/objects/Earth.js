/* eslint-disable no-use-before-define */
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import { TOTAL_ARCS } from '../constants';
import drawCurve from './drawCurve';
import drawPoints from './globePoints';
import {
  getImageData,
  getRandomArrayElements,
} from '../utilities';
import collectPoints from './locationMarkers';
import { drawEarth } from './sphere';
import {
  createScene,
  render,
} from '../scene';
import data from '../data/member_companies.json';

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
        scene.add(points[0][i]); // point
        // scene.add(points[1][i]); // ring
        scene.add(points[2][i]); // hitbox
      }

      for (let i = 0; i < TOTAL_ARCS; i += 1) {
        const randPoints = getRandomArrayElements(points[0], 2);
        const newLine = drawCurve(randPoints[0].position, randPoints[1].position);

        drawArc(newLine, i);
      }
    }

    function drawArc(newLine, i = 0) {
      scene.add(newLine);

      const drawCurveIn = new TWEEN.Tween(newLine)
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
        });

      const drawCurveOut = new TWEEN.Tween(newLine)
        .to(
          {
            currentPoint: 0,
          },
          2000,
        )
        .delay(i * 350 + 1500)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
          newLine.geometry.setDrawRange(0, newLine.currentPoint);
        })
        // eslint-disable-next-line no-loop-func
        .onComplete(() => {
          scene.remove(newLine);
          setTimeout(() => {
            drawArc(newLine);
          }, Math.random() * 1000);
        });

      drawCurveIn
        .chain(drawCurveOut)
        .start();
    }

    function animate(time) {
      render();
      TWEEN.update(time);
      requestAnimationFrame(animate);
    }

    init();
    animate();

    this.animate = animate;
    return this;
  }
}
