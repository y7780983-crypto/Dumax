// app.js
// توجه: ابتدای این فایل (تعریف آبجکت APP، رویداد DOMContentLoaded،
// تابع navigateTo، باز/بسته‌شدن سایدبار و initSearch) در متن ارسالی شما
// وجود نداشت. بخش زیر همان چیزی است که در پیام شما آمده بود.

// Search in notes
if (window.NOTES_DATA) {
    window.NOTES_DATA.forEach(note => {
        if (note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: '📝 یادداشت',
                title: note.title,
                description: note.content.substring(0, 50) + '...',
                page: 'notes'
            });
        }
    });
}

displaySearchResults(results);

function displaySearchResults(results) {
    const container = document.getElementById('searchResults');

    if (results.length === 0) {
        container.innerHTML = '<div class="search-result-item">نتیجه‌ای یافت نشد</div>';
        return;
    }

    container.innerHTML = results.map(result => `
        <div class="search-result-item" data-page="${result.page}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <strong>${result.title}</strong>
                <span style="font-size:11px;color:var(--text-secondary);">${result.type}</span>
            </div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">
                ${result.description}
            </div>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) {
                navigateTo(page);
                container.innerHTML = '';
                document.getElementById('globalSearch').value = '';
            }
        });
    });
}

// Toast Notification
function initToast() {
    window.showToast = function(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast';

        if (type === 'success') {
            toast.classList.add('success');
        } else if (type === 'error') {
            toast.classList.add('error');
        }

        toast.classList.add('show');

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };
}

// App State Management
function loadAppState() {
    try {
        const savedState = localStorage.getItem('dumax_app_state');
        if (savedState) {
            const state = JSON.parse(savedState);
            APP.settings = { ...APP.settings, ...state.settings };
            APP.currentUser = state.user || null;
        }
    } catch (e) {
        console.error('Error loading app state:', e);
    }
}

function saveAppState() {
    try {
        const state = {
            settings: APP.settings,
            user: APP.currentUser
        };
        localStorage.setItem('dumax_app_state', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving app state:', e);
    }
}

// Auth Status
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('dumax_user') || 'null');
    if (user) {
        APP.currentUser = user;
        updateUIForAuth(true);
    } else {
        updateUIForAuth(false);
        // Show auth modal if not logged in
        setTimeout(() => {
            showAuthModal();
        }, 1000);
    }
}

function updateUIForAuth(isLoggedIn) {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    if (isLoggedIn && APP.currentUser) {
        profileName.textContent = APP.currentUser.name || 'کاربر';
        profileEmail.textContent = APP.currentUser.email || '';
    } else {
        profileName.textContent = 'کاربر مهمان';
        profileEmail.textContent = 'guest@dumax.com';
    }
}

// Settings Application
function applySettings() {
    // Dark mode
    if (!APP.settings.darkMode) {
        document.documentElement.style.setProperty('--dark', '#f5f5f5');
        document.documentElement.style.setProperty('--darker', '#e8e8e8');
        document.documentElement.style.setProperty('--dark-card', '#ffffff');
        document.documentElement.style.setProperty('--dark-card-hover', '#f0f0f0');
        document.documentElement.style.setProperty('--text', '#1a1a1a');
        document.documentElement.style.setProperty('--text-secondary', '#666666');
        document.documentElement.style.setProperty('--border', '#dddddd');
    }
}

// Auth Modal
function showAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('آیا از خروج خود مطمئن هستید؟')) {
        localStorage.removeItem('dumax_user');
        APP.currentUser = null;
        updateUIForAuth(false);
        showToast('از حساب خود خارج شدید', 'success');
        window.location.reload();
    }
});

// Export for other modules
window.APP = APP;
window.navigateTo = navigateTo;
window.showToast = showToast;
