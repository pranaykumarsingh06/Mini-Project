# SYSTEM ARCHITECTURE & DESIGN DIAGRAMS
## Project Name: VOYAGE — Travel Planning & Sightseeing Explorer Platform
**Repository:** [pranaykumarsingh06/Mini-Project](https://github.com/pranaykumarsingh06/Mini-Project)  

---

## 📌 OVERVIEW

This document presents the complete Unified Modeling Language (UML) and structured design diagrams for the **VOYAGE Travel Web Application**:
1. **System Architecture Diagram** — Client, Edge, Backend WSGI, SQLite, and Supabase Cloud layers.
2. **Use Case Diagram** — System boundary, user interactions, actor roles, and administrative functions.
3. **Entity-Relationship (ER) Diagram** — Mappings, schemas, attributes, primary/foreign keys, and relational cardinalities.
4. **Data Flow Diagrams (DFD)** — Context Diagram (Level 0) and Process Decomposition Diagram (Level 1).
5. **Sequence Diagram** — User authentication & async Supabase cloud sync execution flow.
6. **Deployment Diagram** — Physical distribution of client browser, Vercel serverless edge runtime, and Supabase database nodes.

---

## 1. SYSTEM ARCHITECTURE DIAGRAM

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

## 2. USE CASE DIAGRAM

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

## 3. ENTITY-RELATIONSHIP (ER) DIAGRAM

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

## 4. DATA FLOW DIAGRAMS (DFD)

### 4.1 DFD Level 0 (Context Diagram)

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

### 4.2 DFD Level 1 (Process Decomposition Diagram)

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

## 5. SEQUENCE DIAGRAM

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

## 6. DEPLOYMENT DIAGRAM

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
*Diagram Artifact Generated for VOYAGE Project Repository (`pranaykumarsingh06/Mini-Project`).*
