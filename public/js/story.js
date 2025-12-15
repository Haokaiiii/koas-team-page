// Story/History Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Create image modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="modal-close"></span>
        <div class="modal-content">
            <img src="" alt="Full size image">
        </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const modalClose = modal.querySelector('.modal-close');

    // Add image error handling and click functionality
    const timelineImages = document.querySelectorAll('.timeline-image img, .photo-grid-item img');
    
    timelineImages.forEach(img => {
        // Error handling
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });

        // Click to open modal
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            modalImg.src = this.src;
            modalImg.alt = this.alt || 'Full size image';
            modalImg.classList.remove('zoomed'); // Reset zoom state
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Zoom in/out on image click
    modalImg.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('zoomed');
    });

    // Close modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target === modal.querySelector('.modal-content')) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        modalImg.classList.remove('zoomed');
        document.body.style.overflow = '';
    }

    // Smooth scroll for timeline items
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
});

