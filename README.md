# 🐔 FarmPilot - Poultry Farm Activity Tracker

A simple, user-friendly web application for poultry farmers to track farm activities digitally instead of keeping manual records.

## Features

### 📊 Dashboard
- Quick overview of today's activities
- Summary statistics (total birds, feed used, eggs collected)
- Recent activity feed

### ✏️ Activity Logging
- Log various farm activities:
  - 🍽️ Feeding
  - 💧 Watering
  - 🥚 Egg Collection
  - 🏥 Health Check
  - 🧹 Cleaning
  - 💉 Vaccination
  - 💊 Treatment
  - 📝 Other
- Record date, time, quantity, and notes

### 📦 Inventory Management
- Track feed, equipment, medicine, and birds
- Add, update, and delete inventory items
- Monitor quantities and usage

### 🏥 Health Tracking
- Log health issues and symptoms
- Record treatments applied
- Track veterinarian visits
- Monitor affected bird counts

### 📈 Reports & Analytics
- Generate monthly activity reports
- View activity summaries by type
- Track health issues over time

## Getting Started

### Requirements
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend needed - works completely offline

### Installation

1. Clone this repository:
```bash
git clone https://github.com/rachael-ojo/FarmPilot.git
```

2. Navigate to the project directory:
```bash
cd FarmPilot
```

3. Open `index.html` in your web browser:
   - Double-click the `index.html` file, OR
   - Use a local server (recommended):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js with http-server
     npx http-server
     ```
   - Then visit `http://localhost:8000` in your browser

## How to Use

### Logging Daily Activities
1. Click "Log Activity" from the sidebar
2. Select the activity type
3. Choose the date and time
4. Enter quantity (if applicable)
5. Add notes
6. Click "Log Activity"

### Managing Inventory
1. Click "Inventory" from the sidebar
2. Add or update items:
   - Item name
   - Item type (Feed, Equipment, Medicine, Birds)
   - Current quantity
   - Unit of measurement
3. View all inventory items in the list below

### Tracking Health Issues
1. Click "Health Tracking" from the sidebar
2. Log health issues:
   - Date
   - Number of affected birds
   - Symptoms observed
   - Treatment applied
   - Veterinarian contact info (if applicable)
3. View all health records

### Generating Reports
1. Click "Reports" from the sidebar
2. Select a month from the date picker
3. Click "Generate Report"
4. View activity summary and health records for that month

## Data Storage

All data is stored locally in your browser using `localStorage`. This means:
- ✅ Works completely offline
- ✅ No internet connection needed
- ✅ Data stays on your device
- ✅ Data persists even after closing the browser
- ⚠️ Data is lost if you clear your browser's local storage
- ⚠️ Data is device-specific (not synced across devices)

**Backup Recommendation**: Periodically export or backup your data.

## Future Enhancements

- Cloud storage and sync (Firebase, AWS)
- Multi-user support and authentication
- Mobile app (React Native / Flutter)
- Photo upload for documentation
- Expense tracking
- Production analytics
- Email/SMS alerts
- Export reports to PDF/Excel
- Multi-farm support
- Collaborative access for farm staff

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser LocalStorage
- **Browser Compatibility**: All modern browsers

## Project Structure

```
FarmPilot/
├── index.html      # Main HTML file with all page structures
├── styles.css      # All styling and responsive design
├── app.js          # Application logic and functionality
└── README.md       # This file
```

## Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Provide feedback

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please create an issue on GitHub.

## Author

Created by [rachael-ojo](https://github.com/rachael-ojo)

---

**Happy Farming! 🐔🌾**
