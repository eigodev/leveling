const exerciseEightContainer = document.getElementById('exercise-Eight');
if (!exerciseEightContainer) {
    throw new Error('Missing exercise-Eight container for exercise eight content.');
}

const contentEight = createTag('div');
setClass(contentEight, 'content');
appendChilds(exerciseEightContainer, contentEight);

// Five mini‑conversations with a sentence (row A) and a dropdown reply (row B)
const exerciseEightData = [
    {
        number: 1,
        sentence: 'Have a good evening!',
        options: [
            "It's nice to meet you.",
            'Not bad, thanks.',
            'Thanks. Good night, Ashley.'
        ]
    },
    {
        number: 2,
        sentence: "What's Marta like?",
        options: [
            "She's from Mexico.", 
            "She's very nice.", 
            "She's eighteen."]
    },
    {
        number: 3,
        sentence: 'I need a pen.',
        options: [
            'Let me see. Yes, it is.',
            'No problem. Thank you.',
            "There’s a pen on the desk."
        ]
    },
    {
        number: 4,
        sentence: 'When do you study?',
        options: [
            'Yes, a lot.', 
            'I study at school.', 
            'I study in the evening.']
    },
    {
        number: 5,
        sentence: 'Where are my keys?',
        options: [
            "They’re under your hat.", 
            "It’s on your backpack.", 
            'There are three.']
    }
];

exerciseEightData.forEach(({ number, sentence, options }, exerciseIndex) => {
    const exerciseWrapper = createTag('div');
    setClass(exerciseWrapper, 'conversation');
    appendChilds(contentEight, exerciseWrapper);

    const exerciseNumber = createTag('p');
    setClass(exerciseNumber, 'number');
    setContent(exerciseNumber, `${number || exerciseIndex + 1}.`);
    appendChilds(exerciseWrapper, exerciseNumber);

    // Row A: sentence text
    const rowA = createTag('div');
    setClass(rowA, 'conversation-row');

    const sentenceText = createTag('p');
    setClass(sentenceText, 'text');
    setContent(sentenceText, sentence);

    appendChilds(rowA, sentenceText);
    appendChilds(exerciseWrapper, rowA);

    // Row B: dropdown with three possible replies
    const rowB = createTag('div');
    setClass(rowB, 'conversation-row');

    const replySelect = createExerciseEightDropdown(options);

    appendChilds(rowB, replySelect);
    appendChilds(exerciseWrapper, rowB);
});

function createExerciseEightDropdown (options = []) {
    const select = createTag('select');
    setClass(select, 'text-dropdown');

    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(select, placeholder);

    const availableOptions = options.length ? options : ['N/A'];
    availableOptions.forEach((optionLabel) => {
        const option = createTag('option');
        option.value = optionLabel;
        // Full‑sentence options already come capitalised; no dynamic formatting needed here.
        option.textContent = optionLabel;
        appendChilds(select, option);
    });

    return select;
}