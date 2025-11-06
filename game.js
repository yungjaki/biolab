window.addEventListener("DOMContentLoaded", () => {
  const bg = document.getElementById("bgCanvas");
  const ctxBg = bg.getContext("2d");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const menu = document.getElementById("menu");
  const ui = document.getElementById("ui");
  const startBtn = document.getElementById("startBtn");
  const nextBtn = document.getElementById("nextLevelBtn");
  const skipBtn = document.getElementById("skipBtn");
  const info = document.getElementById("info");
  const levelTitle = document.getElementById("levelTitle");
  const progressBar = document.getElementById("progressBar");

  bg.width = canvas.width = window.innerWidth;
  bg.height = canvas.height = window.innerHeight;

  // === фон (мехурчета) ===
  const bubbles = Array.from({ length: 40 }, () => ({
    x: Math.random() * bg.width,
    y: Math.random() * bg.height,
    r: Math.random() * 6 + 2,
    s: Math.random() * 0.5 + 0.2
  }));

  function drawBg() {
    ctxBg.clearRect(0, 0, bg.width, bg.height);
    for (let b of bubbles) {
      ctxBg.beginPath();
      ctxBg.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctxBg.fillStyle = "rgba(0,255,255,0.15)";
      ctxBg.fill();
      b.y -= b.s;
      if (b.y + b.r < 0) b.y = bg.height + b.r;
    }
    requestAnimationFrame(drawBg);
  }
  drawBg();

  // === Нива ===
  let currentLevel = 0;
  const totalLevels = 10;
  let animationLoop = null;

  const levels = [
    { title: "Клетъчен изследовател", task: "Намери ядрото в клетката" },
    { title: "ДНК пъзел", task: "Кликни върху правилните двойки бази (A-T, C-G)" },
    { title: "Дисекция", task: "Намери сърцето в органите" },
    { title: "Физиология", task: "Поддържай пулса балансиран" },
    { title: "Бърз тест", task: "Отговори правилно на въпроса" },
    { title: "Микроскопско търсене", task: "Намери скритата бактерия" },
    { title: "Фотосинтеза", task: "Събери достатъчно слънчева енергия" },
    { title: "Водно равновесие", task: "Поддържай правилното количество вода" },
    { title: "Нервен импулс", task: "Реагирай бързо при светкавица" },
    { title: "ДНК редактор", task: "Поправи грешна база в ДНК" }
  ];

  startBtn.addEventListener("click", () => {
    menu.classList.add("hidden");
    ui.classList.remove("hidden");
    startLevel(0);
  });

  skipBtn.addEventListener("click", () => nextLevel());
  nextBtn.addEventListener("click", () => nextLevel());

  function startLevel(index) {
    cancelAnimationFrame(animationLoop);
    currentLevel = index;
    const level = levels[index];

    info.textContent = "";
    levelTitle.textContent = `Ниво ${index + 1}: ${level.title}`;
    progressBar.style.width = ((index / totalLevels) * 100) + "%";
    nextBtn.classList.add("hidden");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.onclick = null;

    // === примери за типове нива (различни мини задачи)
    if (index === 0) drawCellLevel();
    else if (index === 1) drawDNALevel();
    else if (index === 2) drawDissectionLevel();
    else drawGenericLevel(level.task);
  }

  function drawCellLevel() {
    let nucleus = { x: canvas.width / 2, y: canvas.height / 2, r: 60, found: false };

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00c3ff33";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 200, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = nucleus.found ? "#00ff99" : "#aa00ff";
      ctx.beginPath();
      ctx.arc(nucleus.x, nucleus.y, nucleus.r, 0, Math.PI * 2);
      ctx.fill();

      animationLoop = requestAnimationFrame(render);
    }
    render();

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const d = Math.hypot(x - nucleus.x, y - nucleus.y);
      if (d < nucleus.r) {
        if (!nucleus.found) {
          nucleus.found = true;
          info.textContent = "🎉 Вярно! Откри ядрото!";
          nextBtn.classList.remove("hidden");
        }
      } else info.textContent = "❌ Не е това. Опитай пак!";
    };
  }

  function drawDNALevel() {
    let pairsFound = 0;
    const pairs = ["A-T", "C-G", "G-C", "T-A"];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    info.textContent = "Намери 2 правилни двойки бази!";

    canvas.onclick = () => {
      pairsFound++;
      if (pairsFound >= 2) {
        info.textContent = "🧬 Успешно свърза двойките!";
        nextBtn.classList.remove("hidden");
      } else {
        info.textContent = "✅ Намери една двойка!";
      }
    };
  }

  function drawDissectionLevel() {
    info.textContent = "Намери сърцето!";
    let heart = { x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 40 };

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const d = Math.hypot(x - heart.x, y - heart.y);
      if (d < heart.r) {
        info.textContent = "❤️ Откри сърцето!";
        nextBtn.classList.remove("hidden");
      } else info.textContent = "❌ Не е това.";
    };
  }

  function drawGenericLevel(task) {
    info.textContent = task;
    canvas.onclick = () => {
      info.textContent = "🎯 Успешно изпълни задачата!";
      nextBtn.classList.remove("hidden");
    };
  }

  function nextLevel() {
    cancelAnimationFrame(animationLoop);
    if (currentLevel < totalLevels - 1) startLevel(currentLevel + 1);
    else {
      info.textContent = "🏆 Завърши всички нива!";
      nextBtn.classList.add("hidden");
      skipBtn.classList.add("hidden");
    }
  }
});
