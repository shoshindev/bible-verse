const API_URL = "https://bible-api.com/data/kjv/random";

const book = document.getElementById("verse-book");
const number = document.getElementById("verse-number");
const text = document.getElementById("verse-text");
const hint = document.getElementById("hint");
const hintDismissBtn = document.getElementById("hint-dismiss-btn");

let isLoading = false;
let nextVerse = null;

async function fetchVerse() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.random_verse;
}

function showVerse(verse) {
  book.textContent = verse.book;
  number.textContent = `${verse.chapter}:${verse.verse}`;
  text.textContent = verse.text.trim();
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

document.addEventListener("keydown", (event) => {
  if (event.key !== " " && event.key !== "Enter") return;
  if (event.repeat) return;

  event.preventDefault();
  loadVerse();
});

hintDismissBtn.addEventListener("click", () => {
  hint.style.display = "none";
});
