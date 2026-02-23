let translations = {};
let currentLang = localStorage.getItem('lang') || 'en'; // Default English

document.addEventListener('DOMContentLoaded', async () => {
    // Load translations
    try {
        // For local development, fetching json might require a server or run into CORS.
        // As a fallback, we fetch, but if it fails (like opening index.html directly), we could include it in a JS variable.
        const response = await fetch('data/content.json');
        translations = await response.json();
    } catch (e) {
        console.warn("Could not load translations via fetch. Loading from fallback variable if defined...");
        // Assuming we might inject it later if needed, or keeping this for server environment.
        // For this static portfolio, if fetch fails (file:// protocol), we would ideally attach it as a JS object.
        // But let's assume standard behavior works (user uses Live Server or prepros).
    }

    // Set initial toggle state UI
    const langSwitcher = document.getElementById('lang-switcher');
    updateLangUI(langSwitcher);
    applyTranslations();

    // Toggle event listener
    if (langSwitcher) {
        const langBtns = langSwitcher.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedLang = e.target.getAttribute('data-lang');
                if (currentLang === selectedLang) return; // Ignore if already selected

                currentLang = selectedLang;
                localStorage.setItem('lang', currentLang);
                updateLangUI(langSwitcher);

                // Add fade out/in animation to the body content
                document.body.style.opacity = '0';
                setTimeout(() => {
                    applyTranslations();
                    document.body.style.opacity = '1';
                    document.body.style.transition = 'opacity 0.4s ease';
                }, 300);
            });
        });
    }
});

function updateLangUI(switcher) {
    if (!switcher) return;
    switcher.setAttribute('data-selected', currentLang);
}

function applyTranslations() {
    if (!translations || !translations[currentLang]) return;

    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key]; // innerHTML allows bolding etc
        }
    });

    const placeholdersToTranslate = document.querySelectorAll('[data-i18n-placeholder]');
    placeholdersToTranslate.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.setAttribute('placeholder', translations[currentLang][key]);
        }
    });
}
