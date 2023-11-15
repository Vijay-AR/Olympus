// Main Content Display Toggle
const mainContent = document.getElementById("mainContent");
const loginForm = document.getElementById("loginForm");
let expenseCounter = 1;

document.getElementById("userForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "user" && password === "user") {
        loginForm.style.display = "none";
        mainContent.style.display = "block";
    } else {
        alert("Invalid username or password");
    }
});

// Expense Form
const expenseCategorySelect = document.getElementById("expenseCategory");
const customExpenseTypeLabel = document.getElementById("customExpenseTypeLabel");
const customExpenseTypeInput = document.getElementById("customExpenseType");

expenseCategorySelect.addEventListener("change", function () {
    // Show/hide the custom expense type input based on the selected category
    if (expenseCategorySelect.value === "other") {
        customExpenseTypeLabel.style.display = "block";
        customExpenseTypeInput.style.display = "block";
    } else {
        customExpenseTypeLabel.style.display = "none";
        customExpenseTypeInput.style.display = "none";
    }
});

document.getElementById("expenseForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const expenseName = document.getElementById("expenseName").value;
    const expenseAmount = document.getElementById("expenseAmount").value;
    const expenseCategory = expenseCategorySelect.value;
    const customExpenseType = customExpenseTypeInput.value;

    let selectedCategory = expenseCategory;

    // If the selected category is "other," use the custom expense type
    if (expenseCategory === "other" && customExpenseType.trim() !== "") {
        selectedCategory = customExpenseType.trim();
    }

    if (expenseName && expenseAmount) {
        const expenseList = document.getElementById("expenseList");
        const listItem = document.createElement("li");
        listItem.innerHTML = `${expenseCounter}) ${expenseName} (${selectedCategory}): Rs.${expenseAmount}`;
        expenseList.appendChild(listItem);

        document.getElementById("expenseName").value = "";
        document.getElementById("expenseAmount").value = "";
        expenseCategorySelect.value = "food"; // Reset the category to the default
        customExpenseTypeInput.value = ""; // Reset the custom expense type input

        // Hide the custom expense type input after adding an expense
        customExpenseTypeLabel.style.display = "none";
        customExpenseTypeInput.style.display = "none";

        // Increment the expense counter
        expenseCounter++;
    }
});

const toggleDarkModeButton = document.getElementById("toggleDarkMode");

toggleDarkModeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");

    // Change the button text based on the mode
    toggleDarkModeButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
});

// Add an event listener for the Back to Login button
document.getElementById("backToLogin").addEventListener("click", function () {
    // Display the login form and hide the main content
    loginForm.style.display = "flex"; // Display the login form using flex
    mainContent.style.display = "none";
});
