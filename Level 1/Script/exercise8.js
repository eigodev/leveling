const exerciseEightContainer = document.getElementById('exercise-Eight');
if (!exerciseEightContainer) {
    throw new Error('Missing exercise-Eight container for exercise eight content.');
}

const contentEight = createTag('div');
setClass(contentEight, 'content');
appendChilds(exerciseEightContainer, contentEight);

// Questions and their corresponding answers
const exerciseEightQuestions = {
    questionOne: 'How often do you go to the movies?',
    questionTwo: "What's playing at the movie theater this week?",
    questionThree: 'Are there any movie theaters in your neighborhood?',
    questionFour: 'I want to see a movie. Are you free tonight?',
    questionFive: 'Would you like to go to a movie on Saturday?',
    questionSix: 'Do you want to see the new Brad Pitt movie?'
};

// Scrambled order on the right column (not aligned with questions)
const exerciseEightAnswers = {
    answerOne: 'Yes, I do. I like him a lot.',
    answerTwo: 'Yes, I would.',
    answerThree: 'Sometimes twice a month.',
    answerFour: "No, I'm not.",
    answerFive: 'A horror movie.',
    answerSix: "No, there aren't."
};

const exerciseEightContent = document.querySelector('#exercise-Eight div.content');
const divQuestions = createTag('div');
const divAnswers = createTag('div');
const divDividerLeft = createTag('div');
const divBlankSpace = createTag('div');
const divDividerRight = createTag('div');
const matchingArea = createTag('div');

setClass(divQuestions, 'questions');
setClass(divDividerLeft, 'divider-left');
setClass(divBlankSpace, 'blank-space');
setClass(divDividerRight, 'divider-right');
setClass(divAnswers, 'answers');
setClass(matchingArea, 'matching-area');

appendChilds(exerciseEightContent, divQuestions);
appendChilds(exerciseEightContent, divDividerLeft);
appendChilds(exerciseEightContent, divBlankSpace);
appendChilds(exerciseEightContent, divDividerRight);
appendChilds(exerciseEightContent, divAnswers);
appendChilds(exerciseEightContent, matchingArea);

// Create SVG layer for drawing connection lines
const connectionLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
connectionLayer.classList.add('connection-layer');
matchingArea.appendChild(connectionLayer);

// Connection state for tracking matches
const connectionStateEight = {
    active: null,
    questionConnections: new Map(),
    answerConnections: new Map()
};

// Make connectionStateEight globally available
window.connectionStateEight = connectionStateEight;

// Titles
const titleQuestions = createTag('p');
const titleAnswers = createTag('p');
const titleDividerLeft = createTag('p');
const titleDividerRight = createTag('p');
// Classes
setClass(titleQuestions, 'title');
setClass(titleAnswers, 'title');
setClass(titleDividerLeft, 'titleDivider');
setClass(titleDividerRight, 'titleDivider');
// Content
setContent(titleQuestions, 'Questions');
setContent(titleAnswers, 'Answers');
setContent(titleDividerLeft, 'a');
setContent(titleDividerRight, 'a');
// Appending
appendChilds(divQuestions, titleQuestions);
appendChilds(divAnswers, titleAnswers);
appendChilds(divDividerLeft, titleDividerLeft);
appendChilds(divDividerRight, titleDividerRight);

Object.entries(exerciseEightQuestions).forEach(([questionId, question]) => {
    // Tags
    const questionItem = createTag('p');
    const dividerItem = createTag('p');

    // Classes
    setClass(questionItem, 'question');
    setClass(dividerItem, 'divider');
    setClass(dividerItem, 'question-square');

    // Data attributes for matching
    dividerItem.dataset.questionId = questionId;

    // Content
    setContent(questionItem, question);
    setContent(dividerItem, '');

    // Appending
    appendChilds(divQuestions, questionItem);
    appendChilds(divDividerLeft, dividerItem);

    // Add click handler for matching
    dividerItem.addEventListener('pointerdown', (event) =>
        handleQuestionPointerDown(event, questionId, dividerItem)
    );
});

// Shuffle the answers array to randomize display order
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Convert answers object to array, shuffle it, then create elements
const answerEntries = Object.entries(exerciseEightAnswers);
const shuffledAnswers = shuffleArray(answerEntries);

shuffledAnswers.forEach(([answerId, answer]) => {
    // Tags
    const answerItem = createTag('p');
    const dividerItem = createTag('p');

    // Classes
    setClass(answerItem, 'answer');
    setClass(dividerItem, 'divider');
    setClass(dividerItem, 'answer-square');

    // Data attributes for matching
    dividerItem.dataset.answerId = answerId;

    // Content
    setContent(answerItem, answer);
    setContent(dividerItem, '');

    // Appending
    appendChilds(divAnswers, answerItem);
    appendChilds(divDividerRight, dividerItem);
});

// Matching functionality functions
function handleQuestionPointerDown(event, questionId, square) {
    event.preventDefault();
    startConnection(questionId, square);
}

function startConnection(questionId, questionSquare) {
    removeConnection(questionId);
    updateConnectionLayerSize();

    const startPoint = getSquareCenter(questionSquare);
    const line = createSvgLine(startPoint);
    connectionLayer.appendChild(line);

    connectionStateEight.active = {
        questionId,
        questionSquare,
        line
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
}

function handlePointerMove(event) {
    if (!connectionStateEight.active) {
        return;
    }

    const point = getRelativePoint(event);
    setLineEnd(connectionStateEight.active.line, point);
}

function handlePointerUp(event) {
    if (!connectionStateEight.active) {
        return;
    }

    const answerSquare = getAnswerSquareFromEvent(event);

    if (answerSquare?.dataset.answerId) {
        finalizeConnection(answerSquare);
    } else {
        connectionStateEight.active.line.remove();
    }

    cleanupActiveConnectionListeners();
    connectionStateEight.active = null;
}

function finalizeConnection(answerSquare) {
    const { questionId, questionSquare, line } = connectionStateEight.active;
    const answerId = answerSquare.dataset.answerId;

    removeConnectionByAnswer(answerId);

    const startPoint = getSquareCenter(questionSquare);
    const endPoint = getSquareCenter(answerSquare);
    setLinePositions(line, startPoint, endPoint);

    connectionStateEight.questionConnections.set(questionId, {
        answerId,
        line,
        questionSquare,
        answerSquare
    });
    connectionStateEight.answerConnections.set(answerId, questionId);
}

function removeConnection(questionId) {
    const existingConnection = connectionStateEight.questionConnections.get(questionId);
    if (!existingConnection) {
        return;
    }

    existingConnection.line.remove();
    connectionStateEight.questionConnections.delete(questionId);
    connectionStateEight.answerConnections.delete(existingConnection.answerId);
}

function removeConnectionByAnswer(answerId) {
    const questionId = connectionStateEight.answerConnections.get(answerId);
    if (questionId) {
        removeConnection(questionId);
    }
}

function cleanupActiveConnectionListeners() {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
}

function createSvgLine(startPoint) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#7a0000');
    path.setAttribute('stroke-width', '2');
    setLinePositions(path, startPoint, startPoint);
    return path;
}

function setLinePositions(line, startPoint, endPoint) {
    line.dataset.x1 = startPoint.x;
    line.dataset.y1 = startPoint.y;
    setLineEnd(line, endPoint ?? startPoint);
}

function setLineEnd(line, point) {
    const startPoint = {
        x: Number(line.dataset.x1),
        y: Number(line.dataset.y1)
    };
    const pathData = buildCurvePath(startPoint, point);
    line.setAttribute('d', pathData);
}

function getSquareCenter(square) {
    const squareRect = square.getBoundingClientRect();
    const areaRect = exerciseEightContent.getBoundingClientRect();

    return {
        x: squareRect.left - areaRect.left + squareRect.width / 2,
        y: squareRect.top - areaRect.top + squareRect.height / 2
    };
}

function getRelativePoint(event) {
    const areaRect = exerciseEightContent.getBoundingClientRect();
    return {
        x: event.clientX - areaRect.left,
        y: event.clientY - areaRect.top
    };
}

function getAnswerSquareFromEvent(event) {
    // Check if clicking directly on an answer square
    const directSquare = event.target.closest('.answer-square');
    if (directSquare && directSquare.dataset.answerId) {
        return directSquare;
    }

    // Check if clicking on an answer item - find corresponding square
    const answerItem = event.target.closest('.answer');
    if (answerItem) {
        const answerRow = answerItem.parentElement;
        const answerIndex = Array.from(answerRow.querySelectorAll('.answer')).indexOf(answerItem);
        if (answerIndex >= 0) {
            const answerSquares = Array.from(divDividerRight.querySelectorAll('.answer-square'));
            if (answerSquares[answerIndex]) {
                return answerSquares[answerIndex];
            }
        }
    }

    // Check if clicking near an answer square
    const allAnswerSquares = Array.from(divDividerRight.querySelectorAll('.answer-square'));
    for (const square of allAnswerSquares) {
        const rect = square.getBoundingClientRect();
        if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        ) {
            return square;
        }
    }

    return null;
}

function updateConnectionLayerSize() {
    const rect = exerciseEightContent.getBoundingClientRect();
    connectionLayer.setAttribute('width', rect.width);
    connectionLayer.setAttribute('height', rect.height);
    connectionLayer.style.position = 'absolute';
    connectionLayer.style.top = '0';
    connectionLayer.style.left = '0';
    connectionLayer.style.pointerEvents = 'none';
    connectionLayer.style.zIndex = '1';
}

function refreshConnectionLines() {
    connectionStateEight.questionConnections.forEach(
        ({ line, questionSquare, answerSquare }) => {
            const startPoint = getSquareCenter(questionSquare);
            const endPoint = getSquareCenter(answerSquare);
            setLinePositions(line, startPoint, endPoint);
        }
    );
}

function buildCurvePath(startPoint, endPoint) {
    const controlX = (startPoint.x + endPoint.x) / 2;
    return `M ${startPoint.x} ${startPoint.y} C ${controlX} ${startPoint.y}, ${controlX} ${endPoint.y}, ${endPoint.x} ${endPoint.y}`;
}

function resetExerciseEightConnections() {
    if (!connectionStateEight || !connectionLayer) return;

    connectionStateEight.questionConnections.forEach(({ line }) => {
        if (line && typeof line.remove === 'function') {
            line.remove();
        }
    });
    connectionStateEight.questionConnections.clear();
    connectionStateEight.answerConnections.clear();

    updateConnectionLayerSize();
}

// Expose reset helper globally so other scripts can clear Exercise 8
window.resetExerciseEightConnections = resetExerciseEightConnections;

// Initialize connection layer and handle resize
const handleResize = () => {
    updateConnectionLayerSize();
    refreshConnectionLines();
};

// Wait for DOM to be ready
setTimeout(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
}, 100);

/* EVENT LISTENER – track answers for Exercise 8 (matching) */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (
        !button ||
        !window.studentChoices ||
        !window.expectedAnswers ||
        typeof connectionStateEight === 'undefined'
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
            const connection = connectionStateEight.questionConnections.get(
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
