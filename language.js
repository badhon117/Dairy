/* ============================================================
   language.js — ভাষা ও স্টাইল হেল্পার
   Sweet (বাংলা) + Formal (ইংরেজি)
   
   ✅ Missing key fallback
   ✅ Profile cache (performance)
   ✅ All keys parity check
   ✅ Bengali digit support
   ============================================================ */

(function() {
  'use strict';

  // ============================================================
  // TONES — সব টেক্সট (বাংলা + ইংরেজি)
  // ============================================================
  const TONES = {
    bn: {
      // ============ GREETING ============
      greeting: {
        morning: 'শুভ সকাল 🌷',
        noon: 'শুভ দুপুর ☀️',
        afternoon: 'শুভ বিকেল 🌸',
        night: 'শুভ রাত্রি 🌙'
      },

      // ============ HOME ============
      homeTitle: (name) => name ? `${name}, আজ কী করতে চাও?` : 'আজ কী করতে চাও?',
      splashTitle: 'আমার দিনলিপি',
      splashSub: 'প্রতিদিনের ছোট ছোট গল্প',
      homeFooter: '🌸 ভালো থাকো, নিজের যত্ন নাও',

      // ============ COMMON BUTTONS ============
      saveBtn: 'সেভ করো ✨',
      updateBtn: 'আপডেট করো ✅',
      cancelBtn: 'বাতিল',
      deleteBtn: 'ডিলিট',
      editBtn: 'এডিট',
      closeBtn: 'বন্ধ করো',
      yesBtn: 'হ্যাঁ',
      noBtn: 'না',
      okBtn: 'ঠিক আছে',
      backBtn: 'ফিরে যাও',

      // ============ MENU ============
      menuDiary: 'দিনলিপি',
      menuDiaryDesc: 'আজকের কথা লিখে রাখো',
      menuCalendar: 'ক্যালেন্ডার',
      menuCalendarDesc: 'দিন অনুযায়ী দেখো',
      menuTodo: 'টুডু লিস্ট',
      menuTodoDesc: 'আজকের কাজের তালিকা',
      menuPomodoro: 'পোমোডোরো টাইমার',
      menuPomodoroDesc: 'প্রজেক্ট ও ফোকাস',
      menuMood: 'মুড ট্র্যাকার',
      menuMoodDesc: 'অনুভূতির হিসাব',
      menuSettings: 'সেটিংস',
      menuSettingsDesc: 'নিয়ন্ত্রণ ও ব্যাকআপ',
      menuRecycle: 'রিসাইকেল বিন',
      menuRecycleDesc: 'মুছে ফেলা জিনিস',
      menuRoutine: 'রুটিন',
      menuRoutineDesc: 'ক্লাস বা কাজের সময়সূচি',
      menuNote: 'নোট',
      menuNoteDesc: 'যেকোনো কথা লিখে রাখো',
      menuMusic: 'মিউজিক',
      menuMusicDesc: 'তোমার পছন্দের গান',
      menuFaq: 'সাহায্য / FAQ',
      menuFaqDesc: 'প্রশ্ন-উত্তর ও গাইড',
      menuAbout: 'অ্যাপ সম্পর্কে',
      menuAboutDesc: 'ডেভেলপার ও তথ্য',
      menuFeedback: 'ফিডব্যাক ও রেটিং',
      menuFeedbackDesc: 'তোমার মতামত জানাও',

      // ============ DIARY ============
      diaryTitle: 'দিনলিপি 📖',
      diaryPlaceholder: (name) => name ? `${name}, আজ কী করলে? মন খুলে লিখে ফেলো...` : 'আজ কী করলে? মন খুলে লিখে ফেলো...',
      emptyDiary: 'এখনো কিছু লেখা হয়নি 🌷<br>আজকের প্রথম কথাটা লিখে ফেলো!',
      oldDaysTitle: '📖 পুরনো দিনগুলো',
      diarySearchPlaceholder: '🔍 ডায়েরিতে খুঁজুন...',

      // ============ CALENDAR ============
      calendarTitle: 'ক্যালেন্ডার 📅',
      calSubtitle: 'দিনে ট্যাপ করে দেখো',
      calEntriesTitle: '📖 এই দিনের এন্ট্রি',
      emptyCal: 'এই দিনে কোনো এন্ট্রি নেই।',

      // ============ TODO ============
      todoTitle: 'টুডু লিস্ট 📝',
      todoSubtitle: 'আগামীর কাজের তালিকা',
      todoPlaceholder: 'নতুন কাজ লিখো...',
      emptyTodo: 'এখনো কোনো কাজ যোগ করা হয়নি ☕<br>ভাবনার কাজগুলো লিখে রাখো!',
      todoListTitle: '📌 তোমার কাজের তালিকা',
      todoClearAll: '🗑️ সব মুছুন',
      todoTodayTasks: '🔥 আজকের কাজ:',

      // ============ MOOD ============
      moodTitle: 'মুড ট্র্যাকার 💭',
      moodSubtitle: 'তোমার অনুভূতির হিসাব',
      moodSummaryTitle: 'এই মাসের predominant মুড',
      moodStatsTitle: '📊 মুডের হিসাব',
      moodDaysTitle: '📅 দিন অনুযায়ী',
      moodNoEntries: 'এই মাসে কোনো মুড দেওয়া হয়নি',
      moodNoMoods: 'এই মাসে এখনো কোনো মুড দেওয়া হয়নি।',
      moodNothingYet: 'এই মাসে এখনো কিছু নেই।',
      moodAppeared: (n) => `${n} বার এসেছে`,

      // ============ POMODORO ============
      pomoTitle: 'আমার প্রজেক্ট 📁',
      pomoSubtitle: 'টাইমার সেট করুন',
      pomoAddBtn: '+ নতুন প্রজেক্ট তৈরি করুন',
      pomoEmpty: 'এখনো কোনো প্রজেক্ট নেই।<br>উপরে ক্লিক করে প্রথম প্রজেক্টটি বানাও!',
      pomoModalNew: 'নতুন প্রজেক্ট',
      pomoModalEdit: 'প্রজেক্ট এডিট করুন',
      pomoNameLabel: 'প্রজেক্টের নাম (ঐচ্ছিক)',
      pomoNamePlaceholder: 'যেমন: পড়াশোনা, কাজ...',
      pomoColorLabel: 'কালার সিলেক্ট করুন',
      pomoFocusLabel: 'ফোকাস (ঘন্টা : মিনিট : সেকেন্ড)',
      pomoFocusPlaceholder: 'সময় সেট করুন',
      pomoShortLabel: 'শর্ট ব্রেক (ঐচ্ছিক)',
      pomoShortPlaceholder: 'ব্রেক না চাইলে খালি রাখুন',
      pomoRoundsLabel: 'কত রাউন্ড?',
      pomoRoundsPlaceholder: 'সংখ্যা সেট করুন',
      pomoDurationLabel: 'মোট ডিউরেশন (স্বয়ংক্রিয়)',
      pomoDurationPlaceholder: 'ফোকাস ও রাউন্ড সেট করুন',
      pomoHintShort: '💡 ব্রেক না দিলে ফোকাস শেষে সরাসরি পরের ফোকাস শুরু হবে।',
      pomoNoBreak: 'ব্রেক নেই',
      pomoBreak: 'ব্রেক',
      pomoDuration: 'ডিউরেশন',
      pomoUntitled: 'নামহীন প্রজেক্ট',
      pomoPickerTitle: 'সময় নির্বাচন করুন',
      pomoPickerRounds: 'রাউন্ড নির্বাচন করুন',
      pomoHour: 'ঘন্টা',
      pomoMinute: 'মিনিট',
      pomoSecond: 'সেকেন্ড',
      pomoNumber: 'সংখ্যা',
      pomoSetBtn: 'সেট করুন',
      pomoValidationNoFocus: 'সঠিক ফোকাস টাইম সেট করুন!',
      pomoValidationNoRounds: 'সঠিক রাউন্ড সংখ্যা সেট করুন!',
      pomoValidationNoDuration: 'ডিউরেশন হিসাব করা যায়নি!',

      // ============ TIMER ============
      timerTitle: 'টাইমার ⏳',
      timerFocus: '🎯 ফোকাস',
      timerBreak: '☕ শর্ট ব্রেক',
      timerRounds: 'রাউন্ড',
      timerTotalTime: 'মোট সময়',
      timerFocusMin: 'ফোকাস মিনিট',
      timerNoProject: 'কোনো প্রজেক্ট সিলেক্ট করা হয়নি।',
      timerBackToProjects: 'প্রজেক্ট লিস্টে ফিরে যান',
      timerReset: 'রিসেট',
      timerStart: 'স্টার্ট',
      timerPause: 'পজ',
      timerSkip: 'পরবর্তী',
      timerComplete: '✅ সম্পন্ন হয়েছে!',
      timerAllDone: '🎉 সব রাউন্ড সম্পন্ন!',
      timerFocusDone: '✅ ফোকাস সম্পন্ন! ব্রেক শুরু ☕',
      timerFocusDoneNoBreak: '✅ ফোকাস সম্পন্ন! পরের ফোকাস শুরু 🎯',
      timerBreakOver: '☕ ব্রেক শেষ! ফোকাস শুরু 🎯',
      timerResetDone: '⟲ রিসেট হয়েছে',
      timerConfirmReset: 'টাইমার রিসেট করবেন?',
      timerConfirmLeave: 'টাইমার চলছে। বের হলে টাইমার বন্ধ হবে। বের হবেন?',
      timerUntitled: 'নামহীন প্রজেক্ট',

      // ============ ROUTINE ============
      routineTitle: 'আমার রুটিন 🗓️',
      routineSubtitle: 'তোমার দৈনন্দিন সময়সূচি',
      addRoutineBtn: '+ নতুন রুটিন তৈরি করো',
      routineEmpty: 'এখনো কোনো রুটিন নেই।<br>উপরে ক্লিক করে নতুন রুটিন তৈরি করো!',
      routineNameLabel: 'রুটিনের নাম',
      routineNamePlaceholder: 'যেমন: আমার কলেজ রুটিন',
      routineDaysLabel: 'কোন কোন দিন?',
      routineSlotsLabel: 'টাইম স্লট (কলাম)',
      addSlotBtn: '+ নতুন কলাম যোগ করো',
      routineSaveBtn: 'সেভ করো',
      routineCancelBtn: 'বাতিল',
      slotTimePlaceholder: 'সময় (যেমন: ৯:৪৫)',
      routineNoDays: 'অন্তত একটি দিন সিলেক্ট করো!',
      routineNoSlots: 'অন্তত একটি টাইম স্লট দাও!',
      routineEditTitle: 'রুটিন এডিট করো',
      routineNameRequired: 'রুটিনের নাম লেখো!',
      routineGridView: 'সাবজেক্ট (প্রতিটি ঘরের জন্য)',
      routineSubject: 'বিষয়',
      routineSelectDaysFirst: 'আগে দিন সিলেক্ট করো',
      routineDaySun: 'রবি',
      routineDayMon: 'সোম',
      routineDayTue: 'মঙ্গল',
      routineDayWed: 'বুধ',
      routineDayThu: 'বৃহঃ',
      routineDayFri: 'শুক্র',
      routineDaySat: 'শনি',
      daySun: 'রবি',
      dayMon: 'সোম',
      dayTue: 'মঙ্গল',
      dayWed: 'বুধ',
      dayThu: 'বৃহঃ',
      dayFri: 'শুক্র',
      daySat: 'শনি',

      // ============ RECYCLE ============
      recycleTitle: 'রিসাইকেল বিন ♻️',
      recycleSubtitle: 'মুছে ফেলা জিনিসপত্র',
      recycleHeroTitle: 'মুছে ফেলা জিনিসপত্র',
      recycleHeroSub: 'ভুলে ডিলিট হয়ে গেলে এখান থেকে ফিরিয়ে আনতে পারো',
      recycleSearchPlaceholder: 'যেকোনো লেখা দিয়ে খুঁজুন...',
      recycleCatAll: 'সবগুলো',
      recycleCatDiary: '📖 দিনলিপি',
      recycleCatTodo: '📝 টুডু লিস্ট',
      recycleCatProject: '📁 প্রজেক্টস',
      recycleCatNote: '📝 নোট',
      recycleEmpty: 'রিসাইকেল বিন খালি!',
      recycleNoResults: 'কোনো মুছে ফেলা জিনিস পাওয়া যায়নি।',
      recycleDeletedAt: 'ডিলিট:',
      recycleRestore: '↩️ ফেরাও',
      recycleDelete: '✕ মুছো',
      recycleGroupDiary: '📖 দিনলিপি',
      recycleGroupTodo: '📝 টুডু লিস্ট',
      recycleGroupProject: '📁 প্রজেক্টস',
      recycleGroupNote: '📝 নোট',
      recycleConfirmPerm: 'এটি একদম মুছে ফেলতে চাও? আর ফেরত পাওয়া যাবে না!',
      recycleRestoreFailed: 'নোট ফেরানো যায়নি ❌',

      // ============ NOTE ============
      noteTitle: 'আমার নোট 📝',
      noteSubtitle: 'তোমার সব নোট এক জায়গায়',
      noteNewBtn: '+ নতুন নোট',
      noteTagBtn: '🏷️ ট্যাগ',
      noteSearchPlaceholder: 'নোট খুঁজুন...',
      noteTabAll: 'সব',
      noteTabPinned: '📌 পিন করা',
      noteTabText: '📄 টেক্সট',
      noteTabChecklist: '✅ চেকলিস্ট',
      noteTabLocked: '🔒 লক করা',
      noteEmpty: 'এখনো কোনো নোট নেই।<br>+ চেপে নতুন নোট তৈরি করো!',
      noteUntitled: 'নামহীন',
      noteLocked: 'লক করা নোট',
      noteEnterPin: 'পিন দাও:',
      noteWrongPin: 'ভুল পিন ❌',
      noteTagFilter: '🏷️ ট্যাগ দিয়ে ফিল্টার',
      noteTagAll: 'সব',
      noteTagNoTags: 'এখনো কোনো ট্যাগ নেই। আগে নোটে ট্যাগ যোগ করো।',
      noteCloseBtn: 'বন্ধ',

      // ============ NOTE EDITOR ============
      neTitlePlaceholder: 'শিরোনাম...',
      neContentPlaceholder: 'কিছু লিখো...',
      neListPlaceholder: 'লিস্ট আইটেম...',
      neAddItem: '+ আইটেম যোগ করো',
      neMenuTags: 'ট্যাগ যোগ করুন',
      neMenuImage: 'ছবি যোগ করুন',
      neMenuAudio: 'ভয়েস নোট',
      neMenuSwitchToText: 'টেক্সট মোডে পরিবর্তন',
      neMenuSwitchToChecklist: 'চেকলিস্ট মোডে পরিবর্তন',
      neMenuShare: 'শেয়ার করুন',
      neMenuDelete: 'ডিলিট করুন',
      neMenuClose: 'বন্ধ করুন',
      neTagTitle: '🏷️ ট্যাগ',
      neTagPlaceholder: 'নতুন ট্যাগ...',
      neTagDone: 'সম্পন্ন',
      neTagEmpty: 'এখনো কোনো ট্যাগ নেই',
      neVoiceTitle: '🎤 ভয়েস নোট',
      neVoiceSub: 'রেকর্ড করতে ট্যাপ করো (সর্বোচ্চ ৬০ সেকেন্ড)',
      neVoiceRecord: '🎤 রেকর্ড',
      neVoiceStop: '⏹ থামাও',
      neVoiceRecording: 'রেকর্ডিং...',
      neVoiceCancel: 'বাতিল',
      neVoiceDenied: 'মাইক্রোফোন অনুমতি পাওয়া যায়নি',
      neVoiceUnsupported: 'তোমার ব্রাউজার রেকর্ডিং সাপোর্ট করে না',
      neDeleteConfirm: 'রিসাইকেল বিনে পাঠাতে চাও?',
      neUntitledNote: 'নামহীন নোট',
      neShareCopied: 'ক্লিপবোর্ডে কপি হয়েছে ✅',
      neNoteTitle: 'নোট',
      neLockSetPin: 'এই নোটের জন্য পিন সেট করো (৪+ অক্ষর):',
      neLockEnterPin: 'আনলক করতে বর্তমান পিন দাও:',
      neLockWrongPin: 'ভুল পিন ❌',

      // ============ MUSIC ============
      musicTitle: 'আমার মিউজিক 🎵',
      musicSubtitle: 'তোমার পছন্দের গান',
      musicAddBtn: '+ যোগ করো',
      musicShuffleBtn: '🔀 শাফল',
      musicSelectBtn: '☑️ সিলেক্ট',
      musicSortNewest: 'সর্বশেষ যুক্ত',
      musicSortName: 'নাম (A-Z)',
      musicSortSize: 'সাইজ অনুযায়ী',
      musicSortFav: 'পছন্দের গান',
      musicNowPlaying: 'এখন বাজছে',
      musicSearchPlaceholder: 'গান খুঁজুন...',
      musicNoSong: 'কোনো গান পাওয়া যায়নি',
      musicNoSongPlaying: 'কোনো গান বাজছে না',
      musicSelected: 'টি নির্বাচিত',
      musicSelectAll: 'সবগুলো',
      musicDeleteSelected: '🗑️ মুছে ফেলো',
      musicAddTitle: '🎵 নতুন গান যোগ করো',
      musicChooseFile: '📁 ফাইল বেছে নিন',
      musicCancel: 'বাতিল',
      musicAdd: 'যোগ করো',
      musicConfirmDelete: 'টি গান ডিলিট করতে চাও?',
      musicDuplicate: 'টি গান আগে থেকেই আছে, সেগুলো বাদ দেওয়া হয়েছে।',
      musicAdded: 'টি নতুন গান যোগ করা হয়েছে।',
      musicWidgetTitle: '🎵 মিউজিক প্লেয়ার',

      // ============ SETTINGS ============
      settingsTitle: 'সেটিংস ⚙️',
      settingsSubtitle: 'অ্যাপের নিয়ন্ত্রণ',
      settingsLock: '🔒 পাসওয়ার্ড লক',
      settingsLockStatusOn: 'চালু আছে ✅',
      settingsLockStatusOff: 'বন্ধ আছে',
      settingsTheme: '🎨 অ্যাপের থিম',
      settingsThemeDesc: 'তোমার পছন্দের থিম বেছে নাও',
      settingsLang: '🌐 অ্যাপের ভাষা',
      settingsLangDesc: 'অ্যাপটি কোন ভাষায় দেখতে চাও?',
      settingsProfile: '👤 প্রোফাইল ও ব্যক্তিগতকরণ',
      settingsProfileDesc: 'নাম, অ্যাভাটার ও ভাষা সেট করো',
      settingsData: '📦 ডেটা',
      settingsExport: '⬇️ ব্যাকআপ ডাউনলোড (Save)',
      settingsImport: '⬆️ ব্যাকআপ আপলোড (Restore)',
      settingsClear: '🗑️ সব এন্ট্রি মুছে ফেলো',
      settingsAbout: 'ℹ️ অ্যাপ সম্পর্কে',
      settingsAboutDesc: 'আমার দিনলিপি 🌸 — সংস্করণ ১.০<br>তোমার সব লেখা সম্পূর্ণ অফলাইনে এই ফোনেই সুরক্ষিত থাকে।',
      settingsFooter: '🌸 ভালো থাকো',
      settingsPasswordBtn: 'পাসওয়ার্ড',
      settingsPatternBtn: 'প্যাটার্ন',
      settingsNewPasswordPlaceholder: 'নতুন পাসওয়ার্ড (শব্দ, বাক্য বা সংখ্যা)',
      settingsConfirmPasswordPlaceholder: 'আবার লিখো',
      settingsSavePasswordBtn: 'পাসওয়ার্ড সেভ করো 🔐',
      settingsDrawPattern: 'নিচে প্যাটার্ন আঁকো:',
      settingsPatternReset: 'রিসেট',
      settingsSavePatternBtn: 'প্যাটার্ন সেভ করো 🔐',
      settingsSecurityQuestion: '🔑 পাসওয়ার্ড ভুলে গেলে উদ্ধারের জন্য (ঐচ্ছিক কিন্তু সুপারিশকৃত)',
      settingsSelectQuestion: 'একটি প্রশ্ন বেছে নিন...',
      settingsAnswerPlaceholder: 'উত্তর লিখো (যেকোনো শব্দ বা বাক্য)',
      settingsChangePasswordBtn: '🔑 পাসওয়ার্ড বা প্যাটার্ন বদলাও',
      settingsChangeLangConfirm: 'ভাষা পরিবর্তন করলে পেজ রিলোড হবে। চালিয়ে যাবেন?',

      // Security questions
      sqFavColor: 'তোমার প্রিয় রঙ কী?',
      sqFirstSchool: 'তোমার প্রথম স্কুলের নাম কী?',
      sqFavTeacher: 'তোমার প্রিয় শিক্ষকের নাম কী?',
      sqChildhoodFriend: 'তোমার শৈশবের প্রিয় বন্ধুর নাম কী?',
      sqFavFood: 'তোমার প্রিয় খাবারের নাম কী?',
      sqPetName: 'তোমার পোষা প্রাণীর নাম কী?',

      // Settings alerts
      settingsPasswordEmpty: 'পাসওয়ার্ড খালি রাখা যাবে না',
      settingsPasswordMismatch: 'দুইটা পাসওয়ার্ড মিলছে না',
      settingsAnswerRequired: 'নিরাপত্তা প্রশ্নের উত্তর লিখো!',
      settingsPasswordSet: 'পাসওয়ার্ড সেট হয়েছে 🔐',
      settingsPatternSet: 'প্যাটার্ন সেট হয়েছে 🔐',
      settingsPasswordDisabled: 'পাসওয়ার্ড লক বন্ধ হয়েছে ✅',
      settingsDrawPatternFirst: 'আগে প্যাটার্ন আঁকো!',
      settingsAllDataDeleted: 'সব ডেটা মুছে ফেলা হয়েছে!',
      settingsDeleteDbFailed: 'নোট ডেটাবেস মুছতে সমস্যা হয়েছে!',
      settingsConfirmDeleteAll: 'আপনি কি নিশ্চিত? এটি তোমার সব এন্ট্রি, টুডু, প্রজেক্ট, রুটিন, নোট এবং সেটিংস স্থায়ীভাবে মুছে ফেলবে!',
      settingsBackupRestored: 'সফলভাবে রিস্টোর হয়েছে ✅',
      settingsBackupFailed: 'ফাইল সঠিক নয় ❌',
      settingsConfirmRestore: 'বর্তমান সব ডেটা মুছে ব্যাকআপ রিস্টোর করবেন?',

      // Verify modal
      verifyTitle: 'বর্তমান লক কনফার্ম করো 🔐',
      verifySub: 'চলিয়ে যেতে পাসওয়ার্ড বা প্যাটার্ন দাও',
      verifyPinTab: 'পাসওয়ার্ড',
      verifyPatternTab: 'প্যাটার্ন',
      verifyPinPlaceholder: 'বর্তমান পাসওয়ার্ড দাও',
      verifyConfirm: 'কনফার্ম',
      verifyWrongPassword: 'ভুল পাসওয়ার্ড ❌',
      verifyCancel: 'বাতিল',

      // ============ PROFILE ============
      profileTitle: 'আমার প্রোফাইল 👤',
      profileSubtitle: 'নিজেকে personalize করো',
      profileStreak: '🔥 স্ট্রিক',
      profileBest: '🏆 সর্বোচ্চ',
      profileTotal: '📖 মোট',
      profileInfoTitle: '📝 ব্যক্তিগত তথ্য',
      profileName: 'তোমার নাম',
      profileNamePlaceholder: 'যেমন: রাফি',
      profileNickname: 'ডাকনাম (ঐচ্ছিক)',
      profileNicknamePlaceholder: 'যেমন: মিম',
      profileBirthday: 'জন্মদিন (ঐচ্ছিক)',
      profileAvatarTitle: '🎭 অ্যাভাটার ইমোজি',
      profileAvatarDesc: 'ছবি না দিলে এই ইমোজিগুলোর একটি বেছে নাও',
      profileSaveBtn: 'সেভ করো ✨',
      profileFooter: '🌸 সব তথ্য শুধু তোমার ফোনেই থাকে',
      profileSaved: 'প্রোফাইল সেভ হয়েছে ✅',

      // ============ ABOUT ============
      aboutTitle: 'অ্যাপ সম্পর্কে',
      aboutAppName: 'ডায়েরি',
      aboutTagline: 'প্রতিদিনের ছোট ছোট গল্প',
      aboutVersion: 'সংস্করণ ১.০.০',
      aboutStoryTitle: '📖 অ্যাপের গল্প',
      aboutStoryText: `প্রতিদিন ছোট ছোট অনেক কিছু ঘটে — একটা ভাবনা, একটা অনুভূতি, একটা কাজ, একটা গান।
এর বেশিরভাগই হারিয়ে যায়। এই অ্যাপটা আমার সেই মুহূর্তগুলো ধরে রাখার উপায়।

আমি "ডায়েরি" বানিয়েছি কারণ আমি নিজের জন্য একটা সহজ, ব্যক্তিগত জায়গা চেয়েছিলাম। কোনো অ্যাকাউন্ট নেই, বিজ্ঞাপন নেই, ট্র্যাকিং নেই। শুধু লেখা, পরিকল্পনা আর মনে রাখার একটা শান্ত জায়গা।

সবকিছু তোমার ফোনেই থাকে। তোমার কথা শুধু তোমারই।`,
      aboutFeaturesTitle: '✨ ফিচার',
      aboutPrivacyTitle: '🔒 তোমার গোপনীয়তা',
      aboutTechTitle: '🛠️ টেকনোলজি',
      aboutTeamTitle: '👥 আমাদের টিম',
      aboutRoleDeveloper: 'ডেভেলপার ও ডিজাইনার',
      aboutRoleAI: 'AI ডেভেলপমেন্ট অ্যাসিস্ট্যান্ট',
      aboutHistoryTitle: '📜 সংস্করণ ইতিহাস',
      aboutBtnFeedback: '💬 ফিডব্যাক দাও',
      aboutBtnFaq: '❓ সাহায্য / FAQ',
      aboutFooterCopyright: '© ২০২৬ ডায়েরি',
      aboutFooterMadeWith: 'তৈরি হয়েছে ভালোবাসা দিয়ে',

      // About features
      aboutFeatDiary: 'ডায়েরি',
      aboutFeatCalendar: 'ক্যালেন্ডার',
      aboutFeatTodo: 'টুডু লিস্ট',
      aboutFeatPomodoro: 'পোমোডোরো',
      aboutFeatMood: 'মুড ট্র্যাকার',
      aboutFeatNotes: 'নোট',
      aboutFeatMusic: 'মিউজিক',
      aboutFeatRoutine: 'রুটিন',
      aboutFeatLock: 'লক',

      // About privacy list
      aboutPrivacy1: 'সব ডেটা তোমার ফোনে সংরক্ষিত',
      aboutPrivacy2: 'কোনো সার্ভারে পাঠানো হয় না',
      aboutPrivacy3: 'কোনো ট্র্যাকিং বা অ্যানালিটিক্স নেই',
      aboutPrivacy4: 'কোনো বিজ্ঞাপন নেই',
      aboutPrivacy5: 'সম্পূর্ণ অফলাইনে কাজ করে',

      // About versions
      aboutVersionBadge: 'বর্তমান',
      aboutVersionNotes: 'প্রথম রিলিজ। সব মূল ফিচার সহ — ডায়েরি, নোট, মিউজিক প্লেয়ার, পোমোডোরো টাইমার এবং PWA সাপোর্ট।',

      // ============ FEEDBACK ============
      fbTitle: 'ফিডব্যাক ও রেটিং',
      fbHeroTitle: 'তোমার মতামত জানাও',
      fbHeroSub: 'তোমার ফিডব্যাক আমাদের আরও ভালো করতে সাহায্য করে',
      fbRatingTitle: '⭐ অ্যাপটাকে রেটিং দাও',
      fbDetailTitle: '📊 বিস্তারিত রেটিং',
      fbOptional: '(ঐচ্ছিক)',
      fbMessageTitle: '💬 তোমার বার্তা',
      fbTypeLabel: 'ধরন:',
      fbSubmitText: 'ইমেইলে পাঠাও',
      fbOrText: 'অথবা',
      fbFaqText: 'সাহায্য / FAQ',
      fbHomeText: 'হোমে ফিরে যাও',
      fbFooterText: 'তোমার মতামত আমাদের কাছে মূল্যবান 🌸',

      fbRatingEmpty: 'রেটিং দিতে তারা চাপো',
      fbRating1: 'খারাপ 😞',
      fbRating2: 'মাঝারি 😕',
      fbRating3: 'ভালো 🙂',
      fbRating4: 'খুব ভালো 😊',
      fbRating5: 'দারুণ! 🤩',

      fbCatDesign: 'ডিজাইন',
      fbCatPerformance: 'পারফরম্যান্স',
      fbCatUsability: 'ব্যবহারযোগ্যতা',
      fbCatFeatures: 'ফিচার',

      fbTypePraise: '😊 প্রশংসা',
      fbTypeIssue: '😔 সমস্যা',
      fbTypeFeature: '💡 ফিচার রিকোয়েস্ট',
      fbTypeOther: '💬 অন্যান্য',

      fbNamePlaceholder: 'তোমার নাম (ঐচ্ছিক)',
      fbMessagePlaceholder: 'তোমার মতামত, সমস্যা বা পরামর্শ লিখো...',

      fbNoMessage: 'আগে বার্তা লিখো!',
      fbEmailOpening: 'তোমার ইমেইল অ্যাপ খুলছে...\n\n"পাঠান" চাপো সম্পন্ন করতে।',
      fbEmailError: 'ইমেইল অ্যাপ খোলা যায়নি। সরাসরি ইমেইল করো: ',

      // ============ FAQ ============
      faqTitle: 'সাহায্য / FAQ ❓',
      faqSubtitle: 'প্রশ্ন-উত্তর ও গাইড',
      faqHeroTitle: 'তোমার কী জানা দরকার?',
      faqHeroSub: 'অ্যাপটি ব্যবহারের নিয়মাবলী সম্পর্কে এখানে বিস্তারিত পাবেন',
      faqSearchPlaceholder: 'যেকোনো প্রশ্ন বা শব্দ দিয়ে খুঁজুন...',
      faqNoResults: 'দুঃখিত, তোমার খোঁজা প্রশ্নটি পাওয়া যায়নি।',

      // ============ LOCK ============
      lockAppLocked: 'অ্যাপ লক করা আছে',
      lockEnterPassword: 'খুলতে পাসওয়ার্ড দাও',
      lockPassword: 'পাসওয়ার্ড',
      lockPattern: 'প্যাটার্ন',
      lockEnterPasswordPlaceholder: 'পাসওয়ার্ড লিখো...',
      lockUnlockBtn: 'আনলক করো',
      lockForgot: 'পাসওয়ার্ড ভুলে গেছি?',
      lockWrongPassword: 'ভুল পাসওয়ার্ড ❌',
      lockPleaseEnterPassword: 'পাসওয়ার্ড লিখো',
      lockWrongPattern: 'ভুল প্যাটার্ন ❌',
      lockNoRecovery: 'কোনো রিকভারি প্রশ্ন সেট করা নেই! তুমি পাসওয়ার্ড উদ্ধার করতে পারবে না। অনুগ্রহ করে মনে করার চেষ্টা করো।',
      lockRecoveryTitle: '🔑 পাসওয়ার্ড উদ্ধার',
      lockYourAnswer: 'তোমার উত্তর...',
      lockVerifyBtn: 'যাচাই করো',
      lockCancelBtn: 'বাতিল',
      lockWrongAnswer: 'ভুল উত্তর ❌',
      lockResetTitle: '🔐 নতুন লক সেট করো',
      lockResetDesc: 'নতুন কোন ধরনের লক সেট করতে চাও?',
      lockResetPasswordBtn: 'পাসওয়ার্ড',
      lockResetPatternBtn: 'প্যাটার্ন',
      lockResetCancel: 'বাতিল',
      lockNewPasswordTitle: '🔐 নতুন পাসওয়ার্ড সেট করো',
      lockNewPasswordPlaceholder: 'নতুন পাসওয়ার্ড',
      lockConfirmPasswordPlaceholder: 'আবার লিখো',
      lockResetSave: 'সেভ করো',
      lockPasswordEmpty: 'পাসওয়ার্ড খালি রাখা যাবে না',
      lockPasswordMismatch: 'দুইটা পাসওয়ার্ড মিলছে না',
      lockPasswordResetOk: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে! দয়া করে লগইন করো।',
      lockNewPatternTitle: '🔐 নতুন প্যাটার্ন আঁকো',
      lockPatternMin3: 'কমপক্ষে ৩টি ডট কানেক্ট করো',
      lockPatternValid: 'দয়া করে একটি সঠিক প্যাটার্ন আঁকো!',
      lockPatternResetOk: 'প্যাটার্ন সফলভাবে রিসেট হয়েছে! দয়া করে লগইন করো।',

      // ============ BIRTHDAY ============
      birthdayTitle: 'শুভ জন্মদিন',
      birthdaySub: 'আজকের দিনটা তোমার 🌸',
      birthdayFriend: 'বন্ধু',

      // ============ COMMON EMPTY/CONFIRM ============
      confirmDelete: 'মুছে ফেলতে চাও?',
      confirmDeleteEntry: 'এই এন্ট্রিটা রিসাইকেল বিনে পাঠাতে চাও?',
      confirmDeleteTask: 'কাজটি রিসাইকেল বিনে পাঠাতে চাও?',
      confirmDeleteAllTasks: 'সব টুডু রিসাইকেল বিনে পাঠাতে চাও?',
      confirmDeleteAllTasks2: 'একদম নিশ্চিত?',
      allTasksMoved: 'সব টুডু রিসাইকেল বিনে পাঠানো হয়েছে ✅',
      confirmDeleteProject: 'প্রজেক্টটি রিসাইকেল বিনে পাঠাতে চাও?',
      confirmDeleteRoutine: 'রুটিনটি মুছে ফেলতে চাও?',

      // ============ VALIDATION ============
      pleaseWriteSomething: 'আগে কিছু লেখো 🙂',
      pleaseEnterTaskName: 'কাজের নাম লেখো!',
      pleaseSelectDate: 'তারিখ সিলেক্ট করো!',
      pleaseEnterRoutineName: 'রুটিনের নাম লেখো!'
    },

    en: {
      // ============ GREETING ============
      greeting: {
        morning: 'Good Morning 🌷',
        noon: 'Good Afternoon ☀️',
        afternoon: 'Good Evening 🌸',
        night: 'Good Night 🌙'
      },

      // ============ HOME ============
      homeTitle: (name) => name ? `Hello ${name}, what do you want to do?` : 'What do you want to do today?',
      splashTitle: 'My Diary',
      splashSub: 'Little stories every day',
      homeFooter: '🌸 Stay well, take care',

      // ============ COMMON BUTTONS ============
      saveBtn: 'Save ✨',
      updateBtn: 'Update ✅',
      cancelBtn: 'Cancel',
      deleteBtn: 'Delete',
      editBtn: 'Edit',
      closeBtn: 'Close',
      yesBtn: 'Yes',
      noBtn: 'No',
      okBtn: 'OK',
      backBtn: 'Go back',

      // ============ MENU ============
      menuDiary: 'Diary',
      menuDiaryDesc: 'Write down your day',
      menuCalendar: 'Calendar',
      menuCalendarDesc: 'View by date',
      menuTodo: 'Todo List',
      menuTodoDesc: 'Daily task list',
      menuPomodoro: 'Pomodoro',
      menuPomodoroDesc: 'Projects & focus',
      menuMood: 'Mood Tracker',
      menuMoodDesc: 'Track your feelings',
      menuSettings: 'Settings',
      menuSettingsDesc: 'Control & backup',
      menuRecycle: 'Recycle Bin',
      menuRecycleDesc: 'Deleted items',
      menuRoutine: 'Routine',
      menuRoutineDesc: 'Class or work schedule',
      menuNote: 'Notes',
      menuNoteDesc: 'Write down anything',
      menuMusic: 'Music',
      menuMusicDesc: 'Your favorite songs',
      menuFaq: 'Help / FAQ',
      menuFaqDesc: 'Q&A and guide',
      menuAbout: 'About',
      menuAboutDesc: 'Developers & info',
      menuFeedback: 'Feedback & Rating',
      menuFeedbackDesc: 'Share your thoughts',

      // ============ DIARY ============
      diaryTitle: 'Diary 📖',
      diaryPlaceholder: (name) => name ? `What did you do today, ${name}?` : 'What did you do today? Write it down...',
      emptyDiary: 'No entries yet 🌷<br>Write your first thought!',
      oldDaysTitle: '📖 Old Days',
      diarySearchPlaceholder: '🔍 Search diary...',

      // ============ CALENDAR ============
      calendarTitle: 'Calendar 📅',
      calSubtitle: 'Tap on a day to view',
      calEntriesTitle: '📖 Entries of this day',
      emptyCal: 'No entries on this day.',

      // ============ TODO ============
      todoTitle: 'Todo List 📝',
      todoSubtitle: 'Upcoming task list',
      todoPlaceholder: 'Add a new task...',
      emptyTodo: 'No tasks added yet ☕<br>Write down your plans!',
      todoListTitle: '📌 Your Task List',
      todoClearAll: '🗑️ Clear All',
      todoTodayTasks: '🔥 Today\'s Tasks:',

      // ============ MOOD ============
      moodTitle: 'Mood Tracker 💭',
      moodSubtitle: 'Your mood summary',
      moodSummaryTitle: 'Predominant Mood this month',
      moodStatsTitle: '📊 Mood Statistics',
      moodDaysTitle: '📅 Day by Day',
      moodNoEntries: 'No moods given this month',
      moodNoMoods: 'No moods given this month yet.',
      moodNothingYet: 'Nothing here this month yet.',
      moodAppeared: (n) => `Appeared ${n} times`,

      // ============ POMODORO ============
      pomoTitle: 'My Projects 📁',
      pomoSubtitle: 'Set your timer',
      pomoAddBtn: '+ Create New Project',
      pomoEmpty: 'No projects yet.<br>Click above to create your first project!',
      pomoModalNew: 'New Project',
      pomoModalEdit: 'Edit Project',
      pomoNameLabel: 'Project Name (optional)',
      pomoNamePlaceholder: 'e.g. Study, Work...',
      pomoColorLabel: 'Select Color',
      pomoFocusLabel: 'Focus (HH : MM : SS)',
      pomoFocusPlaceholder: 'Set time',
      pomoShortLabel: 'Short Break (optional)',
      pomoShortPlaceholder: 'Leave empty for no break',
      pomoRoundsLabel: 'How many rounds?',
      pomoRoundsPlaceholder: 'Set number',
      pomoDurationLabel: 'Total Duration (auto)',
      pomoDurationPlaceholder: 'Set focus & rounds',
      pomoHintShort: '💡 If no break, next focus starts directly.',
      pomoNoBreak: 'No break',
      pomoBreak: 'Break',
      pomoDuration: 'Duration',
      pomoUntitled: 'Untitled Project',
      pomoPickerTitle: 'Select Time',
      pomoPickerRounds: 'Select Rounds',
      pomoHour: 'Hour',
      pomoMinute: 'Minute',
      pomoSecond: 'Second',
      pomoNumber: 'Number',
      pomoSetBtn: 'Set',
      pomoValidationNoFocus: 'Set a valid focus time!',
      pomoValidationNoRounds: 'Set a valid round count!',
      pomoValidationNoDuration: 'Could not calculate duration!',

      // ============ TIMER ============
      timerTitle: 'Timer ⏳',
      timerFocus: '🎯 Focus',
      timerBreak: '☕ Short Break',
      timerRounds: 'Rounds',
      timerTotalTime: 'Total Time',
      timerFocusMin: 'Focus Min',
      timerNoProject: 'No project selected.',
      timerBackToProjects: 'Back to project list',
      timerReset: 'Reset',
      timerStart: 'Start',
      timerPause: 'Pause',
      timerSkip: 'Skip',
      timerComplete: '✅ Complete!',
      timerAllDone: '🎉 All rounds complete!',
      timerFocusDone: '✅ Focus done! Break started ☕',
      timerFocusDoneNoBreak: '✅ Focus done! Next focus starting 🎯',
      timerBreakOver: '☕ Break over! Focus starting 🎯',
      timerResetDone: '⟲ Reset done',
      timerConfirmReset: 'Reset the timer?',
      timerConfirmLeave: 'Timer is running. Leaving will stop it. Leave?',
      timerUntitled: 'Untitled Project',

      // ============ ROUTINE ============
      routineTitle: 'My Routine 🗓️',
      routineSubtitle: 'Your daily schedule',
      addRoutineBtn: '+ Create New Routine',
      routineEmpty: 'No routines yet.<br>Click above to create one!',
      routineNameLabel: 'Routine Name',
      routineNamePlaceholder: 'e.g., My College Routine',
      routineDaysLabel: 'Which days?',
      routineSlotsLabel: 'Time Slots (Columns)',
      addSlotBtn: '+ Add New Column',
      routineSaveBtn: 'Save',
      routineCancelBtn: 'Cancel',
      slotTimePlaceholder: 'Time (e.g., 9:45)',
      routineNoDays: 'Select at least one day!',
      routineNoSlots: 'Add at least one time slot!',
      routineEditTitle: 'Edit Routine',
      routineNameRequired: 'Enter a routine name!',
      routineGridView: 'Subjects (For each cell)',
      routineSubject: 'Subject',
      routineSelectDaysFirst: 'Select days first',
      routineDaySun: 'Sun',
      routineDayMon: 'Mon',
      routineDayTue: 'Tue',
      routineDayWed: 'Wed',
      routineDayThu: 'Thu',
      routineDayFri: 'Fri',
      routineDaySat: 'Sat',
      daySun: 'Sun',
      dayMon: 'Mon',
      dayTue: 'Tue',
      dayWed: 'Wed',
      dayThu: 'Thu',
      dayFri: 'Fri',
      daySat: 'Sat',

      // ============ RECYCLE ============
      recycleTitle: 'Recycle Bin ♻️',
      recycleSubtitle: 'Deleted items',
      recycleHeroTitle: 'Deleted Items',
      recycleHeroSub: 'Accidentally deleted? You can restore them from here.',
      recycleSearchPlaceholder: 'Search by text...',
      recycleCatAll: 'All',
      recycleCatDiary: '📖 Diary',
      recycleCatTodo: '📝 Todo List',
      recycleCatProject: '📁 Projects',
      recycleCatNote: '📝 Notes',
      recycleEmpty: 'Recycle bin is empty!',
      recycleNoResults: 'No deleted items found.',
      recycleDeletedAt: 'Deleted:',
      recycleRestore: '↩️ Restore',
      recycleDelete: '✕ Delete',
      recycleGroupDiary: '📖 Diary',
      recycleGroupTodo: '📝 Todo List',
      recycleGroupProject: '📁 Projects',
      recycleGroupNote: '📝 Notes',
      recycleConfirmPerm: 'Do you really want to delete this permanently? It cannot be recovered!',
      recycleRestoreFailed: 'Failed to restore note ❌',

      // ============ NOTE ============
      noteTitle: 'My Notes 📝',
      noteSubtitle: 'All your notes in one place',
      noteNewBtn: '+ New Note',
      noteTagBtn: '🏷️ Tags',
      noteSearchPlaceholder: 'Search notes...',
      noteTabAll: 'All',
      noteTabPinned: '📌 Pinned',
      noteTabText: '📄 Text',
      noteTabChecklist: '✅ Checklist',
      noteTabLocked: '🔒 Locked',
      noteEmpty: 'No notes yet.<br>Tap + to create one!',
      noteUntitled: 'Untitled',
      noteLocked: 'Locked note',
      noteEnterPin: 'Enter PIN:',
      noteWrongPin: 'Wrong PIN ❌',
      noteTagFilter: '🏷️ Filter by Tag',
      noteTagAll: 'All',
      noteTagNoTags: 'No tags yet. Add tags to your notes first.',
      noteCloseBtn: 'Close',

      // ============ NOTE EDITOR ============
      neTitlePlaceholder: 'Title...',
      neContentPlaceholder: 'Write something...',
      neListPlaceholder: 'List item...',
      neAddItem: '+ Add item',
      neMenuTags: 'Tags',
      neMenuImage: 'Add Image',
      neMenuAudio: 'Voice Note',
      neMenuSwitchToText: 'Switch to Text',
      neMenuSwitchToChecklist: 'Switch to Checklist',
      neMenuShare: 'Share',
      neMenuDelete: 'Delete',
      neMenuClose: 'Close',
      neTagTitle: '🏷️ Tags',
      neTagPlaceholder: 'New tag...',
      neTagDone: 'Done',
      neTagEmpty: 'No tags yet',
      neVoiceTitle: '🎤 Voice Note',
      neVoiceSub: 'Tap to record (max 60s)',
      neVoiceRecord: '🎤 Record',
      neVoiceStop: '⏹ Stop',
      neVoiceRecording: 'Recording...',
      neVoiceCancel: 'Cancel',
      neVoiceDenied: 'Microphone permission denied',
      neVoiceUnsupported: 'Your browser does not support recording',
      neDeleteConfirm: 'Move to recycle bin?',
      neUntitledNote: 'Untitled note',
      neShareCopied: 'Copied to clipboard ✅',
      neNoteTitle: 'Note',
      neLockSetPin: 'Set a PIN for this note (4+ chars):',
      neLockEnterPin: 'Enter current PIN to unlock:',
      neLockWrongPin: 'Wrong PIN ❌',

      // ============ MUSIC ============
      musicTitle: 'My Music 🎵',
      musicSubtitle: 'Your favorite songs',
      musicAddBtn: '+ Add',
      musicShuffleBtn: '🔀 Shuffle',
      musicSelectBtn: '☑️ Select',
      musicSortNewest: 'Newest first',
      musicSortName: 'Name (A-Z)',
      musicSortSize: 'By size',
      musicSortFav: 'Favorites',
      musicNowPlaying: 'Now Playing',
      musicSearchPlaceholder: 'Search songs...',
      musicNoSong: 'No songs found',
      musicNoSongPlaying: 'No song playing',
      musicSelected: 'selected',
      musicSelectAll: 'Select All',
      musicDeleteSelected: '🗑️ Delete',
      musicAddTitle: '🎵 Add New Song',
      musicChooseFile: '📁 Choose File',
      musicCancel: 'Cancel',
      musicAdd: 'Add',
      musicConfirmDelete: 'song(s) to delete?',
      musicDuplicate: 'song(s) already exist, skipped.',
      musicAdded: 'new song(s) added.',
      musicWidgetTitle: '🎵 Music Player',

      // ============ SETTINGS ============
      settingsTitle: 'Settings ⚙️',
      settingsSubtitle: 'App Controls',
      settingsLock: '🔒 Password Lock',
      settingsLockStatusOn: 'Enabled ✅',
      settingsLockStatusOff: 'Disabled',
      settingsTheme: '🎨 App Theme',
      settingsThemeDesc: 'Choose your preferred theme',
      settingsLang: '🌐 App Language',
      settingsLangDesc: 'Which language do you prefer?',
      settingsProfile: '👤 Profile & Personalization',
      settingsProfileDesc: 'Set name, avatar & language',
      settingsData: '📦 Data',
      settingsExport: '⬇️ Download Backup (Save)',
      settingsImport: '⬆️ Upload Backup (Restore)',
      settingsClear: '🗑️ Delete all entries',
      settingsAbout: 'ℹ️ About App',
      settingsAboutDesc: 'My Diary 🌸 — Version 1.0<br>All your writing stays on this phone, completely offline.',
      settingsFooter: '🌸 Stay well',
      settingsPasswordBtn: 'Password',
      settingsPatternBtn: 'Pattern',
      settingsNewPasswordPlaceholder: 'New Password (word, sentence or number)',
      settingsConfirmPasswordPlaceholder: 'Confirm Password',
      settingsSavePasswordBtn: 'Save Password 🔐',
      settingsDrawPattern: 'Draw pattern below:',
      settingsPatternReset: 'Reset',
      settingsSavePatternBtn: 'Save Pattern 🔐',
      settingsSecurityQuestion: '🔑 For password recovery (optional but recommended)',
      settingsSelectQuestion: 'Choose a question...',
      settingsAnswerPlaceholder: 'Enter answer (any word or phrase)',
      settingsChangePasswordBtn: '🔑 Change Password or Pattern',
      settingsChangeLangConfirm: 'Changing language will reload the page. Continue?',

      // Security questions
      sqFavColor: 'What is your favorite color?',
      sqFirstSchool: 'What is the name of your first school?',
      sqFavTeacher: 'What is your favorite teacher\'s name?',
      sqChildhoodFriend: 'What is your childhood best friend\'s name?',
      sqFavFood: 'What is your favorite food?',
      sqPetName: 'What is your pet\'s name?',

      // Settings alerts
      settingsPasswordEmpty: 'Password cannot be empty',
      settingsPasswordMismatch: 'Passwords do not match',
      settingsAnswerRequired: 'Please enter an answer for the security question!',
      settingsPasswordSet: 'Password set successfully 🔐',
      settingsPatternSet: 'Pattern set successfully 🔐',
      settingsPasswordDisabled: 'Password lock disabled ✅',
      settingsDrawPatternFirst: 'Please draw a pattern first!',
      settingsAllDataDeleted: 'All data deleted!',
      settingsDeleteDbFailed: 'Failed to delete notes DB!',
      settingsConfirmDeleteAll: 'Are you sure? This will delete ALL entries, todos, projects, routines, notes, and settings permanently!',
      settingsBackupRestored: 'Restored successfully ✅',
      settingsBackupFailed: 'Invalid file ❌',
      settingsConfirmRestore: 'Replace current data with backup?',

      // Verify modal
      verifyTitle: 'Confirm Current Lock 🔐',
      verifySub: 'Enter password or pattern to continue',
      verifyPinTab: 'Password',
      verifyPatternTab: 'Pattern',
      verifyPinPlaceholder: 'Enter current password',
      verifyConfirm: 'Confirm',
      verifyWrongPassword: 'Wrong password ❌',
      verifyCancel: 'Cancel',

      // ============ PROFILE ============
      profileTitle: 'My Profile 👤',
      profileSubtitle: 'Personalize yourself',
      profileStreak: '🔥 Streak',
      profileBest: '🏆 Best',
      profileTotal: '📖 Total',
      profileInfoTitle: '📝 Personal Info',
      profileName: 'Your Name',
      profileNamePlaceholder: 'e.g. Rafi',
      profileNickname: 'Nickname (optional)',
      profileNicknamePlaceholder: 'e.g. Mim',
      profileBirthday: 'Birthday (optional)',
      profileAvatarTitle: '🎭 Avatar Emoji',
      profileAvatarDesc: 'Choose one of these emojis if you do not provide a photo',
      profileSaveBtn: 'Save ✨',
      profileFooter: '🌸 All data stays only on your phone',
      profileSaved: 'Profile saved ✅',

      // ============ ABOUT ============
      aboutTitle: 'About App',
      aboutAppName: 'Diary',
      aboutTagline: 'Little stories every day',
      aboutVersion: 'Version 1.0.0',
      aboutStoryTitle: '📖 Our Story',
      aboutStoryText: `Every day brings small moments — a thought, a feeling, a task, a song.
Most of them fade away. This app is my way of holding on to them.

I built "Diary" because I wanted a simple, private space for myself. No accounts, no ads, no tracking. Just a quiet place to write, plan, and remember.

Everything stays on your phone. Your words are yours.`,
      aboutFeaturesTitle: '✨ Features',
      aboutPrivacyTitle: '🔒 Your Privacy',
      aboutTechTitle: '🛠️ Technology',
      aboutTeamTitle: '👥 Our Team',
      aboutRoleDeveloper: 'Developer & Designer',
      aboutRoleAI: 'AI Development Assistant',
      aboutHistoryTitle: '📜 Version History',
      aboutBtnFeedback: '💬 Give Feedback',
      aboutBtnFaq: '❓ Help / FAQ',
      aboutFooterCopyright: '© 2026 Diary',
      aboutFooterMadeWith: 'Made with love',

      // About features
      aboutFeatDiary: 'Diary',
      aboutFeatCalendar: 'Calendar',
      aboutFeatTodo: 'Todo List',
      aboutFeatPomodoro: 'Pomodoro',
      aboutFeatMood: 'Mood Tracker',
      aboutFeatNotes: 'Notes',
      aboutFeatMusic: 'Music',
      aboutFeatRoutine: 'Routine',
      aboutFeatLock: 'Lock',

      // About privacy list
      aboutPrivacy1: 'All data stays on your phone',
      aboutPrivacy2: 'Nothing is sent to any server',
      aboutPrivacy3: 'No tracking, no analytics',
      aboutPrivacy4: 'No ads, ever',
      aboutPrivacy5: 'Works completely offline',

      // About versions
      aboutVersionBadge: 'Current',
      aboutVersionNotes: 'First release. All core features including diary, notes, music player, pomodoro timer, and PWA support.',

      // ============ FEEDBACK ============
      fbTitle: 'Feedback & Rating',
      fbHeroTitle: 'Share Your Thoughts',
      fbHeroSub: 'Your feedback helps us improve',
      fbRatingTitle: '⭐ Rate the App',
      fbDetailTitle: '📊 Detailed Rating',
      fbOptional: '(optional)',
      fbMessageTitle: '💬 Your Message',
      fbTypeLabel: 'Type:',
      fbSubmitText: 'Send via Email',
      fbOrText: 'OR',
      fbFaqText: 'Help / FAQ',
      fbHomeText: 'Back to Home',
      fbFooterText: 'Your feedback is valuable to us 🌸',

      fbRatingEmpty: 'Tap a star to rate',
      fbRating1: 'Poor 😞',
      fbRating2: 'Below Average 😕',
      fbRating3: 'Good 🙂',
      fbRating4: 'Very Good 😊',
      fbRating5: 'Excellent! 🤩',

      fbCatDesign: 'Design',
      fbCatPerformance: 'Performance',
      fbCatUsability: 'Usability',
      fbCatFeatures: 'Features',

      fbTypePraise: '😊 Praise',
      fbTypeIssue: '😔 Issue',
      fbTypeFeature: '💡 Feature Request',
      fbTypeOther: '💬 Other',

      fbNamePlaceholder: 'Your name (optional)',
      fbMessagePlaceholder: 'Share your thoughts, issues, or suggestions...',

      fbNoMessage: 'Please write a message first!',
      fbEmailOpening: 'Opening your email app...\n\nPress "Send" to complete.',
      fbEmailError: 'Could not open email app. Please email us at: ',

      // ============ FAQ ============
      faqTitle: 'Help / FAQ ❓',
      faqSubtitle: 'Q&A and guide',
      faqHeroTitle: 'What do you need to know?',
      faqHeroSub: 'Detailed information about the app usage is here',
      faqSearchPlaceholder: 'Search by any question or word...',
      faqNoResults: 'Sorry, your question was not found.',

      // ============ LOCK ============
      lockAppLocked: 'App is Locked',
      lockEnterPassword: 'Enter password to unlock',
      lockPassword: 'Password',
      lockPattern: 'Pattern',
      lockEnterPasswordPlaceholder: 'Enter password...',
      lockUnlockBtn: 'Unlock',
      lockForgot: 'Forgot password?',
      lockWrongPassword: 'Wrong password ❌',
      lockPleaseEnterPassword: 'Please enter password',
      lockWrongPattern: 'Wrong Pattern ❌',
      lockNoRecovery: 'No recovery question is set! You cannot recover the password. Please try to remember it.',
      lockRecoveryTitle: '🔑 Password Recovery',
      lockYourAnswer: 'Your answer...',
      lockVerifyBtn: 'Verify',
      lockCancelBtn: 'Cancel',
      lockWrongAnswer: 'Wrong answer ❌',
      lockResetTitle: '🔐 Reset Lock',
      lockResetDesc: 'Choose a new lock type:',
      lockResetPasswordBtn: 'Password',
      lockResetPatternBtn: 'Pattern',
      lockResetCancel: 'Cancel',
      lockNewPasswordTitle: '🔐 Set New Password',
      lockNewPasswordPlaceholder: 'New Password',
      lockConfirmPasswordPlaceholder: 'Confirm Password',
      lockResetSave: 'Save',
      lockPasswordEmpty: 'Password cannot be empty',
      lockPasswordMismatch: 'Passwords do not match',
      lockPasswordResetOk: 'Password reset successfully! Please login.',
      lockNewPatternTitle: '🔐 Draw New Pattern',
      lockPatternMin3: 'Connect at least 3 dots',
      lockPatternValid: 'Please draw a valid pattern!',
      lockPatternResetOk: 'Pattern reset successfully! Please login.',

      // ============ BIRTHDAY ============
      birthdayTitle: 'Happy Birthday',
      birthdaySub: 'Today is your day 🌸',
      birthdayFriend: 'Friend',

      // ============ COMMON EMPTY/CONFIRM ============
      confirmDelete: 'Delete this?',
      confirmDeleteEntry: 'Move this entry to recycle bin?',
      confirmDeleteTask: 'Move this task to recycle bin?',
      confirmDeleteAllTasks: 'Move all todos to recycle bin?',
      confirmDeleteAllTasks2: 'Are you absolutely sure?',
      allTasksMoved: 'All todos moved to recycle bin ✅',
      confirmDeleteProject: 'Move this project to recycle bin?',
      confirmDeleteRoutine: 'Delete this routine?',

      // ============ VALIDATION ============
      pleaseWriteSomething: 'Please write something first 🙂',
      pleaseEnterTaskName: 'Please enter a task name!',
      pleaseSelectDate: 'Please select a date!',
      pleaseEnterRoutineName: 'Enter a routine name!'
    }
  };

  // ============================================================
  // Profile cache (performance)
  // ============================================================
  let _profileCache = null;
  let _profileCacheTime = 0;
  const PROFILE_CACHE_MS = 500; // 500ms cache

  function getProfile() {
    const now = Date.now();
    if (_profileCache && (now - _profileCacheTime) < PROFILE_CACHE_MS) {
      return _profileCache;
    }
    try {
      const raw = localStorage.getItem('pinkDiaryProfile');
      _profileCache = raw ? JSON.parse(raw) : {};
      if (typeof _profileCache !== 'object' || _profileCache === null) {
        _profileCache = {};
      }
    } catch (e) {
      _profileCache = {};
    }
    _profileCacheTime = now;
    return _profileCache;
  }

  function invalidateProfileCache() {
    _profileCache = null;
    _profileCacheTime = 0;
  }

  function getLanguage() {
    const prof = getProfile();
    const lang = prof.language;
    if (lang === 'en' || lang === 'bn') return lang;
    return 'bn';
  }

  function getTone() {
    const lang = getLanguage();
    return lang === 'en' ? TONES.en : TONES.bn;
  }

  // ============================================================
  // Greeting (hour-based)
  // ============================================================
  function getGreeting() {
    const tone = getTone();
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return tone.greeting.morning;
    if (hour >= 12 && hour < 16) return tone.greeting.noon;
    if (hour >= 16 && hour < 19) return tone.greeting.afternoon;
    return tone.greeting.night;
  }

  // ============================================================
  // Get with fallback (safe access)
  // ============================================================
  function getLangValue(key, fallback) {
    try {
      const tone = getTone();
      if (tone && tone[key] !== undefined && tone[key] !== null) {
        return tone[key];
      }
      // Fallback: অন্য ভাষা থেকে
      const otherTone = (getLanguage() === 'en') ? TONES.bn : TONES.en;
      if (otherTone && otherTone[key] !== undefined && otherTone[key] !== null) {
        return otherTone[key];
      }
    } catch (e) {}
    return fallback !== undefined ? fallback : '';
  }

  // ============================================================
  // Build API
  // ============================================================
  const allKeys = new Set([
    ...Object.keys(TONES.bn),
    ...Object.keys(TONES.en)
  ]);

  const api = {
    // Special: language & profile
    lang: getLanguage,
    invalidateProfileCache: invalidateProfileCache,

    // Special: greeting
    greeting: getGreeting,

    // Special: homeTitle with name
    homeTitle: () => {
      const prof = getProfile();
      const name = prof.nickname || prof.name || '';
      const tone = getTone();
      try {
        if (typeof tone.homeTitle === 'function') return tone.homeTitle(name);
        return tone.homeTitle || '';
      } catch (e) {
        return '';
      }
    },

    // Special: diaryPlaceholder with name
    diaryPlaceholder: () => {
      const prof = getProfile();
      const name = prof.nickname || prof.name || '';
      const tone = getTone();
      try {
        if (typeof tone.diaryPlaceholder === 'function') return tone.diaryPlaceholder(name);
        return tone.diaryPlaceholder || '';
      } catch (e) {
        return '';
      }
    }
  };

  // Auto-generate all other keys
  allKeys.forEach(key => {
    // Already handled
    if (key === 'greeting') return;
    if (key === 'homeTitle') return;
    if (key === 'diaryPlaceholder') return;

    const value = TONES.bn[key];

    if (typeof value === 'function') {
      // Dynamic function (moodAppeared, etc.)
      api[key] = (...args) => {
        try {
          const tone = getTone();
          if (typeof tone[key] === 'function') {
            return tone[key](...args);
          }
          // Fallback to other language
          const otherTone = getLanguage() === 'en' ? TONES.bn : TONES.en;
          if (otherTone && typeof otherTone[key] === 'function') {
            return otherTone[key](...args);
          }
          return '';
        } catch (e) {
          return '';
        }
      };
    } else {
      // Static string
      api[key] = () => getLangValue(key, '');
    }
  });

  // ============================================================
  // Expose
  // ============================================================
  window.Lang = api;

  // ============================================================
  // Debug helper: check parity between bn & en
  // ============================================================
  window.Lang._checkParity = function() {
    const bnKeys = Object.keys(TONES.bn);
    const enKeys = Object.keys(TONES.en);
    const missingInEn = bnKeys.filter(k => !enKeys.includes(k));
    const missingInBn = enKeys.filter(k => !bnKeys.includes(k));
    return {
      bnCount: bnKeys.length,
      enCount: enKeys.length,
      missingInEn,
      missingInBn,
      ok: missingInEn.length === 0 && missingInBn.length === 0
    };
  };

})();