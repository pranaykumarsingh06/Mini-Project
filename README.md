# VOYAGE — Travel Planning & Sightseeing Web Application ✈️🇮🇳

VOYAGE is a modern, full-stack web application designed for exploring top Indian travel destinations, planning customized trips with budgets in ₹ INR, discovering recommended luxury hotels and local sightseeing attractions, and accessing an interactive Google & OpenStreetMap India engine.

---

## ✨ Features

- 🏖️ **Explore Indian Destinations**: Detailed travel guides for famous Indian locations including Taj Mahal (Agra), Goa Beaches, Jaipur (Pink City), Kerala Backwaters, Leh Ladakh, Udaipur, Varanasi, Rishikesh, Amritsar, Darjeeling, Shimla, and Manali.
- 🎯 **Interactive Trip Planner & Budgeting**: Create personalized travel itineraries, set custom budgets in ₹ INR, choose travel dates, and select companion styles (Family, Friends, Couple, Solo).
- 🗺️ **Google Maps & OpenStreetMap India**: Integrated interactive maps centered on India with pinpointed landmark markers, sightseeing filters, and driving route calculation.
- 🏨 **Sightseeing & Hotel Engine**: Detailed 3-day weather forecasts, best seasons to visit, top 6 sightseeing spots per city, luxury hotels, and local food recommendations.
- 🛡️ **Secure Admin Control Panel (`/admin`)**: Dedicated admin dashboard with user management, trip overview, budget tracking, and credential authentication.
- ⚡ **Vercel Deployment Ready**: Pre-configured with `vercel.json`, WSGI handler, and dynamic environment SQLite support.

---

## 🛠️ Tech Stack

- **Backend**: Python 3, Flask, SQLite3
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Mapping Engine**: Leaflet.js, OpenStreetMap, Google Maps Embed
- **Deployment**: Vercel Serverless Functions

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Python 3.8+ installed on your machine.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pranaykumarsingh06/Mini-Project.git
   cd Mini-Project
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**
   ```bash
   python app.py
   ```

4. **Access in Browser**
   Open your browser and visit: `http://127.0.0.1:5000`

---

## 🔑 Admin Control Access

To log into the Admin Control Panel (`/admin`):
- **URL**: `http://127.0.0.1:5000/admin/login`
- **Admin Email**: `pranaykrsingh03@gmail.com`
- **Admin Password**: `12341234`

---

## 📂 Project Structure

```
├── app.py                  # Main Flask application & routes
├── vercel.json             # Vercel deployment configuration
├── requirements.txt        # Python package dependencies
├── templates/              # HTML templates
│   ├── home.html           # Landing page
│   ├── dashboard.html      # User dashboard & trips
│   ├── count_places.html   # Destination sightseeing guide
│   ├── map.html            # Google Maps India & Route Planner
│   ├── admin.html          # Admin control panel
│   └── admin_login.html    # Secure admin portal login
└── static/                 # Static assets
    ├── css/                # Stylesheets
    ├── js/                 # Client-side JavaScript
    └── images/             # Destination photographs
```

---

## 📄 License

Distributed under the MIT License.
