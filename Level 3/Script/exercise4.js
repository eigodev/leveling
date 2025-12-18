const exerciseFourContainer = document.getElementById('exercise-Four');
if (!exerciseFourContainer) {
    throw new Error('Missing exercise-Four container for exercise four content.');
}

const contentFour = createTag('div');
setClass(contentFour, 'content');
appendChilds(exerciseFourContainer, contentFour);

const exerciseFourSentences = [
    "My old car has some problems that need to be _.",
    "First, one of the doors is _ where I had an accident last year.",
    "Inside, the seats are _ in several places and need _.",
    "Finally, there's a _ in one of the tires.",
    "With all these problems, I should probably just buy a new car."
];

const exerciseFourOptions = [
    ["fixed", "fixing"],
    ["damage", "damaged"],
    ["tear", "torn"],
    ["replacing", "replaced"],
    ["leak", "leaking"],
]

exerciseFourSentences.forEach((sentences, index) => {
    const sentence = createTag('p');
    setClass(sentence, 'sentence');
    setContent(sentence, sentences);
    appendChilds(contentFour, sentence)
})

const sentencesFour = document.querySelectorAll('#exercise-Four div.content p.sentence');
sentencesFour.forEach((sentence, index) => {
    const sentenceText = exerciseFourSentences[index];
    const dropdownOptions = exerciseFourOptions[index];

    if (sentenceText.includes('_')) {
        const [before, after] = sentenceText.split('_');
        const select = document.createElement('select');
        setClass(select, 'dropdown')

        const placeholder = document.createElement('option')
        placeholder.value = '';
        placeholder.textContent = '';
        placeholder.selected = true;
        placeholder.disabled = true;
        appendChilds(select, placeholder);

        for (const options of dropdownOptions){
            const option = document.createElement('option')
            option.value = options;
            option.textContent = options;
            appendChilds(select, option);
        }

        sentence.textContent = '';
        sentence.appendChild(document.createTextNode(before.trimEnd()));
        sentence.appendChild(select);
        if (after.trim() !== '') {
            sentence.appendChild(document.createTextNode(after));
        }
    }
})