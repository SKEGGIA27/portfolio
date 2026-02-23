document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close-modal-btn');
    const form = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');
    const submitBtn = document.getElementById('submitContactBtn');

    // Select all buttons that should open the modal
    const openBtns = document.querySelectorAll('.open-contact-modal');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-type');
            openModal(type);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission via AJAX
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Show sending state
            const originalBtnHtml = submitBtn.innerHTML;
            const lang = localStorage.getItem('lang') || 'it';
            const sendingText = window.translations?.[lang]?.['contact_form_sending'] || 'Invio in corso...';
            submitBtn.innerHTML = `<span>${sendingText}</span> <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>`;
            submitBtn.disabled = true;
            formMessages.innerHTML = '';
            formMessages.className = 'form-messages';

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.reset();

                    // Trigger animation
                    const formContainer = document.getElementById('formContainer');
                    const successAnimationContainer = document.getElementById('successAnimationContainer');
                    const animationStage = document.getElementById('animationStage');
                    const successTextNode = document.getElementById('successText');

                    if (formContainer && successAnimationContainer && animationStage && successTextNode) {
                        formContainer.classList.add('fade-out');

                        successAnimationContainer.classList.add('active');

                        setTimeout(() => {
                            animationStage.classList.add('animating');
                        }, 500);

                        setTimeout(() => {
                            successTextNode.classList.add('show');
                        }, 3500);
                    } else {
                        // Fallback behavior if animation nodes are missing
                        const successText = window.translations?.[lang]?.['contact_form_success'] || 'Messaggio inviato con successo!';
                        formMessages.innerHTML = successText;
                        formMessages.classList.add('success');
                        formMessages.style.display = 'block';
                    }
                } else {
                    const errorText = window.translations?.[lang]?.['contact_form_error'] || 'Si è verificato un errore. Riprova più tardi.';
                    formMessages.innerHTML = errorText;
                    formMessages.classList.add('error');
                    formMessages.style.display = 'block';
                }
            } catch (error) {
                const errorText = window.translations?.[lang]?.['contact_form_error'] || 'Si è verificato un errore. Riprova più tardi.';
                formMessages.innerHTML = errorText;
                formMessages.classList.add('error');
                console.error(error);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
            }
        });
    }

    function resetAnimationState() {
        const formContainer = document.getElementById('formContainer');
        const successAnimationContainer = document.getElementById('successAnimationContainer');
        const animationStage = document.getElementById('animationStage');
        const successTextNode = document.getElementById('successText');

        if (formContainer) formContainer.classList.remove('fade-out');
        if (animationStage) animationStage.classList.remove('animating');
        if (successTextNode) successTextNode.classList.remove('show');
        if (successAnimationContainer) {
            successAnimationContainer.classList.remove('active');
        }
        if (formMessages) {
            formMessages.innerHTML = '';
            formMessages.className = 'form-messages';
            formMessages.style.display = 'none';
        }
    }

    const resetFormBtn = document.getElementById('resetFormBtn');
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', resetAnimationState);
    }

    function openModal(type) {
        // Reset form and messages when opening
        if (form) form.reset();
        resetAnimationState();

        const subjectInput = document.getElementById('messageSubject');
        const bodyInput = document.getElementById('messageBody');

        if (type === 'cv' && subjectInput && bodyInput) {
            const lang = localStorage.getItem('lang') || 'it';
            const trans = window.translations?.[lang];

            if (trans) {
                subjectInput.value = trans['cv_request_subject'] || 'Richiesta CV studente';
                bodyInput.value = trans['cv_request_message'] || 'Salve Luca, vorrei richiedere il tuo CV da studente. Attendo tue notizie. Grazie!';
            }
        }

        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling

            // Reset the internal views back to the form once the modal finishes fading out
            setTimeout(() => {
                resetAnimationState();
                if (form) form.reset();
            }, 300);
        }
    }
});
