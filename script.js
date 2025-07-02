document.addEventListener('DOMContentLoaded', function() {

    'use strict';

    /*================================================
        TABLE OF CONTENTS
    ==================================================
        1.  Preloader Logic
        2.  Mouse Cursor Logic
        3.  Sticky Header Logic
        4.  Form Handling & Validation
        5.  Vehicle Models Tab Logic
        6.  Contact Form Submission (NEW)
    ================================================*/

    /**
     * 1. Preloader Logic
     */
    const preloader = document.querySelector('.nisty-preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.transition = 'opacity 0.5s ease';
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    /**
     * 2. Mouse Cursor Logic
     */
    const cursorOuter = document.querySelector('.nisty-cursor-outer');
    const cursorInner = document.querySelector('.nisty-cursor-inner');
    if (cursorOuter && cursorInner) {
        document.addEventListener('mousemove', e => {
            cursorOuter.style.top = e.clientY + 'px';
            cursorOuter.style.left = e.clientX + 'px';
            cursorInner.style.top = e.clientY + 'px';
            cursorInner.style.left = e.clientX + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, input[type="submit"], .nisty-option-label');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseover', () => cursorOuter.style.transform = 'translate(-50%, -50%) scale(1.5)');
            el.addEventListener('mouseout', () => cursorOuter.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }

    /**
     * 3. Sticky Header Logic
     */
    const header = document.querySelector('.nisty-header');
    if (header) {
        const stickyThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > stickyThreshold) {
                header.classList.add('nisty-sticky');
            } else {
                header.classList.remove('nisty-sticky');
            }
        });
    }

    /**
     * 4. Form Handling & Validation (Service Form)
     */
    const serviceForm = document.getElementById('nisty-service-form');
    if (serviceForm) {
        const dateInput = document.querySelector('input[name="service_date"]');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        const timeSelect = document.querySelector('select[name="service_time"]');
        if (timeSelect) {
            const updateColor = () => {
                timeSelect.style.color = (timeSelect.value === "") ? 'var(--text-muted)' : 'var(--text-dark)';
            };
            timeSelect.addEventListener('change', updateColor);
            updateColor();
        }

        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you'd handle form submission via AJAX.
            // This is a simplified example.
            alert('Service booked successfully! Our team will contact you shortly.');
            this.reset();
            if(timeSelect) timeSelect.dispatchEvent(new Event('change'));
        });
    }

    /**
     * 5. Vehicle Models Tab Logic
     */
    const vehicleSection = document.getElementById('vehiclemodels');
    if (vehicleSection) {
        const tabLinks = vehicleSection.querySelectorAll('.nisty-tab-link');
        const tabContents = vehicleSection.querySelectorAll('.nisty-tab-content');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.dataset.tab;
                tabLinks.forEach(l => l.classList.remove('nisty-active'));
                link.classList.add('nisty-active');
                tabContents.forEach(content => {
                    content.classList.toggle('nisty-active', content.id === tabId);
                });
            });
        });
    }

    /**
     * 6. Contact Form Submission (NEW)
     */
    const contactForm = document.getElementById('nisty-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('.nisty-primary-btn');
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            // Simulate network request
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

});
