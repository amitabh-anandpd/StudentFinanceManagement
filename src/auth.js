class AuthManager {
    constructor() {
        this.currentTab = 'login';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showModal();
    }

    bindEvents() {
        // Tab switching
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Password toggles
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.togglePassword(e.target.closest('.password-toggle'));
            });
        });

        // Form submissions
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                this.handleLogin(e);
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                this.handleSignup(e);
            });
        }

        // Password strength checker
        const signupPassword = document.getElementById('signup-password');
        if (signupPassword) {
            signupPassword.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }

        // Confirm password validation
        const confirmPassword = document.getElementById('confirm-password');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', (e) => {
                this.validatePasswordMatch();
            });
        }

        // Social auth buttons
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSocialAuth(e.target.closest('.social-btn'));
            });
        });

        // Real-time validation
        this.bindRealTimeValidation();
    }

    showModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('.auth-modal').style.transform = 'scale(1)';
            }, 100);
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.auth-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabName}-content`).classList.remove('hidden');

        this.currentTab = tabName;

        // Add transition animation
        const activeContent = document.getElementById(`${tabName}-content`);
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            activeContent.style.transition = 'all 0.3s ease';
            activeContent.style.opacity = '1';
            activeContent.style.transform = 'translateY(0)';
        }, 50);
    }

    togglePassword(button) {
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Validate form
        if (!this.validateEmail(email)) {
            this.showError('login-email', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError('login-password', 'Password must be at least 6 characters');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('.auth-btn');
        this.setLoadingState(submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            this.setLoadingState(submitBtn, false);
            
            // Store auth state
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            // Redirect to dashboard
            window.location.href = 'index.html';
        }, 2000);
    }

    handleSignup(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('signup-firstname').value;
        const lastName = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        // Validate form
        let isValid = true;

        if (firstName.length < 2) {
            this.showError('signup-firstname', 'First name must be at least 2 characters');
            isValid = false;
        }

        if (lastName.length < 2) {
            this.showError('signup-lastname', 'Last name must be at least 2 characters');
            isValid = false;
        }

        if (!this.validateEmail(email)) {
            this.showError('signup-email', 'Please enter a valid email address');
            isValid = false;
        }

        if (password.length < 8) {
            this.showError('signup-password', 'Password must be at least 8 characters');
            isValid = false;
        }

        if (password !== confirmPassword) {
            this.showError('confirm-password', 'Passwords do not match');
            isValid = false;
        }

        if (!agreeTerms) {
            this.showError('agree-terms', 'You must agree to the terms and conditions');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = e.target.querySelector('.auth-btn');
        this.setLoadingState(submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            this.setLoadingState(submitBtn, false);
            
            // Store auth state
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', `${firstName} ${lastName}`);

            // Show success message and redirect
            this.showSuccessMessage('Account created successfully! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 2000);
    }

    handleSocialAuth(button) {
        const provider = button.classList.contains('google') ? 'Google' : 'GitHub';
        
        this.setLoadingState(button, true);
        
        // Simulate OAuth flow
        setTimeout(() => {
            this.setLoadingState(button, false);
            
            // Store auth state
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', `user@${provider.toLowerCase()}.com`);
            localStorage.setItem('authProvider', provider);

            // Redirect to dashboard
            window.location.href = 'index.html';
        }, 2000);
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let strengthLabel = 'Very Weak';

        // Check password criteria
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Update strength bar
        strengthBar.className = 'strength-fill';
        
        switch (strength) {
            case 0:
            case 1:
                strengthBar.classList.add('weak');
                strengthLabel = 'Weak';
                break;
            case 2:
                strengthBar.classList.add('fair');
                strengthLabel = 'Fair';
                break;
            case 3:
            case 4:
                strengthBar.classList.add('good');
                strengthLabel = 'Good';
                break;
            case 5:
                strengthBar.classList.add('strong');
                strengthLabel = 'Strong';
                break;
        }

        strengthText.textContent = `Password strength: ${strengthLabel}`;
    }

    validatePasswordMatch() {
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const confirmGroup = document.getElementById('confirm-password').closest('.form-group');

        if (confirmPassword && password !== confirmPassword) {
            confirmGroup.classList.add('error');
            this.showError('confirm-password', 'Passwords do not match');
        } else {
            confirmGroup.classList.remove('error');
            this.clearError('confirm-password');
        }
    }

    bindRealTimeValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                if (e.target.value && !this.validateEmail(e.target.value)) {
                    this.showError(e.target.id, 'Please enter a valid email address');
                } else {
                    this.clearError(e.target.id);
                }
            });
        });

        // Clear errors on input
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.clearError(e.target.id);
            });
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(inputId, message) {
        const input = document.getElementById(inputId);
        const formGroup = input.closest('.form-group');
        
        // Remove existing error
        this.clearError(inputId);
        
        // Add error class
        formGroup.classList.add('error');
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        formGroup.appendChild(errorDiv);
    }

    clearError(inputId) {
        const input = document.getElementById(inputId);
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    showSuccessMessage(message) {
        const modal = document.querySelector('.auth-modal');
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successDiv.style.cssText = `
            background: var(--success);
            color: white;
            padding: var(--space-md);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-lg);
            display: flex;
            align-items: center;
            gap: var(--space-sm);
        `;
        
        modal.insertBefore(successDiv, modal.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    setLoadingState(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});