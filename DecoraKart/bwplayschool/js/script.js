document.addEventListener('DOMContentLoaded', () => {
    /* Mobile Menu Toggle */
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    /* Smooth Scrolling & Menu Closing */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                // Use window.scrollY instead of window.pageYOffset
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* Form Validation & Submission */
    const form = document.getElementById('admissionForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Clear previous status
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Validation
            const mobileInput = document.getElementById('mobileNumber');
            const mobileValue = mobileInput.value.trim();
            const ageInput = document.getElementById('childAge');
            const ageValue = parseInt(ageInput.value, 10);

            let isValid = true;
            let firstError = null;

            // Simple validation helper
            const showError = (input, msg) => {
                const errorSpan = input.nextElementSibling;
                if (errorSpan && errorSpan.classList.contains('error-msg')) {
                    errorSpan.style.display = 'block';
                }
                isValid = false;
                if (!firstError) firstError = input;
            };

            const clearErrors = () => {
                document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
            };

            clearErrors();

            if (!/^\d{10}$/.test(mobileValue)) {
                showError(mobileInput, 'Please enter a valid 10-digit mobile number.');
            }

            if (isNaN(ageValue) || ageValue < 1 || ageValue > 10) {
                showError(ageInput, 'Please enter a valid age (1-10 years).');
            }

            // Check standard required attributes
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    showError(input, 'This field is required');
                }
            });

            if (!isValid) {
                if (firstError) firstError.focus();
                return;
            }

            // Prepare Data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            console.log('Submission Data:', data); // Log to console

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Mock submission if ID is not configured
            const formspreeId = 'YOUREXAMPLEID'; // Replace this with your actual Formspree ID

            try {
                let response;
                if (formspreeId === 'YOUREXAMPLEID') {
                    // Simulate success for demo purposes
                    console.warn('Formspree ID not configured. Simulating success.');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    response = { ok: true };
                } else {
                    response = await fetch(`https://formspree.io/f/${formspreeId}`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                }

                if (response.ok) {
                    formStatus.textContent = "Thank you — we received your enquiry.";
                    formStatus.classList.add('success');
                    form.reset();
                    // Focus for accessibility
                    formStatus.focus();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Submission failed');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                formStatus.textContent = "Oops! Something went wrong. Please try again or call us.";
                formStatus.classList.add('error');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = "block";
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.nextElementSibling ? img.nextElementSibling.textContent : '';
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on visual close (keyboard accessibility)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });
    }

});
