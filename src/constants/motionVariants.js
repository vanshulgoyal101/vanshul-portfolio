// Shared Framer Motion variants. Reveals are short and travel a few pixels so
// content feels immediate; MotionConfig drops the movement for reduced motion.

const EASE_OUT = [0.22, 1, 0.36, 1];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
    },
  },
};
