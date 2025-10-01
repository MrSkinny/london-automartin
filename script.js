// --- Filter name constants ---
const BOROUGH = "Borough";
const PRESTIGE = "Prestige";
const POVERTY = "Poverty";
const LAST_CARD = "Last Card";
const FIRST_CARD = "First Card";
const CITY_DECK = "City Deck";
const DEVELOPMENT_BOARD = "Development Board";
const COINS = "Coins";
const CRUCIAL_CARDS = "Crucial Cards";

// --- Action constants ---
const SKIP_NEXT = "Skip the next autonoma card.";
const DRAW_NEXT = "Draw another autonoma card.";
const DISCARD_CITY_CARD = "Discard a card from the city deck.";

// --- Crucial cards static list ---
const CRUCIAL_VALUES = [
  "Underground",
  "Train Station North/South",
  "Omnibus",
  "Milton/Brixton Prison",
  "Whitehall",
  "Hospital"
];

// --- Card manifest ---
const CARD_MANIFEST = [
  { difficulty: 1, poverty: 1, money: null, draw_filter: [BOROUGH, PRESTIGE, POVERTY, LAST_CARD], action: null },
  { difficulty: 1, poverty: null, money: 2, draw_filter: [BOROUGH, POVERTY, PRESTIGE, FIRST_CARD], action: null },
  { difficulty: 1, poverty: 2, money: null, draw_filter: [CITY_DECK], action: SKIP_NEXT },
  { difficulty: 1, poverty: null, money: 3, draw_filter: [CRUCIAL_CARDS, CITY_DECK], action: DISCARD_CITY_CARD },
  { difficulty: 1, poverty: null, money: 2, draw_filter: [CITY_DECK], action: DRAW_NEXT },
  { difficulty: 1, poverty: 2, money: null, draw_filter: [DEVELOPMENT_BOARD, PRESTIGE, COINS, FIRST_CARD], action: DISCARD_CITY_CARD },
  { difficulty: 1, poverty: null, money: 3, draw_filter: [DEVELOPMENT_BOARD, POVERTY, PRESTIGE, LAST_CARD], action: DRAW_NEXT },
  { difficulty: 1, poverty: 2, money: null, draw_filter: [DEVELOPMENT_BOARD, PRESTIGE, POVERTY, CITY_DECK], action: SKIP_NEXT },
  { difficulty: 1, poverty: 3, money: null, draw_filter: [DEVELOPMENT_BOARD, COINS, PRESTIGE, CITY_DECK], action: DRAW_NEXT },
  { difficulty: 1, poverty: null, money: 2, draw_filter: [DEVELOPMENT_BOARD, PRESTIGE, POVERTY, CITY_DECK], action: DISCARD_CITY_CARD },
  { difficulty: 2, poverty: null, money: 3, draw_filter: [BOROUGH, PRESTIGE, POVERTY, LAST_CARD], action: null },
  { difficulty: 2, poverty: 3, money: null, draw_filter: [BOROUGH, PRESTIGE, POVERTY, FIRST_CARD], action: null },
  { difficulty: 2, poverty: 2, money: null, draw_filter: [CRUCIAL_CARDS, DEVELOPMENT_BOARD, PRESTIGE, COINS, CITY_DECK], action: DRAW_NEXT },
  { difficulty: 2, poverty: null, money: 3, draw_filter: [CRUCIAL_CARDS, DEVELOPMENT_BOARD, POVERTY, PRESTIGE, CITY_DECK], action: DRAW_NEXT },
  { difficulty: 2, poverty: null, money: 3, draw_filter: [CRUCIAL_CARDS, DEVELOPMENT_BOARD, PRESTIGE, COINS, LAST_CARD], action: SKIP_NEXT },
  { difficulty: 3, poverty: null, money: 5, draw_filter: [BOROUGH, PRESTIGE, POVERTY, FIRST_CARD], action: null },
  { difficulty: 3, poverty: null, money: 5, draw_filter: [BOROUGH, POVERTY, PRESTIGE, LAST_CARD], action: null },
  { difficulty: 3, poverty: null, money: 5, draw_filter: [CRUCIAL_CARDS, DEVELOPMENT_BOARD, COINS, PRESTIGE, CITY_DECK], action: DRAW_NEXT },
  { difficulty: 3, poverty: 2, money: null, draw_filter: [CRUCIAL_CARDS, CITY_DECK], action: DRAW_NEXT },
  { difficulty: 3, poverty: 3, money: null, draw_filter: [CRUCIAL_CARDS, CITY_DECK], action: DISCARD_CITY_CARD }
];

// --- Classes ---
class Card {
  constructor(attrs) {
    this.difficulty = attrs.difficulty;
    this.poverty = attrs.poverty;
    this.money = attrs.money;
    this.draw_filter = attrs.draw_filter;
    this.action = attrs.action;
  }

  toHTML() {
    const resources = this.poverty
      ? `Poverty ${this.poverty}`
      : `Money £${this.money}`;

    const actionText = this.action || "(none)";

    let filterText = "";
    if (this.draw_filter[0] === CRUCIAL_CARDS) {
      const normalFilters = this.draw_filter.slice(1);
      const crucialPart = '<span class="crucial">Crucial Cards: ' + CRUCIAL_VALUES.join(", ") + '</span>';
      const normalPart = normalFilters.length ? "; " + normalFilters.join(", ") : "";
      filterText = crucialPart + normalPart;
    } else {
      filterText = this.draw_filter.join(", ");
    }

    return `
      <div><strong>Difficulty:</strong> ${this.difficulty}</div>
      <div><strong>Resources:</strong> ${resources}</div>
      <div><strong>Draw Filter:</strong> ${filterText}</div>
      <div><strong>Action:</strong> ${actionText}</div>
    `;
  }
}

class Deck {
  constructor(cardManifest) {
    this.cardManifest = cardManifest;
    this.resetDeck();
  }

  resetDeck() {
    this.cards = this.cardManifest.map(attrs => new Card(attrs));
    this.shuffle(this.cards);
    this.updateStatus(`Deck reshuffled (${this.cards.length} cards)`);
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  draw() {
    if (this.cards.length === 0) {
      this.resetDeck();
    }
    return this.cards.pop();
  }

  remaining() {
    return this.cards.length;
  }

  updateStatus(msg) {
    document.getElementById("status").textContent = msg;
  }
}

// --- Game setup ---
let deck;

function startGame() {
  const diff = parseInt(document.getElementById("difficulty").value, 10);
  const filtered = CARD_MANIFEST.filter(c => c.difficulty <= diff);
  deck = new Deck(filtered);

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "flex";
  deck.updateStatus(`Game started at difficulty ${diff} (${filtered.length} cards).`);
  drawCard();
}

function drawCard() {
  const card = deck.draw();
  document.getElementById("card").innerHTML = card.toHTML();
  deck.updateStatus(`Cards remaining: ${deck.remaining()}`);
}
