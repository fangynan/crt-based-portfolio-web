/* Snake rules. Pure state + one function per tick, no DOM and no timers, so it can be tested in Node.
 *
 * Classic Nokia behaviour: the snake moves exactly ONE grid cell per call to step(); the walls are deadly;
 * eating food grows the snake by one cell. Positions are integer grid coordinates, never pixels.
 * Collision uses a flat occupancy array, so each tick is O(1) (food spawning scans once per meal). */

export const DIRECTIONS = Object.freeze({
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
});

const MAX_QUEUED_TURNS = 2;

export function createGame(cols, rows, rng = Math.random) {
    const y = Math.floor(rows / 2);
    const snake = [{ x: 4, y }, { x: 3, y }, { x: 2, y }];          /* head first, heading right */
    const occupied = new Uint8Array(cols * rows);
    snake.forEach((cell) => { occupied[cell.y * cols + cell.x] = 1; });

    const game = { cols, rows, rng, snake, occupied, dir: 'right', queue: [], food: null, score: 0, status: 'running' };
    game.food = spawnFood(game);
    return game;
}

/* A random free cell, or null when the snake fills the whole grid. */
export function spawnFood(game) {
    const free = game.cols * game.rows - game.snake.length;
    if (free <= 0) return null;
    let target = Math.floor(game.rng() * free);
    for (let i = 0; i < game.occupied.length; i++) {
        if (game.occupied[i]) continue;
        if (target === 0) return { x: i % game.cols, y: Math.floor(i / game.cols) };
        target--;
    }
    return null;
}

const isOpposite = (a, b) => DIRECTIONS[a].x + DIRECTIONS[b].x === 0 && DIRECTIONS[a].y + DIRECTIONS[b].y === 0;

/* Remember a turn for a coming tick. Turns are validated against the LAST queued direction, so a quick
 * "up then left" works, but a 180-degree reversal into the snake's own neck is impossible. */
export function queueTurn(game, name) {
    if (!(name in DIRECTIONS) || game.queue.length >= MAX_QUEUED_TURNS) return false;
    const last = game.queue.length ? game.queue[game.queue.length - 1] : game.dir;
    if (name === last || isOpposite(name, last)) return false;
    game.queue.push(name);
    return true;
}

/* Advance exactly one cell. Returns 'moved' | 'ate' | 'dead' | 'won'. */
export function step(game) {
    if (game.status !== 'running') return game.status;
    if (game.queue.length) game.dir = game.queue.shift();

    const { x: dx, y: dy } = DIRECTIONS[game.dir];
    const head = game.snake[0];
    const nx = head.x + dx;
    const ny = head.y + dy;

    if (nx < 0 || ny < 0 || nx >= game.cols || ny >= game.rows) return (game.status = 'dead');

    const eating = game.food !== null && nx === game.food.x && ny === game.food.y;
    const tail = game.snake[game.snake.length - 1];
    const index = ny * game.cols + nx;
    /* The tail cell is about to be vacated, so moving into it is legal unless we are growing. */
    const hitsTail = !eating && tail.x === nx && tail.y === ny;
    if (game.occupied[index] && !hitsTail) return (game.status = 'dead');

    if (!eating) {
        game.snake.pop();
        game.occupied[tail.y * game.cols + tail.x] = 0;
    }
    game.snake.unshift({ x: nx, y: ny });
    game.occupied[index] = 1;

    if (!eating) return 'moved';

    game.score += 1;
    game.food = spawnFood(game);
    if (game.food === null) return (game.status = 'won');
    return 'ate';
}
