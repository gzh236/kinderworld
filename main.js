document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Components
    setupMarquee();
    runCounters();
    setupMobileMenu();
    setupScrollNav();
    setupScrollNav();
    setupTestimonialCarousel();
    setupWhatsAppDropdowns();
    setupCopyrightYear();
});

/* --- FEATURE 3: TESTIMONIAL CAROUSEL --- */
function setupTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const nextBtn = document.getElementById('test-next');
    const prevBtn = document.getElementById('test-prev');
    const items = document.querySelectorAll('.testimonial-item');

    if (!track || !nextBtn || !prevBtn) return;

    // Verify context to determine behavior
    const isCurriculum = !!track.closest('#curriculum-carousell');

    // State
    let currentIndex = 0;

    function getItemsToShow() {
        if (window.innerWidth > 1100) {
            return isCurriculum ? 2 : 3;
        } else if (window.innerWidth > 768) {
            return 2;
        }
        return 1;
    }

    function updateCarousel() {
        if (items.length === 0) return;

        // Calculate how many items are visible based on screen size
        const itemsToShow = getItemsToShow();
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

        // --- ADAPTIVE HEIGHT LOGIC ---
        // Find visible items
        let maxHeight = 0;
        for (let i = 0; i < itemsToShow; i++) {
            const index = currentIndex + i;
            if (items[index]) {
                const height = items[index].offsetHeight;
                if (height > maxHeight) maxHeight = height;
            }
        }

        // Add a buffer for shadows/padding if needed (e.g. 40px for padding + shadow)
        // On mobile we killed shadows/padding in CSS, but let's be safe.
        // We will read the current padding of the track or viewport if needed, 
        // but just setting the viewport to the card height is the key.
        // The viewport has its own padding defined in CSS (20px top, etc). 
        // We shouldn't squash that. We just want to ensure it's at least as tall as content.

        // Actually, better strategy: Set viewport style.height to matches content.
        // But the viewport has padding-bottom: 100px on Desktop.
        // On mobile we removed it.
        // Let's simplified: Set viewport height to maxHeight + existing vertical padding.

        // Since viewport is `box-sizing: border-box` (globally), setting height includes padding.
        // MaxHeight from offsetHeight includes the item's padding/border.
        // We need to add the Viewport's OWN padding to avoid clipping.
        const viewport = track.parentElement;
        const viewportStyle = window.getComputedStyle(viewport);
        const vPadTop = parseFloat(viewportStyle.paddingTop) || 0;
        const vPadBot = parseFloat(viewportStyle.paddingBottom) || 0;

        if (maxHeight > 0) {
            viewport.style.height = (maxHeight + vPadTop + vPadBot) + 'px';
        }

        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    nextBtn.addEventListener('click', () => {
        const itemsToShow = getItemsToShow();
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

    // Initial call to set correct height/position
    updateCarousel();
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
/* --- FEATURE 4: WHATSAPP DROPDOWNS --- */
function setupWhatsAppDropdowns() {
    // 1. Remove any old modal if it exists (cleanup)
    const oldModal = document.getElementById('wa-modal');
    if (oldModal) oldModal.remove();

    // 2. Define the Dropdown HTML structure
    const dropdownHTML = `
        <div class="social-dropdown-content">
            <a href="https://wa.me/6281317444851" target="_blank">BSD Campus</a>
            <a href="https://wa.me/6282114974045" target="_blank">Puri Indah Campus</a>
        </div>
    `;

    // 3. Transform Floating Bubble
    const floatLink = document.querySelector('.whatsapp-float');
    if (floatLink) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'social-wrapper whatsapp-float-wrapper';

        // Clone the icon
        const icon = floatLink.querySelector('svg').cloneNode(true);

        // Create new trigger
        const trigger = document.createElement('a');
        trigger.href = 'javascript:void(0)';
        trigger.className = 'whatsapp-float'; // Keep original class for styling
        trigger.appendChild(icon);

        // Create menu
        const menu = document.createElement('div');
        menu.className = 'social-menu';
        menu.innerHTML = dropdownHTML; // Reuse HTML

        // Assemble
        wrapper.appendChild(menu);
        wrapper.appendChild(trigger);

        // Replace
        floatLink.replaceWith(wrapper);
    }

    // 4. Transform "Contact Us / Register" Buttons that link to WhatsApp
    // Note: We only targeting buttons that are NOT the google form ones.
    // Earlier we changed Register buttons to google forms.
    // If there are any remaining WA links (e.g. maybe specific Contact Us buttons), we wrap them too.
    const waLinks = document.querySelectorAll('a[href*="wa.me"]');

    waLinks.forEach(link => {
        // Skip our newly created dropdown links to avoid recursion
        if (link.closest('.social-menu')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'social-wrapper';
        wrapper.style.display = 'inline-block'; // Ensure buttons sit correctly

        // Clone the original button/link
        const trigger = link.cloneNode(true);
        trigger.href = 'javascript:void(0)';

        const menu = document.createElement('div');
        menu.className = 'social-menu';
        menu.innerHTML = dropdownHTML;

        // Insert wrapper before link
        link.parentNode.insertBefore(wrapper, link);

        // Move link into wrapper (as trigger) and add menu
        wrapper.appendChild(menu);
        wrapper.appendChild(trigger);

        // Remove original
        link.remove();
    });

    // 5. Mobile Toggle Support (Tap to open) for all social wrappers
    const wrappers = document.querySelectorAll('.social-wrapper');
    wrappers.forEach(wrap => {
        const trigger = wrap.querySelector('a:not(.social-menu a)'); // The button/icon, not the links inside menu
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                wrappers.forEach(w => {
                    if (w !== wrap) w.classList.remove('active');
                });
                wrap.classList.toggle('active');
            });
        }
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
        wrappers.forEach(w => w.classList.remove('active'));
    });
}

/* --- GLOBAL: DYNAMIC COPYRIGHT YEAR --- */
function setupCopyrightYear() {
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
