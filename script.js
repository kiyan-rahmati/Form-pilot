// ---------- تنظیمات کپچا ----------
const CAPTCHA_LENGTH = 5;
const REFRESH_COOLDOWN = 30; // ثانیه

const canvas = document.getElementById('captchaCanvas');
const ctx = canvas.getContext('2d');
const refreshBtn = document.getElementById('refreshCaptchaBtn');
const refreshTimerEl = document.getElementById('refreshTimer');
const captchaInput = document.getElementById('captchaInput');

let currentCaptchaText = '';
let cooldownInterval = null;
let remainingSeconds = 0;

function generateCaptchaText(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // بدون حروف/اعداد مشابه
  let text = '';
  for (let i = 0; i < length; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

function drawCaptcha(text) {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // پس‌زمینه
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, w, h);

  // خطوط نویز
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(${rand(0,180)},${rand(0,180)},${rand(0,180)},0.4)`;
    ctx.beginPath();
    ctx.moveTo(rand(0, w), rand(0, h));
    ctx.lineTo(rand(0, w), rand(0, h));
    ctx.stroke();
  }

  // نقطه‌های نویز
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${rand(0,180)},${rand(0,180)},${rand(0,180)},0.5)`;
    ctx.beginPath();
    ctx.arc(rand(0, w), rand(0, h), 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // متن کپچا با چرخش تصادفی هر حرف
  const gap = w / (text.length + 1);
  for (let i = 0; i < text.length; i++) {
    const x = gap * (i + 1);
    const y = h / 2 + rand(-5, 5);
    const angle = rand(-25, 25) * (Math.PI / 180);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${rand(22, 28)}px Tahoma`;
    ctx.fillStyle = `rgb(${rand(30,90)},${rand(30,90)},${rand(30,90)})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newCaptcha() {
  currentCaptchaText = generateCaptchaText(CAPTCHA_LENGTH);
  drawCaptcha(currentCaptchaText);
  captchaInput.value = '';
  clearError('captcha');
}

function startCooldown() {
  remainingSeconds = REFRESH_COOLDOWN;
  refreshBtn.disabled = true;
  updateTimerText();

  cooldownInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerText();
    if (remainingSeconds <= 0) {
      clearInterval(cooldownInterval);
      refreshBtn.disabled = false;
      refreshTimerEl.textContent = '';
    }
  }, 1000);
}

function updateTimerText() {
  if (remainingSeconds > 0) {
    refreshTimerEl.textContent = `تازه‌سازی مجدد تا ${remainingSeconds} ثانیه دیگر`;
  }
}

refreshBtn.addEventListener('click', () => {
  if (refreshBtn.disabled) return;
  newCaptcha();
  startCooldown();
});

// ---------- اعتبارسنجی فرم ----------
const form = document.getElementById('registerForm');
const successMsg = document.getElementById('successMsg');

function setError(field, message) {
  const el = document.getElementById(`err-${field}`);
  const input = document.getElementById(field === 'captcha' ? 'captchaInput' : field);
  if (el) el.textContent = message;
  if (input) input.classList.toggle('invalid', !!message);
}

function clearError(field) {
  setError(field, '');
}

function isValidNationalCode(code) {
  if (!/^\d{10}$/.test(code)) return false;
  const check = parseInt(code[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

function isValidPhone(phone) {
  return /^09\d{9}$/.test(phone);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  successMsg.textContent = '';
  let valid = true;

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const fatherName = document.getElementById('fatherName').value.trim();
  const nationalCode = document.getElementById('nationalCode').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const province = document.getElementById('province').value.trim();
  const city = document.getElementById('city').value.trim();
  const address = document.getElementById('address').value.trim();
  const email = document.getElementById('email').value.trim();
  const captchaValue = captchaInput.value.trim();

  if (!firstName) { setError('firstName', 'نام را وارد کنید'); valid = false; } else clearError('firstName');
  if (!lastName) { setError('lastName', 'نام خانوادگی را وارد کنید'); valid = false; } else clearError('lastName');
  if (!fatherName) { setError('fatherName', 'نام پدر را وارد کنید'); valid = false; } else clearError('fatherName');

  if (!isValidNationalCode(nationalCode)) {
    setError('nationalCode', 'کد ملی معتبر نیست');
    valid = false;
  } else clearError('nationalCode');

  if (!isValidPhone(phone)) {
    setError('phone', 'شماره تلفن معتبر نیست (مثال: 09123456789)');
    valid = false;
  } else clearError('phone');

  if (!province) { setError('province', 'استان را وارد کنید'); valid = false; } else clearError('province');
  if (!city) { setError('city', 'شهر را وارد کنید'); valid = false; } else clearError('city');
  if (!address) { setError('address', 'آدرس را وارد کنید'); valid = false; } else clearError('address');

  if (!isValidEmail(email)) {
    setError('email', 'ایمیل معتبر نیست');
    valid = false;
  } else clearError('email');

  if (captchaValue.toUpperCase() !== currentCaptchaText.toUpperCase()) {
    setError('captcha', 'کد امنیتی صحیح نیست');
    valid = false;
  } else clearError('captcha');

  if (!valid) return;

  successMsg.textContent = 'فرم با موفقیت ثبت شد ✅';
  form.reset();
  newCaptcha();
  startCooldown();
});

// شروع اولیه
newCaptcha();
startCooldown();
