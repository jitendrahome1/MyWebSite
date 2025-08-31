// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing components...');
    
    // Initialize all components
    try {
        initializeNavigation();
        initializeAnimations();
        initializeCounters();
        initializePortfolioScroll();
        initializeShopFilters();
        console.log('About to initialize chat widget...');
        initializeChatWidget();
        initializeAboutMenuNavigation();
        console.log('All components initialized successfully');
    } catch (error) {
        console.error('Error initializing components:', error);
    }
});

function initializeAnimations() {
    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add different animation types based on element class
                if (element.classList.contains('service-card')) {
                    element.classList.add('scale-in');
                } else if (element.classList.contains('project-card')) {
                    element.classList.add('fade-in-up');
                } else if (element.classList.contains('testimonial-card')) {
                    element.classList.add('fade-in-left');
                } else if (element.classList.contains('app-card')) {
                    element.classList.add('fade-in-right');
                } else {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation with staggered delays
    document.querySelectorAll('.service-card, .project-card, .testimonial-card, .app-card').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Hero stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((number, index) => {
                    if (!number.classList.contains('animated')) {
                        number.classList.add('animated');
                        const target = parseInt(number.getAttribute('data-target')) || 50;
                        
                        setTimeout(() => {
                            animateCounter(number, target);
                        }, index * 200);
                    }
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.hero-stats').forEach((stats) => {
        statsObserver.observe(stats);
    });
}

function initializeNavigation() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Enhanced navbar scroll effect with hide/show
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show navbar based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background on scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Enhanced Portfolio filters with animations
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Animate out all cards first
            projectCards.forEach((card, index) => {
                card.style.transition = 'all 0.3s ease-out';
                card.style.transform = 'scale(0.8) translateY(20px)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.transform = 'scale(1) translateY(0)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, index * 50);
            });
        });
    });
    
    // Shop filters
    const shopFilterButtons = document.querySelectorAll('.shop-filters .filter-btn');
    const appCards = document.querySelectorAll('.app-card');
    
    shopFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            shopFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            appCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-answer').style.maxHeight = '0';
                faqItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
    
    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add different animation types based on element class
                if (element.classList.contains('service-card')) {
                    element.classList.add('scale-in');
                } else if (element.classList.contains('project-card')) {
                    element.classList.add('fade-in-up');
                } else if (element.classList.contains('testimonial-card')) {
                    element.classList.add('fade-in-left');
                } else if (element.classList.contains('app-card')) {
                    element.classList.add('fade-in-right');
                } else {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation with staggered delays
    document.querySelectorAll('.service-card, .project-card, .testimonial-card, .app-card').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Hero stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((number, index) => {
                    if (!number.classList.contains('animated')) {
                        number.classList.add('animated');
                        const target = parseInt(number.getAttribute('data-target')) || 50;
                        
                        setTimeout(() => {
                            animateCounter(number, target);
                        }, index * 200);
                    }
                });
            }
        });
    });
    
    // Animate counter function
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
            
            // Add pulse effect during counting
            if (current < target) {
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 100);
            }
        }, 20);
    }
    
    // Observe hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
    
    // Parallax effect for hero background
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.backgroundPosition = `center ${rate}px`;
        });
    }
    
    // Typewriter effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.classList.contains('typed')) {
        heroTitle.classList.add('typed');
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--primary-color)';
        heroTitle.style.animation = 'blink 1s infinite';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                    heroTitle.style.animation = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Floating animation for mobile mockup
    const mobileMockup = document.querySelector('.mobile-mockup');
    if (mobileMockup) {
        mobileMockup.classList.add('float-animation');
    }
    
    // Form validation and submission
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else {
                    field.style.borderColor = '#d1d5db';
                    field.style.boxShadow = 'none';
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
    
    // Notification system
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
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Loading states for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.type === 'submit' || this.classList.contains('loading-btn')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
    
    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.display = 'none';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
}

// Portfolio Horizontal Scroll Functionality
function initializePortfolioScroll() {
    const projectsGrid = document.getElementById('projectsGrid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!projectsGrid || !prevBtn || !nextBtn || !scrollProgress) return;
    
    const cardWidth = 420; // Width of each project card
    const gap = 40; // Gap between cards (2.5rem = 40px)
    const scrollAmount = cardWidth + gap;
    
    // Update navigation buttons and progress bar
    function updateNavigation() {
        const scrollLeft = projectsGrid.scrollLeft;
        const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
        
        // Update button states
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= maxScroll;
        
        // Update progress bar
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }
    
    // Scroll to previous project
    prevBtn.addEventListener('click', function() {
        projectsGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Scroll to next project
    nextBtn.addEventListener('click', function() {
        projectsGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update navigation on scroll
    projectsGrid.addEventListener('scroll', updateNavigation);
    
    // Initialize navigation state
    updateNavigation();
    
    // Handle touch/swipe gestures for mobile
    let startX = 0;
    let scrollLeft = 0;
    
    projectsGrid.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX - projectsGrid.offsetLeft;
        scrollLeft = projectsGrid.scrollLeft;
    });
    
    projectsGrid.addEventListener('touchmove', function(e) {
        if (!startX) return;
        e.preventDefault();
        const x = e.touches[0].pageX - projectsGrid.offsetLeft;
        const walk = (x - startX) * 2;
        projectsGrid.scrollLeft = scrollLeft - walk;
    });
    
    projectsGrid.addEventListener('touchend', function() {
        startX = 0;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (document.activeElement === projectsGrid || projectsGrid.contains(document.activeElement)) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextBtn.click();
            }
        }
    });
}

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Skills and Expertise Animations
function initializeSkillsAnimations() {
    // Skill bars animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                    }, index * 200);
                });
                
                // Animate counter numbers
                const statNumbers = entry.target.querySelectorAll('.stat-number[data-count]');
                statNumbers.forEach((number, index) => {
                    if (!number.classList.contains('animated')) {
                        number.classList.add('animated');
                        const target = parseInt(number.getAttribute('data-count'));
                        
                        setTimeout(() => {
                            animateCounter(number, target);
                        }, index * 100);
                    }
                });
                
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    // Observe skills section
    const skillsSection = document.querySelector('.skills-expertise-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    // Tech planet hover effects
    const techPlanets = document.querySelectorAll('.tech-planet');
    techPlanets.forEach(planet => {
        planet.addEventListener('mouseenter', function() {
            const techName = this.getAttribute('data-tech');
            if (techName) {
                showTechTooltip(this, techName);
            }
        });
        
        planet.addEventListener('mouseleave', function() {
            hideTechTooltip();
        });
    });
}

// Counter animation function
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
    }, 30);
}

// Tech tooltip functions
function showTechTooltip(element, techName) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tech-tooltip';
    tooltip.textContent = techName;
    tooltip.style.cssText = `
        position: absolute;
        background: #2c3e50;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
}

function hideTechTooltip() {
    const tooltip = document.querySelector('.tech-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
    }
}

// About Menu Navigation Functionality
function initializeAboutMenuNavigation() {
    const menuNavItems = document.querySelectorAll('.menu-nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    if (menuNavItems.length === 0 || contentSections.length === 0) {
        return; // Exit if elements don't exist on this page
    }
    
    menuNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items and content sections
            menuNavItems.forEach(navItem => navItem.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding content section
            this.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Trigger counter animations if this section has counters
                const counters = targetElement.querySelectorAll('.stat-number[data-count]');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    });
}

// Counter animation function
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Chat Widget Functionality
function initializeChatWidget() {
    console.log('Initializing chat widget...');
    
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
    console.log('Chat widget HTML added to DOM');
    
    // Get elements
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });
    
    // Close chat window
    chatClose.addEventListener('click', () => {
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
}

// Enhanced CSS for animations and notifications
const additionalStyles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(37, 99, 235, 0.5); }
        50% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.8), 0 0 30px rgba(37, 99, 235, 0.6); }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: var(--primary-color, #2563eb); }
    }
    
    /* Enhanced navbar styles */
    .navbar {
        transition: all 0.3s ease-in-out;
        will-change: transform;
    }
    
    .navbar.scrolled {
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
    
    /* Animation classes */
    .animate-on-scroll {
        opacity: 0;
        transition: all 0.6s ease-out;
    }
    
    .animate-on-scroll.animate {
        opacity: 1;
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .fade-in-left {
        animation: fadeInLeft 0.6s ease-out forwards;
    }
    
    .fade-in-right {
        animation: fadeInRight 0.6s ease-out forwards;
    }
    
    .scale-in {
        animation: scaleIn 0.6s ease-out forwards;
    }
    
    .pulse-animation {
        animation: pulse 2s ease-in-out infinite;
    }
    
    .float-animation {
        animation: float 3s ease-in-out infinite;
    }
    
    .glow-animation {
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    /* Enhanced button hover effects */
    .btn {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .btn:active {
        transform: translateY(0);
    }
    
    /* Loading button animation */
    .btn.loading {
        pointer-events: none;
        position: relative;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    /* Form validation styles */
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        animation: shake 0.5s ease-in-out;
    }
    
    /* Success state for forms */
    .btn.success {
        background-color: #10b981;
        border-color: #10b981;
    }
    
    /* Mobile mockup enhancements */
    .mobile-mockup {
        transition: transform 0.3s ease;
    }
    
    .mobile-mockup:hover {
        transform: translateY(-5px) scale(1.02);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-success i {
        color: #10b981;
    }
    
    .notification-error i {
        color: #ef4444;
    }
    
    .notification-info i {
        color: #3b82f6;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #6b7280;
        padding: 4px;
    }
    
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .back-to-top:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }
    
    .faq-question {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: white;
        border-radius: 8px;
        margin-bottom: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .faq-question:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .faq-question i {
        transition: transform 0.3s ease;
        color: #2563eb;
    }
    
    .faq-answer {
        padding: 0 20px;
        background: #f9fafb;
        border-radius: 0 0 8px 8px;
    }
    
    .faq-answer p {
        padding: 20px 0;
        margin: 0;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
