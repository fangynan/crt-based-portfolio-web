/* Tic-Tac-Toe rules. Pure functions, no DOM, so they can be tested in Node.
 * A board is an array of 9 strings: 'X', 'O' or '' (index = row * 3 + column). */

export const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],      /* rows */
    [0, 3, 6], [1, 4, 7], [2, 5, 8],      /* columns */
    [0, 4, 8], [2, 4, 6],                 /* diagonals */
];

const CORNERS = [0, 2, 6, 8];
const SIDES = [1, 3, 5, 7];

/* -> { winner: 'X' | 'O' | null, line: [a, b, c] | null, draw: boolean } */
export function evaluate(board) {
    for (const line of LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line, draw: false };
        }
    }
    return { winner: null, line: null, draw: board.every(Boolean) };
}

const emptyCells = (board) => board.reduce((list, value, i) => (value ? list : [...list, i]), []);
const pick = (list, rng) => list[Math.floor(rng() * list.length)];

/* A square that completes a line for `mark`, or -1. */
function completingMove(board, mark) {
    for (const [a, b, c] of LINES) {
        const cells = [a, b, c];
        const owned = cells.filter((i) => board[i] === mark).length;
        const empty = cells.filter((i) => !board[i]);
        if (owned === 2 && empty.length === 1) return empty[0];
    }
    return -1;
}

/* The computer's move: win if it can, block if it must, else centre, corner, side.
 * Deliberately a heuristic and NOT minimax: it plays sensibly but can still be beaten with a fork. */
export function chooseComputerMove(board, mark, rng = Math.random) {
    const free = emptyCells(board);
    if (!free.length) return -1;
    const opponent = mark === 'X' ? 'O' : 'X';

    const win = completingMove(board, mark);
    if (win !== -1) return win;
    const block = completingMove(board, opponent);
    if (block !== -1) return block;
    if (!board[4]) return 4;
    const corners = CORNERS.filter((i) => !board[i]);
    if (corners.length) return pick(corners, rng);
    return pick(SIDES.filter((i) => !board[i]), rng);
}
