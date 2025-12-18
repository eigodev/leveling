const exerciseEightContainer = document.getElementById('exercise-Eight');
if (!exerciseEightContainer) {
    throw new Error('Missing exercise-Eight container for exercise eight content.');
}

const contentEight = createTag('div');
setClass(contentEight, 'content');
appendChilds(exerciseEightContainer, contentEight);

const exerciseEightQuestions = {
    questionOne: 'How often do you go to the movies?',
    questionTwo: "What's playing at the movie theater this week?",
    questionThree: 'Are there any movie theaters in your neighborhood?',
    questionFour: 'I want to see a movie. Are you free tonight?',
    questionFive: 'Would you like to go to a movie on Saturday?',
    questionSix: 'Do you want to see the new Brad Pitt movie?'
};

const exerciseEightAnswers = {
    answerOne: 'Yes, I do. I like him a lot.',
    answerTwo: 'Yes, I would.',
    answerThree: 'Sometimes twice a month.',
    answerFour: "No, I'm not.",
    answerFive: 'A horror movie.',
    answerSix: "No, there aren't."
};

const matchingArea = createTag('div');
setClass(matchingArea, 'matching-area');
appendChilds(contentEight, matchingArea);

const connectionLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
connectionLayer.classList.add('connection-layer');
matchingArea.appendChild(connectionLayer);

const questionsContainer = createTag('div');
setClass(questionsContainer, 'column questions');
appendChilds(matchingArea, questionsContainer);

const divider = createTag('div');
setClass(divider, 'middle-divider');
appendChilds(matchingArea, divider);

const answersContainer = createTag('div');
setClass(answersContainer, 'column answers');
appendChilds(matchingArea, answersContainer);

const connectionState = {
    active: null,
    questionConnections: new Map(),
    answerConnections: new Map()
};

Object.entries(exerciseEightQuestions).forEach(([questionId, questionText]) => {
    const questionRow = createTag('div');
    const text = createTag('p');
    const square = createTag('div');

    setClass(questionRow, 'row question-row');
    setClass(text, 'text');
    setClass(square, 'square question-square');

    square.dataset.questionId = questionId;
    setContent(text, questionText);

    appendChilds(questionRow, text);
    appendChilds(questionRow, square);
    appendChilds(questionsContainer, questionRow);

    square.addEventListener('pointerdown', (event) =>
        handleQuestionPointerDown(event, questionId, square)
    );
});

Object.entries(exerciseEightAnswers).forEach(([answerId, answerText]) => {
    const answerRow = createTag('div');
    const square = createTag('div');
    const text = createTag('p');

    setClass(answerRow, 'row answer-row');
    setClass(square, 'square answer-square');
    setClass(text, 'text');

    square.dataset.answerId = answerId;
    setContent(text, answerText);

    appendChilds(answerRow, square);
    appendChilds(answerRow, text);
    appendChilds(answersContainer, answerRow);

});

function handleQuestionPointerDown (event, questionId, square) {
    event.preventDefault();
    startConnection(questionId, square);
}

function startConnection (questionId, questionSquare) {
    removeConnection(questionId);
    updateConnectionLayerSize();

    const startPoint = getSquareCenter(questionSquare);
    const line = createSvgLine(startPoint);
    connectionLayer.appendChild(line);

    connectionState.active = {
        questionId,
        questionSquare,
        line
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
}

function handlePointerMove (event) {
    if (!connectionState.active) {
        return;
    }

    const point = getRelativePoint(event);
    setLineEnd(connectionState.active.line, point);
}

function handlePointerUp (event) {
    if (!connectionState.active) {
        return;
    }

    const answerSquare = getAnswerSquareFromEvent(event);

    if (answerSquare?.dataset.answerId) {
        finalizeConnection(answerSquare);
    } else {
        connectionState.active.line.remove();
    }

    cleanupActiveConnectionListeners();
    connectionState.active = null;
}

function finalizeConnection (answerSquare) {
    const { questionId, questionSquare, line } = connectionState.active;
    const answerId = answerSquare.dataset.answerId;

    removeConnectionByAnswer(answerId);

    const startPoint = getSquareCenter(questionSquare);
    const endPoint = getSquareCenter(answerSquare);
    setLinePositions(line, startPoint, endPoint);

    connectionState.questionConnections.set(questionId, {
        answerId,
        line,
        questionSquare,
        answerSquare
    });
    connectionState.answerConnections.set(answerId, questionId);
}

function removeConnection (questionId) {
    const existingConnection = connectionState.questionConnections.get(questionId);
    if (!existingConnection) {
        return;
    }

    existingConnection.line.remove();
    connectionState.questionConnections.delete(questionId);
    connectionState.answerConnections.delete(existingConnection.answerId);
}

function removeConnectionByAnswer (answerId) {
    const questionId = connectionState.answerConnections.get(answerId);
    if (questionId) {
        removeConnection(questionId);
    }
}

function cleanupActiveConnectionListeners () {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
}

function createSvgLine (startPoint) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    setLinePositions(path, startPoint, startPoint);
    return path;
}

function setLinePositions (line, startPoint, endPoint) {
    line.dataset.x1 = startPoint.x;
    line.dataset.y1 = startPoint.y;
    setLineEnd(line, endPoint ?? startPoint);
}

function setLineEnd (line, point) {
    const startPoint = {
        x: Number(line.dataset.x1),
        y: Number(line.dataset.y1)
    };
    const pathData = buildCurvePath(startPoint, point);
    line.setAttribute('d', pathData);
}

function getSquareCenter (square) {
    const squareRect = square.getBoundingClientRect();
    const areaRect = matchingArea.getBoundingClientRect();

    return {
        x: squareRect.left - areaRect.left + squareRect.width / 2,
        y: squareRect.top - areaRect.top + squareRect.height / 2
    };
}

function getRelativePoint (event) {
    const areaRect = matchingArea.getBoundingClientRect();
    return {
        x: event.clientX - areaRect.left,
        y: event.clientY - areaRect.top
    };
}

function getAnswerSquareFromEvent (event) {
    const directSquare = event.target.closest('.answer-square');
    if (directSquare) {
        return directSquare;
    }

    const answerRow = event.target.closest('.answer-row');
    return answerRow ? answerRow.querySelector('.answer-square') : null;
}

function updateConnectionLayerSize () {
    const { height } = matchingArea.getBoundingClientRect();
    connectionLayer.setAttribute('width', 550);
    connectionLayer.setAttribute('height', height);
}

function refreshConnectionLines () {
    connectionState.questionConnections.forEach(
        ({ line, questionSquare, answerSquare }) => {
            const startPoint = getSquareCenter(questionSquare);
            const endPoint = getSquareCenter(answerSquare);
            setLinePositions(line, startPoint, endPoint);
        }
    );
}

function buildCurvePath (startPoint, endPoint) {
    const controlX = (startPoint.x + endPoint.x) / 2;
    return `M ${startPoint.x} ${startPoint.y} C ${controlX} ${startPoint.y}, ${controlX} ${endPoint.y}, ${endPoint.x} ${endPoint.y}`;
}

const handleResize = () => {
    updateConnectionLayerSize();
    refreshConnectionLines();
};

handleResize();
window.addEventListener('resize', handleResize);

function resetExerciseEightConnections () {
    if (!connectionState || !connectionLayer) return;

    connectionState.questionConnections.forEach(({ line }) => {
        if (line && typeof line.remove === 'function') {
            line.remove();
        }
    });
    connectionState.questionConnections.clear();
    connectionState.answerConnections.clear();

    updateConnectionLayerSize();
}

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