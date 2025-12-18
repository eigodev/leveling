// Expected answers for Level 1 – Exercises 1–10
// This file only defines data; actual checking logic can read from `window.expectedAnswers`.

const expectedAnswers = {
    exercise1: {
        // Dropdowns appear in this order: A1, A2, B1, B2
        dropdowns: ['L-U-I-S-A', 'Italian', 'microwave oven', 'a view']
    },

    exercise2: {
        // Order of blanks across all lines
        dropdowns: ['are', 'am', 'is', '\'re', '\'s', '\'s']
    },

    exercise3: {
        // Matching subjects to their correct possessive adjectives
        matches: {
            // Right-column is scrambled; these IDs point to the correct words:
            subjectOne: 'possFour',  // I  -> my
            subjectTwo: 'possOne',   // you -> your
            subjectThree: 'possSix', // he -> his
            subjectFour: 'possTwo',  // she -> her
            subjectFive: 'possFive', // we -> our
            subjectSix: 'possThree', // they -> their
            subjectSeven: 'possSeven' // Mary -> Mary's
        }
    },

    exercise4: {
        // Multiple‑choice blanks 1–5
        dropdowns: ['good-looking', 'a cashier', 'boring', 'daughter', 'on']
    },

    exercise5: {
        // Conversation blanks 1–6 (Joey & Kate)
        dropdowns: ['where is', 'there', "it's", 'these', 'they', 'your']
    },

    exercise6: {
        // Conjunction blanks (and / but / so) – 5 items
        dropdowns: ['and', 'so', 'but', 'but', 'so']
    },

    exercise7: {
        // Expected typed questions (without final punctuation)
        sentences: ['How are you','How old are you','What do you do','Where do you work'],
        // Acceptable variants for each question (all normalised before checking)
        sentenceVariants: [
            [ 'How are you', 'How are you doing', "How's it going" ], 
            [ 'How old are you', "What's your age" ], 
            [ 'What do you do', 'What do you do for a living' ], 
            [ 'Where do you work' ]
        ]
    },

    exercise8: {
        // Expected dropdown replies for items 1–5
        dropdowns: [
            'Thanks. Good night, Ashley.',
            "She's very nice.",
            'There’s a pen on the desk.',
            'I study in the evening.',
            'They’re under your hat.'
        ]
    },

    exercise9: {
        // Six items, 16 blanks total (left‑to‑right across the exercise)
        dropdowns: [
            'are',
            'doing',
            "'re watching",
            "'s raining",
            "'m not wearing",
            "aren't hungry",
            "aren't eating",
            "'s",
            'doing',
            "'s checking",
            'are',
            'wearing',
            "'m not",
            'is',
            "'s not working",
            "'s"
        ]
    },

    exercise10: {
        // Five items, 16 blanks total (left‑to‑right across the exercise)
        dropdowns: [
            'do',
            'live',
            'live',
            'do',
            'have',
            'have',
            'do',
            'drive',
            "don't",
            'take',
            'does',
            'work',
            'works',
            'does',
            'do',
            "'s"
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

        if (typeof window.calculateIntroOverallScore === 'function') {
            window.calculateIntroOverallScore(results);
        }
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
    // Matching subjects (left column) to possessives (right column)
    if (typeof connectionStateThree === 'undefined') {
        return { correct: 0, total: 0 };
    }

    const expected = expectedAnswers.exercise3.matches;
    const actual = {};

    connectionStateThree.questionConnections.forEach(
        ({ answerId }, questionId) => {
            actual[questionId] = answerId;
        }
    );

    const subjectIds = Object.keys(expected);
    const total = subjectIds.length;
    let correct = 0;

    subjectIds.forEach((subjectId) => {
        if (actual[subjectId] === expected[subjectId]) {
            correct++;
        }
    });

    return { correct, total };
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
    const inputs = Array.from(
        document.querySelectorAll('#exercise-Seven input.question-input')
    );
    const userSentences = inputs.map((input) =>
        normaliseSentence(input.value)
    );
    const exerciseConfig = expectedAnswers.exercise7 || {};
    const baseSentences = Array.isArray(exerciseConfig.sentences)
        ? exerciseConfig.sentences
        : [];
    const variantsConfig = Array.isArray(exerciseConfig.sentenceVariants)
        ? exerciseConfig.sentenceVariants
        : [];

    const total = baseSentences.length;
    let correct = 0;
    const details = [];

    baseSentences.forEach((baseSentence, index) => {
        const rawVariants =
            Array.isArray(variantsConfig[index]) && variantsConfig[index].length
                ? variantsConfig[index]
                : [baseSentence];

        const allowed = rawVariants.map((sentence) =>
            normaliseSentence(sentence)
        );
        const userSentence = userSentences[index] ?? '';
        const isCorrect = allowed.includes(userSentence);

        if (isCorrect) {
            correct++;
        }
        details.push({
            questionIndex: index,
            userAnswer: userSentence || null,
            expectedBaseSentence: baseSentence,
            isCorrect
        });
    });

    if (window.studentChoices) {
        if (!Array.isArray(window.studentChoices.choicesSevenHistory)) {
            window.studentChoices.choicesSevenHistory = [];
        }
        window.studentChoices.choicesSevenHistory.push({
            wrong: total - correct,
            details
    });
    }

    return { correct, total };
}

function checkExercise8 () {
    const values = getSelectedTexts('#exercise-Eight select.text-dropdown');
    const expected = expectedAnswers.exercise8.dropdowns;
    const total = expected.length;
    let correct = 0;
    const details = [];

    expected.forEach((expectedValue, index) => {
        const userAnswer = values[index] ?? '';
        const isCorrect = userAnswer === expectedValue;
        if (isCorrect) {
            correct++;
        }
        details.push({
            questionIndex: index,
            userAnswer: userAnswer || null,
            expectedAnswer: expectedValue,
            isCorrect
        });
    });

    if (window.studentChoices) {
        if (!Array.isArray(window.studentChoices.choicesEightHistory)) {
            window.studentChoices.choicesEightHistory = [];
        }
        window.studentChoices.choicesEightHistory.push({
            wrong: total - correct,
            details
        });
    }

    return { correct, total };
}

function checkExercise9 () {
    const values = getSelectedTexts('#exercise-Nine select.text-dropdown');
    const expected = expectedAnswers.exercise9.dropdowns;
    const total = expected.length;
    let correct = 0;
    const details = [];

    expected.forEach((expectedValue, index) => {
        const userAnswer = values[index] ?? '';
        const isCorrect = userAnswer === expectedValue;
        if (isCorrect) {
            correct++;
        }
        details.push({
            questionIndex: index,
            userAnswer: userAnswer || null,
            expectedAnswer: expectedValue,
            isCorrect
        });
    });

    if (window.studentChoices) {
        if (!Array.isArray(window.studentChoices.choicesNineHistory)) {
            window.studentChoices.choicesNineHistory = [];
        }
        window.studentChoices.choicesNineHistory.push({
            wrong: total - correct,
            details
        });
    }

    return { correct, total };
}

function checkExercise10 () {
    const values = getSelectedTexts('#exercise-Ten select.text-dropdown');
    const expected = expectedAnswers.exercise10.dropdowns;
    const total = expected.length;
    let correct = 0;
    const details = [];

    expected.forEach((expectedValue, index) => {
        const userAnswer = values[index] ?? '';
        const isCorrect = userAnswer === expectedValue;
        if (isCorrect) {
            correct++;
        }
        details.push({
            questionIndex: index,
            userAnswer: userAnswer || null,
            expectedAnswer: expectedValue,
            isCorrect
        });
    });

    if (window.studentChoices) {
        if (!Array.isArray(window.studentChoices.choicesTenHistory)) {
            window.studentChoices.choicesTenHistory = [];
        }
        window.studentChoices.choicesTenHistory.push({
            wrong: total - correct,
            details
        });
    }

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

    // Header – student name + details, centered (as in sample image)
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

    // --- Exercise 1a / 1b – use the mapping from the picture ---
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

        // Exercise 1a – items A1 and A2 (ignore any item 3)
        const exerciseOneAConfig = [
            {
                questionIndex: 0, // A1
                itemLabel: '1',
                review: 'Unit 1',
                area: 'Listening: Spelling of names'
            },
            {
                questionIndex: 1, // A2
                itemLabel: '2',
                review: 'Unit 3',
                area: 'Listening: Information about nationality'
            }
        ];

        const exerciseOneBConfig = [
            {
                questionIndex: 2, // B1
                itemLabel: '1',
                review: 'Unit 7',
                area: 'Listening: Descriptions of houses and apartments'
            },
            {
                questionIndex: 3, // B2
                itemLabel: '2',
                review: 'Unit 7',
                area: 'Listening: Descriptions of houses and apartments'
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

    // --- Generic tables for Exercises 2–10 (one table per exercise) ---
    const genericAreaByExercise = {
        Two: 'Grammar: The verb be',
        Three: 'Grammar: Possessives',
        Four: 'Vocabulary: Describing people / jobs',
        Five: 'Grammar: There is / There are; This/these',
        Six: 'Grammar: Present continuous',
        Seven: 'Grammar: The verb be / Wh-questions',
        Eight: 'Wh-questions w/be; simple present questions',
        Nine: 'Present continuous (Wh-questions / statements / Yes/No)',
        Ten: 'Simple present (statements / questions / Wh-questions)'
    };

    // Item‑by‑item mappings taken from the official leveling‑test guide
    // so the report matches the tables exactly.
    const exerciseSpecificConfigs = {
        // Exercise 2 – 6 items
        Two: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 1, Ex.9',
                area: 'Grammar: The verb be'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 1, Ex.9',
                area: 'Grammar: The verb be'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 3, Ex.3',
                area: 'Grammar: Negative statements w/be'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 3, Ex.3',
                area: 'Grammar: Yes/No questions w/be'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 5, Ex.8',
                area: 'Grammar: Wh-questions w/be'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 5, Ex.8',
                area: 'Grammar: Wh-questions w/be'
            }
        ],
        // Exercise 3 – 6 items
        Three: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 1, Ex.3',
                area: 'Grammar: My, your, his, her'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 1, Ex.3',
                area: 'Grammar: My, your, his, her'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 1, Ex.3',
                area: 'Grammar: My, your, his, her'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 4, Ex.5',
                area: 'Grammar: Possessives'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 4, Ex.5',
                area: 'Grammar: Possessives'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 4, Ex.5',
                area: 'Grammar: Possessives'
            }
        ],
        // Exercise 4 – 5 items
        Four: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 3, Ex.9',
                area: 'Vocabulary: Describing people'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 2, Ex.3',
                area: 'Vocabulary: Jobs'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 8, Ex.6',
                area: 'Vocabulary: Adjectives for jobs'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 6, Ex.3',
                area: 'Vocabulary: Family members'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 6, Ex.7',
                area: 'Vocabulary: Time expressions'
            }
        ],
        // Exercise 5 – 6 items
        Five: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 2, Ex.8',
                area: 'Grammar: Yes/No + where questions w/be'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 7, Ex.7',
                area: 'Grammar: There is / There are'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 2, Ex.5',
                area: 'Grammar: This/these + plurals'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 2, Ex.5',
                area: 'Grammar: This/these + plurals'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 4, Ex.5',
                area: 'Grammar: Possessives'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 4, Ex.5',
                area: 'Grammar: Possessives'
            }
        ],
        // Exercise 6 – 3 items (items grouped conceptually)
        Six: [
            {
                detailIndices: [0],
                itemLabel: '1',
                review: 'Unit 4, Ex.9',
                area: 'Grammar: Present continuous statements'
            },
            {
                detailIndices: [1],
                itemLabel: '2',
                review: 'Unit 4, Ex.9',
                area: 'Same'
            },
            {
                detailIndices: [2, 3, 4],
                itemLabel: '3',
                review: 'Unit 4, Ex.9',
                area: 'Same'
            }
        ],
        // Exercise 7 – 4 items
        Seven: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 1, Ex.9',
                area: 'Grammar: The verb be'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 3, Ex.8',
                area: 'Grammar: Wh-questions w/be'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 8, Ex.4',
                area: 'Grammar: Simple present Wh-questions'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 8, Ex.4',
                area: 'Same'
            }
        ],
        // Exercise 8 – 5 items
        Eight: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 1, Ex.14',
                area: 'Function: Saying goodbye'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 3, Ex.8',
                area: 'Wh-questions w/be'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 7, Ex.7',
                area: 'There is / There are'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 2, Ex.8',
                area: 'Simple present questions'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 2, Ex.8',
                area: 'Yes/No + where questions w/be'
            }
        ],
        // Exercise 9 – 16 individual items (one per blank)
        Nine: [
            // 1–10 -> Unit 5, Ex.7 (Present continuous Wh-questions)
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 6,
                itemLabel: '7',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 7,
                itemLabel: '8',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 8,
                itemLabel: '9',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 9,
                itemLabel: '10',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            // 11–16 -> Unit 4, Ex.9 (Present continuous statements / Yes/No questions)
            {
                detailIndex: 10,
                itemLabel: '11',
                review: 'Unit 4, Ex.9',
                area: 'Present continuous statements / Yes/No questions'
            },
            {
                detailIndex: 11,
                itemLabel: '12',
                review: 'Unit 4, Ex.9',
                area: 'Present continuous statements / Yes/No questions'
            },
            {
                detailIndex: 12,
                itemLabel: '13',
                review: 'Unit 4, Ex.9',
                area: 'Present continuous statements / Yes/No questions'
            },
            {
                detailIndex: 13,
                itemLabel: '14',
                review: 'Unit 4, Ex.9',
                area: 'Present continuous statements / Yes/No questions'
            },
            {
                detailIndex: 14,
                itemLabel: '15',
                review: 'Unit 4, Ex.9',
                area: 'Present continuous statements / Yes/No questions'
            },
            {
                detailIndex: 15,
                itemLabel: '16',
                review: 'Unit 4, Ex.9',
                area: 'Present continuous statements / Yes/No questions'
            }
        ],
        // Exercise 10 – 16 individual items (one per blank)
        Ten: [
            {
                detailIndex: 0,
                itemLabel: '1',
                review: 'Unit 8, Ex.4',
                area: 'Simple present Wh-questions'
            },
            {
                detailIndex: 1,
                itemLabel: '2',
                review: 'Unit 8, Ex.4',
                area: 'Simple present Wh-questions'
            },
            {
                detailIndex: 2,
                itemLabel: '3',
                review: 'Unit 6, Ex.4',
                area: 'Simple present statements'
            },
            {
                detailIndex: 3,
                itemLabel: '4',
                review: 'Unit 6, Ex.7',
                area: 'Simple present questions'
            },
            {
                detailIndex: 4,
                itemLabel: '5',
                review: 'Unit 6, Ex.7',
                area: 'Simple present questions'
            },
            {
                detailIndex: 5,
                itemLabel: '6',
                review: 'Unit 7, Ex.3',
                area: 'Simple present short answers'
            },
            {
                detailIndex: 6,
                itemLabel: '7',
                review: 'Unit 6, Ex.7',
                area: 'Simple present questions'
            },
            {
                detailIndex: 7,
                itemLabel: '8',
                review: 'Unit 6, Ex.7',
                area: 'Simple present questions'
            },
            {
                detailIndex: 8,
                itemLabel: '9',
                review: 'Unit 5, Ex.7',
                area: 'Present continuous Wh-questions'
            },
            {
                detailIndex: 9,
                itemLabel: '10',
                review: 'Unit 6, Ex.4',
                area: 'Simple present statements'
            },
            {
                detailIndex: 10,
                itemLabel: '11',
                review: 'Unit 6, Ex.7',
                area: 'Simple present questions'
            },
            {
                detailIndex: 11,
                itemLabel: '12',
                review: 'Unit 6, Ex.7',
                area: 'Simple present questions'
            },
            {
                detailIndex: 12,
                itemLabel: '13',
                review: 'Unit 7, Ex.3',
                area: 'Simple present short answers'
            },
            {
                detailIndex: 13,
                itemLabel: '14',
                review: 'Unit 8, Ex.4',
                area: 'Simple present Wh-questions'
            },
            {
                detailIndex: 14,
                itemLabel: '15',
                review: 'Unit 8, Ex.4',
                area: 'Simple present Wh-questions'
            },
            {
                detailIndex: 15,
                itemLabel: '16',
                review: 'Unit 8, Ex.4',
                area: 'Simple present Wh-questions'
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
            // Use the exact per‑item configuration from the leveling‑test guide.
            rows = specificConfig
                .map((configItem, logicalIndex) => {
                    const indices = Array.isArray(configItem.detailIndices)
                        ? configItem.detailIndices
                        : typeof configItem.detailIndex === 'number'
                            ? [configItem.detailIndex]
                            : [];

                    if (!indices.length) return null;

                    const hasWrong = indices.some((idx) => {
                        const detail = history.details[idx];
                        return detail && detail.isCorrect === false;
                    });

                    if (!hasWrong) return null;

                    const itemLabel =
                        configItem.itemLabel ??
                        String(typeof logicalIndex === 'number'
                            ? logicalIndex + 1
                            : '');

                    return {
                        itemLabel,
                        review: configItem.review,
                        area: configItem.area
                    };
                })
                .filter(Boolean);
        } else {
            // Generic fallback for exercises without a custom spec.
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

    doc.save('intro-report.pdf');
}

