const book = document.getElementById("verse-book");
const number = document.getElementById("verse-number");
const text = document.getElementById("verse-text");
const hint = document.getElementById("hint");
const hintDismissBtn = document.getElementById("hint-dismiss-btn");

let isLoading = false;

async function loadVerse() {
  if (isLoading) return;
  isLoading = true;

  try {
    const response = await fetch("https://bible-api.com/data/kjv/random");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const verse = data.random_verse;

    book.textContent = verse.book;
    number.textContent = `${verse.chapter}:${verse.verse}`;
    text.textContent = verse.text.trim();
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
