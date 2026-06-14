/**
 * Blog-related constants and configuration
 */

// Animation variants for blog components
export const BLOG_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  },
  modal: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  }
};

// Default blog settings
export const BLOG_CONFIG = {
  postsPerPage: 9,
  defaultCategory: 'All',
  defaultSortOrder: 'desc', // 'desc' for newest first, 'asc' for oldest first
  wordsPerMinute: 200, // Average reading speed
};

// Blog categories
export const BLOG_CATEGORIES = {
  ALL: 'All',
  AI: 'AI',
  TECH_INDUSTRY: 'Tech Industry',
  FUTURE_OF_WORK: 'Future of Work',
};

// Blog section text content
export const BLOG_CONTENT = {
  sectionTitle: 'Writings',
  sectionSubtitle: 'A collection of thoughts and insights (More coming soon...)',
  emptyStateTitle: 'Coming Soon',
  emptyStateMessage: "I'm currently crafting my thoughts into words. Check back soon for insights and stories from my journey.",
  quote: {
    text: "Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.",
    author: 'Naval Ravikant'
  }
};
