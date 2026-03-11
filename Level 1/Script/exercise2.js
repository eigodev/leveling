const exerciseTwoContainer = document.getElementById('exercise-Two');
if (!exerciseTwoContainer) {
    throw new Error('Missing exercise-Two container for exercise two content.');
}

const contentTwo = createTag('div');
setClass(contentTwo, 'content');
appendChilds(exerciseTwoContainer, contentTwo);

const conversationData = [
    [
        'Where are you from?',
        'I _ from India.'
    ],
    [
        'What _ you do?',
        "I'm a pilot."
    ],
    [
        '_ you on vacation?',
        'Yes, I am.'
    ],
    [
        'What _ she play?',
        'She plays the guitar.'
    ]
];

const exerciseTwoDropdownOptions = ['am', 'is', 'are', 'do', 'does'];
const capitalizedOptions = exerciseTwoDropdownOptions.map(
    (option) => option.charAt(0).toUpperCase() + option.slice(1)
);

conversationData.forEach((lines, exerciseIndex) => {
    /* Create the tags */
    const exerciseWrapper = createTag('div');
    const exerciseNumber = createTag('p');
    const lettersWrapper = createTag('div');
    const sentencesWrapper = createTag('div');
    
    /* Set the classes */
    setClass(exerciseWrapper, 'row');
    setClass(exerciseNumber, 'number');
    setClass(lettersWrapper, 'letters');
    setClass(sentencesWrapper, 'sentences');
    
    /* Set the content */
    setContent(exerciseNumber, `${exerciseIndex + 1}.`);
    
    /* Append the childs */
    appendChilds(contentTwo, exerciseWrapper);
    appendChilds(exerciseWrapper, exerciseNumber);
    appendChilds(exerciseWrapper, lettersWrapper);
    appendChilds(exerciseWrapper, sentencesWrapper);

    lines.forEach((line, lineIndex) => {
        /* Create the tags */
        const speakerLabel = createTag('p');
        const speakerLine = createTag('p');
        
        /* Set the classes */
        setClass(speakerLabel, 'letter');
        setClass(speakerLine, lineIndex === 0 ? 'textA' : 'textB');
        
        /* Set the content */
        setContent(speakerLabel, lineIndex === 0 ? 'A.' : 'B.');
        
        /* Append the childs */
        appendChilds(lettersWrapper, speakerLabel);
        appendChilds(sentencesWrapper, speakerLine);

        const needsCapitalization = exerciseIndex === 2 && lineIndex === 0;
        const dropdownOptions = line.includes('_')
            ? (needsCapitalization ? capitalizedOptions : exerciseTwoDropdownOptions)
            : [];

        const lineFragment = buildConversationTextFragment(
            line,
            dropdownOptions
        );
        speakerLine.appendChild(lineFragment);
        appendChilds(sentencesWrapper, speakerLine);
    });
});

function buildConversationTextFragment (text, dropdownOptions = []) {
    const fragment = document.createDocumentFragment();
    const parts = text.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            fragment.appendChild(createConversationDropdown(dropdownOptions));
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
    const button = document.getElementById('check-answers-button');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Mapping each blank in Exercise 2 to the course material it reviews.
        const reviewMap = [
            { unit: 1, exercise: 5 },
            { unit: 2, exercise: 5 },
            { unit: 1, exercise: 8 },
            { unit: 4, exercise: 4 }
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