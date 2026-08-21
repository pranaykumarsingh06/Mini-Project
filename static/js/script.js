// ===== Password Toggle Visibility =====
document.addEventListener('DOMContentLoaded', () => {

    // Password visibility toggles
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const eyeOpen = btn.querySelector('.eye-open');
            const eyeClosed = btn.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                if (eyeOpen) eyeOpen.style.display = 'none';
                if (eyeClosed) eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                if (eyeOpen) eyeOpen.style.display = 'block';
                if (eyeClosed) eyeClosed.style.display = 'none';
            }
        });
    });

    // ===== Flash Message Close Buttons =====
    document.querySelectorAll('.flash-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.parentElement;
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-8px)';
            setTimeout(() => msg.remove(), 300);
        });
    });

    // Auto-dismiss flash messages after 5 seconds
    document.querySelectorAll('.flash-message').forEach(msg => {
        setTimeout(() => {
            if (msg.parentElement) {
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(-8px)';
                setTimeout(() => msg.remove(), 300);
            }
        }, 5000);
    });

    // ===== Form Validation =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        setupRegisterValidation(registerForm);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginValidation(loginForm);
    }

    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        setupForgotValidation(forgotForm);
    }

    // Initialize Destination Card Clicks across all pages
    setupDestinationCards();
    createAddTripModal();
    renderDashboardTrips();
    setupHomeSearch();
    renderDestinationPage();
});


// ===== Register Form Validation =====
function setupRegisterValidation(form) {
    const fullName = form.querySelector('#full_name');
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirm_password');
    const phone = form.querySelector('#phone');
    const agreeTerms = form.querySelector('#agree_terms');

    // Real-time validation
    if (fullName) {
        fullName.addEventListener('blur', () => {
            validateField(fullName, fullName.value.trim().length >= 2, 'Name must be at least 2 characters');
        });
    }

    if (email) {
        email.addEventListener('blur', () => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
            validateField(email, isValid, 'Please enter a valid email address');
            if (isValid) checkEmailAvailability(email);
        });
    }

    if (password) {
        password.addEventListener('input', () => {
            const isValid = password.value.length >= 6;
            validateField(password, isValid, 'Password must be at least 6 characters');
            if (confirmPassword && confirmPassword.value) {
                validateField(confirmPassword, confirmPassword.value === password.value, 'Passwords do not match');
            }
        });
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            validateField(confirmPassword, confirmPassword.value === password.value, 'Passwords do not match');
        });
    }

    if (phone) {
        phone.addEventListener('input', (e) => {
            // Allow only numbers, spaces, dashes, plus sign, and parentheses
            e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, '');
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        let isValid = true;

        if (fullName && fullName.value.trim().length < 2) {
            validateField(fullName, false, 'Name must be at least 2 characters');
            isValid = false;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            validateField(email, false, 'Please enter a valid email address');
            isValid = false;
        }

        if (password && password.value.length < 6) {
            validateField(password, false, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (confirmPassword && confirmPassword.value !== password.value) {
            validateField(confirmPassword, false, 'Passwords do not match');
            isValid = false;
        }

        if (agreeTerms && !agreeTerms.checked) {
            isValid = false;
            agreeTerms.parentElement.style.animation = 'shake 0.4s ease';
            setTimeout(() => agreeTerms.parentElement.style.animation = '', 400);
        }

        if (!isValid) {
            e.preventDefault();
        } else {
            const btn = form.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = 'Creating Account';
        }
    });
}


// ===== Login Form Validation =====
function setupLoginValidation(form) {
    const fullName = form.querySelector('#full_name');
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');

    form.addEventListener('submit', (e) => {
        let isValid = true;

        if (fullName && fullName.value.trim().length === 0 && (!email || email.value.trim().length === 0)) {
            validateField(fullName, false, 'Please enter your name or email');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
        } else {
            const btn = form.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = 'Signing In...';
        }
    });
}


// ===== Forgot Password Validation =====
function setupForgotValidation(form) {
    const email = form.querySelector('#email');

    form.addEventListener('submit', (e) => {
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            validateField(email, false, 'Please enter a valid email');
            e.preventDefault();
        } else {
            const btn = form.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = 'Sending';
        }
    });
}


// ===== Utility: Validate Field =====
function validateField(input, isValid, errorMessage) {
    const wrapper = input.closest('.form-group') || input.parentElement;
    let msg = wrapper.querySelector('.validation-message');

    if (!msg) {
        msg = document.createElement('div');
        msg.className = 'validation-message';
        wrapper.appendChild(msg);
    }

    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        msg.className = 'validation-message';
        msg.textContent = '';
        msg.style.display = 'none';
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        msg.className = 'validation-message error';
        msg.textContent = errorMessage;
        msg.style.display = 'block';
    }
}


// ===== Check Email Availability =====
async function checkEmailAvailability(emailInput) {
    try {
        const response = await fetch('/api/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value })
        });
        const data = await response.json();

        if (!data.available) {
            validateField(emailInput, false, data.message);
        }
    } catch (err) {
        // Silently fail – server-side will catch it
    }
}


// ===== Dark Mode & Settings Modal Implementation =====
document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode initialization
    const savedTheme = localStorage.getItem('voyage_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const darkModeButtons = document.querySelectorAll('#darkModeToggle, button[aria-label="Dark Mode"]');
    darkModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('voyage_theme', isDark ? 'dark' : 'light');
        });
    });

    // 2. Settings Modal Creation
    createSettingsModal();
});

function createSettingsModal() {
    if (document.getElementById('settingsModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'settings-modal-overlay';
    overlay.id = 'settingsModalOverlay';
    overlay.innerHTML = `
        <div class="settings-modal">
            <div class="settings-header">
                <h3>Settings & Preferences</h3>
                <button class="settings-close" id="closeSettingsBtn">&times;</button>
            </div>
            <div class="settings-body">
                <div class="settings-group">
                    <label for="settingsName">Display Name</label>
                    <input type="text" id="settingsName" class="settings-input" placeholder="Your Full Name">
                </div>
                <div class="settings-group">
                    <label for="settingsCurrency">Preferred Currency</label>
                    <select id="settingsCurrency" class="settings-select">
                        <option value="INR">₹ INR (Indian Rupee)</option>
                        <option value="USD">$ USD (US Dollar)</option>
                        <option value="EUR">€ EUR (Euro)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <label for="settingsDarkMode" style="font-weight:600; font-size:0.88rem; cursor:pointer;">Dark Mode Appearance</label>
                    <input type="checkbox" id="settingsDarkMode" style="width:18px; height:18px; cursor:pointer;">
                </div>
                <div class="settings-row">
                    <label for="settingsNotif" style="font-weight:600; font-size:0.88rem; cursor:pointer;">Email Trip Alerts & Deals</label>
                    <input type="checkbox" id="settingsNotif" checked style="width:18px; height:18px; cursor:pointer;">
                </div>
            </div>
            <div class="settings-footer">
                <button class="btn-settings-cancel" id="cancelSettingsBtn">Cancel</button>
                <button class="btn-settings-save" id="saveSettingsBtn">Save Settings</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Event listeners
    const closeBtn = document.getElementById('closeSettingsBtn');
    const cancelBtn = document.getElementById('cancelSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const darkModeCheck = document.getElementById('settingsDarkMode');
    const nameInput = document.getElementById('settingsName');

    const closeModal = () => overlay.classList.remove('active');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    saveBtn.addEventListener('click', () => {
        const newName = nameInput.value.trim();
        if (newName) {
            document.querySelectorAll('.topbar__user-name').forEach(el => el.textContent = newName);
            const welcomeBannerH2 = document.querySelector('.welcome-banner h2');
            if (welcomeBannerH2) welcomeBannerH2.textContent = `Welcome Back, ${newName}!`;
        }

        if (darkModeCheck.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('voyage_theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('voyage_theme', 'light');
        }

        closeModal();
        alert('Settings saved successfully!');
    });

    // Attach open triggers to all Settings links/buttons
    document.querySelectorAll('a, button').forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        if (text.includes('settings')) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                // Pre-fill
                const currentNameEl = document.querySelector('.topbar__user-name');
                if (currentNameEl) nameInput.value = currentNameEl.textContent.trim();
                darkModeCheck.checked = document.body.classList.contains('dark-mode');
                overlay.classList.add('active');
            });
        }
    });
}


// ===== Add Trip, Set Budget & Sightseeing Exploration Engine =====
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Add Trip Modal
    createAddTripModal();

    // 2. Initialize Dashboard Upcoming Trips rendering
    renderDashboardTrips();

    // 3. Initialize Home page Search button handler
    setupHomeSearch();

    // 4. Initialize Destination Details page dynamic rendering
    renderDestinationPage();

    // 5. Attach click handlers to all destination cards across the site
    setupDestinationCards();
});

// Destination Sightseeing Database for Indian Destinations
const INDIAN_DESTINATIONS = {
    'goa': {
        title: 'Goa Beaches & Heritage',
        heroImg: '/static/images/dest_venice.jpg',
        description: 'Goa is India\'s premier coastal paradise, famed for its sun-kissed golden beaches, 17th-century Portuguese churches, vibrant nightlife, spice plantations, and delicious seafood.',
        bestSeason: 'October to March is ideal with sunny skies, pleasant sea breezes, and vibrant beach shack culture.',
        weather: [{ icon: '☀️', temp: '28°C' }, { icon: '⛅', temp: '30°C' }, { icon: '☁️', temp: '27°C' }],
        hotels: [
            { name: 'Taj Exotica Resort & Spa', rating: '⭐ 4.9 Rating', img: '/static/images/dest_venice.jpg' },
            { name: 'Cidade de Goa Heritage', rating: '⭐ 4.8 Rating', img: '/static/images/dest_paris.jpg' },
            { name: 'Baga Beach Sanctuary Resort', rating: '⭐ 4.7 Rating', img: '/static/images/dest_swiss.jpg' }
        ],
        restaurants: [
            { name: 'Britto\'s Shack Baga Beach', rating: '★★★★★' },
            { name: 'Fisherman\'s Wharf Cavelossim', rating: '★★★★☆' },
            { name: 'Mum\'s Kitchen Panaji', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Baga & Calangute Beach', desc: 'Water sports, parasailing, and sunset shacks.', img: '/static/images/dest_venice.jpg' },
            { name: 'Aguada Fort & Lighthouse', desc: '17th-century Portuguese fort with Arabian sea panorama.', img: '/static/images/dest_santorini.jpg' },
            { name: 'Basilica of Bom Jesus', desc: 'UNESCO World Heritage site with baroque architecture.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Dudhsagar Waterfalls', desc: 'Four-tiered white waterfall tucked in lush Western Ghats.', img: '/static/images/dest_bali.jpg' },
            { name: 'Anjuna Flea Market', desc: 'Bohemian shopping for souvenirs, spices, and handicrafts.', img: '/static/images/dest_paris.jpg' },
            { name: 'Mandovi River Sunset Cruise', desc: 'Evening cruise with Goan folk music and dance.', img: '/static/images/dest_swiss.jpg' }
        ]
    },
    'jaipur': {
        title: 'Jaipur — The Pink City',
        heroImg: '/static/images/dest_kyoto.jpg',
        description: 'Jaipur, the capital of Rajasthan, is known as the Pink City due to the dominant color scheme of its buildings. It features magnificent palaces, hilltop forts, and rich royal heritage.',
        bestSeason: 'October to March when the climate is cool and ideal for sightseeing heritage forts.',
        weather: [{ icon: '☀️', temp: '24°C' }, { icon: '⛅', temp: '26°C' }, { icon: '☁️', temp: '23°C' }],
        hotels: [
            { name: 'The Rambagh Palace', rating: '⭐ 4.9 Rating', img: '/static/images/dest_kyoto.jpg' },
            { name: 'ITC Rajputana Hotel', rating: '⭐ 4.8 Rating', img: '/static/images/dest_paris.jpg' },
            { name: 'Jai Mahal Palace', rating: '⭐ 4.7 Rating', img: '/static/images/dest_santorini.jpg' }
        ],
        restaurants: [
            { name: 'Chokhi Dhani Ethnic Resort', rating: '★★★★★' },
            { name: 'The Rajput Room', rating: '★★★★☆' },
            { name: 'Peacock Rooftop Restaurant', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Hawa Mahal (Palace of Winds)', desc: 'Iconic 5-story pink sandstone palace with 953 windows.', img: '/static/images/bg_forgot.jpg' },
            { name: 'Amber Fort & Maota Lake', desc: 'Hilltop fortress featuring Sheesh Mahal mirror palace.', img: '/static/images/dest_santorini.jpg' },
            { name: 'City Palace Jaipur', desc: 'Royal residence blending Rajasthani and Mughal architecture.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Jantar Mantar Observatory', desc: 'UNESCO astronomical site with world\'s largest stone sundial.', img: '/static/images/dest_swiss.jpg' },
            { name: 'Nahargarh Fort Sunset View', desc: 'Panoramic hilltop view over the entire Pink City.', img: '/static/images/dest_paris.jpg' },
            { name: 'Johari Bazaar Shopping', desc: 'Traditional market famous for Kundan jewelry and textiles.', img: '/static/images/dest_bali.jpg' }
        ]
    },
    'kerala': {
        title: 'Kerala — God\'s Own Country',
        heroImg: '/static/images/dest_bali.jpg',
        description: 'Kerala is renowned for its tranquil emerald backwaters, tea gardens in Munnar, Ayurvedic wellness, spice plantations, and pristine beaches along the Malabar Coast.',
        bestSeason: 'September to March with pleasant temperatures and calm backwaters.',
        weather: [{ icon: '☀️', temp: '26°C' }, { icon: '⛅', temp: '28°C' }, { icon: '🌧️', temp: '25°C' }],
        hotels: [
            { name: 'Kumarakom Lake Resort', rating: '⭐ 4.9 Rating', img: '/static/images/bg_register.jpg' },
            { name: 'Windermere Estate Munnar', rating: '⭐ 4.8 Rating', img: '/static/images/dest_bali.jpg' },
            { name: 'Taj Green Cove Kovalam', rating: '⭐ 4.7 Rating', img: '/static/images/dest_venice.jpg' }
        ],
        restaurants: [
            { name: 'Karavalli Seafood', rating: '★★★★★' },
            { name: 'Rapsy Restaurant Munnar', rating: '★★★★☆' },
            { name: 'Fort House Restaurant Kochi', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Alleppey Houseboat Cruise', desc: 'Overnight gliding through serene palm-fringed canals.', img: '/static/images/bg_register.jpg' },
            { name: 'Munnar Tea Plantations', desc: 'Endless rolling green tea estates and misty mountain peaks.', img: '/static/images/dest_bali.jpg' },
            { name: 'Periyar Wildlife Sanctuary', desc: 'Boating safari to spot wild elephants and tigers.', img: '/static/images/dest_swiss.jpg' },
            { name: 'Kovalam Crescent Beach', desc: 'Famous lighthouse beach with gold sand and coastal dining.', img: '/static/images/dest_venice.jpg' },
            { name: 'Fort Kochi Chinese Fishing Nets', desc: 'Historic harbor with 14th-century fishing structures.', img: '/static/images/dest_paris.jpg' },
            { name: 'Kathakali Cultural Center', desc: 'Classical Indian dance and martial arts performance.', img: '/static/images/dest_santorini.jpg' }
        ]
    },
    'leh': {
        title: 'Leh Ladakh — The Land of High Passes',
        heroImg: '/static/images/dest_swiss.jpg',
        description: 'Leh Ladakh offers high-altitude desert mountain landscapes, crystal turquoise lakes, ancient Tibetan Buddhist monasteries, and thrilling mountain adventure routes.',
        bestSeason: 'May to September when all mountain passes are open and clear.',
        weather: [{ icon: '☀️', temp: '15°C' }, { icon: '⛅', temp: '18°C' }, { icon: '❄️', temp: '10°C' }],
        hotels: [
            { name: 'The Grand Dragon Ladakh', rating: '⭐ 4.9 Rating', img: '/static/images/dest_swiss.jpg' },
            { name: 'Nubra Ethnic Camp', rating: '⭐ 4.8 Rating', img: '/static/images/bg_forgot.jpg' },
            { name: 'Pangong Wooden Cottages', rating: '⭐ 4.7 Rating', img: '/static/images/dest_santorini.jpg' }
        ],
        restaurants: [
            { name: 'The Tibetan Kitchen Leh', rating: '★★★★★' },
            { name: 'Bon Appetit Leh', rating: '★★★★☆' },
            { name: 'Gesmo Restaurant', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Pangong Tso Lake', desc: 'Vast high-altitude lake that changes colors from blue to green.', img: '/static/images/dest_swiss.jpg' },
            { name: 'Nubra Valley & Hunder Sand Dunes', desc: 'Ride double-humped Bactrian camels in cold desert dunes.', img: '/static/images/dest_santorini.jpg' },
            { name: 'Khardung La Pass', desc: 'One of the world\'s highest motorable passes at 18,380 ft.', img: '/static/images/bg_login.jpg' },
            { name: 'Thiksey & Diskit Monasteries', desc: '15th-century Tibetan Buddhist monasteries with giant Buddha.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Shanti Stupa Leh', desc: 'White-domed hilltop stupa offering breathtaking valley views.', img: '/static/images/dest_paris.jpg' },
            { name: 'Magnetic Hill Miracle', desc: 'Famous gravity-defying hill spot along the Leh-Kargil highway.', img: '/static/images/dest_bali.jpg' }
        ]
    },
    'agra': {
        title: 'Agra — City of Taj Mahal',
        heroImg: '/static/images/hero_amalfi.jpg',
        description: 'Home to the world-famous Taj Mahal, Agra is steeped in Mughal empire history with majestic marble monuments, historic red forts, and royal gardens.',
        bestSeason: 'October to March for cool pleasant sightseeing around monuments.',
        weather: [{ icon: '☀️', temp: '22°C' }, { icon: '⛅', temp: '25°C' }, { icon: '☁️', temp: '21°C' }],
        hotels: [
            { name: 'The Oberoi Amarvilas Agra', rating: '⭐ 5.0 Rating', img: '/static/images/hero_amalfi.jpg' },
            { name: 'Taj Hotel & Convention Center', rating: '⭐ 4.8 Rating', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Trident Agra', rating: '⭐ 4.7 Rating', img: '/static/images/dest_paris.jpg' }
        ],
        restaurants: [
            { name: 'Peshawri at ITC Mughal', rating: '★★★★★' },
            { name: 'Pinch of Spice Agra', rating: '★★★★☆' },
            { name: 'Shankara Veg Roof Garden', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Taj Mahal Sunrise View', desc: 'World wonder white marble mausoleum built by Shah Jahan.', img: '/static/images/hero_amalfi.jpg' },
            { name: 'Agra Fort Citadel', desc: 'Massive red sandstone fortress and former residence of Mughal emperors.', img: '/static/images/dest_santorini.jpg' },
            { name: 'Fatehpur Sikri Royal City', desc: '16th-century deserted Mughal capital city featuring Buland Darwaza.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Mehtab Bagh Gardens', desc: 'Charbagh garden complex offering perfect sunset views across Yamuna.', img: '/static/images/dest_paris.jpg' },
            { name: 'Tomb of I\'timād-ud-Daulah', desc: 'Known as the Baby Taj, an intricate marble inlay jewel.', img: '/static/images/dest_swiss.jpg' },
            { name: 'Sadak Bazaar Handicrafts', desc: 'Shopping for Agra marble inlay work, leather goods, and Petha.', img: '/static/images/dest_venice.jpg' }
        ]
    },
    'udaipur': {
        title: 'Udaipur — City of Lakes',
        heroImg: '/static/images/dest_paris.jpg',
        description: 'Udaipur is Rajasthan\'s most romantic city, famous for its glittering marble palaces, serene lakes, royal havelis, and lush Aravali mountain backdrop.',
        bestSeason: 'September to March with cool lake breezes and clear skies.',
        weather: [{ icon: '☀️', temp: '25°C' }, { icon: '⛅', temp: '27°C' }, { icon: '☁️', temp: '24°C' }],
        hotels: [
            { name: 'Taj Lake Palace Udaipur', rating: '⭐ 5.0 Rating', img: '/static/images/dest_paris.jpg' },
            { name: 'The Leela Palace Udaipur', rating: '⭐ 4.9 Rating', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Trident Udaipur Resort', rating: '⭐ 4.8 Rating', img: '/static/images/dest_santorini.jpg' }
        ],
        restaurants: [
            { name: 'Ambrai Restaurant Lake View', rating: '★★★★★' },
            { name: 'Uprtai Rooftop Dining', rating: '★★★★☆' },
            { name: 'Millets of Mewar', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'City Palace Complex & Museum', desc: 'Largest palace complex in Rajasthan overlooking Lake Pichola.', img: '/static/images/dest_paris.jpg' },
            { name: 'Lake Pichola Sunset Boat Ride', desc: 'Scenic boat ride past Jag Mandir Island and Lake Palace.', img: '/static/images/dest_venice.jpg' },
            { name: 'Jagdish Temple', desc: '1651 Indo-Aryan carved temple dedicated to Lord Vishnu.', img: '/static/images/dest_santorini.jpg' },
            { name: 'Saheliyon-ki-Bari Gardens', desc: 'Royal garden featuring marble elephant fountains and lotus pools.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Bagore Ki Haveli Folk Dance', desc: 'Evening Haveli show with traditional Dharohar dance and music.', img: '/static/images/dest_swiss.jpg' },
            { name: 'Monsoon Palace (Sajjangarh)', desc: 'Hilltop castle offering breathtaking panoramic views of Udaipur.', img: '/static/images/dest_bali.jpg' }
        ]
    },
    'varanasi': {
        title: 'Varanasi — Kashi Vishwanath & Ghats',
        heroImg: '/static/images/hero_amalfi.jpg',
        description: 'Varanasi is India\'s spiritual capital and one of the world\'s oldest inhabited cities, famous for the sacred Kashi Vishwanath Temple and evening Ganga Aarti.',
        bestSeason: 'October to March (Pleasant Spiritual Winter)',
        weather: [{ icon: '☀️', temp: '24°C' }, { icon: '⛅', temp: '26°C' }, { icon: '☀️', temp: '23°C' }],
        hotels: [
            { name: 'BrijRama Palace Varanasi', rating: '⭐ 4.9 Rating', img: '/static/images/hero_amalfi.jpg' },
            { name: 'Taj Nadesar Palace', rating: '⭐ 4.9 Rating', img: '/static/images/dest_paris.jpg' },
            { name: 'Radisson Hotel Varanasi', rating: '⭐ 4.7 Rating', img: '/static/images/dest_santorini.jpg' }
        ],
        restaurants: [
            { name: 'Kashi Chat Bhandar', rating: '★★★★★' },
            { name: 'Dolphin Restaurant Ghat View', rating: '★★★★☆' },
            { name: 'Blue Lassi Shop', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Dashashwamedh Ghat Ganga Aarti', desc: 'Magical evening lamp ritual on the banks of river Ganga.', img: '/static/images/hero_amalfi.jpg' },
            { name: 'Kashi Vishwanath Temple', desc: 'Sacred golden spire temple dedicated to Lord Shiva.', img: '/static/images/dest_santorini.jpg' },
            { name: 'Sarnath Deer Park & Stupa', desc: 'Historic site where Lord Buddha preached his first sermon.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Assi Ghat Sunrise Boat Ride', desc: 'Peaceful morning boat ride watching morning prayers.', img: '/static/images/bg_register.jpg' },
            { name: 'Manikarnika Ghat Heritage Walk', desc: 'Ancient sacred ghat steeped in spiritual history.', img: '/static/images/bg_forgot.jpg' },
            { name: 'BHU & Vishwanath Temple', desc: 'Sprawling green university campus and new Vishwanath temple.', img: '/static/images/dest_paris.jpg' }
        ]
    },
    'rishikesh': {
        title: 'Rishikesh & Haridwar — Yoga & Rafting',
        heroImg: '/static/images/dest_swiss.jpg',
        description: 'Rishikesh is the Yoga Capital of the World, nestled in Himalayan foothills on holy river Ganga, famous for river rafting, Laxman Jhula, and Beatles Ashram.',
        bestSeason: 'September to May for river rafting and yoga retreats.',
        weather: [{ icon: '☀️', temp: '22°C' }, { icon: '⛅', temp: '24°C' }, { icon: '☀️', temp: '21°C' }],
        hotels: [
            { name: 'Ananda in the Himalayas', rating: '⭐ 5.0 Rating', img: '/static/images/dest_swiss.jpg' },
            { name: 'Taj Rishikesh Resort & Spa', rating: '⭐ 4.9 Rating', img: '/static/images/dest_paris.jpg' },
            { name: 'Aloha On The Ganges', rating: '⭐ 4.8 Rating', img: '/static/images/dest_bali.jpg' }
        ],
        restaurants: [
            { name: 'The Beatles Cafe', rating: '★★★★★' },
            { name: 'Chotiwala Restaurant', rating: '★★★★☆' },
            { name: 'Freedom Cafe Laxman Jhula', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Laxman Jhula & Ram Jhula', desc: 'Iconic suspension bridges spanning the turquoise Ganga.', img: '/static/images/dest_swiss.jpg' },
            { name: 'Ganga White Water Rafting', desc: 'Thrilling grade 3 & 4 rapids adventure down the river.', img: '/static/images/dest_venice.jpg' },
            { name: 'Triveni Ghat Evening Aarti', desc: 'Soulful chanting and floating lamps at sacred Triveni Ghat.', img: '/static/images/hero_amalfi.jpg' },
            { name: 'The Beatles Ashram', desc: 'Historic Maharishi Mahesh Yogi ashram painted with vibrant murals.', img: '/static/images/dest_bali.jpg' },
            { name: 'Neer Garh Waterfalls', desc: 'Cascade waterfalls hidden amidst lush Himalayan forests.', img: '/static/images/bg_register.jpg' },
            { name: 'Har Ki Pauri Haridwar', desc: 'Famous Haridwar ghat where holy Ganga enters the plains.', img: '/static/images/dest_santorini.jpg' }
        ]
    },
    'amritsar': {
        title: 'Amritsar — Golden Temple',
        heroImg: '/static/images/hero_amalfi.jpg',
        description: 'Amritsar is the spiritual heart of Sikhism, famous for the magnificent Golden Temple (Harmandir Sahib), Wagah Border ceremony, and delicious Punjabi food.',
        bestSeason: 'October to March for cool pleasant weather.',
        weather: [{ icon: '☀️', temp: '23°C' }, { icon: '⛅', temp: '25°C' }, { icon: '☀️', temp: '22°C' }],
        hotels: [
            { name: 'Taj Swarna Amritsar', rating: '⭐ 4.9 Rating', img: '/static/images/hero_amalfi.jpg' },
            { name: 'Hyatt Regency Amritsar', rating: '⭐ 4.8 Rating', img: '/static/images/dest_paris.jpg' },
            { name: 'Radisson Blu Amritsar', rating: '⭐ 4.7 Rating', img: '/static/images/dest_santorini.jpg' }
        ],
        restaurants: [
            { name: 'Kesar Da Dhaba', rating: '★★★★★' },
            { name: 'Beera Chicken House', rating: '★★★★☆' },
            { name: 'Gurdas Ram Jalebi Wala', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Golden Temple (Harmandir Sahib)', desc: 'Spiritual golden sanctuary surrounded by Amrit Sarovar lake.', img: '/static/images/hero_amalfi.jpg' },
            { name: 'Wagah Border Beating Retreat', desc: 'Patriotic daily military ceremony at the India-Pakistan border.', img: '/static/images/dest_santorini.jpg' },
            { name: 'Jallianwala Bagh Memorial', desc: 'Historic memorial park honoring national freedom fighters.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Partition Museum Amritsar', desc: 'Moving museum documenting the 1947 partition history.', img: '/static/images/bg_forgot.jpg' },
            { name: 'Gobindgarh Fort Light Show', desc: 'Historic 18th-century fort featuring 7D sound & light show.', img: '/static/images/dest_paris.jpg' },
            { name: 'Golden Temple Langar Community Kitchen', desc: 'World\'s largest free community kitchen feeding 100,000 daily.', img: '/static/images/bg_register.jpg' }
        ]
    },
    'darjeeling': {
        title: 'Darjeeling — Tea Hills & Kanchenjunga',
        heroImg: '/static/images/dest_bali.jpg',
        description: 'Darjeeling is the Queen of Hill Stations in West Bengal, renowned for UNESCO Heritage Toy Train, sprawling tea gardens, and Kanchenjunga mountain views.',
        bestSeason: 'March to May & October to December.',
        weather: [{ icon: '⛅', temp: '16°C' }, { icon: '☀️', temp: '18°C' }, { icon: '☁️', temp: '15°C' }],
        hotels: [
            { name: 'Glenburn Tea Estate', rating: '⭐ 4.9 Rating', img: '/static/images/dest_bali.jpg' },
            { name: 'Windamere Colonial Heritage Hotel', rating: '⭐ 4.8 Rating', img: '/static/images/dest_paris.jpg' },
            { name: 'Mayfair Resort Darjeeling', rating: '⭐ 4.8 Rating', img: '/static/images/dest_santorini.jpg' }
        ],
        restaurants: [
            { name: 'Glenary\'s Bakery & Pub', rating: '★★★★★' },
            { name: 'Kunga Tibetan Momos', rating: '★★★★☆' },
            { name: 'Keventers Rooftop Cafe', rating: '★★★★★' }
        ],
        attractions: [
            { name: 'Tiger Hill Sunrise Point', desc: 'Watch golden sunrise over Mount Kanchenjunga & Mount Everest.', img: '/static/images/dest_bali.jpg' },
            { name: 'Darjeeling Himalayan Toy Train Ride', desc: 'UNESCO Heritage steam locomotive train through tea hills.', img: '/static/images/dest_swiss.jpg' },
            { name: 'Happy Valley Tea Estate Tour', desc: 'Walk through lush green tea gardens and taste fresh Darjeeling tea.', img: '/static/images/bg_register.jpg' },
            { name: 'Batasia Loop War Memorial', desc: 'Spiral railway loop offering 360-degree views of Darjeeling town.', img: '/static/images/dest_kyoto.jpg' },
            { name: 'Padmaja Naidu Himalayan Zoo', desc: 'High-altitude zoo home to Red Pandas and Snow Leopards.', img: '/static/images/dest_santorini.jpg' },
            { name: 'Japanese Peace Pagoda', desc: 'Serene white stupa constructed under guidance of Nichidatsu Fujii.', img: '/static/images/hero_amalfi.jpg' }
        ]
    }
};

// Fallback generator for custom typed destinations
function getDestinationData(placeName) {
    const key = (placeName || 'Goa').toLowerCase().trim();
    
    for (const dKey in INDIAN_DESTINATIONS) {
        if (key.includes(dKey) || dKey.includes(key)) {
            return INDIAN_DESTINATIONS[dKey];
        }
    }

    // Custom destination dynamic structure
    const capitalized = placeName.charAt(0).toUpperCase() + placeName.slice(1);
    return {
        title: `${capitalized} Exploration Guide`,
        heroImg: '/static/images/dest_kyoto.jpg',
        description: `${capitalized} is a fantastic Indian travel destination offering vibrant local culture, sightseeing spots, scenic scenery, authentic cuisine, and memorable activities.`,
        bestSeason: 'October to March is ideal for sightseeing and outdoor exploration.',
        weather: [{ icon: '☀️', temp: '24°C' }, { icon: '⛅', temp: '26°C' }, { icon: '☁️', temp: '22°C' }],
        hotels: [
            { name: `${capitalized} Luxury Heritage Resort`, rating: '⭐ 4.9 Rating', img: '/static/images/dest_kyoto.jpg' },
            { name: `${capitalized} Grand Palace Hotel`, rating: '⭐ 4.8 Rating', img: '/static/images/dest_paris.jpg' },
            { name: `${capitalized} Boutique Stay`, rating: '⭐ 4.7 Rating', img: '/static/images/dest_santorini.jpg' }
        ],
        restaurants: [
            { name: `${capitalized} Royal Cuisine`, rating: '★★★★★' },
            { name: `${capitalized} Spice Garden`, rating: '★★★★☆' },
            { name: `${capitalized} Heritage Cafe`, rating: '★★★★★' }
        ],
        attractions: [
            { name: `${capitalized} City Center & Fort`, desc: 'Explore historic landmarks and city architecture.', img: '/static/images/dest_kyoto.jpg' },
            { name: `${capitalized} Scenic Viewpoint`, desc: 'Breathtaking panoramic sunset views over mountains and lakes.', img: '/static/images/dest_swiss.jpg' },
            { name: `${capitalized} Heritage Market`, desc: 'Traditional shopping for souvenirs, local handicrafts, and textiles.', img: '/static/images/dest_paris.jpg' },
            { name: `${capitalized} Temple & Sanctuary`, desc: 'Tranquil cultural sanctuary with serene gardens.', img: '/static/images/dest_santorini.jpg' },
            { name: `${capitalized} Nature Trail & Park`, desc: 'Lush greenery, walking trails, and outdoor relaxation.', img: '/static/images/dest_bali.jpg' },
            { name: `${capitalized} Local Food Walk`, desc: 'Taste authentic local food specialties and traditional sweets.', img: '/static/images/dest_venice.jpg' }
        ]
    };
}

// 1. Create Add Trip Modal
function createAddTripModal() {
    if (document.getElementById('addTripModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'settings-modal-overlay';
    overlay.id = 'addTripModalOverlay';
    overlay.innerHTML = `
        <div class="settings-modal" style="max-width: 520px;">
            <div class="settings-header">
                <h3>✈️ Plan & Add Destination</h3>
                <button class="settings-close" id="closeAddTripBtn">&times;</button>
            </div>
            <div class="settings-body">
                <div class="settings-group">
                    <label for="tripDestSelect">Where do you want to go?</label>
                    <select id="tripDestSelect" class="settings-select" style="margin-bottom:6px;">
                        <option value="Goa">Goa (Beaches & Forts)</option>
                        <option value="Jaipur">Jaipur (Pink City & Forts)</option>
                        <option value="Kerala">Kerala (Backwaters & Munnar)</option>
                        <option value="Leh Ladakh">Leh Ladakh (Lakes & Passes)</option>
                        <option value="Agra">Agra (Taj Mahal & Fort)</option>
                        <option value="Udaipur">Udaipur (City of Lakes)</option>
                        <option value="Varanasi">Varanasi (Kashi Vishwanath & Ghats)</option>
                        <option value="Rishikesh">Rishikesh & Haridwar (Ganga & Rafting)</option>
                        <option value="Amritsar">Amritsar (Golden Temple)</option>
                        <option value="Darjeeling">Darjeeling (Tea Hills & Kanchenjunga)</option>
                        <option value="Shimla & Manali">Shimla & Manali (Snow Valley)</option>
                        <option value="custom">Other / Type Custom Place...</option>
                    </select>
                    <input type="text" id="tripDestCustom" class="settings-input" placeholder="Type destination name (e.g. Varanasi, Manali, Darjeeling)" style="display:none;">
                </div>
                <div class="settings-group">
                    <label for="tripBudgetInput">Set Trip Budget (₹ INR)</label>
                    <input type="number" id="tripBudgetInput" class="settings-input" placeholder="e.g. 25000" value="25000" step="1000">
                </div>
                <div class="settings-group">
                    <label for="tripDateInput">Travel Dates</label>
                    <input type="text" id="tripDateInput" class="settings-input" placeholder="e.g. Dec 15 - Dec 20, 2026" value="December 15, 2026">
                </div>
                <div class="settings-group">
                    <label for="tripStyleSelect">Companion / Travel Style</label>
                    <select id="tripStyleSelect" class="settings-select">
                        <option value="Solo Explorer">Solo Explorer</option>
                        <option value="Couple Romantic">Couple / Romantic</option>
                        <option value="Family Vacation" selected>Family Vacation</option>
                        <option value="Friends Adventure">Friends Adventure</option>
                    </select>
                </div>
            </div>
            <div class="settings-footer">
                <button class="btn-settings-cancel" id="cancelAddTripBtn">Cancel</button>
                <button class="btn-settings-save" id="saveAddTripBtn">Add & Explore Sightseeing</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = document.getElementById('closeAddTripBtn');
    const cancelBtn = document.getElementById('cancelAddTripBtn');
    const saveBtn = document.getElementById('saveAddTripBtn');
    const destSelect = document.getElementById('tripDestSelect');
    const destCustom = document.getElementById('tripDestCustom');
    const budgetInput = document.getElementById('tripBudgetInput');
    const dateInput = document.getElementById('tripDateInput');

    const closeModal = () => overlay.classList.remove('active');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    destSelect.addEventListener('change', () => {
        if (destSelect.value === 'custom') {
            destCustom.style.display = 'block';
            destCustom.focus();
        } else {
            destCustom.style.display = 'none';
        }
    });

    saveBtn.addEventListener('click', () => {
        let selectedDest = destSelect.value === 'custom' ? destCustom.value.trim() : destSelect.value;
        if (!selectedDest) selectedDest = 'Goa';

        const budget = parseInt(budgetInput.value) || 25000;
        const dates = dateInput.value.trim() || 'December 15, 2026';

        // Store trip in localStorage
        const newTrip = {
            id: 'trip_' + Date.now(),
            dest: selectedDest,
            budget: budget,
            dates: dates,
            status: 'Upcoming',
            addedAt: new Date().toISOString()
        };

        const existingTrips = JSON.parse(localStorage.getItem('voyage_user_trips') || '[]');
        existingTrips.unshift(newTrip);
        localStorage.setItem('voyage_user_trips', JSON.stringify(existingTrips));

        closeModal();

        // Redirect to Count Places destination guide for this destination!
        window.location.href = `/count-places?place=${encodeURIComponent(selectedDest)}&budget=${budget}`;
    });

    // Global listener for + Add Trip button on Dashboard
    const openBtn = document.getElementById('openAddTripBtn');
    if (openBtn) {
        openBtn.addEventListener('click', () => overlay.classList.add('active'));
    }
}

// 2. Render Dashboard Trips dynamically
function renderDashboardTrips() {
    const container = document.getElementById('upcomingTripsContainer');
    if (!container) return;

    const trips = JSON.parse(localStorage.getItem('voyage_user_trips') || '[]');
    if (trips.length === 0) return;

    // Render user added trips at the top of the list
    trips.forEach(trip => {
        const destData = getDestinationData(trip.dest);
        const item = document.createElement('div');
        item.className = 'trip-item';
        item.style.cursor = 'pointer';
        item.innerHTML = `
            <div class="trip-item__img">
                <img src="${destData.heroImg}" alt="${trip.dest}">
            </div>
            <div class="trip-item__info">
                <h4>${trip.dest}</h4>
                <p>${trip.dates} • Budget ₹${trip.budget.toLocaleString('en-IN')}</p>
            </div>
            <span class="trip-badge trip-badge--upcoming">Upcoming</span>
        `;
        item.addEventListener('click', () => {
            window.location.href = `/count-places?place=${encodeURIComponent(trip.dest)}&budget=${trip.budget}`;
        });
        container.prepend(item);
    });
}

// 3. Home Page Search Setup
function setupHomeSearch() {
    const exploreBtn = document.getElementById('exploreBtn');
    const searchInput = document.getElementById('searchDestination');
    const budgetSelect = document.getElementById('searchBudget');

    if (!exploreBtn) return;

    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = searchInput ? searchInput.value.trim() : '';
        const overlay = document.getElementById('addTripModalOverlay');
        const destSelect = document.getElementById('tripDestSelect');
        const destCustom = document.getElementById('tripDestCustom');

        if (dest && overlay) {
            if (['goa', 'jaipur', 'kerala', 'leh', 'agra', 'udaipur'].some(k => dest.toLowerCase().includes(k))) {
                const match = ['Goa', 'Jaipur', 'Kerala', 'Leh Ladakh', 'Agra', 'Udaipur'].find(m => m.toLowerCase().includes(dest.toLowerCase()));
                if (destSelect) destSelect.value = match || 'Goa';
                if (destCustom) destCustom.style.display = 'none';
            } else {
                if (destSelect) destSelect.value = 'custom';
                if (destCustom) {
                    destCustom.style.display = 'block';
                    destCustom.value = dest;
                }
            }
            overlay.classList.add('active');
        } else if (overlay) {
            overlay.classList.add('active');
        } else {
            window.location.href = `/count-places?place=${encodeURIComponent(dest || 'Goa')}`;
        }
    });
}

// 4. Render Destination Explorer Page (`count_places.html`) dynamically
function renderDestinationPage() {
    const params = new URLSearchParams(window.location.search);
    const place = params.get('place');
    const budgetParam = params.get('budget');

    if (!place) return;

    const data = getDestinationData(place);

    // Update Hero Title & Image
    const heroH1 = document.querySelector('.kyoto-hero__content h1');
    const heroImg = document.getElementById('largeHeroImg');
    if (heroH1) heroH1.textContent = data.title || place;
    if (heroImg) heroImg.src = data.heroImg;

    // Add Planned Budget Banner if provided
    if (budgetParam) {
        let budgetBanner = document.getElementById('plannedBudgetBanner');
        if (!budgetBanner) {
            budgetBanner = document.createElement('div');
            budgetBanner.id = 'plannedBudgetBanner';
            budgetBanner.style.cssText = 'background: linear-gradient(135deg, #2563EB, #1D4ED8); color: white; padding: 1rem 1.5rem; border-radius: 14px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; font-family: "Inter", sans-serif;';
            const hero = document.querySelector('.kyoto-hero');
            if (hero && hero.parentElement) {
                hero.parentElement.insertBefore(budgetBanner, hero.nextSibling);
            }
        }
        budgetBanner.innerHTML = `
            <div>
                <h3 style="margin:0; font-size:1.1rem; font-weight:700;">🎯 Active Trip Planned to ${place}</h3>
                <p style="margin:4px 0 0 0; font-size:0.85rem; opacity:0.9;">Explore all attractions, hotels, and local sightseeing for your trip.</p>
            </div>
            <div style="font-size:1.3rem; font-weight:800; background:rgba(255,255,255,0.2); padding:6px 14px; border-radius:10px;">
                Budget: ₹${parseInt(budgetParam).toLocaleString('en-IN')}
            </div>
        `;
    }

    // Update Description & Best Season
    const cards = document.querySelectorAll('.kyoto-card');
    if (cards.length >= 2) {
        const descP = cards[0].querySelector('p');
        if (descP) descP.textContent = data.description;

        const seasonP = cards[1].querySelector('p');
        if (seasonP) seasonP.textContent = data.bestSeason;
    }

    // Update Weather
    const weatherDays = document.querySelectorAll('.weather-day');
    if (data.weather && weatherDays.length >= 3) {
        data.weather.forEach((w, idx) => {
            if (weatherDays[idx]) {
                const icon = weatherDays[idx].querySelector('.weather-day__icon');
                const temp = weatherDays[idx].querySelector('.weather-day__temp');
                if (icon) icon.textContent = w.icon;
                if (temp) temp.textContent = w.temp;
            }
        });
    }

    // Update Hotels
    const hotelItems = document.querySelectorAll('.hotel-item');
    if (data.hotels && hotelItems.length > 0) {
        data.hotels.forEach((h, idx) => {
            if (hotelItems[idx]) {
                const name = hotelItems[idx].querySelector('.hotel-item__name');
                const rating = hotelItems[idx].querySelector('.hotel-item__rating');
                const img = hotelItems[idx].querySelector('.hotel-item__img');
                if (name) name.textContent = h.name;
                if (rating) rating.textContent = h.rating;
                if (img) img.src = h.img;
            }
        });
    }

    // Update Tourist Attractions Grid ("Everywhere to go & things to see!")
    const attractionGrids = document.querySelectorAll('.attractions-grid');
    if (attractionGrids.length >= 2 && data.attractions) {
        const firstGrid = attractionGrids[0]; // Restaurants
        const secondGrid = attractionGrids[1]; // Tourist Attractions

        if (data.restaurants) {
            const restCards = firstGrid.querySelectorAll('.attraction-card');
            data.restaurants.forEach((r, idx) => {
                if (restCards[idx]) {
                    const name = restCards[idx].querySelector('.attraction-card__name');
                    if (name) name.textContent = r.name;
                }
            });
        }

        if (data.attractions) {
            const attrCards = secondGrid.querySelectorAll('.attraction-card');
            data.attractions.forEach((a, idx) => {
                if (attrCards[idx]) {
                    const name = attrCards[idx].querySelector('.attraction-card__name');
                    const img = attrCards[idx].querySelector('.attraction-card__img');
                    if (name) name.textContent = a.name;
                    if (img && a.img) img.src = a.img;
                }
            });
        }
    }
}

// 5. Setup click handlers on all destination cards across the site
function setupDestinationCards() {
    document.querySelectorAll('.dest-card, .rec-card, .recently-card, .ai-rec-card, .ai-card, .trip-item, .package-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'A' || e.target.closest('a')) return;

            const titleEl = card.querySelector('h3, h4');
            if (titleEl) {
                const titleText = titleEl.textContent.trim();
                let cleanDest = titleText;
                
                const lower = titleText.toLowerCase();
                if (lower.includes('shimla')) cleanDest = 'Shimla';
                else if (lower.includes('manali')) cleanDest = 'Manali';
                else if (lower.includes('udaipur')) cleanDest = 'Udaipur';
                else if (lower.includes('darjeeling')) cleanDest = 'Darjeeling';
                else if (lower.includes('goa')) cleanDest = 'Goa';
                else if (lower.includes('jaipur') || lower.includes('hawa') || lower.includes('amber')) cleanDest = 'Jaipur';
                else if (lower.includes('kerala') || lower.includes('munnar') || lower.includes('backwater')) cleanDest = 'Kerala';
                else if (lower.includes('leh') || lower.includes('ladakh')) cleanDest = 'Leh Ladakh';
                else if (lower.includes('agra') || lower.includes('taj')) cleanDest = 'Agra';
                else if (lower.includes('varanasi') || lower.includes('kashi')) cleanDest = 'Varanasi';
                else if (lower.includes('rishikesh')) cleanDest = 'Rishikesh';
                else if (lower.includes('amritsar')) cleanDest = 'Amritsar';
                else cleanDest = titleText.split('(')[0].split(',')[0].trim();

                window.location.href = `/count-places?place=${encodeURIComponent(cleanDest)}`;
            }
        });
    });
}
