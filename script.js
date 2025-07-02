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
        6.  Contact Form Submission
        7.  Chatbot Logic (UPGRADED)
        8.  Active Nav Link on Scroll (NEW)
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

            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }


    /*================================================
        7. Chatbot Logic (UPGRADED)
    ================================================*/
    const chatbotContainer = document.querySelector('.nisty-chatbot-container');
    if (chatbotContainer) {
        const toggleBtn = document.getElementById('nisty-chatbot-toggle-btn');
        const closeBtn = document.getElementById('nisty-close-chat-btn');
        const chatBody = document.getElementById('nisty-chat-body');
        const chatInput = document.getElementById('nisty-chat-input');
        const sendBtn = document.getElementById('nisty-send-btn');
        const quickRepliesContainer = document.getElementById('nisty-quick-replies');
        const proactiveBubble = document.getElementById('nisty-proactive-bubble');

        let proactiveTimeout = setTimeout(() => {
            if (!chatbotContainer.classList.contains('open')) {
                proactiveBubble.classList.add('show');
            }
        }, 5000);

        toggleBtn.addEventListener('click', () => {
            chatbotContainer.classList.toggle('open');
            if (chatbotContainer.classList.contains('open') && chatBody.children.length === 0) {
                handleSendMessage('init');
            }
            proactiveBubble.classList.remove('show');
            clearTimeout(proactiveTimeout);
        });

        closeBtn.addEventListener('click', () => {
            chatbotContainer.classList.remove('open');
        });

        sendBtn.addEventListener('click', () => handleSendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });

        function addMessageToChat(messageData) {
            quickRepliesContainer.innerHTML = '';
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('nisty-chat-message', `${messageData.sender}-message`);
            const p = document.createElement('p');
            p.innerHTML = messageData.text;
            messageDiv.appendChild(p);
            chatBody.appendChild(messageDiv);

            if (messageData.quick_replies && messageData.quick_replies.length > 0) {
                quickRepliesContainer.style.display = 'flex';
                messageData.quick_replies.forEach(reply => {
                    const button = document.createElement('button');
                    button.classList.add('nisty-quick-reply-btn');
                    button.textContent = reply;
                    button.onclick = () => {
                        addMessageToChat({ text: reply, sender: 'user' });
                        handleSendMessage(reply);
                    };
                    quickRepliesContainer.appendChild(button);
                });
            } else {
                quickRepliesContainer.style.display = 'none';
            }
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('nisty-chat-message', 'bot-message', 'typing-indicator');
            typingDiv.innerHTML = `<p><span></span><span></span><span></span></p>`;
            typingDiv.id = 'typing-indicator';
            chatBody.appendChild(typingDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
            quickRepliesContainer.style.display = 'none';
        }

        function removeTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) {
                indicator.remove();
            }
        }

        async function handleSendMessage(predefinedMessage = null) {
            const message = predefinedMessage || chatInput.value.trim();
            if (message === '') return;
            if (!predefinedMessage) {
                addMessageToChat({ text: message, sender: 'user' });
            }
            chatInput.value = '';
            showTypingIndicator();

            try {
                const response = await fetch('chatbot_backend.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `message=${encodeURIComponent(message)}`
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const botResponse = await response.json();
                removeTypingIndicator();
                addMessageToChat(botResponse);
            } catch (error) {
                console.error('Chatbot Error:', error);
                removeTypingIndicator();
                addMessageToChat({
                    sender: 'bot',
                    text: "I'm having trouble connecting to my brain right now. Please try again in a moment.",
                    quick_replies: []
                });
            }
        }
    }

    /*================================================
        8. Active Nav Link on Scroll (NEW)
    ================================================*/
    const navLinks = document.querySelectorAll('.nisty-nav a');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Consider the header height for accurate activation
            if (scrollY >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            // Check if the link's href matches the current section's ID
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.parentElement.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Run on page load

});