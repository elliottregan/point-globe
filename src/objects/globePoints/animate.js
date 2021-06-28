import translateClouds from './translateClouds';

export default function animate(material, time) {
  translateClouds(material, time);
  requestAnimationFrame(() => {
    animate(material, time);
  });
  // eslint-disable-next-line no-param-reassign
  time += 1;
}
