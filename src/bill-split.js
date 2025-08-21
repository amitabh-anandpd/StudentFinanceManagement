class BillSplitManager {
    constructor() {
        this.selectedFriends = new Set();
        this.billAmount = 0;
        this.billDescription = '';
        this.splitAmounts = new Map();
        this.friends = this.loadFriends();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSplitButton();
        this.bindDropdownEvents();
    }

    loadFriends() {
        return [
            { id: 1, name: 'Alex Johnson', email: 'alex@email.com', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face' },
            { id: 2, name: 'Emma Davis', email: 'emma@email.com', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face' },
            { id: 3, name: 'Mike Wilson', email: 'mike@email.com', avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face' },
            { id: 4, name: 'Sarah Brown', email: 'sarah@email.com', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face' }
        ];
    }

    bindEvents() {
        // Bill amount input
        const billAmountInput = document.getElementById('bill-amount');
        if (billAmountInput) {
            billAmountInput.addEventListener('input', () => {
                this.billAmount = parseFloat(billAmountInput.value) || 0;
                this.updateSplitButton();
            });
        }

        // Bill description input
        const billDescriptionInput = document.getElementById('bill-description');
        if (billDescriptionInput) {
            billDescriptionInput.addEventListener('input', () => {
                this.billDescription = billDescriptionInput.value;
                this.updateSplitButton();
            });
        }

        // Friend selection
        const friendCheckboxes = document.querySelectorAll('input[name="friends"]');
        friendCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleFriendSelection(e);
            });
        });

        // Friend item clicks
        const friendItems = document.querySelectorAll('.friend-item');
        friendItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    this.handleFriendSelection({ target: checkbox });
                }
            });
        });

        // Split button
        const splitBtn = document.getElementById('split-btn');
        if (splitBtn) {
            splitBtn.addEventListener('click', () => {
                this.showSplitModal();
            });
        }

        // Modal events
        this.bindModalEvents();

        // Pending split actions
        this.bindPendingSplitEvents();
    }

    bindDropdownEvents() {
        const dropdownToggle = document.getElementById('dropdown-toggle');
        const dropdown = document.getElementById('user-dropdown');
        const dropdownMenu = document.getElementById('dropdown-menu');

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

        // Theme toggle in dropdown
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update theme toggle text
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (newTheme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }

        // Close dropdown
        document.getElementById('user-dropdown').classList.remove('active');
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isAuthenticated');
            window.location.href = 'login.html';
        }
    }

    handleFriendSelection(e) {
        const friendId = parseInt(e.target.value);
        const friendItem = e.target.closest('.friend-item');

        if (e.target.checked) {
            this.selectedFriends.add(friendId);
            friendItem.classList.add('selected');
        } else {
            this.selectedFriends.delete(friendId);
            friendItem.classList.remove('selected');
        }

        this.updateSplitButton();
    }

    updateSplitButton() {
        const splitBtn = document.getElementById('split-btn');
        const canSplit = this.billAmount > 0 && this.billDescription.trim() && this.selectedFriends.size > 0;
        
        splitBtn.disabled = !canSplit;
        
        if (canSplit) {
            splitBtn.innerHTML = `
                <i class="fas fa-calculator"></i>
                Split $${this.billAmount.toFixed(2)} with ${this.selectedFriends.size} friend${this.selectedFriends.size !== 1 ? 's' : ''}
            `;
        } else {
            splitBtn.innerHTML = `
                <i class="fas fa-calculator"></i>
                Calculate Split
            `;
        }
    }

    showSplitModal() {
        const modal = document.getElementById('split-modal');
        const totalPeople = this.selectedFriends.size + 1; // +1 for me
        const equalSplit = this.billAmount / totalPeople;

        // Update modal header
        document.getElementById('modal-bill-description').textContent = this.billDescription;
        document.getElementById('modal-total-amount').textContent = this.formatCurrency(this.billAmount);

        // Clear and populate split breakdown
        const breakdown = document.getElementById('split-breakdown');
        breakdown.innerHTML = '';

        // Initialize split amounts
        this.splitAmounts.clear();

        // Add friend amounts
        this.selectedFriends.forEach(friendId => {
            const friend = this.friends.find(f => f.id === friendId);
            if (friend) {
                this.splitAmounts.set(friendId, equalSplit);
                
                const amountItem = document.createElement('div');
                amountItem.className = 'amount-item';
                amountItem.innerHTML = `
                    <div class="person-info">
                        <div class="person-avatar">
                            <img src="${friend.avatar}" alt="${friend.name}">
                        </div>
                        <span class="person-name">${friend.name}</span>
                    </div>
                    <div class="amount-input">
                        <input type="number" step="0.01" value="${equalSplit.toFixed(2)}" 
                               data-friend-id="${friendId}" class="friend-amount-input">
                    </div>
                `;
                breakdown.appendChild(amountItem);
            }
        });

        // Update my amount
        this.updateMyAmount();

        // Bind amount input events
        this.bindAmountInputEvents();

        // Show modal
        modal.classList.add('active');
    }

    bindAmountInputEvents() {
        const amountInputs = document.querySelectorAll('.friend-amount-input');
        amountInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const friendId = parseInt(e.target.dataset.friendId);
                const amount = parseFloat(e.target.value) || 0;
                this.splitAmounts.set(friendId, amount);
                this.updateMyAmount();
            });
        });
    }

    updateMyAmount() {
        const friendsTotal = Array.from(this.splitAmounts.values()).reduce((sum, amount) => sum + amount, 0);
        const myAmount = Math.max(0, this.billAmount - friendsTotal);
        
        document.getElementById('my-amount-display').textContent = this.formatCurrency(myAmount);
        
        // Validate total doesn't exceed bill amount
        const totalSplit = friendsTotal + myAmount;
        const confirmBtn = document.getElementById('confirm-split');
        
        if (totalSplit > this.billAmount + 0.01) { // Allow small rounding errors
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
        } else {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
        }
    }

    bindModalEvents() {
        const modal = document.getElementById('split-modal');
        const closeBtn = document.getElementById('close-split-modal');
        const cancelBtn = document.getElementById('cancel-split');
        const confirmBtn = document.getElementById('confirm-split');
        const overlay = modal?.querySelector('.modal-overlay');

        // Close modal events
        [closeBtn, cancelBtn, overlay].forEach(element => {
            element?.addEventListener('click', () => {
                this.closeSplitModal();
            });
        });

        // Confirm split
        confirmBtn?.addEventListener('click', () => {
            this.confirmSplit();
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                this.closeSplitModal();
            }
        });
    }

    closeSplitModal() {
        const modal = document.getElementById('split-modal');
        modal.classList.remove('active');
    }

    confirmSplit() {
        // Show loading state
        const confirmBtn = document.getElementById('confirm-split');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        confirmBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.closeSplitModal();
            this.showSuccessMessage('Split requests sent successfully!');
            this.resetForm();
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }, 2000);
    }

    resetForm() {
        // Clear form inputs
        document.getElementById('bill-amount').value = '';
        document.getElementById('bill-description').value = '';
        
        // Uncheck all friends
        const friendCheckboxes = document.querySelectorAll('input[name="friends"]');
        friendCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Remove selected class from friend items
        const friendItems = document.querySelectorAll('.friend-item');
        friendItems.forEach(item => {
            item.classList.remove('selected');
        });

        // Reset state
        this.selectedFriends.clear();
        this.billAmount = 0;
        this.billDescription = '';
        this.splitAmounts.clear();
        this.updateSplitButton();
    }

    bindPendingSplitEvents() {
        const acceptButtons = document.querySelectorAll('.action-btn.accept');
        const rejectButtons = document.querySelectorAll('.action-btn.reject');

        acceptButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePendingSplit(e.target.closest('.action-btn'), 'accept');
            });
        });

        rejectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePendingSplit(e.target.closest('.action-btn'), 'reject');
            });
        });
    }

    handlePendingSplit(button, action) {
        const splitId = button.dataset.splitId;
        const splitItem = button.closest('.pending-split-item');
        const actionText = action === 'accept' ? 'Accept' : 'Reject';
        
        // Show loading state
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${actionText}ing...`;
        button.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Remove the split item with animation
            splitItem.style.opacity = '0';
            splitItem.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                splitItem.remove();
                this.updatePendingCount();
                this.showSuccessMessage(`Split request ${action}ed successfully!`);
            }, 300);
        }, 1000);
    }

    updatePendingCount() {
        const pendingItems = document.querySelectorAll('.pending-split-item');
        const count = pendingItems.length;
        const countElement = document.getElementById('pending-count');
        
        if (count === 0) {
            countElement.textContent = 'No pending splits';
            countElement.style.background = 'rgba(16, 185, 129, 0.1)';
            countElement.style.color = 'var(--success)';
            countElement.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        } else {
            countElement.textContent = `${count} pending`;
        }
    }

    showSuccessMessage(message) {
        // Remove existing messages
        const existing = document.querySelectorAll('.success-message, .error-message');
        existing.forEach(msg => msg.remove());

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        // Insert at the top of the main content
        const container = document.querySelector('.container');
        container.insertBefore(successDiv, container.firstChild);

        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }
}

// Initialize bill split manager
document.addEventListener('DOMContentLoaded', () => {
    new BillSplitManager();
});