const exerciseFourContainer = document.getElementById('exercise-Four');
if (!exerciseFourContainer) {
    throw new Error('Missing exercise-Four container for exercise four content.');
}

const contentFour = createTag('div');
setClass(contentFour, 'content');
appendChilds(exerciseFourContainer, contentFour);

const conversationData = [
    {
        promptA: 'Would you mind waiting here, please?',
        options: [
            "Sorry. I'm cold.",
            "I'm sorry. I can't. I don't have time.",
            'Yes, I agree. We are!'
        ]
    },
    {
        promptA: 'What are you going to do Saturday?',
        options: [
            "I probably won't do anything.",
            "That doesn't sound like much fun.",
            "It's too early."
        ]
    },
    {
        promptA: "You'd better take a sweater with you.",
        options: [
            'This one is better.',
            'Thanks, I will.',
            'Yes, you should.'
        ]
    },
    {
        promptA: 'Do you know where the nearest bus stop is?',
        options: [
            "That's great. I really appreciate it.",
            'Sure. Would you like to see them?',
            "No, I'm sorry. I don't."
        ]
    },
    {
        promptA: 'I wish I could take a vacation.',
        options: [
            "That's too bad. Why not?",
            'I know what you mean.',
            "I don't like to, either."
        ]
    }
];

conversationData.forEach((item, index) => {
    const block = createTag('div');
    setClass(block, 'conversation-block');

    const numberTag = createTag('p');
    setClass(numberTag, 'number');
    setContent(numberTag, `${index + 1}.`);

    const conversationWrapper = createTag('div');
    setClass(conversationWrapper, 'conversation');

    const rowA = createConversationRow('A:', item.promptA);
    const rowB = createConversationRow('B:', item.options);

    appendChilds(conversationWrapper, rowA);
    appendChilds(conversationWrapper, rowB);

    appendChilds(block, numberTag);
    appendChilds(block, conversationWrapper);
    appendChilds(contentFour, block);
});

function createConversationRow (speakerLabel, textOrOptions) {
    const row = createTag('div');
    setClass(row, 'conversation-row');

    const speakerTag = createTag('p');
    setClass(speakerTag, 'letter');
    setContent(speakerTag, speakerLabel);

    const textTag = createTag('p');
    setClass(textTag, 'text');

    if (Array.isArray(textOrOptions)) {
        const select = createConversationDropdown(textOrOptions);
        appendChilds(textTag, select);
    } else {
        setContent(textTag, textOrOptions);
    }

    appendChilds(row, speakerTag);
    appendChilds(row, textTag);
    return row;
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
    availableOptions.forEach((optionLabel) => {
        const option = createTag('option');
        option.value = optionLabel;
        option.textContent = optionLabel;
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

        // Review map for Exercise 4 (conversation responses)
        const reviewMap = [
            null,
            null,
            null,
            null,
            null
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