// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Live chat functionality
    const chatWidget = document.getElementById('chatWidget');
    const startChatBtn = document.getElementById('startChat');
    const chatMinimize = document.getElementById('chatMinimize');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    let chatVisible = false;

    // Start chat
    if (startChatBtn) {
        startChatBtn.addEventListener('click', function() {
            chatWidget.style.display = 'flex';
            chatVisible = true;
            chatInput.focus();
        });
    }

    // Minimize chat
    if (chatMinimize) {
        chatMinimize.addEventListener('click', function() {
            chatWidget.style.display = 'none';
            chatVisible = false;
        });
    }

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const responses = [
                    "Thanks for your message! I'll get back to you shortly.",
                    "I understand your question. Let me help you with that.",
                    "That's a great question! I'll provide you with detailed information.",
                    "I appreciate you reaching out. How can I assist you further?"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }

    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Quick replies
    document.querySelectorAll('.quick-reply').forEach(button => {
        button.addEventListener('click', function() {
            const message = this.dataset.message;
            addMessage(message, 'user');
            
            // Remove quick replies after use
            this.parentElement.remove();
            
            // Simulate response based on quick reply
            setTimeout(() => {
                let response = '';
                if (message.includes('quote')) {
                    response = "I'd be happy to provide a quote! Please fill out the contact form with your project details, and I'll get back to you within 24 hours with a detailed estimate.";
                } else if (message.includes('technical')) {
                    response = "For technical support, please describe your issue in detail. You can also submit a support ticket using the form below for faster assistance.";
                } else if (message.includes('project')) {
                    response = "Great! I'd love to discuss your project. What type of mobile app are you looking to build? iOS, Android, or cross-platform?";
                }
                addMessage(response, 'bot');
            }, 1500);
        });
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Support request functionality
    const supportButtons = document.querySelectorAll('.support-btn');
    const supportModal = document.getElementById('supportModal');
    const supportModalTitle = document.getElementById('supportModalTitle');
    const supportForm = document.getElementById('supportForm');

    supportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            let title = 'Support Request';
            let subject = '';

            switch(type) {
                case 'bug':
                    title = 'Bug Report';
                    subject = 'Bug Report: ';
                    break;
                case 'technical':
                    title = 'Technical Support';
                    subject = 'Technical Support: ';
                    break;
                case 'feature':
                    title = 'Feature Request';
                    subject = 'Feature Request: ';
                    break;
            }

            supportModalTitle.textContent = title;
            document.getElementById('supportSubject').value = subject;
            supportModal.style.display = 'flex';
        });
    });

    // Support form submission
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Support request submitted successfully! Ticket #' + Math.floor(Math.random() * 10000) + ' created.', 'success');
                supportForm.reset();
                supportModal.style.display = 'none';
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Contact form enhancements
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Dynamic form behavior based on project type
        const projectTypeSelect = document.getElementById('projectType');
        const budgetSelect = document.getElementById('budget');
        const timelineSelect = document.getElementById('timeline');

        if (projectTypeSelect) {
            projectTypeSelect.addEventListener('change', function() {
                const selectedType = this.value;
                
                // Update budget options based on project type
                if (budgetSelect) {
                    const budgetOptions = {
                        'new-app': [
                            { value: '5k-15k', text: '$5,000 - $15,000' },
                            { value: '15k-30k', text: '$15,000 - $30,000' },
                            { value: '30k-50k', text: '$30,000 - $50,000' },
                            { value: 'over-50k', text: 'Over $50,000' }
                        ],
                        'app-update': [
                            { value: 'under-5k', text: 'Under $5,000' },
                            { value: '5k-15k', text: '$5,000 - $15,000' },
                            { value: '15k-30k', text: '$15,000 - $30,000' }
                        ],
                        'app-support': [
                            { value: 'under-5k', text: 'Under $5,000' },
                            { value: '5k-15k', text: '$5,000 - $15,000' }
                        ],
                        'consulting': [
                            { value: 'under-5k', text: 'Under $5,000' },
                            { value: '5k-15k', text: '$5,000 - $15,000' }
                        ]
                    };

                    if (budgetOptions[selectedType]) {
                        budgetSelect.innerHTML = '<option value="">Select budget range</option>';
                        budgetOptions[selectedType].forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.textContent = option.text;
                            budgetSelect.appendChild(optionElement);
                        });
                    }
                }
            });
        }

        // Form validation with real-time feedback
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        function validateField(field) {
            const value = field.value.trim();
            const fieldType = field.type;
            let isValid = true;
            let errorMessage = '';

            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (fieldType === 'email' && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            } else if (fieldType === 'tel' && value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }

            updateFieldValidation(field, isValid, errorMessage);
            return isValid;
        }

        function updateFieldValidation(field, isValid, errorMessage) {
            const fieldGroup = field.closest('.form-group');
            let errorElement = fieldGroup.querySelector('.field-error');

            if (isValid) {
                field.classList.remove('error');
                field.classList.add('valid');
                if (errorElement) {
                    errorElement.remove();
                }
            } else {
                field.classList.remove('valid');
                field.classList.add('error');
                
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'field-error';
                    fieldGroup.appendChild(errorElement);
                }
                errorElement.textContent = errorMessage;
            }
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        }

        // Enhanced form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });

            // Validate platform checkboxes
            const platformCheckboxes = contactForm.querySelectorAll('input[name="platform"]:checked');
            if (platformCheckboxes.length === 0) {
                isFormValid = false;
                showNotification('Please select at least one platform', 'error');
            }

            if (isFormValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                    contactForm.reset();
                    
                    // Reset field validation classes
                    requiredFields.forEach(field => {
                        field.classList.remove('valid', 'error');
                    });
                    
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }

    // File upload handling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    showNotification('File size must be less than 10MB', 'error');
                    this.value = '';
                } else {
                    showNotification(`File "${file.name}" selected`, 'success');
                }
            }
        });
    });

    // Auto-save form data to localStorage
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    formInputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`contact_${input.name}`);
        if (savedValue && input.type !== 'checkbox') {
            input.value = savedValue;
        } else if (savedValue && input.type === 'checkbox') {
            input.checked = savedValue === 'true';
        }

        // Save data on change
        input.addEventListener('input', function() {
            if (this.type === 'checkbox') {
                localStorage.setItem(`contact_${this.name}`, this.checked);
            } else {
                localStorage.setItem(`contact_${this.name}`, this.value);
            }
        });
    });

    // Clear saved form data after successful submission
    function clearSavedFormData() {
        formInputs.forEach(input => {
            localStorage.removeItem(`contact_${input.name}`);
        });
    }

    // Notification system (if not already defined in main.js)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
});

// Contact page specific CSS
const contactStyles = `
    .chat-widget {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        z-index: 10000;
        overflow: hidden;
    }
    
    .chat-header {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .chat-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
    }
    
    .chat-info h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }
    
    .chat-status-text {
        font-size: 12px;
        opacity: 0.9;
    }
    
    .chat-minimize {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .chat-minimize:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #f9fafb;
    }
    
    .chat-message {
        display: flex;
        margin-bottom: 16px;
        align-items: flex-start;
        gap: 8px;
    }
    
    .chat-message.user {
        flex-direction: row-reverse;
    }
    
    .chat-message .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
    }
    
    .chat-message.bot .message-avatar {
        background: #2563eb;
        color: white;
    }
    
    .chat-message.user .message-avatar {
        background: #10b981;
        color: white;
    }
    
    .message-content {
        max-width: 70%;
        background: white;
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .chat-message.user .message-content {
        background: #2563eb;
        color: white;
    }
    
    .message-content p {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .quick-replies {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;
    }
    
    .quick-reply {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
    }
    
    .quick-reply:hover {
        background: #e5e7eb;
        border-color: #d1d5db;
    }
    
    .chat-input {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
        background: white;
    }
    
    .chat-input input {
        flex: 1;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
    }
    
    .chat-input input:focus {
        border-color: #2563eb;
    }
    
    .chat-send {
        width: 40px;
        height: 40px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }
    
    .chat-send:hover {
        background: #1d4ed8;
    }
    
    .live-chat-card {
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        margin-top: 24px;
    }
    
    .chat-btn {
        margin: 16px 0;
    }
    
    .chat-status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        color: #6b7280;
    }
    
    .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
    }
    
    .status-indicator.online {
        background: #10b981;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    
    .contact-form-container,
    .contact-info-container {
        background: white;
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .contact-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 32px;
        margin-top: 32px;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    
    .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    
    .contact-info-card {
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;
    }
    
    .contact-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .contact-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
    }
    
    .contact-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
    }
    
    .contact-details h4 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
    }
    
    .contact-details p {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: #374151;
    }
    
    .contact-details small {
        font-size: 12px;
        color: #6b7280;
    }
    
    .support-section {
        background: #f9fafb;
        padding: 64px 0;
    }
    
    .support-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-top: 32px;
    }
    
    .support-card {
        background: white;
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.3s ease;
    }
    
    .support-card:hover {
        transform: translateY(-4px);
    }
    
    .support-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin: 0 auto 16px;
    }
    
    .field-error {
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group input.valid,
    .form-group select.valid,
    .form-group textarea.valid {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    @media (max-width: 768px) {
        .contact-content {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .chat-widget {
            width: calc(100vw - 20px);
            right: 10px;
            left: 10px;
        }
        
        .support-options {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject contact-specific styles
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactStyles;
document.head.appendChild(contactStyleSheet);
