document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Components
    setupMarquee();
    runCounters();
    setupMobileMenu();
    setupScrollNav();
    setupTestimonialCarousel();
});

/* --- FEATURE 3: TESTIMONIAL CAROUSEL --- */
function setupTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const nextBtn = document.getElementById('test-next');
    const prevBtn = document.getElementById('test-prev');
    const items = document.querySelectorAll('.testimonial-item');

    if (!track || !nextBtn || !prevBtn) return;

    let currentIndex = 0;

    function updateCarousel() {
        if (items.length === 0) return;

        // Calculate how many items are visible based on screen size
        // User requested 2 cards on larger screens
        const itemsToShow = window.innerWidth > 768 ? 2 : 1;
        const maxIndex = items.length - itemsToShow;

        // Clamp current index
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

        // Dynamically measure width and gap
        const firstItem = items[0];
        const itemStyle = window.getComputedStyle(firstItem);
        const trackStyle = window.getComputedStyle(track);

        const itemWidth = firstItem.offsetWidth;
        const marginGap = parseFloat(itemStyle.marginRight) || 0;
        const flexGap = parseFloat(trackStyle.columnGap) || parseFloat(trackStyle.gap) || 0;

        // Use whichever gap is active (margin logic or flex gap logic)
        const gapSize = marginGap + flexGap;

        const scrollAmount = currentIndex * (itemWidth + gapSize);
        track.style.transform = `translateX(-${scrollAmount}px)`;

        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    nextBtn.addEventListener('click', () => {
        const itemsToShow = window.innerWidth > 1100 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        const maxIndex = items.length - itemsToShow;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Handle window resize to keep items aligned
    window.addEventListener('resize', updateCarousel);
}

/* --- FEATURE -1: SMART NAVBAR --- */
function setupScrollNav() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/* --- FEATURE 0: MOBILE MENU --- */
function setupMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const backdrop = document.getElementById('menu-backdrop');
    const links = document.querySelectorAll('.nav-links a');

    if (!mobileBtn) return;

    function toggleMenu() {
        mobileBtn.classList.toggle('open');
        navLinks.classList.toggle('active');
        backdrop.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    mobileBtn.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) toggleMenu();
        });
    });
}

/* --- FEATURE 1: INFINITE MARQUEE --- */
function setupMarquee() {
    const track = document.querySelector('.marquee-track');

    // Safety check: if page doesn't have a marquee, stop here.
    if (!track) return;

    // Grab the original logo list
    const content = track.innerHTML;

    // Repeat 4x to ensure the track is long enough for large screens
    // This creates the [Set 1][Set 2][Set 3][Set 4] structure
    track.innerHTML = content.repeat(4);
}

/* --- FEATURE 2: ROLLING NUMBER COUNTERS --- */
function runCounters() {
    // 1. DYNAMIC YEARS CALCULATION
    const yearsElement = document.getElementById('years-counter');
    if (yearsElement) {
        const currentYear = new Date().getFullYear();
        const yearsCount = currentYear - 2000;
        yearsElement.setAttribute('data-target', yearsCount);
    }

    const counters = document.querySelectorAll('.counter');

    // Intersection Observer to start counting when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                observer.unobserve(counter); // Only animate once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    const suffix = counter.getAttribute('data-suffix') || '';

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const currentValue = Math.floor(easeProgress * (target - start) + start);

        counter.innerText = currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.innerText = target + suffix;
        }
    }

    requestAnimationFrame(update);
}