#  Sentence Guesser
Sentence Guesser works by taking an English sentence that you provide, translating it to German with DeepL, then returning it to you in the form of a fill-in-the-blanks exercise.

## Setup
Request a free DeepL api key from [their website](https://www.deepl.com/). 

Clone the project. 

Create a new file in the project directory called `secret.js`. Add the following code:

```js
// global variable
guesser = {}
guesser.apiKey = ''; // your DeepL api key here
```

This workflow prevents you from having to delete your API key from the `script.js` file before committing code.

## Usage
Open `index.html` in your browser.

Begin by typing an English sentence in the input field.

Click "Translate" to send to DeepL and load the exercise.

A fill-in-the-blanks German exercise will load with some letters already showing. As you type out your answer, Sentence Guesser will advance focus to the next available character input field. Alternatively you can manually focus on arbitrary character inputs.

If you are stuck, click "Reveal Random Letter" and the exercise will confirm a letter from the correctly translated answer.

Once you are ready to evaluate your answer, click "Check". If any characters are incorrectly translated, they will be marked in red (a11y consideration needed here). 

If you want to give up before revealing all of the letters randomly, click "Reveal result", and scroll down to view the correct answer.

Once you are ready to try a new exercise, click "Try new Sentence", to clear the page.
