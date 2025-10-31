const calendarBody = document.getElementById("calendar-body");
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const eventForm = document.getElementById("event-form");
const eventList = document.getElementById("event-list");
const eventDate = document.getElementById("event-date");
const eventTitle = document.getElementById("event-title");
const eventCategory = document.getElementById("event-category");
const newCategory = document.getElementById("new-category");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function init() {
  for (let m = 0; m < 12; m++) {
    const option = document.createElement("option");
    option.value = m;
    option.text = new Date(0, m).toLocaleString("es", { month: "long" });
    monthSelect.appendChild(option);
  }

  for (let y = 2020; y <= 2030; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.text = y;
    yearSelect.appendChild(option);
  }

  monthSelect.value = currentMonth;
  yearSelect.value = currentYear;

  monthSelect.addEventListener("change", updateCalendar);
  yearSelect.addEventListener("change", updateCalendar);
  eventForm.addEventListener("submit", addEvent);

  updateCalendar();
}

function updateCalendar() {
  currentMonth = parseInt(monthSelect.value);
  currentYear = parseInt(yearSelect.value);
  calendarBody.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");

    for (let j = 1; j <= 7; j++) {
      const cell = document.createElement("td");
      cell.classList.add("day");

      const dayIndex = (j + 6) % 7; // Ajuste para que lunes sea el primer día

      if (i === 0 && dayIndex < firstDay) {
        cell.innerHTML = "";
      } else if (date > daysInMonth) {
        break;
      } else {
        cell.innerHTML = `<span>${date}</span>`;
        const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
        cell.dataset.date = fullDate;

        if (fullDate === new Date().toISOString().split("T")[0]) {
          cell.classList.add("today");
          cell.style.border = "2px solid #0077cc";
        }

        const events = getEvents(fullDate);
        if (events.length > 0) {
          cell.classList.add("has-event");
          cell.style.backgroundColor = "#e6f3ff";
        }

        cell.addEventListener("click", () => showEvents(fullDate));
        date++;
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

function addEvent(e) {
  e.preventDefault();
  const date = eventDate.value;
  const title = eventTitle.value;
  let category = eventCategory.value;

  if (newCategory.value.trim()) {
    category = newCategory.value.trim();
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    eventCategory.appendChild(option);
    newCategory.value = "";
  }

  const events = getEvents(date);
  events.push({ title, category });
  localStorage.setItem(date, JSON.stringify(events));
  updateCalendar();
  showEvents(date);
  eventForm.reset();
}

function getEvents(date) {
  return JSON.parse(localStorage.getItem(date)) || [];
}

function showEvents(date) {
  const events = getEvents(date);
  eventList.innerHTML = "";
  events.forEach(ev => {
    const li = document.createElement("li");
    li.textContent = `${ev.title} (${ev.category})`;
    eventList.appendChild(li);
  });
}

init();
