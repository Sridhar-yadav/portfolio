/* ==========================================================================
   Main JavaScript Logic
   ========================================================================== */

/*
  Wait for the DOM to be fully loaded before running scripts 
  This ensures all HTML elements are available for manipulation
*/
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Theme Toggle Logic
       ========================================================================== */

    // Select the toggle button element by its ID
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Select the root HTML element to modify attributes
    const htmlElement = document.documentElement;

    // Key used to store theme preference in LocalStorage
    const THEME_STORAGE_KEY = 'portfolio-theme';

    /**
     * Function to apply a specific theme to the document
     * @param {string} theme - 'light' or 'dark'
     */
    function applyTheme(theme) {
        if (theme === 'light') {
            // Set data-theme attribute to light to trigger CSS overrides
            htmlElement.setAttribute('data-theme', 'light');
            // Log for debugging
            console.log('Applied Light Theme');
        } else {
            // Remove the attribute to fallback to default (Dark) CSS variables
            htmlElement.removeAttribute('data-theme');
            // Log for debugging
            console.log('Applied Dark Theme');
        }
    }

    /**
     * Function to initialize theme based on saved preference or system default
     */
    function initTheme() {
        // Check if user has a saved preference in LocalStorage
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme) {
            // If saved, apply it
            applyTheme(savedTheme);
        } else {
            // Optional: Check system preference (prefers-color-scheme)
            // For this portfolio, we default to Dark as per requirements, 
            // but we could detect system settings here if we wanted.
            // applyTheme('dark'); // Explicitly default (though CSS handles this)
        }
    }

    // Run initialization immediately
    initTheme();

    // Add click event listener to the toggle button
    themeToggleBtn.addEventListener('click', () => {
        // Check if currently logic is effectively light (has attribute)
        const isLight = htmlElement.hasAttribute('data-theme');

        // Determine the new theme
        const newTheme = isLight ? 'dark' : 'light';

        // Apply the new theme
        applyTheme(newTheme);

        // Save the preference to LocalStorage so it persists across reloads
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });

    /* ==========================================================================
       Mobile Navigation Logic
       ========================================================================== */

    // Select the hamburger menu button
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    // Select the navigation container
    const navMenu = document.querySelector('.main-nav');

    // Add click event listener to the mobile menu button
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle the 'active' class on the container to show/hide menu
        navMenu.classList.toggle('active');

        // Optional: Animate hamburger icon (e.g. turn to X) - handled via CSS usually?
        // For now, simple class toggle is enough for the drawer effect.

        // Log interaction
        console.log('Mobile menu toggled');
    });

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class to close menu
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    /* ==========================================================================
       Typing Effect Logic
       ========================================================================== */

    const typingElement = document.querySelector('.typing-text');
    const roles = ["Lakdaram Sridhar Yadav", "Frontend Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Remove characters
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deleting speed
        } else {
            // Add characters
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing word, pause before deleting
            isDeleting = true;
            typeSpeed = 2000; // Wait 2 seconds
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start the typing effect
    if (typingElement) {
        typeEffect();
    }

    /* ==========================================================================
       Scroll Reveal Logic (Intersection Observer)
       ========================================================================== */

    // Select elements to animate
    const revealElements = document.querySelectorAll('.section-title, .about-content, .skill-card, .hero-text, .hero-visual');

    // Add 'reveal' class initially
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       3D Tilt Effect Logic (Custom Lightweight Implementation)
       ========================================================================== */

    const tiltCards = document.querySelectorAll('.skill-card, .visual-glass-card');

    tiltCards.forEach(card => {
        card.classList.add('tilt-card'); // Ensure CSS context is there

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X position within element
            const y = e.clientY - rect.top; // Mouse Y position within element

            // Calculate rotation (max 15 degrees)
            const xCenter = rect.width / 2;
            const yCenter = rect.height / 2;

            const rotateX = ((y - yCenter) / yCenter) * -10; // Negative to tilt away
            const rotateY = ((x - xCenter) / xCenter) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transformation on mouse leave
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

});
