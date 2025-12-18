// Expected answers for Level 1 – Exercises 1–10
// This file only defines data; actual checking logic can read from `window.expectedAnswers`.

// Answer key for Level 1 (aligned with the workbook pictures):
const expectedAnswers = {
    exercise1: {
        // Dropdowns appear in this order: A1, A2, B1, B2
        dropdowns: ['in a gym', 'go jogging', 'Acapulco', 'went surfing']
    },

    exercise2: {
        dropdowns: ['am', 'do', 'Are', 'does']
    },

    exercise3: {
        // Story blanks in reading order
        dropdowns: ['many', 'much', 'a little', 'no one', 'nearly all']
    },

    exercise4: {
        // True / False for each prompt (1–4)
        dropdowns: ['True', 'False', 'False', 'False']
    },

    exercise5: {
        // Story blanks in reading order
        dropdowns: [
            "doesn't have",
            'works',
            "'s designing",
            "don't come",
            "'re getting",
            "'s eating"
        ]
    },

    exercise6: {
        // Multiple‑choice blanks 1–5
        dropdowns: [
            'flight attendant',
            'uncle',
            'had',
            'reality show',
            'does weight training'
        ]
    },

    exercise7: {
        // Blanks in the conversation, in the order underscores appear:
        dropdowns: ['did', 'do', 'were', 'was', 'went', 'did', 'have', 'did']
    },

    exercise8: {
        // Matching: which answer goes with which question
        matches: {
            questionOne: 'answerThree',
            questionTwo: 'answerFive',
            questionThree: 'answerSix',
            questionFour: 'answerFour',
            questionFive: 'answerTwo',
            questionSix: 'answerOne'
        }
    },

    exercise9: {
        // Blanks in items 1–6, B lines only
        dropdowns: [
            'the gold ones',
            'on',
            'nicer than',
            'often',
            "I'd love to",
            "there's"
        ]
    },

    exercise10: {
        // Expected typed sentences (without final punctuation)
        sentences: [
            'Was your new computer very expensive?',
            'I hardly ever shop in department stores.',
            'My jacket is warmer than that one.',
            'How good are you at volleyball?'
        ]
    }
};

// Expose globally for other scripts
window.expectedAnswers = expectedAnswers;

/* Button & checking logic */

const buttonAnswersContainer = document.getElementById('button-answers');

if (buttonAnswersContainer) {
    const checkButton = document.createElement('button');
    setAttributeID(checkButton, 'id', 'check-answers');
    checkButton.textContent = 'Check answers';

    const downloadButton = document.createElement('button');
    setAttributeID(downloadButton, 'id', 'download-report');
    downloadButton.setAttribute('aria-label', 'Download report as PDF');
    downloadButton.innerHTML = [
        '<svg width="20" height="20" viewBox="0 0 25 25" aria-hidden="true" focusable="false">',
        '<path fill="currentColor" d="M5 20h14v-2h-2v-2h4v6H3v-6h4v2H5v2zm7-2-6-6h4V4h4v8h4l-6 6z"/>',
        '</svg>'
    ].join('');

    buttonAnswersContainer.appendChild(checkButton);
    buttonAnswersContainer.appendChild(downloadButton);

    checkButton.addEventListener('click', () => {
        const results = [
            checkExercise1(),
            checkExercise2(),
            checkExercise3(),
            checkExercise4(),
            checkExercise5(),
            checkExercise6(),
            checkExercise7(),
            checkExercise8(),
            checkExercise9(),
            checkExercise10()
        ];

        const totalCorrect = results.reduce(
            (sum, result) => sum + (result?.correct ?? 0),
            0
        );
        const totalQuestions = results.reduce(
            (sum, result) => sum + (result?.total ?? 0),
            0
        );

        const percentage =
            totalQuestions > 0
                ? Math.round((totalCorrect / totalQuestions) * 100)
                : 0;

        const message = `You've scored ${totalCorrect} of ${totalQuestions} correct. Your rating is ${percentage}%.`;
        const passed = percentage >= 80;

        if (window.studentChoices) {
            if (!Array.isArray(window.studentChoices.overallHistory)) {
                window.studentChoices.overallHistory = [];
            }
            window.studentChoices.overallHistory.push({
                timestamp: new Date().toISOString(),
                totalCorrect,
                totalQuestions,
                percentage,
                passed
            });
        }

        showResultPopup(message, passed);
    });

    downloadButton.addEventListener('click', () => {
        exportStudentReportPdf();
    });
}

function getSelectedTexts (selector) {
    return Array.from(document.querySelectorAll(selector)).map((select) =>
        select.value.trim()
    );
}

function checkExercise1 () {
    const values = getSelectedTexts('#exercise-One select.question-dropdown');
    const expected = expectedAnswers.exercise1.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise2 () {
    const values = getSelectedTexts('#exercise-Two select.text-dropdown');
    const expected = expectedAnswers.exercise2.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise3 () {
    const values = getSelectedTexts('#exercise-Three select.text-dropdown');
    const expected = expectedAnswers.exercise3.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise4 () {
    const values = getSelectedTexts('#exercise-Four select.text-dropdown');
    const expected = expectedAnswers.exercise4.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise5 () {
    const values = getSelectedTexts('#exercise-Five select.text-dropdown');
    const expected = expectedAnswers.exercise5.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise6 () {
    const values = getSelectedTexts('#exercise-Six select.text-dropdown');
    const expected = expectedAnswers.exercise6.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise7 () {
    const values = getSelectedTexts('#exercise-Seven select.text-dropdown');
    const expected = expectedAnswers.exercise7.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise8 () {
    if (typeof connectionState === 'undefined') {
        return { correct: 0, total: 0 };
    }

    const expected = expectedAnswers.exercise8.matches;
    const actual = {};

    connectionState.questionConnections.forEach(({ answerId }, questionId) => {
        actual[questionId] = answerId;
    });

    const questionIds = Object.keys(expected);
    const total = questionIds.length;
    let correct = 0;

    questionIds.forEach((questionId) => {
        if (actual[questionId] === expected[questionId]) {
            correct++;
        }
    });

    return { correct, total };
}

function checkExercise9 () {
    const values = getSelectedTexts('#exercise-Nine select.text-dropdown');
    const expected = expectedAnswers.exercise9.dropdowns;
    return scoreDropdownExercise(values, expected);
}

function checkExercise10 () {
    const inputs = Array.from(
        document.querySelectorAll('#exercise-Ten input.sentence-input')
    );
    const userSentences = inputs.map((input) =>
        normaliseSentence(input.value)
    );
    const expected = expectedAnswers.exercise10.sentences.map((sentence) =>
        normaliseSentence(sentence)
    );

    const total = expected.length;
    let correct = 0;

    expected.forEach((expectedSentence, index) => {
        if (userSentences[index] === expectedSentence) {
            correct++;
        }
    });

    return { correct, total };
}

function scoreDropdownExercise (values = [], expected = []) {
    const total = expected.length;
    let correct = 0;

    expected.forEach((expectedValue, index) => {
        if (values[index] === expectedValue) {
            correct++;
        }
    });

    return { correct, total };
}

function normaliseSentence (sentence = '') {
    return sentence
        .trim()
        .replace(/[.?!]+$/u, '') // remove trailing punctuation
        .replace(/\s+/gu, ' ') // collapse spaces
        .toLowerCase();
}

function arraysEqual (a = [], b = []) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
}

function showResultPopup (message, success) {
    const popup = document.getElementById('popup');
    if (!popup) {
        // Fallback if popup container is missing
        window.alert(message);
        return;
    }

    popup.innerHTML = '';

    const close = document.createElement('span');
    close.textContent = '×';
    close.classList.add('popup-close');
    close.addEventListener('click', () => {
        popup.style.display = 'none';
        resetAllExercises();
    });

    const title = document.createElement('h1');
    title.textContent = success
        ? 'You can move on to the next level!'
        : 'You should stay in this level for now.';

    const scoreText = document.createElement('p');
    scoreText.id = 'score';
    scoreText.textContent = message;

    popup.appendChild(close);
    popup.appendChild(title);
    popup.appendChild(scoreText);

    popup.style.display = 'flex';
}

function resetAllExercises () {
    // Reset all dropdowns to their placeholder option
    const allSelects = document.querySelectorAll(
        'select.question-dropdown, select.text-dropdown'
    );
    allSelects.forEach((select) => {
        if (select.options && select.options.length > 0) {
            select.selectedIndex = 0;
        } else {
            select.value = '';
        }
    });

    // Clear typed answers in Exercise 10
    const sentenceInputs = document.querySelectorAll(
        '#exercise-Ten input.sentence-input'
    );
    sentenceInputs.forEach((input) => {
        input.value = '';
    });

    // Clear connections in Exercise 8 (matching)
    if (typeof window.resetExerciseEightConnections === 'function') {
        window.resetExerciseEightConnections();
    } else if (
        typeof connectionState !== 'undefined' &&
        connectionState.questionConnections &&
        connectionState.answerConnections
    ) {
        connectionState.questionConnections.forEach(({ line }) => {
            if (line && typeof line.remove === 'function') {
                line.remove();
            }
        });
        connectionState.questionConnections.clear();
        connectionState.answerConnections.clear();
    }
}

function exportStudentReportPdf () {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        window.alert(
            'PDF library is not loaded. Please check your internet connection and try again.'
        );
        return;
    }

    if (!window.studentChoices) {
        window.alert('No student data available to export yet.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const baseFontSize = 10;
    const baseFontStyle = 'normal';
    doc.setFont('helvetica', baseFontStyle);
    doc.setFontSize(baseFontSize);

    // Header – student name + details, centered
    const pageWidth =
        doc.internal && doc.internal.pageSize && doc.internal.pageSize.getWidth
            ? doc.internal.pageSize.getWidth()
            : 210;

    const info = window.studentInfo || {};
    const fullName =
        [info.firstName, info.lastName].filter(Boolean).join(' ') ||
        info.name ||
        'Student';

    const hasNumericAge =
        typeof info.age === 'number' && Number.isFinite(info.age);
    const ageText = hasNumericAge ? String(info.age) : null;

    const locationParts = [];
    if (info.city) locationParts.push(String(info.city));
    if (info.state) locationParts.push(String(info.state).toUpperCase());
    const locationText =
        locationParts.length > 0 ? locationParts.join('/') : null;

    const relationshipText = info.relationship
        ? String(info.relationship)
        : null;

    const detailsParts = [];
    if (ageText) detailsParts.push(ageText);
    if (locationText) detailsParts.push(locationText);
    if (relationshipText) detailsParts.push(relationshipText);
    const detailsLine = detailsParts.join(' • ');

    let headerY = 30;

    // Name: 30pt bold
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text(fullName, pageWidth / 2, headerY, { align: 'center' });

    // Details: "Age • City/State • Relationship" just below name
    if (detailsLine) {
        headerY += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(15);
        doc.text(detailsLine, pageWidth / 2, headerY, { align: 'center' });
    }

    // Restore base font for body content
    doc.setFont('helvetica', baseFontStyle);
    doc.setFontSize(baseFontSize);

    // Layout configuration for the report body
    const marginLeft = 20;
    const marginRight = 20;
    const tableWidth = pageWidth - marginLeft - marginRight;
    const itemsColWidth = 18;
    const reviewColWidth = 50;
    const areaColWidth = tableWidth - itemsColWidth - reviewColWidth;
    const rowHeight = 7;
    const maxY = 280;

    let cursorY = headerY + 20;

    const overallHistory = Array.isArray(window.studentChoices.overallHistory)
        ? window.studentChoices.overallHistory
        : [];
    const latestOverall =
        overallHistory.length > 0
            ? overallHistory[overallHistory.length - 1]
            : null;

    const ensureSpace = (linesNeeded) => {
        const neededHeight = linesNeeded * rowHeight;
        if (cursorY + neededHeight > maxY) {
            doc.addPage();
            doc.setFont('helvetica', baseFontStyle);
            doc.setFontSize(baseFontSize);
            cursorY = 20;
        }
    };

    const getLatestExerciseHistory = (key) => {
        const historyKey = `choices${key}History`;
        const history = window.studentChoices[historyKey];
        if (!Array.isArray(history) || history.length === 0) {
            return null;
        }
        return history[history.length - 1];
    };

    // Optional overall summary line
    if (latestOverall) {
        ensureSpace(2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        const { totalCorrect, totalQuestions, percentage } = latestOverall;
        const overallLine = `Overall: ${totalCorrect} of ${totalQuestions} correct (${percentage}%).`;
        doc.text(overallLine, marginLeft, cursorY);
        cursorY += rowHeight * 2;
        doc.setFont('helvetica', baseFontStyle);
        doc.setFontSize(baseFontSize);
    }

    const drawExerciseTable = (title, rows) => {
        if (!rows || !rows.length) return;

        // Title + header + at least one data row
        ensureSpace(rows.length + 3);

        // Exercise title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(String(title), marginLeft, cursorY);
        cursorY += rowHeight;

        // Table header – three columns: Items (center), Review (left), Areas Tested (left)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        const headerY = cursorY;
        const itemsCenterX = marginLeft + itemsColWidth / 2;
        const reviewX = marginLeft + itemsColWidth;
        const areaX = reviewX + reviewColWidth;

        doc.text('Items', itemsCenterX, headerY, { align: 'center' });
        doc.text('Review', reviewX, headerY);
        doc.text('Areas Tested', areaX, headerY);

        // Underline header
        doc.setLineWidth(0.2);
        doc.line(
            marginLeft,
            headerY + 1,
            marginLeft + tableWidth,
            headerY + 1
        );

        cursorY += rowHeight;
        doc.setFont('helvetica', baseFontStyle);
        doc.setFontSize(baseFontSize);

        // Rows – only wrong items are registered
        rows.forEach((row) => {
            const itemLabel = row.itemLabel ? String(row.itemLabel) : '';
            const reviewText = row.review ? String(row.review) : '';
            const areaText = row.area ? String(row.area) : '';

            // Wrap "Areas Tested" if necessary
            const wrappedArea = doc.splitTextToSize(
                areaText,
                areaColWidth - 4
            );
            const lineCount = Math.max(1, wrappedArea.length);

            ensureSpace(lineCount);

            const rowY = cursorY;

            if (itemLabel) {
                doc.text(itemLabel, itemsCenterX, rowY, { align: 'center' });
            }
            if (reviewText) {
                doc.text(reviewText, reviewX, rowY);
            }

            wrappedArea.forEach((line, index) => {
                const lineY = rowY + index * rowHeight;
                doc.text(line, areaX, lineY);
            });

            cursorY += lineCount * rowHeight;
        });

        cursorY += rowHeight; // extra spacing after each exercise
    };

    let hasExerciseData = false;

    // --- Exercise 1a / 1b ---
    const exerciseOneHistory = getLatestExerciseHistory('One');
    if (exerciseOneHistory && Array.isArray(exerciseOneHistory.details)) {
        const details = exerciseOneHistory.details;

        const findDetail = (questionIndex) => {
            if (!Array.isArray(details)) return null;
            // Exercise 1 stores details in array order (0 -> A1, 1 -> A2, 2 -> B1, 3 -> B2)
            if (details[questionIndex]) {
                return details[questionIndex];
            }
            // Fallback in case a future version adds explicit questionIndex
            return (
                details.find(
                    (item) =>
                        item &&
                        typeof item.questionIndex === 'number' &&
                        item.questionIndex === questionIndex
                ) || null
            );
        };

        // Level 1 – Exercise 1a mapping (Pic 1 – A1, A2)
        const exerciseOneAConfig = [
            {
                questionIndex: 0, // A1
                itemLabel: '1',
                review: 'Unit 6',
                area: 'Listening: Descriptions of sports and exercise habits'
            },
            {
                questionIndex: 1, // A2
                itemLabel: '2',
                review: 'Unit 6',
                area: 'Listening: Descriptions of sports and exercise habits'
            }
        ];

        // Level 1 – Exercise 1b mapping (Pic 1 – B1, B2)
        const exerciseOneBConfig = [
            {
                questionIndex: 2, // B1
                itemLabel: '1',
                review: 'Unit 7',
                area: 'Listening: Talking about past events'
            },
            {
                questionIndex: 3, // B2
                itemLabel: '2',
                review: 'Unit 7',
                area: 'Listening: Opinions of past events'
            }
        ];

        const buildRowsFromConfig = (config) =>
            config
                .map((item) => {
                    const detail = findDetail(item.questionIndex);
                    if (!detail || detail.isCorrect !== false) return null;
                    return {
                        itemLabel: item.itemLabel,
                        review: item.review,
                        area: item.area
                    };
                })
                .filter(Boolean);

        const rowsOneA = buildRowsFromConfig(exerciseOneAConfig);
        const rowsOneB = buildRowsFromConfig(exerciseOneBConfig);

        if (rowsOneA.length) {
            drawExerciseTable('Exercise 1a', rowsOneA);
            hasExerciseData = true;
        }

        if (rowsOneB.length) {
            drawExerciseTable('Exercise 1b', rowsOneB);
            hasExerciseData = true;
        }
    }

    // --- Tables for Exercises 2–10 (Level 1 mappings) ---
    const genericAreaByExercise = {
        Two: 'Grammar',
        Three: 'Grammar',
        Four: 'Reading',
        Five: 'Grammar',
        Six: 'Vocabulary',
        Seven: 'Grammar',
        Eight: 'Grammar',
        Nine: 'Grammar',
        Ten: 'Grammar'
    };

    // Per‑item mappings taken from the Level 1 guide (pics 2–10)
    const exerciseSpecificConfigs = {
        // Exercise 2 – 4 items
        Two: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 1, Ex.5',
                area: 'Grammar: Statements with be; possessive adjectives'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 2, Ex.5',
                area: 'Grammar: Simple present Wh-questions and statements'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 1, Ex.8',
                area: 'Yes/No questions and short answers with be'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 4, Ex.4',
                area: 'Grammar: Simple present questions; short answers'
            }
        ],
        // Exercise 3 – 5 items
        Three: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 8, Ex.9',
                area: 'Grammar: Quantifiers; how many and how much'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 8, Ex.9',
                area: 'Grammar: Quantifiers; how many and how much'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 8, Ex.9',
                area: 'Grammar: Quantifiers; how many and how much'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 5, Ex.10',
                area: 'Grammar: Quantifiers'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 5, Ex.10',
                area: 'Grammar: Quantifiers'
            }
        ],
        // Exercise 4 – 5 items
        Four: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 5,',
                area: 'Reading: Topic on family; true/false comprehension'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 5',
                area: 'Reading: Topic on family; true/false comprehension'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 5',
                area: 'Reading: Topic on family; true/false comprehension'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 5',
                area: 'Reading: Topic on family; true/false comprehension'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 5',
                area: 'Reading: Topic on family; true/false comprehension'
            }
        ],
        // Exercise 5 – 6 items
        Five: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 2, Ex.5',
                area: 'Grammar: Simple present Wh-questions & statements'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 2, Ex.5',
                area: 'Grammar: Simple present Wh-questions & statements'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 5, Ex.5',
                area: 'Grammar: Present continuous'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 2, Ex.5',
                area: 'Grammar: Simple present Wh-questions & statements'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 5, Ex.5',
                area: 'Grammar: Present continuous'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 5, Ex.5',
                area: 'Grammar: Present continuous'
            }
        ],
        // Exercise 6 – 5 items
        Six: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 2, Ex.2',
                area: 'Vocabulary: Jobs'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 5, Ex.1',
                area: 'Vocabulary: Family'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 7, Ex.5',
                area: 'Vocabulary: Chores and activities'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 4, Ex.2',
                area: 'Vocabulary: Entertainment'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 6, Ex.2',
                area: 'Vocabulary: Sports and fitness'
            }
        ],
        // Exercise 7 – 8 items
        Seven: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 7, Ex.3',
                area: 'Grammar: Simple past'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 7, Ex.3',
                area: 'Same'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 7, Ex.10',
                area: 'Grammar: Past of be'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 7, Ex.10',
                area: 'Same'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 7, Ex.3',
                area: 'Grammar: Simple past'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 7, Ex.3',
                area: 'Same'
            },
            {
                detailIndex: 6,
                itemLabel: '7',
                review: 'Unit 7, Ex.3',
                area: 'Same'
            },
            {
                detailIndex: 7,
                itemLabel: '8',
                review: 'Unit 7, Ex.3',
                area: 'Same'
            }
        ],
        // Exercise 8 – 6 items
        Eight: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 6, Ex.4',
                area: 'Grammar: Adverbs of frequency'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 5, Ex.5',
                area: 'Grammar: Present continuous'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 8, Ex.3',
                area: 'Grammar: There is, there are; one, any, some'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 1, Ex.8',
                area: 'Grammar: Yes/No questions and short answers with be'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 4, Ex.9',
                area: 'Grammar: Would; verb + to + verb'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 4, Ex.4',
                area: 'Grammar: Simple present questions; short answers'
            }
        ],
        // Exercise 9 – 6 items
        Nine: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 3, Ex.3',
                area: 'Grammar: Demonstratives; one, ones'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 2, Ex.9',
                area: 'Grammar: Time expressions'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 3, Ex.10',
                area: 'Grammar: Preferences; comparisons with adjectives'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 6, Ex.11',
                area: 'Grammar: Questions with how; short answers'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 4, Ex.9',
                area: 'Grammar: Would; verb + to + verb'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 8, Ex.3',
                area: 'Grammar: There is, there are; one, any, some'
            }
        ],
        // Exercise 10 – 4 items
        Ten: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 1, Ex.8',
                area: 'Grammar: Yes/No questions and short answers with be'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 6, Ex.4',
                area: 'Grammar: Adverbs of frequency'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 3, Ex.10',
                area: 'Grammar: Preferences; comparisons with adjectives'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 6, Ex.11',
                area: 'Grammar: Questions with how; short answers'
            }
        ]
    };

    const remainingExercises = [
        { key: 'Two', label: 'Exercise 2' },
        { key: 'Three', label: 'Exercise 3' },
        { key: 'Four', label: 'Exercise 4' },
        { key: 'Five', label: 'Exercise 5' },
        { key: 'Six', label: 'Exercise 6' },
        { key: 'Seven', label: 'Exercise 7' },
        { key: 'Eight', label: 'Exercise 8' },
        { key: 'Nine', label: 'Exercise 9' },
        { key: 'Ten', label: 'Exercise 10' }
    ];

    remainingExercises.forEach(({ key, label }) => {
        const history = getLatestExerciseHistory(key);
        if (!history || !Array.isArray(history.details)) {
            return;
        }

        const specificConfig = exerciseSpecificConfigs[key];
        let rows = [];

        if (Array.isArray(specificConfig) && specificConfig.length) {
            // Use the explicit per‑item configuration.
            rows = specificConfig
                .map((configItem, logicalIndex) => {
                    const indices =
                        typeof configItem.detailIndex === 'number'
                            ? [configItem.detailIndex]
                            : Array.isArray(configItem.detailIndices)
                                ? configItem.detailIndices
                                : [];

                    if (!indices.length) return null;

                    const hasWrong = indices.some((idx) => {
                        const detail = history.details[idx];
                        return detail && detail.isCorrect === false;
                    });

                    if (!hasWrong) return null;

                    const itemLabel =
                        configItem.itemLabel ?? String(logicalIndex + 1);

                    return {
                        itemLabel,
                        review: configItem.review,
                        area: configItem.area
                    };
                })
                .filter(Boolean);
        } else {
            // Generic fallback (should not be used if all configs are present)
            rows = history.details
                .filter((detail) => detail && detail.isCorrect === false)
                .map((detail, logicalIndex) => {
                    let review = '';
                    if (detail.skillArea) {
                        review = detail.skillArea;
                    } else if (detail.unit && detail.exercise != null) {
                        review = `Unit ${detail.unit}, Ex.${detail.exercise}`;
                    } else if (detail.unit) {
                        review = `Unit ${detail.unit}`;
                    } else if (detail.reviewCode) {
                        review = detail.reviewCode;
                    }

                    const area = genericAreaByExercise[key] || '';

                    const itemLabel =
                        typeof detail.questionIndex === 'number'
                            ? String(detail.questionIndex + 1)
                            : String(logicalIndex + 1);

                    return {
                        itemLabel,
                        review,
                        area
                    };
                })
                .filter(Boolean);
        }

        if (rows.length) {
            drawExerciseTable(label, rows);
            hasExerciseData = true;
        }
    });

    if (!latestOverall && !hasExerciseData) {
        window.alert(
            'There are no results to export yet. Please click "Check answers" first.'
        );
        return;
    }

    doc.save('level-1-report.pdf');
}

