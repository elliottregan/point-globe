/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import './style.css';

import { Earth } from './src/objects/Earth';
import { clickedNothing } from './src/scene';
import { MARKER_CLICK_OFF_CANVAS_DESELECTION } from './src/constants';

const container = document.querySelector('[data-globe]');
const planet = new Earth(container, {
  mapUrl: '/images/earthspec1k.jpg',
});

if (MARKER_CLICK_OFF_CANVAS_DESELECTION) {
  window.document.addEventListener('click', (e) => {
    const canvasElement = container.querySelector('canvas');
    if (e.target !== canvasElement) {
      clickedNothing();
    }
  }, false);
}
