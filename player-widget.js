// ============================================================
// player-widget.js — সব পেজে গ্লোবাল মিউজিক কন্ট্রোল
// ============================================================

(function() {
  'use strict';

  function getOrCreatePlayerIframe() {
    let iframe = document.getElementById('audioFrame');
    if (iframe) return iframe;

    iframe = document.createElement('iframe');
    iframe.src = 'player.html';
    iframe.id = 'audioFrame';
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    iframe.addEventListener('load', () => {
      setTimeout(() => {
        sendToPlayer({ type: 'musicGetState' });
      }, 400);
    });

    return iframe;
  }

  function sendToPlayer(msg) {
    const frame = document.getElementById('audioFrame');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage(msg, '*');
    }
  }

  function injectPlayerUI() {
    if (document.getElementById('globalMusicWidget')) return;

    // ✅ player iframe একবারই তৈরি
    getOrCreatePlayerIframe();

    // ============ FAB বাটন ============
    const fab = document.createElement('div');
    fab.id = 'globalMusicWidget';
    fab.innerHTML = '🎵';
    fab.title = 'মিউজিক';
    Object.assign(fab.style, {
      position: 'fixed', bottom: '60px', left: '0px',
      width: '38px', height: '38px',
      background: 'linear-gradient(135deg, #e0568a, #d94a7e)',
      color: '#fff', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px',
      boxShadow: '0 4px 15px rgba(224, 86, 138, 0.4)',
      zIndex: '9999', cursor: 'pointer',
      transition: 'transform 0.2s',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent'
    });

    // ============ Popup ============
    const popup = document.createElement('div');
    popup.id = 'globalMusicPopup';
    popup.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div style="font-size:12px; font-weight:bold; color:#e0568a;">🎵 মিউজিক প্লেয়ার</div>
        <button id="closeMusicPopup" style="background:none; border:none; font-size:16px; color:#888; cursor:pointer; padding:0; width:24px; height:24px;">✕</button>
      </div>
      <div id="widgetSongName" style="font-size:14px; font-weight:600; color:var(--text, #333); margin-bottom:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">কোনো গান বাজছে না</div>
      <div style="display:flex; align-items:center; justify-content:center; gap:15px; margin-top:15px;">
        <button id="widgetPrev" style="background:none; border:none; font-size:20px; cursor:pointer; padding:4px;">⏮</button>
        <button id="widgetPlay" style="background:#e0568a; color:#fff; border:none; width:42px; height:42px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▶</button>
        <button id="widgetNext" style="background:none; border:none; font-size:20px; cursor:pointer; padding:4px;">⏭</button>
      </div>
      <div style="text-align:center; margin-top:10px;">
        <a href="music.html" style="color:#e0568a; font-size:11px; text-decoration:none; font-weight:600;">সব গান দেখো →</a>
      </div>
    `;
    Object.assign(popup.style, {
      position: 'fixed', bottom: '10px', left: '20px',
      width: '220px', background: 'var(--card-bg, #fff)', borderRadius: '16px',
      padding: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      zIndex: '9999', display: 'none', border: '1px solid #ffe4ec',
      transition: 'all 0.3s ease'
    });

    document.body.appendChild(fab);
    document.body.appendChild(popup);

    // ============ FAB টগল ============
    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('closeMusicPopup').addEventListener('click', () => {
      popup.style.display = 'none';
    });

    // বাইরে ক্লিক → popup বন্ধ
    document.addEventListener('click', (e) => {
      if (popup.style.display !== 'block') return;
      if (e.target.closest('#globalMusicPopup')) return;
      if (e.target.closest('#globalMusicWidget')) return;
      popup.style.display = 'none';
    });

    // ============ কন্ট্রোল বাটন ============
    document.getElementById('widgetPlay').addEventListener('click', () => sendToPlayer({ type: 'musicToggle' }));
    document.getElementById('widgetNext').addEventListener('click', () => sendToPlayer({ type: 'musicNext' }));
    document.getElementById('widgetPrev').addEventListener('click', () => sendToPlayer({ type: 'musicPrev' }));

    // ============ State আপডেট ============
    window.addEventListener('message', (e) => {
      const data = e.data;
      if (!data || data.type !== 'musicStateUpdate') return;

      const playBtn = document.getElementById('widgetPlay');
      if (playBtn) {
        playBtn.textContent = data.isPlaying ? '⏸' : '▶';
      }

      const songNameEl = document.getElementById('widgetSongName');
      if (songNameEl) {
        if (data.currentSongName) {
          songNameEl.textContent = data.currentSongName;
        } else {
          songNameEl.textContent = 'কোনো গান বাজছে না';
        }
      }
    });

    // ============ Autoplay resume ============
    function onUserInteraction() {
      try {
        const savedState = JSON.parse(localStorage.getItem('musicPlayerState'));
        if (savedState && savedState.isPlaying) {
          sendToPlayer({ type: 'musicResumeIfPlaying' });
        }
      } catch(e) {}
    }
    document.addEventListener('click', onUserInteraction);
    document.addEventListener('touchstart', onUserInteraction, { passive: true });
    document.addEventListener('keydown', onUserInteraction);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPlayerUI);
  } else {
    injectPlayerUI();
  }
})();