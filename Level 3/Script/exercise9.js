const exerciseNineContainer = document.getElementById('exercise-Nine');
if (!exerciseNineContainer) {
    throw new Error('Missing exercise-Nine container for exercise nine content.');
}

const contentNine = createTag('div');
setClass(contentNine, 'content');
appendChilds(exerciseNineContainer, contentNine);

const sentencesA = [
    "Did you catch your plane last week?",
    "The computer screen is very dark.",
    "What’s the matter with the light?",
    "Would you rather take a biology or an earth science course?",
    "How can I learn vocabulary?",
    "Would you like to be a music critic?"
];
  
const sentencesB = [
    "No, I didn’t. When I got to the airport, the flight _ just _.",
    "Hmm. Maybe the brightness control needs _.",
    "The switch is _.",
    "I think I’d rather _ earth science.",
    "By _ people about words you don’t understand.",
    "Why not? I’d love _ to great music played by amazing bands!"
];

// Word bank / hints for each blank in reading order (there are 7 blanks total).
// Sentence 1 has two blanks, so we need two hints there.
const blankHints = ['aux.', 'leave', 'adjust', 'break', 'study', 'ask', 'listen'];

function autoGrowInput (input, minPx = 100) {
    // Resizing the input
    const resize = () => {
        // Setting the width to 0px
        input.style.width = '0px'

        // Calculating the next width
        const next = Math.max(minPx, (input.value.length + 1) * 7.5)
        // Setting the width to the next width
        input.style.width = next + 'px';
    }
    // Adding the event listener to the input
    input.addEventListener('input', resize);
    // Resizing the input
    resize();
}

let blankCursor = 0;

function buildSentenceWithInputs (sentenceText) {
    const fragment = document.createDocumentFragment();
    const parts = String(sentenceText ?? '').split('_');

    parts.forEach((part, partIndex) => {
        // Remove trailing spaces right before the input so spacing stays natural.
        const text = partIndex !== parts.length - 1 ? part.trimEnd() : part;
        if (text) {
            fragment.appendChild(document.createTextNode(text));
        }

        if (partIndex !== parts.length - 1) {
            const input = createTag('input');
            autoGrowInput(input, 50);

            const hint = blankHints[blankCursor] ?? '';
            blankCursor++;

            input.placeholder = hint;
            input.addEventListener('focus', () => {
                input.placeholder = '';
            });
            input.addEventListener('blur', () => {
                input.placeholder = hint;
            });

            fragment.appendChild(input);
        }
    });

    return fragment;
}

// Build each numbered row with sentence A and sentence B (with inputs for blanks).
sentencesA.forEach((sentenceAText, index) => {
    // Create the elements
    const sentenceRow = createTag('div');
    const sentenceLine = createTag('div');
    const lettersDiv = createTag('div');
    const numberTag = createTag('p');
    const sentenceA = createTag('p');
    const sentenceB = createTag('p');
    
    // Set the classes
    setClass(sentenceRow, 'sentence-row');
    setClass(sentenceLine, 'sentence-line');
    setClass(lettersDiv, 'letters');
    setClass(numberTag, 'number');
    setClass(sentenceA, 'sentence');
    setClass(sentenceB, 'sentence');

    // Set the content
    setContent(numberTag, index + 1);
    setContent(sentenceA, sentenceAText);

    // Create the sentence B
    const sentenceBText = sentencesB[index] ?? '';
    sentenceB.appendChild(buildSentenceWithInputs(sentenceBText));

    // Append the childs
    appendChilds(contentNine, sentenceRow);
    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, lettersDiv);

    // Create the letters
    const letters = ['A', 'B'];
    letters.forEach((letter) => {
        const letterTag = createTag('p');
        setClass(letterTag, 'letter');
        setContent(letterTag, letter);
        appendChilds(lettersDiv, letterTag);
    });
    
    appendChilds(sentenceRow, sentenceLine);
    appendChilds(sentenceLine, sentenceA);
    appendChilds(sentenceLine, sentenceB);
});
