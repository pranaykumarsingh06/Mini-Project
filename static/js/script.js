// ===== Password Toggle Visibility =====
document.addEventListener('DOMContentLoaded', () => {

    // Password visibility toggles
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const eyeOpen = btn.querySelector('.eye-open');
            const eyeClosed = btn.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                if (eyeOpen) eyeOpen.style.display = 'none';
                if (eyeClosed) eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                if (eyeOpen) eyeOpen.style.display = 'block';
                if (eyeClosed) eyeClosed.style.display = 'none';
            }
        });
    });

    // ===== Flash Message Close Buttons =====
    document.querySelectorAll('.flash-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.parentElement;
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-8px)';
            setTimeout(() => msg.remove(), 300);
        });
    });

    // Auto-dismiss flash messages after 5 seconds
    document.querySelectorAll('.flash-message').forEach(msg => {
        setTimeout(() => {
            if (msg.parentElement) {
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(-8px)';
                setTimeout(() => msg.remove(), 300);
            }
        }, 5000);
    });

    // ===== Form Validation =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        setupRegisterValidation(registerForm);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginValidation(loginForm);
    }

    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        setupForgotValidation(forgotForm);
    }

    // ===== Background Parallax Effect =====
    const bgImg = document.querySelector('.page-bg img');
    if (bgImg) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 8;
            const y = (e.clientY / window.innerHeight - 0.5) * 8;
            bgImg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
        });
    }
});


// ===== Register Form Validation =====
function setupRegisterValidation(form) {
    const fullName = form.querySelector('#full_name');
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirm_password');
    const phone = form.querySelector('#phone');
    const agreeTerms = form.querySelector('#agree_terms');

    // Real-time validation
    if (fullName) {
        fullName.addEventListener('blur', () => {
            validateField(fullName, fullName.value.trim().length >= 2, 'Name must be at least 2 characters');
        });
    }

    if (email) {
        email.addEventListener('blur', () => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
            validateField(email, isValid, 'Please enter a valid email address');
            if (isValid) checkEmailAvailability(email);
        });
    }

    if (password) {
        password.addEventListener('input', () => {
            const isValid = password.value.length >= 6;
            validateField(password, isValid, 'Password must be at least 6 characters');
            if (confirmPassword && confirmPassword.value) {
                validateField(confirmPassword, confirmPassword.value === password.value, 'Passwords do not match');
            }
        });
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            validateField(confirmPassword, confirmPassword.value === password.value, 'Passwords do not match');
        });
    }

    if (phone) {
        phone.addEventListener('input', (e) => {
            // Allow only numbers, spaces, dashes, plus sign, and parentheses
            e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, '');
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        let isValid = true;

        if (fullName && fullName.value.trim().length < 2) {
            validateField(fullName, false, 'Name must be at least 2 characters');
            isValid = false;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            validateField(email, false, 'Please enter a valid email address');
            isValid = false;
        }

        if (password && password.value.length < 6) {
            validateField(password, false, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (confirmPassword && confirmPassword.value !== password.value) {
            validateField(confirmPassword, false, 'Passwords do not match');
            isValid = false;
        }

        if (agreeTerms && !agreeTerms.checked) {
            isValid = false;
            agreeTerms.parentElement.style.animation = 'shake 0.4s ease';
            setTimeout(() => agreeTerms.parentElement.style.animation = '', 400);
        }

        if (!isValid) {
            e.preventDefault();
        } else {
            const btn = form.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = 'Creating Account';
        }
    });
}


// ===== Login Form Validation =====
function setupLoginValidation(form) {
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');

    form.addEventListener('submit', (e) => {
        let isValid = true;

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            validateField(email, false, 'Please enter a valid email');
            isValid = false;
        }

        if (password && password.value.length === 0) {
            validateField(password, false, 'Password is required');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
        } else {
            const btn = form.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = 'Signing In';
        }
    });
}


// ===== Forgot Password Validation =====
function setupForgotValidation(form) {
    const email = form.querySelector('#email');

    form.addEventListener('submit', (e) => {
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            validateField(email, false, 'Please enter a valid email');
            e.preventDefault();
        } else {
            const btn = form.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = 'Sending';
        }
    });
}


// ===== Utility: Validate Field =====
function validateField(input, isValid, errorMessage) {
    const wrapper = input.closest('.form-group') || input.parentElement;
    let msg = wrapper.querySelector('.validation-message');

    if (!msg) {
        msg = document.createElement('div');
        msg.className = 'validation-message';
        wrapper.appendChild(msg);
    }

    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        msg.className = 'validation-message';
        msg.textContent = '';
        msg.style.display = 'none';
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        msg.className = 'validation-message error';
        msg.textContent = errorMessage;
        msg.style.display = 'block';
    }
}


// ===== Check Email Availability =====
async function checkEmailAvailability(emailInput) {
    try {
        const response = await fetch('/api/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value })
        });
        const data = await response.json();

        if (!data.available) {
            validateField(emailInput, false, data.message);
        }
    } catch (err) {
        // Silently fail – server-side will catch it
    }
}


// ===== Shake Animation (CSS injection) =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(shakeStyle);
