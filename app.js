// ============================================================
// app.js — হোম পেজ লজিক + ড্যাশবোর্ড + প্রোফাইল + Throwback
// ============================================================

(function() {
  'use strict';

  // ============================================================
  // স্টেট
  // ============================================================
  let splashTimer = null;
  let hasInitHome = false;
  let dashboardLoading = false;

  // ============================================================
  // হেল্পার
  // ============================================================
  function getProfile() {
    try {
      const raw = localStorage.getItem('pinkDiaryProfile');
      const parsed = raw ? JSON.parse(raw) : {};
      return (typeof parsed === 'object' && parsed !== null) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function isEn() {
    return window.Lang ? window.Lang.lang() === 'en' : false;
  }

  function getEntries() {
    try {
      const raw = localStorage.getItem('pinkDiaryEntries');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function getTodos() {
    try {
      const raw = localStorage.getItem('pinkDiaryTodos');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function getProjects() {
    try {
      const raw = localStorage.getItem('pomoProjects');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  // ============================================================
  // Init
  // ============================================================
  function boot() {
    // লক চেক
    const savedPassword = localStorage.getItem('pinkDiaryPassword');
    const isUnlocked = sessionStorage.getItem('diaryUnlocked') === 'true';

    if (typeof LockSystem !== 'undefined') {
      const locked = LockSystem.init();
      if (locked) return; // লক স্ক্রিন দেখাচ্ছে, হোম লোড করব না
    } else {
      // Fallback: LockSystem না থাকলে
      if (savedPassword && !isUnlocked) {
        // লক আছে কিন্তু lock.js নেই → হোম হাইড
        const splash = document.getElementById('splash');
        const home = document.getElementById('home');
        if (splash) splash.classList.add('hidden');
        if (home) home.classList.add('hidden');
        return;
      }
    }

    // হোম লোড
    if (typeof initHome === 'function') {
      initHome();
    }
  }

  // ============================================================
  // initHome
  // ============================================================
  function initHome() {
    if (hasInitHome) return;
    hasInitHome = true;

    const splash = document.getElementById('splash');
    const home = document.getElementById('home');

    // splash/home না থাকলে বাকি কাজ শুধু
    if (!splash || !home) {
      loadUserProfile();
      loadThrowback();
      loadDashboard();
      return;
    }

    const splashSeen = sessionStorage.getItem('splashSeen');

    if (splashSeen) {
      // splash দেখানো হয়েছে
      splash.classList.add('hidden');
      home.classList.remove('hidden');
    } else {
      // প্রথমবার splash দেখাও
      splash.classList.remove('hidden');
      home.classList.add('hidden');
      sessionStorage.setItem('splashSeen', 'true');

      if (splashTimer) clearTimeout(splashTimer);
      splashTimer = setTimeout(() => {
        splash.classList.add('hidden');
        home.classList.remove('hidden');
      }, 2400);
    }

    // বাকি কাজ
    loadUserProfile();
    loadThrowback();
    loadDashboard();
  }

  // ============================================================
  // প্রোফাইল লোড
  // ============================================================
  function loadUserProfile() {
    const prof = getProfile();
    const greeting = document.getElementById('greeting');
    const homeTitle = document.querySelector('.home-title');

    // ১. শুভেচ্ছা
    if (greeting) {
      greeting.textContent = window.Lang && window.Lang.greeting
        ? window.Lang.greeting()
        : 'শুভ সকাল 🌷';
    }

    // ২. হোম টাইটেল
    if (homeTitle) {
      homeTitle.textContent = window.Lang && window.Lang.homeTitle
        ? window.Lang.homeTitle()
        : 'আজ কী করতে চাও?';
    }

    // ৩. অ্যাভাটার
    updateHomeAvatar(prof);

    // ৪. জন্মদিন চেক
    checkBirthday(prof);

    // ৫. অন্যান্য টেক্সট
    updateHomeTexts();
  }

  function updateHomeAvatar(prof) {
    const header = document.querySelector('.home-header');
    if (!header) return;

    // পুরনো avatar সরাও
    const oldAvatar = document.getElementById('homeAvatar');
    if (oldAvatar) oldAvatar.remove();

    const avatarDiv = document.createElement('div');
    avatarDiv.id = 'homeAvatar';
    avatarDiv.className = 'home-avatar';

    if (prof.avatar && prof.avatar.type === 'image' && prof.avatar.value) {
      avatarDiv.innerHTML = `<img src="${escapeHtml(prof.avatar.value)}" alt="avatar">`;
    } else if (prof.avatar && prof.avatar.value) {
      avatarDiv.textContent = prof.avatar.value;
    } else {
      avatarDiv.textContent = '🌸';
    }
    header.insertBefore(avatarDiv, header.firstChild);
  }

  function checkBirthday(prof) {
    if (!prof.birthday) return;
    if (typeof prof.birthday !== 'string') return;
    if (prof.birthday.length < 10) return;

    const today = new Date();
    const todayMD = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    const bd = prof.birthday.slice(5); // YYYY-MM-DD → MM-DD

    if (bd === todayMD) {
      const name = prof.name || (isEn() ? 'Friend' : 'বন্ধু');
      showBirthdayBanner(name);
    }
  }

  function updateHomeTexts() {
    if (!window.Lang) return;

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    // Splash
    setText('splashTitle', window.Lang.splashTitle());
    setText('splashSub', window.Lang.splashSub());

    // Menu
    const menuMap = {
      'menuLabelDiary': 'menuDiary',
      'menuDescDiary': 'menuDiaryDesc',
      'menuLabelCalendar': 'menuCalendar',
      'menuDescCalendar': 'menuCalendarDesc',
      'menuLabelTodo': 'menuTodo',
      'menuDescTodo': 'menuTodoDesc',
      'menuLabelPomodoro': 'menuPomodoro',
      'menuDescPomodoro': 'menuPomodoroDesc',
      'menuLabelMood': 'menuMood',
      'menuDescMood': 'menuMoodDesc',
      'menuLabelSettings': 'menuSettings',
      'menuDescSettings': 'menuSettingsDesc',
      'menuLabelRecycle': 'menuRecycle',
      'menuDescRecycle': 'menuRecycleDesc',
      'menuLabelRoutine': 'menuRoutine',
      'menuDescRoutine': 'menuRoutineDesc',
      'menuLabelNote': 'menuNote',
      'menuDescNote': 'menuNoteDesc',
      'menuLabelMusic': 'menuMusic',
      'menuDescMusic': 'menuMusicDesc',
      'menuLabelFaq': 'menuFaq',
      'menuDescFaq': 'menuFaqDesc',
      'menuLabelAbout': 'menuAbout',
      'menuDescAbout': 'menuAboutDesc',
      'menuLabelFeedback': 'menuFeedback',
      'menuDescFeedback': 'menuFeedbackDesc'
    };

    Object.keys(menuMap).forEach(id => {
      const langKey = menuMap[id];
      if (typeof window.Lang[langKey] === 'function') {
        setText(id, window.Lang[langKey]());
      }
    });

    // ফুটার
    setText('homeFooter', window.Lang.homeFooter());
  }

  // ============================================================
  // জন্মদিন
  // ============================================================
  function showBirthdayBanner(name) {
    // duplicate guard
    const existing = document.querySelector('.birthday-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.className = 'birthday-banner';
    banner.innerHTML = `
      <div class="bday-emoji">🎂</div>
      <div class="bday-text">${isEn() ? 'Happy Birthday' : 'শুভ জন্মদিন'}, ${escapeHtml(name)}! 🎉</div>
      <div class="bday-sub">${isEn() ? 'Today is your day 🌸' : 'আজকের দিনটা তোমার 🌸'}</div>
    `;
    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('show'), 100);

    setTimeout(() => {
      banner.classList.remove('show');
      setTimeout(() => {
        if (banner.parentNode) banner.remove();
      }, 500);
    }, 5000);

    createConfetti();
  }

  function createConfetti() {
    const colors = ['#e0568a', '#f78fb8', '#ffd6e8', '#ffe4ec', '#c97a9a'];
    const total = 50;

    for (let i = 0; i < total; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = Math.random() * 1.5 + 's';
      c.style.animationDuration = (2 + Math.random() * 2) + 's';
      document.body.appendChild(c);

      setTimeout(() => {
        if (c.parentNode) c.remove();
      }, 5000);
    }
  }

  // ============================================================
  // Throwback
  // ============================================================
  function loadThrowback() {
    const card = document.getElementById('throwbackCard');
    const content = document.getElementById('throwbackContent');
    if (!card || !content) return;

    const entries = getEntries();
    if (entries.length === 0) {
      card.classList.add('hidden');
      return;
    }

    const today = new Date();
    const monthsToCheck = [1, 3, 6, 12];
    let found = null;

    for (const m of monthsToCheck) {
      const target = new Date(today);
      target.setMonth(target.getMonth() - m);
      const targetKey = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;

      const match = entries.find(e => {
        try {
          const d = new Date(e.time);
          const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return k === targetKey;
        } catch (err) { return false; }
      });

      if (match) {
        found = { entry: match, monthsAgo: m };
        break;
      }
    }

    if (!found) {
      card.classList.add('hidden');
      return;
    }

    const rawText = String(found.entry.text || '');
    const preview = rawText.length > 120 ? rawText.substring(0, 120) + '...' : rawText;

    card.classList.remove('hidden');

    const agoText = isEn()
      ? `${found.monthsAgo} month${found.monthsAgo > 1 ? 's' : ''} ago`
      : `${found.monthsAgo} মাস আগে`;

    content.innerHTML = `
      <div class="throwback-meta">${agoText} • ${escapeHtml(found.entry.mood || '')}</div>
      <div class="throwback-text">${escapeHtml(preview)}</div>
    `;

    card.dataset.entryId = String(found.entry.id || '');
  }

  function openThrowbackEntry() {
    const card = document.getElementById('throwbackCard');
    if (!card) return;
    const id = card.dataset.entryId;
    if (!id) return;
    location.href = 'diary.html?open=' + encodeURIComponent(id);
  }

  // ============================================================
  // Dashboard
  // ============================================================
  async function loadDashboard() {
    if (dashboardLoading) return;
    dashboardLoading = true;

    const entries = getEntries();
    const todos = getTodos();
    const projects = getProjects();

    // লেবেল আপডেট
    const labels = document.querySelectorAll('.dash-label');
    if (labels.length >= 4) {
      labels[0].textContent = isEn() ? '🔥 Streak' : '🔥 স্ট্রিক';
      labels[1].textContent = isEn() ? '📝 Today' : '📝 আজকের কাজ';
      labels[2].textContent = isEn() ? '🎯 Projects' : '🎯 প্রজেক্ট';
      labels[3].textContent = isEn() ? '📖 This Month' : '📖 এ মাসে';
    }

    const notesLabel = document.getElementById('dashNotesLabel');
    if (notesLabel) {
      notesLabel.textContent = isEn() ? '📝 Notes' : '📝 নোট';
    }

    // ১. স্ট্রিক
    const streakEl = document.getElementById('dashStreak');
    if (streakEl) {
      const days = [...new Set(entries.map(e => {
        try {
          const d = new Date(e.time);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        } catch (err) { return ''; }
      }).filter(Boolean))].sort();

      const today = new Date();
      let current = 0;

      if (days.length > 0) {
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        if (days.includes(todayKey) || days.includes(yKey)) {
          let check = days.includes(todayKey) ? new Date(today) : new Date(yesterday);
          while (true) {
            const k = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`;
            if (days.includes(k)) {
              current++;
              check.setDate(check.getDate() - 1);
            } else break;
          }
        }
      }
      streakEl.textContent = current;
    }

    // ২. আজকের বাকি কাজ
    const todosEl = document.getElementById('dashTodos');
    if (todosEl) {
      const todayStr = new Date().toISOString().split('T')[0];
      const pending = todos.filter(t => t.date === todayStr && !t.done).length;
      todosEl.textContent = pending;
    }

    // ৩. প্রজেক্ট
    const projectsEl = document.getElementById('dashProjects');
    if (projectsEl) projectsEl.textContent = projects.length;

    // ৪. এই মাসের এন্ট্রি
    const monthEl = document.getElementById('dashMonth');
    if (monthEl) {
      const today = new Date();
      const thisMonth = entries.filter(e => {
        try {
          const d = new Date(e.time);
          return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
        } catch (err) { return false; }
      }).length;
      monthEl.textContent = thisMonth;
    }

    // ৫. নোট কাউন্ট (IndexedDB)
    const notesEl = document.getElementById('dashNotes');
    if (notesEl) {
      try {
        const count = await getNotesCount();
        notesEl.textContent = count;
      } catch (e) {
        notesEl.textContent = '0';
      }
    }

    dashboardLoading = false;
  }

  // ✅ IndexedDB notes count
  function getNotesCount() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open('pinkDiaryNotesDB', 2);
        req.onupgradeneeded = (e) => {
          const database = e.target.result;
          if (!database.objectStoreNames.contains('notes')) {
            const store = database.createObjectStore('notes', { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt');
            store.createIndex('pinned', 'pinned');
          }
        };
        req.onsuccess = (e) => {
          const database = e.target.result;
          if (!database.objectStoreNames.contains('notes')) {
            database.close();
            return resolve(0);
          }
          const tx = database.transaction('notes', 'readonly');
          const store = tx.objectStore('notes');
          const countReq = store.count();
          countReq.onsuccess = () => {
            database.close();
            resolve(countReq.result || 0);
          };
          countReq.onerror = () => {
            database.close();
            resolve(0);
          };
        };
        req.onerror = () => resolve(0);
      } catch (e) {
        resolve(0);
      }
    });
  }

  // ============================================================
  // pageshow → ফিরে এলে রিফ্রেশ
  // ============================================================
  window.addEventListener('pageshow', (event) => {
    if (event.persisted || (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]?.type === 'back_forward')) {
      const home = document.getElementById('home');
      if (home && !home.classList.contains('hidden')) {
        // ভাষা বদলেছে?
        const savedLang = getProfile().language || 'bn';
        const currentLang = window.Lang ? window.Lang.lang() : 'bn';
        if (savedLang !== currentLang) {
          location.reload();
          return;
        }
        loadUserProfile();
        loadThrowback();
        loadDashboard();
      }
    }
  });

  // ============================================================
  // Expose to window
  // ============================================================
  window.initHome = initHome;
  window.loadUserProfile = loadUserProfile;
  window.loadThrowback = loadThrowback;
  window.loadDashboard = loadDashboard;
  window.openThrowbackEntry = openThrowbackEntry;

  // ============================================================
  // Boot
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();