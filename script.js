// Здесь можно добавить ваши имена, дату, фотографии и собственное письмо.
// Фотографии положите в папку images и укажите пути, например images/us.jpg.
const story = {
  name: "Жан",
  signature: "Нежно обнимаю тебя ♡",
  startDate: "", // Формат YYYY-MM-DD.
  cover: "images/us-mirror.jpg",
  photos: [
    { src: "images/us-bunny.jpg", caption: "Моя серьезка ♡" },
    { src: "images/us-mirror.jpg", caption: "Четкая фотка" },
  ],
  letter: [], // Каждый элемент массива — отдельный абзац письма.
};

function setPhoto(element, src, description) {
  if (!src) return;
  if (element.querySelector("img")?.getAttribute("src") === src) return;
  const img = document.createElement("img");
  img.alt = description;
  img.addEventListener("load", () => element.replaceChildren(img), { once: true });
  img.src = src;
}

if (story.name) {
  document.title = `Для тебя, ${story.name} ♡`;
  document.getElementById("salutation").textContent = `${story.name},`;
}
if (story.signature) document.getElementById("signature").textContent = story.signature;
setPhoto(document.getElementById("cover-image"), story.cover, "Наше любимое совместное фото");
story.photos.forEach((photo, index) => {
  const element = document.getElementById(`photo-${index + 1}`);
  if (!element) return;
  setPhoto(element, photo.src, photo.caption);
  document.getElementById(`caption-${index + 1}`).textContent = photo.caption;
});
if (story.letter.length) {
  document.getElementById("letter-text").replaceChildren(...story.letter.map(text => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
  }));
}
if (/^\d{4}-\d{2}-\d{2}$/.test(story.startDate)) {
  const [year, month, day] = story.startDate.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.floor((today - start.getTime()) / 86400000);
  if (start.getUTCFullYear() === year && start.getUTCMonth() === month - 1 && start.getUTCDate() === day && days >= 0) {
    const unit = { one: "день", few: "дня", many: "дней", other: "дня" }[new Intl.PluralRules("ru").select(days)];
    const counter = document.getElementById("days-together");
    counter.textContent = `${days.toLocaleString("ru")} ${unit} вместе. И столько всего впереди ♡`;
    counter.hidden = false;
  }
}

const letterButton = document.getElementById("open-letter");
const letter = document.getElementById("letter-content");
letterButton.addEventListener("click", () => {
  const opened = letterButton.getAttribute("aria-expanded") !== "true";
  letterButton.setAttribute("aria-expanded", String(opened));
  letter.hidden = !opened;
  letterButton.querySelector(".envelope-action").textContent = opened ? "нажми, чтобы закрыть" : "нажми, чтобы открыть";
});

let cleanupTimer;
function celebrate() {
  const rain = document.getElementById("heart-rain");
  clearTimeout(cleanupTimer);
  rain.replaceChildren();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 24; i++) {
    const heart = document.createElement("span");
    heart.textContent = "♥";
    heart.style.setProperty("--left", `${Math.random() * 100}%`);
    heart.style.setProperty("--delay", `${Math.random() * 0.8}s`);
    heart.style.setProperty("--size", `${14 + Math.random() * 22}px`);
    rain.append(heart);
  }
  cleanupTimer = setTimeout(() => rain.replaceChildren(), 4200);
}
document.getElementById("surprise").addEventListener("click", () => {
  document.getElementById("hug-message").textContent = "Жан, лови самую нежную обнимашку. Ты очень мне дорога ♡";
  celebrate();
});

const questSteps = [
  {
    question: "С какой шуткой я доиграюсь?",
    options: ["Блокни меня", "Блокни меня", "Блокни меня"],
    correct: 1,
    success: "Надеюсь не блокнешь",
    hint: "Надеюсь не блокнешь  ",
  },
  {
    question: "Когда катались под музыку что было важнее всего?",
    options: ["То, что мы были вместе ♡", "Зелёный свет на каждом светофоре", "Идеальный маршрут"],
    correct: 0,
    success: "Да, жан. Главное в любом маршруте — ты рядом.",
    hint: "Это приятно, но самое дорогое для меня — с кем я еду ♡",
  },
  {
    question: "Я хоть и не рядом но виртуально могу",
    options: ["Обнять", "Поцеловать", "Всё сразу ♡"],
    correct: null,
    success: "А ещё у меня для тебя несколько слов…",
  },
];
let questStep = 0;
let answered = false;
const nextButton = document.getElementById("quest-next");
function renderQuest(moveFocus = false) {
  answered = false;
  const step = questSteps[questStep];
  document.getElementById("quest-step").textContent = `Шаг ${questStep + 1} из ${questSteps.length}`;
  const question = document.getElementById("quest-question");
  question.textContent = step.question;
  document.getElementById("quest-feedback").textContent = "";
  nextButton.hidden = true;
  nextButton.textContent = questStep === questSteps.length - 1 ? "Открыть сюрприз ♡" : "Следующий шаг →";
  document.querySelectorAll(".quest-progress span").forEach((dot, index) => dot.classList.toggle("active", index <= questStep));
  const options = document.getElementById("quest-options");
  options.replaceChildren(...step.options.map((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quest-option";
    button.textContent = text;
    button.addEventListener("click", () => {
      if (answered) return;
      const correct = step.correct === null || step.correct === index;
      document.getElementById("quest-feedback").textContent = correct ? step.success : step.hint;
      if (!correct) return;
      answered = true;
      button.classList.add("selected");
      options.querySelectorAll("button").forEach(option => { option.disabled = true; });
      nextButton.hidden = false;
      nextButton.focus({ preventScroll: true });
    });
    return button;
  }));
  if (moveFocus) question.focus({ preventScroll: true });
}
nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (questStep < questSteps.length - 1) {
    questStep++;
    renderQuest(true);
    return;
  }
  document.getElementById("quest-game").hidden = true;
  document.getElementById("quest-reward").hidden = false;
  document.getElementById("reward-title").focus({ preventScroll: true });
  celebrate();
});
document.getElementById("quest-restart").addEventListener("click", () => {
  questStep = 0;
  document.getElementById("quest-game").hidden = false;
  document.getElementById("quest-reward").hidden = true;
  renderQuest(true);
});
renderQuest();

// Only the chosen clip gets a source: the collage itself loads small posters.
const filmDialog = document.getElementById("film-dialog");
const filmPlayer = document.getElementById("film-player");
const filmError = document.getElementById("film-error");
let filmTrigger = null;
let filmRequest = 0;
document.querySelectorAll(".film-open").forEach(link => {
  link.addEventListener("click", event => {
    // Keep normal link behavior for opening a new tab or browsers without dialog.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof filmDialog.showModal !== "function") return;
    event.preventDefault();
    filmTrigger = link;
    const request = ++filmRequest;
    filmError.hidden = true;
    document.getElementById("film-title").textContent = link.dataset.title;
    document.getElementById("film-download").href = link.href;
    filmPlayer.poster = link.querySelector("img").src;
    filmPlayer.src = link.href;
    filmPlayer.setAttribute("aria-label", link.dataset.title);
    filmDialog.showModal();
    document.body.classList.add("film-is-open");
    filmPlayer.play().catch(error => {
      if (request !== filmRequest || !filmDialog.open) return;
      // Autoplay restrictions still allow pressing the native play control.
      if (error.name !== "NotAllowedError" && error.name !== "AbortError") filmError.hidden = false;
    });
  });
});
document.getElementById("film-close").addEventListener("click", () => filmDialog.close());
filmDialog.addEventListener("click", event => {
  if (event.target !== filmDialog) return;
  const bounds = filmDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) filmDialog.close();
});
filmDialog.addEventListener("close", () => {
  filmRequest++;
  filmPlayer.pause();
  filmPlayer.removeAttribute("src");
  filmPlayer.load();
  filmError.hidden = true;
  document.body.classList.remove("film-is-open");
  filmTrigger?.focus({ preventScroll: true });
});
filmPlayer.addEventListener("error", () => {
  if (filmDialog.open && filmPlayer.hasAttribute("src")) filmError.hidden = false;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) filmPlayer.pause();
});
