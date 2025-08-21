document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdown = document.getElementById('user-dropdown');
    const themeToggle = document.getElementById('theme-toggle');
    const logoutBtn = document.getElementById('logout-btn');

    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');
            
            if (newTheme === 'dark') {
                icon.className = 'fas fa-sun';
                text.textContent = 'Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Dark Mode';
            }

            dropdown?.classList.remove('active');
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isAuthenticated');
                window.location.href = 'login.html';
            }
        });
    }
});
