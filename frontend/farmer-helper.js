// Farmer-Friendly Registration Helper with Voice Assistance
class FarmerRegistrationHelper {
    constructor() {
        this.currentLanguage = 'en';
        this.isOpen = false;
        this.voiceSupported = 'speechSynthesis' in window;
        this.helpBubbleShown = false;
        
        this.translations = {
            en: {
                helpBubble: "Need help to register? Tap here",
                helperTitle: "🌾 Registration Helper",
                welcome: "Hi! I'll help you register step by step.",
                videoBtnText: "Watch how to Register",
                videoTitle: "Registration Guide",
                voiceWelcome: "Need help to register? I will show you step by step.",
                voiceInstructions: [
                    "First, click Register here at the bottom",
                    "Now, enter your username",
                    "Next, enter your email address", 
                    "Create a strong password",
                    "Finally, click Create Account",
                    "Great! Registration successful!"
                ],
                steps: [
                    "Step 1: Click \"Register here\" at the bottom",
                    "Step 2: Enter your username",
                    "Step 3: Enter your email",
                    "Step 4: Create a password",
                    "Step 5: Click \"Create Account\"",
                    "✓ Registration successful!"
                ]
            },
            ta: {
                helpBubble: "Register panna help venuma? Inga tap pannunga",
                helperTitle: "🌾 பதிவு உதவி",
                welcome: "வணகம்! நான் உங்களை பதிவு செய்ய உதவுகிறேன்.",
                videoBtnText: "Register panna video paakalaama?",
                videoTitle: "பதிவு வழிகாட்டி",
                voiceWelcome: "Register panna help venuma? Naan step-by-step solli kudukkuren.",
                voiceInstructions: [
                    "Mudhalil, keezhe Register here nu click pannunga",
                    "Ipdi, ungal username ah enter pannunga",
                    "Appuram, ungal email address ah enter pannunga",
                    "Nalla oru password create pannunga",
                    "最后, Create Account nu click pannunga",
                    "Sariyaachchu! Registration successful!"
                ],
                steps: [
                    "படி 1: கீழே \"Register here\" என்று கிளிக் செய்யவும்",
                    "படி 2: உங்கள் பயனர்பெயரை உள்ளிடவும்",
                    "படி 3: உங்கள் மின்னஞ்சலை உள்ளிடவும்",
                    "படி 4: கடவுச்சொல்லை உருவாக்கவும்",
                    "படி 5: \"Create Account\" என்று கிளிக் செய்யவும்",
                    "✓ பதிவு வெற்றிகரமாக முடிந்தது!"
                ]
            },
            hi: {
                helpBubble: "Register karne mein help chahiye? Yahan tap karein",
                helperTitle: "🌾 पंजीकरण सहायक",
                welcome: "नमस्ते! मैं आपको चरण-दर-चरण पंजीकरण करने में मदद करूंगा।",
                videoBtnText: "Register kaise karein video dekhein?",
                videoTitle: "पंजीकरण मार्गदर्शक",
                voiceWelcome: "Register karne mein help chahiye? Main step-by-step bataunga.",
                voiceInstructions: [
                    "Pehle, neeche Register here par click karein",
                    "Ab, apna username enter karein",
                    "Phir, apna email address enter karein",
                    "Ek strong password banayein",
                    "Akhir mein, Create Account par click karein",
                    "Bahut accha! Registration successful!"
                ],
                steps: [
                    "चरण 1: नीचे \"Register here\" पर क्लिक करें",
                    "चरण 2: अपना उपयोगकर्ता नाम दर्ज करें",
                    "चरण 3: अपना ईमेल दर्ज करें",
                    "चरण 4: पासवर्ड बनाएं",
                    "चरण 5: \"Create Account\" पर क्लिक करें",
                    "✓ पंजीकरण सफल!"
                ]
            }
        };
        
        this.initializeEventListeners();
        this.detectLanguage();
        this.showAutoHelp();
    }

    initializeEventListeners() {
        // Help bubble click
        document.getElementById('help-bubble').addEventListener('click', () => this.openHelper());
        document.getElementById('help-tap-btn').addEventListener('click', () => this.openHelper());
        
        // Helper controls
        document.getElementById('close-helper').addEventListener('click', () => this.closeHelper());
        document.getElementById('lang-toggle').addEventListener('click', () => this.toggleLanguageSelector());
        
        // Language selection
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
        
        // Video help button
        document.getElementById('watch-video-btn').addEventListener('click', () => this.startVideoGuide());
        
        // Video controls
        document.getElementById('play-video').addEventListener('click', () => this.playVideo());
        document.getElementById('close-video').addEventListener('click', () => this.closeVideo());
        
        // Helper input
        document.getElementById('send-help').addEventListener('click', () => this.sendHelpMessage());
        document.getElementById('helper-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendHelpMessage();
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

    showAutoHelp() {
        // Show help bubble after 2 seconds
        setTimeout(() => {
            if (!this.helpBubbleShown) {
                this.showHelpBubble();
                this.playVoiceWelcome();
            }
        }, 2000);
    }

    showHelpBubble() {
        const helpBubble = document.getElementById('help-bubble');
        helpBubble.style.display = 'flex';
        this.helpBubbleShown = true;
        
        // Auto-hide after 10 seconds if not clicked
        setTimeout(() => {
            if (!this.isOpen) {
                helpBubble.style.display = 'none';
            }
        }, 10000);
    }

    playVoiceWelcome() {
        if (!this.voiceSupported) return;
        
        const utterance = new SpeechSynthesisUtterance(this.translations[this.currentLanguage].voiceWelcome);
        utterance.lang = this.currentLanguage === 'ta' ? 'ta-IN' : 
                        this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        speechSynthesis.speak(utterance);
    }

    openHelper() {
        const helperWindow = document.getElementById('helper-window');
        const helpBubble = document.getElementById('help-bubble');
        
        helperWindow.style.display = 'flex';
        helpBubble.style.display = 'none';
        this.isOpen = true;
        
        // Welcome message
        this.addHelperMessage(this.translations[this.currentLanguage].welcome);
    }

    closeHelper() {
        const helperWindow = document.getElementById('helper-window');
        const helpBubble = document.getElementById('help-bubble');
        
        helperWindow.style.display = 'none';
        
        // Show help bubble again if not used
        if (!this.helpBubbleShown) {
            setTimeout(() => this.showHelpBubble(), 1000);
        }
        
        this.isOpen = false;
    }

    toggleLanguageSelector() {
        const selector = document.getElementById('lang-options');
        selector.style.display = selector.style.display === 'none' ? 'flex' : 'none';
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.updateLanguageDisplay();
        document.getElementById('lang-options').style.display = 'none';
    }

    updateLanguageDisplay() {
        document.getElementById('current-lang').textContent = this.currentLanguage.toUpperCase();
        
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
        
        // Update all text elements
        document.getElementById('help-text').textContent = this.translations[this.currentLanguage].helpBubble;
        document.getElementById('helper-title').textContent = this.translations[this.currentLanguage].helperTitle;
        document.getElementById('welcome-text').textContent = this.translations[this.currentLanguage].welcome;
        document.getElementById('video-btn-text').textContent = this.translations[this.currentLanguage].videoBtnText;
    }

    startVideoGuide() {
        const videoGuide = document.getElementById('video-guide');
        document.getElementById('video-title').textContent = this.translations[this.currentLanguage].videoTitle;
        
        videoGuide.style.display = 'block';
        this.playRegistrationVideo();
    }

    playRegistrationVideo() {
        const steps = document.querySelectorAll('.step');
        const voiceInstructions = this.translations[this.currentLanguage].voiceInstructions;
        const stepTexts = this.translations[this.currentLanguage].steps;
        
        // Reset all steps
        steps.forEach(step => {
            step.classList.remove('active', 'success');
            step.textContent = '';
        });
        
        // Update step texts
        stepTexts.forEach((text, index) => {
            if (steps[index]) {
                steps[index].textContent = text;
            }
        });
        
        // Show registration form
        this.showRegistrationForm();
        
        // Step 1: Click Register here
        setTimeout(() => {
            steps[0].classList.add('active');
            this.highlightRegisterLink();
            this.playVoiceInstruction(voiceInstructions[0]);
        }, 500);
        
        // Step 2: Enter username
        setTimeout(() => {
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
            this.highlightField('register-username', 'farmer_123');
            this.playVoiceInstruction(voiceInstructions[1]);
        }, 3000);
        
        // Step 3: Enter email
        setTimeout(() => {
            steps[1].classList.remove('active');
            steps[2].classList.add('active');
            this.highlightField('register-email', 'farmer@email.com');
            this.playVoiceInstruction(voiceInstructions[2]);
        }, 5000);
        
        // Step 4: Enter password
        setTimeout(() => {
            steps[2].classList.remove('active');
            steps[3].classList.add('active');
            this.highlightField('register-password', '••••••••');
            this.playVoiceInstruction(voiceInstructions[3]);
        }, 7000);
        
        // Step 5: Click Create Account
        setTimeout(() => {
            steps[3].classList.remove('active');
            steps[4].classList.add('active');
            this.highlightRegisterButton();
            this.playVoiceInstruction(voiceInstructions[4]);
        }, 9000);
        
        // Success
        setTimeout(() => {
            steps[4].classList.remove('active');
            steps[5].classList.add('success');
            this.showSuccessMessage();
            this.playVoiceInstruction(voiceInstructions[5]);
        }, 11000);
        
        // Reset after video
        setTimeout(() => {
            this.resetVideo();
        }, 13000);
    }

    playVoiceInstruction(text) {
        if (!this.voiceSupported) return;
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.currentLanguage === 'ta' ? 'ta-IN' : 
                        this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        speechSynthesis.speak(utterance);
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

    highlightRegisterLink() {
        const switchForm = document.querySelector('.switch-form a');
        if (switchForm) {
            switchForm.classList.add('field-highlight');
            this.addArrowIndicator(switchForm);
            
            setTimeout(() => {
                switchForm.classList.remove('field-highlight');
                this.removeArrowIndicator();
            }, 2000);
        }
    }

    highlightField(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('field-highlight');
            this.addArrowIndicator(field);
            
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
            }, 100);
            
            setTimeout(() => {
                field.classList.remove('field-highlight');
                this.removeArrowIndicator();
            }, 2000);
        }
    }

    highlightRegisterButton() {
        const button = document.querySelector('#signup-form button[type="submit"]');
        if (button) {
            button.classList.add('field-highlight');
            this.addArrowIndicator(button);
            
            setTimeout(() => {
                button.classList.remove('field-highlight');
                this.removeArrowIndicator();
            }, 2000);
        }
    }

    addArrowIndicator(element) {
        const arrow = document.createElement('div');
        arrow.className = 'arrow-indicator';
        arrow.id = 'temp-arrow';
        
        const rect = element.getBoundingClientRect();
        arrow.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
        arrow.style.left = (rect.left + rect.width / 2 - 15) + 'px';
        
        document.body.appendChild(arrow);
    }

    removeArrowIndicator() {
        const arrow = document.getElementById('temp-arrow');
        if (arrow) {
            arrow.remove();
        }
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
            padding: 30px 40px;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 600;
            z-index: 1002;
            box-shadow: 0 8px 30px rgba(76, 175, 80, 0.4);
            animation: bounceIn 0.5s ease;
        `;
        successDiv.textContent = this.currentLanguage === 'ta' ? 'பதிவு வெற்றிகரமாக முடிந்தது!' :
                               this.currentLanguage === 'hi' ? 'पंजीकरण सफल!' :
                               'Registration successful!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
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
        this.playRegistrationVideo();
    }

    closeVideo() {
        document.getElementById('video-guide').style.display = 'none';
        this.resetVideo();
    }

    addHelperMessage(message) {
        const messagesContainer = document.getElementById('helper-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'helper-welcome';
        messageDiv.innerHTML = `<p>${message}</p>`;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    sendHelpMessage() {
        const input = document.getElementById('helper-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addHelperMessage(`You: ${message}`);
        
        // Clear input
        input.value = '';
        
        // Generate response
        setTimeout(() => {
            const response = this.generateHelperResponse(message);
            this.addHelperMessage(`Helper: ${response}`);
            this.playVoiceInstruction(response);
        }, 1000);
    }

    generateHelperResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('how to')) {
            return this.currentLanguage === 'ta' ? 'வீடியோ பார்த்து பதிவு செய்யலாம்' :
                   this.currentLanguage === 'hi' ? 'वीडियो देखकर पंजीकरण कर सकते हैं' :
                   'Watch the video to register';
        } else if (lowerMessage.includes('help')) {
            return this.currentLanguage === 'ta' ? 'நான் உங்களுக்கு உதவுகிறேன்' :
                   this.currentLanguage === 'hi' ? 'मैं आपकी मदद करूंगा' :
                   'I will help you';
        } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
            return this.currentLanguage === 'ta' ? 'வணக்கம்!' :
                   this.currentLanguage === 'hi' ? 'धन्यवाद!' :
                   'You\'re welcome!';
        } else {
            return this.currentLanguage === 'ta' ? 'வீடியோ பார்க்கவும்' :
                   this.currentLanguage === 'hi' ? 'वीडियो देखें' :
                   'Please watch the video';
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('helper-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize farmer helper when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.farmerHelper = new FarmerRegistrationHelper();
});
