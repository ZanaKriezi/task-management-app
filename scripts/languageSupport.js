let translations = {};
let currentLanguage = "en";

export function updateDropdown(lang) {
  const languageDropdown = document.getElementById("languageDropdown");
  if (lang === "en") {
    languageDropdown.innerHTML = `
            <img src="https://flagcdn.com/w40/us.png" alt="English" class="flag-icon me-2"> English
        `;
  } else if (lang === "al") {
    languageDropdown.innerHTML = `
            <img src="https://flagcdn.com/w40/al.png" alt="Albanian" class="flag-icon me-2"> Shqip
        `;
  }
}

export function updateLanguage(lang) {
  currentLanguage = lang;

  if (!translations || !translations[lang]) {
    console.error(`Translations for ${lang} not found.`);
    return;
  }

  updateDropdown(lang);

  document.querySelector("h1").textContent =
    translations[lang].title || "Default Title";
  document.getElementById("add-task-btn").textContent =
    translations[lang].addTask || "Add Task";
  document.getElementById("auth-btn").textContent =
    localStorage.getItem("loggedIn") === "true"
      ? translations[lang].logout || "Logout"
      : translations[lang].login || "Login";

  document.querySelector('label[for="filterSearch"]').textContent =
    translations[lang].searchByWord || "Search by word";
  document
    .getElementById("filterSearch")
    .setAttribute(
      "placeholder",
      translations[lang].searchPlaceholder || "Enter task name to search"
    );
  document.getElementById("applyFilters").textContent =
    translations[lang].applyFilters || "Apply";
  document.getElementById("resetFilters").textContent =
    translations[lang].resetFilters || "Reset";
  document.querySelector('label[for="status-filter"]').textContent =
    translations[lang].filterByStatus || "Filter By Status:";
  document.querySelector('label[for="sort-select"]').textContent =
    translations[lang].sortBy || "Sort By:";

  document.querySelector('#status-filter option[value="all"]').textContent =
    translations[lang].all || "All";
  document.querySelector(
    '#status-filter option[value="completed"]'
  ).textContent = translations[lang].completed || "Completed";
  document.querySelector('#status-filter option[value="pending"]').textContent =
    translations[lang].pending || "Pending";
  document.querySelector('#sort-select option[value="title"]').textContent =
    translations[lang].sortTitle || "Title";
  document.querySelector('#sort-select option[value="status"]').textContent =
    translations[lang].sortStatus || "Status";

  const tableHeaders = translations[lang].tableHeaders || {};
  const headers = document.querySelectorAll(".table-dark th");
  if (headers.length === 4) {
    headers[0].textContent = tableHeaders.id || "#";
    headers[1].textContent = tableHeaders.task || "Your Task";
    headers[2].textContent = tableHeaders.status || "Status";
    headers[3].textContent = tableHeaders.actions || "Actions";
  }

  if (typeof renderTasks === "function") {
    renderTasks();
  }
}

export function initializeLanguageSupport() {
  fetch("data/translations.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      translations = data;
      const savedLanguage = localStorage.getItem("language") || "en";
      updateLanguage(savedLanguage);
    })
    .catch((error) => console.error("Error loading translations:", error));

  document.getElementById("lang-en").addEventListener("click", (e) => {
    e.preventDefault();
    updateLanguage("en");
    localStorage.setItem("language", "en");
  });

  document.getElementById("lang-al").addEventListener("click", (e) => {
    e.preventDefault();
    updateLanguage("al");
    localStorage.setItem("language", "al");
  });
}

export { currentLanguage };
