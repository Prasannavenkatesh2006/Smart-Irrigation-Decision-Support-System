// Simple AI Chatbot for Registration Help
class SimpleRegistrationBot {
    constructor() {
        this.currentLanguage = 'en';
        this.isOpen = false;
        this.videoPlaying = false;
        
        this.translations = {
            en: {
                welcome: "Hi! I can help you register or login. Type 'how to register' or 'how to login' to see video guides.",
                register: "Watch the video guide below to learn how to register:",
                login: "Watch the video guide below to learn how to login:",
                typing: "Bot is typing...",
                close: "Chat closed. Click the robot icon to reopen."
            },
            ta: {
                welcome: "வணகம்! நான் பதிவு செய்ய உள்ளதும் உதவரும். 'பதிவு எப்படுதல்' அல்லது 'உள்ளது எப்படுதல்' என்று வீடியோ பாருங்கள்.",
                register: "பதிவு செய்ய இந்திர வழிக்கைப் பாருங்கள்:",
                login: "உள்ளது செய்ய இந்திர வழிக்கைப் பாருங்கள்:",
                typing: "பேச்சி எழுதுகிறது...",
                close: "உரையாடல் மூடப்பட்டது. ரோபட் ஐகானை மீண்டும் மீண்டவும்."
            },
            hi: {
                welcome: "नमस्ते! मैं आपके पंजीकरण और लॉगिन में मदद कर सकता हूँ। 'कैसे पंजीकरण करें' या 'कैसे लॉगिन करें' टाइप करकर वीडियो देखें।",
                register: "पंजीकरण के लिए इस वीडियो देखें:",
                login: "लॉगिन के लिए इस वीडियो देखें:",
                typing: "बॉट लिख रहा है...",
                close: "चैट बंद हो गया। रोबोट आइकन पर क्लिक करकर फिर से खोलें।"
            }
        };
        
        this.initializeEventListeners();
        this.detectLanguage();
    }

    initializeEventListeners() {
        // Chat icon click
        document.getElementById('chatbot-icon').addEventListener('click', () => this.toggleChat());
        
        // Chat controls
        document.getElementById('close-chat').addEventListener('click', () => this.closeChat());
        document.getElementById('language-toggle').addEventListener('click', () => this.toggleLanguageSelector());
        
        // Language selection
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
        
        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'register') {
                    this.handleRegisterHelp();
                } else if (action === 'login') {
                    this.handleLoginHelp();
                }
            });
        });
        
        // Video controls
        document.getElementById('play-video').addEventListener('click', () => this.playVideo());
        document.getElementById('close-video').addEventListener('click', () => this.closeVideo());
        
        // Chat input
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (this.translations[langCode]) {
            this.currentLanguage = langCode;
            this.updateLanguageDisplay();
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const chatIcon = document.getElementById('chatbot-icon');
        const helpPopup = document.getElementById('help-popup');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add('open');
            chatWindow.style.display = 'flex';
            chatIcon.style.display = 'none';
            helpPopup.style.display = 'none';
            this.isOpen = true;
            
            document.querySelector('.notification-dot').style.display = 'none';
            
            this.addBotMessage(this.translations[this.currentLanguage].welcome);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const chatIcon = document.getElementById('chatbot-icon');
        const helpPopup = document.getElementById('help-popup');
        
        chatWindow.classList.remove('open');
        setTimeout(() => {
            chatWindow.style.display = 'none';
            chatIcon.style.display = 'flex';
            helpPopup.style.display = 'block';
        }, 300);
        
        this.isOpen = false;
    }

    toggleLanguageSelector() {
        const selector = document.getElementById('language-selector');
        selector.style.display = selector.style.display === 'none' ? 'flex' : 'none';
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.updateLanguageDisplay();
        this.updateWelcomeMessage();
        document.getElementById('language-selector').style.display = 'none';
        
        // Update quick action buttons
        const registerBtn = document.querySelector('.quick-action[data-action="register"]');
        const loginBtn = document.querySelector('.quick-action[data-action="login"]');
        
        if (registerBtn) {
            registerBtn.textContent = lang === 'en' ? '📝 How to Register' : 
                                   lang === 'ta' ? '📝 பதிவு செய்ய' : '📝 पंजीकरण कैसे करें';
        }
        
        if (loginBtn) {
            loginBtn.textContent = lang === 'en' ? '🔑 How to Login' : 
                                 lang === 'ta' ? '🔑 உள்ளது செய்ய' : '🔑 लॉगिन कैसे करें';
        }
    }

    updateLanguageDisplay() {
        document.getElementById('current-lang').textContent = this.currentLanguage.toUpperCase();
        
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
    }

    updateWelcomeMessage() {
        const welcomeText = document.getElementById('welcome-text');
        welcomeText.textContent = this.translations[this.currentLanguage].welcome;
    }

    handleRegisterHelp() {
        this.addBotMessage(this.translations[this.currentLanguage].register);
        this.showVideoGuide('register');
    }

    handleLoginHelp() {
        this.addBotMessage(this.translations[this.currentLanguage].login);
        this.showVideoGuide('login');
    }

    showVideoGuide(type) {
        const videoGuide = document.getElementById('video-guide');
        const videoTitle = document.getElementById('video-title');
        
        if (type === 'register') {
            videoTitle.textContent = 'Registration Guide';
            this.startRegistrationVideo();
        } else {
            videoTitle.textContent = 'Login Guide';
            this.startLoginVideo();
        }
        
        videoGuide.style.display = 'block';
    }

    startRegistrationVideo() {
        const playBtn = document.getElementById('play-video');
        const steps = document.querySelectorAll('.step');
        
        // Reset all steps
        steps.forEach(step => {
            step.classList.remove('active', 'success');
        });
        
        // Update step text for registration
        steps[0].textContent = 'Step 1: Click "Register here" at the bottom';
        steps[1].textContent = 'Step 2: Enter your username';
        steps[2].textContent = 'Step 3: Enter your email';
        steps[3].textContent = 'Step 4: Create a password';
        steps[4].textContent = 'Step 5: Click "Create Account"';
        steps[5].textContent = '✓ Registration successful!';
        
        // Show registration form
        this.showRegistrationForm();
        
        // Step 1: Click Register here
        setTimeout(() => {
            steps[0].classList.add('active');
            this.highlightRegisterLink();
        }, 500);
        
        // Step 2: Enter username
        setTimeout(() => {
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
            this.highlightField('register-username', 'john_doe');
        }, 2000);
        
        // Step 3: Enter email
        setTimeout(() => {
            steps[1].classList.remove('active');
            steps[2].classList.add('active');
            this.highlightField('register-email', 'user@example.com');
        }, 3500);
        
        // Step 4: Enter password
        setTimeout(() => {
            steps[2].classList.remove('active');
            steps[3].classList.add('active');
            this.highlightField('register-password', '••••••••');
        }, 5000);
        
        // Step 5: Click Create Account
        setTimeout(() => {
            steps[3].classList.remove('active');
            steps[4].classList.add('active');
            this.highlightRegisterButton();
        }, 6500);
        
        // Success
        setTimeout(() => {
            steps[4].classList.remove('active');
            steps[5].classList.add('success');
            this.showSuccessMessage();
        }, 8000);
        
        // Reset after video
        setTimeout(() => {
            this.resetVideo();
        }, 10000);
        
        playBtn.textContent = '▶️ Play';
    }

    startLoginVideo() {
        const playBtn = document.getElementById('play-video');
        const steps = document.querySelectorAll('.step');
        
        // Reset all steps
        steps.forEach(step => {
            step.classList.remove('active', 'success');
        });
        
        // Update step text for login
        steps[0].textContent = 'Step 1: Enter your username';
        steps[1].textContent = 'Step 2: Enter your password';
        steps[2].textContent = 'Step 3: Click "Sign In"';
        steps[3].textContent = '✓ Login successful!';
        steps[4].textContent = '';
        steps[5].textContent = '';
        
        // Show login form
        this.showLoginForm();
        
        // Step 1: Enter username
        setTimeout(() => {
            steps[0].classList.add('active');
            this.highlightField('login-username', 'john_doe');
        }, 500);
        
        // Step 2: Enter password
        setTimeout(() => {
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
            this.highlightField('login-password', '••••••••');
        }, 2000);
        
        // Step 3: Click Sign In
        setTimeout(() => {
            steps[1].classList.remove('active');
            steps[2].classList.add('active');
            this.highlightLoginButton();
        }, 3500);
        
        // Success
        setTimeout(() => {
            steps[2].classList.remove('active');
            steps[3].classList.add('success');
            this.showLoginSuccessMessage();
        }, 5000);
        
        // Reset after video
        setTimeout(() => {
            this.resetVideo();
        }, 7000);
        
        playBtn.textContent = '▶️ Play';
    }

    showRegistrationForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        
        // Hide other elements
        document.querySelector('.divider').style.display = 'none';
        document.getElementById('google-signin-btn').style.display = 'none';
        document.querySelector('.switch-form').style.display = 'none';
    }

    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        
        // Hide other elements
        document.querySelector('.divider').style.display = 'none';
        document.getElementById('google-signin-btn').style.display = 'none';
        document.querySelector('.switch-form').style.display = 'none';
    }

    highlightRegisterLink() {
        const switchForm = document.querySelector('.switch-form a');
        if (switchForm) {
            switchForm.style.background = '#6BAF92';
            switchForm.style.color = 'white';
            switchForm.style.padding = '5px 10px';
            switchForm.style.borderRadius = '5px';
            
            setTimeout(() => {
                switchForm.style.background = '';
                switchForm.style.color = '';
                switchForm.style.padding = '';
                switchForm.style.borderRadius = '';
            }, 1500);
        }
    }

    highlightField(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.border = '2px solid #6BAF92';
            field.style.boxShadow = '0 0 10px rgba(107, 175, 146, 0.3)';
            
            // Simulate typing
            let index = 0;
            field.value = '';
            const typeInterval = setInterval(() => {
                if (index < value.length) {
                    field.value += value[index];
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
            
            setTimeout(() => {
                field.style.border = '';
                field.style.boxShadow = '';
            }, 1500);
        }
    }

    highlightRegisterButton() {
        const button = document.querySelector('#signup-form button[type="submit"]');
        if (button) {
            button.style.background = '#6BAF92';
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 5px 15px rgba(107, 175, 146, 0.4)';
            
            setTimeout(() => {
                button.style.background = '';
                button.style.transform = '';
                button.style.boxShadow = '';
            }, 1500);
        }
    }

    highlightLoginButton() {
        const button = document.querySelector('#signin-form button[type="submit"]');
        if (button) {
            button.style.background = '#6BAF92';
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 5px 15px rgba(107, 175, 146, 0.4)';
            
            setTimeout(() => {
                button.style.background = '';
                button.style.transform = '';
                button.style.boxShadow = '';
            }, 1500);
        }
    }

    showLoginSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            z-index: 1002;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
        `;
        successDiv.textContent = 'Login successful!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 2000);
    }

    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            z-index: 1002;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
        `;
        successDiv.textContent = 'Registration successful!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 2000);
    }

    resetVideo() {
        // Reset form fields
        document.getElementById('register-username').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-confirm-password').value = '';
        
        // Restore original form display
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.querySelector('.divider').style.display = 'block';
        document.getElementById('google-signin-btn').style.display = 'flex';
        document.querySelector('.switch-form').style.display = 'block';
        
        // Reset steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'success');
        });
    }

    playVideo() {
        // Determine which video to play based on current title
        const videoTitle = document.getElementById('video-title').textContent;
        if (videoTitle.includes('Registration')) {
            this.startRegistrationVideo();
        } else {
            this.startLoginVideo();
        }
    }

    closeVideo() {
        document.getElementById('video-guide').style.display = 'none';
        this.resetVideo();
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addUserMessage(message);
        
        // Clear input
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(message);
        }, 1000);
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${this.translations[this.currentLanguage].typing}</p>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = this.translations[this.currentLanguage].welcome;
        
        if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('how to register')) {
            response = this.translations[this.currentLanguage].register;
        } else if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('how to login')) {
            response = this.translations[this.currentLanguage].login;
        } else if (lowerMessage.includes('help')) {
            response = "I can help you register or login. Type 'how to register' or 'how to login' to see video guides.";
        } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
            response = "You're welcome! Ask if you need more help.";
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            response = "Goodbye! Come back anytime.";
        }
        
        this.addBotMessage(response);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize simple chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simpleBot = new SimpleRegistrationBot();
});
