// src/hooks/useSmoothScroll.js

/**
 * Custom hook for smooth scrolling functionality
 * Bypasses Lenis and provides standard smooth scroll fallback to avoid performance issues.
 * 
 * @param {Object} options - Configuration options (unused in fallback)
 * @returns {Object} Scroll utilities and state
 */
const useSmoothScroll = () => {
    return {
        scrollTo: (target) => {
            if (typeof target === 'string') {
                const element = document.getElementById(target);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        },
        start: () => { },
        stop: () => { },
        destroy: () => { },
        updateOptions: () => { },
        isSupported: () => true,
        getInstance: () => null,
        scrollState: { progress: 0, direction: 0, velocity: 0, isScrolling: false },
        isScrolling: false,
        scrollProgress: 0,
        scrollDirection: 0,
        scrollVelocity: 0,
        currentSection: null,
    };
};

// Export named utilities for external use
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export const scrollToElement = (element, offset = 0) => {
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
    });
};

export const getScrollProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollY = window.scrollY;

    return scrollY / (documentHeight - windowHeight);
};

export default useSmoothScroll;