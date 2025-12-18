const exerciseEightContainer = document.getElementById('exercise-Eight');
if (!exerciseEightContainer) {
    throw new Error('Missing exercise-Eight container for exercise eight content.');
}

const contentEight = createTag('div');
setClass(contentEight, 'content');
appendChilds(exerciseEightContainer, contentEight);

// Exercise 8 – Complete the paragraph with the correct form of the verbs.
// Structure mirrors Exercise 4: render <p class="sentence"> then replace "_" with <select>.

const exerciseEightSentences = [
    'A thief stole my car last week while my wife and I _ at a department store.',
    'I was very upset because I _ the car the day before.',
    'Luckily, we _ the car back right away because the police _ the thief while he _ the GPS system in the car!'
];

// Dropdown options appear in reading order across all underscores (1–5).
const exerciseEightOptions = [
    // (1) shop — past continuous (wife + I = plural)
    // (1) shop — past continuous (wife + I = plural)
    ['shopped', 'was shopping', 'were shopping', 'has shopped', 'have shopped', 'had shopped'],
    // (2) buy — options follow same pattern as shop
    ['bought', 'was buying', 'were buying', 'has bought', 'have bought', 'had bought'],
    // (3) get — options follow same pattern as shop
    ['got', 'was getting', 'were getting', 'has got', 'have got', 'had got'],
    // (4) catch — options follow same pattern as shop
    ['caught', 'was catching', 'were catching', 'has caught', 'have caught', 'had caught'],
    // (5) program — options follow same pattern as shop
    ['programmed', 'was programming', 'were programming', 'has programmed', 'have programmed', 'had programmed']
];

// Create the base sentence tags first
exerciseEightSentences.forEach((sentenceText) => {
    const sentence = createTag('p');
    setClass(sentence, 'sentence');
    setContent(sentence, sentenceText);
    appendChilds(contentEight, sentence);
});

function createExerciseEightDropdown (options = []) {
    const select = document.createElement('select');
    // Keep consistent with other exercises + checkAnswers selectors
    setClass(select, ['dropdown', 'text-dropdown']);

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.selected = true;
    placeholder.disabled = true;
    appendChilds(select, placeholder);

    options.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        appendChilds(select, option);
    });

    return select;
}

// Replace "_" with dropdowns, in reading order across the whole paragraph.
let exerciseEightOptionCursor = 0;

const sentencesEight = document.querySelectorAll('#exercise-Eight div.content p.sentence');
sentencesEight.forEach((sentence) => {
    const sentenceText = sentence.textContent ?? '';
    if (!sentenceText.includes('_')) return;

    const parts = sentenceText.split('_');
    sentence.textContent = '';

    parts.forEach((part, partIndex) => {
        // Remove trailing spaces right before the dropdown so spacing stays natural
        const text = partIndex !== parts.length - 1 ? part.trimEnd() : part;
        if (text) {
            sentence.appendChild(document.createTextNode(text));
        }

        if (partIndex !== parts.length - 1) {
            const options = exerciseEightOptions[exerciseEightOptionCursor] ?? [];
            exerciseEightOptionCursor++;
            sentence.appendChild(createExerciseEightDropdown(options));
        }
    });
});