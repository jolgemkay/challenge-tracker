const weeks = [
  "Challenge Tracker",
  "Context Engineering",
  "Models & Harnesses",
  "Deep Research",
  "Spreadsheet AI",
  "Data Pipelines",
  "Live Data & MCP",
  "One Agent One Job",
  "Agent Teams",
  "Advanced App",
  "Capstone"
];

const storageKey = "my-ai-challenge-tracker";
const list = document.querySelector("#week-list");
const count = document.querySelector("#completed-count");
const progress = document.querySelector(".progress-track");
const fill = document.querySelector(".progress-fill");
const message = document.querySelector("#progress-message");
const saveStatus = document.querySelector("#save-status");
let saved = {};

try {
  const data = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (data && typeof data === "object" && !Array.isArray(data)) saved = data;
} catch {
  saveStatus.textContent = "Progress could not be loaded from this browser.";
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
    saveStatus.textContent = "Saved in this browser ✓";
  } catch {
    saveStatus.textContent = "Changes could not be saved in this browser.";
  }
}

function updateProgress() {
  const completed = weeks.reduce((total, _, index) => total + (saved[index]?.complete === true ? 1 : 0), 0);
  count.textContent = completed;
  progress.setAttribute("aria-valuenow", completed);
  fill.style.width = `${(completed / weeks.length) * 100}%`;
  message.textContent = completed === 0
    ? "Every journey starts somewhere. You’ve got this!"
    : completed === weeks.length
      ? "All 11 weeks complete. Look how far you’ve come!"
      : "You’re making progress. Keep the momentum going!";
}

weeks.forEach((theme, index) => {
  const number = index + 1;
  const state = saved[index] && typeof saved[index] === "object" ? saved[index] : {};
  const card = document.createElement("article");
  card.className = "week-card";
  card.innerHTML = `
    <div class="week-top">
      <span class="week-number" aria-hidden="true">${String(number).padStart(2, "0")}</span>
      <div class="week-title">
        <p class="week-label">WEEK ${String(number).padStart(2, "0")}</p>
        <h3></h3>
      </div>
      <label class="check-label">
        <input type="checkbox" aria-label="Mark week ${number} complete">
        <span>Done</span>
      </label>
    </div>
    <label class="notes-label" for="notes-${number}">YOUR NOTES</label>
    <textarea id="notes-${number}" aria-label="Notes for week ${number}" placeholder="Ideas, takeaways, little wins..."></textarea>
  `;
  card.querySelector("h3").textContent = theme;
  const checkbox = card.querySelector("input");
  const notes = card.querySelector("textarea");
  checkbox.checked = state.complete === true;
  notes.value = typeof state.notes === "string" ? state.notes : "";
  card.classList.toggle("is-complete", checkbox.checked);

  checkbox.addEventListener("change", () => {
    saved[index] = { complete: checkbox.checked, notes: notes.value };
    card.classList.toggle("is-complete", checkbox.checked);
    updateProgress();
    save();
  });
  notes.addEventListener("input", () => {
    saved[index] = { complete: checkbox.checked, notes: notes.value };
    save();
  });
  list.append(card);
});

updateProgress();
