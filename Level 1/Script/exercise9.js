const exerciseNineContainer = document.getElementById('exercise-Nine');
if (!exerciseNineContainer) {
    throw new Error('Missing exercise-Nine container for exercise nine content.');
}

const contentNine = createTag('div');
setClass(contentNine, 'content');
appendChilds(exerciseNineContainer, contentNine);

const exerciseNineData = [
    {
        number: 1,
        lines: {
            A: 'I like those earrings.',
            B: 'Do you mean _ ?'
        },
        options: ['that gold', 'those gold', 'the gold ones']
    },
    {
        number: 2,
        lines: {
            A: 'Can you go to dinner with me tomorrow?',
            B: "No, I'm sorry. I work _ Saturdays."
        },
        options: ['in', 'on', 'at']
    },
    {
        number: 3,
        lines: {
            A: 'Which shirt do you prefer?',
            B: "I prefer the blue one. It's _ the orange one."
        },
        options: ['the nice', 'nicer', 'nicer than']
    },
    {
        number: 4,
        lines: {
            A: 'How _ do you go out to dinner?',
            B: 'About once a month.'
        },
        options: ['long', 'well', 'often']
    },
    {
        number: 5,
        lines: {
            A: 'Would you like to take a walk?',
            B: 'Yes, _ .'
        },
        options: ['I do', "I'd like", "I'd love to"]
    },
    {
        number: 6,
        lines: {
            A: "I'm looking for a drugstore.",
            B: 'I think _ one on Main Street.'
        },
        options: ["it's", "that's", "there's"]
    }
];

exerciseNineData.forEach(({ number, lines, options }) => {
    const exerciseWrapper = createTag('div');
    setClass(exerciseWrapper, 'conversation');
    appendChilds(contentNine, exerciseWrapper);

    const exerciseNumber = createTag('p');
    setClass(exerciseNumber, 'number');
    setContent(exerciseNumber, `${number}.`);
    appendChilds(exerciseWrapper, exerciseNumber);

    (['A', 'B']).forEach((speaker) => {
        const conversationRow = createTag('div');
        setClass(conversationRow, 'conversation-row');

        const speakerLabel = createTag('p');
        setClass(speakerLabel, 'letter');
        setContent(speakerLabel, `${speaker.toLowerCase()}.`);

        const speakerLine = createTag('p');
        setClass(speakerLine, 'text');

        const sentence = lines[speaker];
        const dropdownOptions = sentence.includes('_') ? options : [];
        const sentenceFragment = buildExerciseNineSentenceFragment(
            sentence,
            dropdownOptions
        );
        speakerLine.appendChild(sentenceFragment);

        appendChilds(conversationRow, speakerLabel);
        appendChilds(conversationRow, speakerLine);
        appendChilds(exerciseWrapper, conversationRow);
    });
});

function buildExerciseNineSentenceFragment (sentence, dropdownOptions = []) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            fragment.appendChild(
                createExerciseNineDropdown(dropdownOptions)
            );
        }
    });

    return fragment;
}

function createExerciseNineDropdown (options = []) {
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

/* EVENT LISTENER – track answers for Exercise 9 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 9
        // Item 1 -> Unit 3 / Exercise 3
        // Item 2 -> Unit 2 / Exercise 9
        // Item 3 -> Unit 3 / Exercise 10
        // Item 4 -> Unit 6 / Exercise 11
        // Item 5 -> Unit 4 / Exercise 9
        // Item 6 -> Unit 8 / Exercise 3
        const reviewMap = [
            { unit: 3, exercise: 3 },
            { unit: 2, exercise: 9 },
            { unit: 3, exercise: 10 },
            { unit: 6, exercise: 11 },
            { unit: 4, exercise: 9 },
            { unit: 8, exercise: 3 }
        ];

        const selects = document.querySelectorAll(
            '#exercise-Nine select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise9.dropdowns ?? [];
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

        window.studentChoices.choicesNine = correctAnswersChosen;
        window.studentChoices.choicesNineHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});