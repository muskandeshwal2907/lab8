# Multi-Page User Registration Web Application

A clean, modern, multi-page client-side web application built purely with **plain HTML5, vanilla CSS3, and vanilla JavaScript** (ES6+). No build tools, frameworks, or backend servers required.

---

## 📁 File Structure

```text
c:/lab8/
├── index.html       # User registration form with validation
├── display.html     # Shows the most recently submitted user's details
├── users.html       # Interactive directory table displaying all submitted users
├── README.md        # Project overview and usage instructions
├── css/
│   └── style.css    # Shared stylesheet with design tokens, responsive cards, and form feedback
└── js/
    ├── form.js      # Form validation rules (on blur/submit) & localStorage saving
    ├── display.js   # Reads "currentUser" and renders profile details safely
    └── users.js     # Reads "allUsers", renders responsive table, and handles deletion
```

---

## 🚀 How to Run the Application

You can run this project with zero installation:

### Option 1: Direct File Open
Simply double-click `index.html` or drag it into any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### Option 2: Using Any Local Static Server
If you prefer running via HTTP:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js npx
npx serve .
```
Then navigate to `http://localhost:8000/index.html`.

---

## 📝 Features & Form Validation Rules

1. **Full Name**
   - Mandatory field.
   - Must contain letters and spaces only (min. 3 characters).
2. **Gender**
   - Mandatory selection (`Male`, `Female`, `Other`) via accessible radio buttons.
3. **Mobile Number**
   - Mandatory 10-digit Indian phone number starting with `6`, `7`, `8`, or `9`.
   - Restricts non-numeric keystrokes automatically.
4. **Email ID**
   - Mandatory standard email format (`user@domain.com`).
5. **City**
   - Mandatory text input (minimum 2 characters).
6. **State / UT**
   - Comprehensive dropdown listing all 28 Indian States & 8 Union Territories.
7. **Country**
   - Select dropdown defaulting to `India`.

---

## 🔒 Security & Data Persistence

- **XSS Protection**: All user-generated content rendered in the DOM strictly uses `textContent` (or explicit `document.createElement`) instead of `innerHTML`, safeguarding against cross-site scripting vulnerabilities.
- **Resilient Storage**: All `localStorage` read and write calls are encapsulated in `try / catch` blocks to gracefully handle restricted browser environments or storage quotas.
- **Active Navigation**: All pages share a consistent responsive header bar highlighting the active route.
