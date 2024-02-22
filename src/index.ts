import './globals.css';
import handleDefaultAnimation from './defaults';
import handleTextAnimation from './text';

window.Webflow ||= [];
window.Webflow.push(() => {
  main();
});

function main() {
  initAnimations();
  console.log('Animations initialized');
}

function initAnimations(): void {
  const elements = document.querySelectorAll('[data-ld-animation]');

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.visibility = 'visible';
      const animation = element.getAttribute('data-ld-animation');
      if (!animation) return;
      if (animation === 'text-reveal') handleTextAnimation(element);
      else handleDefaultAnimation(element, animation);
    }
  });
}
