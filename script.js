document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const form = document.getElementById('signupform');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
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
        } else {
            submitBtn.classList.remove('ready');
            submitBtn.disabled = true;
        }
    }
    
    // Move button horizontally based on cursor position
    function moveButton(e) {
        if (isFormValid()) return; // Don't move if form is valid
        
        const buttonRect = submitBtn.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const cursorX = e.clientX;
        
        // Calculate horizontal distance from cursor to button center
        const distanceX = cursorX - buttonCenterX;
        
        // If cursor is within 100px of button, move it horizontally
        if (Math.abs(distanceX) < 100) {
            // Move button away from cursor
            const moveDirection = distanceX > 0 ? -1 : 1; // Move opposite to cursor
            const moveDistance = 100 - Math.abs(distanceX); // More movement when closer
            
            // Get button wrapper boundaries
            const wrapper = document.querySelector('.button-wrapper');
            const wrapperRect = wrapper.getBoundingClientRect();
            
            // Calculate new position
            let newLeft = submitBtn.offsetLeft + (moveDirection * moveDistance * 0.5);
            
            // Keep button within wrapper bounds (with 10px padding)
            const maxLeft = wrapperRect.width - buttonRect.width - 10;
            newLeft = Math.max(10, Math.min(newLeft, maxLeft));
            
            // Apply smooth transition
            submitBtn.style.transition = 'left 0.3s ease-out';
            submitBtn.style.left = newLeft + 'px';
            
            // Reset transition after movement
            setTimeout(() => {
                submitBtn.style.transition = '';
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
            
            // Reset button position
            submitBtn.style.left = '';
            
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
    const buttonWrapper = document.querySelector('.button-wrapper');
    buttonWrapper.addEventListener('mousemove', moveButton);
    
    form.addEventListener('submit', handleSubmit);
    
    // Initialize validation
    updateProgress();
    
    // Center button initially
    submitBtn.style.position = 'relative';
    submitBtn.style.left = '0';
});