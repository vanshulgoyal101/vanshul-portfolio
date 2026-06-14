// src/hooks/useSmoothScroll.js
import { useEffect, useRef, useCallback, useState } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Custom hook for smooth scrolling functionality
 * Integrates with Lenis and provides utility functions for scroll-based animations
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Scroll animation duration (default: 1.2)
 * @param {Function} options.easing - Easing function for scroll animation
 * @param {boolean} options.smoothWheel - Enable smooth wheel scrolling (default: true)
 * @param {boolean} options.smoothTouch - Enable smooth touch scrolling (default: false)
 * @param {number} options.wheelMultiplier - Mouse wheel scroll multiplier (default: 1)
 * @param {number} options.touchMultiplier - Touch scroll multiplier (default: 2)
 * @param {Function} options.onScroll - Callback function triggered on scroll
 * @returns {Object} Scroll utilities and state
 */
const useSmoothScroll = (options = {}) => {
    // Temporarily disable smooth scroll
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

    // All the original code below won't execute

    // Default options with user overrides
    const defaultOptions = {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        onScroll: null,
    };

    const config = { ...defaultOptions, ...options };

    // Refs for instance management
    const lenisRef = useRef(null);
    const rafRef = useRef(null);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);

    // State for scroll-related data
    const [scrollState, setScrollState] = useState({
        progress: 0,
        direction: 0,
        velocity: 0,
        isScrolling: false,
        targetProgress: 0,
        currentSection: null,
    });

    // Initialize Lenis instance
    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === 'undefined') return;

        try {
            // Create Lenis instance with configuration
            const lenis = new Lenis({
                duration: config.duration,
                easing: config.easing,
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: config.smoothWheel,
                smoothTouch: config.smoothTouch,
                wheelMultiplier: config.wheelMultiplier,
                touchMultiplier: config.touchMultiplier,
                infinite: false,
            });

            lenisRef.current = lenis;

            // Handle scroll events with performance optimization
            const handleScroll = (e) => {
                // Update scroll state
                setScrollState({
                    progress: e.progress,
                    direction: e.direction,
                    velocity: e.velocity,
                    isScrolling: true,
                    targetProgress: e.targetProgress,
                    currentSection: getCurrentSection(e.animatedScroll),
                });

                // Set scrolling flag
                isScrollingRef.current = true;

                // Clear existing timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }

                // Set new timeout to detect scroll end
                scrollTimeoutRef.current = setTimeout(() => {
                    isScrollingRef.current = false;
                    setScrollState(prev => ({ ...prev, isScrolling: false }));
                }, 150);

                // Execute custom scroll callback if provided
                if (config.onScroll && typeof config.onScroll === 'function') {
                    config.onScroll(e);
                }
            };

            // Subscribe to scroll events
            lenis.on('scroll', handleScroll);

            // Animation frame loop
            const raf = (time) => {
                lenis.raf(time);
                rafRef.current = requestAnimationFrame(raf);
            };

            rafRef.current = requestAnimationFrame(raf);

            // Cleanup function
            return () => {
                // Remove scroll listener
                lenis.off('scroll', handleScroll);

                // Destroy Lenis instance
                lenis.destroy();

                // Cancel animation frame
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }

                // Clear timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        } catch (error) {
            console.error('Error initializing smooth scroll:', error);
        }
    }, [config.duration, config.easing, config.smoothWheel, config.smoothTouch,
    config.wheelMultiplier, config.touchMultiplier, config.onScroll]);

    /**
     * Get current section based on scroll position
     * @param {number} scrollY - Current scroll position
     * @returns {string|null} Current section ID
     */
    const getCurrentSection = useCallback((scrollY) => {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = null;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const offset = window.innerHeight * 0.5; // 50% of viewport height

            if (rect.top <= offset && rect.bottom >= offset) {
                currentSection = section.getAttribute('id');
            }
        });

        return currentSection;
    }, []);

    /**
     * Scroll to a specific element or position
     * @param {string|number|HTMLElement} target - Target to scroll to
     * @param {Object} options - Scroll options
     */
    const scrollTo = useCallback((target, options = {}) => {
        if (!lenisRef.current) return;

        const defaultScrollOptions = {
            offset: 0,
            duration: config.duration,
            easing: config.easing,
            immediate: false,
            force: false,
            lock: false,
            onComplete: null,
        };

        const scrollOptions = { ...defaultScrollOptions, ...options };

        try {
            lenisRef.current.scrollTo(target, scrollOptions);
        } catch (error) {
            console.error('Error scrolling to target:', error);
        }
    }, [config.duration, config.easing]);

    /**
     * Start scrolling
     */
    const start = useCallback(() => {
        if (lenisRef.current) {
            lenisRef.current.start();
        }
    }, []);

    /**
     * Stop scrolling
     */
    const stop = useCallback(() => {
        if (lenisRef.current) {
            lenisRef.current.stop();
        }
    }, []);

    /**
     * Destroy the smooth scroll instance
     */
    const destroy = useCallback(() => {
        if (lenisRef.current) {
            lenisRef.current.destroy();
        }
    }, []);

    /**
     * Update Lenis options dynamically
     * @param {Object} newOptions - New options to apply
     */
    const updateOptions = useCallback((newOptions) => {
        if (lenisRef.current) {
            Object.assign(lenisRef.current.options, newOptions);
        }
    }, []);

    /**
     * Check if smooth scroll is supported
     * @returns {boolean} Whether smooth scroll is supported
     */
    const isSupported = useCallback(() => {
        // Check for required features
        return (
            typeof window !== 'undefined' &&
            'requestAnimationFrame' in window &&
            'cancelAnimationFrame' in window
        );
    }, []);

    /**
     * Get current Lenis instance
     * @returns {Lenis|null} Current Lenis instance
     */
    const getInstance = useCallback(() => {
        return lenisRef.current;
    }, []);

    return {
        // Methods
        scrollTo,
        start,
        stop,
        destroy,
        updateOptions,
        isSupported,
        getInstance,

        // State
        scrollState,

        // Refs for direct access if needed
        lenisRef,

        // Utility flags
        isScrolling: scrollState.isScrolling,
        scrollProgress: scrollState.progress,
        scrollDirection: scrollState.direction,
        scrollVelocity: scrollState.velocity,
        currentSection: scrollState.currentSection,
    };
};

// Export named utilities for external use
export const scrollToTop = (duration = 1) => {
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