const exerciseTwoContainer = document.getElementById('exercise-Two');
if (!exerciseTwoContainer) {
    throw new Error('Missing exercise-Two container for exercise two content.');
}

const contentTwo = createTag('div');
setClass(contentTwo, 'content');
appendChilds(exerciseTwoContainer, contentTwo);

const conversationLines = [
    {
        speaker: 'Mr. Peterson',
        text: 'Dan, _ you mind washing the dishes?'
    },
    {
        speaker: 'Dan',
        text: "Can I do it later? I don't _ to go to practice tonight."
    },
    {
        speaker: 'Mr. Peterson',
        text: 'No. You _ do it now. Our guests are arriving in an hour.'
    },
    {
        speaker: 'Dan',
        text: 'All right, but _ you give me a few minutes to finish this video game?'
    },
    {
        speaker: 'Mr. Peterson',
        text: "Well, OK, but _ better start right after that."
    }
];

const conversationDropdownOptions = [
    ['should', 'could', 'would'],
    ['have', 'must', 'ought'],
    ['needs', 'should', 'would'],
    ['should', 'ought', 'could'],
    ["you'll", "you'd", "you've"]
];

const conversationWrapper = createTag('div');
setClass(conversationWrapper, 'conversation');
appendChilds(contentTwo, conversationWrapper);

let dropdownCursor = 0;

conversationLines.forEach(({ speaker, text }) => {
    const conversationRow = createTag('div');
    setClass(conversationRow, 'conversation-row');

    const speakerLabel = createTag('p');
    setClass(speakerLabel, 'speaker');
    setContent(speakerLabel, speaker);

    const speakerLine = createTag('p');
    setClass(speakerLine, 'line');
    const lineFragment = buildConversationTextFragment(text);
    speakerLine.appendChild(lineFragment);

    appendChilds(conversationRow, speakerLabel);
    appendChilds(conversationRow, speakerLine);
    appendChilds(conversationWrapper, conversationRow);
});

function buildConversationTextFragment (text) {
    const fragment = document.createDocumentFragment();
    const parts = text.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            const options =
                conversationDropdownOptions[dropdownCursor] ?? [];
            fragment.appendChild(createConversationDropdown(options));
            dropdownCursor++;
        }
    });

    return fragment;
}

function createConversationDropdown (options = []) {
    const select = createTag('select');
    setClass(select, 'text-dropdown');

    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(select, placeholder);

    const availableOptions = options.length ? options : ['N/A'];
    availableOptions.forEach((optionValue) => {
        const option = createTag('option');
        option.value = optionValue;
        option.textContent = optionValue;
        appendChilds(select, option);
    });

    return select;
}

/* EVENT LISTENER – track answers for Exercise 2 */
// When the "Check answers" button is clicked, record which dropdowns were
// correct or incorrect for Exercise 2.
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Mapping each blank in Exercise 2 to the course material it reviews.
        const reviewMap = [
            { unit: 7, exercise: 3 },
            { unit: 7, exercise: 3 },
            { unit: 7, exercise: 3 },
            { unit: 7, exercise: 3 },
            { unit: 7, exercise: 3 }
        ];

        const selects = document.querySelectorAll(
            '#exercise-Two select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise2.dropdowns ?? [];
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

        // Build list like ['1/5', '2/5', ...] showing which units/exercises
        // the student should review (only for items answered incorrectly).
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

        window.studentChoices.choicesTwo = correctAnswersChosen;
        window.studentChoices.choicesTwoHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});