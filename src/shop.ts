// Shared code for every upgrade in upgrades.ts: buying, earning over time
// and showing the buttons all go through the same path.
import { type Upgrade, upgrades } from "./upgrades.ts";

// how the shop reads and changes the player's points
export interface Wallet {
  get(): number;
  spend(amount: number): void;
  earn(amount: number): void;
}

// onMessage lets the page show what happened after a click
export function createShop(
  wallet: Wallet,
  onMessage: (text: string) => void,
) {
  const owned = new Map<string, number>();
  const element = document.createElement("div");
  const buttons = new Map<Upgrade, HTMLButtonElement>();
  // unlocks stronger upgrades as you progress for step 7
  // most points you've ever had at once, spending doesn't lower it
  let bestPoints = 0;

  function isUnlocked(upgrade: Upgrade) {
    return bestPoints >= upgrade.unlockAt;
  }

  function ownedCount(upgrade: Upgrade) {
    return owned.get(upgrade.id) ?? 0;
  }

  // cost goes up each time you buy, so earlier choices change later prices for
  // step 7
  function costOf(upgrade: Upgrade) {
    return Math.ceil(
      upgrade.baseCost * upgrade.costGrowth ** ownedCount(upgrade),
    );
  }

  // blocks purchases you can't afford and takes the cost when you can for step 5
  // returns false and changes nothing if you can't afford it
  function buy(upgrade: Upgrade) {
    const cost = costOf(upgrade);
    if (!isUnlocked(upgrade) || wallet.get() < cost) return false;
    wallet.spend(cost);
    owned.set(upgrade.id, ownedCount(upgrade) + 1);
    return true;
  }

  function pointsPerSecond() {
    let rate = 0;
    for (const upgrade of upgrades) {
      rate += upgrade.pointsPerSecond * ownedCount(upgrade);
    }
    return rate;
  }

  // passive income for the time that passed
  function advance(elapsedSeconds: number) {
    wallet.earn(pointsPerSecond() * elapsedSeconds);
  }

  // filled button when you can buy it, outlined and muted when you can't
  function setLook(button: HTMLButtonElement, canBuy: boolean) {
    button.style.background = canBuy ? "#fff2ce" : "transparent";
    button.style.color = canBuy ? "#0d3324" : "#9cbfae";
    button.style.cursor = canBuy ? "pointer" : "not-allowed";
  }

  function update() {
    const points = wallet.get();
    bestPoints = Math.max(bestPoints, points);
    for (const [upgrade, button] of buttons) {
      if (!isUnlocked(upgrade)) {
        button.textContent = "??? (locked)\nreach " + upgrade.unlockAt +
          " points to unlock";
        button.disabled = true;
        setLook(button, false);
        continue;
      }
      const cost = costOf(upgrade);
      const canBuy = points >= cost;
      const priceLine = canBuy
        ? "cost: " + cost
        : "cost: " + cost + " (need " + Math.ceil(cost - points) + " more)";
      button.textContent = upgrade.name + " (owned: " + ownedCount(upgrade) +
        ")\n" + upgrade.description + "\n" + priceLine;
      button.disabled = !canBuy;
      setLook(button, canBuy);
    }
  }

  for (const upgrade of upgrades) {
    const button = document.createElement("button");
    button.style.cursor = "pointer";
    button.style.fontSize = "20px";
    button.style.display = "block";
    button.style.margin = "6px auto";
    button.style.whiteSpace = "pre-line";
    button.style.width = "min(100%, 420px)";
    button.style.padding = "10px";
    button.style.borderRadius = "12px";
    button.style.border = "2px solid #fff2ce";
    button.onclick = () => {
      const cost = costOf(upgrade);
      if (buy(upgrade)) {
        onMessage(
          "Bought " + upgrade.name.replace("add ", "") + " for " +
            cost + " points.",
        );
      } else {
        onMessage("Not enough points for that yet.");
      }
      update();
    };
    buttons.set(upgrade, button);
    element.append(button);
  }
  update();

  return { element, advance, update, pointsPerSecond };
}
