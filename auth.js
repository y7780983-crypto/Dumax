// Authentication System
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const closeAuthModal = document.getElementById('closeAuthModal');

    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            // Update tabs
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update forms
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });

            if (tabName === 'login') {
                document.getElementById('loginForm').classList.add('active');
                document.getElementById('authModalTitle').textContent = 'ورود به DUMAX';
            } else {
                document.getElementById('registerForm').classList.add('active');
                document.getElementById('authModalTitle').textContent = 'ثبت‌نام در DUMAX';
            }
        });
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showToast('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }

        // Login logic
        loginUser(email, password);
    });

    // Register
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!name || !email || !password) {
            showToast('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
            return;
        }

        // Register logic
        registerUser(name, email, password);
    });

    // Close modal
    closeAuthModal.addEventListener('click', () => {
        document.getElementById('authModal').classList.remove('active');
    });

    // Close on outside click
    document.getElementById('authModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('authModal').classList.remove('active');
        }
    });
}

// توجه: توابع loginUser و registerUser در متن ارسالی شما وجود نداشتند
// (فایل در همین‌جا قطع شده بود). لطفاً ادامه‌ی auth.js را ارسال کنید.
