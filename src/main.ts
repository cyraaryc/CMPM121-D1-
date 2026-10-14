// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

const app = document.querySelector<HTMLElement>("#app")!;

// header to remove/change
const heading = document.createElement("h1");
heading.textContent = "D1 project";

// creates counter for step 2
const counterText = document.createElement("p");
counterText.textContent = "0";
let counterVariable = 0;

// creates dicediceButton for step 1
const diceButton = document.createElement("diceButton");
diceButton.textContent = "🎲";
diceButton.style.cursor = "pointer";
diceButton.style.fontSize = "100px";
diceButton.style.padding = "0px";
diceButton.style.border = "none";
diceButton.style.background = "none";
diceButton.onclick = () => {
  counterVariable++;
  counterText.textContent = "" + counterVariable;
};
// timer with a button that adds points for steps 3 + 4 + 5
const timerButton = document.createElement("timerButton");
timerButton.style.cursor = "pointer";
let boolFortimerButton = 0;
timerButton.textContent = "⏱️ : click to increase points on 1 second delay";
timerButton.onclick = () => {
  if (boolFortimerButton == 0) {
    const _pointTimer = setInterval(() => {
      counterVariable++;
      counterText.textContent = "" + counterVariable;
    }, 1000);
    boolFortimerButton = 1;
  }
};

// adds all the elements here
app.append(heading, diceButton, counterText, timerButton);
