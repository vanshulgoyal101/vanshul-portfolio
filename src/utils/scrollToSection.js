export const getScrollOffset = ({ navSelector = 'nav', gap = 20 } = {}) => {
  const nav = document.querySelector(navSelector);
  const navHeight = nav ? (nav.offsetHeight || nav.getBoundingClientRect().height || 0) : 0;
  return navHeight + gap;
};

export const getSectionScrollTop = (element, options = {}) => {
  if (!element) return 0;

  const { gap = 20, navSelector = 'nav' } = options;
  const nav = document.querySelector(navSelector);
  const navHeight = nav ? (nav.offsetHeight || nav.getBoundingClientRect().height || 0) : 0;

  const elementTop = typeof element.offsetTop === 'number'
    ? element.offsetTop
    : (element.getBoundingClientRect().top + window.scrollY);

  return Math.max(elementTop - navHeight - gap, 0);
};

export const scrollToSection = (sectionId, options = {}) => {
  if (!sectionId) return false;

  const element = typeof sectionId === 'string' ? document.getElementById(sectionId) : sectionId;
  if (!element) return false;

  const top = getSectionScrollTop(element, options);
  window.scrollTo({
    top,
    behavior: options.behavior ?? 'smooth',
  });

  return true;
};
