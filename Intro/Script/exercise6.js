const exerciseSixContainer = document.getElementById('exercise-Six');
if (!exerciseSixContainer) {
    throw new Error('Missing exercise-Six container for exercise six content.');
}

const contentSix = createTag('div');
setClass(contentSix, 'content');
appendChilds(exerciseSixContainer, contentSix);

// Shared options for all blanks in Exercise 6
const exerciseSixOptions = ['and', 'but', 'so'];

// Sentences only – all use the same conjunction options above
const exerciseSixSentences = [
    'It’s cold today, _ it’s very windy.',
    'It’s noon, _ we’re eating lunch.',
    'John is wearing shoes, _ he isn’t wearing socks.',
    'Sara is wearing a coat, _ she isn’t wearing gloves.',
    'It’s raining, _ the streets are wet.'
];

exerciseSixSentences.forEach((sentence, index) => {
    const sentenceRow = createTag('div');
    setClass(sentenceRow, 'multiple-choice-row');

    const numberTag = createTag('p');
    setClass(numberTag, 'number');
    setContent(numberTag, `${index + 1}.`);

    const sentenceTag = createTag('p');
    setClass(sentenceTag, 'sentence');
    const sentenceFragment = buildMultipleChoiceSentenceFragment(
        sentence,
        exerciseSixOptions
    );
    sentenceTag.appendChild(sentenceFragment);

    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, sentenceTag);
    appendChilds(contentSix, sentenceRow);
});

function buildMultipleChoiceSentenceFragment (sentence, options = []) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            const capitalise = shouldCapitaliseDropdown(part, partIndex);
            fragment.appendChild(
                createMultipleChoiceDropdown(options, capitalise)
            );
        }
    });

    return fragment;
}

function createMultipleChoiceDropdown (options = [], capitalise = false) {
    const select = createTag('select');
    setClass(select, 'text-dropdown');

    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(select, placeholder);

    options.forEach((optionLabel) => {
        const option = createTag('option');
        option.value = optionLabel;
        option.textContent = formatDropdownLabel(optionLabel, capitalise);
        appendChilds(select, option);
    });

    return select;
}

/* EVENT LISTENER – track answers for Exercise 6 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

// Review map for Exercise 6 (5 items – sentence connectors)
// Items 1–5 -> Unit 3 / Exercise 3
        const reviewMap = [
    { unit: 3, exercise: 3 },
    { unit: 3, exercise: 3 },
    { unit: 3, exercise: 3 },
    { unit: 3, exercise: 3 },
    { unit: 3, exercise: 3 }
        ];

        const selects = document.querySelectorAll(
            '#exercise-Six select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise6.dropdowns ?? [];
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

        window.studentChoices.choicesSix = correctAnswersChosen;
        window.studentChoices.choicesSixHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});