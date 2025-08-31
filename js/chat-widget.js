// Standalone Chat Widget Implementation
console.log('Loading chat widget...');

// Initialize chat widget when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, creating chat widget...');
    
    // Create chat widget HTML
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <button class="chat-toggle" id="chatToggle">
            <i class="fas fa-comments"></i>
        </button>
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-status">
                        <h4>AI Assistant</h4>
                        <span><div class="status-dot"></div>Online</span>
                    </div>
                </div>
                <button class="chat-close" id="chatClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        Hi! I'm your AI assistant. How can I help you with your mobile app development needs today?
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <form class="chat-input-form" id="chatForm">
                    <input type="text" class="chat-input-field" id="chatInput" placeholder="Type your message..." autocomplete="off">
                    <button type="submit" class="chat-send" id="chatSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(chatWidget);
    console.log('Chat widget added to DOM');
    
    // Get elements
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        console.log('Chat toggle clicked');
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });
    
    // Close chat window
    chatClose.addEventListener('click', () => {
        console.log('Chat close clicked');
        chatWindow.classList.remove('active');
    });
    
    // Handle form submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate AI response after delay
            setTimeout(() => {
                hideTypingIndicator();
                const response = generateAIResponse(message);
                addMessage(response, 'bot');
            }, 1500 + Math.random() * 1000);
        }
    });
    
    // Add message function
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingMessage = chatMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    // Generate AI response (dummy implementation)
    function generateAIResponse(userMessage) {
        const responses = {
            greetings: [
                "Hello! I'm here to help you with your mobile app development questions.",
                "Hi there! What can I assist you with today?",
                "Welcome! How can I help you bring your app idea to life?"
            ],
            pricing: [
                "Our mobile app development starts at $5,000 for basic apps. The final cost depends on features, complexity, and timeline. Would you like a detailed quote?",
                "App development pricing varies based on your requirements. Basic apps start around $5,000, while complex apps can range from $15,000-$50,000+. What type of app are you considering?",
                "I'd be happy to discuss pricing! It depends on your app's features and complexity. Can you tell me more about what you have in mind?"
            ],
            services: [
                "I offer comprehensive mobile app development services including iOS & Android development, UI/UX design, backend development, and ongoing support. What specific service interests you?",
                "My services include native iOS/Android development, cross-platform solutions, app store optimization, and maintenance. Which area would you like to know more about?",
                "I specialize in end-to-end mobile app development - from concept to launch. This includes design, development, testing, and post-launch support."
            ],
            timeline: [
                "Development timelines typically range from 8-20 weeks depending on complexity. Simple apps take 8-12 weeks, while complex apps need 16-20+ weeks. What's your target launch date?",
                "Most apps take 2-5 months to develop. The timeline depends on features, design complexity, and revisions. Do you have a specific deadline in mind?",
                "Project timelines vary based on scope. I can provide a detailed timeline after understanding your requirements. When would you like to launch?"
            ],
            contact: [
                "You can reach me at agarwal.jitendra9@gmail.com or call +91 7044216968. I'm also available through the contact form on this website.",
                "Feel free to contact me directly! Email: agarwal.jitendra9@gmail.com, Phone: +91 7044216968. I typically respond within 24 hours.",
                "I'd love to discuss your project! You can email me at agarwal.jitendra9@gmail.com or use the contact form. What's the best way to reach you?"
            ],
            default: [
                "That's a great question! I'd be happy to discuss this in more detail. Could you provide more specifics about your project?",
                "I can definitely help with that. Let me know more about your requirements and I'll provide detailed information.",
                "Interesting! I'd love to learn more about your project. Can you share some additional details?",
                "Thanks for your question! For the best answer, could you tell me a bit more about what you're looking for?",
                "I'm here to help! Would you like to schedule a call to discuss your project in detail? You can reach me at agarwal.jitendra9@gmail.com"
            ]
        };
        
        const message = userMessage.toLowerCase();
        
        // Check for keywords and return appropriate response
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return getRandomResponse(responses.greetings);
        } else if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
            return getRandomResponse(responses.pricing);
        } else if (message.includes('service') || message.includes('what do you do') || message.includes('offer')) {
            return getRandomResponse(responses.services);
        } else if (message.includes('time') || message.includes('long') || message.includes('when') || message.includes('deadline')) {
            return getRandomResponse(responses.timeline);
        } else if (message.includes('contact') || message.includes('reach') || message.includes('call') || message.includes('email')) {
            return getRandomResponse(responses.contact);
        } else {
            return getRandomResponse(responses.default);
        }
    }
    
    // Get random response from array
    function getRandomResponse(responseArray) {
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
});
