const exerciseSevenContainer = document.getElementById('exercise-Seven');
if (!exerciseSevenContainer) {
    throw new Error('Missing exercise-Seven container for exercise seven content.');
}

const contentSeven = createTag('div');
setClass(contentSeven, 'content');
appendChilds(exerciseSevenContainer, contentSeven);

// One‑time warning popup so students pay attention to spelling and punctuation
let exerciseSevenWarningShown = false;

function showExerciseSevenWarning () {
    if (exerciseSevenWarningShown) return;
    exerciseSevenWarningShown = true;

    const popupAlert = document.getElementById('popup-alert');
    if (!popupAlert) {
        // Fallback if the styled popup container is not available
        window.alert(
            'Antes de clicar em "Check Answers", verifique se você digitou corretamente as sentenças.'
        );
        return;
    }

    popupAlert.innerHTML = '';

    const message = document.createElement('p');
    message.classList.add('alert-message');
    message.textContent =
        'Antes de clicar no botão "Check Answers", verifique se você digitou corretamente as sentenças. Não esqueça de usar pontuação!';

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.classList.add('alert-button');
    okButton.addEventListener('click', () => {
        popupAlert.style.display = 'none';
    });

    popupAlert.appendChild(message);
    popupAlert.appendChild(okButton);
    popupAlert.style.display = 'flex';
}

// Same visual structure as Level 1 – Exercise 2:
const exerciseSevenAnswers = [
    "I'm fine, thanks.",
    "I'm 28 years old.",
    "I'm a salesperson.",
    'I work in a shoe store.'
];

exerciseSevenAnswers.forEach((answer, exerciseIndex) => {
    const conversationRows = createTag('div');
    setClass(conversationRows, 'conversation-rows');
    appendChilds(contentSeven, conversationRows);

    const exerciseNumber = createTag('p');
    setClass(exerciseNumber, 'number');
    setContent(exerciseNumber, `${exerciseIndex + 1}.`);
    appendChilds(conversationRows, exerciseNumber);

    // Single row: A. + text (input) + B. + text (answer)
    const conversationRow = createTag('div');
    setClass(conversationRow, 'conversation-row');

    // Row A: A. + input
    const rowA = createTag('div');
    setClass(rowA, 'rowA');

    const speakerALabel = createTag('p');
    setClass(speakerALabel, 'letter');
    setContent(speakerALabel, 'A.');

    const questionInput = createTag('input');
    setClass(questionInput, 'sentence-input');
    setClass(questionInput, 'question-input');
    questionInput.type = 'text';

    // Show the warning only when the student first clicks / focuses the
    // very first input in Exercise 7.
    if (exerciseIndex === 0) {
        questionInput.addEventListener('focus', showExerciseSevenWarning);
        questionInput.addEventListener('click', showExerciseSevenWarning);
    }

    appendChilds(rowA, speakerALabel);
    appendChilds(rowA, questionInput);

    // Row B: B. + text (answer)
    const rowB = createTag('div');
    setClass(rowB, 'rowB');

    const speakerBLabel = createTag('p');
    setClass(speakerBLabel, 'letter');
    setContent(speakerBLabel, 'B.');

    const answerText = createTag('p');
    setClass(answerText, 'text');
    setContent(answerText, answer);

    appendChilds(rowB, speakerBLabel);
    appendChilds(rowB, answerText);

    appendChilds(conversationRow, rowA);
    appendChilds(conversationRow, rowB);
    appendChilds(conversationRows, conversationRow);
});