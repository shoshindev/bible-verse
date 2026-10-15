const book = document.getElementById("verse-book");
const number = document.getElementById("verse-number");
const text = document.getElementById("verse-text");

async function loadVerse() {
  const response = await fetch("https://bible-api.com/data/kjv/random");
  const data = await response.json();
  const verse = data.random_verse;

  book.textContent = verse.book;
  number.textContent = `${verse.chapter}:${verse.verse}`;
  text.textContent = verse.text.trim();
}

loadVerse();

document.addEventListener("keydown", (event) => {
  if (event.key !== " " && event.key !== "Enter") return;
  if (event.repeat) return;

  event.preventDefault();
  loadVerse();
});
