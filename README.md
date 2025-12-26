# ⚡ Basic Calculator

A modern, secure, and feature-rich calculator application built with vanilla JavaScript. Features a custom Shunting-yard algorithm for safe expression evaluation, calculation history, memory functions, and a beautiful dark theme with smooth animations.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **Secure Calculation Engine**: Uses a custom Shunting-yard algorithm parser instead of `eval()`, ensuring secure and accurate processing of mathematical expressions
- **Calculation History**: View past calculations in a slide-out panel, click to reuse results, persisted in localStorage
- **Memory Functions**: Full memory support with MC (Clear), MR (Recall), M+ (Add), and M- (Subtract) operations
- **Ripple Animations**: Beautiful Material Design-inspired ripple effect on button press
- **Sound Effects**: Satisfying click sounds generated with Web Audio API (toggleable)
- **Haptic Feedback**: Vibration feedback on mobile devices for tactile response
- **Swipe Gestures**: Swipe left on display to delete, swipe right on history panel to close
- **Full Keyboard Support**: Complete keyboard navigation for desktop users
- **Responsive Design**: Optimized layout for both mobile and desktop devices
- **Modern Dark Theme**: Eye-friendly dark interface with gradient backgrounds and smooth transitions

## Live Demo

[🎮 View Live Demo](https://basic-calculatorrrr.netlify.app/)

## Technologies

- **HTML5**: Semantic markup with ARIA labels for accessibility
- **CSS3**: Modern styling with CSS Variables, Flexbox, Grid, and custom animations
- **Vanilla JavaScript (ES6+)**: Object-Oriented architecture with custom tokenizer and RPN evaluator
- **Web Audio API**: Dynamic sound effect generation without external audio files
- **LocalStorage API**: Persistent storage for calculation history and user preferences
- **Vibration API**: Native haptic feedback for mobile devices

## Installation

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Serkanbyx/basic-calculator.git
```

2. **Navigate to the project directory**

```bash
cd basic-calculator
```

3. **Run the application**

You can open the `index.html` file directly in your browser, or use a local server:

**Using Python:**

```bash
python -m http.server 3000
```

**Using Node.js:**

```bash
npx serve
```

**Using VS Code:**

- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

4. **Open in browser**

Navigate to `http://localhost:3000` (or the port shown in your terminal)

## Usage

1. **Basic Calculations**: Click number buttons or use keyboard (0-9) to enter numbers
2. **Operations**: Use +, -, ×, ÷ buttons or keyboard operators (+, -, \*, /)
3. **Calculate**: Press = button or Enter key to see the result
4. **Clear**: AC button or Escape key clears all input
5. **Delete**: DEL button, Backspace key, or swipe left on display to delete last character
6. **View History**: Click the clock icon (top-right) or swipe to open history panel
7. **Use Memory**: MC/MR/M+/M- buttons to store and recall values
8. **Toggle Sound**: Click the speaker icon to enable/disable click sounds

## How It Works?

### Shunting-Yard Algorithm

The calculator uses Dijkstra's Shunting-yard algorithm to safely parse and evaluate mathematical expressions without using JavaScript's `eval()` function:

```javascript
// 1. Tokenize the expression
"12 + 8 * 2" → ["12", "+", "8", "*", "2"]

// 2. Convert to Reverse Polish Notation (RPN)
["12", "+", "8", "*", "2"] → [12, 8, 2, "*", "+"]

// 3. Evaluate RPN using a stack
// Stack operations: push 12, push 8, push 2, pop 2 & 8 → multiply → push 16, pop 16 & 12 → add → push 28
// Result: 28
```

### Operator Precedence

| Operator | Precedence |
| :------: | :--------: |
| `*` `/`  |  3 (High)  |
| `+` `-`  |  2 (Low)   |

### Memory Functions

| Button | Function                                                      |
| :----: | :------------------------------------------------------------ |
| **MC** | Memory Clear - Clears stored memory value                     |
| **MR** | Memory Recall - Retrieves stored value to display             |
| **M+** | Memory Add - Adds current display value to memory             |
| **M−** | Memory Subtract - Subtracts current display value from memory |

## Keyboard Shortcuts

|       Key       | Action                    |
| :-------------: | :------------------------ |
|      `0-9`      | Enter numbers             |
|       `.`       | Decimal point             |
| `+` `-` `*` `/` | Operations                |
| `Enter` or `=`  | Calculate result          |
|   `Backspace`   | Delete last character     |
|    `Escape`     | Clear all / Close history |

## Customization

### Change Theme Colors

Edit the CSS variables in `style.css`:

```css
:root {
  --bg-color: #1a1a2e;
  --calc-body-color: #16213e;
  --display-bg: #0f0f23;
  --btn-bg: #1f4068;
  --accent-color: #e94560;
  --text-color: #eaeaea;
  --memory-color: #4ecca3;
}
```

### Disable Animations

For reduced motion preferences, animations are automatically disabled:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Features in Detail

### Completed Features

- ✅ Basic arithmetic operations (+, -, ×, ÷)
- ✅ Decimal number support
- ✅ Operator precedence (PEMDAS)
- ✅ Calculation history with localStorage persistence
- ✅ Memory functions (MC, MR, M+, M-)
- ✅ Keyboard support
- ✅ Responsive design
- ✅ Ripple animations
- ✅ Sound effects (Web Audio API)
- ✅ Haptic feedback (mobile)
- ✅ Swipe gestures
- ✅ Error handling (division by zero)

### Future Features

- [ ] Parentheses support for grouped expressions
- [ ] Scientific calculator mode (sin, cos, tan, log)
- [ ] Percentage calculations
- [ ] Light/Dark theme toggle
- [ ] PWA support for offline use
- [ ] Export history to CSV

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes using conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Developer

**Serkan Bayraktar**

- 🌐 Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- 💻 GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- 📧 Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- Dijkstra's Shunting-yard algorithm for expression parsing
- Material Design for ripple animation inspiration
- Web Audio API documentation for sound synthesis

## Contact

- 🐛 Found a bug? [Open an issue](https://github.com/Serkanbyx/basic-calculator/issues)
- 📧 Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- 🌐 Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
