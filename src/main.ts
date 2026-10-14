// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

const app = document.querySelector<HTMLElement>("#app")!;

// header to remove/change
const heading = document.createElement("h1");
heading.textContent = "D1 project";

// creates counter
const counterText = document.createElement("p");
counterText.textContent = "0";
let counterVariable = 0;

// creates button
const button = document.createElement("button");
button.textContent = "🎲";
button.style.cursor = "pointer";
button.style.fontSize = "100px";
button.style.padding = "0px";
button.style.border = "none";
button.style.background = "none";
button.onclick = () => {
  counterVariable++;
  counterText.textContent = "" + counterVariable;
};

// add all the stuff here
app.append(heading, button, counterText);
