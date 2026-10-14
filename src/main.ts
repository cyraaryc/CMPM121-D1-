// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

const app = document.querySelector<HTMLElement>("#app")!;

// header to remove/change
const heading = document.createElement("h1");
heading.textContent = "Dice Roller";

// creates counter for step 2
const counterText = document.createElement("p");
counterText.textContent = "Points: 0";
counterText.style.fontSize = "30px";
counterText.style.fontWeight = "bold";

let counterVariable = 0;

//audio
const diceAudio1 = new Audio("/assets/dice-throw-1.ogg");

// creates diceButton for step 1
const diceButton = document.createElement("diceButton");
diceButton.textContent = "🎲";
diceButton.style.cursor = "pointer";
diceButton.style.fontSize = "100px";
diceButton.style.padding = "0px";
diceButton.style.background = "none";
diceButton.onclick = () => {
  diceAudio1.play();
  rollDice();
};
// rolls dice, called in the main button and for the dice rollers
function rollDice() {
  let total = 0;
  for (const die of diceText.children) {
    const diceIndex = Math.floor(Math.random() * diceFaces.length);
    die.textContent = diceFaces[diceIndex];
    total += diceIndex + 1;
  }
  counterVariable += total;
  counterText.textContent = "Points: " + counterVariable;
}
// Vreates diceText element where we appened dice with dice () rendered with dice faces from die
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const diceText = document.createElement("span");
function dice() {
  const die = document.createElement("span");
  die.textContent = diceFaces[Math.floor(Math.random() * diceFaces.length)];
  die.style.fontSize = "150px";
  return die;
}
let addDicecost = 0;
const addDice = document.createElement("span");
addDice.textContent = "add dice : " + addDicecost;
addDice.style.cursor = "pointer";
addDice.style.fontSize = "30px";
addDice.style.padding = "0px";
addDice.style.background = "none";
addDice.onclick = () => {
  if (counterVariable >= addDicecost) {
    counterVariable = counterVariable - addDicecost;
    counterText.textContent = "Points: " + counterVariable;
    addDicecost = (addDicecost + 10) * 20;
    addDice.textContent = "add dice : " + addDicecost;
    diceText.append(dice());
  }
};

// timer with a button that adds points for steps 3 + 4 + 5 and scales cost for 6
let addRollercost = 0;
const timerButton = document.createElement("div");
timerButton.style.cursor = "pointer";
timerButton.textContent = "add dice roller : " + addRollercost;
timerButton.style.fontSize = "30px";
timerButton.onclick = () => {
  if (counterVariable >= addRollercost) {
    counterVariable -= addRollercost;
    counterText.textContent = "Points: " + counterVariable;
    addRollercost = 10 + addRollercost * addRollercost;
    timerButton.textContent = "add dice roller : " + addRollercost;
    const _pointTimer = setInterval(() => {
      rollDice();
    }, 1000);
  }
};

// adds all the elements here
app.append(
  heading,
  diceButton,
  diceAudio1,
  counterText,
  addDice,
  timerButton,
  diceText,
);
