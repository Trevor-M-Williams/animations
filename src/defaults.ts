import gsap from 'gsap';
import { animations } from './animations';

export default function handleDefaultAnimation(element: HTMLElement, animation: string): void {
  element.style.display = 'inline-block'; // for spans

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
      animationInstance = gsap.from(element, { ...animationProperties, delay: delayInSeconds });
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
        } else {
          animationInstance.pause();
          animationInstance.progress(0);
        }
      });
    },
    {
      threshold: 0.01,
    }
  );

  const parent = element.parentNode as HTMLElement;
  observer.observe(parent);
}
