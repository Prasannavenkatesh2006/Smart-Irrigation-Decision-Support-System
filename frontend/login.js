// Login Page JavaScript
class LoginManager {
    constructor() {
        this.initializeEventListeners();
        this.loadStoredCredentials();
    }

    initializeEventListeners() {
        // Form submissions
        document.getElementById('signin-form').addEventListener('submit', (e) => this.handleSignIn(e));
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignUp(e));
        
        // Forgot password link
        document.querySelector('.forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
        
        // Terms link
        document.querySelector('.terms-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showTermsAndConditions();
        });
    }

    // Form switching
    switchToRegister() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        this.clearForms();
    }

    switchToLogin() {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        this.clearForms();
    }

    clearForms() {
        document.getElementById('signin-form').reset();
        document.getElementById('signup-form').reset();
        this.hideMessage();
    }

    // Password visibility toggle
    togglePassword(fieldId) {
        const field = document.getElementById(fieldId);
        const button = field.nextElementSibling;
        const character = button.querySelector('.password-character');
        
        if (field.type === 'password') {
            field.type = 'text';
            // Character emerges from crops
            if (character) {
                character.classList.add('active');
            }
        } else {
            field.type = 'password';
            // Character hides back in crops
            if (character) {
                character.classList.remove('active');
            }
        }
    }

    // Sign In Handler
    async handleSignIn(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username').trim();
        const password = formData.get('password');
        const rememberMe = document.getElementById('remember-me').checked;

        // Validation
        if (!this.validateSignIn(username, password)) {
            return;
        }

        this.setLoadingState(e.target, true);
        
        try {
            // Simulate API call - replace with actual authentication
            const response = await this.authenticateUser(username, password);
            
            if (response.success) {
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', username);
                }
                
                sessionStorage.setItem('currentUser', JSON.stringify(response.user));
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect to main app
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showMessage(response.message || 'Invalid credentials', 'error');
            }
        } catch (error) {
            this.showMessage('An error occurred. Please try again.', 'error');
            console.error('Sign in error:', error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    // Sign Up Handler
    async handleSignUp(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const agreeTerms = document.getElementById('agree-terms').checked;

        // Validation
        const validation = this.validateSignUp(username, email, password, confirmPassword, agreeTerms);
        if (!validation.valid) {
            this.showMessage(validation.message, 'error');
            return;
        }

        this.setLoadingState(e.target, true);
        
        try {
            // Simulate API call - replace with actual registration
            const response = await this.registerUser(username, email, password);
            
            if (response.success) {
                this.showMessage('Registration successful! Please sign in.', 'success');
                
                // Switch to login form after successful registration
                setTimeout(() => {
                    this.switchToLogin();
                    // Pre-fill username
                    document.getElementById('login-username').value = username;
                }, 1500);
            } else {
                this.showMessage(response.message || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showMessage('An error occurred. Please try again.', 'error');
            console.error('Sign up error:', error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    // Google Sign-In Handlers - Now handled by Google's built-in system
    // The handleCredentialResponse function is defined in HTML
    // No need for additional handlers here

    // Forgot Password Handler
    handleForgotPassword() {
        const username = document.getElementById('login-username').value.trim();
        
        if (!username) {
            this.showMessage('Please enter your username first', 'error');
            return;
        }
        
        // Simulate password reset
        this.showMessage(`Password reset link sent to user: ${username}`, 'success');
        // TODO: Implement actual password reset functionality
    }

    // Validation Methods
    validateSignIn(username, password) {
        if (!username) {
            this.showMessage('Please enter your username', 'error');
            return false;
        }
        
        if (!password) {
            this.showMessage('Please enter your password', 'error');
            return false;
        }
        
        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return false;
        }
        
        return true;
    }

    validateSignUp(username, email, password, confirmPassword, agreeTerms) {
        if (!username) {
            return { valid: false, message: 'Please enter a username' };
        }
        
        if (username.length < 3 || username.length > 20) {
            return { valid: false, message: 'Username must be 3-20 characters' };
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
        }
        
        if (!email) {
            return { valid: false, message: 'Please enter your email' };
        }
        
        if (!this.isValidEmail(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        
        if (!password) {
            return { valid: false, message: 'Please enter a password' };
        }
        
        if (password.length < 6) {
            return { valid: false, message: 'Password must be at least 6 characters' };
        }
        
        if (password !== confirmPassword) {
            return { valid: false, message: 'Passwords do not match' };
        }
        
        if (!agreeTerms) {
            return { valid: false, message: 'Please agree to the terms and conditions' };
        }
        
        return { valid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Authentication Methods (Mock Implementation)
    async authenticateUser(username, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user database - replace with actual API call
        const users = this.getStoredUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt
                }
            };
        }
        
        return {
            success: false,
            message: 'Invalid username or password'
        };
    }

    async registerUser(username, email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const users = this.getStoredUsers();
        if (users.find(u => u.username === username)) {
            return {
                success: false,
                message: 'Username already exists'
            };
        }
        
        if (users.find(u => u.email === email)) {
            return {
                success: false,
                message: 'Email already registered'
            };
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password, // In production, this should be hashed
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return {
            success: true,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        };
    }

    getStoredUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : [];
    }

    // UI Helper Methods
    setLoadingState(form, loading) {
        const button = form.querySelector('button[type="submit"]');
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('message-container');
        const content = document.getElementById('message-content');
        
        content.className = `message-content ${type}`;
        content.textContent = message;
        container.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }

    hideMessage() {
        const container = document.getElementById('message-container');
        container.style.display = 'none';
    }

    showTermsAndConditions() {
        this.showMessage('Terms and Conditions will be available soon!', 'info');
        // TODO: Implement terms and conditions modal or page
    }

    loadStoredCredentials() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            document.getElementById('login-username').value = rememberedUser;
            document.getElementById('remember-me').checked = true;
        }
    }
}

// Global functions for inline event handlers
function switchToRegister() {
    if (loginManager) loginManager.switchToRegister();
}

function switchToLogin() {
    if (loginManager) loginManager.switchToLogin();
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const eyeIcon = button.querySelector('.eye-icon');
    
    if (field.type === 'password') {
        field.type = 'text';
        button.classList.add('hidden');
        // Change to eye-slash icon (eye with slash)
        eyeIcon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0-1.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/><path d="M1.5 12.5l20.5 20.5M1.5 20.5l20.5-20.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>';
    } else {
        field.type = 'password';
        button.classList.remove('hidden');
        // Change back to normal eye icon
        eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><circle cx="12" cy="12" r="2.5"/>';
    }
}

// Initialize the login manager when DOM is loaded
let loginManager;
document.addEventListener('DOMContentLoaded', () => {
    loginManager = new LoginManager();
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        // User is already logged in, redirect to main app
        window.location.href = 'index.html';
    }
});
