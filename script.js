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
    
    // Button movement variables
    let buttonPosition = 50; // Percentage from left (0-100)
    let lastMoveTime = 0;
    const moveCooldown = 300; // ms between moves
    let isMoving = false;
    
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
            submitBtn.disabled = false;
            // Reset button to center when form is valid
            buttonPosition = 50;
            updateButtonPosition();
        } else {
            submitBtn.classList.remove('ready');
            submitBtn.disabled = true;
        }
    }
    
    // Update button position based on percentage
    function updateButtonPosition() {
        const wrapperWidth = buttonWrapper.offsetWidth;
        const buttonWidth = submitBtn.offsetWidth;
        
        // Calculate left position in pixels
        const maxLeft = wrapperWidth - buttonWidth - 10; // 10px padding
        const leftPosition = (buttonPosition / 100) * maxLeft;
        
        submitBtn.style.left = `${leftPosition}px`;
    }
    
    // Move button to opposite side when cursor is near
    function moveButtonAway(e) {
        if (isFormValid()) return; // Don't move if form is valid
        
        const currentTime = Date.now();
        if (currentTime - lastMoveTime < moveCooldown) return; // Cooldown check
        
        const buttonRect = submitBtn.getBoundingClientRect();
        const wrapperRect = buttonWrapper.getBoundingClientRect();
        
        // Check if cursor is near the button (within 80px)
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        const distanceX = Math.abs(cursorX - buttonCenterX);
        const distanceY = Math.abs(cursorY - buttonCenterY);
        
        // If cursor is within 80px of button center
        if (distanceX < 80 && distanceY < 80 && !isMoving) {
            isMoving = true;
            lastMoveTime = currentTime;
            
            // Add moving class for transition
            submitBtn.classList.add('moving');
            
            // Determine current position and move to opposite side
            if (buttonPosition > 50) {
                // Button is on right side, move to left
                buttonPosition = 20 + Math.random() * 20; // Random between 20-40%
            } else {
                // Button is on left side, move to right
                buttonPosition = 60 + Math.random() * 20; // Random between 60-80%
            }
            
            updateButtonPosition();
            
            // Remove moving class after transition
            setTimeout(() => {
                submitBtn.classList.remove('moving');
                isMoving = false;
            }, 300);
        }
    }
    
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
            
            // Reset button to center
            buttonPosition = 50;
            updateButtonPosition();
            
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
    
    // Add mousemove listener to button wrapper
    buttonWrapper.addEventListener('mousemove', moveButtonAway);
    
    // Also track mouse movement near the button from document
    document.addEventListener('mousemove', function(e) {
        if (isFormValid()) return;
        
        const buttonRect = submitBtn.getBoundingClientRect();
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        
        // Check if cursor is within 100px of button
        if (cursorX > buttonRect.left - 100 && cursorX < buttonRect.right + 100 &&
            cursorY > buttonRect.top - 100 && cursorY < buttonRect.bottom + 100) {
            moveButtonAway(e);
        }
    });
    
    form.addEventListener('submit', handleSubmit);
    
    // Initialize validation and button position
    updateProgress();
    updateButtonPosition();
    
    // Handle window resize
    window.addEventListener('resize', updateButtonPosition);
});