// Reveal animations utility
export function initRevealAnimations() {
  // Create intersection observer for reveal animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          entry.target.classList.remove('hidden');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe all elements with reveal classes
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  revealElements.forEach((element) => {
    // Add hidden class initially for animation
    element.classList.add('hidden');
    observer.observe(element);
  });

  return observer;
}

// Initialize reveal animations when DOM is loaded
export function setupRevealAnimations() {
  if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initRevealAnimations);
    } else {
      initRevealAnimations();
    }
  }
}

// Clean up observer when needed
export function cleanupRevealAnimations(observer) {
  if (observer) {
    observer.disconnect();
  }
}
