const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("income");
const moneyMinus = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");
const ctx = document.getElementById("myChart").getContext("2d");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseCategories = {};
let myChart;
let monthlyIncomeTarget =
  parseFloat(localStorage.getItem("monthlyIncomeTarget")) || 0;
let monthlyExpenseTarget =
  parseFloat(localStorage.getItem("monthlyExpenseTarget")) || 0;

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a name and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value,
      category: category.value,
    };

    transactions.push(transaction);
    updateExpenseCategories(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateChart();
    updateBudget();

    saveData();

    text.value = "";
    amount.value = "";
    date.value = "";
    category.value = "Salary";
  }
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
        ${transaction.text} <span>${sign}$${Math.abs(
    transaction.amount
  ).toFixed(2)}</span> 
        <span>${transaction.date}</span> 
        <span>(${transaction.category})</span>
        <button class="delete-btn" onclick="removeTransaction(${
          transaction.id
        })">x</button>
    `;

  list.appendChild(item);
}

function updateExpenseCategories(transaction) {
  if (transaction.amount < 0) {
    const categoryName = transaction.category;
    if (!expenseCategories[categoryName]) {
      expenseCategories[categoryName] = 0;
    }
    expenseCategories[categoryName] += Math.abs(transaction.amount);
  }
}

function updateChart() {
  const labels = Object.keys(expenseCategories);
  const data = Object.values(expenseCategories);

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: "doughnut", // Changed to 'doughnut'
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expenses by Category",
          data: data,
          backgroundColor: [
            "#b6f572", // Light Sky Blue
            "#36A2EB", // Amber
            "#FF6384", // Light Green
            "#fa9e49", // Light Red
            "#9966FF", // Purple
          ],
          borderColor: [
            "rgba(135, 206, 250, 1)", // Light Sky Blue
            "rgba(255, 193, 7, 1)", // Amber
            "rgba(76, 175, 80, 1)", // Light Green
            "rgba(255, 82, 82, 1)", // Light Red
            "rgba(156, 39, 176, 1)", // Purple
          ],

          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Expense Distribution",
        },
      },
    },
  });
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  moneyPlus.innerText = `+$${income}`;
  moneyMinus.innerText = `-$${expense}`;
}

const remainingBudgetDisplay = document.getElementById("remaining-budget");
const budgetStatusDisplay = document.getElementById("budget-status");

function updateBudget() {
  const totalExpenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, item) => (acc += Math.abs(item.amount)), 0);

  const remainingBudget = (monthlyIncomeTarget - totalExpenses).toFixed(2);
  remainingBudgetDisplay.innerText = `$${remainingBudget}`;

  if (totalExpenses > monthlyExpenseTarget) {
    budgetStatusDisplay.innerText = "Overspent";
    budgetStatusDisplay.style.color = "red";
  } else {
    budgetStatusDisplay.innerText = "On Budget";
    budgetStatusDisplay.style.color = "green";
  }
}

document
  .getElementById("monthly-income")
  .addEventListener("input", function () {
    monthlyIncomeTarget = parseFloat(this.value) || 0;
    localStorage.setItem("monthlyIncomeTarget", monthlyIncomeTarget);
    updateBudget();
  });

document
  .getElementById("monthly-expense")
  .addEventListener("input", function () {
    monthlyExpenseTarget = parseFloat(this.value) || 0;
    localStorage.setItem("monthlyExpenseTarget", monthlyExpenseTarget);
    updateBudget();
  });

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveData();
  updateValues();
  init();
}

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  resetExpenseCategories();
  updateValues();
  updateChart();
  updateBudget();
}

function resetExpenseCategories() {
  expenseCategories = {};
  transactions.forEach(updateExpenseCategories);
}

init();

form.addEventListener("submit", addTransaction);
