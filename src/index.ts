import './globals.css';
import gsap from 'gsap';
import { animations } from './animations';

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
      const animation = element.getAttribute('data-ld-animation');
      if (!animation) return;
      if (animation === 'text-reveal') handleTextAnimation(element);
      else handleDefaultAnimation(element, animation);
    }
  });
}

function handleDefaultAnimation(element: HTMLElement, animation: string): void {
  const triggerType = element.getAttribute('data-ld-trigger') || 'scroll-in-view';
  const delay = parseFloat(element.getAttribute('data-ld-delay') || '0');
  const delayInSeconds = delay * 0.001;

  if (!animation) {
    console.warn('No animation attribute found');
    return;
  }

  const animationDefinition = animations[animation];
  if (!animationDefinition) {
    console.warn(`No animation definition found for ${animation}`);
    return;
  }

  const { gsapFunction, properties } = animationDefinition;

  const animationProperties = { ...properties, delay: delayInSeconds };
  let animationInstance;

  switch (gsapFunction) {
    case 'from':
      animationInstance = gsap.from(element, animationProperties);
      break;
    case 'fromTo':
      animationInstance = gsap.fromTo(element, properties.from!, {
        ...properties.to!,
        delay: delay,
      });
      break;
    default:
      console.warn(`Unknown gsap function: ${gsapFunction}`);
      return;
  }

  applyTrigger(element, animationInstance, triggerType);
}

function handleTextAnimation(element: HTMLElement) {
  const lines = element.innerText.split('\n');

  element.innerHTML = lines
    .map((line) => {
      const words = line.split(' ');

      return words
        .map((word) => {
          const letters = word
            .split('')
            .map((letter) => `<span class="letter">${letter}</span>`)
            .join('');
          return `<span class="word">${letters}</span>`;
        })
        .join(' ');
    })
    .join('<br>');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const letters = element.querySelectorAll('.letter');
        const staggerMax = 0.02;
        const staggerMin = 0.005;
        const stagger = Math.min(staggerMax, Math.max(staggerMin, 1 / letters.length));

        if (entry.isIntersecting) {
          gsap.fromTo(
            letters,
            { y: '10px', opacity: 0 },
            { y: '0', opacity: 1, duration: 0.2, stagger, ease: 'power3.out' }
          );
        } else {
          gsap.set(letters, { y: '10px', opacity: 0 });
        }
      });
    },
    { threshold: [0.1] }
  );

  observer.observe(element);
}

// ------------- Utility functions ------------- //

function applyTrigger(
  element: HTMLElement,
  animationInstance: GSAPAnimation,
  triggerType: string
): void {
  switch (triggerType) {
    case 'click':
      element.parentNode?.addEventListener('click', () => {
        element.style.visibility = 'visible';
        animationInstance.play();
      });
      break;
    case 'hover':
      element.parentNode?.addEventListener('mouseenter', () => {
        element.style.visibility = 'visible';
        animationInstance.play();
      });
      element.parentNode?.addEventListener('mouseleave', () => {
        animationInstance.reverse();
      });
      break;
    case 'load':
      window.addEventListener('load', () => {
        element.style.visibility = 'visible';
        animationInstance.play();
      });
      break;
    case 'scroll-in-view':
      initObserver(element, animationInstance);
      break;
    default:
      console.warn(`Unknown trigger type: ${triggerType}`);
  }
}

function initObserver(element: HTMLElement, animationInstance: GSAPAnimation) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.visibility = 'visible';
          animationInstance.play();
          observer.unobserve(element);
        }
      });
    },
    {
      root: null,
      rootMargin: '0% 0px -50% 0px',
      threshold: 0.01,
    }
  );

  const parent = element.parentNode as HTMLElement;
  observer.observe(parent);
}
