import gsap from 'gsap';

interface AnimationProperties {
  clipPath?: string;
  duration?: number;
  ease?: string;
  paused?: boolean;
  from?: Record<string, any>;
  to?: Record<string, any>;
}

interface AnimationDefinition {
  gsapFunction: string;
  properties: AnimationProperties;
}

const animations: Record<string, AnimationDefinition> = {
  'reveal-right': {
    gsapFunction: 'from',
    properties: {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'reveal-left': {
    gsapFunction: 'from',
    properties: {
      clipPath: 'inset(0 0 0 100%)',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'reveal-up': {
    gsapFunction: 'from',
    properties: {
      clipPath: 'inset(100% 0 0 0)',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'reveal-down': {
    gsapFunction: 'from',
    properties: {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'reveal-horizontal': {
    gsapFunction: 'from',
    properties: {
      clipPath: 'inset(0 50% 0 50%)',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'reveal-vertical': {
    gsapFunction: 'from',
    properties: {
      clipPath: 'inset(50% 0 50% 0)',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'reveal-center': {
    gsapFunction: 'from',
    properties: {
      clipPath: 'inset(50% 50% 50% 50%)',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'reveal-circle': {
    gsapFunction: 'fromTo',
    properties: {
      from: {
        clipPath: 'circle(0%)',
      },
      to: {
        clipPath: 'circle(75%)',
        duration: 1,
        ease: 'power3.out',
        paused: true,
      },
    },
  },
  'reveal-up-left': {
    gsapFunction: 'fromTo',
    properties: {
      from: {
        clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%)',
      },
      to: {
        clipPath: 'polygon(100% -100%, -100% 100%, 100% 100%)',
        duration: 1,
        ease: 'power3.out',
        paused: true,
      },
    },
  },
  'reveal-up-right': {
    gsapFunction: 'fromTo',
    properties: {
      from: {
        clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%)',
      },
      to: {
        clipPath: 'polygon(0% -100%, 200% 100%, 0% 100%)',
        duration: 1,
        ease: 'power3.out',
        paused: true,
      },
    },
  },
  'reveal-down-left': {
    gsapFunction: 'fromTo',
    properties: {
      from: {
        clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%)',
      },
      to: {
        clipPath: 'polygon(100% 200%, -100% 0%, 100% 0%)',
        duration: 1,
        ease: 'power3.out',
        paused: true,
      },
    },
  },
  'reveal-down-right': {
    gsapFunction: 'fromTo',
    properties: {
      from: {
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%)',
      },
      to: {
        clipPath: 'polygon(0% 200%, 200% 0%, 0% 0%)',
        duration: 1,
        ease: 'power3.out',
        paused: true,
      },
    },
  },
};

export function initAnimations(): void {
  const elements = document.querySelectorAll('[data-ld-animation]');

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      handleAnimation(element);
    }
  });
}

function handleAnimation(element: HTMLElement): void {
  const animation = element.getAttribute('data-ld-animation');
  const triggerType = element.getAttribute('data-ld-trigger') || 'scroll-in-view';

  if (!animation) {
    console.warn('No animation attribute found');
    return;
  }

  const { gsapFunction, properties } = animations[animation];

  let animationInstance;

  switch (gsapFunction) {
    case 'from':
      animationInstance = gsap.from(element, properties);
      break;
    case 'fromTo':
      animationInstance = gsap.fromTo(element, properties.from!, properties.to!);
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
