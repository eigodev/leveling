const exerciseFiveContainer = document.getElementById('exercise-Five');
if (!exerciseFiveContainer) {
    throw new Error('Missing exercise-Five container for exercise five content.');
}

const contentFive = createTag('div');
setClass(contentFive, 'content');
appendChilds(exerciseFiveContainer, contentFive);

const storyDataFive = [
    'My city has some serious transportation problems.',
    "First, there aren't _ buses, and many of the buses are _ crowded.",
    "There's a subway system, but the subways are busy, too – they're as crowded _ the buses.",
    "Part of the problem is there's too little parking downtown.",
    'There should be either _ cars, or one or two _ parking garages.'
];

const storyDropdownOptionsFive = ['almost', 'as', 'enough', 'fewer', 'more', 'too'];

storyDataFive.forEach((sentence) => {
    const storyLine = createTag('p');

    const sentenceFragment = buildStorySentenceFragment(
        sentence,
        sentence.includes('_') ? storyDropdownOptionsFive : []
    );

    storyLine.appendChild(sentenceFragment);
    appendChilds(contentFive, storyLine);
});

function buildStorySentenceFragment (sentence, dropdownOptions = []) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            const options =
                typeof dropdownOptions === 'function'
                    ? dropdownOptions()
                    : dropdownOptions;
            fragment.appendChild(createStoryDropdown(options));
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

/* EVENT LISTENER – track answers for Exercise 5 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 5
        // Items 1, 2, 4 -> Unit 2 / Exercise 5
        // Items 3, 5 -> Unit 5 / Exercise 5
        const reviewMap = [
            { unit: 2, exercise: 5 }, // 1
            { unit: 2, exercise: 5 }, // 2
            { unit: 5, exercise: 5 }, // 3
            { unit: 2, exercise: 5 }, // 4
            { unit: 5, exercise: 5 }  // 5
        ];

        const selects = document.querySelectorAll(
            '#exercise-Five select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise5.dropdowns ?? [];
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

        window.studentChoices.choicesFive = correctAnswersChosen;
        window.studentChoices.choicesFiveHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});