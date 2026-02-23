document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference, otherwise use system preference, default to light
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = 'light';
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (systemPrefersDark) {
        // currentTheme = 'dark'; // User preferred light default
    }

    htmlElement.setAttribute('data-theme', currentTheme);
    if (themeToggle && themeToggle.type === 'checkbox') {
        themeToggle.checked = (currentTheme === 'dark');
    }

    if (themeToggle) {
        // Use 'change' event for checkboxes to stay in sync
        const eventType = themeToggle.type === 'checkbox' ? 'change' : 'click';
        themeToggle.addEventListener(eventType, (e) => {
            if (themeToggle.type === 'checkbox') {
                currentTheme = e.target.checked ? 'dark' : 'light';
            } else {
                currentTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            }
            htmlElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);

            // Optional: Trigger a subtle ripple or flash effect on the body for the transition
            document.body.style.transition = 'background-color 0.5s ease-in-out, color 0.5s ease-in-out';
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('menu-open');
        });
    });
});
