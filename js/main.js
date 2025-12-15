// KOAS Agency - Main JavaScript

// Initialize GSAP
gsap.registerPlugin();

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('KOAS Agency - Team Page Loaded');

    // Initialize animations
    initAnimations();

    // Initialize member cards
    initMemberCards();

    // Initialize responsive behavior
    initResponsive();
});

// Animation initialization
function initAnimations() {
    // Animate header on load
    gsap.from('.header-content', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
    });

    // Animate page title
    gsap.from('.page-title-section', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });

    // Animate department cards
    gsap.from('.department', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 0.6
    });

    // Animate member cards within departments
    gsap.from('.member-card', {
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 1
    });
}

// Member card interactions
function initMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');

    memberCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            });
        });

        // Click to expand member details
        card.addEventListener('click', function() {
            const summary = this.querySelector('.member-summary');
            if (summary) {
                const isExpanded = summary.style.display !== 'none';

                // Close all other expanded cards
                document.querySelectorAll('.member-summary').forEach(s => {
                    if (s !== summary) {
                        gsap.to(s, { duration: 0.3, height: 0, opacity: 0, onComplete: () => s.style.display = 'none' });
                    }
                });

                if (!isExpanded) {
                    summary.style.display = 'block';
                    gsap.fromTo(summary,
                        { height: 0, opacity: 0 },
                        { duration: 0.3, height: 'auto', opacity: 1, ease: 'power3.out' }
                    );
                } else {
                    gsap.to(summary, {
                        duration: 0.3,
                        height: 0,
                        opacity: 0,
                        onComplete: () => summary.style.display = 'none'
                    });
                }
            }
        });
    });
}

// Responsive behavior
function initResponsive() {
    // Handle window resize
    window.addEventListener('resize', function() {
        // Reinitialize grid layouts if needed
        updateGridLayout();
    });

    // Handle mobile menu
    initMobileMenu();

    // Handle scroll effects
    initScrollEffects();
}

function updateGridLayout() {
    const teamMembers = document.querySelectorAll('.team-members');

    teamMembers.forEach(container => {
        const cards = container.querySelectorAll('.member-card');

        if (window.innerWidth < 768) {
            // Mobile: single column
            container.style.gridTemplateColumns = '1fr';
        } else if (window.innerWidth < 1024) {
            // Tablet: 2 columns
            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            // Desktop: auto-fit
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        }
    });
}

function initMobileMenu() {
    // Create mobile menu toggle if needed
    const headerNav = document.querySelector('.header-nav');
    const headerTop = document.querySelector('.header-top');

    if (window.innerWidth < 768 && headerNav) {
        // Add mobile menu button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '☰';
        mobileToggle.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
        `;

        headerTop.appendChild(mobileToggle);

        // Toggle mobile menu
        mobileToggle.addEventListener('click', function() {
            headerNav.classList.toggle('mobile-open');
            this.innerHTML = headerNav.classList.contains('mobile-open') ? '✕' : '☰';
        });

        // Show toggle button
        mobileToggle.style.display = 'block';
    }
}

function initScrollEffects() {
    // Parallax effect for header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');

        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            header.style.opacity = Math.max(0.8, 1 - scrolled / 500);
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service worker registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker can be added later for caching
        console.log('Service Worker support detected');
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Monitor animations
    if (window.performance && window.performance.mark) {
        window.performance.mark('animation-start');
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Export functions for potential use by other scripts
window.KOAS = {
    initAnimations,
    initMemberCards,
    initResponsive,
    updateGridLayout
};