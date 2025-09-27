/**
 * Smooth scroll utilities for enhanced UX
 */

export interface SmoothScrollOptions {
  duration?: number;
  easing?: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn';
  offset?: number;
}

const easingFunctions = {
  linear: (t: number) => t,
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number) => t * (2 - t),
  easeIn: (t: number) => t * t,
};

/**
 * Smooth scroll to a specific element
 */
export const scrollToElement = (
  element: Element | string,
  options: SmoothScrollOptions = {}
): Promise<void> => {
  const {
    duration = 800,
    easing = 'easeInOut',
    offset = 0,
  } = options;

  return new Promise((resolve) => {
    const targetElement = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!targetElement) {
      console.warn('Smooth scroll: Target element not found');
      resolve();
      return;
    }

    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const distance = targetPosition - startPosition;
    const easingFunction = easingFunctions[easing];

    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = easingFunction(progress);
      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animation);
  });
};

/**
 * Smooth scroll to top of page
 */
export const scrollToTop = (options: SmoothScrollOptions = {}): Promise<void> => {
  const { duration = 600, easing = 'easeOut' } = options;

  return new Promise((resolve) => {
    const startPosition = window.pageYOffset;
    const easingFunction = easingFunctions[easing];
    let startTime: number | null = null;

    if (startPosition === 0) {
      resolve();
      return;
    }

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = easingFunction(progress);
      window.scrollTo(0, startPosition * (1 - ease));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, 0);
        resolve();
      }
    };

    requestAnimationFrame(animation);
  });
};

/**
 * Smooth scroll to bottom of page
 */
export const scrollToBottom = (options: SmoothScrollOptions = {}): Promise<void> => {
  const { duration = 800, easing = 'easeInOut' } = options;

  return new Promise((resolve) => {
    const startPosition = window.pageYOffset;
    const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
    const distance = targetPosition - startPosition;
    const easingFunction = easingFunctions[easing];

    if (distance <= 0) {
      resolve();
      return;
    }

    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = easingFunction(progress);
      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animation);
  });
};

/**
 * React hook for smooth scrolling
 */
export const useSmoothScroll = () => {
  const scrollTo = (
    target: Element | string,
    options?: SmoothScrollOptions
  ) => scrollToElement(target, options);

  const scrollTop = (options?: SmoothScrollOptions) => scrollToTop(options);

  const scrollBottom = (options?: SmoothScrollOptions) => scrollToBottom(options);

  return {
    scrollTo,
    scrollTop,
    scrollBottom,
  };
};

/**
 * Add smooth scroll behavior to the entire document
 */
export const enableSmoothScrolling = () => {
  // Add CSS smooth scrolling as fallback
  document.documentElement.style.scrollBehavior = 'smooth';

  // Override all anchor links to use smooth scrolling
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

    if (link && link.hash) {
      e.preventDefault();
      scrollToElement(link.hash, { duration: 800, easing: 'easeInOut', offset: 80 });
    }
  });
};

/**
 * Scroll reveal animation utility
 */
export const createScrollReveal = (
  elements: string | NodeListOf<Element>,
  options: {
    threshold?: number;
    rootMargin?: string;
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight';
  } = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    animation = 'fadeIn'
  } = options;

  const animationClasses = {
    fadeIn: 'opacity-0 transition-opacity duration-700 data-[revealed]:opacity-100',
    slideUp: 'opacity-0 translate-y-8 transition-all duration-700 data-[revealed]:opacity-100 data-[revealed]:translate-y-0',
    slideLeft: 'opacity-0 -translate-x-8 transition-all duration-700 data-[revealed]:opacity-100 data-[revealed]:translate-x-0',
    slideRight: 'opacity-0 translate-x-8 transition-all duration-700 data-[revealed]:opacity-100 data-[revealed]:translate-x-0'
  };

  if (!window.IntersectionObserver) {
    // Fallback for older browsers
    const nodeList = typeof elements === 'string'
      ? document.querySelectorAll(elements)
      : elements;
    nodeList.forEach(el => el.setAttribute('data-revealed', 'true'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold,
      rootMargin,
    }
  );

  const nodeList = typeof elements === 'string'
    ? document.querySelectorAll(elements)
    : elements;

  nodeList.forEach((el) => {
    el.classList.add(...animationClasses[animation].split(' '));
    observer.observe(el);
  });

  return observer;
};

const SmoothScrollUtils = {
  scrollToElement,
  scrollToTop,
  scrollToBottom,
  useSmoothScroll,
  enableSmoothScrolling,
  createScrollReveal,
};

export default SmoothScrollUtils;