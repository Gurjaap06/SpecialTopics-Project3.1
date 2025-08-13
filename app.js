// ---------- constants & helpers ----------
const KEY = "flashcards.v1";
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const statusEl = $("#sr-status");

// Elements
const form = $("#card-form");
const frontEl = $("#front");
const backEl = $("#back");
const tagsEl = $("#tags");
const editingIdEl = $("#editing-id");
const cancelEditBtn = $("#cancel-edit-btn");
const saveBtn = $("#save-btn");

const searchEl = $("#search");
const listEl = $("#cards");
const emptyEl = $("#empty");

const exportBtn = $("#export-btn");
const importFile = $("#import-file");
const startQuizBtn = $("#start-quiz-btn");

const quizSection = $("#quiz");
const quizFlip = $("#quiz-flip");
const quizFront = $("#quiz-front");
const quizBack = $("#quiz-back");
const quizRevealBtn = $("#quiz-reveal-btn");
const quizCorrectBtn = $("#quiz-correct-btn");
const quizWrongBtn = $("#quiz-wrong-btn");
const quizExitBtn = $("#quiz-exit-btn");
const quizCount = $("#quiz-count");
const quizSummary = $("#quiz-summary");

// ---------- storage ----------
const load = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const save = (cards) => localStorage.setItem(KEY, JSON.stringify(cards));

// ---------- state ----------
let filterText = "";
let quizQueue = [];
let quizIndex = 0;
let quizRevealed = false;
let quizCorrect = 0;
let quizWrong = 0;

// ---------- rendering ----------
function normalize(s) {
  return (s || "").toLowerCase();
}

function renderList() {
  const cards = load();
  const filtered = cards.filter((c) => {
    if (!filterText) return true;
    const needle = normalize(filterText);
    return (
      normalize(c.front).includes(needle) ||
      normalize(c.back).includes(needle) ||
      (c.tags || []).some((t) => normalize(t).includes(needle))
    );
  });

  listEl.innerHTML = "";
  if (filtered.length === 0) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  for (const c of filtered) {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <div class="card-header">
        <strong>${escapeHTML(shorten(c.front, 80))}</strong>
        <span class="card-tags">${(c.tags || [])
          .map((t) => `#${escapeHTML(t)}`)
          .join(" ")}</span>
      </div>
      <div class="card-body">
        <div><em>Back:</em> ${escapeHTML(shorten(c.back, 160))}</div>
      </div>
      <div class="card-actions">
        <button data-act="edit">Edit</button>
        <button data-act="delete" class="danger">Delete</button>
      </div>
    `;
    li.querySelector('[data-act="edit"]').onclick = () => beginEdit(c.id);
    li.querySelector('[data-act="delete"]').onclick = () => delCard(c.id);
    listEl.appendChild(li);
  }
}

function escapeHTML(s) {
  return s.replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        ch
      ])
  );
}
function shorten(s, n) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// ---------- CRUD ----------
function addCard({ front, back, tags }) {
  const cards = load();
  cards.unshift({ id: crypto.randomUUID(), front, back, tags });
  save(cards);
  renderList();
  announce("Card added");
}

function updateCard(id, { front, back, tags }) {
  const cards = load();
  const idx = cards.findIndex((c) => c.id === id);
  if (idx >= 0) {
    cards[idx] = { ...cards[idx], front, back, tags };
    save(cards);
    renderList();
    announce("Card updated");
  }
}

function delCard(id) {
  const cards = load();
  const idx = cards.findIndex((c) => c.id === id);
  if (idx >= 0) {
    cards.splice(idx, 1);
    save(cards);
    renderList();
    announce("Card deleted");
  }
}

// ---------- form handlers ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const front = frontEl.value.trim();
  const back = backEl.value.trim();
  const tags = tagsEl.value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!front || !back) return;

  const editingId = editingIdEl.value;
  if (editingId) {
    updateCard(editingId, { front, back, tags });
  } else {
    addCard({ front, back, tags });
  }
  form.reset();
  editingIdEl.value = "";
  saveBtn.textContent = "Add card";
  cancelEditBtn.hidden = true;
  frontEl.focus();
});

cancelEditBtn.addEventListener("click", () => {
  form.reset();
  editingIdEl.value = "";
  saveBtn.textContent = "Add card";
  cancelEditBtn.hidden = true;
});

function beginEdit(id) {
  const cards = load();
  const card = cards.find((c) => c.id === id);
  if (!card) return;
  frontEl.value = card.front;
  backEl.value = card.back;
  tagsEl.value = (card.tags || []).join(", ");
  editingIdEl.value = card.id;
  saveBtn.textContent = "Save changes";
  cancelEditBtn.hidden = false;
  frontEl.focus();
}

// ---------- search ----------
searchEl.addEventListener("input", () => {
  filterText = searchEl.value;
  renderList();
});

// ---------- export / import ----------
exportBtn.addEventListener("click", () => {
  const content = JSON.stringify(load(), null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flashcards-export.json";
  a.click();
  URL.revokeObjectURL(url);
});

importFile.addEventListener("change", async () => {
  const file = importFile.files[0];
  if (!file) return;
  const text = await file.text().catch(() => null);
  if (!text) return;
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("Invalid JSON format");
    // Very light validation
    const cleaned = data
      .filter(
        (x) => x && typeof x.front === "string" && typeof x.back === "string"
      )
      .map((x) => ({
        id: x.id && typeof x.id === "string" ? x.id : crypto.randomUUID(),
        front: x.front,
        back: x.back,
        tags: Array.isArray(x.tags) ? x.tags.filter(Boolean) : [],
      }));
    const existing = load();
    const all = dedupeById(existing.concat(cleaned));
    save(all);
    renderList();
    announce("Import complete");
  } catch {
    announce("Import failed: invalid JSON");
  } finally {
    importFile.value = "";
  }
});
function dedupeById(arr) {
  const map = new Map();
  for (const x of arr) map.set(x.id, x);
  return Array.from(map.values());
}

// ---------- quiz mode ----------
startQuizBtn.addEventListener("click", startQuiz);
quizRevealBtn.addEventListener("click", reveal);
quizCorrectBtn.addEventListener("click", () => next(true));
quizWrongBtn.addEventListener("click", () => next(false));
quizExitBtn.addEventListener("click", exitQuiz);
quizFlip.addEventListener("click", () => {
  if (!quizRevealed) reveal();
});

function startQuiz() {
  const cards = getFilteredCards();
  if (cards.length === 0) {
    announce("No cards to quiz");
    return;
  }
  quizQueue = shuffle(cards.slice());
  quizIndex = 0;
  quizCorrect = 0;
  quizWrong = 0;
  quizSummary.hidden = true;
  quizSection.classList.remove("hidden");
  showCurrent();
}
function exitQuiz() {
  quizSection.classList.add("hidden");
}
function reveal() {
  quizRevealed = true;
  quizBack.style.display = "block";
  quizCorrectBtn.disabled = false;
  quizWrongBtn.disabled = false;
}
function next(wasCorrect) {
  if (wasCorrect === true) quizCorrect++;
  else if (wasCorrect === false) quizWrong++;
  quizIndex++;
  if (quizIndex >= quizQueue.length) {
    const total = quizQueue.length;
    quizSummary.hidden = false;
    quizSummary.textContent = `Done! ${quizCorrect}/${total} correct (${Math.round(
      (quizCorrect / total) * 100
    )}%).`;
    quizCorrectBtn.disabled = true;
    quizWrongBtn.disabled = true;
    return;
  }
  showCurrent();
}
function showCurrent() {
  quizRevealed = false;
  quizCorrectBtn.disabled = true;
  quizWrongBtn.disabled = true;
  const c = quizQueue[quizIndex];
  quizFront.textContent = c.front;
  quizBack.textContent = c.back;
  quizBack.style.display = "none";
  quizCount.textContent = `Card ${quizIndex + 1} of ${quizQueue.length}`;
}
function getFilteredCards() {
  const cards = load();
  if (!filterText) return cards;
  const needle = normalize(filterText);
  return cards.filter(
    (c) =>
      normalize(c.front).includes(needle) ||
      normalize(c.back).includes(needle) ||
      (c.tags || []).some((t) => normalize(t).includes(needle))
  );
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- a11y status ----------
function announce(msg) {
  statusEl.textContent = msg;
}

// ---------- boot ----------
renderList();

// Seed a couple examples on first run (if empty)
if (load().length === 0) {
  save([
    {
      id: crypto.randomUUID(),
      front: "Capital of Japan?",
      back: "Tokyo",
      tags: ["geography"],
    },
    { id: crypto.randomUUID(), front: "2 + 2 =", back: "4", tags: ["math"] },
  ]);
  renderList();
  announce("Loaded sample cards");
}
