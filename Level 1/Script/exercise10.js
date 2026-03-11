const exerciseTenContainer = document.getElementById('exercise-Ten');
if (!exerciseTenContainer) {
    throw new Error('Missing exercise-Ten container for exercise ten content.');
}

const contentTen = createTag('div');
setClass(contentTen, 'content');
appendChilds(exerciseTenContainer, contentTen);

// One‑time warning popup so students pay attention to spelling and punctuation
let exerciseTenWarningShown = false;

function showExerciseTenWarning () {
    if (exerciseTenWarningShown) return;
    exerciseTenWarningShown = true;

    const popupInfo = document.getElementById('popup-alert');
    if (!popupInfo) {
        // Fallback if the styled popup container is not available
        window.alert(
            'Antes de clicar em "Check Answers", verifique se você digitou corretamente as sentenças. Não esqueça de usar pontuação!'
        );
        return;
    }

    popupInfo.innerHTML = '';

    const message = document.createElement('p');
    message.classList.add('alert-message');
    message.textContent =
        'Antes de clicar em "Check Answers", verifique se você digitou corretamente as sentenças.';

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.classList.add('alert-button');
    okButton.addEventListener('click', () => {
        popupInfo.style.display = 'none';
    });

    popupInfo.appendChild(message);
    popupInfo.appendChild(okButton);
    popupInfo.style.display = 'flex';
}

const exerciseTenItems = [
    {
        number: 1,
        words: 'new / expensive / your / Was / computer / very'
    },
    {
        number: 2,
        words: 'ever / shop / hardly / I / department stores / in'
    },
    {
        number: 3,
        words: 'than / jacket / warmer / My / is / one / that'
    },
    {
        number: 4,
        words: 'volleyball / are / How / good / you / at'
    }
];

exerciseTenItems.forEach(({ number, words }) => {
    // Creating the html tags
    const sentenceRow = createTag('div');
    const numberTag = createTag('p');
    const sentenceContainer = createTag('div');
    const scrambledText = createTag('p');
    const answerInput = createTag('input');
    
    setClass(sentenceRow, 'sentence-row');
    setClass(numberTag, 'number');
    setClass(sentenceContainer, 'sentence');
    setClass(scrambledText, 'sentence');
    setClass(answerInput, 'sentence-input');
    
    setContent(numberTag, `${number}.`);
    setContent(scrambledText, words);
    
    answerInput.type = 'text';
    
    // Show the warning only when the student first click;
    if (number === 1) {
        answerInput.addEventListener('focus', showExerciseTenWarning);
        answerInput.addEventListener('click', showExerciseTenWarning);
    }
    
    appendChilds(sentenceContainer, scrambledText);
    appendChilds(sentenceContainer, answerInput);
    
    appendChilds(contentTen, sentenceRow);
    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, sentenceContainer);
});

/* EVENT LISTENER – track answers for Exercise 10 (sentence writing) */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
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