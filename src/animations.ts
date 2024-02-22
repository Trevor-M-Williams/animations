interface AnimationProperties {
  opacity?: number;
  x?: string;
  y?: string;
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

export const animations: Record<string, AnimationDefinition> = {
  fade: {
    gsapFunction: 'from',
    properties: {
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'fade-up': {
    gsapFunction: 'from',
    properties: {
      opacity: 0,
      y: '50px',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'fade-down': {
    gsapFunction: 'from',
    properties: {
      opacity: 0,
      y: '-50px',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'fade-left': {
    gsapFunction: 'from',
    properties: {
      opacity: 0,
      x: '-50px',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },
  'fade-right': {
    gsapFunction: 'from',
    properties: {
      opacity: 0,
      x: '50px',
      duration: 1,
      ease: 'power3.out',
      paused: true,
    },
  },

  // Image reveal animations
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
