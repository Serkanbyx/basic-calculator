/**
 * Enhanced Calculator with UX Features
 * - History tracking
 * - Memory functions (MC, MR, M+, M-)
 * - Ripple animations
 * - Sound effects
 * - Haptic feedback
 * - Swipe gestures
 */

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.history = this.loadHistory();
        this.memory = 0;
        this.soundEnabled = this.loadSoundPreference();
        this.sounds = {}; // Initialize empty sounds first
        this.initSounds();
        this.clearSilent(); // Clear without playing sound
    }

    // Clear without sound (for initialization)
    clearSilent() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.inputStarted = false;
        this.resetInput = false;
    }

    // Initialize sound effects
    initSounds() {
        this.sounds = {
            click: this.createTone(800, 0.05),
            operator: this.createTone(600, 0.08),
            equals: this.createTone(1000, 0.1),
            error: this.createTone(200, 0.15),
            clear: this.createTone(400, 0.1)
        };
    }

    // Create a simple tone using Web Audio API
    createTone(frequency, duration) {
        return () => {
            if (!this.soundEnabled) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                // Audio not supported
            }
        };
    }

    // Haptic feedback for mobile devices
    triggerHaptic(type = 'light') {
        if (!navigator.vibrate) return;
        
        const patterns = {
            light: [10],
            medium: [20],
            heavy: [30],
            error: [50, 30, 50],
            success: [10, 50, 10]
        };
        
        navigator.vibrate(patterns[type] || patterns.light);
    }

    // Play sound effect
    playSound(type) {
        if (this.sounds[type]) {
            this.sounds[type]();
        }
    }

    // Toggle sound on/off
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundPreference();
        return this.soundEnabled;
    }

    // Save/Load sound preference
    saveSoundPreference() {
        localStorage.setItem('calculatorSound', this.soundEnabled);
    }

    loadSoundPreference() {
        const saved = localStorage.getItem('calculatorSound');
        return saved === null ? true : saved === 'true';
    }

    // History management
    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: Date.now()
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        this.saveHistory();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem('calculatorHistory')) || [];
        } catch {
            return [];
        }
    }

    // Memory functions
    memoryClear() {
        this.memory = 0;
        this.playSound('clear');
        this.triggerHaptic('light');
    }

    memoryRecall() {
        if (this.memory !== 0) {
            this.currentOperand = this.memory.toString();
            this.inputStarted = true;
            this.resetInput = false;
            this.playSound('click');
            this.triggerHaptic('light');
        }
    }

    memoryAdd() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.memory += current;
            this.playSound('operator');
            this.triggerHaptic('medium');
        }
    }

    memorySubtract() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.memory -= current;
            this.playSound('operator');
            this.triggerHaptic('medium');
        }
    }

    getMemory() {
        return this.memory;
    }

    hasMemory() {
        return this.memory !== 0;
    }

    // Core calculator functions
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.inputStarted = false;
        this.resetInput = false;
        this.playSound('clear');
        this.triggerHaptic('light');
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
        this.playSound('click');
        this.triggerHaptic('light');
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
            if (this.currentOperand === '0' && number === '.') {
                this.currentOperand = '0.';
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }
        this.inputStarted = true;
        this.playSound('click');
        this.triggerHaptic('light');
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;

        this.playSound('operator');
        this.triggerHaptic('medium');

        if (this.resetInput) {
            this.resetInput = false;
            this.previousOperand = this.currentOperand + ' ' + operation;
            this.currentOperand = '0';
            this.inputStarted = false;
            return;
        }

        if (!this.inputStarted && this.previousOperand !== '') {
            const lastChar = this.previousOperand.slice(-1);
            if ('+-*/'.includes(lastChar) || this.previousOperand.trim().match(/[\+\-\*\/]$/)) {
                let parts = this.previousOperand.trim().split(' ');
                if ('+-*/'.includes(parts[parts.length - 1])) {
                    parts.pop();
                    parts.push(operation);
                    this.previousOperand = parts.join(' ');
                    return;
                }
            }
        }

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
            expressionToParse = `${this.previousOperand} ${this.currentOperand}`;
        } else {
            expressionToParse = this.currentOperand;
        }

        try {
            const result = this.evaluateExpression(expressionToParse);
            
            // Add to history before updating display
            if (this.previousOperand) {
                this.addToHistory(expressionToParse, result.toString());
            }
            
            this.currentOperand = result.toString();
            this.previousOperand = '';
            this.resetInput = true;
            this.inputStarted = false;
            this.playSound('equals');
            this.triggerHaptic('success');
        } catch (error) {
            this.currentOperand = 'Error';
            this.previousOperand = '';
            this.resetInput = true;
            this.playSound('error');
            this.triggerHaptic('error');
        }
    }

    evaluateExpression(expr) {
        const tokens = this.tokenize(expr);
        if (tokens.length === 0) return 0;
        const rpn = this.shuntingYard(tokens);
        return this.evaluateRPN(rpn);
    }

    tokenize(expr) {
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

                if (a === undefined && b === undefined) return;

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
        return parseFloat(result.toPrecision(12)) / 1;
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        this.previousOperandTextElement.innerText = this.previousOperand;
    }
}

// ============================================
// UI Controller
// ============================================

class UIController {
    constructor(calculator) {
        this.calculator = calculator;
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');
        this.displayContainer = document.getElementById('display-container');
        this.memoryIndicator = document.getElementById('memory-indicator');
        this.memoryValue = document.getElementById('memory-value');
        
        this.initEventListeners();
        this.initSwipeGesture();
        this.initHistoryPanelSwipe();
        this.updateHistoryUI();
        this.updateMemoryUI();
        this.updateSoundUI();
    }

    initEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e);
                this.calculator.appendNumber(button.getAttribute('data-number'));
                this.calculator.updateDisplay();
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e);
                this.calculator.chooseOperation(button.getAttribute('data-operator'));
                this.calculator.updateDisplay();
            });
        });

        // Equals button
        document.querySelector('[data-action="calculate"]').addEventListener('click', (e) => {
            this.createRipple(e);
            this.calculator.calculate();
            this.calculator.updateDisplay();
            this.updateHistoryUI();
        });

        // Clear button
        document.querySelector('[data-action="clear"]').addEventListener('click', (e) => {
            this.createRipple(e);
            this.calculator.clear();
            this.calculator.updateDisplay();
        });

        // Delete button
        document.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            this.createRipple(e);
            this.calculator.delete();
            this.calculator.updateDisplay();
        });

        // Memory buttons
        document.querySelectorAll('[data-memory]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e);
                const action = button.getAttribute('data-memory');
                
                switch(action) {
                    case 'mc':
                        this.calculator.memoryClear();
                        break;
                    case 'mr':
                        this.calculator.memoryRecall();
                        break;
                    case 'm+':
                        this.calculator.memoryAdd();
                        break;
                    case 'm-':
                        this.calculator.memorySubtract();
                        break;
                }
                
                this.calculator.updateDisplay();
                this.updateMemoryUI();
            });
        });

        // History toggle
        document.getElementById('history-toggle').addEventListener('click', () => {
            this.toggleHistory();
        });

        // Close history button
        document.getElementById('close-history').addEventListener('click', () => {
            this.closeHistory();
        });

        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => {
            this.calculator.clearHistory();
            this.updateHistoryUI();
            this.calculator.playSound('clear');
        });

        // Sound toggle
        document.getElementById('sound-toggle').addEventListener('click', () => {
            const enabled = this.calculator.toggleSound();
            this.updateSoundUI();
            if (enabled) {
                this.calculator.playSound('click');
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            
            if (key >= '0' && key <= '9' || key === '.') {
                this.calculator.appendNumber(key);
                this.calculator.updateDisplay();
            } else if (['+', '-', '*', '/'].includes(key)) {
                this.calculator.chooseOperation(key);
                this.calculator.updateDisplay();
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                this.calculator.calculate();
                this.calculator.updateDisplay();
                this.updateHistoryUI();
            } else if (key === 'Backspace') {
                this.calculator.delete();
                this.calculator.updateDisplay();
            } else if (key === 'Escape') {
                // Close history if open, otherwise clear
                if (this.historyPanel.classList.contains('open')) {
                    this.toggleHistory();
                } else {
                    this.calculator.clear();
                    this.calculator.updateDisplay();
                }
            }
        });
    }

    // Ripple effect
    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // Swipe gesture for delete
    initSwipeGesture() {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        // Show hint on mobile
        if ('ontouchstart' in window) {
            this.displayContainer.classList.add('show-hint');
            setTimeout(() => {
                this.displayContainer.classList.remove('show-hint');
            }, 3000);
        }

        this.displayContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });

        this.displayContainer.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const diffX = startX - e.touches[0].clientX;
            const diffY = Math.abs(startY - e.touches[0].clientY);
            
            // Only trigger if horizontal swipe is significant and vertical is minimal
            if (diffX > 30 && diffY < 50) {
                isSwiping = true;
                this.displayContainer.classList.add('swiping');
            }
        }, { passive: true });

        this.displayContainer.addEventListener('touchend', () => {
            if (isSwiping) {
                this.calculator.delete();
                this.calculator.updateDisplay();
                
                // Shake animation
                const currentOperand = document.getElementById('current-operand');
                currentOperand.classList.add('shake');
                setTimeout(() => {
                    currentOperand.classList.remove('shake');
                }, 400);
            }
            
            this.displayContainer.classList.remove('swiping');
            startX = 0;
            startY = 0;
            isSwiping = false;
        });
    }

    // Swipe gesture for history panel close
    initHistoryPanelSwipe() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        const threshold = 80; // pixels to trigger close

        const handleStart = (clientX) => {
            if (!this.historyPanel.classList.contains('open')) return;
            startX = clientX;
            currentX = clientX;
            isDragging = true;
            this.historyPanel.classList.add('dragging');
        };

        const handleMove = (clientX) => {
            if (!isDragging) return;
            currentX = clientX;
            const diff = currentX - startX;
            
            // Only allow dragging to the right (positive diff)
            if (diff > 0) {
                this.historyPanel.style.transform = `translateX(${diff}px)`;
            }
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            this.historyPanel.classList.remove('dragging');
            
            const diff = currentX - startX;
            
            if (diff > threshold) {
                // Close the panel
                this.closeHistory();
            } else {
                // Snap back
                this.historyPanel.style.transform = '';
            }
            
            startX = 0;
            currentX = 0;
        };

        // Touch events
        this.historyPanel.addEventListener('touchstart', (e) => {
            handleStart(e.touches[0].clientX);
        }, { passive: true });

        this.historyPanel.addEventListener('touchmove', (e) => {
            handleMove(e.touches[0].clientX);
        }, { passive: true });

        this.historyPanel.addEventListener('touchend', handleEnd);
        this.historyPanel.addEventListener('touchcancel', handleEnd);

        // Mouse events for desktop testing
        this.historyPanel.addEventListener('mousedown', (e) => {
            handleStart(e.clientX);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                handleMove(e.clientX);
            }
        });

        document.addEventListener('mouseup', handleEnd);
    }

    // Toggle history panel
    toggleHistory() {
        if (this.historyPanel.classList.contains('open')) {
            this.closeHistory();
        } else {
            this.openHistory();
        }
    }

    // Open history panel
    openHistory() {
        this.historyPanel.style.transform = '';
        this.historyPanel.classList.add('open');
        document.getElementById('history-toggle').classList.add('active');
    }

    // Close history panel
    closeHistory() {
        this.historyPanel.style.transform = '';
        this.historyPanel.classList.remove('open');
        document.getElementById('history-toggle').classList.remove('active');
        this.calculator.playSound('click');
    }

    // Update history UI
    updateHistoryUI() {
        const history = this.calculator.history;
        
        if (history.length === 0) {
            this.historyList.innerHTML = '<div class="history-empty">No history yet</div>';
            return;
        }

        this.historyList.innerHTML = history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${this.escapeHtml(item.expression)}</div>
                <div class="history-result">= ${this.escapeHtml(item.result)}</div>
            </div>
        `).join('');

        // Add click handlers to history items
        this.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                const historyItem = history[index];
                
                // Use the result of the history item
                this.calculator.currentOperand = historyItem.result;
                this.calculator.previousOperand = '';
                this.calculator.inputStarted = true;
                this.calculator.resetInput = true;
                this.calculator.updateDisplay();
                this.calculator.playSound('click');
                this.calculator.triggerHaptic('light');
                
                // Close history panel
                this.toggleHistory();
            });
        });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Update memory UI
    updateMemoryUI() {
        const hasMemory = this.calculator.hasMemory();
        
        if (hasMemory) {
            this.memoryIndicator.classList.add('visible');
            this.memoryValue.textContent = this.formatNumber(this.calculator.getMemory());
        } else {
            this.memoryIndicator.classList.remove('visible');
        }

        // Update MR and MC button states
        const mrBtn = document.querySelector('[data-memory="mr"]');
        const mcBtn = document.querySelector('[data-memory="mc"]');
        
        mrBtn.disabled = !hasMemory;
        mcBtn.disabled = !hasMemory;
    }

    // Format number for display
    formatNumber(num) {
        if (Math.abs(num) >= 1e9) {
            return num.toExponential(2);
        }
        return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
    }

    // Update sound toggle UI
    updateSoundUI() {
        const soundBtn = document.getElementById('sound-toggle');
        const soundOn = soundBtn.querySelector('.sound-on');
        const soundOff = soundBtn.querySelector('.sound-off');
        
        if (this.calculator.soundEnabled) {
            soundOn.classList.remove('hidden');
            soundOff.classList.add('hidden');
            soundBtn.classList.add('active');
        } else {
            soundOn.classList.add('hidden');
            soundOff.classList.remove('hidden');
            soundBtn.classList.remove('active');
        }
    }
}

// ============================================
// Initialize Application
// ============================================

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
const ui = new UIController(calculator);

// Initial display update
calculator.updateDisplay();
