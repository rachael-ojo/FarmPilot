// ==========================================
// FarmPilot - Poultry Farm Tracker
// Full Application Logic with Authentication
// ==========================================

class FarmPilot {
    constructor() {
        this.users = {};
        this.currentUser = null;
        this.activities = [];
        this.inventory = [];
        this.healthRecords = [];
        this.expenses = [];
        this.init();
    }

    init() {
        this.loadAllData();
        this.setupEventListeners();
        this.checkUserLoggedIn();
    }

    // ==========================================
    // Authentication
    // ==========================================

    checkUserLoggedIn() {
        const loggedInUser = localStorage.getItem('farmPilotCurrentUser');
        if (loggedInUser) {
            this.currentUser = JSON.parse(loggedInUser);
            this.loadUserData();
            this.showApp();
        } else {
            this.showAuthModal();
        }
    }

    toggleAuthForm() {
        document.getElementById('loginForm').classList.toggle('active');
        document.getElementById('signupForm').classList.toggle('active');
    }

    togglePasswordVisibility(fieldId) {
        const field = document.getElementById(fieldId);
        if (field.type === 'password') {
            field.type = 'text';
        } else {
            field.type = 'password';
        }
    }

    setupEventListeners() {
        // Auth
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm')?.addEventListener('submit', (e) => this.handleSignup(e));

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changePage(e.target.dataset.page));
        });

        // Forms
        document.getElementById('activityForm')?.addEventListener('submit', (e) => this.handleActivitySubmit(e));
        document.getElementById('inventoryForm')?.addEventListener('submit', (e) => this.handleInventorySubmit(e));
        document.getElementById('healthForm')?.addEventListener('submit', (e) => this.handleHealthSubmit(e));
        document.getElementById('expenseForm')?.addEventListener('submit', (e) => this.handleExpenseSubmit(e));

        // Reports
        document.getElementById('generateReportBtn')?.addEventListener('click', () => this.generateReport());

        // Settings
        document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('clearDataBtn')?.addEventListener('click', () => this.clearAllData());
        document.getElementById('deleteAccountBtn')?.addEventListener('click', () => this.deleteAccount());

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users[email];
        if (!user) {
            this.showAlert('User not found', 'error');
            return;
        }

        if (user.password !== password) {
            this.showAlert('Incorrect password', 'error');
            return;
        }

        this.currentUser = { email: user.email, name: user.name, farm: user.farm };
        localStorage.setItem('farmPilotCurrentUser', JSON.stringify(this.currentUser));
        this.loadUserData();
        this.showApp();
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const farm = document.getElementById('farmName').value;
        const password = document.getElementById('signupPassword').value;
        const password2 = document.getElementById('signupPassword2').value;

        if (password !== password2) {
            this.showAlert('Passwords do not match', 'error');
            return;
        }

        if (this.users[email]) {
            this.showAlert('Email already registered', 'error');
            return;
        }

        this.users[email] = { name, email, farm, password };
        this.saveUsersData();
        this.showAlert('Account created successfully! Please login.', 'success');
        this.toggleAuthForm();
        document.getElementById('signupForm').reset();
    }

    // ==========================================
    // Data Management
    // ==========================================

    saveUsersData() {
        localStorage.setItem('farmPilotUsers', JSON.stringify(this.users));
    }

    loadAllData() {
        this.users = JSON.parse(localStorage.getItem('farmPilotUsers')) || {};
    }

    saveUserData() {
        const userKey = this.currentUser.email;
        localStorage.setItem(`farmPilot_${userKey}_activities`, JSON.stringify(this.activities));
        localStorage.setItem(`farmPilot_${userKey}_inventory`, JSON.stringify(this.inventory));
        localStorage.setItem(`farmPilot_${userKey}_health`, JSON.stringify(this.healthRecords));
        localStorage.setItem(`farmPilot_${userKey}_expenses`, JSON.stringify(this.expenses));
    }

    loadUserData() {
        const userKey = this.currentUser.email;
        this.activities = JSON.parse(localStorage.getItem(`farmPilot_${userKey}_activities`)) || [];
        this.inventory = JSON.parse(localStorage.getItem(`farmPilot_${userKey}_inventory`)) || [];
        this.healthRecords = JSON.parse(localStorage.getItem(`farmPilot_${userKey}_health`)) || [];
        this.expenses = JSON.parse(localStorage.getItem(`farmPilot_${userKey}_expenses`)) || [];
    }

    // ==========================================
    // UI Management
    // ==========================================

    showAuthModal() {
        document.getElementById('authModal').classList.add('active');
        document.getElementById('appContainer').style.display = 'none';
    }

    showApp() {
        document.getElementById('authModal').classList.remove('active');
        document.getElementById('appContainer').style.display = 'flex';
        this.updateUserInfo();
        this.updateDashboard();
        this.setDefaultDates();
    }

    updateUserInfo() {
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('farmNameDisplay').textContent = this.currentUser.farm;
        document.getElementById('settingsName').textContent = this.currentUser.name;
        document.getElementById('settingsEmail').textContent = this.currentUser.email;
        document.getElementById('settingsFarmName').textContent = this.currentUser.farm;
    }

    changePage(pageName) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageName).classList.add('active');

        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        if (pageName === 'dashboard') {
            this.updateDashboard();
        } else if (pageName === 'inventory') {
            this.displayInventory();
        } else if (pageName === 'health') {
            this.displayHealthRecords();
        } else if (pageName === 'expenses') {
            this.displayExpenses();
        } else if (pageName === 'reports') {
            this.setupReportsPage();
        }
    }

    // ==========================================
    // Activity Management
    // ==========================================

    handleActivitySubmit(e) {
        e.preventDefault();

        const activity = {
            id: Date.now(),
            type: document.getElementById('activityType').value,
            date: document.getElementById('activityDate').value,
            time: document.getElementById('activityTime').value,
            quantity: document.getElementById('quantity').value || 0,
            notes: document.getElementById('notes').value,
            timestamp: new Date().toISOString()
        };

        this.activities.push(activity);
        this.saveUserData();
        this.showAlert('Activity logged successfully!', 'success');
        document.getElementById('activityForm').reset();
        this.setDefaultDates();
        this.updateDashboard();
    }

    deleteActivity(id) {
        this.activities = this.activities.filter(a => a.id !== id);
        this.saveUserData();
        this.updateDashboard();
        this.showAlert('Activity deleted', 'success');
    }

    // ==========================================
    // Inventory Management
    // ==========================================

    handleInventorySubmit(e) {
        e.preventDefault();

        const itemName = document.getElementById('itemName').value;
        const existingItem = this.inventory.find(item => item.name.toLowerCase() === itemName.toLowerCase());

        const inventoryItem = {
            id: existingItem?.id || Date.now(),
            name: itemName,
            type: document.getElementById('itemType').value,
            quantity: parseFloat(document.getElementById('itemQuantity').value),
            unit: document.getElementById('itemUnit').value,
            cost: parseFloat(document.getElementById('itemCost').value) || 0,
            lastUpdated: new Date().toISOString()
        };

        if (existingItem) {
            const index = this.inventory.indexOf(existingItem);
            this.inventory[index] = inventoryItem;
            this.showAlert('Inventory item updated', 'success');
        } else {
            this.inventory.push(inventoryItem);
            this.showAlert('Inventory item added', 'success');
        }

        this.saveUserData();
        document.getElementById('inventoryForm').reset();
        this.displayInventory();
        this.updateDashboard();
    }

    displayInventory() {
        const container = document.getElementById('inventoryList');

        if (this.inventory.length === 0) {
            container.innerHTML = '<p class="empty-state">No inventory items yet</p>';
            return;
        }

        let html = '<table><thead><tr><th>Item Name</th><th>Type</th><th>Quantity</th><th>Unit</th><th>Cost/Unit</th><th>Last Updated</th><th>Action</th></tr></thead><tbody>';

        this.inventory.forEach(item => {
            const date = new Date(item.lastUpdated).toLocaleDateString();
            html += `
                <tr>
                    <td>${this.escapeHtml(item.name)}</td>
                    <td>${item.type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>$${item.cost.toFixed(2)}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn-danger" onclick="app.deleteInventory(${item.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    deleteInventory(id) {
        this.inventory = this.inventory.filter(item => item.id !== id);
        this.saveUserData();
        this.displayInventory();
        this.showAlert('Inventory item deleted', 'success');
    }

    // ==========================================
    // Health Tracking
    // ==========================================

    handleHealthSubmit(e) {
        e.preventDefault();

        const healthRecord = {
            id: Date.now(),
            date: document.getElementById('healthDate').value,
            affectedBirds: document.getElementById('affectedBirds').value,
            symptoms: document.getElementById('symptoms').value,
            treatment: document.getElementById('treatment').value,
            veterinarian: document.getElementById('veterinarian').value,
            cost: parseFloat(document.getElementById('healthCost').value) || 0,
            timestamp: new Date().toISOString()
        };

        this.healthRecords.push(healthRecord);
        this.saveUserData();
        this.showAlert('Health record logged successfully!', 'success');
        document.getElementById('healthForm').reset();
        this.displayHealthRecords();
        this.updateDashboard();
    }

    displayHealthRecords() {
        const container = document.getElementById('healthRecords');

        if (this.healthRecords.length === 0) {
            container.innerHTML = '<p class="empty-state">No health records yet</p>';
            return;
        }

        let html = '';
        this.healthRecords.forEach(record => {
            const date = new Date(record.date).toLocaleDateString();
            html += `
                <div class="health-item">
                    <div class="item-header">
                        <span class="item-type">🏥 ${date}</span>
                        <button class="btn-danger" onclick="app.deleteHealthRecord(${record.id})">Delete</button>
                    </div>
                    <div class="item-details">
                        <p><strong>Birds Affected:</strong> ${record.affectedBirds}</p>
                        <p><strong>Symptoms:</strong> ${this.escapeHtml(record.symptoms)}</p>
                        ${record.treatment ? `<p><strong>Treatment:</strong> ${this.escapeHtml(record.treatment)}<\/p>` : ''}
                        ${record.veterinarian ? `<p><strong>Veterinarian:</strong> ${this.escapeHtml(record.veterinarian)}<\/p>` : ''}
                        ${record.cost ? `<p><strong>Cost:</strong> $${record.cost.toFixed(2)}<\/p>` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    deleteHealthRecord(id) {
        this.healthRecords = this.healthRecords.filter(r => r.id !== id);
        this.saveUserData();
        this.displayHealthRecords();
        this.showAlert('Health record deleted', 'success');
    }

    // ==========================================
    // Expense Tracking
    // ==========================================

    handleExpenseSubmit(e) {
        e.preventDefault();

        const expense = {
            id: Date.now(),
            date: document.getElementById('expenseDate').value,
            category: document.getElementById('expenseCategory').value,
            description: document.getElementById('expenseDescription').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            timestamp: new Date().toISOString()
        };

        this.expenses.push(expense);
        this.saveUserData();
        this.showAlert('Expense recorded successfully!', 'success');
        document.getElementById('expenseForm').reset();
        this.displayExpenses();
        this.updateDashboard();
    }

    displayExpenses() {
        this.displayExpenseSummary();
        this.displayExpenseList();
    }

    displayExpenseSummary() {
        const container = document.getElementById('expenseSummary');

        if (this.expenses.length === 0) {
            container.innerHTML = '<p class="empty-state">No expenses recorded yet</p>';
            return;
        }

        const categories = {};
        this.expenses.forEach(exp => {
            categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
        });

        const categoryNames = {
            'feed': '🍽️ Feed & Supplies',
            'equipment': '🔧 Equipment',
            'medicine': '💊 Medicine & Health',
            'labor': '👷 Labor',
            'utilities': '⚡ Utilities',
            'maintenance': '🔨 Maintenance',
            'other': '📝 Other'
        };

        let html = '';
        for (const [cat, total] of Object.entries(categories)) {
            html += `
                <div class="expense-category">
                    <div class="category-name">${categoryNames[cat] || cat}</div>
                    <div class="category-amount">$${total.toFixed(2)}</div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    displayExpenseList() {
        const container = document.getElementById('expenseList');

        if (this.expenses.length === 0) {
            container.innerHTML = '<p class="empty-state">No expenses recorded yet</p>';
            return;
        }

        let html = '';
        const sorted = [...this.expenses].reverse();
        sorted.forEach(exp => {
            const date = new Date(exp.date).toLocaleDateString();
            html += `
                <div class="expense-item">
                    <div class="item-header">
                        <span class="item-type">${exp.description}</span>
                        <span class="item-time">$${exp.amount.toFixed(2)} - ${date}</span>
                    </div>
                    <div class="item-details">
                        <p><strong>Category:</strong> ${exp.category}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // Dashboard
    // ==========================================

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const todayActivities = this.activities.filter(a => a.date === today);
        const todayExpenses = this.expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);
        const todayHealthIssues = this.healthRecords.filter(h => h.date === today).length;

        document.getElementById('todayActivities').textContent = todayActivities.length;
        document.getElementById('totalBirds').textContent = this.getTotalBirds();
        document.getElementById('feedUsed').textContent = this.getTodayFeedUsed();
        document.getElementById('eggsCollected').textContent = this.getTodayEggsCollected();
        document.getElementById('todayExpenses').textContent = '$' + todayExpenses.toFixed(2);
        document.getElementById('healthIssues').textContent = todayHealthIssues;

        this.displayRecentActivities();
    }

    displayRecentActivities() {
        const container = document.getElementById('recentActivities');
        const recent = this.activities.slice().reverse().slice(0, 10);

        if (recent.length === 0) {
            container.innerHTML = '<p class="empty-state">No activities logged yet</p>';
            return;
        }

        let html = '';
        recent.forEach(activity => {
            const dateTime = `${activity.date} ${activity.time}`;
            html += `
                <div class="activity-item">
                    <div class="item-header">
                        <span class="item-type">${this.getActivityEmoji(activity.type)} ${this.formatActivityType(activity.type)}</span>
                        <span class="item-time">${dateTime}</span>
                    </div>
                    <div class="item-details">
                        ${activity.quantity ? `<p><strong>Quantity:</strong> ${activity.quantity}</p>` : ''}
                        ${activity.notes ? `<p><strong>Notes:</strong> ${this.escapeHtml(activity.notes)}</p>` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getTotalBirds() {
        const birdItem = this.inventory.find(item => item.type === 'birds');
        return birdItem ? Math.round(birdItem.quantity) : 0;
    }

    getTodayFeedUsed() {
        const today = new Date().toISOString().split('T')[0];
        const feedActivities = this.activities.filter(a => a.type === 'feeding' && a.date === today);
        const total = feedActivities.reduce((sum, a) => sum + parseFloat(a.quantity || 0), 0);
        return total.toFixed(1);
    }

    getTodayEggsCollected() {
        const today = new Date().toISOString().split('T')[0];
        const eggActivities = this.activities.filter(a => a.type === 'egg-collection' && a.date === today);
        const total = eggActivities.reduce((sum, a) => sum + parseFloat(a.quantity || 0), 0);
        return Math.round(total);
    }

    // ==========================================
    // Reports
    // ==========================================

    setupReportsPage() {
        const today = new Date();
        const currentMonth = today.toISOString().split('T')[0].slice(0, 7);
        document.getElementById('reportMonth').value = currentMonth;
    }

    generateReport() {
        const monthStr = document.getElementById('reportMonth').value;
        if (!monthStr) {
            this.showAlert('Please select a month', 'error');
            return;
        }

        const [year, month] = monthStr.split('-');
        const monthActivities = this.activities.filter(a => a.date.startsWith(monthStr));
        const monthHealthRecords = this.healthRecords.filter(r => r.date.startsWith(monthStr));
        const monthExpenses = this.expenses.filter(e => e.date.startsWith(monthStr));

        const activityTypes = {};
        monthActivities.forEach(a => {
            activityTypes[a.type] = (activityTypes[a.type] || 0) + 1;
        });

        const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

        let html = '<div class="report-section">';
        html += `<h4>Report for ${new Date(year, month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h4>`;

        html += '<h5>Activity Summary</h5>';
        html += '<ul class="report-list">';
        html += `<li><strong>Total Activities:</strong> ${monthActivities.length}</li>`;
        for (const [type, count] of Object.entries(activityTypes)) {
            html += `<li>${this.formatActivityType(type)}: ${count}</li>`;
        }
        html += '</ul>';

        if (monthHealthRecords.length > 0) {
            html += '<h5>Health Records</h5>';
            html += '<ul class="report-list">';
            html += `<li><strong>Total Health Issues:</strong> ${monthHealthRecords.length}</li>`;
            html += `<li><strong>Total Health Cost:</strong> $${monthHealthRecords.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}</li>`;
            html += '</ul>';
        }

        html += '<h5>Expenses</h5>';
        html += '<ul class="report-list">';
        html += `<li><strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)}</li>`;
        html += '</ul>';

        html += '</div>';
        document.getElementById('reportContent').innerHTML = html;
        this.showAlert('Report generated successfully!', 'success');
    }

    // ==========================================
    // Settings
    // ==========================================

    exportData() {
        const data = {
            user: this.currentUser,
            activities: this.activities,
            inventory: this.inventory,
            healthRecords: this.healthRecords,
            expenses: this.expenses,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FarmPilot_${this.currentUser.farm}_${Date.now()}.json`;
        link.click();
        this.showAlert('Data exported successfully!', 'success');
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
            this.activities = [];
            this.inventory = [];
            this.healthRecords = [];
            this.expenses = [];
            this.saveUserData();
            this.updateDashboard();
            this.showAlert('All data cleared', 'success');
        }
    }

    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            const userKey = this.currentUser.email;
            delete this.users[userKey];
            this.saveUsersData();
            localStorage.removeItem(`farmPilot_${userKey}_activities`);
            localStorage.removeItem(`farmPilot_${userKey}_inventory`);
            localStorage.removeItem(`farmPilot_${userKey}_health`);
            localStorage.removeItem(`farmPilot_${userKey}_expenses`);
            localStorage.removeItem('farmPilotCurrentUser');
            this.currentUser = null;
            this.showAlert('Account deleted', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    }

    // ==========================================
    // Utility Functions
    // ==========================================

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().slice(0, 5);

        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });

        const timeInput = document.getElementById('activityTime');
        if (timeInput && !timeInput.value) {
            timeInput.value = currentTime;
        }

        const expenseDateInput = document.getElementById('expenseDate');
        if (expenseDateInput && !expenseDateInput.value) {
            expenseDateInput.value = today;
        }
    }

    formatActivityType(type) {
        const types = {
            'feeding': 'Feeding',
            'watering': 'Watering',
            'egg-collection': 'Egg Collection',
            'health-check': 'Health Check',
            'cleaning': 'Cleaning',
            'vaccination': 'Vaccination',
            'treatment': 'Treatment',
            'other': 'Other'
        };
        return types[type] || type;
    }

    getActivityEmoji(type) {
        const emojis = {
            'feeding': '🍽️',
            'watering': '💧',
            'egg-collection': '🥚',
            'health-check': '🏥',
            'cleaning': '🧹',
            'vaccination': '💉',
            'treatment': '💊',
            'other': '📝'
        };
        return emojis[type] || '📝';
    }

    showAlert(message, type = 'success') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('farmPilotCurrentUser');
            this.currentUser = null;
            location.reload();
        }
    }
}

// Initialize the app
const app = new FarmPilot();