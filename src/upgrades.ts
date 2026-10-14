// Extra upgrades for the shop. Each entry is just data. shop.ts handles
// every entry the same way, so adding an upgrade only means adding an
// object here.
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  // cost is multiplied by this every time you buy one
  costGrowth: number;
  // points earned every second, per one owned
  pointsPerSecond: number;
  // you must have held this many points at once before it unlocks
  unlockAt: number;
}

// upgrade data that all goes through the same shop code for step 9
// each one differs in cost and points/sec so the choices matter for step 6
export const upgrades: Upgrade[] = [
  {
    id: "dice-cup",
    name: "add dice cup",
    description: "shakes a handful of dice at once, +5 points/sec",
    baseCost: 50,
    costGrowth: 1.5,
    pointsPerSecond: 5,
    unlockAt: 30,
  },
  {
    id: "craps-table",
    name: "add craps table",
    description: "a whole table of players rolling, +25 points/sec",
    baseCost: 500,
    costGrowth: 1.6,
    pointsPerSecond: 25,
    unlockAt: 300,
  },
  // new upgrade added only through the data for step 10
  {
    id: "high-roller-lounge",
    name: "add high roller lounge",
    description: "big spenders rolling all night, +120 points/sec",
    baseCost: 4000,
    costGrowth: 1.7,
    pointsPerSecond: 120,
    unlockAt: 2500,
  },
];
