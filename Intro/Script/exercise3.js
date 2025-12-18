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
    possOne: 'your',
    possTwo: 'her',
    possThree: 'their',
    possFour: 'my',
    possFive: 'our',
    possSix: 'his',
    possSeven: 'Mary\'s'
};

// Matching area (two columns: Subject · Possessives)
const matchingAreaThree = createTag('div');
setClass(matchingAreaThree, 'matching-area');
appendChilds(contentThree, matchingAreaThree);

const connectionLayerThree = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
);
connectionLayerThree.classList.add('connection-layer');
matchingAreaThree.appendChild(connectionLayerThree);

const subjectsContainer = createTag('div');
setClass(subjectsContainer, 'subjects');
appendChilds(matchingAreaThree, subjectsContainer);

const middleDividerThree = createTag('div');
setClass(middleDividerThree, 'divider');
appendChilds(matchingAreaThree, middleDividerThree);

const possessivesContainer = createTag('div');
setClass(possessivesContainer, 'possessives');
appendChilds(matchingAreaThree, possessivesContainer);

const connectionStateThree = {
    active: null,
    questionConnections: new Map(),
    answerConnections: new Map()
};

// Column headers: "Subject" above subjects; "Possessives" above possessives
const subjectHeader = createTag('p');
setClass(subjectHeader, 'column-header');
setContent(subjectHeader, 'Subject');
appendChilds(subjectsContainer, subjectHeader);

const possHeader = createTag('p');
setClass(possHeader, 'column-header');
setContent(possHeader, 'Possessives');
appendChilds(possessivesContainer, possHeader);

// Build left column (subjects)
Object.entries(exerciseThreeSubjects).forEach(([subjectId, subjectText]) => {
    const subjectRow = createTag('div');
    const text = createTag('p');
    const square = createTag('div');

    setClass(subjectRow, 'row subject-row');
    setClass(text, 'text');
    setClass(square, 'square question-square');

    square.dataset.questionId = subjectId;
    setContent(text, subjectText);

    appendChilds(subjectRow, text);
    appendChilds(subjectRow, square);
    appendChilds(subjectsContainer, subjectRow);

    square.addEventListener('pointerdown', (event) =>
        handleQuestionPointerDownThree(event, subjectId, square)
    );
});

// Build right column (possessives)
Object.entries(exerciseThreePossessives).forEach(([possId, possText]) => {
    const possRow = createTag('div');
    const square = createTag('div');
    const text = createTag('p');

    setClass(possRow, 'row answer-row');
    setClass(square, 'square answer-square');
    setClass(text, 'text');

    square.dataset.answerId = possId;
    setContent(text, possText);

    appendChilds(possRow, square);
    appendChilds(possRow, text);
    appendChilds(possessivesContainer, possRow);
});

function handleQuestionPointerDownThree (event, questionId, square) {
    event.preventDefault();
    startConnectionThree(questionId, square);
}

function startConnectionThree (questionId, questionSquare) {
    removeConnectionThree(questionId);
    updateConnectionLayerSizeThree();

    const startPoint = getSquareCenterThree(questionSquare);
    const line = createSvgLineThree(startPoint);
    connectionLayerThree.appendChild(line);

    connectionStateThree.active = {
        questionId,
        questionSquare,
        line
    };

    window.addEventListener('pointermove', handlePointerMoveThree);
    window.addEventListener('pointerup', handlePointerUpThree);
}

function handlePointerMoveThree (event) {
    if (!connectionStateThree.active) {
        return;
    }

    const point = getRelativePointThree(event);
    setLineEndThree(connectionStateThree.active.line, point);
}

function handlePointerUpThree (event) {
    if (!connectionStateThree.active) {
        return;
    }

    const answerSquare = getAnswerSquareFromEventThree(event);

    if (answerSquare?.dataset.answerId) {
        finalizeConnectionThree(answerSquare);
    } else {
        connectionStateThree.active.line.remove();
    }

    cleanupActiveConnectionListenersThree();
    connectionStateThree.active = null;
}

function finalizeConnectionThree (answerSquare) {
    const { questionId, questionSquare, line } = connectionStateThree.active;
    const answerId = answerSquare.dataset.answerId;

    removeConnectionByAnswerThree(answerId);

    const startPoint = getSquareCenterThree(questionSquare);
    const endPoint = getSquareCenterThree(answerSquare);
    setLinePositionsThree(line, startPoint, endPoint);

    connectionStateThree.questionConnections.set(questionId, {
        answerId,
        line,
        questionSquare,
        answerSquare
    });
    connectionStateThree.answerConnections.set(answerId, questionId);
}

function removeConnectionThree (questionId) {
    const existingConnection =
        connectionStateThree.questionConnections.get(questionId);
    if (!existingConnection) {
        return;
    }

    existingConnection.line.remove();
    connectionStateThree.questionConnections.delete(questionId);
    connectionStateThree.answerConnections.delete(existingConnection.answerId);
}

function removeConnectionByAnswerThree (answerId) {
    const questionId = connectionStateThree.answerConnections.get(answerId);
    if (questionId) {
        removeConnectionThree(questionId);
    }
}

function cleanupActiveConnectionListenersThree () {
    window.removeEventListener('pointermove', handlePointerMoveThree);
    window.removeEventListener('pointerup', handlePointerUpThree);
}

function createSvgLineThree (startPoint) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    setLinePositionsThree(path, startPoint, startPoint);
    return path;
}

function setLinePositionsThree (line, startPoint, endPoint) {
    line.dataset.x1 = startPoint.x;
    line.dataset.y1 = startPoint.y;
    setLineEndThree(line, endPoint ?? startPoint);
}

function setLineEndThree (line, point) {
    const startPoint = {
        x: Number(line.dataset.x1),
        y: Number(line.dataset.y1)
    };
    const pathData = buildCurvePathThree(startPoint, point);
    line.setAttribute('d', pathData);
}

function getSquareCenterThree (square) {
    const squareRect = square.getBoundingClientRect();
    const areaRect = matchingAreaThree.getBoundingClientRect();

    return {
        x: squareRect.left - areaRect.left + squareRect.width / 2,
        y: squareRect.top - areaRect.top + squareRect.height / 2
    };
}

function getRelativePointThree (event) {
    const areaRect = matchingAreaThree.getBoundingClientRect();
    return {
        x: event.clientX - areaRect.left,
        y: event.clientY - areaRect.top
    };
}

function getAnswerSquareFromEventThree (event) {
    const directSquare = event.target.closest('.answer-square');
    if (directSquare) {
        return directSquare;
    }

    const answerRow = event.target.closest('.answer-row');
    return answerRow ? answerRow.querySelector('.answer-square') : null;
}

function updateConnectionLayerSizeThree () {
    const { height } = matchingAreaThree.getBoundingClientRect();
    connectionLayerThree.setAttribute('height', height);
}

function refreshConnectionLinesThree () {
    connectionStateThree.questionConnections.forEach(
        ({ line, questionSquare, answerSquare }) => {
            const startPoint = getSquareCenterThree(questionSquare);
            const endPoint = getSquareCenterThree(answerSquare);
            setLinePositionsThree(line, startPoint, endPoint);
        }
    );
}

function buildCurvePathThree (startPoint, endPoint) {
    const controlX = (startPoint.x + endPoint.x) / 2;
    return `M ${startPoint.x} ${startPoint.y} C ${controlX} ${startPoint.y}, ${controlX} ${endPoint.y}, ${endPoint.x} ${endPoint.y}`;
}

const handleResizeThree = () => {
    updateConnectionLayerSizeThree();
    refreshConnectionLinesThree();
};

handleResizeThree();
window.addEventListener('resize', handleResizeThree);

function resetExerciseThreeConnections () {
    if (!connectionStateThree || !connectionLayerThree) return;

    connectionStateThree.questionConnections.forEach(({ line }) => {
        if (line && typeof line.remove === 'function') {
            line.remove();
        }
    });
    connectionStateThree.questionConnections.clear();
    connectionStateThree.answerConnections.clear();

    updateConnectionLayerSizeThree();
}

// Expose reset helper globally so other scripts can clear Exercise 3
window.resetExerciseThreeConnections = resetExerciseThreeConnections;

/* EVENT LISTENER – track answers for Exercise 3 (matching possessives) */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
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