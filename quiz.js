// quiz.js (ES module)
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const setName = params.get('set');        // e.g. "numbers-1"
const doShuffle = params.get('rand') === '1';

const title = $('title');
const q = $('question');
const a = $('answer');
const r = $('result');
const btn = $('action');

let qs = [];
let i = 0;
let checked = false;
let score = 0;

function shuffle(arr){
  for (let k = arr.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [arr[k], arr[j]] = [arr[j], arr[k]];
  }
  return arr;
}

function setHeading(label){
  document.getElementById('title').textContent = label;
  document.title = label;
}

function showQuestion(){
  q.textContent = `Translate: ${qs[i].en}`;
  a.value = '';
  a.disabled = false;
  a.focus();
  r.textContent = '';
  r.className = '';
  checked = false;
  btn.textContent = 'Submit';
}

function check(){
  if (checked) { next(); return; } // becomes Next after feedback
  const user = a.value.trim().toLowerCase();
  if (!user) return;
  const correct = qs[i].es;
  if (user === correct){
    r.textContent = '✅ Correct!';
    r.className = 'ok';
    score++;
  } else {
    r.textContent = `❌ It’s “${correct}”`;
    r.className = 'bad';
  }
  checked = true;
  a.disabled = true;
  btn.textContent = (i === qs.length - 1) ? 'Finish' : 'Next';
}

function next(){
  if (!checked) return;
  i++;
  if (i >= qs.length){
    q.textContent = '🎉 Quiz complete!';
    r.textContent = `Your score: ${score} / ${qs.length}`;
    r.className = '';
    a.style.display = 'none';
    btn.textContent = 'Restart';
    btn.onclick = () => location.reload();
    return;
  }
  showQuestion();
}

btn.onclick = check;
a.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    e.preventDefault();
    check();
  }
});

async function main(){
  if (!setName){
    setHeading('No set specified');
    q.textContent = 'Add ?set=numbers-1 to the URL.';
    a.style.display = 'none';
    btn.style.display = 'none';
    return;
  }
  try{
    const res = await fetch(`data/${setName}.json`);
    if (!res.ok) throw new Error('Not found');
    qs = await res.json();
    if (doShuffle) shuffle(qs);

    // Title mapping
    const titles = {
      'numbers-1': 'Numbers · Level 1 (1–10)',
      'numbers-2': 'Numbers · Level 2 (11–20)',
      'dop-1':     'Direct Object Pronouns · L1'
    };
    setHeading(titles[setName] || setName);

    showQuestion();
  } catch(e){
    setHeading('Set not found');
    q.textContent = 'Could not load this quiz set.';
    a.style.display = 'none';
    btn.style.display = 'none';
  }
}

main();
// Show questions on the page
function showSession(sessionQs) {
  const container = document.getElementById("quiz");
  container.innerHTML = ""; // clear old questions

  sessionQs.forEach(q => {
    const div = document.createElement("div");
    div.textContent = q.en + " → ?";
    container.appendChild(div);
  });
}

// Example run
let sessionNum = 0;
let session = generateSession(1, sessionNum);
showSession(session);

