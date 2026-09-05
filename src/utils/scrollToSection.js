export const getScrollOffset = ({ navSelector = '[data-site-header]', gap = 20 } = {}) => {
  const nav = document.querySelector(navSelector);
  return Math.max(nav?.getBoundingClientRect().bottom ?? 0, 0) + gap;
};

export const getSectionScrollTop = (element, options = {}) => {
  if (!element) return 0;

  let elementTop = 0;
  for (let parent = element; parent; parent = parent.offsetParent) {
    elementTop += parent.offsetTop;
  }
  return Math.max(elementTop - getScrollOffset(options), 0);
};

export const scrollToSection = (sectionId, options = {}) => {
  if (!sectionId) return false;

  const element = typeof sectionId === 'string' ? document.getElementById(sectionId) : sectionId;
  if (!element) return false;

  const target = element.querySelector('h2') ?? element;
  const top = element.id === 'home' ? 0 : getSectionScrollTop(target, options);
  if (options.focus) {
    target.setAttribute('tabindex', '-1');
    if (target.matches('h2')) target.setAttribute('data-section-focus', '');
    target.focus({ preventScroll: true });
  }
  window.scrollTo({
    top,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : (options.behavior ?? 'smooth'),
  });

  return true;
};
