const exerciseFourContainer = document.getElementById('exercise-Four');
if (!exerciseFourContainer) {
    throw new Error('Missing exercise-Four container for exercise four content.');
}

const contentFour = createTag('div');
setClass(contentFour, 'content');
appendChilds(exerciseFourContainer, contentFour);

const compositionImage = createTag('img');
setAttributeID(compositionImage, 'src', 'Images/Composition/IMG_0001.png');
setAttributeID(compositionImage, 'alt', 'Brenda\'s composition');
appendChilds(contentFour, compositionImage);

const compositionPrompts = [
    'Brenda has one brother and one sister.',
    'Her brother lives in the same city as her parents.',
    'Her mother isn’t working now.',
    'Brenda is living with her family.'
];

const compositionDropdownOptions = ['True', 'False'];

compositionPrompts.forEach((prompt, index) => {
    const promptRow = createTag('div');
    setClass(promptRow, 'composition-row');

    const promptNumber = createTag('p');
    setClass(promptNumber, 'number');
    setContent(promptNumber, `${index + 1}.`);

    const answerDropdown = createTag('select');
    setClass(answerDropdown, 'text-dropdown');
    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(answerDropdown, placeholder);

    compositionDropdownOptions.forEach((optionValue) => {
        const option = createTag('option');
        option.value = optionValue;
        option.textContent = optionValue;
        appendChilds(answerDropdown, option);
    });

    const promptSentence = createTag('p');
    setClass(promptSentence, 'sentence');
    setContent(promptSentence, prompt);

    appendChilds(promptRow, promptNumber);
    appendChilds(promptRow, answerDropdown);
    appendChilds(promptRow, promptSentence);
    appendChilds(contentFour, promptRow);
});

/* EVENT LISTENER – track answers for Exercise 4 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 4
        // Items 1–4 -> Unit 5 (book only provides the unit number)
        const reviewMap = [
            { unit: 5, exercise: null },
            { unit: 5, exercise: null },
            { unit: 5, exercise: null },
            { unit: 5, exercise: null }
        ];

        const selects = document.querySelectorAll(
            '#exercise-Four select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise4.dropdowns ?? [];
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
                        ? reviewInfo.exercise != null
                            ? `${reviewInfo.unit}/${reviewInfo.exercise}`
                            : `${reviewInfo.unit}`
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

        window.studentChoices.choicesFour = correctAnswersChosen;
        window.studentChoices.choicesFourHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});