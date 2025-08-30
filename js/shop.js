// Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
        this.initStripe();
    }

    initStripe() {
        // Initialize Stripe (you'll need to replace with your actual publishable key)
        this.stripe = Stripe('pk_test_your_stripe_publishable_key_here');
        this.elements = this.stripe.elements();
        
        // Create card element
        const cardElement = this.elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
            },
        });
        
        if (document.getElementById('card-element')) {
            cardElement.mount('#card-element');
            
            cardElement.on('change', ({error}) => {
                const displayError = document.getElementById('card-errors');
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }
        
        this.cardElement = cardElement;
    }

    bindEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const item = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseInt(e.target.dataset.price),
                    image: e.target.dataset.image
                };
                this.addItem(item);
            });
        });

        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartClose = document.getElementById('cartClose');

        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.add('active');
            });
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.showCheckout();
            });
        }

        // Payment form
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                this.handlePayment(e);
            });
        }

        // Demo buttons
        document.querySelectorAll('.demo-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const appId = e.target.dataset.app;
                this.showDemo(appId);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem) {
            this.showNotification('Item already in cart!', 'info');
            return;
        }

        this.items.push({...item, quantity: 1});
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${item.name} added to cart!`, 'success');
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartUI();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartCount) {
            cartCount.textContent = this.items.length;
        }

        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.items.length === 0) {
                cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
            } else {
                this.items.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-info">
                            <div class="cart-item-icon">
                                <i class="${item.image}"></i>
                            </div>
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <span class="cart-item-price">$${item.price}</span>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-btn" onclick="cart.removeItem('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });
            }
        }

        if (cartTotal) {
            cartTotal.textContent = this.getTotal();
        }
    }

    showCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const modal = document.getElementById('paymentModal');
        const checkoutItems = document.getElementById('checkoutItems');
        const checkoutTotal = document.getElementById('checkoutTotal');

        // Populate checkout summary
        checkoutItems.innerHTML = '';
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-item';
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>$${item.price * item.quantity}</span>
            `;
            checkoutItems.appendChild(itemElement);
        });

        checkoutTotal.textContent = this.getTotal();
        modal.style.display = 'flex';
    }

    async handlePayment(event) {
        event.preventDefault();
        
        const submitButton = document.getElementById('submit-payment');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');
        
        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        spinner.classList.remove('hidden');

        try {
            // Create payment intent on your server
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: this.getTotal() * 100, // Convert to cents
                    currency: 'usd',
                    items: this.items
                })
            });

            const {client_secret} = await response.json();

            // Confirm payment with Stripe
            const result = await this.stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        email: document.getElementById('email').value,
                    },
                }
            });

            if (result.error) {
                this.showNotification(result.error.message, 'error');
            } else {
                this.showNotification('Payment successful! Check your email for download links.', 'success');
                this.items = [];
                this.saveCart();
                this.updateCartUI();
                document.getElementById('paymentModal').style.display = 'none';
            }
        } catch (error) {
            this.showNotification('Payment failed. Please try again.', 'error');
        }

        // Reset button state
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        spinner.classList.add('hidden');
    }

    showDemo(appId) {
        const modal = document.getElementById('demoModal');
        const demoFeatures = document.getElementById('demoFeatures');
        
        // Demo data for different apps
        const demoData = {
            taskmaster: [
                'Task creation and management',
                'Team collaboration tools',
                'Time tracking functionality',
                'Project organization',
                'Deadline reminders',
                'Progress reporting'
            ],
            fittracker: [
                'Workout tracking',
                'Nutrition planning',
                'Social fitness challenges',
                'Progress analytics',
                'Wearable device integration',
                'Custom workout plans'
            ],
            stocktracker: [
                'Real-time stock prices',
                'Portfolio management',
                'Market analytics',
                'Price alerts',
                'Financial news integration',
                'Performance tracking'
            ],
            recipebook: [
                'Recipe management',
                'Meal planning calendar',
                'Shopping list generation',
                'Cooking timers',
                'Nutritional information',
                'Recipe sharing'
            ],
            chatapp: [
                'End-to-end encryption',
                'Group chat functionality',
                'File sharing',
                'Video calling',
                'Message reactions',
                'Custom themes'
            ],
            photoeditor: [
                'Advanced photo filters',
                'AI-powered enhancements',
                'Batch processing',
                'Social media integration',
                'RAW image support',
                'Professional editing tools'
            ]
        };

        const features = demoData[appId] || ['Feature 1', 'Feature 2', 'Feature 3'];
        
        demoFeatures.innerHTML = '';
        features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            demoFeatures.appendChild(li);
        });

        modal.style.display = 'flex';
    }

    showNotification(message, type = 'info') {
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
}

// Initialize shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();
});

// Additional CSS for shop-specific styles
const shopStyles = `
    .cart-sidebar {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
        transition: right 0.3s ease;
        z-index: 10000;
        display: flex;
        flex-direction: column;
    }
    
    .cart-sidebar.active {
        right: 0;
    }
    
    .cart-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .cart-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #6b7280;
    }
    
    .cart-items {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .cart-item-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .cart-item-icon {
        width: 40px;
        height: 40px;
        background: #f3f4f6;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2563eb;
    }
    
    .cart-item-details h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
    }
    
    .cart-item-price {
        font-size: 12px;
        color: #6b7280;
    }
    
    .cart-item-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .qty-btn {
        width: 24px;
        height: 24px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }
    
    .quantity {
        font-size: 14px;
        font-weight: 600;
        min-width: 20px;
        text-align: center;
    }
    
    .remove-btn {
        background: none;
        border: none;
        color: #ef4444;
        cursor: pointer;
        padding: 4px;
    }
    
    .cart-footer {
        padding: 20px;
        border-top: 1px solid #e5e7eb;
    }
    
    .cart-total {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        text-align: center;
    }
    
    .cart-checkout {
        width: 100%;
    }
    
    .cart-toggle {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .cart-toggle:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
    }
    
    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #6b7280;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .checkout-summary {
        margin-bottom: 24px;
        padding: 16px;
        background: #f9fafb;
        border-radius: 8px;
    }
    
    .checkout-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    
    .checkout-total {
        border-top: 1px solid #e5e7eb;
        padding-top: 8px;
        margin-top: 8px;
    }
    
    .form-group {
        margin-bottom: 16px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
        color: #374151;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    #card-element {
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
    }
    
    #card-errors {
        color: #ef4444;
        font-size: 14px;
        margin-top: 8px;
    }
    
    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .hidden {
        display: none !important;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .cart-empty {
        text-align: center;
        color: #6b7280;
        padding: 40px 20px;
    }
    
    .demo-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
    
    .video-placeholder {
        background: #f3f4f6;
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        color: #6b7280;
    }
    
    .video-placeholder i {
        font-size: 48px;
        margin-bottom: 16px;
        color: #2563eb;
    }
    
    .demo-features ul {
        list-style: none;
        padding: 0;
    }
    
    .demo-features li {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding: 8px;
        background: #f9fafb;
        border-radius: 6px;
    }
    
    .demo-features i {
        color: #10b981;
    }
    
    @media (max-width: 768px) {
        .cart-sidebar {
            width: 100%;
            right: -100%;
        }
        
        .demo-content {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject shop-specific styles
const shopStyleSheet = document.createElement('style');
shopStyleSheet.textContent = shopStyles;
document.head.appendChild(shopStyleSheet);
