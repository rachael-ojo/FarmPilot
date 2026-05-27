// ==========================================
// FarmPilot - Poultry Farm Tracker
// Main Application Logic
// ==========================================

// Initialize App
class FarmPilot {
    constructor() {
        this.activities = [];
        this.inventory = [];
        this.healthRecords = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.setDefaultDates();
        this.updateDashboard();
    }

    // ==========================================
    // Data Management
    // ==========================================

    saveData() {
        localStorage.setItem('farmPilotActivities', JSON.stringify(this.activities));
        localStorage.setItem('farmPilotInventory', JSON.stringify(this.inventory));
        localStorage.setItem('farmPilotHealthRecords', JSON.stringify(this.healthRecords));
    }

    loadData() {
        this.activities = JSON.parse(localStorage.getItem('farmPilotActivities')) || [];
        this.inventory = JSON.parse(localStorage.getItem('farmPilotInventory')) || [];
        this.healthRecords = JSON.parse(localStorage.getItem('farmPilotHealthRecords')) || [];
    }

    // ==========================================
    // Event Listeners Setup
    // ==========================================

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changePage(e.target.dataset.page));
        });

        // Forms
        document.getElementById('activityForm').addEventListener('submit', (e) => this.handleActivitySubmit(e));
        document.getElementById('inventoryForm').addEventListener('submit', (e) => this.handleInventorySubmit(e));
        document.getElementById('healthForm').addEventListener('submit', (e) => this.handleHealthSubmit(e));

        // Reports
        document.getElementById('generateReportBtn').addEventListener('click', () => this.generateReport());

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    }

    // ==========================================
    // Page Navigation
    // ==========================================

    changePage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        document.getElementById(pageName).classList.add('active');

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Update page-specific content
        if (pageName === 'dashboard') {
            this.updateDashboard();
        } else if (pageName === 'inventory') {
            this.displayInventory();
        } else if (pageName === 'health') {
            this.displayHealthRecords();
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
        this.saveData();
        this.showAlert('Activity logged successfully!', 'success');
        document.getElementById('activityForm').reset();
        this.setDefaultDates();
        this.updateDashboard();
    }

    deleteActivity(id) {
        this.activities = this.activities.filter(a => a.id !== id);
        this.saveData();
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

        this.saveData();
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

        let html = '<table><thead><tr><th>Item Name</th><th>Type</th><th>Quantity</th><th>Unit</th><th>Last Updated</th><th>Action</th></tr></thead><tbody>';

        this.inventory.forEach(item => {
            const date = new Date(item.lastUpdated).toLocaleDateString();
            html += `
                <tr>
                    <td>${this.escapeHtml(item.name)}</td>
                    <td>${item.type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
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
        this.saveData();
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
            timestamp: new Date().toISOString()
        };

        this.healthRecords.push(healthRecord);
        this.saveData();
        this.showAlert('Health record logged successfully!', 'success');
        document.getElementById('healthForm').reset();
        this.displayHealthRecords();
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
                    <div class="health-item-header">
                        <span class="health-type">🏥 ${date}</span>
                        <button class="btn-danger" onclick="app.deleteHealthRecord(${record.id})">Delete</button>
                    </div>
                    <div class="health-details">
                        <p><strong>Birds Affected:</strong> ${record.affectedBirds}</p>
                        <p><strong>Symptoms:</strong> ${this.escapeHtml(record.symptoms)}</p>
                        ${record.treatment ? `<p><strong>Treatment:</strong> ${this.escapeHtml(record.treatment)}</p>` : ''}
                        ${record.veterinarian ? `<p><strong>Veterinarian:</strong> ${this.escapeHtml(record.veterinarian)}</p>` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    deleteHealthRecord(id) {
        this.healthRecords = this.healthRecords.filter(r => r.id !== id);
        this.saveData();
        this.displayHealthRecords();
        this.showAlert('Health record deleted', 'success');
    }

    // ==========================================
    // Dashboard
    // ==========================================

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const todayActivities = this.activities.filter(a => a.date === today);

        document.getElementById('todayActivities').textContent = todayActivities.length;
        document.getElementById('totalBirds').textContent = this.getTotalBirds();
        document.getElementById('feedUsed').textContent = this.getTodayFeedUsed();
        document.getElementById('eggsCollected').textContent = this.getTodayEggsCollected();

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
                    <div class="activity-item-header">
                        <span class="activity-type">${this.getActivityEmoji(activity.type)} ${this.formatActivityType(activity.type)}</span>
                        <span class="activity-time">${dateTime}</span>
                    </div>
                    <div class="activity-notes">
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

        const activityTypes = {};
        monthActivities.forEach(a => {
            activityTypes[a.type] = (activityTypes[a.type] || 0) + 1;
        });

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
            monthHealthRecords.forEach(record => {
                html += `<li>${record.date}: ${record.affectedBirds} bird(s) - ${record.symptoms.substring(0, 50)}...</li>`;
            });
            html += '</ul>';
        }

        html += '</div>';
        document.getElementById('reportContent').innerHTML = html;
        this.showAlert('Report generated successfully!', 'success');
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
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} show`;
        alert.textContent = message;

        document.body.insertBefore(alert, document.body.firstChild);

        // Remove after 3 seconds
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
            localStorage.clear();
            alert('You have been logged out. All data has been cleared.');
            location.reload();
        }
    }
}

// Initialize the app
const app = new FarmPilot();