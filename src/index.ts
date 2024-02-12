import { initAnimations } from './animations';

window.Webflow ||= [];
window.Webflow.push(() => {
  main();
});

function main() {
  console.log('Webflow loaded');
  initAnimations();
}
