const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const SHIFT_HOURS = 12;
const STORAGE_KEY = "shiftPlannerSettings";

const daysGrid = document.getElementById("daysGrid");
const hourlyRateInput = document.getElementById("hourlyRate");
const shiftCountEl = document.getElementById("shiftCount");
const totalHoursEl = document.getElementById("totalHours");
const grossPayEl = document.getElementById("grossPay");
const weeklyPayEl = document.getElementById("weeklyPay");
const fourWeekPayEl = document.getElementById("fourWeekPay");
const monthlyPayEl = document.getElementById("monthlyPay");
const annualPayEl = document.getElementById("annualPay");
const breakdownEl = document.getElementById("breakdown");
const resetBtn = document.getElementById("resetBtn");

function formatMoney(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(value);
}

function createDayControls() {
  daysGrid.innerHTML = DAYS.map((day, index) => `
    <div class="day">
      <input type="checkbox" id="day-${index}" data-day="${day}">
      <label for="day-${index}">
        <span class="day-name">${day}</span>
        <span class="day-hours">${SHIFT_HOURS} hours</span>
      </label>
    </div>
  `).join("");

  daysGrid.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", update);
  });
}

function getSelectedDays() {
  return [...daysGrid.querySelectorAll("input:checked")].map(input => input.dataset.day);
}

function updateBreakdown(selectedDays) {
  if (selectedDays.length === 0) {
    breakdownEl.className = "breakdown empty";
    breakdownEl.textContent = "No working days selected.";
    return;
  }

  breakdownEl.className = "breakdown";
  breakdownEl.innerHTML = selectedDays.map((day, index) => `
    <div class="breakdown-row">
      <span>${day}</span>
      <span class="shift-badge">Shift ${index + 1}</span>
      <strong>${SHIFT_HOURS} hours</strong>
    </div>
  `).join("");
}

function saveState() {
  const state = {
    days: getSelectedDays(),
    hourlyRate: hourlyRateInput.value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;

    if (Array.isArray(saved.days)) {
      daysGrid.querySelectorAll("input").forEach(input => {
        input.checked = saved.days.includes(input.dataset.day);
      });
    }

    if (saved.hourlyRate !== undefined && saved.hourlyRate !== "") {
      hourlyRateInput.value = saved.hourlyRate;
    }
  } catch {
    // Ignore invalid local storage data.
  }
}

function update() {
  const selectedDays = getSelectedDays();
  const shiftCount = selectedDays.length;
  const totalHours = shiftCount * SHIFT_HOURS;
  const hourlyRate = Math.max(0, Number(hourlyRateInput.value) || 0);
  const weeklyPay = totalHours * hourlyRate;

  shiftCountEl.textContent = shiftCount;
  totalHoursEl.textContent = totalHours;
  grossPayEl.textContent = formatMoney(weeklyPay);
  weeklyPayEl.textContent = formatMoney(weeklyPay);
  fourWeekPayEl.textContent = formatMoney(weeklyPay * 4);
  monthlyPayEl.textContent = formatMoney(weeklyPay * 52 / 12);
  annualPayEl.textContent = formatMoney(weeklyPay * 52);

  updateBreakdown(selectedDays);
  saveState();
}

function resetPlanner() {
  daysGrid.querySelectorAll("input").forEach(input => {
    input.checked = false;
  });

  hourlyRateInput.value = "14";
  update();
}

createDayControls();
loadState();
hourlyRateInput.addEventListener("input", update);
resetBtn.addEventListener("click", resetPlanner);
update();
