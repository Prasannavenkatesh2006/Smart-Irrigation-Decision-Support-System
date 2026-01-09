// Simple AI Chatbot for Index Page Dashboard Help
class SimpleIndexBot {
    constructor() {
        this.currentLanguage = 'en';
        this.isOpen = false;
        this.videoPlaying = false;
        
        this.translations = {
            en: {
                welcome: "Hi 👋 I'm here to help you with this page. Ask me anything about the features you see here.",
                whatIsThis: "This is the IrrigAI Smart Water Management System dashboard. It helps you optimize irrigation for your crops using AI.",
                howToUse: "Click the '▶ How to Use Dashboard' button in the top header to see a step-by-step video guide.",
                features: "Features include irrigation planning, confidence levels, soil moisture monitoring, weekly schedules, and water savings reports.",
                videoGuide: "Watch the video guide below to learn how to use this dashboard:",
                typing: "Bot is typing...",
                close: "Chat closed. Click the robot icon to reopen.",
                outOfScope: "Sorry, I can help only with the features available on this page."
            },
            ta: {
                welcome: "வணகம் 👋 இந்த பக்கத்தில் உங்களுக்கு உதவ நான் இங்கே உள்ளேன். இங்கே உள்ள அம்சங்களைப் பற்றி என்னைக் கேட்கவும்.",
                whatIsThis: "இது IrrigAI ஸ்மார்ட் வாட்டர் மேனேஜ்மென்ட் சிஸ்டம் டாஷ்போர்டு. இது AI பயன்படுத்தி உங்கள் பயிர்களுக்கு நீர்ப்பாசனத்தை மேம்படுத்த உதவுகிறது.",
                howToUse: "மேல் தலைப்புவில் உள்ள '▶ How to Use Dashboard' பொத்தைக் கிளிக் செய்து படி-படியான வீடியோ வழிகாட்டியைப் பாருங்கள்.",
                features: "அம்சங்களில் நீர்ப்பாசன திட்டமிடல், நம்பகத்தன்மை நிலைகள், மண் ஈரப்பதம் கண்காணிப்பு, வாராந்திர அட்டவணைகள் மற்றும் நீர் சேமிப்பு அறிக்கைகள் அடங்கும்.",
                videoGuide: "இந்த டாஷ்போர்டை எப்படி பயன்படுத்துவது என்பதைக் கற்றுக்கொள்ள கீழே உள்ள வீடியோ வழிகாட்டியைப் பாருங்கள்:",
                typing: "பேச்சி எழுதுகிறது...",
                close: "உரையாடல் மூடப்பட்டது. ரோபட் ஐகானை மீண்டும் மீண்டவும்.",
                outOfScope: "மன்னிக்கவும், நான் இந்த பக்கத்தில் உள்ள அம்சங்களுக்கு மட்டுமே உதவ முடியும்."
            },
            hi: {
                welcome: "नमस्ते 👋 मैं इस पृष्ठ पर आपकी मदद के लिए हूँ। यहाँ दिखाई देने वाली सुविधाओं के बारे में मुझसे पूछें।",
                whatIsThis: "यह IrrigAI स्मार्ट वॉटर मैनेजमेंट सिस्टम डैशबोर्ड है। यह AI का उपयोग करके आपकी फसलों के लिए सिंचाई को अनुकूलित करने में मदद करता है।",
                howToUse: "शीर्ष लेख में '▶ How to Use Dashboard' बटन पर क्लिक करके चरण-दर-चरण वीडियो गाइड देखें।",
                features: "सुविधाओं में सिंचाई योजना, विश्वास स्तर, मिट्टी की नमी मॉनिटरिंग, साप्ताहिक शेड्यूल और जल बचत रिपोर्ट शामिल हैं।",
                videoGuide: "इस डैशबोर्ड का उपयोग करना सीखने के लिए नीचे दिए गए वीडियो गाइड देखें:",
                typing: "बॉट लिख रहा है...",
                close: "चैट बंद हो गया। रोबोट आइकन पर क्लिक करके फिर से खोलें।",
                outOfScope: "क्षमा करें, मैं केवल इस पृष्ठ पर उपलब्ध सुविधाओं के लिए ही मदद कर सकता हूँ।"
            }
        };
        
        this.videoSteps = [
            { text: "Step 1: Select your crop type from the dropdown", element: "#crop_type", highlight: true },
            { text: "Step 2: Choose the crop growth stage", element: "#crop_stage", highlight: true },
            { text: "Step 3: Enter your field size in hectares", element: "#field_size", highlight: true },
            { text: "Step 4: Click 'Generate Irrigation Plan' button", element: "#plan-btn", highlight: true },
            { text: "Step 5: Review the AI irrigation recommendation", element: "#result-card", highlight: true },
            { text: "Step 6: Check confidence level and soil moisture", element: "#confidence-card", highlight: true },
            { text: "Step 7: Generate weekly schedule for planning", element: "#generate-week-btn", highlight: true },
            { text: "Step 8: View water savings report", element: "#savings-card", highlight: true }
        ];
        
        this.initializeEventListeners();
        this.detectLanguage();
    }

    initializeEventListeners() {
        // Dashboard guide button click
        const dashboardGuideBtn = document.getElementById('dashboard-guide-btn');
        if (dashboardGuideBtn) {
            dashboardGuideBtn.addEventListener('click', () => this.showVideoGuide());
        }
        
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
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
        });
        
        // Send message
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    detectLanguage() {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.translations[browserLang]) {
            this.currentLanguage = browserLang;
        }
        this.updateLanguageDisplay();
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const helpPopup = document.getElementById('help-popup');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.add('open');
            chatWindow.classList.remove('minimized');
            document.getElementById('chat-input').focus();
            
            // Hide help popup when chat is opened
            if (helpPopup) {
                helpPopup.style.display = 'none';
            }
        } else {
            chatWindow.classList.remove('open');
            
            // Show help popup again when chat is closed
            if (helpPopup) {
                helpPopup.style.display = 'block';
            }
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chatbot-window');
        this.isOpen = false;
        chatWindow.classList.remove('open');
        
        // Stop video if playing
        if (this.videoPlaying) {
            this.stopVideo();
        }
        
        // Show help popup again when chat is closed
        const helpPopup = document.getElementById('help-popup');
        if (helpPopup) {
            helpPopup.style.display = 'block';
        }
        
        // Show close message
        this.addBotMessage(this.translations[this.currentLanguage].close);
    }

    toggleLanguageSelector() {
        const selector = document.getElementById('language-selector');
        selector.style.display = selector.style.display === 'none' ? 'flex' : 'none';
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.updateLanguageDisplay();
        document.getElementById('language-selector').style.display = 'none';
        
        // Update welcome message
        const welcomeText = document.getElementById('welcome-text');
        if (welcomeText) {
            welcomeText.textContent = this.translations[lang].welcome;
        }
    }

    updateLanguageDisplay() {
        document.getElementById('current-lang').textContent = this.currentLanguage.toUpperCase();
        
        // Update language selector buttons
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
    }

    handleQuickAction(action) {
        const responses = {
            'what-is-this': this.translations[this.currentLanguage].whatIsThis,
            'how-to-use': this.translations[this.currentLanguage].howToUse,
            'features': this.translations[this.currentLanguage].features
        };
        
        if (responses[action]) {
            this.addUserMessage(this.getQuickActionText(action));
            setTimeout(() => {
                this.addBotMessage(responses[action]);
            }, 500);
        }
    }

    getQuickActionText(action) {
        const actionTexts = {
            'what-is-this': 'What is this page?',
            'how-to-use': 'How to use this dashboard?',
            'features': 'What features are available?'
        };
        return actionTexts[action] || action;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            input.value = '';
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Generate response
            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.generateResponse(message);
                this.addBotMessage(response);
            }, 1000);
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for out-of-scope topics
        const outOfScopeKeywords = [
            'login', 'signup', 'register', 'authentication', 'password',
            'profile', 'settings', 'admin', 'backend', 'database',
            'server', 'api', 'development', 'code', 'programming'
        ];
        
        if (outOfScopeKeywords.some(keyword => lowerMessage.includes(keyword))) {
            return this.translations[this.currentLanguage].outOfScope;
        }
        
        // Index page specific responses
        if (lowerMessage.includes('what') && lowerMessage.includes('page')) {
            return this.translations[this.currentLanguage].whatIsThis;
        }
        
        if (lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
            return this.translations[this.currentLanguage].features;
        }
        
        if (lowerMessage.includes('how to use') || lowerMessage.includes('guide') || lowerMessage.includes('tutorial')) {
            return this.translations[this.currentLanguage].howToUse;
        }
        
        if (lowerMessage.includes('crop') || lowerMessage.includes('field') || lowerMessage.includes('irrigation')) {
            return "Enter your crop details in the Field Settings section and click 'Generate Irrigation Plan' to get AI-powered recommendations.";
        }
        
        if (lowerMessage.includes('water') || lowerMessage.includes('saving')) {
            return "The Water Savings Report shows how much water you've saved using the AI system compared to traditional irrigation methods.";
        }
        
        if (lowerMessage.includes('schedule') || lowerMessage.includes('week')) {
            return "Click 'Generate Week' in the 7-Day Irrigation Schedule section to create a weekly irrigation plan based on your field conditions.";
        }
        
        if (lowerMessage.includes('confidence') || lowerMessage.includes('reliable')) {
            return "The confidence level shows how reliable the AI recommendation is based on the data available. Higher confidence means more reliable recommendations.";
        }
        
        if (lowerMessage.includes('soil') || lowerMessage.includes('moisture')) {
            return "The soil moisture card shows the current moisture level in your field based on our calculations and available data.";
        }
        
        // Default response
        return "I can help you with understanding the dashboard features, irrigation planning, water savings, and field management. Click the '▶ How to Use Dashboard' button for a video guide!";
    }

    showVideoGuide() {
        // Open chat if not already open
        if (!this.isOpen) {
            this.toggleChat();
        }
        
        this.videoPlaying = true;
        
        // Add video guide message
        this.addBotMessage(this.translations[this.currentLanguage].videoGuide);
        
        // Create video guide container without play button
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-guide';
        videoContainer.innerHTML = `
            <div class="video-container">
                <h4>🎬 How to Use This Dashboard</h4>
                <div class="video-player">
                    <div class="video-placeholder">
                        <div class="video-steps" id="video-steps">
                            ${this.videoSteps.map((step, index) => 
                                `<div class="step" data-step="${index}">${step.text}</div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="video-controls">
                    <button class="close-video-btn" id="close-video-btn">✖️ Close</button>
                </div>
            </div>
        `;
        
        // Add to chat messages
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.appendChild(videoContainer);
        this.scrollToBottom();
        
        // Add event listener for close button only
        document.getElementById('close-video-btn').addEventListener('click', () => this.stopVideo());
        
        // Auto-start the video immediately
        setTimeout(() => {
            if (this.videoPlaying) {
                this.playVideo();
            }
        }, 500);
        
        return "Starting interactive video guide... Watch as I highlight each part of your dashboard!";
    }

    playVideo() {
        if (!this.videoPlaying) return;
        
        const steps = document.querySelectorAll('.step');
        let currentStep = 0;
        
        const playNextStep = () => {
            if (currentStep >= this.videoSteps.length || !this.videoPlaying) {
                this.stopVideo();
                return;
            }
            
            // Remove previous highlights
            steps.forEach(step => step.classList.remove('active', 'success'));
            
            // Highlight current step
            const currentStepElement = steps[currentStep];
            currentStepElement.classList.add('active');
            
            // Perform actual UI interactions
            const stepData = this.videoSteps[currentStep];
            if (stepData.element) {
                this.highlightUIElement(stepData.element);
                this.performUIAction(stepData.element, currentStep);
            }
            
            // Auto-advance to next step after 3 seconds
            setTimeout(() => {
                if (this.videoPlaying && currentStepElement.classList.contains('active')) {
                    currentStepElement.classList.remove('active');
                    currentStepElement.classList.add('success');
                    currentStep++;
                    playNextStep();
                }
            }, 3000);
        };
        
        // Start playing immediately
        playNextStep();
    }

    performUIAction(elementSelector, stepIndex) {
        try {
            const element = document.querySelector(elementSelector);
            if (!element) return;

            switch(stepIndex) {
                case 0: // Step 1: Select crop type
                    element.value = 'rice';
                    element.dispatchEvent(new Event('change'));
                    break;
                    
                case 1: // Step 2: Choose crop growth stage
                    element.value = 'vegetative';
                    element.dispatchEvent(new Event('change'));
                    break;
                    
                case 2: // Step 3: Enter field size
                    element.value = '2.5';
                    element.dispatchEvent(new Event('input'));
                    break;
                    
                case 3: // Step 4: Click Generate Irrigation Plan
                    setTimeout(() => {
                        element.click();
                        // Simulate loading and results
                        setTimeout(() => {
                            this.simulateIrrigationResults();
                        }, 2000);
                    }, 1000);
                    break;
                    
                case 4: // Step 5: Review results (already shown above)
                    break;
                    
                case 5: // Step 6: Check confidence (already shown above)
                    break;
                    
                case 6: // Step 7: Generate weekly schedule
                    setTimeout(() => {
                        element.click();
                        setTimeout(() => {
                            this.simulateWeeklySchedule();
                        }, 1000);
                    }, 1000);
                    break;
                    
                case 7: // Step 8: View water savings (already shown above)
                    break;
            }
        } catch (error) {
            console.log('Error performing UI action:', error);
        }
    }

    simulateIrrigationResults() {
        // Show loading state
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'block';
        }

        // Simulate AI processing
        setTimeout(() => {
            // Hide loading
            if (loading) {
                loading.style.display = 'none';
            }

            // Show result card
            const resultCard = document.getElementById('result-card');
            if (resultCard) {
                resultCard.style.display = 'block';
                document.getElementById('decision-badge').textContent = 'Irrigate Today';
                document.getElementById('water-amount').textContent = '2,500';
                document.getElementById('water-per-ha').textContent = '1,000';
                document.getElementById('display-crop').textContent = 'Rice';
            }

            // Show confidence card
            const confidenceCard = document.getElementById('confidence-card');
            if (confidenceCard) {
                confidenceCard.style.display = 'block';
                document.getElementById('confidence-score').textContent = '92%';
                document.getElementById('confidence-fill').style.width = '92%';
            }

            // Show soil moisture card
            const soilCard = document.getElementById('soil-card');
            if (soilCard) {
                soilCard.style.display = 'block';
                document.getElementById('soil-moisture').textContent = '45';
            }

            // Show sources card
            const sourcesCard = document.getElementById('sources-card');
            if (sourcesCard) {
                sourcesCard.style.display = 'block';
                const badgesContainer = document.getElementById('sources-badges');
                if (badgesContainer) {
                    badgesContainer.innerHTML = `
                        <span class="source-badge">📊 AI Analysis</span>
                        <span class="source-badge">🌾 Crop Data</span>
                        <span class="source-badge">💧 Water Guidelines</span>
                    `;
                }
            }

            // Show verification card
            const verificationCard = document.getElementById('verification-card');
            if (verificationCard) {
                verificationCard.style.display = 'block';
                const checklist = document.getElementById('verification-checklist');
                if (checklist) {
                    checklist.innerHTML = `
                        <div class="verification-item">✅ Field size validated</div>
                        <div class="verification-item">✅ Crop type confirmed</div>
                        <div class="verification-item">✅ Growth stage verified</div>
                    `;
                }
            }
        }, 1500);
    }

    simulateWeeklySchedule() {
        const scheduleContainer = document.getElementById('weekly-schedule-container');
        if (scheduleContainer) {
            scheduleContainer.innerHTML = `
                <div class="schedule-grid">
                    <div class="schedule-day">
                        <div class="day-header">Monday</div>
                        <div class="irrigation-info">Irrigate: 2,500L</div>
                    </div>
                    <div class="schedule-day">
                        <div class="day-header">Tuesday</div>
                        <div class="irrigation-info">No irrigation</div>
                    </div>
                    <div class="schedule-day">
                        <div class="day-header">Wednesday</div>
                        <div class="irrigation-info">Irrigate: 2,500L</div>
                    </div>
                    <div class="schedule-day">
                        <div class="day-header">Thursday</div>
                        <div class="irrigation-info">No irrigation</div>
                    </div>
                    <div class="schedule-day">
                        <div class="day-header">Friday</div>
                        <div class="irrigation-info">Irrigate: 2,500L</div>
                    </div>
                    <div class="schedule-day">
                        <div class="day-header">Saturday</div>
                        <div class="irrigation-info">No irrigation</div>
                    </div>
                    <div class="schedule-day">
                        <div class="day-header">Sunday</div>
                        <div class="irrigation-info">Irrigate: 2,500L</div>
                    </div>
                </div>
                <div class="schedule-summary">
                    <strong>Weekly Total: 10,000 Liters</strong>
                </div>
            `;
        }
    }

    stopVideo() {
        this.videoPlaying = false;
        
        // Remove video guide
        const videoGuide = document.querySelector('.video-guide');
        if (videoGuide) {
            videoGuide.remove();
        }
        
        // Clear all highlights
        this.clearHighlights();
        
        // Add completion message
        this.addBotMessage("Video guide completed! You can now use the dashboard with confidence. Ask me anything if you need help!");
    }

    highlightUIElement(selector) {
        // Clear previous highlights
        this.clearHighlights();
        
        try {
            const element = document.querySelector(selector);
            if (element) {
                // Add highlight class
                element.classList.add('video-highlight');
                
                // Scroll element into view
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Add pulse animation
                element.style.animation = 'videoHighlight 2s ease-in-out infinite';
            }
        } catch (error) {
            console.log('Element not found:', selector);
        }
    }

    clearHighlights() {
        // Remove all highlights
        document.querySelectorAll('.video-highlight').forEach(element => {
            element.classList.remove('video-highlight');
            element.style.animation = '';
        });
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
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new SimpleIndexBot();
});
