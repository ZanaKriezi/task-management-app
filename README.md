# task-management-app

A responsive task management application built with HTML, CSS, and JavaScript.  
The app allows users to manage tasks, filter and sort them, toggle dark mode, switch languages, and optionally log in or register using localStorage.

## Features
- Add, edit, delete, and complete tasks
- Filter by status and search by name
- Sort by title or status
- Dark mode toggle
- Language switcher
- Optional login/register (stored in localStorage)
- Fully responsive (Bootstrap 5)

## Project Structure
```
Task Management App/
├── index.html
├── login.html
├── style.css
├── data/
│   ├── tasks.json
│   └── translations.json
├── images/
│   └── paper1.jpg
└── scripts/
    ├── authentication.js
    ├── languageSupport.js
    ├── main.js
    └── utils.js
```
## Technologies Used
- HTML5
- CSS3 (custom styles + Bootstrap 5)
- JavaScript (modular ES6)
- localStorage (for login simulation and language preference)

## How to Run
1. Clone or download the repository.
2. Open the `index.html` file in any modern web browser.
3. You can use the app without logging in, or optionally register/login to simulate authentication.
