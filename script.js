document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const form = document.getElementById('signupform');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const buttonWrapper = document.querySelector('.button-wrapper');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Validation patterns
    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Store validation status
    let validationState = {
        username: false,
        email: false,
        password: false
    };
    
    // Button state
    let isButtonOnRight = true;
    let canMove = true;
    
    // Check if form is valid
    function isFormValid() {
        return validationState.username && validationState.email && validationState.password;
    }
    
    // Update form progress
    function updateProgress() {
        const totalFields = 3;
        const validFields = Object.values(validationState).filter(Boolean).length;
        const progressPercent = (validFields / totalFields) * 100;
        
        progressFill.style.width = progressPercent + '%';
        progressText.textContent = Math.round(progressPercent) + '% Complete';
        
        // Update button state
        if (isFormValid()) {
            submitBtn.classList.add('ready');
            submitBtn.classList.remove('left', 'right');
            submitBtn.disabled = false;
        } else {
            submitBtn.classList.remove('ready');
            submitBtn.disabled = true;
        }
    }
    
    // Move button to opposite side
    function moveButton() {
        if (!canMove || isFormValid()) return;
        
        canMove = false;
        
        // Remove previous position classes
        submitBtn.classList.remove('left', 'right');
        
        // Add slight delay for smooth transition
        setTimeout(() => {
            if (isButtonOnRight) {
                // Move to left side
                submitBtn.classList.add('left');
                isButtonOnRight = false;
            } else {
                // Move to right side
                submitBtn.classList.add('right');
                isButtonOnRight = true;
            }
            
            // Allow movement again after 400ms
            setTimeout(() => {
                canMove = true;
            }, 400);
        }, 10);
    }
    
    // Handle button hover
    submitBtn.addEventListener('mouseenter', function() {
        if (!isFormValid() && canMove) {
            moveButton();
        }
    });
    
    // Validate username
    function validateUsername() {
        const value = usernameInput.value.trim();
        const isValid = usernamePattern.test(value);
        const messageEl = document.getElementById('username-message');
        
        if (value === '') {
            messageEl.textContent = '';
            usernameInput.classList.remove('valid', 'invalid');
        } else if (isValid) {
            messageEl.textContent = '✓ Username is valid';
            messageEl.style.color = '#2ecc71';
            usernameInput.classList.add('valid');
            usernameInput.classList.remove('invalid');
        } else {
            messageEl.textContent = '✗ 3-20 characters (letters, numbers, underscores only)';
            messageEl.style.color = '#e74c3c';
            usernameInput.classList.add('invalid');
            usernameInput.classList.remove('valid');
        }
        
        validationState.username = isValid;
        updateProgress();
        return isValid;
    }
    
    // Validate email
    function validateEmail() {
        const value = emailInput.value.trim();
        const isValid = emailPattern.test(value);
        const messageEl = document.getElementById('email-message');
        
        if (value === '') {
            messageEl.textContent = '';
            emailInput.classList.remove('valid', 'invalid');
        } else if (isValid) {
            messageEl.textContent = '✓ Email is valid';
            messageEl.style.color = '#2ecc71';
            emailInput.classList.add('valid');
            emailInput.classList.remove('invalid');
        } else {
            messageEl.textContent = '✗ Please enter a valid email address';
            messageEl.style.color = '#e74c3c';
            emailInput.classList.add('invalid');
            emailInput.classList.remove('valid');
        }
        
        validationState.email = isValid;
        updateProgress();
        return isValid;
    }
    
    // Validate password
    function validatePassword() {
        const value = passwordInput.value;
        const isValid = passwordPattern.test(value);
        const messageEl = document.getElementById('password-message');
        
        if (value === '') {
            messageEl.textContent = '';
            passwordInput.classList.remove('valid', 'invalid');
        } else if (isValid) {
            messageEl.textContent = '✓ Password is strong';
            messageEl.style.color = '#2ecc71';
            passwordInput.classList.add('valid');
            passwordInput.classList.remove('invalid');
        } else {
            messageEl.textContent = '✗ Min 8 chars with uppercase, lowercase, and number';
            messageEl.style.color = '#e74c3c';
            passwordInput.classList.add('invalid');
            passwordInput.classList.remove('valid');
        }
        
        validationState.password = isValid;
        updateProgress();
        return isValid;
    }
    
    // Show notification
    function showNotification(message, isError = false) {
        notificationText.textContent = message;
        notification.style.background = isError ? '#e74c3c' : '#2ecc71';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        if (isFormValid()) {
            // Simulate form submission
            showNotification(`Welcome, ${usernameInput.value.trim()}! Account created successfully.`);
            
            // Reset form
            form.reset();
            Object.keys(validationState).forEach(key => validationState[key] = false);
            updateProgress();
            
            // Reset button position to right side
            isButtonOnRight = true;
            submitBtn.classList.remove('left');
            submitBtn.classList.add('right');
            
            // Reset input classes and messages
            [usernameInput, emailInput, passwordInput].forEach(input => {
                input.classList.remove('valid', 'invalid');
            });
            
            document.querySelectorAll('.validation-message').forEach(el => {
                el.textContent = '';
            });
        } else {
            showNotification('Please complete all fields correctly!', true);
        }
    }
    
    // Initialize event listeners
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    
    usernameInput.addEventListener('blur', validateUsername);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    
    form.addEventListener('submit', handleSubmit);
    
    // Initialize validation
    updateProgress();
    
    // Set initial button position to right side
    setTimeout(() => {
        submitBtn.classList.add('right');
        isButtonOnRight = true;
        canMove = true;
    }, 100);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Just ensure button stays visible
        if (!isFormValid()) {
            if (isButtonOnRight) {
                submitBtn.classList.remove('left');
                submitBtn.classList.add('right');
            } else {
                submitBtn.classList.remove('right');
                submitBtn.classList.add('left');
            }
        }
    });
});