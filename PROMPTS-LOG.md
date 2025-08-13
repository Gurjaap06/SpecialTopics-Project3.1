# PROMPTS-LOG.md — Flashcards (WDDM 133, Project 3.1)

> Built entirely via “vibe coding” prompts.  
> Date: 2025-08-05

---

## Session 1 — Project kickoff & constraints

**Prompt:**  
“Act as my AI coding assistant. I need to build a very simple **Flashcards** web app using **Semantic HTML**, **standard CSS**, and **Vanilla JavaScript** only. **No front-end frameworks** and **no external libraries**. Data must persist using **LocalStorage** (no API keys). Please outline a minimal plan and initial file structure that matches these rules. I also need a **PROMPTS-LOG.md** and a **README.md** later. Keep accessibility in mind.”

**AI Response (excerpt):**

- Plan:

  1. Create project folder with `index.html`, `styles.css`, `app.js`, `.gitignore`, `PROMPTS-LOG.md`, `README.md`.
  2. Build semantic layout (header/main/footer), card form, list, and quiz section.
  3. Implement LocalStorage CRUD (create, edit, delete).
  4. Add search and tags.
  5. Add quiz mode (reveal/correct/wrong + summary).
  6. Add JSON import/export.
  7. Accessibility: labels, roles, `aria-live` updates.
  8. README + push to public GitHub repo.

- Suggested structure:
  flashcards-vanilla/
  ├─ index.html
  ├─ styles.css
  ├─ app.js
  ├─ README.md
  ├─ PROMPTS-LOG.md
  ├─ .gitignore

**Files changed:** _(planning only; no files yet)_

---

## Session 2 — Initialize repo & .gitignore

**Prompt:**  
“Give me a minimal `.gitignore` suitable for this project. No Node server is required, but I might use a local dev server. Avoid committing OS cruft.”

**AI Response:**

````gitignore
# Node / OS cruft
node_modules
npm-debug.log*
.DS_Store
.env
Files changed: .gitignore

Session 3 — Create semantic HTML scaffold
Prompt:
“Create index.html with a semantic structure for the Flashcards app: header/main/footer, a form to add or edit a card (front/back/tags), a searchable list of cards, and a quiz section. Include accessible labels and an aria-live status region. Link to styles.css and app.js and do not use any framework.”

AI Response:
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Flashcards — Vanilla JS</title>
  <link rel="stylesheet" href="styles.css" />
  <meta name="description" content="Simple flashcards app using Semantic HTML, CSS, and Vanilla JS with LocalStorage." />
</head>
<body>
  <header>
    <h1>Flashcards</h1>
    <p class="subtitle">Vanilla JS + LocalStorage (no frameworks)</p>
  </header>

  <main>
    <!-- Controls -->
    <section aria-labelledby="controls-title" class="controls">
      <h2 id="controls-title">Create / Search</h2>
      <form id="card-form" aria-label="Create or edit a card">
        <div class="field">
          <label for="front">Front</label>
          <textarea id="front" name="front" required placeholder="e.g., What is the capital of Japan?"></textarea>
        </div>
        <div class="field">
          <label for="back">Back</label>
          <textarea id="back" name="back" required placeholder="e.g., Tokyo"></textarea>
        </div>
        <div class="field">
          <label for="tags">Tags (comma-separated)</label>
          <input id="tags" name="tags" placeholder="e.g., geography,asia" />
        </div>
        <div class="actions">
          <button type="submit" id="save-btn">Add card</button>
          <button type="reset" id="cancel-edit-btn" class="secondary" hidden>Cancel edit</button>
        </div>
        <input type="hidden" id="editing-id" />
      </form>

      <div class="toolbar">
        <label for="search" class="visually-hidden">Search</label>
        <input id="search" placeholder="Search front/back/tags…" />
        <button id="start-quiz-btn" class="primary">Start Quiz</button>
        <button id="export-btn">Export JSON</button>
        <label class="import-label">
          <input type="file" id="import-file" accept="application/json" hidden />
          <span>Import JSON</span>
        </label>
      </div>
    </section>

    <!-- List -->
    <section aria-labelledby="list-title">
      <h2 id="list-title">Your Cards</h2>
      <ul id="cards" class="cards" aria-live="polite"></ul>
      <p id="empty" class="empty" hidden>No cards yet. Add your first one above!</p>
    </section>

    <!-- Quiz -->
    <section aria-labelledby="quiz-title" id="quiz" class="quiz hidden">
      <h2 id="quiz-title">Quiz Mode</h2>
      <div class="quiz-card" aria-live="polite">
        <p id="quiz-count"></p>
        <div class="flip" id="quiz-flip" tabindex="0" role="button" aria-pressed="false" aria-label="Flip card">
          <div class="face front" id="quiz-front"></div>
          <div class="face back" id="quiz-back"></div>
        </div>
      </div>
      <div class="quiz-actions">
        <button id="quiz-reveal-btn">Reveal</button>
        <button id="quiz-correct-btn" class="success" disabled>Correct</button>
        <button id="quiz-wrong-btn" class="danger" disabled>Wrong</button>
        <button id="quiz-exit-btn" class="secondary">Exit Quiz</button>
      </div>
      <p id="quiz-summary" class="summary" hidden></p>
    </section>
  </main>

  <footer>
    <small>WDDM 133 — Project 3.1 • Vanilla only • LocalStorage</small>
  </footer>

  <div id="sr-status" class="visually-hidden" aria-live="polite"></div>
  <script src="app.js" defer></script>
</body>
</html>
Files changed: index.html

Session 4 — Base styles (standard CSS only)
Prompt:
“Create styles.css with clean, modern, readable styles. Use CSS variables for colors/border radius, a simple card layout for the list, and basic button variants (primary/success/danger). No frameworks or resets.”

AI Response:
:root {
  --radius: 14px;
  --border: #e4e4e7;
  --muted: #6b7280;
  --bg: #fafafa;
}
* { box-sizing: border-box; }
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  line-height: 1.5;
  color: #111827;
  background: var(--bg);
  margin: 0;
}
header, main, footer { max-width: 900px; margin: 0 auto; padding: 1rem; }
header h1 { margin: .25rem 0 .25rem; }
.subtitle { margin: 0; color: var(--muted); }

.controls, .quiz, .cards, form, .toolbar {
  background: #fff; border: 1px solid var(--border); border-radius: var(--radius);
}
.controls { padding: 1rem; display: grid; gap: 1rem; }

.field { display: grid; gap: .25rem; }
.field textarea, .field input, #search {
  width: 100%; padding: .75rem; border: 1px solid var(--border); border-radius: .6rem;
}
.actions { display: flex; gap: .5rem; }
.toolbar { display: flex; gap: .5rem; align-items: center; padding: .5rem; }

button {
  padding: .6rem .9rem; border-radius: .6rem; border: 1px solid var(--border); background: #fff; cursor: pointer;
}
button.primary { background: #111827; color: #fff; border-color: #111827; }
button.secondary { background: #f5f5f5; }
button.success { background: #10b981; color: #fff; border-color: #059669; }
button.danger  { background: #ef4444; color: #fff; border-color: #dc2626; }

.cards { list-style: none; padding: .5rem; margin: 1rem 0; display: grid; gap: .5rem; }
.card {
  display: grid; gap: .5rem; padding: .75rem; border: 1px solid var(--border); border-radius: var(--radius);
  background: #fff;
}
.card-header { display: flex; justify-content: space-between; align-items: center; gap: .5rem; }
.card-tags { color: var(--muted); font-size: .9rem; }
.card-body { display: grid; gap: .25rem; }
.card-actions { display: flex; gap: .5rem; justify-content: flex-end; }

.empty { color: var(--muted); text-align: center; }

.quiz.hidden { display: none; }
.quiz { padding: 1rem; margin-top: 1rem; display: grid; gap: .75rem; }
.quiz-card { display: grid; gap: .5rem; }
.flip {
  border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1rem; min-height: 120px; display: grid; align-content: center;
  cursor: pointer; user-select: none;
}
.face { white-space: pre-wrap; }
#quiz-count { color: var(--muted); margin: 0; }
.summary { background: #f5f5f5; border-radius: .6rem; padding: .5rem .75rem; }

footer { text-align: center; color: var(--muted); padding-bottom: 2rem; }

.visually-hidden {
  position: absolute !important; width: 1px; height: 1px; margin: -1px; border: 0; padding: 0;
  clip: rect(0 0 0 0); overflow: hidden; white-space: nowrap;
}
.import-label { border: 1px solid var(--border); border-radius: .6rem; padding: .47rem .75rem; cursor: pointer; background: #fff; }
.import-label:hover { background: #f5f5f5; }
Files changed: styles.css

Session 5 — App logic with LocalStorage (CRUD, search, tags, quiz)
Prompt:
“Create app.js to implement: LocalStorage CRUD for cards (id, front, back, tags[]), search filter across front/back/tags, and a quiz mode with reveal + correct/wrong counters and a final summary. Add import/export JSON, light validation, and an aria-live announcer for status messages. Do not use any external libraries.”

AI Response:
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
function normalize(s) { return (s || "").toLowerCase(); }

function renderList() {
  const cards = load();
  const filtered = cards.filter(c => {
    if (!filterText) return true;
    const needle = normalize(filterText);
    return normalize(c.front).includes(needle)
        || normalize(c.back).includes(needle)
        || (c.tags || []).some(t => normalize(t).includes(needle));
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
        <span class="card-tags">${(c.tags || []).map(t => \`#\${escapeHTML(t)}\`).join(" ")}</span>
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
  return s.replace(/[&<>"']/g, ch =>
    ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[ch]));
}
function shorten(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }

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
  const idx = cards.findIndex(c => c.id === id);
  if (idx >= 0) {
    cards[idx] = { ...cards[idx], front, back, tags };
    save(cards);
    renderList();
    announce("Card updated");
  }
}

function delCard(id) {
  const cards = load();
  const idx = cards.findIndex(c => c.id === id);
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
  const tags = tagsEl.value.split(",").map(t => t.trim()).filter(Boolean);

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
  const card = cards.find(c => c.id === id);
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
      .filter(x => x && typeof x.front === "string" && typeof x.back === "string")
      .map(x => ({
        id: x.id && typeof x.id === "string" ? x.id : crypto.randomUUID(),
        front: x.front, back: x.back,
        tags: Array.isArray(x.tags) ? x.tags.filter(Boolean) : []
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
quizFlip.addEventListener("click", () => { if (!quizRevealed) reveal(); });

function startQuiz() {
  const cards = getFilteredCards();
  if (cards.length === 0) { announce("No cards to quiz"); return; }
  quizQueue = shuffle(cards.slice());
  quizIndex = 0; quizCorrect = 0; quizWrong = 0;
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
  if (wasCorrect === true) quizCorrect++; else if (wasCorrect === false) quizWrong++;
  quizIndex++;
  if (quizIndex >= quizQueue.length) {
    const total = quizQueue.length;
    quizSummary.hidden = false;
    quizSummary.textContent = `Done! ${quizCorrect}/${total} correct (${Math.round((quizCorrect/total)*100)}%).`;
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
  return cards.filter(c =>
    normalize(c.front).includes(needle)
    || normalize(c.back).includes(needle)
    || (c.tags || []).some(t => normalize(t).includes(needle))
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
function announce(msg) { statusEl.textContent = msg; }

// ---------- boot ----------
renderList();

// Seed a couple examples on first run (if empty)
if (load().length === 0) {
  save([
    { id: crypto.randomUUID(), front: "Capital of Japan?", back: "Tokyo", tags: ["geography"] },
    { id: crypto.randomUUID(), front: "2 + 2 =", back: "4", tags: ["math"] }
  ]);
  renderList();
  announce("Loaded sample cards");
}
Files changed: app.js

Session 6 — Run locally (Live Server)
Prompt:
“How do I run this locally with or without a dev server?”

AI Response (excerpt):

Quickest: open index.html in your browser.

Nicer: use VS Code Live Server (right-click index.html → Open with Live Server).

Or run a simple static server: npx serve .

Files changed: (none)

Session 7 — README.md content
Prompt:
“Generate a concise README.md that explains features, how to run, and assignment notes. No frameworks mentioned.”

AI Response:
# Flashcards — Vanilla JS

A simple flashcards app built with **Semantic HTML**, **CSS**, and **Vanilla JavaScript**.
Data persists in the **browser’s LocalStorage**. No frameworks or external APIs.

## Features
- Create, edit, delete cards with optional tags
- Search across front/back/tags
- Quiz mode (reveal, correct/wrong tally, summary)
- Import/Export cards as JSON
- Accessible: semantic structure, aria-live updates

## How to run
- Open `index.html` in your browser, or
- Use a local server (optional):
  ```bash
  npx serve .
  # or use the VS Code "Live Server" extension
Data
Cards are stored locally under localStorage key flashcards.v1.

Export/Import via JSON for backup.

Assignment Notes
Vanilla JS, standard CSS, semantic HTML only

No front-end frameworks or API keys

See PROMPTS-LOG.md for the prompt/response history
**Files changed:** `README.md`

---

## Session 8 — Light accessibility & UX polish
**Prompt:**
“Confirm we have accessible labels, visible focus, and screen-reader updates. Add an `aria-live` region and announce key actions (add/update/delete/import).”

**AI Response (excerpt):**
- `index.html` already includes an `aria-live="polite"` region with id `sr-status`.
- `app.js` includes `announce(msg)` to update that region on add/update/delete/import.
- Form fields have `label for=…` associations.
- Search input has a visually hidden label.

**Files changed:** *(none; verified features already present)*

---

## Session 9 — Import/Export validation
**Prompt:**
“Add very light validation to JSON import to ensure each item has string `front` and `back`, with optional `tags` (array of strings). Merge with existing cards and de-duplicate by id.”

**AI Response (excerpt):**
- Implemented in `importFile` change handler: parses JSON, filters/cleans entries, merges with existing, de-dupes via `dedupeById`.
- Announces success or failure via `announce()`.

**Files changed:** `app.js` *(already included in prior code block)*

---

## Session 10 — Final check & seed data
**Prompt:**
“On first run, if there are no cards in LocalStorage, seed with a couple of example cards so the UI isn’t empty.”

**AI Response (excerpt):**
- Added a boot-time check to `app.js` to seed two example cards and call `renderList()` and `announce("Loaded sample cards")`.

**Files changed:** `app.js` *(already included in prior code block)*

---

## Session 11 — GitHub publishing steps
**Prompt:**
“Give me the exact Git commands to initialize the repo and push to a new public GitHub repository named `flashcards-vanilla`.”

**AI Response:**
```bash
git init
git add .
git commit -m "Initial commit: vanilla flashcards app"
git branch -M main
git remote add origin https://github.com/<your-username>/flashcards-vanilla.git
git push -u origin main
Files changed: (none)

Session 12 — Submission reminder
Prompt:
“Remind me how to submit this for WDDM 133.”

AI Response (excerpt):

Make sure the GitHub repo is public and includes index.html, styles.css, app.js, .gitignore, README.md, PROMPTS-LOG.md.

Submit only the repository URL to BlackBoard.

No need to upload files to BlackBoard.

Files changed: (none)

Notes
All code is vanilla HTML/CSS/JS, no frameworks.

Data is stored locally via localStorage under the key flashcards.v1.

No API keys or external services are used.
````
