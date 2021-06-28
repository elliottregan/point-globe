/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
import './style.css';

import { Earth } from './src/objects/Earth';

const container = document.getElementById('container');
const planet = new Earth(container, {
  mapUrl: '/images/earthspec1k.jpg',
  onLocationMarkerClick() {
    console.log('hello!');
  },
});
