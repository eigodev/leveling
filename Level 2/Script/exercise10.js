const exerciseTenContainer = document.getElementById('exercise-Ten');
if (!exerciseTenContainer) {
    throw new Error('Missing exercise-Ten container for exercise ten content.');
}

const contentTen = createTag('div');
setClass(contentTen, 'content');
appendChilds(exerciseTenContainer, contentTen);

// Prompts for the error-correction sentences (middle column)
const exerciseTenPrompts = [
    'Where did you born?',
    'As a teenager, I didn’t like to take away the trash.',
    'Did you used to collect comic books when you were a child?',
    'July was the month where I visited my grandparents.',
    'Would you mind open the window?'
];

// Build rows: left = number, middle = sentence (clickable words), right = input
exerciseTenPrompts.forEach((text, index) => {
    const row = createTag('div');
    setClass(row, 'sentence-row');

    const numberTag = createTag('p');
    setClass(numberTag, 'number');
    setContent(numberTag, `${index + 1}.`);

    const sentenceTag = createTag('p');
    setClass(sentenceTag, 'text');

    // Split the sentence into "tokens" and wrap words in clickable spans.
    // We rely on CSS margins for spacing between tokens, not literal space characters.
    const words = text.split(' ');
    words.forEach((word) => {
        // Separate trailing punctuation so only the actual word is clickable,
        // e.g. "born?" -> clickable "born" + non-clickable "?" span.
        const match = word.match(/([.,!?;:]+)$/u);
        const punctuation = match ? match[1] : '';
        const baseWord = match ? word.slice(0, -punctuation.length) : word;

        // If there's no base word (rare, e.g. just "?" by itself), just render punctuation
        if (!baseWord) {
            if (punctuation) {
                const punctSpan = createTag('span');
                setClass(punctSpan, 'word-punctuation');
                setContent(punctSpan, punctuation);
                sentenceTag.appendChild(punctSpan);
            }
            return;
        }

        const span = createTag('span');
        setClass(span, 'clickable-word');
        // If this word is immediately followed by punctuation, don't add visual
        // gap after the word; the punctuation will handle the spacing instead.
        if (punctuation) {
            span.classList.add('no-gap-after');
        }
        setContent(span, baseWord);

        span.addEventListener('click', () => {
            // Only one wrong word per sentence: toggle selection on this one,
            // and clear selection from the others in the same sentence.
            const allWordsInSentence =
                sentenceTag.querySelectorAll('.clickable-word');
            const isAlreadySelected = span.classList.contains('selected-wrong');

            allWordsInSentence.forEach((w) =>
                w.classList.remove('selected-wrong')
            );

            if (!isAlreadySelected) {
                span.classList.add('selected-wrong');
            }
        });

        sentenceTag.appendChild(span);

        // Append any trailing punctuation as a non-clickable span so we can
        // control spacing separately (no space *before* punctuation).
        if (punctuation) {
            const punctSpan = createTag('span');
            setClass(punctSpan, 'word-punctuation');
            setContent(punctSpan, punctuation);
            sentenceTag.appendChild(punctSpan);
        }
    });

    const input = createTag('input');
    setClass(input, 'sentence-input');
    input.type = 'text';

    appendChilds(row, numberTag);
    appendChilds(row, sentenceTag);
    appendChilds(row, input);

    appendChilds(contentTen, row);
});



/* EVENT LISTENER – track answers for Exercise 10 (sentence writing) */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    const normalise =
        window.normaliseSentence ||
        function (sentence = '') {
            return sentence
                .trim()
                .replace(/[.?!]+$/u, '')
                .replace(/\s+/gu, ' ')
                .toLowerCase();
        };

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 10
        // Item 1 -> Unit 1 / Exercise 8
        // Item 2 -> Unit 6 / Exercise 4
        // Item 3 -> Unit 3 / Exercise 10
        // Item 4 -> Unit 6 / Exercise 11
        const reviewMap = [
            { unit: 1, exercise: 8 },
            { unit: 6, exercise: 4 },
            { unit: 3, exercise: 10 },
            { unit: 6, exercise: 11 }
        ];

        const inputs = document.querySelectorAll(
            '#exercise-Ten input.sentence-input'
        );
        const expectedSentences =
            window.expectedAnswers.exercise10.sentences ?? [];
        const totalQuestions = expectedSentences.length;

        expectedSentences.forEach((expectedSentence, index) => {
            const input = inputs[index];
            const userRaw = input ? input.value : '';
            const userNormalised = normalise(userRaw);
            const expectedNormalised = normalise(expectedSentence);
            const isCorrect = userNormalised === expectedNormalised;
            const reviewInfo = reviewMap[index] ?? null;

            if (isCorrect) {
                items++;
                score++;
                correctAnswersChosen.push(expectedSentence);
            } else {
                wrongAnswersChosen.push(userRaw || null);
            }

            details.push({
                sentenceIndex: index,
                userSentence: userRaw || null,
                expectedSentence,
                userNormalised,
                expectedNormalised,
                expectedAnswer: expectedSentence,
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

        window.studentChoices.choicesTen = correctAnswersChosen;
        window.studentChoices.choicesTenHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});