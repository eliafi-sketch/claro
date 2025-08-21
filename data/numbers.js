// Pools of numbers
const pools = {
  1: Array.from({ length: 10 }, (_, i) => i + 1),   // 1–10
  2: Array.from({ length: 10 }, (_, i) => i + 11),  // 11–20
  3: Array.from({ length: 10 }, (_, i) => i + 21),  // 21–30 etc.
};

// Ratios for blending new pool into old pool
const ratios = [
  { old: 1.0, next: 0.0 },
  { old: 0.8, next: 0.2 },
  { old: 0.6, next: 0.4 },
  { old: 0.4, next: 0.6 },
  { old: 0.2, next: 0.8 },
  { old: 0.0, next: 1.0 },
];

// Memory tracking object
// Example entry: { interval: 2, due: 3 }
let memory = {};

// Helper: pick `n` random items from an array
function sample(array, n) {
  const copy = [...array];
  const result = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

// Shuffle array
function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// Generate one session (10 questions)
function generateSession(poolId, sessionNumber) {
  const prevPool = pools[poolId];
  const nextPool = pools[poolId + 1];
  const ratio = ratios[Math.min(sessionNumber, ratios.length - 1)];

  const oldCount = Math.round(10 * ratio.old);
  const newCount = 10 - oldCount;

  const oldQs = sample(prevPool, oldCount);
  const newQs = nextPool ? sample(nextPool, newCount) : [];

  let sessionQs = [...oldQs, ...newQs];

  // Apply spaced repetition: include any items that are "due"
  let dueQs = Object.keys(memory)
    .filter(num => memory[num].due <= sessionNumber)
    .map(Number);

  // Make sure due items show up (replacing random ones if needed)
  sessionQs = shuffle([...new Set([...sessionQs, ...dueQs])]).slice(0, 10);

  return sessionQs;
}

// Update memory after a session
// answers = { number: true/false }
function updateMemory(answers, currentSession) {
  for (let num in answers) {
    num = Number(num);
    const correct = answers[num];

    if (!memory[num]) {
      memory[num] = { interval: 1, due: currentSession + 1 };
    }

    if (correct) {
      memory[num].interval = memory[num].interval * 2; // double interval
      memory[num].due = currentSession + memory[num].interval;
    } else {
      memory[num].interval = 1; // reset
      memory[num].due = currentSession + 1;
    }
  }
}

// Example usage
let sessionNum = 0;

// Session 1: only 1–10
let q1 = generateSession(1, sessionNum);
console.log("Session 1:", q1);

// Pretend answers (simulate wrong on number 3)
updateMemory({ 1: true, 2: true, 3: false, 4: true }, sessionNum);

// Next session
sessionNum++;
let q2 = generateSession(1, sessionNum);
console.log("Session 2:", q2);
