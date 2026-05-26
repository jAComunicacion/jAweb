/* Version 2 Interactions */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const icon = question.querySelector('.icon');

        question.addEventListener('click', () => {
            // Toggle active class
            const isActive = item.classList.contains('active');

            // Close others (optional - standard accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.icon');
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });

            if (!isActive) {
                item.classList.add('active');
                if (icon) icon.textContent = '-';
            } else {
                item.classList.remove('active');
                if (icon) icon.textContent = '+';
            }
        });
    });

    // --- 1.5 CAROUSEL MOBILE HINT ---
    function initCarouselHint() {
        const carousels = document.querySelectorAll('.carousel-container');
        const isMobile = window.innerWidth <= 768;
        carousels.forEach(carousel => {
            const hint = carousel.previousElementSibling;
            if (isMobile && (!hint || !hint.classList.contains('carousel-hint'))) {
                const newHint = document.createElement('div');
                newHint.className = 'carousel-hint';
                newHint.innerText = '↻ Desliza horizontal para más';
                carousel.parentNode.insertBefore(newHint, carousel);
            }
        });
    }
    setTimeout(initCarouselHint, 100);
    window.addEventListener('resize', initCarouselHint);

    // --- 2. CAROUSEL ---
    function initCarousel(containerId, nextBtnId, prevBtnId) {
        const container = document.getElementById(containerId);
        const nextBtn = document.getElementById(nextBtnId);
        const prevBtn = document.getElementById(prevBtnId);

        if (!container) return;

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Scroll right by 1/2 container width
                container.scrollBy({ left: 350, behavior: 'smooth' });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                container.scrollBy({ left: -350, behavior: 'smooth' });
            });
        }
    }

    // Initialize Desktop Carousel
    initCarousel('carousel-desktop', 'btn-next-desktop', 'btn-prev-desktop');

    // Initialize Mobile/Footer Carousel
    initCarousel('carousel-mobile', 'btn-next-mobile', null);

});
