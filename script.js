class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.inputStarted = false; // Track if user has started typing a number
        this.resetInput = false; // Track if we should reset input on next number
    }

    delete() {
        if (this.resetInput) {
            this.clear();
            return;
        }
        if (this.currentOperand === '0') return;
        
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
            this.inputStarted = false;
        }
    }

    appendNumber(number) {
        if (this.resetInput) {
            this.currentOperand = '';
            this.resetInput = false;
            this.inputStarted = true;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            // Handle scenario where currentOperand is '0' but we are appending '.'
            if (this.currentOperand === '0' && number === '.') {
                this.currentOperand = '0.';
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }
        this.inputStarted = true;
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;

        // If we just calculated, use the result as the starting point for the next operation
        if (this.resetInput) {
            this.resetInput = false;
            this.previousOperand = this.currentOperand + ' ' + operation;
            this.currentOperand = '0';
            this.inputStarted = false;
            return;
        }

        // If user hasn't typed a number yet (currentOperand is default '0')
        // and we have a previous operand (ending with op), replace the operator.
        if (!this.inputStarted && this.previousOperand !== '') {
            // Check if previous operand ends with an operator
            const lastChar = this.previousOperand.slice(-1);
            if ('+-*/'.includes(lastChar) || this.previousOperand.trim().match(/[\+\-\*\/]$/)) {
                // Remove last operator and add new one
                // previousOperand is like "12 +" or "12 + 5 *"
                // We want to replace the last operator.
                // Split by space, replace last element?
                // previousOperand format: "12 +" or "12 + 5 *"
                let parts = this.previousOperand.trim().split(' ');
                if ('+-*/'.includes(parts[parts.length - 1])) {
                    parts.pop(); // Remove old op
                    parts.push(operation); // Add new op
                    this.previousOperand = parts.join(' ');
                    return;
                }
            }
        }

        // Normal case: Append current number and operator
        // If current is just '0' and input not started, maybe treat as 0? Yes.
        if (this.previousOperand !== '') {
            this.previousOperand = `${this.previousOperand} ${this.currentOperand} ${operation}`;
        } else {
            this.previousOperand = `${this.currentOperand} ${operation}`;
        }
        this.currentOperand = '0';
        this.inputStarted = false;
    }

    calculate() {
        if (this.currentOperand === 'Error') return;

        let expressionToParse = '';
        if (this.previousOperand) {
             // Combine previous sequence with current number
             expressionToParse = `${this.previousOperand} ${this.currentOperand}`;
        } else {
            expressionToParse = this.currentOperand;
        }

        try {
            const result = this.evaluateExpression(expressionToParse);
            this.currentOperand = result.toString();
            this.previousOperand = '';
            this.resetInput = true; 
            this.inputStarted = false;
        } catch (error) {
            this.currentOperand = 'Error';
            this.previousOperand = '';
            this.resetInput = true;
        }
    }

    evaluateExpression(expr) {
        const tokens = this.tokenize(expr);
        if (tokens.length === 0) return 0;
        const rpn = this.shuntingYard(tokens);
        return this.evaluateRPN(rpn);
    }

    tokenize(expr) {
        // Regex matches:
        // 1. Numbers: digits, optional decimal, digits. OR decimal then digits.
        // 2. Operators: +, -, *, /
        const regex = /((?:\d+\.?\d*)|(?:\.\d+)|[\+\-\*\/])/g;
        const tokens = [];
        let match;
        while ((match = regex.exec(expr)) !== null) {
            if (match[0].trim()) {
                tokens.push(match[0]);
            }
        }
        return tokens;
    }

    shuntingYard(tokens) {
        const outputQueue = [];
        const operatorStack = [];
        const precedence = {
            '*': 3,
            '/': 3,
            '+': 2,
            '-': 2
        };

        tokens.forEach(token => {
            if (!isNaN(parseFloat(token))) {
                outputQueue.push(parseFloat(token));
            } else if ('+-*/'.includes(token)) {
                while (
                    operatorStack.length > 0 &&
                    precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            }
        });

        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }

        return outputQueue;
    }

    evaluateRPN(rpn) {
        const stack = [];
        rpn.forEach(token => {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                // Safety check for undefined operands (e.g. "5 +")
                if (a === undefined && b === undefined) return; // Should not happen with valid logic
                if (a === undefined) { 
                    // Unary operator case or partial expression? 
                    // For simple binary calc, treat missing 'a' as 0? 
                    // Or 'b' is the only operand?
                    // "5 +" -> Tokens: 5, +. RPN: 5, +. 
                    // Pop b=5. Pop a=undefined.
                    // Let's handle gracefully.
                    // Actually parser assumes valid binary ops.
                    // "5 +" is invalid usually, but here we append currentOperand ('0' if not typed).
                    // So "5 + 0" is evaluating.
                }

                switch (token) {
                    case '+': stack.push((a || 0) + b); break;
                    case '-': stack.push((a || 0) - b); break;
                    case '*': stack.push((a || 0) * b); break;
                    case '/': 
                        if (b === 0) throw new Error("DivByZero");
                        stack.push((a || 0) / b); 
                        break;
                }
            }
        });
        
        if (stack.length === 0) return 0;
        
        const result = stack[0];
        // Fix floating point precision
        return parseFloat(result.toPrecision(12)) / 1; 
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        this.previousOperandTextElement.innerText = this.previousOperand;
    }
}

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Select buttons by data attributes
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="clear"]');

// Add Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operator'));
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.calculate();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9' || key === '.') {
        calculator.appendNumber(key);
        calculator.updateDisplay();
    } else if (['+', '-', '*', '/'].includes(key)) {
        calculator.chooseOperation(key);
        calculator.updateDisplay();
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculator.calculate();
        calculator.updateDisplay();
    } else if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});
