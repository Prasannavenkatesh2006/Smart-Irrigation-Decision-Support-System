// AI Chatbot Assistant for Login Page
class ChatbotAssistant {
    constructor() {
        this.currentLanguage = 'en';
        this.isOpen = false;
        this.isMinimized = false;
        this.videoPlaying = false;
        
        this.translations = {
            en: {
                welcome: "Hello! I'm here to help you with login and registration. How can I assist you today?",
                register: "To register, click 'Register here' at the bottom of the login form. Fill in your username, email, and password, then click 'Create Account'.",
                login: "To login, enter your username and password in the form, then click 'Sign In'. You can also use Google Sign-In for quick access!",
                google: "Click the 'Sign in with Google' button to use your Google account. It's fast and secure!",
                password: "Click 'Forgot password?' link below the login form. Enter your username and follow the instructions.",
                videoRegister: "Watch this step-by-step guide to register your account:",
                videoLogin: "Watch this step-by-step guide to log in to your account:",
                videoGoogle: "Watch this guide to sign in with your Google account:",
                videoPassword: "Watch this guide to reset your password:",
                typing: "Bot is typing...",
                error: "Sorry, I encountered an error. Please try again.",
                close: "Chat closed. Click the robot icon to reopen."
            },
            ta: {
                welcome: "வணகம்! நான் உங்குவதில் உங்களுவதும் உள்ளதுக்கிறேன் உதவரும். நான் உங்களுவதும்?",
                register: "பதிவு செய்ய, உள்ளது படிவத்தில் 'Register here' என்பையை கிளிக்கவும். உங்களப் பெயர், மின்னெல், கடவுச்சொல்களை நிரப்பி, பிறகு 'Create Account' என்பையை கிளிக்கவும்.",
                login: "உள்ளது, படிவவில் உங்களப் பெயர் மற்றும் கடவுச்சொல்களை நிரப்பி, பிறகு 'Sign In' என்பையை கிளிக்கவும். வேகவ அணுகத்திற்க்க கூடிய Google Sign-In பயன்படுத்தலாம்!",
                google: "'Sign in with Google' பொத்தியை கிளிக்கவும் உங்களின் Google கணக்கத்தைப் பயன்படுத்தலாம். இது வேகவமாகவும்!",
                password: "உள்ளது படிவத்தில் 'Forgot password?' இணைப்பை கிளிக்கவும். உங்களப் பெயரை உள்ளும் வழிந்தைப்பி செய்யவழிக்கள்.",
                videoRegister: "உங்கள் கணக்கத்தை பதிவு செய்ய இந்து இந்திர வழிக்கைப் பாருங்கள்:",
                videoLogin: "உங்களின் கணக்கத்தை உள்ள இந்திர வழிக்கைப் பாருங்கள்:",
                videoGoogle: "Google கணக்கத்துடன் உள்ள இந்திர வழிக்கைப் பாருங்கள்:",
                videoPassword: "கடவுச்சொல்களை மீட்டமாற்ற இந்திர வழிக்கைப் பாருங்கள்:",
                typing: "பேச்சி எழுதுகிறது...",
                error: "மன்னிப்படுதும், ஒரு பிழையை சந்தித்தது. மீண்டும் முயற்சிசெய்யவும்.",
                close: "உரையாடல் மூடப்பட்டது. ரோபட் ஐகானை மீண்டும் மீண்டவும்."
            },
            hi: {
                welcome: "नमस्ते! मैं आपके लॉगिन और पंजीकरण में मदद करने के लिए यहाँ हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
                register: "पंजीकरण करने के लिए, लॉगिन फॉर्म के नीचे 'Register here' पर क्लिक करें। अपना उपयोगकर्ता नाम, ईमेल और पासवर्ड भरें, फिर 'Create Account' पर क्लिक करें।",
                login: "लॉगिन करने के लिए, फॉर्म में अपना उपयोगकर्ता नाम और पासवर्ड दर्ज करें, फिर 'Sign In' पर क्लिक करें। आप Google Sign-In का भी उपयोग कर सकते हैं!",
                google: "'Sign in with Google' बटन पर क्लिक करकर अपना Google खाते का उपयोग करें। यह तेज़ और सुरक्षित है!",
                password: "लॉगिन फॉर्म के नीचे 'Forgot password?' लिंक पर क्लिक करें। अपना उपयोगकर्ता नाम दर्ज करें और निर्देशों का पालन करें।",
                videoRegister: "अपना खाता पंजीकरण करने के लिए इस चरण-दर-चरण मार्गदर्शन देखें:",
                videoLogin: "अपने खाते में लॉगिन करने के लिए इस चरण-दर-चरण मार्गदर्शन देखें:",
                videoGoogle: "Google खाते से लॉगिन करने के लिए इस मार्गदर्शन देखें:",
                videoPassword: "अपना पासवर्ड रीसेट करने के लिए इस मार्गदर्शन देखें:",
                typing: "बॉट लिख रहा है...",
                error: "क्षमा करें, मुझे एक त्रुटि हुई। कृपया फिर से प्रयास करें।",
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
        document.getElementById('minimize-chat').addEventListener('click', () => this.minimizeChat());
        document.getElementById('language-toggle').addEventListener('click', () => this.toggleLanguageSelector());
        
        // Language selection
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
        
        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
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
        // Detect browser language
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
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add('open');
            chatWindow.style.display = 'flex';
            chatIcon.style.display = 'none';
            this.isOpen = true;
            this.isMinimized = false;
            
            // Hide notification dot
            document.querySelector('.notification-dot').style.display = 'none';
            
            // Welcome message
            this.addBotMessage(this.translations[this.currentLanguage].welcome);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const chatIcon = document.getElementById('chatbot-icon');
        
        chatWindow.classList.remove('open');
        setTimeout(() => {
            chatWindow.style.display = 'none';
            chatIcon.style.display = 'flex';
        }, 300);
        
        this.isOpen = false;
        this.isMinimized = false;
        
        // Show notification dot after 2 seconds
        setTimeout(() => {
            if (!this.isOpen) {
                document.querySelector('.notification-dot').style.display = 'block';
            }
        }, 2000);
    }

    minimizeChat() {
        const chatWindow = document.getElementById('chatbot-window');
        
        if (this.isMinimized) {
            chatWindow.classList.remove('minimized');
            this.isMinimized = false;
        } else {
            chatWindow.classList.add('minimized');
            this.isMinimized = true;
        }
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
        this.updateQuickActions();
    }

    updateLanguageDisplay() {
        document.getElementById('current-lang').textContent = this.currentLanguage.toUpperCase();
        
        // Update active language button
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
    }

    updateWelcomeMessage() {
        const welcomeText = document.getElementById('welcome-text');
        welcomeText.textContent = this.translations[this.currentLanguage].welcome;
    }

    updateQuickActions() {
        const actions = {
            register: ['📝 How to Register', '📝 பதிவு செய்ய', '📝 पंजीकरण कैसे करें'],
            login: ['🔑 How to Login', '🔑 உள்ளது எப்படுதல்', '🔑 लॉगिन कैसे करें'],
            google: ['🌐 Google Sign-In', '🌐 கூகில் உள்ளது', '🌐 Google साइन-इन'],
            password: ['🔒 Reset Password', '🔒 கடவுச்சொல் மாற்று', '🔒 पासवर्ड रीसेट करें']
        };
        
        document.querySelectorAll('.quick-action').forEach(btn => {
            const action = btn.dataset.action;
            if (actions[action]) {
                btn.textContent = actions[action][this.getLanguageIndex()];
            }
        });
    }

    getLanguageIndex() {
        const langMap = { en: 0, ta: 1, hi: 2 };
        return langMap[this.currentLanguage] || 0;
    }

    handleQuickAction(action) {
        const messages = {
            register: this.translations[this.currentLanguage].register,
            login: this.translations[this.currentLanguage].login,
            google: this.translations[this.currentLanguage].google,
            password: this.translations[this.currentLanguage].password
        };
        
        this.addBotMessage(messages[action]);
        
        // Show video guide
        this.showVideoGuide(action);
    }

    showVideoGuide(action) {
        const videoGuide = document.getElementById('video-guide');
        const videoTitle = document.getElementById('video-title');
        
        const titles = {
            register: this.translations[this.currentLanguage].videoRegister,
            login: this.translations[this.currentLanguage].videoLogin,
            google: this.translations[this.currentLanguage].videoGoogle,
            password: this.translations[this.currentLanguage].videoPassword
        };
        
        videoTitle.textContent = titles[action];
        videoGuide.style.display = 'block';
        
        // Start video animation
        this.startVideoAnimation(action);
    }

    startVideoAnimation(action) {
        const animation = document.querySelector('.video-animation');
        const demoFields = animation.querySelectorAll('.demo-input');
        const demoButton = animation.querySelector('.demo-button');
        const successCheck = animation.querySelector('.success-check');
        
        // Reset animation
        demoFields.forEach(field => {
            field.style.opacity = '0';
            field.querySelector('.demo-field').textContent = '';
        });
        demoButton.style.opacity = '0';
        successCheck.style.opacity = '0';
        
        // Animate fields
        setTimeout(() => {
            demoFields[0].style.opacity = '1';
            demoFields[0].querySelector('.demo-field').textContent = '✓ john_doe';
        }, 500);
        
        setTimeout(() => {
            demoFields[1].style.opacity = '1';
            demoFields[1].querySelector('.demo-field').textContent = '✓ •••••••••';
        }, 1000);
        
        setTimeout(() => {
            demoButton.style.opacity = '1';
        }, 1500);
        
        setTimeout(() => {
            demoButton.style.opacity = '0.7';
            successCheck.style.opacity = '1';
        }, 2000);
        
        // Reset after animation
        setTimeout(() => {
            this.resetVideoAnimation();
        }, 3000);
    }

    resetVideoAnimation() {
        const animation = document.querySelector('.video-animation');
        const demoFields = animation.querySelectorAll('.demo-input');
        const demoButton = animation.querySelector('.demo-button');
        const successCheck = animation.querySelector('.success-check');
        
        demoFields.forEach(field => {
            field.style.opacity = '0';
            field.querySelector('.demo-field').textContent = '';
        });
        demoButton.style.opacity = '0';
        successCheck.style.opacity = '0';
    }

    playVideo() {
        const playBtn = document.getElementById('play-video');
        
        if (this.videoPlaying) {
            this.stopVideo();
        } else {
            this.startVideoAnimation();
            playBtn.textContent = '⏸️ Pause';
            this.videoPlaying = true;
        }
    }

    closeVideo() {
        document.getElementById('video-guide').style.display = 'none';
        this.stopVideo();
    }

    stopVideo() {
        const playBtn = document.getElementById('play-video');
        playBtn.textContent = '▶️ Play';
        this.videoPlaying = false;
        this.resetVideoAnimation();
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
        
        // Simulate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(message);
        }, 1000 + Math.random() * 1000);
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
        
        // Simple keyword-based responses
        if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
            response = this.translations[this.currentLanguage].register;
        } else if (lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
            response = this.translations[this.currentLanguage].login;
        } else if (lowerMessage.includes('google')) {
            response = this.translations[this.currentLanguage].google;
        } else if (lowerMessage.includes('password') || lowerMessage.includes('forgot')) {
            response = this.translations[this.currentLanguage].password;
        } else if (lowerMessage.includes('help')) {
            response = "I can help you with registration, login, Google sign-in, and password reset. What would you like to know?";
        } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
            response = "You're welcome! Is there anything else I can help you with?";
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            response = "Goodbye! Feel free to ask if you need help again.";
        }
        
        this.addBotMessage(response);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatbotAssistant();
});
