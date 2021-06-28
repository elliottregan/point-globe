/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import './style.css';
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import {
  getImageData,
  getRandomArrayElements,
} from './src/utilities';
import {
  drawCurve,
  drawDots,
} from './src/objects';
import {
  collectPoints,
} from './src/locationMarkers';
import {
  drawEarth,
} from './src/earth';
import {
  createScene,
  render,
} from './src/scene';

import data from './src/data/member_companies.json';

const cutoutUrl = '/images/earthspec1k.jpg';

class Earth {
  constructor(el) {
    let scene;
    let w;
    let h;

    // -------------------------------------
    //   Init
    // -------------------------------------
    function init() {
      w = window.innerWidth;
      h = window.innerHeight;

      const earth = drawEarth();
      scene = createScene(el);
      scene.add(earth);

      const textureLoader = new THREE.TextureLoader();
      const earthCutout = textureLoader.load(cutoutUrl, () => {
        const imageData = getImageData(earthCutout.image);
        const dots = drawDots(imageData);
        scene.add(dots);
      });

      const points = collectPoints(data);

      for (let i = 0; i < points[0].length; i++) {
        scene.add(points[0][i]);
        scene.add(points[1][i]);
        scene.add(points[2][i]);
      }

      for (let i = 0; i < 2; i++) {
        const randPoints = getRandomArrayElements(points[0], 2);
        const newLine = drawCurve(randPoints[0].position, randPoints[1].position);
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

        drawCurveIn
          .start();
      }
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

const container = document.getElementById('container');
const planet = new Earth(container);
