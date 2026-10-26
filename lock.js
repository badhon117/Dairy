/* ============================================================
   lock.js — অ্যাপ লক সিস্টেম (পিন / প্যাটার্ন)
   ============================================================ */

(function() {
  'use strict';

  function safeEncode(str) {
    try {
      return btoa(unescape(encodeURIComponent(String(str))));
    } catch (e) {
      try { return btoa(String(str)); }
      catch (err) { return String(str); }
    }
  }

  function normalizeAnswer(str) {
    return String(str || '').trim().toLowerCase();
  }

  const KEYS = {
    PASSWORD: 'pinkDiaryPassword',
    LOCK_TYPE: 'pinkDiaryLockType',
    SECURITY_Q: 'pinkDiarySecurityQ',
    SECURITY_A: 'pinkDiarySecurityA',
    UNLOCKED: 'diaryUnlocked'
  };

  window.LockSystem = {

    getLockType: function() {
      if (!localStorage.getItem(KEYS.PASSWORD)) return null;
      const savedType = localStorage.getItem(KEYS.LOCK_TYPE);
      if (savedType === 'pin' || savedType === 'pattern') return savedType;
      const pw = localStorage.getItem(KEYS.PASSWORD) || '';
      const guess = /^\d+(,\d+)+$/.test(pw) ? 'pattern' : 'pin';
      localStorage.setItem(KEYS.LOCK_TYPE, guess);
      return guess;
    },

    getPassword: function() {
      return localStorage.getItem(KEYS.PASSWORD) || '';
    },

    setPassword: function(value, type) {
      if (value) {
        localStorage.setItem(KEYS.PASSWORD, value);
        localStorage.setItem(KEYS.LOCK_TYPE, type === 'pattern' ? 'pattern' : 'pin');
      } else {
        localStorage.removeItem(KEYS.PASSWORD);
        localStorage.removeItem(KEYS.LOCK_TYPE);
      }
    },

    hasPassword: function() {
      return !!localStorage.getItem(KEYS.PASSWORD);
    },

    isUnlocked: function() {
      return sessionStorage.getItem(KEYS.UNLOCKED) === 'true';
    },

    markUnlocked: function() {
      sessionStorage.setItem(KEYS.UNLOCKED, 'true');
    },

    init: function() {
      const existing = document.getElementById('appLockScreen');
      if (existing) existing.remove();

      const hasPw = this.hasPassword();
      const unlocked = this.isUnlocked();

      if (hasPw && !unlocked) {
        this.showLockScreen();
        return true; 
      } else {
        this.hideLockScreen();
        return false;
      }
    },

    showLockScreen: function() {
      if (document.getElementById('appLockScreen')) return;

      const isEn = window.Lang ? window.Lang.lang() === 'en' : false;
      const lockType = this.getLockType();
      const isPattern = lockType === 'pattern';

      const splash = document.getElementById('splash');
      const home = document.getElementById('home');
      if (splash) splash.classList.add('hidden');
      if (home) home.classList.add('hidden');

      const lock = document.createElement('div');
      lock.className = 'lock-screen';
      lock.id = 'appLockScreen';
      lock.innerHTML = `
        <div class="lock-icon">🔒</div>
        <div class="lock-title">${isEn ? 'App is Locked' : 'অ্যাপ লক করা আছে'}</div>
        <div class="lock-sub">${isEn
          ? (isPattern ? 'Draw pattern to unlock' : 'Enter password to unlock')
          : (isPattern ? 'খুলতে প্যাটার্ন আঁকুন' : 'খুলতে পাসওয়ার্ড দিন')
        }</div>

        ${!isPattern ? `
          <div class="pin-section" id="pinSection" style="max-width: 280px; margin: 0 auto; width: 100%;">
            <input type="password" id="unlockPasswordInput" class="settings-input"
              placeholder="${isEn ? 'Enter password...' : 'পাসওয়ার্ড লিখুন...'}"
              style="text-align: center; font-size: 16px; margin-bottom: 12px;">
            <button class="save-btn" id="unlockSubmitBtn" type="button"
              style="width: 100%; margin-bottom: 10px;">${isEn ? 'Unlock' : 'আনলক করুন'}</button>
            <div class="lock-error" id="lockError"
              style="color:#d63a5f; font-size:12px; min-height:18px;"></div>
          </div>
        ` : `
          <div class="pattern-section" id="patternSection">
            <canvas id="patternCanvas" width="280" height="280"
              style="touch-action:none; border-radius:16px; background:rgba(255,255,255,0.4);"></canvas>
            <div class="lock-error" id="patternError"
              style="color:#d63a5f; font-size:13px; min-height:18px; margin-top:8px;"></div>
          </div>
        `}

        <button class="lock-forgot" id="lockForgot" type="button">
          ${isEn ? 'Forgot password?' : 'পাসওয়ার্ড ভুলে গেছি?'}
        </button>
      `;
      document.body.appendChild(lock);

      if (!isPattern) {
        this._bindPasswordEvents(isEn);
      } else {
        this._bindPatternEvents(isEn);
      }
      this._bindForgotEvent(isEn);
    },

    hideLockScreen: function() {
      const lock = document.getElementById('appLockScreen');
      if (lock) lock.remove();
    },

    _bindPasswordEvents: function(isEn) {
      const inputEl = document.getElementById('unlockPasswordInput');
      const submitBtn = document.getElementById('unlockSubmitBtn');
      const errorEl = document.getElementById('lockError');
      if (!inputEl || !submitBtn) return;

      const self = this;
      const handleVerify = function() {
        const val = inputEl.value;
        if (!val) {
          errorEl.textContent = isEn ? 'Please enter password' : 'পাসওয়ার্ড লিখুন';
          return;
        }
        if (val === self.getPassword()) {
          self.unlockSuccess();
        } else {
          errorEl.textContent = isEn ? 'Wrong password ❌' : 'ভুল পাসওয়ার্ড ❌';
          inputEl.value = '';
          inputEl.focus();
        }
      };

      submitBtn.addEventListener('click', handleVerify);
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleVerify();
      });
      setTimeout(() => inputEl.focus(), 100);
    },

    _bindPatternEvents: function(isEn) {
      const canvas = document.getElementById('patternCanvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const savedPattern = this.getPassword();
      const errorEl = document.getElementById('patternError');
      const self = this;

      const dots = [];
      const gridSize = 3;
      const dotGap = 90;
      const offset = 50;
      const dotRadius = 9;

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          dots.push({ x: offset + j * dotGap, y: offset + i * dotGap, id: i * 3 + j });
        }
      }

      let isDrawing = false;
      let selectedDots = [];
      let mousePos = { x: 0, y: 0 };

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
          const isSelected = selectedDots.includes(dot.id);
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#e0568a' : '#d9a7bd';
          ctx.fill();
        });

        if (selectedDots.length > 0) {
          ctx.beginPath();
          selectedDots.forEach((id, index) => {
            const dot = dots[id];
            if (index === 0) ctx.moveTo(dot.x, dot.y);
            else ctx.lineTo(dot.x, dot.y);
          });
          if (isDrawing) ctx.lineTo(mousePos.x, mousePos.y);
          ctx.strokeStyle = '#e0568a';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      function getDotAt(x, y) {
        for (let dot of dots) {
          if (Math.hypot(x - dot.x, y - dot.y) < 30) return dot.id;
        }
        return null;
      }

      function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY
        };
      }

      function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        selectedDots = [];
        mousePos = getPos(e);
        const id = getDotAt(mousePos.x, mousePos.y);
        if (id !== null) selectedDots.push(id);
        draw();
      }

      function moveDraw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        mousePos = getPos(e);
        const id = getDotAt(mousePos.x, mousePos.y);
        if (id !== null && !selectedDots.includes(id)) {
          selectedDots.push(id);
        }
        draw();
      }

      function endDraw() {
        if (!isDrawing) return;
        isDrawing = false;

        const patternStr = selectedDots.join(',');

        if (patternStr && patternStr === savedPattern) {
          self.unlockSuccess();
        } else if (selectedDots.length > 0) {
          errorEl.textContent = isEn ? 'Wrong Pattern ❌' : 'ভুল প্যাটার্ন ❌';
          selectedDots = [];
          draw();
        }
      }

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', moveDraw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', moveDraw, { passive: false });
      canvas.addEventListener('touchend', endDraw);

      draw();
    },

    unlockSuccess: function() {
      this.markUnlocked();
      this.hideLockScreen();

      const splash = document.getElementById('splash');
      const home = document.getElementById('home');
      if (splash) splash.classList.add('hidden');
      if (home) home.classList.remove('hidden');
      sessionStorage.setItem('splashSeen', 'true');

      if (typeof initHome === 'function') {
        try { initHome(); } catch (e) { console.error(e); }
      } else {
        location.reload();
      }
    },

    _bindForgotEvent: function(isEn) {
      const self = this;
      const btn = document.getElementById('lockForgot');
      if (!btn) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const qKey = localStorage.getItem(KEYS.SECURITY_Q);
        const savedAns = localStorage.getItem(KEYS.SECURITY_A);

        if (!qKey || !savedAns) {
          const resetWithoutQ = confirm(isEn
            ? 'No recovery question set! Do you want to clear the lock now?'
            : 'কোনো রিকভারি প্রশ্ন সেট করা নেই! আপনি কি লকটি মুছে ফেলতে চান?');
          
          if (resetWithoutQ) {
            localStorage.removeItem(KEYS.PASSWORD);
            localStorage.removeItem(KEYS.LOCK_TYPE);
            sessionStorage.removeItem(KEYS.UNLOCKED);
            alert(isEn ? 'Lock removed. Please reload.' : 'লক মুছে ফেলা হয়েছে। পেজ রিফ্রেশ করুন।');
            location.reload();
          }
          return;
        }

        const questions = {
          favColor: isEn ? 'What is your favorite color?' : 'আপনার প্রিয় রঙ কী?',
          firstSchool: isEn ? 'What is the name of your first school?' : 'আপনার প্রথম স্কুলের নাম কী?',
          favTeacher: isEn ? 'What is your favorite teacher\'s name?' : 'আপনার প্রিয় শিক্ষকের নাম কী?',
          childhoodFriend: isEn ? 'What is your childhood best friend\'s name?' : 'আপনার শৈশবের প্রিয় বন্ধুর নাম কী?',
          favFood: isEn ? 'What is your favorite food?' : 'আপনার প্রিয় খাবারের নাম কী?',
          petName: isEn ? 'What is your pet\'s name?' : 'আপনার পোষা প্রাণীর নাম কী?'
        };

        const qText = questions[qKey] || qKey;

        const modal = document.createElement('div');
        modal.className = 'lock-modal-overlay';
        modal.id = 'recoveryModal';
        modal.style.zIndex = '1000';
        modal.innerHTML = `
          <div class="lock-modal-card" style="text-align:center;">
            <h3>${isEn ? '🔑 Password Recovery' : '🔑 পাসওয়ার্ড উদ্ধার'}</h3>
            <p style="font-size:13px; color:#a0808f; margin-bottom:15px;">${qText}</p>
            <input type="text" id="recoveryAnsInput" class="settings-input"
              placeholder="${isEn ? 'Your answer...' : 'আপনার উত্তর...'}"
              style="margin-bottom:10px;">
            <div id="recoveryError"
              style="color:#d63a5f; font-size:12px; min-height:18px; margin-bottom:10px;"></div>
            <div style="display:flex; gap:10px;">
              <button class="settings-btn-outline" id="recoveryCancel"
                type="button" style="flex:1;">${isEn ? 'Cancel' : 'বাতিল'}</button>
              <button class="save-btn" id="recoverySubmit"
                type="button" style="flex:1;">${isEn ? 'Verify' : 'যাচাই করুন'}</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.remove();
        document.getElementById('recoveryCancel').onclick = close;
        modal.onclick = (ev) => { if (ev.target === modal) close(); };

        document.getElementById('recoverySubmit').onclick = () => {
          const inputVal = normalizeAnswer(document.getElementById('recoveryAnsInput').value);
          const encodedInput = safeEncode(inputVal);

          if (encodedInput === savedAns) {
            close();
            self._showResetChoiceModal(isEn);
          } else {
            document.getElementById('recoveryError').textContent = isEn ? 'Wrong answer ❌' : 'ভুল উত্তর ❌';
          }
        };
      });
    },

    _showResetChoiceModal: function(isEn) {
      const self = this;
      const modal = document.createElement('div');
      modal.className = 'lock-modal-overlay';
      modal.style.zIndex = '1000';
      modal.innerHTML = `
        <div class="lock-modal-card" style="text-align:center;">
          <h3>${isEn ? '🔐 Reset Lock' : '🔐 নতুন লক সেট করুন'}</h3>
          <p style="font-size:13px; color:#a0808f; margin-bottom:15px;">${isEn ? 'Choose a new lock type:' : 'নতুন কোন ধরনের লক সেট করতে চান?'}</p>
          <div style="display:flex; gap:10px; margin-bottom:15px;">
            <button class="save-btn" id="choosePassword"
              type="button" style="flex:1;">${isEn ? 'Password' : 'পাসওয়ার্ড'}</button>
            <button class="settings-btn-outline" id="choosePattern"
              type="button" style="flex:1;">${isEn ? 'Pattern' : 'প্যাটার্ন'}</button>
          </div>
          <button class="settings-btn-outline" id="choiceCancel"
            type="button" style="width:100%;">${isEn ? 'Cancel' : 'বাতিল'}</button>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => modal.remove();
      document.getElementById('choiceCancel').onclick = close;
      modal.onclick = (e) => { if (e.target === modal) close(); };

      document.getElementById('choosePassword').onclick = () => {
        close();
        self._showResetPasswordModal(isEn);
      };
      document.getElementById('choosePattern').onclick = () => {
        close();
        self._showResetPatternModal(isEn);
      };
    },

    _showResetPasswordModal: function(isEn) {
      const self = this;
      const modal = document.createElement('div');
      modal.className = 'lock-modal-overlay';
      modal.style.zIndex = '1000';
      modal.innerHTML = `
        <div class="lock-modal-card" style="text-align:center;">
          <h3>${isEn ? '🔐 Set New Password' : '🔐 নতুন পাসওয়ার্ড সেট করুন'}</h3>
          <input type="password" id="newRecoveryPassword" class="settings-input"
            placeholder="${isEn ? 'New Password' : 'নতুন পাসওয়ার্ড'}" style="margin-bottom:10px;">
          <input type="password" id="confirmRecoveryPassword" class="settings-input"
            placeholder="${isEn ? 'Confirm Password' : 'আবার লিখুন'}" style="margin-bottom:10px;">
          <div id="resetError"
            style="color:#d63a5f; font-size:12px; min-height:18px; margin-bottom:10px;"></div>
          <div style="display:flex; gap:10px;">
            <button class="settings-btn-outline" id="resetCancel"
              type="button" style="flex:1;">${isEn ? 'Cancel' : 'বাতিল'}</button>
            <button class="save-btn" id="resetSubmit"
              type="button" style="flex:1;">${isEn ? 'Save' : 'সেভ করুন'}</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => modal.remove();
      document.getElementById('resetCancel').onclick = close;
      modal.onclick = (e) => { if (e.target === modal) close(); };

      document.getElementById('resetSubmit').onclick = () => {
        const pw1 = document.getElementById('newRecoveryPassword').value;
        const pw2 = document.getElementById('confirmRecoveryPassword').value;

        if (!pw1) {
          document.getElementById('resetError').textContent = isEn ? 'Password cannot be empty' : 'পাসওয়ার্ড খালি রাখা যাবে না';
          return;
        }
        if (pw1 !== pw2) {
          document.getElementById('resetError').textContent = isEn ? 'Passwords do not match' : 'দুইটা পাসওয়ার্ড মিলছে না';
          return;
        }

        self.setPassword(pw1, 'pin');
        alert(isEn ? 'Password reset successfully!' : 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!');
        location.reload();
      };
    },

    _showResetPatternModal: function(isEn) {
      const self = this;
      const modal = document.createElement('div');
      modal.className = 'lock-modal-overlay';
      modal.style.zIndex = '1000';
      modal.innerHTML = `
        <div class="lock-modal-card" style="text-align:center;">
          <h3>${isEn ? '🔐 Draw New Pattern' : '🔐 নতুন প্যাটার্ন আঁকুন'}</h3>
          <canvas id="resetPatternCanvas" width="220" height="220"
            style="background:var(--card-bg, #fff); border-radius:12px; border:2px dashed var(--pink-main); touch-action:none; display:inline-block; margin-bottom:10px;"></canvas>
          <div id="resetPatternError"
            style="color:#d63a5f; font-size:12px; min-height:18px; margin-bottom:10px;"></div>
          <div style="display:flex; gap:10px;">
            <button class="settings-btn-outline" id="resetPatCancel"
              type="button" style="flex:1;">${isEn ? 'Cancel' : 'বাতিল'}</button>
            <button class="save-btn" id="resetPatSubmit"
              type="button" style="flex:1;">${isEn ? 'Save' : 'সেভ করুন'}</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => modal.remove();
      document.getElementById('resetPatCancel').onclick = close;
      modal.onclick = (e) => { if (e.target === modal) close(); };

      const canvas = document.getElementById('resetPatternCanvas');
      const ctx = canvas.getContext('2d');
      const errorEl = document.getElementById('resetPatternError');

      const dots = [];
      const gridSize = 3;
      const dotGap = 70;
      const offset = 40;
      const dotRadius = 7;

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          dots.push({ x: offset + j * dotGap, y: offset + i * dotGap, id: i * 3 + j });
        }
      }

      let isDrawing = false;
      let selectedDots = [];
      let mousePos = { x: 0, y: 0 };

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dots.forEach(dot => {
          const isSelected = selectedDots.includes(dot.id);
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#e0568a' : '#d9a7bd';
          ctx.fill();
        });
        if (selectedDots.length > 0) {
          ctx.beginPath();
          selectedDots.forEach((id, index) => {
            const dot = dots[id];
            if (index === 0) ctx.moveTo(dot.x, dot.y);
            else ctx.lineTo(dot.x, dot.y);
          });
          if (isDrawing) ctx.lineTo(mousePos.x, mousePos.y);
          ctx.strokeStyle = '#e0568a';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      function getDotAt(x, y) {
        for (let dot of dots) {
          if (Math.hypot(x - dot.x, y - dot.y) < 25) return dot.id;
        }
        return null;
      }

      function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
      }

      function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        selectedDots = [];
        mousePos = getPos(e);
        const id = getDotAt(mousePos.x, mousePos.y);
        if (id !== null) selectedDots.push(id);
        draw();
      }

      function moveDraw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        mousePos = getPos(e);
        const id = getDotAt(mousePos.x, mousePos.y);
        if (id !== null && !selectedDots.includes(id)) selectedDots.push(id);
        draw();
      }

      function endDraw() {
        if (!isDrawing) return;
        isDrawing = false;
        if (selectedDots.length < 3) {
          errorEl.textContent = isEn ? 'Connect at least 3 dots' : 'কমপক্ষে ৩টি ডট কানেক্ট করুন';
          selectedDots = [];
          draw();
        } else {
          errorEl.textContent = '';
        }
      }

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', moveDraw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', moveDraw, { passive: false });
      canvas.addEventListener('touchend', endDraw);
      draw();

      document.getElementById('resetPatSubmit').onclick = () => {
        if (selectedDots.length < 3) {
          errorEl.textContent = isEn ? 'Please draw a valid pattern!' : 'দয়া করে একটি সঠিক প্যাটার্ন আঁকুন!';
          return;
        }
        const patternStr = selectedDots.join(',');
        self.setPassword(patternStr, 'pattern');
        alert(isEn ? 'Pattern reset successfully!' : 'প্যাটার্ন সফলভাবে রিসেট হয়েছে!');
        location.reload();
      };
    }
  };

})();
