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
      element.style.visibility = 'visible';
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
        delay: delayInSeconds,
      });
      break;
    default:
      console.warn(`Unknown gsap function: ${gsapFunction}`);
      return;
  }

  applyTrigger(element, animationInstance, triggerType);
}

function handleTextAnimation(element: HTMLElement) {
  const delay = parseFloat(element.getAttribute('data-ld-delay') || '0');
  const delayInSeconds = delay * 0.001;
  let stagger = parseFloat(element.getAttribute('data-ld-stagger') || '0');

  const lines = element.innerHTML.split('\n');

  element.innerHTML = lines
    .map((line) => {
      // TODO: create a function or use a library
      line = line.replace(/&nbsp;/g, ' ');

      const htmlString = line.replace(
        /(<span[^>]*>[\s\S]*?<\/span>)|([\w'’]+|[^\w\s<]+)/g,
        (match, p1, p2) => {
          if (p1) {
            return p1.replace(/class="/, 'class="word ');
          } else if (p2) {
            return `<span class="word">${p2}</span>`;
          }
          return match;
        }
      );

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const words = doc.querySelectorAll('.word');
      words.forEach((word) => {
        const wordText = word.textContent || '';
        const letters = [...wordText]; // Using spread operator to correctly handle characters
        word.innerHTML = letters.map((letter) => `<span class="letter">${letter}</span>`).join('');
      });

      return doc.body.innerHTML;
    })
    .join('<br>');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const letters = element.querySelectorAll('.letter');
        if (stagger === 0) {
          const staggerMax = 0.05;
          const staggerMin = 0.005;
          stagger = Math.min(staggerMax, Math.max(staggerMin, 1 / letters.length));
        }

        const yOffset = '30%';
        const duration = 0.2;

        if (entry.isIntersecting) {
          gsap.fromTo(
            letters,
            { y: yOffset, opacity: 0 },
            {
              y: '0',
              opacity: 1,
              duration,
              stagger,
              ease: 'power3.out',
              delay: delayInSeconds,
            }
          );
        } else {
          gsap.killTweensOf(letters);
          gsap.set(letters, { y: yOffset, opacity: 0 });
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
        } else {
          animationInstance.pause();
          animationInstance.progress(0);
        }
      });
    },
    {
      root: null,
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0.01,
    }
  );

  const parent = element.parentNode as HTMLElement;
  observer.observe(parent);
}
