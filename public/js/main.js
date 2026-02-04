// Main page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    redirectIfLoggedIn();

    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    // Get button elements
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    // Get close buttons
    const closeBtns = document.getElementsByClassName('close');
    
    // Get forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Switch links
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    // Open login modal
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    // Open signup modal
    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    getStartedBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    // Close modals
    Array.from(closeBtns).forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    // Switch between login and signup
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = await login(email, password);
        
        if (result.success) {
            window.location.href = '/dashboard';
        } else {
            if (result.error.includes('Invalid credentials')) {
                alert('❌ Account not found!\n\n' + 
                      'This email is not registered yet.\n' + 
                      'Please click "Sign up" to create an account first.\n\n' +
                      'पहले Sign Up करें!');
            } else {
                alert(result.error);
            }
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const level = document.getElementById('signupLevel').value;

        const result = await register(username, email, password, level);
        
        if (result.success) {
            window.location.href = '/dashboard';
        } else {
            if (result.error.includes('already exists')) {
                alert('✅ Good news! This email is already registered.\n\n' + 
                      'Please use "Login" button to sign in.\n\n' +
                      'Login button पर click करें!');
            } else {
                alert(result.error);
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Password toggle function
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Google Sign In
function loginWithGoogle() {
    // Simulate Google OAuth - In production, integrate with Google OAuth
    const googleEmail = prompt('Enter your Google email:');
    if (!googleEmail) return;
    
    const password = 'google_' + Math.random().toString(36).substring(7);
    
    // Try to login first, if fails then register
    login(googleEmail, password).then(result => {
        if (result.success) {
            window.location.href = '/dashboard';
        } else {
            // Auto register with Google email
            const username = googleEmail.split('@')[0];
            register(username, googleEmail, password, 'beginner').then(regResult => {
                if (regResult.success) {
                    window.location.href = '/dashboard';
                } else {
                    alert('Error: ' + regResult.error);
                }
            });
        }
    });
}

function signupWithGoogle() {
    loginWithGoogle(); // Same flow for signup
}
