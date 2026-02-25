document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
    };

    const revealOnScroll = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                self.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Project Info Accordions
    const projectInfoBtns = document.querySelectorAll('.project-info-btn');
    projectInfoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            const desc = card.querySelector('.project-desc');
            const icon = btn.querySelector('i');
            const textSpan = btn.querySelector('span[data-i18n]');

            const wasOpen = desc.classList.contains('open');

            // Close all open descriptions first
            document.querySelectorAll('.project-desc.open').forEach(openDesc => {
                openDesc.classList.remove('open');
                const openCard = openDesc.closest('.project-card');
                if (openCard) {
                    const openIcon = openCard.querySelector('.project-info-btn i');
                    const openSpan = openCard.querySelector('.project-info-btn span[data-i18n]');
                    if (openIcon) openIcon.className = 'fas fa-info-circle';
                    if (openSpan) openSpan.setAttribute('data-i18n', 'proj_more_info');
                }
            });

            // If the clicked one wasn't open, open it now (acting as an accordion toggle)
            if (!wasOpen) {
                desc.classList.add('open');
                icon.className = 'fas fa-times';
                if (textSpan) textSpan.setAttribute('data-i18n', 'proj_close_info');
            }

            // Refresh translations to securely update the text
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
        });
    });

    // === Desktop-only Interactive Effects ===
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const interactiveCards = document.querySelectorAll('.project-card, .skills-category, .moment-item');

        interactiveCards.forEach(el => {
            // 3D Magnetic Tilt + Mouse Spotlight (combined)
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;

                // 3D Tilt (max ±5°)
                const rotateX = ((y - cy) / cy) * -5;
                const rotateY = ((x - cx) / cx) * 5;
                el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                el.style.transition = 'transform 0.1s ease-out';

                // Mouse Spotlight (CSS custom properties)
                el.style.setProperty('--mx', `${x}px`);
                el.style.setProperty('--my', `${y}px`);
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });
    }
});
