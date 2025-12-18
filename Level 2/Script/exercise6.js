const exerciseSixContainer = document.getElementById('exercise-Six');
if (!exerciseSixContainer) {
    throw new Error('Missing exercise-Six container for exercise six content.');
}

const contentSix = createTag('div');
setClass(contentSix, 'content');
appendChilds(exerciseSixContainer, contentSix);

const exerciseSixData = {
    1: {
        sentence: 'The city passed a new bill to build several bike _',
        options: ['lanes', 'lights', 'spaces']
    },
    2: {
        sentence: 'You\'re boots are wet. _ before you walk on my clean floor.',
        options: ['Take them out', 'Turn them off', 'Take them off']
    },
    3: {
        sentence: 'Molly\'s new apartment is amazing. It\'s so bright and _',
        options: ['run-down', 'dingy', 'modern']
    },
    4: {
        sentence: "When I travel, I don't usually bring a large suitcase. I use my _ instead",
        options: ['first-aid kit', 'carry-on bag', 'vaccination card']
    },
    5: {
        sentence: "I only _ free apps onto my tablet.",
        options: ['download', 'backup', 'run down']
    },
    6: {
        sentence: "Could you _ the TV, please?",
        options: ['turn off', 'take out', 'put down']
    }
};

Object.keys(exerciseSixData).forEach((key) => {
    const { sentence, options } = exerciseSixData[key];

    const sentenceRow = createTag('div');
    setClass(sentenceRow, 'multiple-choice-row');

    const numberTag = createTag('p');
    setClass(numberTag, 'number');
    setContent(numberTag, `${key}.`);

    const sentenceTag = createTag('p');
    setClass(sentenceTag, 'sentence');
    const sentenceFragment = buildMultipleChoiceSentenceFragment(sentence, options);
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
            fragment.appendChild(createMultipleChoiceDropdown(options));
        }
    });

    return fragment;
}

function createMultipleChoiceDropdown (options = []) {
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
        option.textContent = optionLabel;
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

        // Review map for Exercise 6
        // Item 1 -> Unit 2 / Exercise 2
        // Item 2 -> Unit 5 / Exercise 1
        // Item 3 -> Unit 7 / Exercise 5
        // Item 4 -> Unit 4 / Exercise 2
        // Item 5 -> Unit 6 / Exercise 2
        const reviewMap = [
            { unit: 2, exercise: 2 },
            { unit: 5, exercise: 1 },
            { unit: 7, exercise: 5 },
            { unit: 4, exercise: 2 },
            { unit: 6, exercise: 2 }
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