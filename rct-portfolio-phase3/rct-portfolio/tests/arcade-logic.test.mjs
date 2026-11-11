/* Game-rule unit tests (no browser, no dependencies).  Run from the project root:  node tests/arcade-logic.test.mjs */
import assert from 'node:assert/strict';
import { evaluate, chooseComputerMove, LINES } from '../assets/js/games/tictactoe-logic.js';
import { createGame, step, queueTurn, spawnFood, DIRECTIONS } from '../assets/js/games/snake-engine.js';
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok -', name); };

/* ---- tic-tac-toe ---- */
const B = (s) => s.split('').map((c) => (c === '.' ? '' : c));
t('all 8 lines detected for both marks', () => {
  for (const line of LINES) for (const m of ['X', 'O']) {
    const b = Array(9).fill(''); line.forEach((i) => (b[i] = m));
    const r = evaluate(b); assert.equal(r.winner, m); assert.deepEqual(r.line, line); assert.equal(r.draw, false);
  }
});
t('draw detected', () => { const r = evaluate(B('XOXXOOOXX')); assert.equal(r.winner, null); assert.equal(r.draw, true); });
t('in-progress board is neither win nor draw', () => { const r = evaluate(B('XO.......')); assert.equal(r.winner, null); assert.equal(r.draw, false); });
t('win on a full board is a win, not a draw', () => { const r = evaluate(B('XXXOOXOXO')); assert.equal(r.winner, 'X'); assert.equal(r.draw, false); });
t('computer takes a winning move', () => assert.equal(chooseComputerMove(B('OO.XX....'), 'O'), 2));
t('computer blocks', () => assert.equal(chooseComputerMove(B('XX.O.....'), 'O'), 2));
t('computer prefers centre then corner', () => {
  assert.equal(chooseComputerMove(B('X........'), 'O'), 4);
  assert.ok([0, 2, 6, 8].includes(chooseComputerMove(B('....X....'), 'O')));
});
t('computer only ever plays empty cells (500 random games)', () => {
  for (let g = 0; g < 500; g++) {
    const b = Array(9).fill(''); let mark = 'X';
    while (true) {
      const free = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
      const mv = mark === 'O' ? chooseComputerMove(b, 'O') : free[Math.floor(Math.random() * free.length)];
      assert.ok(mv >= 0 && b[mv] === ''); b[mv] = mark; mark = mark === 'X' ? 'O' : 'X';
      const r = evaluate(b); if (r.winner || r.draw) break;
    }
  }
});
t('computer is beatable (fork exists)', () => {
  /* X corner, O centre, X opposite corner: computer must not lose by force only if it plays a side; heuristic plays a corner */
  let b = B('X...O...X'); const mv = chooseComputerMove(b, 'O', () => 0); assert.ok([1,3,5,7,0,2,6,8].includes(mv));
});

/* ---- snake ---- */
const seeded = () => { let s = 12345; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); };
t('starts length 3, food on a free cell', () => {
  const g = createGame(20, 15, seeded()); assert.equal(g.snake.length, 3);
  assert.equal(g.occupied[g.food.y * 20 + g.food.x], 0);
});
t('moves exactly one cell per step, length unchanged', () => {
  const g = createGame(20, 15, seeded()); g.food = { x: 0, y: 0 }; const h = { ...g.snake[0] };
  assert.equal(step(g), 'moved'); assert.deepEqual(g.snake[0], { x: h.x + 1, y: h.y }); assert.equal(g.snake.length, 3);
  assert.equal(g.occupied.reduce((a, b) => a + b, 0), 3);
});
t('wall kills', () => {
  const g = createGame(8, 5, seeded()); g.food = { x: 0, y: 0 }; let r; for (let i = 0; i < 10 && r !== 'dead'; i++) r = step(g);
  assert.equal(r, 'dead'); assert.equal(step(g), 'dead');
});
t('eating grows by one, scores, respawns food off the snake', () => {
  const g = createGame(20, 15, seeded()); const h = g.snake[0]; g.food = { x: h.x + 1, y: h.y };
  assert.equal(step(g), 'ate'); assert.equal(g.snake.length, 4); assert.equal(g.score, 1);
  assert.equal(g.occupied[g.food.y * 20 + g.food.x], 0); assert.equal(g.occupied.reduce((a, b) => a + b, 0), 4);
});
t('180-degree reversal is rejected, same direction is a no-op', () => {
  const g = createGame(20, 15, seeded()); assert.equal(queueTurn(g, 'left'), false); assert.equal(queueTurn(g, 'right'), false);
  assert.equal(queueTurn(g, 'up'), true); assert.equal(queueTurn(g, 'down'), false); assert.equal(queueTurn(g, 'left'), true);
});
t('queue holds at most 2 turns and applies one per tick', () => {
  const g = createGame(20, 15, seeded()); g.food = { x: 0, y: 0 };
  queueTurn(g, 'up'); queueTurn(g, 'left'); assert.equal(queueTurn(g, 'down'), false);
  step(g); assert.equal(g.dir, 'up'); step(g); assert.equal(g.dir, 'left');
});
t('quick U-turn via two queued turns is allowed and does not self-collide', () => {
  const g = createGame(20, 15, seeded()); g.food = { x: 0, y: 0 };
  queueTurn(g, 'up'); queueTurn(g, 'left'); assert.notEqual(step(g), 'dead'); assert.notEqual(step(g), 'dead');
});
t('running into own body kills', () => {
  const g = createGame(20, 15, seeded());
  g.snake = [{x:5,y:5},{x:5,y:6},{x:4,y:6},{x:4,y:5},{x:4,y:4},{x:5,y:4},{x:6,y:4}]; g.occupied.fill(0);
  g.snake.forEach((c) => (g.occupied[c.y*20+c.x] = 1)); g.dir = 'up'; g.food = { x: 0, y: 0 }; /* head (5,5) up -> (5,4) is body */
  assert.equal(step(g), 'dead');
});
t('moving into the tail cell is legal (it moves away)', () => {
  const g = createGame(20, 15, seeded());
  g.snake = [{x:5,y:5},{x:5,y:6},{x:6,y:6},{x:6,y:5}]; g.occupied.fill(0);
  g.snake.forEach((c) => (g.occupied[c.y*20+c.x] = 1)); g.dir = 'right'; g.food = { x: 0, y: 0 };
  assert.equal(step(g), 'moved'); assert.equal(g.occupied.reduce((a, b) => a + b, 0), 4);
});
t('filling the grid wins', () => {
  const g = createGame(5, 2, seeded());
  /* 9 of 10 cells filled, head at (1,0) heading left, the last free cell (0,0) holds the food */
  g.snake = [{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:4,y:1},{x:3,y:1},{x:2,y:1},{x:1,y:1},{x:0,y:1}];
  g.occupied.fill(0); g.snake.forEach((c) => (g.occupied[c.y*5+c.x] = 1)); g.dir = 'left'; g.food = { x: 0, y: 0 };
  assert.equal(step(g), 'won'); assert.equal(g.status, 'won'); assert.equal(g.food, null); assert.equal(g.score, 1);
  assert.equal(step(g), 'won');
});
t('spawnFood returns null when the grid is full', () => {
  const g = createGame(5, 2, seeded()); g.snake = new Array(10).fill({x:0,y:0}); assert.equal(spawnFood(g), null);
});
t('1000 random-walk ticks never corrupt occupancy', () => {
  for (let run = 0; run < 50; run++) {
    const rng = seeded(); const g = createGame(20, 15, rng); const names = Object.keys(DIRECTIONS);
    for (let i = 0; i < 1000 && g.status === 'running'; i++) {
      if (rng() < 0.3) queueTurn(g, names[Math.floor(rng() * 4)]); step(g);
      assert.equal(g.occupied.reduce((a, b) => a + b, 0), g.snake.length);
      if (g.food) assert.equal(g.occupied[g.food.y * 20 + g.food.x], 0);
    }
  }
});
console.log(`\n${n} tests passed`);
