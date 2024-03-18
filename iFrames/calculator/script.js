document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const keys = document.querySelectorAll(".keys button");

  let currentInput = "";
  let currentOperator = "";
  let currentResult = "";

  function appendNumber(num) {
    currentInput += num;
    updateDisplay();
  }

  function appendOperator(operator) {
    if (currentOperator !== "") {
      calculate();
    }
    currentOperator = operator;
    currentResult = currentInput;
    currentInput = "";
    updateDisplay();
  }

  function appendDecimal() {
    if (!currentInput.includes(".")) {
      currentInput += ".";
      updateDisplay();
    }
  }

  function calculate() {
    let result;
    const num1 = parseFloat(currentResult);
    const num2 = parseFloat(currentInput);
    switch (currentOperator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        if (num2 !== 0) {
          result = num1 / num2;
        } else {
          result = "Error";
        }
        break;
      default:
        result = "";
    }
    currentInput = result.toString();
    currentOperator = "";
    updateDisplay();
  }

  function clearDisplay() {
    currentInput = "";
    currentOperator = "";
    currentResult = "";
    updateDisplay();
  }

  function updateDisplay() {
    display.value = currentInput || "0";
  }

  keys.forEach((key) => {
    key.addEventListener("click", function () {
      const keyValue = this.textContent;
      if (key.classList.contains("number")) {
        appendNumber(keyValue);
      } else if (key.classList.contains("operator")) {
        appendOperator(keyValue);
      } else if (key.classList.contains("decimal")) {
        appendDecimal();
      } else if (key.classList.contains("equals")) {
        calculate();
      } else if (key.classList.contains("clear")) {
        clearDisplay();
      }
    });
  });
});
