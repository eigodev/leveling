const exerciseThreeContainer = document.getElementById('exercise-Three');
if (!exerciseThreeContainer) {
    throw new Error('Missing exercise-Three container for exercise three content.');
}

const contentThree = createTag('div');
setClass(contentThree, 'content');
appendChilds(exerciseThreeContainer, contentThree);

const storyData = [
    'I live in a nice neighborhood in a big city...',
    '...There are _ nice stores and restaurants near my house...',
    '...It’s busy during the day, but there isn’t _ traffic in the evening or at night...',
    '...There is _ pollution, but _ thinks it’s going to be a big problem...',
    '...There are many programs to help keep the city clean...',
    '...I think that _ the people who live in my neighborhood like it.'
];

const storyDropdownOptions = [
    'a little',
    'few',
    'many',
    'much',
    'nearly all',
    'no one'
];

storyData.forEach((sentence) => {
    const storyLine = createTag('p');

    const sentenceFragment = buildStorySentenceFragment(
        sentence,
        sentence.includes('_') ? storyDropdownOptions : []
    );

    storyLine.appendChild(sentenceFragment);
    appendChilds(contentThree, storyLine);
});

function buildStorySentenceFragment (sentence, dropdownOptions = []) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            fragment.appendChild(createStoryDropdown(dropdownOptions));
        }
    });

    return fragment;
}

function createStoryDropdown (options = []) {
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

    return select;
}

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
        // Items 1–3 -> Unit 8 / Exercise 9
        // Items 4–5 -> Unit 5 / Exercise 10
        const reviewMap = [
            { unit: 8, exercise: 9 },
            { unit: 8, exercise: 9 },
            { unit: 8, exercise: 9 },
            { unit: 5, exercise: 10 },
            { unit: 5, exercise: 10 }
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