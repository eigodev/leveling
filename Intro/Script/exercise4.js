const exerciseFourContainer = document.getElementById('exercise-Four');
if (!exerciseFourContainer) {
    throw new Error('Missing exercise-Four container for exercise four content.');
}

const contentFour = createTag('div');
setClass(contentFour, 'content');
appendChilds(exerciseFourContainer, contentFour);

const exerciseFourData = {
    1: {
        sentence: 'Robert is handsome. He’s very _.',
        options: ['friendly', 'good-looking', 'serious']
    },
    2: {
        sentence: 'Anne works in a store, and she handles money. She’s _.',
        options: ['a cashier', 'a manager', 'a secretary']
    },
    3: {
        sentence: 'Mid doesn’t like her job. It’s very _.',
        options: ['interesting', 'exciting', 'boring']
    },
    4: {
        sentence: 'Mario is Celia\'s father. Celia is his _.',
        options: ['wife', 'daughter', 'sister']
    },
    5: {
        sentence: 'It’s 10:00 A.M., and Zachary is sleeping. He gets up late _ Saturdays.',
        options: ['on', 'in', 'at']
    }
};

Object.keys(exerciseFourData).forEach((key) => {
    const { sentence, options } = exerciseFourData[key];

    const sentenceRow = createTag('div');
    setClass(sentenceRow, 'multiple-choice-row');

    const numberTag = createTag('p');
    setClass(numberTag, 'number');
    setContent(numberTag, `${key}.`);

    const sentenceTag = createTag('p');
    setClass(sentenceTag, 'sentence');
    const sentenceFragment = buildMultipleChoiceSentenceFragment(
        sentence,
        options
    );
    sentenceTag.appendChild(sentenceFragment);

    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, sentenceTag);
    appendChilds(contentFour, sentenceRow);
});

// Helper functions – same logic as Exercise 6
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
        // Items 1–5 -> Unit 5 (book only provides the unit number)
        const reviewMap = [
            { unit: 5, exercise: null },
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