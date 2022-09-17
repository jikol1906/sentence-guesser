const wrapper = document.querySelector(".wrapper");
const topButtons = document.querySelectorAll(".top-button");
const sentence = document.querySelector("#sentence");
const translateButton = document.querySelector("#translateButton");
const trynewButton = document.querySelector("#trynew");
const reveal = document.querySelector("#revealresult");
const result = document.querySelector("#result");
let elms;
let elmsLength;
let currentTabIndex = 1;
let maxTababale;
sentence.focus();
async function translate(text) {
  const apiKey = "e5186a96-bbab-6ff2-5a0e-fb315161d0d6:fx"; //You api key;
  const res = await fetch(
    `https://api-free.deepl.com/v2/translate?auth_key=${apiKey}&text=${encodeURIComponent(
      text
    )}&target_lang=de&formality=less`
  );

  const json = await res.json();
  return json.translations[0].text.split(" ");
}

document.onkeydown = function (e) {
  e = e || window.event;
  if (e.key === "Backspace" && document.activeElement !== sentence) {
    currentTabIndex = Math.max(1, currentTabIndex - 1);
    selectInput(currentTabIndex);
  }
};

translateButton.addEventListener("click", async (e) => {
  await startNewSentence(sentence.value);
  reveal.style.display = "inline";
  translateButton.setAttribute("disabled", true);
});

trynewButton.addEventListener("click", (e) => {
  sentence.removeAttribute("disabled");
  sentence.value = "";
  sentence.focus();
  translateButton.removeAttribute("disabled");
  wrapper.innerHTML = "";
  result.style.display = "";
  reveal.style.display = "";
  setResult([""]);
});

reveal.addEventListener("click", (_) => {
  result.style.display = "block";
});

topButtons.forEach((b) => {
  b.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
});

function selectInput(tabindex) {
  document.querySelector(`input[tabindex='${tabindex}']`)?.focus();
}

function insertWord(word) {
  const wordWrapper = document.createElement("div");
  wordWrapper.classList.add("word-wrapper");

  const revealedLetterIndex = getRandomInt(0, word.length);

  [...word].forEach((letter, i) => {
    const input = document.createElement("input");
    input.classList.add("character-input");
    input.setAttribute("data-letter", letter);
    input.setAttribute("maxlength", 1);
    input.setAttribute("type", "text");
    const isPunctuation = !/[a-zäöüß0-9]/i.test(letter);
    if (revealedLetterIndex === i || isPunctuation) {
      insertLetter(input, letter, isPunctuation);
    }
    wordWrapper.append(input);
  });

  wrapper.append(wordWrapper);
}

function insertLetter(input, letter, isPunctuation) {
  input.setAttribute("disabled", true);
  input.style.color = "white";

  input.value = letter;
  if (isPunctuation) {
    input.style.border = "none";
    input.style.background = "transparent";
  }
}

const handleInput = (e, elms) => {
  if (/[a-zäöüß0-9]/i.test(e.target.value)) {
    currentTabIndex = Math.min(elmsLength + 1, currentTabIndex + 1);
    selectInput(currentTabIndex);
  }
};

const handleFocus = (e) => {
  if (e.target.value !== "") {
    e.target.select();
  }
  currentTabIndex = +e.target.getAttribute("tabIndex");
};

function setTabIndexes() {
  document.querySelectorAll(".wrapper input").forEach((i) => {
    i.removeAttribute("tabIndex");
    i.removeEventListener("focus", handleFocus);
  });
  elms = document.querySelectorAll(".wrapper input:not(:disabled)");
  elmsLength = elms.length;
  maxTababale = elms.length;

  elms.forEach((input, i) => {
    input.tabIndex = i + 1;
  });

  elms.forEach((i) => {
    i.addEventListener("input", handleInput);
    i.addEventListener("focus", handleFocus);
  });

  elms[0].focus();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getWords() {
  const words = Array.from(document.querySelectorAll(".word-wrapper"));

  let sentence = "";

  words.forEach((w) => {
    w.querySelectorAll("input").forEach((i) => {
      sentence += i.value;
    });

    sentence += " ";
  });

  console.log(sentence);
}

function setResult(words) {
  document.querySelector("#result").textContent = words.join(" ");
}

function revealLetter() {
  const inputs = Array.from(
    wrapper.querySelectorAll("input:not(:disabled)")
  ).filter((i) => i.value === "");
  const randomInt = getRandomInt(0, inputs.length);
  const randomInput = inputs[randomInt];
  const inputLetter = randomInput.getAttribute("data-letter");
  insertLetter(randomInput, inputLetter, false);
  setTabIndexes();
}

function checkWords() {
  wrapper.querySelectorAll("input").forEach((i) => {
    const [value, expectedValue] = [
      i.value.toLocaleLowerCase(),
      i.getAttribute("data-letter").toLocaleLowerCase(),
    ];
    if (!i.disabled) {
      if (value !== expectedValue && value !== "") {
        i.style.borderColor = "red";
        i.style.color = "red";
      } else if (value === expectedValue) {
        i.style.borderColor = "lightgreen";
        i.style.color = "lightgreen";
      }
    }
  });
}

async function startNewSentence(theSentence) {
  const words = await translate(theSentence);
  sentence.setAttribute("disabled", true);
  words.forEach((w) => insertWord(w));
  setResult(words);
  setTabIndexes();
}
