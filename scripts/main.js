import {
  initializeLanguageSupport,
  updateLanguage,
  currentLanguage,
} from "./languageSupport.js";
import { checkLoginStatus, handleAuthButtonClick } from "./authentication.js";
import { generateGUID, showErrorMessage } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  const addTaskButton = document.getElementById("add-task-btn");
  const tableBody = document.getElementById("todo-table-body");
  const pageNumbers = document.getElementById("pageNumbers");
  let tasks = [];
  let filteredTasks = [];
  let editingTaskId = null;
  let completedTasks = [];
  let currentPage = 1;
  let pageSize = 5;


  const darkModeIcon = document.getElementById("dark-mode-icon");

  document
    .getElementById("sort-select")
    .addEventListener("change", applyFiltersAndSort);
  document
    .getElementById("status-filter")
    .addEventListener("change", applyFiltersAndSort);
  document
    .getElementById("applyFilters")
    .addEventListener("click", applyFiltersAndSort);
  document
    .getElementById("resetFilters")
    .addEventListener("click", resetFilters);

  initializeLanguageSupport();
  checkLoginStatus();
  handleAuthButtonClick();

  if (darkModeIcon) {
    darkModeIcon.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      if (darkModeIcon.classList.contains("bi-moon")) {
        darkModeIcon.classList.remove("bi-moon");
        darkModeIcon.classList.add("bi-brightness-high");
      } else {
        darkModeIcon.classList.remove("bi-brightness-high");
        darkModeIcon.classList.add("bi-moon");
      }
    });
  }


  async function fetchTasks() {
    try {
      const response = await fetch("data/tasks.json");
      if (!response.ok) {
        throw new Error(
          `Error: ${response.statusText} (Status Code: ${response.status})`
        );
      }
      const data = await response.json();
      tasks = data;
      filteredTasks = tasks;
      renderTasks();
      createPageNumbers();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showErrorMessage(
        "There was an issue fetching the tasks. Please try again later."
      );
    }
  }

  function sortTasks() {
    const sortBy = document.getElementById("sort-select").value;

    filteredTasks.sort((a, b) => {
      if (sortBy === "title") {
        const titleA = (
          a.title[currentLanguage] || a.title["en"]
        ).toLowerCase();
        const titleB = (
          b.title[currentLanguage] || b.title["en"]
        ).toLowerCase();
        return titleA.localeCompare(titleB);
      } else if (sortBy === "status") {
        return a.completed - b.completed;
      }
    });

    currentPage = 1;
    renderTasks();
    createPageNumbers();
  }

  function filterByStatus() {
    const status = document.getElementById("status-filter").value;
    if (status === "all") {
    } else if (status === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (status === "pending") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    }
  }

  function searchTasks() {
    const searchQuery = document
      .getElementById("filterSearch")
      .value.toLowerCase();
    filteredTasks = filteredTasks.filter((task) => {
      const taskTitle = task.title[currentLanguage] || task.title["en"];
      return taskTitle.toLowerCase().includes(searchQuery);
    });
  }

  function applyFiltersAndSort() {
    filteredTasks = [...tasks];
    filterByStatus();
    searchTasks();
    sortTasks();
    currentPage = 1;
    renderTasks();
    createPageNumbers();
  }

  function resetFilters() {
    document.getElementById("sort-select").value = "title";
    document.getElementById("status-filter").value = "all";
    document.getElementById("filterSearch").value = "";
    filteredTasks = tasks;
    currentPage = 1;
    renderTasks();
    createPageNumbers();
  }

  function renderTasks() {
    const todoTableBody = document.getElementById("todo-table-body");
    todoTableBody.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tasksToDisplay = filteredTasks.slice(startIndex, endIndex);

    tasksToDisplay.forEach((task, index) => {
      const taskTitle = task.title[currentLanguage] || task.title["en"];
      todoTableBody.innerHTML += `
            <tr>
                <td>${startIndex + index + 1}</td>
                <td>${taskTitle}</td>
                <td>${
                  task.completed
                    ? currentLanguage === "en"
                      ? "Completed"
                      : "Përfunduar"
                    : currentLanguage === "en"
                    ? "Pending"
                    : "Në pritje"
                }</td>
                <td>
                    <button class="btn btn-warning btn-sm" id="edit-${task.id}">
                        ${currentLanguage === "en" ? "Edit" : "Ndrysho"}
                    </button>
                    <button class="btn btn-danger btn-sm" id="delete-${
                      task.id
                    }">
                        ${currentLanguage === "en" ? "Delete" : "Fshij"}
                    </button>
                    <button class="btn btn-success btn-sm" id="done-${task.id}">
                        ${
                          task.completed
                            ? currentLanguage === "en"
                              ? "Mark as Pending"
                              : "Shëno si Në Pritje"
                            : currentLanguage === "en"
                            ? "Done"
                            : "Mbaro"
                        }
                    </button>
                </td>
            </tr>
        `;
    });

    tasksToDisplay.forEach((task) => {
      const editButton = document.getElementById(`edit-${task.id}`);
      if (editButton) {
        editButton.addEventListener("click", () => editTask(task.id));
      }

      const deleteButton = document.getElementById(`delete-${task.id}`);
      if (deleteButton) {
        deleteButton.addEventListener("click", () => deleteTask(task.id));
      }

      const doneButton = document.getElementById(`done-${task.id}`);
      if (doneButton) {
        doneButton.addEventListener("click", () => toggleStatus(task.id));
      }
    });
  }

  function createPageNumbers() {
    const pages = Math.ceil(tasks.length / pageSize);
    pageNumbers.innerHTML = "";

    for (let i = 1; i <= pages; i++) {
      pageNumbers.innerHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="javascript:void(0);" onclick="goToPage(${i})">${i}</a>
            </li>
        `;
    }
  }

  window.goToPage = function (page) {
    currentPage = page;
    renderTasks();
    createPageNumbers();
  };

  addTaskButton.addEventListener("click", (event) => {
    event.preventDefault();

    const taskTitleInput = document.getElementById("task-name").value.trim();

    if (taskTitleInput) {
      if (editingTaskId) {
        const taskToUpdate = tasks.find((task) => task.id === editingTaskId);
        if (taskToUpdate) {
          taskToUpdate.title[currentLanguage] = taskTitleInput;
        }

        resetForm();
      } else {
        const newTask = {
          id: generateGUID(),
          title: { [currentLanguage]: taskTitleInput },
          completed: false,
        };

        tasks.push(newTask);
        filteredTasks = [...tasks];

        const totalPages = Math.ceil(filteredTasks.length / pageSize);
        currentPage = totalPages;
      }

      renderTasks();
      createPageNumbers();
    }

    document.getElementById("task-name").value = "";
  });

  function editTask(id) {
    const taskToEdit = tasks.find((task) => task.id === id);

    if (taskToEdit) {
      document.getElementById("task-name").value =
        taskToEdit.title[currentLanguage] || taskToEdit.title["en"];

      editingTaskId = id;
      addTaskButton.textContent = "Update Task";
      addTaskButton.classList.remove("btn-primary");
      addTaskButton.classList.add("btn-warning");
    }
  }

  function updateTask(id, title) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      task.title = title;
    }
    renderTasks();
    resetForm();
  }

  function resetForm() {
    const taskInput = document.getElementById("task-name");
    if (taskInput) {
      taskInput.value = "";
    }

    addTaskButton.textContent = "Add Task";
    addTaskButton.classList.remove("btn-warning");
    addTaskButton.classList.add("btn-primary");

    editingTaskId = null;
  }

  function doneTask(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      const completedTask = tasks.splice(taskIndex, 1)[0];
      completedTask.completed = true;
      completedTasks.push(completedTask);
    }

    renderTasks();
    console.log("Completed tasks:", completedTasks);
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    filteredTasks = filteredTasks.filter((task) => task.id !== id);
    renderTasks();
    createPageNumbers();
  }

  function toggleStatus(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
    }
    renderTasks();
  }

  window.onload = function () {
    const todoListContainer = document.getElementById("todo-list-container");
    todoListContainer.classList.add("loaded");
  };

  fetchTasks();
});