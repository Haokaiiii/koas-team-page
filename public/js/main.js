// Main page JavaScript - Animations and interactions with GSAP

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP library not loaded');
        return;
    }

    // Add intersection observer for fade-in animations with GSAP
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all team member cards with optimized settings
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        gsap.set(card, { opacity: 0, y: 20 });
        setTimeout(() => observer.observe(card), index * 50);
    });

    // Smooth photo hover animations with GSAP (scale the IMAGE, not container)
    document.querySelectorAll('.member-card').forEach(card => {
        const photo = card.querySelector('.member-photo');
        if (!photo) return;
        const img = photo.querySelector('img') || photo;

        gsap.set(img, { transformOrigin: '50% 50%' });
        const hoverAnimation = gsap.to(img, {
            scale: 1.06,
            duration: 0.25,
            ease: 'power2.out',
            paused: true
        });

        card.addEventListener('mouseenter', () => {
            hoverAnimation.play();
            photo.classList.add('is-hovered');
        });

        card.addEventListener('mouseleave', () => {
            hoverAnimation.reverse();
            photo.classList.remove('is-hovered');
        });
    });

    // Smooth summary expand/collapse with GSAP - click anywhere on header
    const summaryHeaders = document.querySelectorAll('.summary-header');
    summaryHeaders.forEach(header => {
        const summary = header.closest('.member-summary');
        const content = summary.querySelector('.summary-content');
        
        // Set initial state
        gsap.set(summary, { height: 0 });
        gsap.set(content, { opacity: 0 });
        
        let isExpanded = false;
        let animation = null;

        // Make entire header clickable - use mousedown for better responsiveness
        header.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Kill any ongoing animation
            if (animation) {
                animation.kill();
            }

            isExpanded = !isExpanded;
            
            if (isExpanded) {
                // Expand: measure content height first
                gsap.set(summary, { height: 'auto' });
                const height = summary.offsetHeight;
                gsap.set(summary, { height: 0 });
                
                // Animate to full height
                animation = gsap.to(summary, {
                    height: height,
                    duration: 0.4,
                    ease: 'power2.inOut',
                    onStart: () => {
                        summary.classList.add('expanded');
                    },
                    onComplete: () => {
                        gsap.set(summary, { height: 'auto' });
                    }
                });
                
                // Fade in content
                gsap.to(content, {
                    opacity: 1,
                    duration: 0.3,
                    delay: 0.1,
                    ease: 'power2.out'
                });
            } else {
                // Collapse: get current height first
                const currentHeight = summary.offsetHeight;
                gsap.set(summary, { height: currentHeight });
                
                // Animate to 0
                animation = gsap.to(summary, {
                    height: 0,
                    duration: 0.4,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        summary.classList.remove('expanded');
                    }
                });
                
                // Fade out content
                gsap.to(content, {
                    opacity: 0,
                    duration: 0.2,
                    ease: 'power2.in'
                });
            }
        });
    });
});

