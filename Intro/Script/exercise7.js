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

    const popupInfo = document.getElementById('popup-info');
    if (!popupInfo) {
        // Fallback if the styled popup container is not available
        window.alert(
            'Antes de clicar em "Check Answers", verifique se você digitou corretamente as sentenças.'
        );
        return;
    }

    popupInfo.innerHTML = '';

    const message = document.createElement('p');
    message.classList.add('exercise-warning');
    message.textContent =
        'Antes de clicar em "Check Answers", verifique se você digitou corretamente as sentenças.';

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.classList.add('student-info-button');
    okButton.addEventListener('click', () => {
        popupInfo.style.display = 'none';
    });

    popupInfo.appendChild(message);
    popupInfo.appendChild(okButton);
    popupInfo.style.display = 'flex';
}

// Same visual structure as Level 1 – Exercise 2:
// For each item:
//  - number
//  - row a: A. + [input]
//  - row b: B. + fixed answer
const exerciseSevenAnswers = [
    "I'm fine, thanks.",
    "I'm 28 years old.",
    "I'm a salesperson.",
    'I work in a shoe store.'
];

exerciseSevenAnswers.forEach((answer, exerciseIndex) => {
    const exerciseWrapper = createTag('div');
    setClass(exerciseWrapper, 'conversation');
    appendChilds(contentSeven, exerciseWrapper);

    const exerciseNumber = createTag('p');
    setClass(exerciseNumber, 'number');
    setContent(exerciseNumber, `${exerciseIndex + 1}.`);
    appendChilds(exerciseWrapper, exerciseNumber);

    // Row a: typed question
    const rowA = createTag('div');
    setClass(rowA, 'conversation-row');

    const speakerALabel = createTag('p');
    setClass(speakerALabel, 'letter');
    setContent(speakerALabel, 'a.');

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
    appendChilds(exerciseWrapper, rowA);

    // Row b: answer text
    const rowB = createTag('div');
    setClass(rowB, 'conversation-row');

    const speakerBLabel = createTag('p');
    setClass(speakerBLabel, 'letter');
    setContent(speakerBLabel, 'b.');

    const answerText = createTag('p');
    setClass(answerText, 'text');
    setContent(answerText, answer);

    appendChilds(rowB, speakerBLabel);
    appendChilds(rowB, answerText);
    appendChilds(exerciseWrapper, rowB);
});