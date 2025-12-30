document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Components
    setupMarquee();
    runCounters();
});

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