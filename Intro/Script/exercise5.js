const exerciseFiveContainer = document.getElementById('exercise-Five');
if (!exerciseFiveContainer) {
    throw new Error('Missing exercise-Five container for exercise five content.');
}

const contentFive = createTag('div');
setClass(contentFive, 'content');
appendChilds(exerciseFiveContainer, contentFive);

// Outer conversation wrapper (same layout pattern as Exercise 2)
const conversationWrapperFive = createTag('div');
setClass(conversationWrapperFive, 'conversation');
appendChilds(contentFive, conversationWrapperFive);

// Conversation between Joey and Kate (same structure as Exercise 2)
const conversationDataFive = [
    {
        speaker: 'Joey',
        line: 'Kate, _ my cell phone?'
    },
    {
        speaker: 'Kate',
        line: "I don’t know, but _ is a cell phone on the dresser."
    },
    {
        speaker: 'Joey',
        line: 'Oh, good. _ my phone. And are _ my glasses?'
    },
    {
        speaker: 'Kate',
        line: "No, _ aren’t. _ glasses are in the kitchen."
    },
    {
        speaker: 'Joey',
        line: 'Great. Thanks.'
    }
];

// Word box for all blanks
const exerciseFiveDropdownOptions = [
    "it's",
    'there',
    'these',
    'they',
    "they're",
    'where is',
    'your',
    "you're"
];

conversationDataFive.forEach(({ speaker, line }) => {
    const conversationRow = createTag('div');
    setClass(conversationRow, 'conversation-row');

    const speakerLabel = createTag('p');
    setClass(speakerLabel, 'speaker');
    setContent(speakerLabel, `${speaker}:`);

    const speakerLine = createTag('p');
    setClass(speakerLine, 'line');

    const dropdownOptions = line.includes('_')
        ? exerciseFiveDropdownOptions
        : [];

    const lineFragment = buildConversationTextFragment(
        line,
        dropdownOptions
    );
    speakerLine.appendChild(lineFragment);

    appendChilds(conversationRow, speakerLabel);
    appendChilds(conversationRow, speakerLine);
    appendChilds(conversationWrapperFive, conversationRow);
});

// Ensure conversation rows 1, 2, 4 and 5 share the same width
// (they all follow whichever of these is currently the widest).
function normalizeConversationLineWidthsFive () {
    const lineNodes = Array.from(
        exerciseFiveContainer.querySelectorAll(
            'div.content div.conversation div.conversation-row p.line'
        )
    );
    if (!lineNodes.length) return;

    // We care about rows 1, 2, 4 and 5 for applying width,
    // but the maximum width should consider ALL rows (1–5),
    // so that if row 3 is the widest, the others follow its size.
    const targetIndexes = [0, 1, 3, 4].filter((index) => index < lineNodes.length);
    if (!targetIndexes.length) return;

    // Reset widths to measure natural size
    targetIndexes.forEach((index) => {
        const el = lineNodes[index];
        if (el) el.style.width = '';
    });

    let maxWidth = 0;
    // Measure all rows to find the true maximum width
    lineNodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > maxWidth) {
            maxWidth = rect.width;
        }
    });

    if (!maxWidth) return;

    targetIndexes.forEach((index) => {
        const el = lineNodes[index];
        if (el) el.style.width = `${maxWidth}px`;
    });
}

// Run once after DOM for Exercise 5 is built
normalizeConversationLineWidthsFive();

/* UNIQUE DROPDOWN BEHAVIOUR – each word can only be used once */
let exerciseFiveSelects = [];

function updateExerciseFiveDropdownOptions () {
    if (!exerciseFiveSelects.length) return;

    // Collect all currently selected, non‑empty values
    const selectedValues = new Set(
        exerciseFiveSelects
            .map((select) => select.value)
            .filter((value) => value !== '')
    );

    exerciseFiveSelects.forEach((select) => {
        Array.from(select.options).forEach((option) => {
            const { value } = option;

            // Keep the placeholder behaviour as originally defined
            if (value === '') {
                option.disabled = true;
                option.hidden = false;
                return;
            }

            // The option chosen in this select must stay enabled here,
            // but should be disabled / hidden in all the others.
            const isSelectedHere = select.value === value;
            const isUsedSomewhereElse =
                selectedValues.has(value) && !isSelectedHere;

            option.disabled = isUsedSomewhereElse;
            option.hidden = isUsedSomewhereElse;
        });
    });
}

function setupExerciseFiveUniqueDropdowns () {
    exerciseFiveSelects = Array.from(
        exerciseFiveContainer.querySelectorAll('#exercise-Five select.text-dropdown')
    );
    if (!exerciseFiveSelects.length) return;

    exerciseFiveSelects.forEach((select) => {
        select.addEventListener('change', updateExerciseFiveDropdownOptions);
    });

    // Initial sync so that all options start enabled
    updateExerciseFiveDropdownOptions();
}

// Allow other scripts (e.g. reset logic) to completely reset Exercise 5
function resetExerciseFiveDropdowns () {
    if (!exerciseFiveSelects.length) return;

    exerciseFiveSelects.forEach((select) => {
        if (select.options && select.options.length > 0) {
            select.selectedIndex = 0;
        } else {
            select.value = '';
        }
    });

    updateExerciseFiveDropdownOptions();
}

window.resetExerciseFiveDropdowns = resetExerciseFiveDropdowns;

// Once the whole page is ready, activate unique dropdown behaviour
window.addEventListener('load', () => {
    setupExerciseFiveUniqueDropdowns();
});

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
        // Items 3, 5, 6 -> Unit 5 / Exercise 5
        const reviewMap = [
            { unit: 2, exercise: 5 }, // 1
            { unit: 2, exercise: 5 }, // 2
            { unit: 5, exercise: 5 }, // 3
            { unit: 2, exercise: 5 }, // 4
            { unit: 5, exercise: 5 }, // 5
            { unit: 5, exercise: 5 }  // 6
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