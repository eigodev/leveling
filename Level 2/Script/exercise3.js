const exerciseThreeContainer = document.getElementById('exercise-Three');
if (!exerciseThreeContainer) {
    throw new Error('Missing exercise-Three container for exercise three content.');
}

const contentThree = createTag('div');
setClass(contentThree, 'content');
appendChilds(exerciseThreeContainer, contentThree);

const questionData = [
    'Where are you going on vacation next year?',
    'Did you go camping last summer?',
    'Have you ever been to a national park?',
    'Could you please call the travel agency?',
    'Can you tell me when you’re arriving?',
    'How long are you going to be away?'
];

const sharedDropdownOptions = [
    'In a few hours.',
    'About two weeks.',
    "Maybe I'll just stay home.",
    'No, we went to the beach.',
    "No, I haven't.",
    "I'd be glad to."
];

let exerciseThreeSelects = [];

questionData.forEach((questionText, index) => {
    const row = createTag('div');
    setClass(row, 'question-row');

    const numberTag = createTag('p');
    setClass(numberTag, 'number');
    setContent(numberTag, `${index + 1}.`);

    const questionTag = createTag('p');
    setClass(questionTag, 'text');
    questionTag.appendChild(document.createTextNode(questionText));

    const dropdown = createQuestionDropdown(sharedDropdownOptions);

    appendChilds(row, numberTag);
    appendChilds(row, questionTag);
    appendChilds(row, dropdown);
    appendChilds(contentThree, row);
});

function createQuestionDropdown (options = []) {
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
        option.textContent = optionLabel;
        appendChilds(select, option);
    });

    exerciseThreeSelects.push(select);
    return select;
}

function updateExerciseThreeDropdownOptions () {
    if (!exerciseThreeSelects.length) return;

    const selectedValues = new Set(
        exerciseThreeSelects
            .map((select) => select.value)
            .filter((value) => value !== '')
    );

    exerciseThreeSelects.forEach((select) => {
        Array.from(select.options).forEach((option) => {
            if (!option.value) {
                option.disabled = true;
                option.hidden = true;
                return;
            }

            const isSelectedElsewhere =
                selectedValues.has(option.value) && select.value !== option.value;
            option.disabled = isSelectedElsewhere;
            option.hidden = isSelectedElsewhere;
        });
    });
}

function setupExerciseThreeUniqueDropdowns () {
    exerciseThreeSelects.forEach((select) => {
        select.addEventListener('change', updateExerciseThreeButtonsState);
    });
    updateExerciseThreeDropdownOptions();
}

function updateExerciseThreeButtonsState () {
    updateExerciseThreeDropdownOptions();
}

window.addEventListener('load', () => {
    setupExerciseThreeUniqueDropdowns();
});

/* EVENT LISTENER – track answers for Exercise 3 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 3
        const reviewMap = [
            null,
            null,
            null,
            null,
            null,
            null
        ];

        const selects = document.querySelectorAll(
            '#exercise-Three select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise3.dropdowns ?? [];
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

        window.studentChoices.choicesThree = correctAnswersChosen;
        window.studentChoices.choicesThreeHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});