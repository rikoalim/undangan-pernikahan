// ============ MUSIK LATAR ============
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

bgMusic.volume = 0.45;

function playMusic() {
  bgMusic.play().then(() => {
    musicIcon.textContent = '🎵';
    musicBtn.classList.add('playing');
  }).catch((err) => console.log('Autoplay diblokir:', err.name));
}

function pauseMusic() {
  bgMusic.pause();
  musicIcon.textContent = '🔇';
  musicBtn.classList.remove('playing');
}

window.addEventListener('load', playMusic);

const startOnInteraction = () => {
  if (bgMusic.paused) playMusic();
  ['click', 'touchstart', 'keydown', 'scroll'].forEach(evt =>
    document.removeEventListener(evt, startOnInteraction)
  );
};
['click', 'touchstart', 'keydown', 'scroll'].forEach(evt =>
  document.addEventListener(evt, startOnInteraction, evt === 'scroll' ? { passive: true } : undefined)
);

musicBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  bgMusic.paused ? playMusic() : pauseMusic();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) bgMusic.pause();
  else if (!bgMusic.paused) bgMusic.play().catch(() => {});
});

// ============ BUKA UNDANGAN ============
const openBtn = document.getElementById('openInvite');
const mainContent = document.getElementById('mainContent');
const hero = document.querySelector('.hero');
const floatNav = document.getElementById('floatNav');

openBtn.addEventListener('click', () => {
  hero.style.display = 'none';
  mainContent.classList.remove('hidden');
  floatNav.classList.remove('hidden');
  window.scrollTo(0, 0);
  playMusic();
  initReveal();
  renderWishes();
});

// ============ COUNTDOWN ============
const weddingDate = new Date('2026-12-12T09:00:00').getTime();

function updateCountdown() {
  const gap = weddingDate - new Date().getTime();
  if (gap <= 0) {
    document.getElementById('countdownBox').innerHTML =
      '<p style="font-size:1.2rem">Alhamdulillah, acara telah berlangsung 🎉</p>';
    return;
  }
  document.getElementById('days').textContent = Math.floor(gap / 86400000);
  document.getElementById('hours').textContent = Math.floor((gap / 3600000) % 24);
  document.getElementById('minutes').textContent = Math.floor((gap / 60000) % 60);
  document.getElementById('seconds').textContent = Math.floor((gap / 1000) % 60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============ RSVP + GUEST BOOK ============
const rsvpForm = document.getElementById('rsvpForm');
const wishList = document.getElementById('wishList');

function renderWishes() {
  const list = JSON.parse(localStorage.getItem('rsvpList') || '[]');
  if (!list.length) {
    wishList.innerHTML = '<p class="empty">Jadilah yang pertama memberi ucapan 💙</p>';
    return;
  }
  wishList.innerHTML = list.slice().reverse().map(item => `
    <div class="wish-card">
      <p class="wish-name">
        ${escapeHtml(item.name)}
        <span class="wish-badge">${item.attendance}</span>
      </p>
      ${item.message ? `<p class="wish-msg">"${escapeHtml(item.message)}"</p>` : ''}
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const attendance = document.getElementById('attendance').value;
  const message = document.getElementById('message').value.trim();

  const list = JSON.parse(localStorage.getItem('rsvpList') || '[]');
  list.push({ name, attendance, message, time: new Date().toISOString() });
  localStorage.setItem('rsvpList', JSON.stringify(list));

  document.getElementById('rsvpStatus').textContent =
    `Terima kasih, ${name}! Konfirmasi Anda (${attendance}) telah tersimpan 💙`;
  rsvpForm.reset();
  document.getElementById('guestCount').value = 1;
  renderWishes();
});

// ============ COPY REKENING ============
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.copy);
    const original = btn.textContent;
    btn.textContent = 'Tersalin ✓';
    setTimeout(() => btn.textContent = original, 1500);
  });
});

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    q.parentElement.classList.toggle('open');
  });
});

// ============ SHARE ============
const shareStatus = document.getElementById('shareStatus');
const shareUrl = window.location.href;
const shareText = 'Undangan Pernikahan Alma & Vonny — 12 Desember 2026 💙 Buka di sini:';

function showShareStatus(msg) {
  if (!shareStatus) return;
  shareStatus.textContent = msg;
  setTimeout(() => shareStatus.textContent = '', 3000);
}

document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const type = btn.dataset.share;

    if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
      showShareStatus('Membuka WhatsApp...');
    }

    if (type === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
      showShareStatus('Membuka Telegram...');
    }

    if (type === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showShareStatus('Link berhasil disalin ✓');
      } catch {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showShareStatus('Link berhasil disalin ✓');
      }
    }
  });
});

// ============ SCROLL REVEAL ============
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}