// ===== থিম সিস্টেম =====
(function() {
  const saved = localStorage.getItem('diaryTheme') || 'light';
  // পুরনো 'dark' থাকলে সেটাই, নতুন হলে সেটাই, ডিফল্ট 'light'
  let themeClass = saved;
  
  // যদি পুরনো 'light' থাকে যেটা আসলে পিংক ছিল, তাকে 'pink' বানাই (ঐচ্ছিক)
  // তবে নতুন সিস্টেমে ডিফল্ট 'light' রাখতে চাইলে এখানে কিছুই করব না।
  
  document.body.classList.remove('pink', 'light', 'blue', 'dark');
  document.body.classList.add(themeClass);
})();

function setTheme(themeName) {
  document.body.classList.remove('pink', 'light', 'blue', 'dark');
  document.body.classList.add(themeName);
  localStorage.setItem('diaryTheme', themeName);
}

// পুরনো কম্প্যাটিবিলিটি (toggleTheme আর ব্যবহার হবে না, তবে সেফটির জন্য)
function toggleTheme() {
  if (document.body.classList.contains('dark')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}