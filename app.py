from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import sqlite3
import hashlib
import os
import re

app = Flask(__name__)
app.secret_key = os.urandom(24)

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
    """Initialize the database with users table."""
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
    """AI Search page (requires login)."""
    if 'user_id' not in session:
        flash('Please log in to access AI Search.', 'error')
        return redirect(url_for('login'))
    return render_template('ai_search.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle login page."""
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        remember = request.form.get('remember', False)

        if not email or not password:
            flash('Please fill in all fields.', 'error')
            return render_template('login.html')

        if not validate_email(email):
            flash('Please enter a valid email address.', 'error')
            return render_template('login.html')

        conn = get_db()
        user = conn.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            (email, hash_password(password))
        ).fetchone()
        conn.close()

        if user:
            session['user_id'] = user['id']
            session['user_name'] = user['full_name']
            session['user_email'] = user['email']
            flash(f'Welcome back, {user["full_name"]}!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'error')
            return render_template('login.html')

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
    """Simple dashboard page after login."""
    if 'user_id' not in session:
        flash('Please log in to access the dashboard.', 'error')
        return redirect(url_for('login'))
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
    if 'user_id' not in session:
        flash('Please log in to access the Trip Planner.', 'error')
        return redirect(url_for('login'))
    return render_template('trip_planner.html')


@app.route('/map')
def map_page():
    """Interactive Map page."""
    if 'user_id' not in session:
        flash('Please log in to access the Map.', 'error')
        return redirect(url_for('login'))
    return render_template('map.html')


@app.route('/expenses')
def expenses():
    """Expenses page."""
    if 'user_id' not in session:
        flash('Please log in to access the Expenses page.', 'error')
        return redirect(url_for('login'))
    return render_template('expenses.html')


@app.route('/bookings')
def bookings():
    """Bookings page."""
    if 'user_id' not in session:
        flash('Please log in to access Bookings.', 'error')
        return redirect(url_for('login'))
    return render_template('bookings.html')


@app.route('/count-places')
def count_places():
    """Count Places / Destination Detail page."""
    if 'user_id' not in session:
        flash('Please log in to access Count Places.', 'error')
        return redirect(url_for('login'))
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


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
