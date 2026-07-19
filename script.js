/* ============================================
   ROUTE MODAL
   ============================================ */
const routeModal = document.getElementById('routeModal');
document.getElementById('openRouteModal').addEventListener('click', () => {
  routeModal.classList.add('open');
});
document.getElementById('closeRouteModal').addEventListener('click', () => {
  routeModal.classList.remove('open');
});
routeModal.addEventListener('click', (e) => {
  if (e.target === routeModal) routeModal.classList.remove('open');
});

/* ============================================
   PAYMENT MODAL
   ============================================ */
const paymentModal = document.getElementById('paymentModal');
document.getElementById('openPaymentModal').addEventListener('click', () => {
  paymentModal.classList.add('open');
});
document.getElementById('closePaymentModal').addEventListener('click', () => {
  paymentModal.classList.remove('open');
});
paymentModal.addEventListener('click', (e) => {
  if (e.target === paymentModal) paymentModal.classList.remove('open');
});

const copyCardBtn = document.getElementById('copyCardBtn');
copyCardBtn.addEventListener('click', () => {
  const digits = document.getElementById('cardNumber').textContent.replace(/\s|\u00a0/g, '');
  navigator.clipboard.writeText(digits).then(() => {
    const original = copyCardBtn.innerHTML;
    copyCardBtn.innerHTML = '<i class="fa-solid fa-check"></i> کپی شد';
    copyCardBtn.classList.add('copied');
    setTimeout(() => {
      copyCardBtn.innerHTML = original;
      copyCardBtn.classList.remove('copied');
    }, 1800);
  });
});

/* ============================================
   GALLERY TOGGLE
   ============================================ */
const galleryWrap = document.getElementById('galleryWrap');
const toggleGalleryBtn = document.getElementById('toggleGallery');
toggleGalleryBtn.addEventListener('click', () => {
  const isOpen = galleryWrap.classList.toggle('open');
  toggleGalleryBtn.innerHTML = isOpen
    ? '<i class="fa-solid fa-eye-slash"></i> بستن گالری'
    : '<i class="fa-solid fa-images"></i> مشاهده گالری';
});

/* ============================================
   GALLERY LIGHTBOX (aperture reveal)
   ============================================ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxAperture = document.getElementById('lightboxAperture');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.src;
    lightbox.classList.add('open');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => lightboxAperture.classList.add('reveal'));
    });
  });
});

function closeLightbox(){
  lightboxAperture.classList.remove('reveal');
  setTimeout(() => lightbox.classList.remove('open'), 300);
}
document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

/* ============================================
   PERSIAN (JALALI) CALENDAR
   ============================================ */
const jMonths = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
                  "مهر","آبان","آذر","دی","بهمن","اسفند"];

// Gregorian -> Jalali conversion
function gregorianToJalali(gy, gm, gd){
  const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
             Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) { jy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let jm, jd;
  if (days < 186) { jm = 1 + Math.floor(days / 31); jd = 1 + (days % 31); }
  else { jm = 7 + Math.floor((days - 186) / 30); jd = 1 + ((days - 186) % 30); }
  return [jy, jm, jd];
}

// Jalali -> Gregorian conversion
function jalaliToGregorian(jy, jm, jd){
  jy += 1595;
  let days = -355668 + (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + jd +
             ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) { gy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let gd = days + 1;
  const sal_a = [0,31,(gy%4===0 && gy%100!==0)||gy%400===0 ? 29:28,31,30,31,30,31,31,30,31,30,31];
  let gm;
  for (gm = 1; gm <= 12 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy, gm, gd];
}

function isJalaliLeap(jy){
  const r = ((jy - (jy > 0 ? 474 : 473)) % 2820 + 2820) % 2820;
  return ((r + 474 + 1) * 682) % 2816 < 682;
}
function jalaliMonthLength(jy, jm){
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeap(jy) ? 30 : 29;
}

const today = new Date();
const [todayJY, todayJM, todayJD] = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
let viewJY = todayJY, viewJM = todayJM;
let selected = null;

const calGrid = document.getElementById('calendarGrid');
const calLabel = document.getElementById('calMonthLabel');

function renderCalendar(){
  calLabel.textContent = `${jMonths[viewJM - 1]} ${viewJY}`;
  calGrid.innerHTML = '';

  // weekday of the 1st of this jalali month (0 = Saturday, matches ش ی د س چ پ ج)
  const [gy, gm, gd] = jalaliToGregorian(viewJY, viewJM, 1);
  const jsDay = new Date(gy, gm - 1, gd).getDay(); // 0 = Sunday
  const offset = (jsDay + 1) % 7; // shift so Saturday = 0

  for (let i = 0; i < offset; i++){
    const empty = document.createElement('span');
    empty.className = 'empty';
    calGrid.appendChild(empty);
  }

  const len = jalaliMonthLength(viewJY, viewJM);
  for (let d = 1; d <= len; d++){
    const cell = document.createElement('span');
    cell.textContent = d.toLocaleString('fa-IR');
    cell.classList.add('selectable');
    if (viewJY === todayJY && viewJM === todayJM && d === todayJD){
      cell.classList.add('today');
    }
    if (selected && selected.jy === viewJY && selected.jm === viewJM && selected.jd === d){
      cell.classList.add('selected');
    }
    cell.addEventListener('click', () => {
      selected = { jy: viewJY, jm: viewJM, jd: d };
      renderCalendar();
    });
    calGrid.appendChild(cell);
  }
}

document.getElementById('calNext').addEventListener('click', () => {
  viewJM++;
  if (viewJM > 12){ viewJM = 1; viewJY++; }
  renderCalendar();
});
document.getElementById('calPrev').addEventListener('click', () => {
  viewJM--;
  if (viewJM < 1){ viewJM = 12; viewJY--; }
  renderCalendar();
});

renderCalendar();

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));
