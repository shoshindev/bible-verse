const API_BASE = "https://bible-api.com/data/kjv";

const book = document.getElementById("verse-book");
const number = document.getElementById("verse-number");
const text = document.getElementById("verse-text");
const hint = document.getElementById("hint");
const hintDismissBtn = document.getElementById("hint-dismiss-btn");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");

const listResponse = await fetch("verses.json");
const verseList = await listResponse.json();

let deck = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function nextReference() {
  if (deck.length === 0) {
    deck = shuffle([...verseList]);
  }
  return deck.pop();
}

let isLoading = false;
let nextVerse = null;

async function fetchVerse() {
  const ref = nextReference();
  const response = await fetch(`${API_BASE}/${ref.book}/${ref.chapter}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const verses = data.verses.filter(
    (v) => v.verse >= ref.from && v.verse <= ref.to,
  );

  return {
    book: verses[0].book,
    number:
      ref.from === ref.to
        ? `${ref.chapter}:${ref.from}`
        : `${ref.chapter}:${ref.from}–${ref.to}`,
    text: verses.map((v) => v.text.trim()).join(" "),
  };
}

function showVerse(verse) {
  book.textContent = verse.book;
  number.textContent = verse.number;
  text.textContent = verse.text;
}

async function prefetch() {
  try {
    nextVerse = await fetchVerse();
  } catch (error) {
    console.warn("Could not prefetch next verse:", error);
  }
}

async function loadVerse() {
  if (isLoading) return;
  isLoading = true;

  try {
    const verse = nextVerse ?? (await fetchVerse());
    nextVerse = null;
    showVerse(verse);
    prefetch();
  } catch (error) {
    console.error("Could not load verse:", error);
  } finally {
    isLoading = false;
  }
}

loadVerse();

settingsBtn.addEventListener("click", () => {
  settings.showModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== " " && event.key !== "Enter") return;
  if (event.repeat) return;

  event.preventDefault();
  loadVerse();
});

hintDismissBtn.addEventListener("click", () => {
  hint.style.display = "none";
});
