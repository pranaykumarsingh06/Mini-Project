# PROJECT REPORT & SYNOPSIS
## VOYAGE — Travel Planning & Sightseeing Explorer Platform
**Full-Stack Indian Travel Exploration, Budgeting & Cloud Sync Web Platform**  
**Academic Year:** 2026 – 2027  
**Repository:** [pranaykumarsingh06/Mini-Project](https://github.com/pranaykumarsingh06/Mini-Project)  
**Cloud Database Backend:** Supabase PostgreSQL (`awdvvaxglwbejfxnvngu`)  
**Deployment Target:** Vercel Cloud Serverless Platform  

---

## 1. ABSTRACT

The **VOYAGE Travel Web Application** is an end-to-end digital travel planning, itinerary management, sightseeing discovery, and flight/hotel booking platform designed specifically for Indian domestic and international tourism. Built on modern web technologies (Python Flask backend, SQLite3 local database, Supabase PostgreSQL cloud sync, and Leaflet.js / OpenStreetMap mapping engines), VOYAGE solves the fragmentation in traditional travel platforms by combining interactive maps, custom budgeting in Indian Rupees (₹ INR), instant PDF E-Ticket generation, and administrative governance into a single responsive application.

The system incorporates real-time asynchronous synchronization with a Supabase cloud database (`awdvvaxglwbejfxnvngu`), ensuring that every user login, registration, itinerary addition, and booking reservation is persisted securely across serverless cloud environments with zero infrastructure expenditure overhead.

---

## 2. INTRODUCTION & OBJECTIVES

### 2.1 Project Overview
Tourism in India is experiencing rapid growth, yet travelers often struggle with fragmented platforms that separate location discovery, route calculation, budgeting, and reservation management. VOYAGE consolidates these features into an all-in-one web portal with zero learning curve.

### 2.2 Key Project Objectives
- **Comprehensive Indian Location Explorer:** Provide detailed sightseeing guides, top 6 attraction spots, weather forecasts, best visiting seasons, luxury hotels, and local food spots for 12 major Indian cities (Taj Mahal Agra, Goa, Jaipur, Kerala, Leh Ladakh, Udaipur, Varanasi, Rishikesh, Amritsar, Darjeeling, Shimla, Manali).
- **Custom Budgeting Engine:** Allow travelers to set custom budgets in ₹ INR, travel dates, and companion styles (Family, Friends, Couple, Solo).
- **Dual-Engine Interactive Mapping:** Integrate Leaflet.js with OpenStreetMap tiles and Google Maps satellite embeds for 100% map uptime and route calculation.
- **Interactive Reservation & E-Ticket Generator:** Enable 1-click modal management for flight/hotel seat selection, meal preferences, and printable E-Ticket generation with PNR and barcodes.
- **Cloud Data Synchronization:** Persist user logins, registrations, trips, and bookings to a remote Supabase PostgreSQL database.
- **Administrative Control Portal:** Provide a secure admin dashboard (`/admin`) enforcing restricted email authentication (`pranaykrsingh03@gmail.com`) for user and financial analytics management.

---

## 3. LITERATURE SURVEY & COMPARATIVE ANALYSIS

| Feature | Traditional Platforms | Generic Travel Blogs | VOYAGE Platform |
| :--- | :--- | :--- | :--- |
| **Sightseeing & Hotel Discovery** | Separated from maps | Static articles only | **Integrated 1-Click Interactive Guide** |
| **Budget Planning in ₹ INR** | Fixed commercial prices | No budget tools | **Customizable ₹ INR Trip Budgeter** |
| **Cloud Backend Sync** | Proprietary locked DB | None | **Real-Time Supabase PostgreSQL Sync** |
| **Admin Control Panel** | Complex enterprise tools | None | **Minimalist 1-Click Control Portal** |

---

## 4. SYSTEM REQUIREMENTS & SPECIFICATIONS

### 4.1 Software Requirements
- **Operating System:** Windows 10/11, macOS, or Linux
- **Backend Runtime:** Python 3.8+ (Flask Framework 3.0+)
- **Database Engines:** SQLite3 (Local Development) & Supabase PostgreSQL (Cloud Production)
- **Frontend Stack:** HTML5, CSS3, JavaScript (ES6+), Leaflet.js v1.9.4
- **Deployment Target:** Vercel Cloud Serverless Functions

### 4.2 Hardware Requirements
- **Client Processor:** Dual-Core 1.6 GHz or higher
- **Client Memory:** 1 GB RAM minimum (50 MB browser RAM footprint)
- **Network:** Active Internet Connection for Map Tile Loading & Cloud Sync

---

## 5. SYSTEM ARCHITECTURE & DIAGRAMS

### 5.1 System Architecture Diagram

```mermaid
graph TD
    User[Client Browser / Mobile Device] -->|1. HTTPS Request| Edge[Vercel Serverless Edge CDN]
    Edge -->|2. WSGI Routing| Flask[Python Flask Backend app.py]
    Flask -->|3. Local Queries| SQLite[(Local SQLite Database voyage.db)]
    Flask -->|4. Async REST API Sync| Supabase[(Supabase PostgreSQL Cloud awdvvaxglwbejfxnvngu)]
    User -->|5. Leaflet Map Tiles| OSM[OpenStreetMap Tile Engine]
    User -->|6. Satellite iFrame| Google[Google Maps Embed API]
```

---

### 5.2 Use Case Diagram

```mermaid
graph TD
    subgraph Voyage System Boundary
        UC1([Explore Destinations & Attractions])
        UC2([Search Indian Cities & Weather])
        UC3([Interactive Maps & Route Planner])
        UC4([Register Account])
        UC5([Sign In / User Authentication])
        UC6([Create Trip & Set Budget in INR])
        UC7([Manage Flight & Hotel Reservations])
        UC8([Download PDF E-Ticket])
        UC9([Admin Dashboard Control Panel])
        UC10([Manage Users & Edit Accounts])
        UC11([Manage Trips & Delete Records])
        UC12([View Revenue & Analytics Stats])
        UC13([Sync Data to Supabase Backend])
    end

    Actor1[👤 Guest / Traveler]
    Actor2[🔑 Registered User]
    Actor3[🛡️ Admin User]
    Actor4[⚡ Supabase Cloud Engine]

    Actor1 --> UC1
    Actor1 --> UC2
    Actor1 --> UC3
    Actor1 --> UC4
    Actor1 --> UC5

    Actor2 --> UC1
    Actor2 --> UC2
    Actor2 --> UC3
    Actor2 --> UC6
    Actor2 --> UC7
    Actor2 --> UC8

    Actor3 --> UC9
    Actor3 --> UC10
    Actor3 --> UC11
    Actor3 --> UC12

    UC4 -.->|Triggers| UC13
    UC5 -.->|Triggers| UC13
    UC6 -.->|Triggers| UC13
    UC7 -.->|Triggers| UC13
    UC13 --> Actor4
```

---

### 5.3 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ USER_LOGINS : "generates"
    USERS ||--o{ TRIPS : "plans"
    USERS ||--o{ BOOKINGS : "reserves"
    DESTINATIONS ||--o{ TRIPS : "located_in"

    USERS {
        BIGINT id PK
        VARCHAR full_name
        VARCHAR email UK
        VARCHAR password
        VARCHAR country
        VARCHAR phone
        TIMESTAMP created_at
    }

    USER_LOGINS {
        BIGINT id PK
        VARCHAR user_name
        VARCHAR email
        TIMESTAMP login_time
        VARCHAR status
    }

    TRIPS {
        BIGINT id PK
        VARCHAR user_name
        VARCHAR destination
        BIGINT budget
        VARCHAR travel_dates
        VARCHAR companion
        VARCHAR status
        TIMESTAMP created_at
    }

    BOOKINGS {
        BIGINT id PK
        VARCHAR user_name
        VARCHAR destination
        VARCHAR booking_type
        BIGINT amount
        VARCHAR status
        TIMESTAMP created_at
    }

    DESTINATIONS {
        BIGINT id PK
        VARCHAR title
        VARCHAR category
        VARCHAR best_season
        FLOAT latitude
        FLOAT longitude
    }
```

---

### 5.4 Data Flow Diagram (DFD) Level 0 — Context Diagram

```mermaid
graph LR
    User[👤 Traveler / User] -->|1. Sign In / Registration Credentials| VoyageSystem((0.0 VOYAGE Travel Platform))
    User -->|2. Search & Trip Input Details| VoyageSystem
    User -->|3. Booking & Seat Preference| VoyageSystem

    VoyageSystem -->|4. Display Itineraries, Sightseeing & Weather| User
    VoyageSystem -->|5. PDF E-Tickets & Boarding Passes| User

    Admin[🛡️ Admin User] -->|6. Admin Credentials & User Commands| VoyageSystem
    VoyageSystem -->|7. Revenue Stats, User Lists & Trip Summaries| Admin

    VoyageSystem -->|8. Sync Logins, Users, Trips & Bookings Payload| Supabase[⚡ Supabase Cloud Backend awdvvaxglwbejfxnvngu]
    Supabase -->|9. Sync Confirmation Status| VoyageSystem
```

---

### 5.5 Data Flow Diagram (DFD) Level 1 — Process Decomposition

```mermaid
graph TD
    U[👤 User / Traveler]
    A[🛡️ Admin]

    subgraph Data Stores
        D1[(D1: USERS DB)]
        D2[(D2: TRIPS DB)]
        D3[(D3: BOOKINGS DB)]
        D4[(D4: SUPABASE CLOUD DB)]
    end

    %% Process 1.0: Auth & Registration
    U -->|Registration / Login Info| P1(1.0 User Authentication & Registration)
    P1 -->|Hash & Save User Record| D1
    P1 -->|Read User Credentials| D1
    P1 -->|Push User Profile| D4

    %% Process 2.0: Destination Explorer
    U -->|Search City Query / Select Place| P2(2.0 Sightseeing & Map Discovery)
    P2 -->|Render Sightseeing, Hotels, Weather| U

    %% Process 3.0: Trip Planning
    U -->|Destination, Budget INR, Dates| P3(3.0 Trip Itinerary & Budget Manager)
    P3 -->|Save Planned Trip| D2
    P3 -->|Sync Trip Payload| D4
    D2 -->|Display Active Trips| U

    %% Process 4.0: Booking Engine
    U -->|Seat/Meal Selection, Booking Request| P4(4.0 Reservation & E-Ticket Generator)
    P4 -->|Save Booking Record| D3
    P4 -->|Sync Booking Payload| D4
    P4 -->|Generate E-Ticket PDF| U

    %% Process 5.0: Admin Governance
    A -->|Admin Credentials & Edit Rules| P5(5.0 Admin Control & Analytics Engine)
    P5 -->|Read / Edit Users| D1
    P5 -->|Read / Delete Trips| D2
    P5 -->|Calculate Revenue Stats| D3
    P5 -->|Display Dashboard Stats| A
```

---

### 5.6 Sequence Diagram (User Login & Supabase Cloud Sync Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Traveler
    participant Browser as 🌐 Client Browser
    participant Flask as ⚙️ Flask Backend (app.py)
    participant SQLite as 🗄️ SQLite DB (voyage.db)
    participant Supabase as ⚡ Supabase Cloud DB

    User->>Browser: Enters Email & Password
    Browser->>Flask: POST /login (form data)
    Flask->>Flask: Compute SHA-256 Hash
    Flask->>SQLite: SELECT * FROM users WHERE email = ?
    SQLite-->>Flask: Return User Record
    Flask->>Flask: Set Session Variables (user_id, user_name)
    
    par Async Cloud Synchronization
        Flask->>Supabase: POST /rest/v1/user_logins (user_name, email, status)
        Supabase-->>Flask: 201 Created Status
    and Local Response
        Flask-->>Browser: Redirect to /dashboard
    end
    
    Browser-->>User: Render Dashboard Page
```

---

### 5.7 Deployment Diagram

```mermaid
graph LR
    subgraph Client Node
        Browser[Web Browser Chrome / Firefox / Safari / Mobile]
    end

    subgraph Vercel Edge Serverless Cloud
        CDN[Edge CDN]
        Lambda[Python WSGI Runtime]
    end

    subgraph External Cloud Services
        SupabaseDB[Supabase PostgreSQL DB awdvvaxglwbejfxnvngu]
        SupabaseAuth[Supabase Auth Service]
        OSMServer[OpenStreetMap Tile Server]
    end

    Browser -->|HTTPS| CDN
    CDN -->|Invoke| Lambda
    Lambda -->|REST API HTTPS| SupabaseDB
    Lambda -->|Auth HTTPS| SupabaseAuth
    Browser -->|Tile HTTPS| OSMServer
```

---

## 6. MODULE DESCRIPTION

- **Module 1: User Authentication & Security:** Handles registration, login, session guards, and SHA-256 password hashing.
- **Module 2: Destination & Sightseeing Explorer:** Provides comprehensive coverage of 12 Indian tourist destinations with weather, luxury hotels, and sightseeing spots.
- **Module 3: Trip Planner & Budgeting:** Allows users to configure itineraries, select companion travel styles, and track trip budgets in ₹ INR.
- **Module 4: Booking Engine & E-Ticket Generator:** Facilitates flight/hotel seat selection, meal customization, reservation status updates, and PDF E-Ticket downloads.
- **Module 5: Supabase Cloud Synchronization Engine:** Integrates Supabase REST API (`awdvvaxglwbejfxnvngu`) to persist logins, user signups, trips, and bookings to cloud PostgreSQL.
- **Module 6: Administrative Control Portal (`/admin`):** Provides executive governance, revenue statistics, user management, and trip record manipulation for project administrators.

---

## 7. FEASIBILITY STUDY SUMMARY

- **Technical Feasibility:** HIGH (10/10) — Built on robust, tested open-source frameworks (Flask, Leaflet, Supabase).
- **Operational Feasibility:** HIGH (10/10) — Responsive interface, zero user learning curve, automated cloud logging.
- **Economic Feasibility:** HIGH (10/10) — ₹0 Monthly Operating Cost using Vercel, Supabase free-tier, and OpenStreetMap.
- **Legal & Security Feasibility:** HIGH (10/10) — Protected with SHA-256 encryption, session guards, and MIT/ODbL licensing compliance.

---

## 8. CONCLUSION & FUTURE SCOPE

The VOYAGE project successfully demonstrates a scalable, cloud-connected travel exploration and budgeting platform. By integrating dual-engine interactive maps, custom budgeting in ₹ INR, and automated Supabase cloud sync, VOYAGE provides a reliable technical solution for tourism platforms.

### 8.1 Future Scope
1. **AI Itinerary Generation:** Integration of Large Language Models for automated day-wise tour scheduling.
2. **Payment Gateway Integration:** Incorporation of Razorpay / UPI for real-time booking payments.
3. **Progressive Web App (PWA):** Offline caching for mobile devices during mountain/remote region travel.

---

## 9. REFERENCES
1. **Flask Documentation:** https://flask.palletsprojects.com/
2. **Supabase Cloud Documentation:** https://supabase.com/docs
3. **Leaflet.js Interactive Maps API:** https://leafletjs.com/
4. **Vercel Serverless Platform:** https://vercel.com/docs
5. **OpenStreetMap Foundation:** https://www.openstreetmap.org/
