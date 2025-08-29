
function validateName(name) {
    return /^[A-Za-z ]{2,50}$/.test(name.trim());
}
function validateNumber(number) {
    return /^\d{10}$/.test(number.trim());
}
function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email.trim());
}
function validatePassword(password) {
    return password.length >= 8;
}

const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const successPage = document.getElementById('success-page');

document.getElementById('to-signin').onclick = (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
};
document.getElementById('to-signup').onclick = (e) => {
    e.preventDefault();
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
};
function setError(input, message) {
    input.classList.add('error');
    let msg = input.nextElementSibling;
    if (!msg || !msg.classList.contains('error-message')) {
        msg = document.createElement('div');
        msg.className = 'error-message';
        input.parentNode.insertBefore(msg, input.nextSibling);
    }
    msg.textContent = message;
}
function clearError(input) {
    input.classList.remove('error');
    let msg = input.nextElementSibling;
    if (msg && msg.classList.contains('error-message')) {
        msg.textContent = '';
    }
}
const passwordInput = document.getElementById('signup-password');
const strengthBar = document.getElementById('strengthBar');
passwordInput && passwordInput.addEventListener('input', function() {
    const val = passwordInput.value;
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    if (val.length === 0) {
        strengthBar.style.width = '0';
        strengthBar.className = 'strength-bar';
    } else if (strength <= 1) {
        strengthBar.style.width = '33%';
        strengthBar.className = 'strength-bar strength-weak';
        strengthBar.style.background = '#e74c3c';
    } else if (strength === 2 || strength === 3) {
        strengthBar.style.width = '66%';
        strengthBar.className = 'strength-bar strength-medium';
        strengthBar.style.background = '#f1c40f';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.className = 'strength-bar strength-strong';
        strengthBar.style.background = '#2ecc71';
    }
});
signupForm.onsubmit = function(e) {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('signup-name');
    const number = document.getElementById('signup-number');
    const email = document.getElementById('signup-email');
    const password = document.getElementById('signup-password');
    const repassword = document.getElementById('signup-repassword');
    if (!validateName(name.value)) {
        setError(name, 'Enter a valid name (letters only, 2-50 chars)');
        valid = false;
    } else clearError(name);
    if (!validateNumber(number.value)) {
        setError(number, 'Enter a valid 10-digit number');
        valid = false;
    } else clearError(number);
    if (!validateEmail(email.value)) {
        setError(email, 'Enter a valid email');
        valid = false;
    } else clearError(email);
    if (!validatePassword(password.value)) {
        setError(password, 'Password must be at least 8 characters');
        valid = false;
    } else clearError(password);
    if (password.value !== repassword.value) {
        setError(repassword, 'Passwords do not match');
        valid = false;
    } else clearError(repassword);

    if (!valid) return;
    const user = {
        name: name.value.trim(),
        number: number.value.trim(),
        email: email.value.trim(),
        password: password.value
    };
    localStorage.setItem('user', JSON.stringify(user));
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
    signinForm.reset();
    if(strengthBar) { strengthBar.style.width = '0'; strengthBar.className = 'strength-bar'; }
};
window.addEventListener('DOMContentLoaded', function() {
    const toggleModeBtn = document.getElementById('toggle-mode');
    if (toggleModeBtn) {
        toggleModeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            document.getElementById('container').classList.toggle('dark-mode');
            toggleModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }
});
document.querySelector('.social-btn.google')?.addEventListener('click', () => alert('Google login not implemented.'));
document.querySelector('.social-btn.github')?.addEventListener('click', () => alert('GitHub login not implemented.'));
signinForm.onsubmit = function(e) {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('signin-name');
    const number = document.getElementById('signin-number');
    const password = document.getElementById('signin-password');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!validateName(name.value)) {
        setError(name, 'Enter a valid name');
        valid = false;
    } else clearError(name);
    if (!validateNumber(number.value)) {
        setError(number, 'Enter a valid number');
        valid = false;
    } else clearError(number);
    if (!validatePassword(password.value)) {
        setError(password, 'Enter your password');
        valid = false;
    } else clearError(password);

    if (!valid) return;
    if (
        user &&
        user.name === name.value.trim() &&
        user.number === number.value.trim() &&
        user.password === password.value
    ) {
        signinForm.classList.add('hidden');
        successPage.classList.remove('hidden');
    } else {
        setError(password, 'Invalid credentials');
    }
};
[...document.querySelectorAll('input')].forEach(input => {
    input.addEventListener('input', () => clearError(input));
});
setTimeout(() => {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const target = document.getElementById(this.dataset.target);
            if (target.type === 'password') {
                target.type = 'text';
                this.textContent = '🙈';
            } else {
                target.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}, 100);
const cursor = document.querySelector('.custom-cursor');
let cursorMoveTimeout;

function isPointerZone(target) {
    if (!target) return false;
    const container = document.getElementById('container');
    if (!container) return false;
    return (
        container.contains(target) &&
        (target.matches('input, button, a, .toggle-password'))
    );
}

window.addEventListener('mousemove', e => {
    if (isPointerZone(e.target)) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'pointer';
    } else {
        cursor.style.display = '';
        document.body.style.cursor = '';
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.classList.add('moving');
        cursor.style.transform = 'translate(-50%, -50%) scale(1.18)';
        clearTimeout(cursorMoveTimeout);
        cursorMoveTimeout = setTimeout(() => {
            cursor.classList.remove('moving');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 80);
    }
});
window.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.85)';
    cursor.style.background = 'linear-gradient(135deg, #667eea 60%, #fff 100%)';
});
window.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
    cursor.style.background = 'linear-gradient(135deg, #fff 60%, #667eea 100%)';
    setTimeout(() => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
});