const questions = [
  { q:"Your perfect Friday night looks like…", options:["Outside with the squad ✨","Gaming / movie marathon 🎮","Solo reset + good music 🎧","Whatever feels spontaneous ⚡"] },
  { q:"Someone sends you a risky meme. You…", options:["Send an even riskier one 😂","React and move on 😌","Save it for later 👀","Start a whole conversation"] },
  { q:"Pick your default energy.", options:["Main character","Chill observer","Chaotic good","Quietly iconic"] },
  { q:"Your playlist is mostly…", options:["Trending bangers 🔥","Old-school classics","Lo-fi / chill","A completely random mix"] },
  { q:"In a group project, you are the…", options:["Leader","Idea machine","Finisher","Mysterious MVP"] },
  { q:"Your ideal aesthetic is…", options:["Clean & minimal","Dark & futuristic","Colorful & playful","Whatever looks cool"] },
  { q:"When plans suddenly change, you…", options:["Adapt instantly","Need a minute 😭","Make a better plan","Say 'let's see what happens'"] },
  { q:"Choose a superpower.", options:["Teleportation","Mind reading","Time control","Infinite creativity"] },
  { q:"Your friends would describe you as…", options:["The hype one","The dependable one","The funny one","The unpredictable one"] },
  { q:"What matters most in a vibe?", options:["Confidence","Authenticity","Energy","Kindness"] }
];

let current = 0;
let total = 0;
let selected = null;

const quiz = document.getElementById("quiz-container");
const result = document.getElementById("result-container");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");
const optionsBox = document.getElementById("options-container");
const warning = document.getElementById("warning-msg");
const progressText = document.getElementById("question-progress");
const progressFill = document.getElementById("progress-bar-fill");
const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const scorePreview = document.getElementById("score-preview");
const finalScore = document.getElementById("final-score");
const ringScore = document.getElementById("ring-score");
const ring = document.querySelector(".score-ring");
const levelTitle = document.getElementById("aura-level-title");
const levelDesc = document.getElementById("aura-level-desc");
const toast = document.getElementById("toast");

function scrollToQuiz(){
  quiz.hidden = false;
  result.hidden = true;
  quiz.scrollIntoView({behavior:"smooth", block:"start"});
  renderQuestion();
}

function renderQuestion(){
  const item = questions[current];
  selected = null;
  warning.hidden = true;
  progressText.textContent = `Question ${current + 1} of ${questions.length}`;
  progressFill.style.width = `${((current + 1) / questions.length) * 100}%`;
  questionNumber.textContent = String(current + 1).padStart(2,"0");
  questionText.textContent = item.q;
  scorePreview.textContent = `${total} pts`;
  nextBtn.innerHTML = current === questions.length - 1 ? `Reveal My Aura <span>✦</span>` : `Next Question <span>→</span>`;
  optionsBox.innerHTML = "";

  item.options.forEach((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.innerHTML = `<span>${text}</span><span class="option-mark">${String.fromCharCode(65 + index)}</span>`;
    button.addEventListener("click", () => {
      document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
      button.classList.add("selected");
      selected = index;
      warning.hidden = true;
    });
    optionsBox.appendChild(button);
  });
}

function finishQuiz(){
  const score = Math.max(0, Math.min(100, total));
  finalScore.textContent = score;
  ringScore.textContent = score;
  const degrees = score * 3.6;
  ring.style.background = `conic-gradient(var(--accent) ${degrees}deg, #292530 ${degrees}deg)`;

  let title, desc;
  if(score >= 85){
    title = "👑 ULTRA AURA";
    desc = "You don't enter the vibe — you create it. Maximum confidence, creativity and main-character energy.";
  } else if(score >= 70){
    title = "🔥 PRO AURA";
    desc = "Your vibe is seriously strong. You know yourself, bring good energy and make ordinary moments memorable.";
  } else if(score >= 50){
    title = "✨ SOLID AURA";
    desc = "Balanced energy with plenty of personality. Your aura is quietly powerful and always has room to level up.";
  } else if(score >= 30){
    title = "🌙 LOWKEY AURA";
    desc = "Chill, mysterious and underrated. Your aura is still loading — give it some confidence and let it shine.";
  } else {
    title = "🫧 AURA IN BETA";
    desc = "No stress. Every legendary aura starts somewhere. Your next upgrade is one bold choice away.";
  }
  levelTitle.textContent = title;
  levelDesc.textContent = desc;
  quiz.hidden = true;
  result.hidden = false;
  result.scrollIntoView({behavior:"smooth", block:"start"});
}

startBtn.addEventListener("click", () => {
  current = 0; total = 0;
  scrollToQuiz();
});

nextBtn.addEventListener("click", () => {
  if(selected === null){
    warning.hidden = false;
    warning.textContent = "Please select an option before proceeding.";
    return;
  }
  // Options are weighted from 10 to 1, producing a maximum of 100.
  total += [10, 8, 6, 4][selected];
  if(current < questions.length - 1){
    current++;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

retryBtn.addEventListener("click", () => {
  current = 0; total = 0;
  result.hidden = true;
  scrollToQuiz();
});

document.getElementById("share-btn").addEventListener("click", async () => {
  const text = `My Aura Detector score is ${finalScore.textContent}/100 — ${levelTitle.textContent}`;
  try{
    if(navigator.share) await navigator.share({title:"My Aura Score", text});
    else{
      await navigator.clipboard.writeText(text);
      showToast("Result copied to clipboard ✨");
    }
  }catch(e){}
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.getElementById("theme-toggle").textContent = document.body.classList.contains("light") ? "☾" : "☼";
});

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
