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

            // Prepare Data for WhatsApp
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Construct Message
            const message = `
*New Admission Enquiry* 📝
---------------------------
*Child Name:* ${data.childName}
*Age:* ${data.childAge} Years
*Class:* ${data.classApplying}
*Parent Name:* ${data.parentName}
*Mobile:* ${data.mobileNumber}
*Message:* ${data.message || 'N/A'}
---------------------------
Sent via Website.
            `.trim();

            const phoneNumber = '919142015565';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            // Simulate "Sending" state briefly then redirect
            // Showing success message first
            formStatus.textContent = "Redirecting to WhatsApp...";
            formStatus.classList.add('success');

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                form.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                formStatus.textContent = "Thank you! Please click 'Send' in WhatsApp to complete the enquiry.";
            }, 1000);

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
