const exerciseEightContainer = document.getElementById('exercise-Eight');
if (!exerciseEightContainer) {
    throw new Error('Missing exercise-Eight container for exercise eight content.');
}

const contentEight = createTag('div');
setClass(contentEight, 'content');
appendChilds(exerciseEightContainer, contentEight);

const image = document.createElement('img');
image.src = 'Images/Content/IMG_0001.jpg';
image.alt = 'Winter Carnival';
contentEight.appendChild(image);

const statements = [
    "Quebec’s Winter Carnival started about 17 years ago.",
    "Bonhomme Carnaval is a man dressed as a snowman.",
    "The snow sculpture display takes place indoors.",
    "About a million tourists visit the carnival each year."
];

const trueFalseOptions = [
    { value: "", text: "" },
    { value: "True", text: "True" },
    { value: "False", text: "False" }
];

// Create the wrapper for the T/F statements, with a CSS class for styling
const tfWrapper = document.createElement('div');
tfWrapper.className = 'wrapper';

statements.forEach((text, index) => {
    // Row for each statement
    const row = document.createElement('div');
    row.className = 'row';

    // Number
    const number = document.createElement('p');
    number.className = 'number';
    number.textContent = (index + 1) + '.';
    row.appendChild(number);

    // Dropdown
    const dropdown = document.createElement('select');
    dropdown.className = 'text-dropdown';
    dropdown.setAttribute('data-ex8-tf', (index + 1));
    trueFalseOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        dropdown.appendChild(option);
    });
    row.appendChild(dropdown);

    // Text Statement
    const statement = document.createElement('p');
    statement.className = 'sentence';
    statement.textContent = text;
    row.appendChild(statement);

    tfWrapper.appendChild(row);
});

// Add True/False statements under image in Exercise 8
contentEight.appendChild(tfWrapper);

// For answer checking, expose dropdown references
window.exercise8TrueFalseDropdowns = [
    ...tfWrapper.querySelectorAll('select[data-ex8-tf]')
];

// Expose reset helper globally so other scripts can clear Exercise 8
window.resetExerciseEightConnections = resetExerciseEightConnections;

/* EVENT LISTENER – track answers for Exercise 8 (matching) */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (
        !button ||
        !window.studentChoices ||
        !window.expectedAnswers ||
        typeof connectionState === 'undefined'
    ) {
        return;
    }

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 8 (matching)
        // Item 1 -> Unit 6 / Exercise 4
        // Item 2 -> Unit 5 / Exercise 5
        // Item 3 -> Unit 8 / Exercise 3
        // Item 4 -> Unit 1 / Exercise 8
        // Item 5 -> Unit 4 / Exercise 9
        // Item 6 -> Unit 4 / Exercise 4
        const reviewMap = [
            { unit: 6, exercise: 4 },
            { unit: 5, exercise: 5 },
            { unit: 8, exercise: 3 },
            { unit: 1, exercise: 8 },
            { unit: 4, exercise: 9 },
            { unit: 4, exercise: 4 }
        ];

        const expectedMatches = window.expectedAnswers.exercise8.matches ?? {};
        const questionIds = Object.keys(expectedMatches);
        const totalQuestions = questionIds.length;

        questionIds.forEach((questionId, index) => {
            const expectedAnswerId = expectedMatches[questionId];
            const connection = connectionState.questionConnections.get(
                questionId
            );
            const userAnswerId = connection?.answerId ?? null;
            const isCorrect = userAnswerId === expectedAnswerId;
            const reviewInfo = reviewMap[index] ?? null;

            const expectedText =
                exerciseEightAnswers[expectedAnswerId] ?? null;
            const userText =
                (userAnswerId && exerciseEightAnswers[userAnswerId]) || null;
            const questionText = exerciseEightQuestions[questionId] ?? null;

            if (isCorrect) {
                items++;
                score++;
                if (expectedText) {
                    correctAnswersChosen.push(expectedText);
                }
            } else {
                wrongAnswersChosen.push(userText);
            }

            details.push({
                questionIndex: index,
                questionId,
                questionText,
                expectedAnswerId,
                expectedAnswerText: expectedText,
                expectedAnswer: expectedText,
                userAnswerId,
                userAnswerText: userText,
                unit: reviewInfo?.unit ?? null,
                exercise: reviewInfo?.exercise ?? null,
                reviewCode:
                    reviewInfo != null
                        ? `${reviewInfo.unit}/${reviewInfo.exercise}`
                        : null,
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

        window.studentChoices.choicesEight = correctAnswersChosen;
        window.studentChoices.choicesEightHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});