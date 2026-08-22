# SYSTEM ARCHITECTURE & DESIGN DIAGRAMS
## Project Name: VOYAGE — Travel Planning & Sightseeing Explorer Platform
**Repository:** [pranaykumarsingh06/Mini-Project](https://github.com/pranaykumarsingh06/Mini-Project)  

---

## 📌 OVERVIEW

This document presents the complete Unified Modeling Language (UML) and structured design diagrams for the **VOYAGE Travel Web Application**:
1. **Use Case Diagram** — Defines system boundary, user interactions, actor roles, and administrative functions.
2. **Entity-Relationship (ER) Diagram** — Mappings, schemas, attributes, primary/foreign keys, and relational cardinalities.
3. **Data Flow Diagrams (DFD)** — Context Diagram (Level 0) and Process Decomposition Diagram (Level 1).

---

## 1. USE CASE DIAGRAM

The Use Case Diagram highlights the interaction between system actors (**General Traveler**, **Registered User**, **Admin User**, **Supabase Backend**) and system capabilities.

### 1.1 Mermaid Use Case Visualizer

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

### 1.2 Use Case Specification Table

| Use Case ID | Use Case Name | Primary Actor | Description | Pre-conditions |
| :--- | :--- | :--- | :--- | :--- |
| **UC-01** | Explore Destinations | Guest / User | View top 6 sightseeing spots, weather, best season, hotels, and restaurants per city. | None |
| **UC-02** | Interactive Route Planner | Guest / User | Compute travel route and distance between two Indian cities on map. | Open `/map` page |
| **UC-03** | User Registration | Guest | Create new account with email, full name, password, country, and phone. | Form filled |
| **UC-04** | User Sign In | Guest / User | Authenticate user using email/name and password hash verification. | Valid account |
| **UC-05** | Plan Trip & Budget | Registered User | Set destination, budget in ₹ INR, travel dates, and companion style. | Logged in |
| **UC-06** | Manage Reservation | Registered User | Customize seat preference, meal selection, or request cancellation. | Active booking |
| **UC-07** | Download E-Ticket | Registered User | View printable E-Ticket with PNR, flight details, and barcode. | Active booking |
| **UC-08** | Admin Governance | Admin User | Access `/admin` dashboard to add/edit/delete users, trips, and view stats. | Logged in as `pranaykrsingh03@gmail.com` |
| **UC-09** | Cloud Sync | System | Asynchronously push logins, users, trips, and bookings to Supabase PostgreSQL. | Action executed |

---

## 2. ENTITY-RELATIONSHIP (ER) DIAGRAM

The ER Diagram illustrates the database structure, logical schema attributes, primary keys (`PK`), foreign keys (`FK`), and cardinalities across local SQLite3 and Supabase PostgreSQL backend.

### 2.1 Mermaid ER Diagram

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

### 2.2 Relational Schema Definitions

1. **`USERS` Table**:
   - `id` (PK, AUTO_INCREMENT): Unique user identifier.
   - `full_name` (NOT NULL): User's display name.
   - `email` (UNIQUE, NOT NULL): Account login email address.
   - `password` (NOT NULL): SHA-256 encrypted password hash.
   - `country`, `phone`: Contact metadata.
   - `created_at`: Account registration timestamp.

2. **`USER_LOGINS` Table**:
   - `id` (PK), `user_name`, `email`, `login_time`, `status`.

3. **`TRIPS` Table**:
   - `id` (PK), `user_name`, `destination`, `budget` (₹ INR), `travel_dates`, `companion`, `status`, `created_at`.

4. **`BOOKINGS` Table**:
   - `id` (PK), `user_name`, `destination`, `booking_type` (*Hotel & Flight / Package*), `amount` (₹ INR), `status`, `created_at`.

---

## 3. DATA FLOW DIAGRAMS (DFD)

Data Flow Diagrams map the flow of data through the VOYAGE system, showing inputs, processes, outputs, and data stores.

### 3.1 DFD Level 0 (Context Diagram)

The Level 0 DFD defines the entire system boundary, external entities (**Traveler**, **Admin**, **Supabase Service**), and top-level data flows.

```mermaid
graph LR
    User[👤 Traveler / User] -->|1. Sign In / Registration Credentials| VoyageSystem((0.0 VOYAGE Travel Platform))
    User -->|2. Search & Trip Input Details| VoyageSystem
    User -->|3. Booking & Seat Preference| VoyageSystem

    VoyageSystem -->|4. Display Itineraries, Sightseeing & Weather| User
    VoyageSystem -->|5. PDF E-Tickets & Boarding Passes| User

    Admin[🛡️ Admin User] -->|6. Admin Credentials & User Management Commands| VoyageSystem
    VoyageSystem -->|7. Revenue Stats, User Lists & Trip Summaries| Admin

    VoyageSystem -->|8. Sync Logins, Users, Trips & Bookings API Payload| Supabase[⚡ Supabase Cloud Backend awdvvaxglwbejfxnvngu]
    Supabase -->|9. Sync Confirmation Status| VoyageSystem
```

---

### 3.2 DFD Level 1 (Process Decomposition Diagram)

The Level 1 DFD decomposes the system into 5 primary operational sub-processes.

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

## 4. SUMMARY OF DIAGRAM COMPLIANCE

| Diagram Type | Representation | Purpose | Verification Status |
| :--- | :--- | :--- | :---: |
| **Use Case Diagram** | UML / Mermaid Flow | Illustrates actor interactions, system boundaries, and security rules. | ✅ Verified |
| **ER Diagram** | Entity Relational Notation | Maps database tables, primary keys, foreign relations, and schema fields. | ✅ Verified |
| **DFD Level 0** | Context Data Flow | High-level data exchange between User, Admin, System, and Supabase Backend. | ✅ Verified |
| **DFD Level 1** | Process Decomposition | Detailed 5-process data transformations and DB read/write interactions. | ✅ Verified |

---
*Diagram Artifact Generated for VOYAGE Project Repository (`pranaykumarsingh06/Mini-Project`).*
