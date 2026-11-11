/* Tic-Tac-Toe view: wires the markup in includes/panels/arcade.php to the rules in tictactoe-logic.js.
 * Modes: two players on one screen, or you (X) against the computer (O).
 * Returns { enter(), leave() }; the arcade calls leave() whenever the game is hidden, which cancels any pending
 * computer move so nothing fires into a closed panel. */

import { evaluate, chooseComputerMove } from './tictactoe-logic.js';

const COMPUTER_DELAY_MS = 450;
const ROW_COL = (i) => `row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}`;

export function createTicTacToe(root) {
    const cells = [...root.querySelectorAll('[data-ttt-cell]')];
    const modeButtons = [...root.querySelectorAll('[data-ttt-mode]')];
    const statusEl = root.querySelector('[data-ttt-status]');
    const restartButton = root.querySelector('[data-ttt-restart]');
    const scoreEls = {
        X: root.querySelector('[data-ttt-score="X"]'),
        O: root.querySelector('[data-ttt-score="O"]'),
        D: root.querySelector('[data-ttt-score="D"]'),
    };
    const nameEls = { X: root.querySelector('[data-ttt-name="X"]'), O: root.querySelector('[data-ttt-name="O"]') };

    let mode = '2p';                       /* '2p' | 'cpu' */
    let board = Array(9).fill('');
    let turn = 'X';
    let over = false;
    let thinking = false;                  /* true while the computer is "deciding": human clicks are ignored */
    let timer = 0;
    let scores = { X: 0, O: 0, D: 0 };
    let winLine = [];

    const names = () => (mode === 'cpu' ? { X: 'You (X)', O: 'Computer (O)' } : { X: 'Player X', O: 'Player O' });

    function render() {
        cells.forEach((cell, i) => {
            const mark = board[i];
            cell.textContent = mark;
            cell.classList.toggle('is-x', mark === 'X');
            cell.classList.toggle('is-o', mark === 'O');
            cell.classList.toggle('is-win', winLine.includes(i));
            /* aria-disabled (not `disabled`) so keyboard focus is never dropped mid-game */
            cell.setAttribute('aria-disabled', String(Boolean(mark) || over || thinking));
            cell.setAttribute('aria-label', `${ROW_COL(i)}, ${mark ? mark : 'empty'}`);
        });
        const n = names();
        nameEls.X.textContent = mode === 'cpu' ? 'You' : 'X';
        nameEls.O.textContent = mode === 'cpu' ? 'CPU' : 'O';
        scoreEls.X.textContent = scores.X;
        scoreEls.O.textContent = scores.O;
        scoreEls.D.textContent = scores.D;
        modeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.tttMode === mode)));
        root.dataset.state = over ? 'over' : thinking ? 'thinking' : 'playing';

        const result = evaluate(board);
        if (result.winner) statusEl.textContent = `${n[result.winner]} wins!`;
        else if (result.draw) statusEl.textContent = "It's a draw.";
        else if (thinking) statusEl.textContent = 'Computer is thinking…';
        else statusEl.textContent = `${n[turn]}'s turn`;
    }

    function cancelComputer() {
        clearTimeout(timer);
        timer = 0;
        thinking = false;
    }

    function newRound() {
        cancelComputer();
        board = Array(9).fill('');
        turn = 'X';
        over = false;
        winLine = [];
        render();
    }

    function place(index) {
        board[index] = turn;
        const result = evaluate(board);
        if (result.winner) {
            over = true;
            winLine = result.line;
            scores[result.winner] += 1;
        } else if (result.draw) {
            over = true;
            scores.D += 1;
        } else {
            turn = turn === 'X' ? 'O' : 'X';
        }
    }

    function computerTurn() {
        thinking = true;
        render();
        timer = setTimeout(() => {
            timer = 0;
            thinking = false;
            const move = chooseComputerMove(board, 'O');
            if (move !== -1) place(move);
            render();
        }, COMPUTER_DELAY_MS);
    }

    function onCell(index) {
        if (over || thinking || board[index]) return;
        place(index);
        render();
        if (!over && mode === 'cpu' && turn === 'O') computerTurn();
    }

    function setMode(next) {
        if (next === mode) return;
        mode = next;
        scores = { X: 0, O: 0, D: 0 };     /* scores belong to a pairing, so a new mode starts fresh */
        newRound();
    }

    cells.forEach((cell, i) => cell.addEventListener('click', () => onCell(i)));
    modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.tttMode)));
    restartButton.addEventListener('click', () => { newRound(); cells[0].focus({ preventScroll: true }); });

    render();
    return {
        enter() { newRound(); },
        leave() { cancelComputer(); },
    };
}
