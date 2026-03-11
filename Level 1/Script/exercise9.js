const exerciseNineContainer = document.getElementById('exercise-Nine');
if (!exerciseNineContainer) {
    throw new Error('Missing exercise-Nine container for exercise nine content.');
}

const contentNine = createTag('div');
setClass(contentNine, 'content');
appendChilds(exerciseNineContainer, contentNine);

// Data
const firstRowNine = [
    'I like those earrings.',
    'Can you go to dinner with me tomorrow?',
    'Which shirt do you prefer?',
    'How _ do you go out to dinner?',
    'Would you like to take a walk with me?',
    'I\'m looking for a drugstore.'
];

const secondRowNine = [
    'Do you mean _?',
    'No. I\'m sorry. I work _ Saturdays.',
    'I prefer the blue one. It\'s _ the orange one.',
    'About once a month.',
    'Yes, _.',
    'I think _ one on Main Street.'
];

const dropdownOptionsNine = [
    ['that gold', 'those gold', 'the gold ones'],
    ['in', 'on', 'at'],
    ['the nice', 'nicer', 'nicer than'],
    ['long', 'well', 'often'],
    ['I do', 'I\'d like', 'I\'d love to'],
    ['it\'s', 'that\'s', 'there\'s']
];

function buildSentenceWithDropdowns (text, options) {
    const fragment = document.createDocumentFragment();
    const parts = text.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }
        if (partIndex !== parts.length - 1 && options && options.length) {
            const select = createTag('select');
            setClass(select, 'text-dropdown');

            const placeholder = createTag('option');
            placeholder.value = '';
            placeholder.textContent = ' ';
            placeholder.disabled = true;
            placeholder.selected = true;
            appendChilds(select, placeholder);

            options.forEach((optionValue) => {
                const option = createTag('option');
                option.value = optionValue;
                option.textContent = optionValue;
                appendChilds(select, option);
            });
            fragment.appendChild(select);
        }
    });
    return fragment;
}

// Build one item per pair: p.number, div.letters (A:, B:), div.sentences (sentence A, sentence B)
for (let index = 0; index < 6; index++) {
    const sentenceRow = createTag('div');
    setClass(sentenceRow, 'sentence-row');

    const numberTag = createTag('p');
    setClass(numberTag, 'number');
    setContent(numberTag, index + 1);
    appendChilds(sentenceRow, numberTag);

    const lettersDiv = createTag('div');
    setClass(lettersDiv, 'letters');
    ['A:', 'B:'].forEach((label) => {
        const letterTag = createTag('p');
        setClass(letterTag, 'letter');
        setContent(letterTag, label);
        appendChilds(lettersDiv, letterTag);
    });
    appendChilds(sentenceRow, lettersDiv);

    const sentencesDiv = createTag('div');
    setClass(sentencesDiv, 'sentences');

    const sentenceA = createTag('p');
    setClass(sentenceA, 'sentence');
    const optionsA = firstRowNine[index].includes('_') ? dropdownOptionsNine[index] : null;
    sentenceA.appendChild(buildSentenceWithDropdowns(firstRowNine[index], optionsA));
    appendChilds(sentencesDiv, sentenceA);

    const sentenceB = createTag('p');
    setClass(sentenceB, 'sentence');
    const optionsB = secondRowNine[index].includes('_') ? dropdownOptionsNine[index] : null;
    sentenceB.appendChild(buildSentenceWithDropdowns(secondRowNine[index], optionsB));
    appendChilds(sentencesDiv, sentenceB);

    appendChilds(sentenceRow, sentencesDiv);
    appendChilds(contentNine, sentenceRow);
}



/* EVENT LISTENER – track answers for Exercise 9 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 9 (order matches DOM: item 0 B, 1 B, 2 B, 3 A, 4 B, 5 B)
        const reviewMap = [
            { unit: 3, exercise: 3 },   /* the gold ones */
            { unit: 2, exercise: 9 },   /* on */
            { unit: 3, exercise: 10 },  /* nicer than */
            { unit: 6, exercise: 11 },  /* often */
            { unit: 4, exercise: 9 },   /* I'd love to */
            { unit: 8, exercise: 3 }    /* there's */
        ];

        const selects = document.querySelectorAll(
            '#exercise-Nine select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise9.dropdowns ?? [];
        const totalQuestions = expected.length;

        selects.forEach((select, index) => {
            const userAnswer = select.value;
            const expectedAnswer = expected[index];
            const isCorrect = userAnswer === expectedAnswer;
            const reviewInfo = reviewMap[index] ?? null;

            if (isCorrect) {
                items++;
                score++;
                correctAnswersChosen.push(expectedAnswer);
            } else {
                wrongAnswersChosen.push(userAnswer || null);
            }

            details.push({
                questionIndex: index,
                unit: reviewInfo?.unit ?? null,
                exercise: reviewInfo?.exercise ?? null,
                reviewCode:
                    reviewInfo != null
                        ? `${reviewInfo.unit}/${reviewInfo.exercise}`
                        : null,
                userAnswer: userAnswer || null,
                expectedAnswer,
                isCorrect
            });
        });

        const finalScore = (correct, total) =>
            total > 0 ? (correct / total) * 100 : 0;
        const percentage = Math.round(finalScore(score, totalQuestions));

        const skillsToReview = Array.from(
            new Set(
                details
                    .filter((item) => item.isCorrect === false)
                    .map((item) => {
                        if (item.unit && item.exercise != null) {
                            return `Unit ${item.unit} (ex. ${item.exercise})`;
                        }
                        if (item.unit) {
                            return `Unit ${item.unit}`;
                        }
                        return item.reviewCode ?? null;
                    })
                    .filter(Boolean)
            )
        );

        window.studentChoices.choicesNine = correctAnswersChosen;
        window.studentChoices.choicesNineHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});