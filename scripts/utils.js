export function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function showErrorMessage(message) {
    const errorContainer = document.getElementById("error-container");
    errorContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    errorContainer.style.display = "block";
}
