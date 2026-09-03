// Profile System
document.addEventListener('DOMContentLoaded', () => {
    initProfile();
});

function initProfile() {
    // Load user data
    loadProfileData();

    // Update profile button
    document.getElementById('updateProfileBtn').addEventListener('click', updateProfile);

    // Change avatar
    document.getElementById('changeAvatarBtn').addEventListener('click', changeAvatar);

    // Edit name input - auto update display
    document.getElementById('editNameInput').addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            document.getElementById('profileName').textContent = e.target.value;
        }
    });
}

function loadProfileData() {
    const user = JSON.parse(localStorage.getItem('dumax_user') || 'null');

    if (user) {
        document.getElementById('profileName').textContent = user.name || 'کاربر';
        document.getElementById('profileEmail').textContent = user.email || '';
        document.getElementById('editNameInput').value = user.name || '';

        if (user.avatar) {
            document.querySelector('.profile-avatar img').src = user.avatar;
        }
    } else {
        // Guest user
        document.getElementById('profileName').textContent = 'کاربر مهمان';
        document.getElementById('profileEmail').textContent = 'guest@dumax.com';
        document.getElementById('editNameInput').value = '';
    }
}

function updateProfile() {
    const name = document.getElementById('editNameInput').value.trim();

    if (!name) {
        showToast('لطفاً نام خود را وارد کنید', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('dumax_user') || 'null');

    if (user) {
        // Update user in localStorage
        const users = JSON.parse(localStorage.getItem('dumax_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            users[userIndex].name = name;
            localStorage.setItem('dumax_users', JSON.stringify(users));
        }

        // Update current user
        user.name = name;
        localStorage.setItem('dumax_user', JSON.stringify(user));
        window.APP.currentUser = user;

        // Update display
        document.getElementById('profileName').textContent = name;

        showToast('پروفایل با موفقیت بروزرسانی شد', 'success');
    } else {
        // Create guest user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: 'guest@dumax.com',
            avatar: 'assets/images/default-avatar.png'
        };

        localStorage.setItem('dumax_user', JSON.stringify(newUser));
        window.APP.currentUser = newUser;

        document.getElementById('profileName').textContent = name;
        document.getElementById('profileEmail').textContent = 'guest@dumax.com';

        showToast('پروفایل مهمان ایجاد شد', 'success');
    }
}

function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const avatarUrl = event.target.result;

            // Update avatar display
            document.querySelector('.profile-avatar img').src = avatarUrl;

            // Save to user data
            const user = JSON.parse(localStorage.getItem('dumax_user') || 'null');
            if (user) {
                user.avatar = avatarUrl;
                localStorage.setItem('dumax_user', JSON.stringify(user));

                // Update in users list
                const users = JSON.parse(localStorage.getItem('dumax_users') || '[]');
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex].avatar = avatarUrl;
                    localStorage.setItem('dumax_users', JSON.stringify(users));
                }
            }

            showToast('عکس پروفایل تغییر کرد', 'success');
        };
        reader.readAsDataURL(file);
    };

    input.click();
}

// توجه: صادرات نهایی (window.xxx = ...) این فایل در متن ارسالی شما
// مشخص نبود؛ در صورت نیاز اضافه کنید، مثلاً:
// window.loadProfileData = loadProfileData;
// window.updateProfile = updateProfile;
