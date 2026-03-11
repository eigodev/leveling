const exerciseSixContainer = document.getElementById('exercise-Six');
if (!exerciseSixContainer) {
    throw new Error('Missing exercise-Six container for exercise six content.');
}

const contentSix = createTag('div');
setClass(contentSix, 'content');
appendChilds(exerciseSixContainer, contentSix);

const exerciseSixData = {
    1: {
        sentence: 'Dana serves passengers on an airplane. She’s a _.',
        options: ['flight attendant', 'chef', 'receptionist']
    },
    2: {
        sentence: 'Jonathan is my father’s brother. He’s my _.',
        options: ['grandfather', 'cousin', 'uncle']
    },
    3: {
        sentence: 'The party last night was fun. I _ a good time.',
        options: ['did', 'made', 'had']
    },
    4: {
        sentence: 'Pat isn’t an actor, but he’s on a TV show. It’s a _ about soccer.',
        options: ['soap opera', 'science fiction show', 'reality show']
    },
    5: {
        sentence: 'Derek is very fit. He _ every day.',
        options: ['does weight training', 'plays the piano', 'sits on the couch']
    }
};

// Insert dropdowns for '_'
Object.keys(exerciseSixData).forEach((key, index) => {
    const sentenceRow = createTag('div');
    const numberTag = createTag('p');
    const sentenceTag = createTag('p');

    setClass(sentenceRow, 'sentence-row');
    setClass(numberTag, 'number');
    setClass(sentenceTag, 'sentence');

    setContent(numberTag, `${index + 1}.`);

    // Create dropdown for the blank in the sentence
    const sentenceStr = exerciseSixData[key].sentence;
    const options = exerciseSixData[key].options;

    const parts = sentenceStr.split('_');
    for (let index = 0; index < parts.length; index++) {
        if (parts[index]) {
            const textNode = document.createTextNode(parts[index].trimStart());
            appendChilds(sentenceTag, textNode);
        }
        // Insert dropdown after every '_' (except after last part)
        if (index < parts.length - 1) {
            const select = createTag('select');
            setClass(select, 'text-dropdown');
            const emptyOption = createTag('option');
            emptyOption.value = '';
            emptyOption.textContent = ' ';
            appendChilds(select, emptyOption);

            options.forEach(optionText => {
                const option = createTag('option');
                option.value = optionText;
                option.textContent = optionText;
                appendChilds(select, option);
            });
            appendChilds(sentenceTag, select);
        }
    }
    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, sentenceTag);
    appendChilds(contentSix, sentenceRow);
});


/* EVENT LISTENER – track answers for Exercise 6 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 6
        // Item 1 -> Unit 2 / Exercise 2
        // Item 2 -> Unit 5 / Exercise 1
        // Item 3 -> Unit 7 / Exercise 5
        // Item 4 -> Unit 4 / Exercise 2
        // Item 5 -> Unit 6 / Exercise 2
        const reviewMap = [
            { unit: 2, exercise: 2 },
            { unit: 5, exercise: 1 },
            { unit: 7, exercise: 5 },
            { unit: 4, exercise: 2 },
            { unit: 6, exercise: 2 }
        ];

        const selects = document.querySelectorAll(
            '#exercise-Six select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise6.dropdowns ?? [];
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

        window.studentChoices.choicesSix = correctAnswersChosen;
        window.studentChoices.choicesSixHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});