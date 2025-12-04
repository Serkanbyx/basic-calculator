# Basic Calculator

A simple, efficient, and clean basic calculator web application.

## Features

- **Arithmetic Operations**: Addition (+), Subtraction (-), Multiplication (×), Division (÷).
- **Decimal Handling**: Supports decimal numbers.
- **Input Editing**: Clear All (AC) and Backspace (DEL) functionality.
- **Keyboard Support**: Type numbers and operators directly from your keyboard.
- **Error Handling**: Prevents invalid operations like division by zero.
- **Safe Parsing**: Uses a custom tokenizer and parser (Shunting-yard algorithm) instead of `eval()` for security and control.

## Supported Operations & Keys

| Operation | Button | Keyboard Key |
|-----------|--------|--------------|
| Add       | +      | +            |
| Subtract  | -      | -            |
| Multiply  | ×      | *            |
| Divide    | ÷      | /            |
| Calculate | =      | Enter / =    |
| Delete    | DEL    | Backspace    |
| Clear All | AC     | Escape       |
| Decimal   | .      | .            |

## Technologies Used

- HTML5
- CSS3 (Custom Variables, Flexbox, Grid)
- JavaScript (ES6+, Custom Parser)

## Setup

1. Clone the repository.
2. Open `index.html` in your browser.

