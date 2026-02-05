const exerciseThreeContainer = document.getElementById('exercise-Three');
if (!exerciseThreeContainer) {
    throw new Error('Missing exercise-Three container for exercise three content.');
}

const contentThree = createTag('div');
setClass(contentThree, 'content');
appendChilds(exerciseThreeContainer, contentThree);

// Subjects and their corresponding possessive adjectives
const exerciseThreeSubjects = {
    subjectOne: 'I',
    subjectTwo: 'you',
    subjectThree: 'he',
    subjectFour: 'she',
    subjectFive: 'we',
    subjectSix: 'they',
    subjectSeven: 'Mary'
};

// Scrambled order on the right column (not aligned with subjects)
const exerciseThreePossessives = {
    possOne: 'my',
    possTwo: 'your',
    possThree: 'his',
    possFour: 'her',
    possFive: 'our',
    possSix: 'their',
    possSeven: 'Mary\'s'
};

const exerciseThreeContent = document.querySelector('#exercise-Three div.content');
const divSubjects = createTag('div');
const divPossessives = createTag('div');
const divDividerLeft = createTag('div');
const divDividerRight = createTag('div');
const matchingArea = createTag('div');

setClass(divSubjects, 'subjects');
setClass(divDividerLeft, 'divider-left');
setClass(divDividerRight, 'divider-right');
setClass(divPossessives, 'possessives');
setClass(matchingArea, 'matching-area');

appendChilds(exerciseThreeContent, divSubjects);
appendChilds(exerciseThreeContent, divDividerLeft);
appendChilds(exerciseThreeContent, matchingArea);
appendChilds(exerciseThreeContent, divDividerRight);
appendChilds(exerciseThreeContent, divPossessives);

// Create SVG layer for drawing connection lines
const connectionLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
connectionLayer.classList.add('connection-layer');
matchingArea.appendChild(connectionLayer);

// Connection state for tracking matches
const connectionStateThree = {
    active: null,
    questionConnections: new Map(),
    answerConnections: new Map()
};

// Make connectionStateThree globally available
window.connectionStateThree = connectionStateThree;

// Titles
const titleSubjects = createTag('p')
const titlePossessives = createTag('p')
const titleDividerLeft = createTag('p')
const titleDividerRight = createTag('p')
// Classes
setClass(titleSubjects, 'title');
setClass(titlePossessives, 'title');
setClass(titleDividerLeft, 'titleDivider');
setClass(titleDividerRight, 'titleDivider');
// Content
setContent(titleSubjects, 'Subjects');
setContent(titlePossessives, 'Possessives');
setContent(titleDividerLeft, 'a');
setContent(titleDividerRight, 'a');
// Appending
appendChilds(divSubjects, titleSubjects);
appendChilds(divPossessives, titlePossessives);
appendChilds(divDividerLeft, titleDividerLeft);
appendChilds(divDividerRight, titleDividerRight);

Object.entries(exerciseThreeSubjects).forEach(([subjectId, subject]) => {
    // Tags
    const subjectItem = createTag('p')
    const dividerItem = createTag('p')

    // Classes
    setClass(subjectItem, 'subject');
    setClass(dividerItem, 'divider');
    setClass(dividerItem, 'subject-square');

    // Data attributes for matching
    dividerItem.dataset.subjectId = subjectId;

    // Content
    setContent(subjectItem, subject);
    setContent(dividerItem, '');

    // Appending
    appendChilds(divSubjects, subjectItem);
    appendChilds(divDividerLeft, dividerItem);

    // Add click handler for matching
    dividerItem.addEventListener('pointerdown', (event) =>
        handleSubjectPointerDown(event, subjectId, dividerItem)
    );
})

// Shuffle the possessives array to randomize display order
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Convert possessives object to array, shuffle it, then create elements
const possessiveEntries = Object.entries(exerciseThreePossessives);
const shuffledPossessives = shuffleArray(possessiveEntries);

shuffledPossessives.forEach(([possId, possessive]) => {
    // Tags
    const possessiveItem = createTag('p')
    const dividerItem = createTag('p')

    // Classes
    setClass(possessiveItem, 'possessive');
    setClass(dividerItem, 'divider');
    setClass(dividerItem, 'possessive-square');

    // Data attributes for matching
    dividerItem.dataset.possessiveId = possId;

    // Content
    setContent(possessiveItem, possessive);
    setContent(dividerItem, '');

    // Appending
    appendChilds(divPossessives, possessiveItem);
    appendChilds(divDividerRight, dividerItem);
})

// Matching functionality functions
function handleSubjectPointerDown(event, subjectId, square) {
    event.preventDefault();
    startConnection(subjectId, square);
}

function startConnection(subjectId, subjectSquare) {
    removeConnection(subjectId);
    updateConnectionLayerSize();

    const startPoint = getSquareCenter(subjectSquare);
    const line = createSvgLine(startPoint);
    connectionLayer.appendChild(line);

    connectionStateThree.active = {
        subjectId,
        subjectSquare,
        line
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
}

function handlePointerMove(event) {
    if (!connectionStateThree.active) {
        return;
    }

    const point = getRelativePoint(event);
    setLineEnd(connectionStateThree.active.line, point);
}

function handlePointerUp(event) {
    if (!connectionStateThree.active) {
        return;
    }

    const possessiveSquare = getPossessiveSquareFromEvent(event);

    if (possessiveSquare?.dataset.possessiveId) {
        finalizeConnection(possessiveSquare);
    } else {
        connectionStateThree.active.line.remove();
    }

    cleanupActiveConnectionListeners();
    connectionStateThree.active = null;
}

function finalizeConnection(possessiveSquare) {
    const { subjectId, subjectSquare, line } = connectionStateThree.active;
    const possessiveId = possessiveSquare.dataset.possessiveId;

    removeConnectionByPossessive(possessiveId);

    const startPoint = getSquareCenter(subjectSquare);
    const endPoint = getSquareCenter(possessiveSquare);
    setLinePositions(line, startPoint, endPoint);

    connectionStateThree.questionConnections.set(subjectId, {
        answerId: possessiveId,
        line,
        questionSquare: subjectSquare,
        answerSquare: possessiveSquare
    });
    connectionStateThree.answerConnections.set(possessiveId, subjectId);
}

function removeConnection(subjectId) {
    const existingConnection = connectionStateThree.questionConnections.get(subjectId);
    if (!existingConnection) {
        return;
    }

    existingConnection.line.remove();
    connectionStateThree.questionConnections.delete(subjectId);
    connectionStateThree.answerConnections.delete(existingConnection.answerId);
}

function removeConnectionByPossessive(possessiveId) {
    const subjectId = connectionStateThree.answerConnections.get(possessiveId);
    if (subjectId) {
        removeConnection(subjectId);
    }
}

function cleanupActiveConnectionListeners() {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
}

function createSvgLine(startPoint) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#7A4A00');
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
    const areaRect = exerciseThreeContent.getBoundingClientRect();

    return {
        x: squareRect.left - areaRect.left + squareRect.width / 2,
        y: squareRect.top - areaRect.top + squareRect.height / 2
    };
}

function getRelativePoint(event) {
    const areaRect = exerciseThreeContent.getBoundingClientRect();
    return {
        x: event.clientX - areaRect.left,
        y: event.clientY - areaRect.top
    };
}

function getPossessiveSquareFromEvent(event) {
    // Check if clicking directly on a possessive square
    const directSquare = event.target.closest('.possessive-square');
    if (directSquare && directSquare.dataset.possessiveId) {
        return directSquare;
    }

    // Check if clicking on a possessive item - find corresponding square
    const possessiveItem = event.target.closest('.possessive');
    if (possessiveItem) {
        const possessiveRow = possessiveItem.parentElement;
        const possessiveIndex = Array.from(possessiveRow.querySelectorAll('.possessive')).indexOf(possessiveItem);
        if (possessiveIndex >= 0) {
            const possessiveSquares = Array.from(divDividerRight.querySelectorAll('.possessive-square'));
            if (possessiveSquares[possessiveIndex]) {
                return possessiveSquares[possessiveIndex];
            }
        }
    }

    // Check if clicking near a possessive square
    const allPossessiveSquares = Array.from(divDividerRight.querySelectorAll('.possessive-square'));
    for (const square of allPossessiveSquares) {
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
    const rect = exerciseThreeContent.getBoundingClientRect();
    connectionLayer.setAttribute('width', rect.width);
    connectionLayer.setAttribute('height', rect.height);
    connectionLayer.style.position = 'absolute';
    connectionLayer.style.top = '0';
    connectionLayer.style.left = '0';
    connectionLayer.style.pointerEvents = 'none';
    connectionLayer.style.zIndex = '1';
}

function refreshConnectionLines() {
    connectionStateThree.questionConnections.forEach(
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

function resetExerciseThreeConnections() {
    if (!connectionStateThree || !connectionLayer) return;

    connectionStateThree.questionConnections.forEach(({ line }) => {
        if (line && typeof line.remove === 'function') {
            line.remove();
        }
    });
    connectionStateThree.questionConnections.clear();
    connectionStateThree.answerConnections.clear();

    updateConnectionLayerSize();
}

// Expose reset helper globally so other scripts can clear Exercise 3
window.resetExerciseThreeConnections = resetExerciseThreeConnections;

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

/* EVENT LISTENER – track answers for Exercise 3 (matching possessives) */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (
        !button ||
        !window.studentChoices ||
        !window.expectedAnswers ||
        typeof connectionStateThree === 'undefined'
    ) {
        return;
    }

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Simple review map for possessives (adjust if you have specific units)
        const reviewMap = [
            { unit: 1, exercise: 4 },
            { unit: 1, exercise: 4 },
            { unit: 1, exercise: 4 },
            { unit: 1, exercise: 4 },
            { unit: 1, exercise: 4 },
            { unit: 1, exercise: 4 }
        ];

        const expectedMatches = window.expectedAnswers.exercise3.matches ?? {};
        const subjectIds = Object.keys(expectedMatches);
        const totalQuestions = subjectIds.length;

        subjectIds.forEach((subjectId, index) => {
            const expectedPossId = expectedMatches[subjectId];
            const connection = connectionStateThree.questionConnections.get(
                subjectId
            );
            const userPossId = connection?.answerId ?? null;
            const isCorrect = userPossId === expectedPossId;
            const reviewInfo = reviewMap[index] ?? null;

            const expectedText =
                exerciseThreePossessives[expectedPossId] ?? null;
            const userText =
                (userPossId && exerciseThreePossessives[userPossId]) || null;
            const subjectText = exerciseThreeSubjects[subjectId] ?? null;

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
                subjectId,
                subjectText,
                expectedAnswerId: expectedPossId,
                expectedAnswerText: expectedText,
                expectedAnswer: expectedText,
                userAnswerId: userPossId,
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

        window.studentChoices.choicesThree = correctAnswersChosen;
        window.studentChoices.choicesThreeHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});