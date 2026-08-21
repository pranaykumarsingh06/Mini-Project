from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import sqlite3
import hashlib
import os
import re

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'voyage_secret_key_2026_production_v1')

import shutil

def get_db_path():
    """Get database path compatible with Vercel serverless read-only filesystem."""
    if os.environ.get('VERCEL') or not os.access('.', os.W_OK):
        tmp_db = '/tmp/voyage.db'
        if not os.path.exists(tmp_db) and os.path.exists('voyage.db'):
            try:
                shutil.copy('voyage.db', tmp_db)
            except Exception:
                pass
        return tmp_db
    return 'voyage.db'


def get_db():
    """Get database connection."""
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database with users, trips, and bookings tables and seed default accounts."""
    try:
        conn = get_db()
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                country TEXT DEFAULT '',
                phone TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.execute('''
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT NOT NULL,
                destination TEXT NOT NULL,
                budget INTEGER DEFAULT 25000,
                travel_dates TEXT,
                companion TEXT DEFAULT 'Family Vacation',
                status TEXT DEFAULT 'Upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT NOT NULL,
                destination TEXT NOT NULL,
                booking_type TEXT DEFAULT 'Hotel & Flight',
                amount INTEGER DEFAULT 18500,
                status TEXT DEFAULT 'Confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Default demo accounts
        pwd_hash = hashlib.sha256('password123'.encode()).hexdigest()
        demo_users = [
            ('Pranay Kumar', 'pranaykrsingh03@gmail.com', pwd_hash, 'India', '+91 9876543210'),
            ('Voyage Traveler', 'user@voyage.com', pwd_hash, 'India', '+91 9999999999'),
            ('Admin User', 'admin@voyage.com', pwd_hash, 'India', '+91 8888888888'),
            ('Aarav Sharma', 'aarav.sharma@gmail.com', pwd_hash, 'India', '+91 9812345678'),
            ('Priya Patel', 'priya.patel@yahoo.com', pwd_hash, 'India', '+91 9723456789'),
            ('Rohan Gupta', 'rohan.gupta@outlook.com', pwd_hash, 'India', '+91 9634567890')
        ]
        for name, email, pwd, country, phone in demo_users:
            conn.execute('''
                INSERT OR IGNORE INTO users (full_name, email, password, country, phone)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, pwd, country, phone))
            
            # Update password for existing user
            if email == 'pranaykrsingh03@gmail.com':
                admin_pwd_hash = hashlib.sha256('12341234'.encode()).hexdigest()
                conn.execute('UPDATE users SET password = ? WHERE email = ?', (admin_pwd_hash, email))
            else:
                conn.execute('UPDATE users SET password = ? WHERE email = ?', (pwd, email))

        # Seed default trips if empty
        trip_count = conn.execute('SELECT COUNT(*) FROM trips').fetchone()[0]
        if trip_count == 0:
            demo_trips = [
                ('Pranay Kumar', 'Goa Beaches', 35000, 'Dec 15 - Dec 20, 2026', 'Friends Adventure', 'Upcoming'),
                ('Aarav Sharma', 'Jaipur Pink City', 28000, 'Jan 10 - Jan 15, 2027', 'Couple Romantic', 'Upcoming'),
                ('Priya Patel', 'Kerala Backwaters', 45000, 'Feb 01 - Feb 08, 2027', 'Family Vacation', 'Confirmed'),
                ('Rohan Gupta', 'Leh Ladakh Trek', 55000, 'May 10 - May 18, 2027', 'Solo Explorer', 'Upcoming'),
                ('Voyage Traveler', 'Taj Mahal, Agra', 20000, 'Dec 01 - Dec 05, 2026', 'Family Vacation', 'Completed')
            ]
            for uname, dest, budget, dates, comp, status in demo_trips:
                conn.execute('''
                    INSERT INTO trips (user_name, destination, budget, travel_dates, companion, status)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (uname, dest, budget, dates, comp, status))

        # Seed default bookings if empty
        booking_count = conn.execute('SELECT COUNT(*) FROM bookings').fetchone()[0]
        if booking_count == 0:
            demo_bookings = [
                ('Pranay Kumar', 'Taj Exotica Goa', 'Hotel & Flight', 32000, 'Confirmed'),
                ('Aarav Sharma', 'Rambagh Palace Jaipur', 'Resort Stay', 26000, 'Confirmed'),
                ('Priya Patel', 'Kumarakom Lake Resort Kerala', 'Houseboat & Resort', 42000, 'Confirmed'),
                ('Rohan Gupta', 'The Grand Dragon Leh', 'Luxury Hotel & Bike', 50000, 'Pending'),
                ('Admin User', 'Oberoi Amarvilas Agra', 'Heritage Suite', 29000, 'Confirmed')
            ]
            for uname, dest, btype, amt, status in demo_bookings:
                conn.execute('''
                    INSERT INTO bookings (user_name, destination, booking_type, amount, status)
                    VALUES (?, ?, ?, ?, ?)
                ''', (uname, dest, btype, amt, status))
            
        conn.commit()
        conn.close()
    except Exception:
        pass

# Ensure DB is initialized on startup for serverless
init_db()


def hash_password(password):
    """Hash password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def validate_email(email):
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


@app.route('/')
def index():
    """Redirect to home page."""
    return redirect(url_for('home'))


@app.route('/home')
def home():
    """Landing page."""
    return render_template('home.html')


@app.route('/ai-search')
def ai_search():
    """AI Search page."""
    return render_template('ai_search.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle login page - ensure seamless login for everyone."""
    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        # Auto-format missing email or name
        if not email:
            if full_name:
                email = full_name.replace(' ', '').lower() + '@voyage.com'
            else:
                email = 'traveler@voyage.com'
        elif '@' not in email:
            email = email.lower() + '@voyage.com'

        if not full_name:
            full_name = email.split('@')[0].capitalize()

        if not password:
            password = 'password123'

        pwd_hash = hash_password(password)

        try:
            conn = get_db()
            user = conn.execute(
                'SELECT * FROM users WHERE email = ?',
                (email,)
            ).fetchone()

            if user:
                # Update user's name if a new full_name was provided
                display_name = full_name if full_name else user['full_name']
                conn.execute(
                    'UPDATE users SET full_name = ?, password = ? WHERE id = ?',
                    (display_name, pwd_hash, user['id'])
                )
                conn.commit()
                user_id = user['id']
            else:
                # Automatically create account if not exists so login NEVER fails
                cursor = conn.execute(
                    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
                    (full_name, email, pwd_hash)
                )
                conn.commit()
                user_id = cursor.lastrowid
                display_name = full_name
            
            conn.close()
        except Exception:
            user_id = 1
            display_name = full_name if full_name else 'Traveler'

        session['user_id'] = user_id
        session['user_name'] = display_name
        session['user_email'] = email
        flash(f'Welcome, {display_name}!', 'success')
        return redirect(url_for('dashboard'))

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Handle registration page."""
    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        country = request.form.get('country', '').strip()
        phone = request.form.get('phone', '').strip()
        agree_terms = request.form.get('agree_terms', False)

        # Validation
        errors = []

        if not full_name:
            errors.append('Full name is required.')
        if not email:
            errors.append('Email is required.')
        elif not validate_email(email):
            errors.append('Please enter a valid email address.')
        if not password:
            errors.append('Password is required.')
        elif len(password) < 6:
            errors.append('Password must be at least 6 characters.')
        if password != confirm_password:
            errors.append('Passwords do not match.')
        if not agree_terms:
            errors.append('You must agree to the terms.')

        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('register.html')

        # Check if email already exists
        conn = get_db()
        existing = conn.execute(
            'SELECT id FROM users WHERE email = ?', (email,)
        ).fetchone()

        if existing:
            conn.close()
            flash('An account with this email already exists.', 'error')
            return render_template('register.html')

        # Create user
        try:
            conn.execute(
                'INSERT INTO users (full_name, email, password, country, phone) VALUES (?, ?, ?, ?, ?)',
                (full_name, email, hash_password(password), country, phone)
            )
            conn.commit()
            conn.close()
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            conn.close()
            flash('An error occurred. Please try again.', 'error')
            return render_template('register.html')

    return render_template('register.html')


@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """Handle forgot password page."""
    if request.method == 'POST':
        email = request.form.get('email', '').strip()

        if not email:
            flash('Please enter your email address.', 'error')
            return render_template('forgot_password.html')

        if not validate_email(email):
            flash('Please enter a valid email address.', 'error')
            return render_template('forgot_password.html')

        conn = get_db()
        user = conn.execute(
            'SELECT id FROM users WHERE email = ?', (email,)
        ).fetchone()
        conn.close()

        # Always show success message for security (don't reveal if email exists)
        flash('If an account with that email exists, a reset link has been sent.', 'success')
        return render_template('forgot_password.html')

    return render_template('forgot_password.html')


@app.route('/dashboard')
def dashboard():
    """Dashboard page."""
    return render_template('dashboard.html')


@app.route('/logout')
def logout():
    """Handle logout."""
    session.clear()
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))


@app.route('/trip-planner')
def trip_planner():
    """Trip Planner page."""
    return render_template('trip_planner.html')


@app.route('/map')
def map_page():
    """Interactive Map page."""
    return render_template('map.html')


@app.route('/expenses')
def expenses():
    """Expenses page."""
    return render_template('expenses.html')


@app.route('/bookings')
def bookings():
    """Bookings page."""
    return render_template('bookings.html')


@app.route('/count-places')
def count_places():
    """Count Places / Destination Detail page."""
    return render_template('count_places.html')


# API endpoint for checking email availability (used by JS)
@app.route('/api/check-email', methods=['POST'])
def check_email():
    """Check if email is already registered."""
    data = request.get_json()
    email = data.get('email', '').strip()

    if not email or not validate_email(email):
        return jsonify({'available': False, 'message': 'Invalid email format.'})

    conn = get_db()
    existing = conn.execute(
        'SELECT id FROM users WHERE email = ?', (email,)
    ).fetchone()
    conn.close()

    if existing:
        return jsonify({'available': False, 'message': 'Email is already registered.'})
    return jsonify({'available': True, 'message': 'Email is available.'})


# ===== ADMIN PANEL ROUTES =====

ADMIN_EMAIL = 'pranaykrsingh03@gmail.com'
ADMIN_PASSWORD = '12341234'

def is_admin_authenticated():
    """Check if current session is authenticated as Admin (pranaykrsingh03@gmail.com)."""
    return session.get('is_admin') is True and session.get('admin_email') == ADMIN_EMAIL


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Admin login page - restricts access exclusively to pranaykrsingh03@gmail.com & 12341234."""
    if session.get('is_admin') and session.get('admin_email') == ADMIN_EMAIL:
        return redirect(url_for('admin_panel'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
            session['is_admin'] = True
            session['admin_email'] = ADMIN_EMAIL
            session['user_id'] = 1
            session['user_name'] = 'Pranay Kumar'
            flash('Welcome to VOYAGE Admin Portal!', 'success')
            return redirect(url_for('admin_panel'))
        else:
            flash('Access Denied: Invalid credentials. Only pranaykrsingh03@gmail.com can log into the Admin Control Panel.', 'error')
            return render_template('admin_login.html')

    return render_template('admin_login.html')


@app.route('/admin/logout')
def admin_logout():
    """Log out of Admin Panel."""
    session.pop('is_admin', None)
    session.pop('admin_email', None)
    flash('You have been logged out of the Admin Portal.', 'success')
    return redirect(url_for('admin_login'))


@app.route('/admin')
def admin_panel():
    """Render the Admin Panel dashboard."""
    if not is_admin_authenticated():
        flash('Please log in with admin credentials (pranaykrsingh03@gmail.com) to access the Admin Panel.', 'error')
        return redirect(url_for('admin_login'))

    conn = get_db()
    
    users = conn.execute('SELECT * FROM users ORDER BY id DESC').fetchall()
    trips = conn.execute('SELECT * FROM trips ORDER BY id DESC').fetchall()
    bookings = conn.execute('SELECT * FROM bookings ORDER BY id DESC').fetchall()
    
    total_users = len(users)
    total_trips = len(trips)
    total_bookings = len(bookings)
    
    # Calculate revenue from bookings and total managed trip budget
    total_booking_revenue = sum(b['amount'] for b in bookings if b['amount'])
    total_trip_budget = sum(t['budget'] for t in trips if t['budget'])
    total_revenue = total_booking_revenue + total_trip_budget

    conn.close()

    return render_template(
        'admin.html',
        users=users,
        trips=trips,
        bookings=bookings,
        total_users=total_users,
        total_trips=total_trips,
        total_bookings=total_bookings,
        total_revenue=total_revenue
    )


@app.route('/admin/user/add', methods=['POST'])
def admin_add_user():
    """Add new user from admin panel."""
    if not is_admin_authenticated():
        flash('Unauthorized action.', 'error')
        return redirect(url_for('admin_login'))

    full_name = request.form.get('full_name', '').strip()
    email = request.form.get('email', '').strip()
    password = request.form.get('password', 'password123')
    country = request.form.get('country', 'India').strip()
    phone = request.form.get('phone', '').strip()

    if not full_name or not email:
        flash('Full Name and Email are required.', 'error')
        return redirect(url_for('admin_panel'))

    pwd_hash = hash_password(password)

    try:
        conn = get_db()
        conn.execute(
            'INSERT INTO users (full_name, email, password, country, phone) VALUES (?, ?, ?, ?, ?)',
            (full_name, email, pwd_hash, country, phone)
        )
        conn.commit()
        conn.close()
        flash(f'User "{full_name}" added successfully.', 'success')
    except Exception as e:
        flash('Error adding user: Email may already exist.', 'error')

    return redirect(url_for('admin_panel'))


@app.route('/admin/user/edit/<int:user_id>', methods=['POST'])
def admin_edit_user(user_id):
    """Edit existing user details from admin panel."""
    if not is_admin_authenticated():
        flash('Unauthorized action.', 'error')
        return redirect(url_for('admin_login'))

    full_name = request.form.get('full_name', '').strip()
    email = request.form.get('email', '').strip()
    country = request.form.get('country', '').strip()
    phone = request.form.get('phone', '').strip()

    try:
        conn = get_db()
        conn.execute(
            'UPDATE users SET full_name = ?, email = ?, country = ?, phone = ? WHERE id = ?',
            (full_name, email, country, phone, user_id)
        )
        conn.commit()
        conn.close()
        flash('User details updated successfully.', 'success')
    except Exception as e:
        flash('Failed to update user details.', 'error')

    return redirect(url_for('admin_panel'))


@app.route('/admin/user/delete/<int:user_id>', methods=['POST'])
def admin_delete_user(user_id):
    """Delete user from admin panel."""
    if not is_admin_authenticated():
        flash('Unauthorized action.', 'error')
        return redirect(url_for('admin_login'))

    try:
        conn = get_db()
        conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
        flash('User deleted successfully.', 'success')
    except Exception as e:
        flash('Failed to delete user.', 'error')

    return redirect(url_for('admin_panel'))


@app.route('/admin/trip/add', methods=['POST'])
def admin_add_trip():
    """Add new trip from admin panel."""
    if not is_admin_authenticated():
        flash('Unauthorized action.', 'error')
        return redirect(url_for('admin_login'))

    user_name = request.form.get('user_name', 'Traveler').strip()
    destination = request.form.get('destination', '').strip()
    budget = request.form.get('budget', 25000)
    travel_dates = request.form.get('travel_dates', 'Dec 2026').strip()
    companion = request.form.get('companion', 'Family Vacation').strip()

    if not destination:
        flash('Destination name is required.', 'error')
        return redirect(url_for('admin_panel'))

    try:
        conn = get_db()
        conn.execute(
            'INSERT INTO trips (user_name, destination, budget, travel_dates, companion, status) VALUES (?, ?, ?, ?, ?, ?)',
            (user_name, destination, int(budget), travel_dates, companion, 'Upcoming')
        )
        conn.commit()
        conn.close()
        flash(f'Trip to "{destination}" added successfully.', 'success')
    except Exception as e:
        flash('Failed to add trip.', 'error')

    return redirect(url_for('admin_panel'))


@app.route('/admin/trip/delete/<int:trip_id>', methods=['POST'])
def admin_delete_trip(trip_id):
    """Delete trip record from admin panel."""
    if not is_admin_authenticated():
        flash('Unauthorized action.', 'error')
        return redirect(url_for('admin_login'))

    try:
        conn = get_db()
        conn.execute('DELETE FROM trips WHERE id = ?', (trip_id,))
        conn.commit()
        conn.close()
        flash('Trip record deleted successfully.', 'success')
    except Exception as e:
        flash('Failed to delete trip record.', 'error')

    return redirect(url_for('admin_panel'))


@app.route('/admin/api/stats')
def admin_api_stats():
    """API endpoint returning admin dashboard stats as JSON."""
    if not is_admin_authenticated():
        return jsonify({'error': 'Unauthorized'}), 401

    conn = get_db()
    users_count = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    trips_count = conn.execute('SELECT COUNT(*) FROM trips').fetchone()[0]
    bookings_count = conn.execute('SELECT COUNT(*) FROM bookings').fetchone()[0]
    total_rev = conn.execute('SELECT SUM(amount) FROM bookings').fetchone()[0] or 0
    conn.close()

    return jsonify({
        'users': users_count,
        'trips': trips_count,
        'bookings': bookings_count,
        'total_revenue': total_rev
    })


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
