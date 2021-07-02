/* eslint-disable no-use-before-define */
import * as TWEEN from 'tween.js';
import * as THREE from 'three';

export const scalePoint = (point) => new TWEEN.Tween(point.scale)
  .to(
    {
      x: 4,
      y: 4,
      z: 4,
    },
    1000,
  )
  .easing(TWEEN.Easing.Elastic.Out);

export const deflatePoint = (point) => new TWEEN.Tween(point.scale)
  .to(
    {
      x: 1,
      y: 1,
      z: 1,
    },
    400,
  )
  .easing(TWEEN.Easing.Sinusoidal.InOut);

export const scaleRing = (ring) => {
  const fade = fadeIn(ring).delay(200).start();
  // const spin = spinRing(ring).start();
  return new TWEEN.Tween(ring.scale)
    .to(
      {
        x: 1,
        y: 1,
        z: 1,
      },
      1500,
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .onStart(() => {
      fade.start();
    })
    .onStop(() => {
      fade.stop();
    });
};

export const deflateRing = (ring) => {
  const fade = fadeOut(ring).start();

  return new TWEEN.Tween(ring.scale)
    .to(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      400,
    )
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onStart(() => {
      fade.start();
    });
};

export const fadeIn = ({ material }) => new TWEEN.Tween(material)
  .to(
    { opacity: 1 },
    1500,
  )
  .easing(TWEEN.Easing.Cubic.Out);

export const fadeOut = ({ material }) => new TWEEN.Tween(material)
  .to(
    { opacity: 1 },
    1500,
  )
  .easing(TWEEN.Easing.Cubic.Out);

export const spinRing = (ring) => {
  // eslint-disable-next-line no-param-reassign
  ring.material.userData.currentRotation = 0;
  let tween = new TWEEN.Tween(ring.material.userData)
    .to(
      {
        currentRotation: Math.PI * 2,
      },
      1500,
    )
    .onUpdate(() => {
      ring.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.1);
    })
    .easing(TWEEN.Easing.Linear.None)
    .onComplete(() => {
      tween = spinRing(ring).start();
    })
    .onStop(() => {
      tween.stop();
    });

  return tween;
};
