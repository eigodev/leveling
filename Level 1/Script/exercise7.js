const exerciseSevenContainer = document.getElementById('exercise-Seven');
if (!exerciseSevenContainer) {
    throw new Error('Missing exercise-Seven container for exercise seven content.');
}

const contentSeven = createTag('div');
setClass(contentSeven, 'content');
appendChilds(exerciseSevenContainer, contentSeven);

const exerciseSevenConversation = {
    A: [
        'What _ you _ last weekend?',
        'Yes, I _. I _ to Puerto Rico with my cousins.',
        'Yes, I _. I _ to travel!'
    ],
    B: [
        'Nothing special. What about you? _ you on vacation?',
        '_ you _ fun?'
    ]
};

const drodpdownOptions = [
    ['do', 'does', 'did'],
    ['do', 'does', 'did'],
    ['am', 'is', 'are', 'was', 'were'],
    ['am', 'is', 'are', 'was', 'were'],
    ['go', 'goes', 'went'],
    ['do', 'does', 'did'],
    ['have', 'has', 'had'],
    ['do', 'does', 'did'],
    ['love', 'loves', 'loved']
]

// Conversation rows for exercise 7
const conversationRows = [
    { speaker: 'A', lineIndex: 0 },
    { speaker: 'B', lineIndex: 0 },
    { speaker: 'A', lineIndex: 1 },
    { speaker: 'B', lineIndex: 1 },
    { speaker: 'A', lineIndex: 2 }
];

let dropdownGlobalIndex = 0; // Tracks which option set to use in drodpdownOptions

conversationRows.forEach(({ speaker, lineIndex }, rowIndex) => {
    const sentenceRow = createTag('div');
    const speakerTag = createTag('p');
    const sentenceTag = createTag('p');

    // Setting the classes
    setClass(sentenceRow, 'conversation-row');
    setClass(speakerTag, 'letter');
    setClass(sentenceTag, 'sentence');

    // Setting the content
    setContent(speakerTag, speaker + ':');

    const line = exerciseSevenConversation[speaker][lineIndex];
    let parts = line.split('_');
    let prevChar = '.'; // Assume sentence start by default
    for (let index = 0; index < parts.length; index++) {
        if (parts[index]) {
            const partTrimmed = parts[index].trimStart();
            const textNode = document.createTextNode(partTrimmed);
            appendChilds(sentenceTag, textNode);
            // Get last non-space char for punctuation detection
            let trimmed = partTrimmed.trimEnd();
            if (trimmed.length > 0) {
                prevChar = trimmed[trimmed.length - 1];
            }
        }
        if (index < parts.length - 1) {
            // Dropdown with options from drodpdownOptions, indexed globally per blank
            const select = createTag('select');
            setClass(select, 'text-dropdown');

            // Empty default option
            const emptyOption = createTag('option');
            emptyOption.value = '';
            emptyOption.textContent = ' ';
            appendChilds(select, emptyOption);

            // Only two cases: capitalize if at start of sentence or after . ? !
            const shouldCapitalize = (
                (index === 0 && (!parts[0] || parts[0].trim().length === 0 || parts[0].trimStart().length === 0)) // dropdown is at start of sentence
                || prevChar === '.'
                || prevChar === '?'
                || prevChar === '!'
            );

            // Add corresponding options based on dropdownGlobalIndex
            const options = drodpdownOptions[dropdownGlobalIndex] || [];
            options.forEach(optionText => {
                const option = createTag('option');
                option.value = optionText;
                option.textContent = shouldCapitalize
                    ? optionText.charAt(0).toUpperCase() + optionText.slice(1)
                    : optionText;
                appendChilds(select, option);
            });

            appendChilds(sentenceTag, select);
            dropdownGlobalIndex++;
        }
    }

    appendChilds(sentenceRow, speakerTag);
    appendChilds(sentenceRow, sentenceTag);
    appendChilds(contentSeven, sentenceRow);
});

/* EVENT LISTENER – track answers for Exercise 7 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 7 (9 blanks)
        // Items 1, 4–7 and 9 (have, love) -> Unit 7 / Exercise 3; love same tested area as have
        // Items 2 and 3 -> Unit 7 / Exercise 10
        const reviewMap = [
            { unit: 7, exercise: 3 },  // 1
            { unit: 7, exercise: 10 }, // 2
            { unit: 7, exercise: 10 }, // 3
            { unit: 7, exercise: 3 },  // 4
            { unit: 7, exercise: 3 },  // 5
            { unit: 7, exercise: 3 },  // 6
            { unit: 7, exercise: 3 },  // 7 (have)
            { unit: 7, exercise: 3 },  // 8
            { unit: 7, exercise: 3 }   // 9 (love – same area as have)
        ];

        const selects = document.querySelectorAll(
            '#exercise-Seven select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise7.dropdowns ?? [];
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

        window.studentChoices.choicesSeven = correctAnswersChosen;
        window.studentChoices.choicesSevenHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});