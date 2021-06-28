import * as THREE from 'three';
import * as TWEEN from 'tween.js';
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
        scene.add(points[0][i]);
        scene.add(points[1][i]);
        scene.add(points[2][i]);
      }

      for (let i = 0; i < 2; i += 1) {
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
