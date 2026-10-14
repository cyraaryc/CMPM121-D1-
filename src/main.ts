import { createShop } from "./shop.ts";

// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
// shared upgrade shop

import logoUrl from "./assets/tile.svg";

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
// creates diceButton for step 1
const diceButton = document.createElement("diceButton");
diceButton.textContent = "🎲";
diceButton.style.cursor = "pointer";
diceButton.style.fontSize = "100px";
diceButton.style.padding = "0px";
diceButton.style.background = "none";
diceButton.onclick = () => {
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
app.append(heading, diceButton, counterText, addDice, timerButton, diceText);

// feedback for purchases for step 6
// tells you what just happened when you buy something
const messageText = document.createElement("p");
messageText.style.minHeight = "1.5em";
counterText.after(messageText);

// shows what you own and your income so status matches your choices for step 6
// shows rollers and income rate under the points
const statsText = document.createElement("p");
counterText.after(statsText);

// counts rollers by noticing when the roller cost goes up after a click
let rollerCount = 0;
let lastRollerCost = addRollercost;
timerButton.addEventListener("click", () => {
  if (addRollercost !== lastRollerCost) {
    rollerCount++;
    lastRollerCost = addRollercost;
  }
});

// shows you can't buy something you can't afford for step 5
// the original add dice / roller buttons can't be disabled (they aren't
// button tags), so fade them when you can't afford them instead
function showAffordable(element: HTMLElement, cost: number) {
  const canBuy = counterVariable >= cost;
  element.style.opacity = canBuy ? "1" : "0.5";
  element.style.cursor = canBuy ? "pointer" : "not-allowed";
}

// creates the shop from shared code and data for step 9
// the shop changes points through these, so it never touches the DOM above
const extraShop = createShop({
  get: () => counterVariable,
  spend: (amount) => {
    counterVariable -= amount;
  },
  earn: (amount) => {
    counterVariable += amount;
  },
}, (text) => {
  messageText.textContent = text;
});
app.append(extraShop.element);

// game loop using elapsed seconds so upgrades earn over time for steps 3 + 4
// one loop that adds income by the real seconds passed, not by frames
let lastFrameTime = performance.now();
function gameLoop(now: number) {
  // clamp so the first frame can never subtract points
  const elapsedSeconds = Math.max(0, (now - lastFrameTime) / 1000);
  lastFrameTime = now;
  extraShop.advance(elapsedSeconds);
  counterText.textContent = "Points: " + Math.floor(counterVariable);
  extraShop.update();
  // rollers roll every die once a second, a die averages 3.5
  const rollerRate = rollerCount * diceText.children.length * 3.5;
  statsText.textContent = "Dice: " + diceText.children.length +
    " | Rollers: " + rollerCount + " | about " +
    (rollerRate + extraShop.pointsPerSecond()) + " points/sec";
  showAffordable(addDice, addDicecost);
  showAffordable(timerButton, addRollercost);
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// dice casino theme so everything fits one idea for step 8
document.title = "Dice Roller Casino";
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
document.body.style.background =
  "radial-gradient(circle at top, #1f6b4a, #0d3324 75%)";
document.body.style.color = "#fff2ce";
document.body.style.fontFamily = "system-ui, sans-serif";
app.style.textAlign = "center";
app.style.padding = "24px 16px";
counterText.style.color = "#f2c14e";
diceText.style.display = "block";

const logo = document.createElement("img");
logo.src = logoUrl;
logo.alt = "";
logo.style.width = "72px";
heading.before(logo);

const subtitle = document.createElement("p");
subtitle.textContent =
  "Roll the dice for points, then hire rollers and open tables so the house keeps rolling while you watch.";
subtitle.style.color = "#c9e4d6";
heading.after(subtitle);

// makes the original add dice / roller elements look like the shop buttons
for (const shopButton of [addDice, timerButton]) {
  shopButton.style.display = "block";
  shopButton.style.margin = "6px auto";
}
