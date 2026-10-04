<<<<<<< HEAD
Form Pilot 📝
A modern, responsive and bilingual registration form built with HTML, CSS, JavaScript and PHP.

Form Pilot is designed as a practical full-stack form project with client-side validation, CAPTCHA protection, Persian/English language support, province and city autocomplete, light/dark themes, and a prepared PHP/MySQL backend.

🔗 Live Demo: https://kiyan-rahmati.github.io/Form-pilot/

---

✨ Features

- 🌐 Persian / English language support
- 🔄 Automatic RTL / LTR layout switching
- 🌙 Light / Dark mode
- 💾 Theme and language preferences saved with "localStorage"
- 🔍 Province and city autocomplete
- 🇮🇷 Persian and English province/city data
- 🛡️ Custom CAPTCHA system using HTML Canvas
- ⏱️ CAPTCHA refresh cooldown
- ✅ Client-side form validation
- 🪪 Iranian National ID validation
- 📱 Iranian mobile number validation
- 📧 Email validation
- ⚠️ Real-time validation error messages
- 📱 Fully responsive design
- 🎨 Modern UI with glass-style card and responsive layout
- 🐘 PHP backend prepared for MySQL
- 🔐 PDO prepared statements for database queries
- 📦 JSON-based location data

---

🛠️ Technologies

Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- JavaScript ES Modules
- HTML Canvas API
- LocalStorage API
- JSON

Backend

- PHP 8+
- MySQL
- PDO
- Prepared Statements

---

📂 Project Structure

Form-pilot/
│
├── index.html
├── style.css
│
├── data/
│   ├── provinces.json
│   └── cities.json
│
├── js/
│   ├── app.js
│   ├── autocomplete.js
│   ├── captcha.js
│   ├── i18n.js
│   ├── theme.js
│   └── validation.js
│
└── php/
    ├── config.php
    ├── helpers.php
    └── submit.php

---

🚀 How It Works

Form Pilot is divided into several independent modules.

1. Form Interface

The main interface is built in "index.html".

The form collects:

- First Name
- Last Name
- Father's Name
- National ID
- Phone Number
- Email
- Province
- City
- Address
- CAPTCHA

The interface is responsive and automatically adapts to different screen sizes.

---

2. Province & City Autocomplete

Location data is stored separately in JSON files:

data/provinces.json
data/cities.json

When the application starts, JavaScript loads both files using "fetch()".

The user can search for a province and select it from the suggestions.

After selecting a province, the city field becomes enabled and only cities belonging to that province are displayed.

The system also supports searching using both Persian and English names.

---

3. CAPTCHA System

Form Pilot includes a custom CAPTCHA generated with the HTML Canvas API.

The CAPTCHA:

- Generates a random 5-character code
- Draws the code on a Canvas
- Adds noise lines and dots
- Supports regeneration
- Includes a refresh cooldown
- Validates the entered code before submission

The CAPTCHA logic is separated into:

js/captcha.js

---

4. Form Validation

Validation is handled by:

js/validation.js

The application checks required fields and validates specific data formats.

National ID

The project implements the Iranian National ID checksum algorithm and rejects invalid or repeated-digit codes.

Phone Number

Iranian mobile numbers are checked against the expected format:

09XXXXXXXXX

Email

Email addresses are validated using a standard email pattern.

Province & City

The user must select a valid province and city from the autocomplete lists rather than simply typing arbitrary values.

---

🌐 Bilingual Interface

Form Pilot supports:

🇮🇷 فارسی
🇬🇧 English

The translation system is implemented in:

js/i18n.js

Switching the language automatically changes:

- Text
- Labels
- Placeholders
- Validation messages
- Province/city labels
- Page direction

Persian uses:

dir="rtl"

English uses:

dir="ltr"

The selected language is stored in "localStorage".

---

🌙 Theme System

The application includes Light and Dark themes.

Theme management is implemented in:

js/theme.js

The selected theme is saved locally using:

localStorage

If no theme has been selected previously, the application can detect the user's system preference.

---

🐘 PHP Backend

The project also contains a PHP backend prepared for MySQL.

Backend files:

php/config.php
php/helpers.php
php/submit.php

"config.php"

Responsible for establishing the PDO connection to MySQL.

"helpers.php"

Contains reusable helper functions such as:

- JSON responses
- POST value handling
- Persian/Arabic digit normalization
- Phone validation
- National ID validation

"submit.php"

The backend endpoint is designed to:

1. Accept POST requests
2. Receive submitted form data
3. Validate required fields
4. Validate National ID
5. Validate phone number
6. Validate email
7. Insert the data into MySQL
8. Return a JSON response

Database queries use PDO prepared statements.

---

🗄️ Database

The PHP backend expects a MySQL database named:

form_pilot

with a "users" table containing fields corresponding to:

first_name
last_name
father_name
national_code
phone
email
province
city
address

The database configuration can be changed in:

php/config.php

Example:

$host = "127.0.0.1";
$port = "3306";
$dbname = "form_pilot";
$username = "root";
$password = "";

«The current GitHub version contains the backend endpoint and database connection layer, while the current frontend submission flow is still configured as a frontend demonstration.»

---

💻 Running Locally

Frontend Demo

Because the project uses JavaScript ES Modules and loads JSON files with "fetch()", it is recommended to run it through a local web server rather than opening "index.html" directly.

For example, with VS Code:

1. Open the project in VS Code.
2. Install/use a local development server such as Live Server.
3. Open:

index.html

The application should then be available through a local URL such as:

http://127.0.0.1:5500/

---

🐘 Running with XAMPP

If you want to test the PHP/MySQL backend locally:

1. Install XAMPP

Start:

Apache
MySQL

2. Move the project

Place the project inside:

C:\xampp\htdocs\

For example:

C:\xampp\htdocs\Form-pilot

3. Create the database

Open:

http://localhost/phpmyadmin

Create:

form_pilot

Then create the required "users" table.

4. Configure PHP

Check:

php/config.php

and make sure the database credentials match your local MySQL configuration.

5. Open the project

Visit:

http://localhost/Form-pilot/

---

🔄 Application Flow

The general application flow is:

User opens Form
       ↓
Load Province & City JSON
       ↓
Initialize CAPTCHA
       ↓
Initialize Theme
       ↓
Initialize Language
       ↓
User enters information
       ↓
Province selected
       ↓
Related cities displayed
       ↓
Form validation
       ↓
CAPTCHA verification
       ↓
Successful frontend submission

The PHP backend provides the server-side layer for database submission when the frontend is connected to the PHP endpoint.

---

🔐 Security Considerations

The project includes several validation and security-oriented practices:

- PDO database connection
- Prepared SQL statements
- Server-side validation functions
- Client-side validation
- POST-only backend endpoint
- Input normalization
- Email validation
- National ID validation
- Phone validation
- CAPTCHA verification

For a production deployment, additional protections such as CSRF protection, rate limiting, secure headers, HTTPS, stronger input sanitization, and production database credentials should also be implemented.

---

🎯 Project Purpose

Form Pilot was built as a practical web development project to demonstrate:

- Modern frontend form development
- JavaScript modular architecture
- Client-side validation
- Responsive UI design
- Bilingual interfaces
- JSON data handling
- PHP backend development
- MySQL database integration
- PDO and prepared statements
- Basic web security concepts

---

📸 Live Preview

Live Demo:
https://kiyan-rahmati.github.io/Form-pilot/

Source Code:
https://github.com/kiyan-rahmati/Form-pilot

---

👨‍💻 Author

Kiyan Rahmati

Web Developer · Frontend & Backend Developer · Computer Engineering Student

GitHub:
https://github.com/kiyan-rahmati
=======
# Form Pilot

A bilingual (Persian / English) registration form with a live preview card.
Plain HTML, CSS and ES modules on the front end, PHP on the back end.

## Features

- AJAX submit (`fetch` + `FormData`), no page reload, inline success state with a tracking code
- Live ID-card preview that fills in as you type (including the uploaded photo)
- Persian / English UI with RTL / LTR switching, light and dark theme
- Province → city autocomplete from local JSON
- Iranian national ID checksum and mobile number validation, on the client and the server
- Profile photo upload checked by real MIME type, size and `getimagesize`
- **Storage with fallback**: MySQL first; if the database is unavailable the record
  is written to `storage/submissions.json` instead

## Run it

```bash
php -S localhost:8000
```

Open <http://localhost:8000>.

### Optional: MySQL

Create an empty database named `form_pilot`. The `users` table is created
automatically on the first submission. Credentials come from environment variables:

```bash
FP_DB_HOST=127.0.0.1 FP_DB_PORT=3306 FP_DB_NAME=form_pilot \
FP_DB_USER=root FP_DB_PASS=secret php -S localhost:8000
```

If MySQL is not reachable (or the PDO MySQL driver is missing), submissions go to
`storage/submissions.json` and the user still sees a normal success message.
The reason is written to the PHP error log.

## Project layout

```
index.html  style.css
js/    app.js  preview.js  validation.js  autocomplete.js  captcha.js  i18n.js  theme.js
php/   save.php  storage.php  helpers.php  config.php
data/  provinces.json  cities.json      (public, loaded by the browser)
storage/  submissions.json              (private, blocked by .htaccess)
uploads/  profile photos                (PHP execution blocked by .htaccess)
```

## Notes

- `storage/` and `uploads/` hold personal data and are git-ignored.
  On nginx, add an equivalent `deny all` rule for `/storage/`; `.htaccess` only works on Apache.
- The CAPTCHA is generated and checked in the browser, so it only stops casual
  mistakes. A real bot defence needs a server-side check.
>>>>>>> c34f89a (Update project)
