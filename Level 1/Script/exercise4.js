const exerciseFourContainer = document.getElementById('exercise-Four');
if (!exerciseFourContainer) {
    throw new Error('Missing exercise-Four container for exercise four content.');
}

const contentFour = createTag('div');
setClass(contentFour, 'content');
appendChilds(exerciseFourContainer, contentFour);

/* Composition Data */
const compositionData = [
  'There _ five people in my family.',
  'I _ an older brother, and he _ as an engineer.',
  'He _ married a little while ago and _ to Atlanta.',
  'My sister _ several years younger than I _.',
  'She _ still in high school and _ at home with my parents.',
  'My mother _ when I _ a child, but now she _ part-time.',
  'My father _ a businessman.',
  'He _ for a large international company and _ a lot for his job.',
  'In fact, he _ probably _ somewhere right now.',
  'I _ home a year ago to _ to college, and I _ in a different city.',
  'I _ back home on vacation to _ my parents and my sister.',
  'I enjoy _ time with my family.'
];

const compositionOptions = [
    ['am', '\'m', 'is', '\'s', 'are', '\'re'],
    ['have', 'has', 'had'],
    ['work', 'works', 'worked'],
    ['get', 'gets', 'got'],
    ['move', 'moves', 'moved'],
    ['am', '\'m', 'is', '\'s', 'are', '\'re'],
    ['am', '\'m', 'is', '\'s', 'are', '\'re'],
    ['am', '\'m', 'is', '\'s', 'are', '\'re'],
    ['live', 'lives', 'lived'],
    ['don\'t work', 'doesn\'t work', 'didn\'t work'],
    ['was', 'were', 'wasn\'t', 'weren\'t'],
    ['teach', 'teaches', 'teaching', '\'m teaching', '\'s teaching', '\'re teaching', 'taught'],
    ['am', '\'m', 'is', '\'s', 'are', '\'re'],
    ['work', 'works', 'worked'],
    ['travel', 'travels', 'travelled'],
    ['am', '\'m', 'is', '\'s', 'are', '\'re'],
    ['travel', 'travels', 'traveling', '\'m traveling', '\'s traveling', '\'re traveling', 'traveled'],
    ['leave', 'leaves', 'left'],
    ['go', 'goes', 'went'],
    ['live', 'lives', '\'m living', '\'s living', '\'re living', 'lived'],
    ['go', 'goes', 'went'],
    ['visit', 'visits', 'visited'],
    ['spend', 'spends', 'spending', '\'m spending', '\'s spending', '\'re spending', 'spent'],
]

/* Composition Prompts */
const compositionPrompts = [
    'Brenda has one brother and one sister.',
    'Her brother lives in the same city as her parents.',
    'Her mother isn’t working now.',
    'Brenda is living with her family.'
];

/* Create the notepad */
/* Create TAGS */
const notepadFour = createTag('div');
const notepadHeaderFour = createTag('p');
const notepadBodyFour = createTag('div');

/* Set Classnames */
setClass(notepadFour, 'notepad');
setClass(notepadHeaderFour, 'notepad-header');
setClass(notepadBodyFour, 'notepad-body');

/* Set Content */
setContent(notepadHeaderFour, 'Brenda\'s Composition');

/* Append TAGS */
appendChilds(contentFour, notepadFour);
appendChilds(notepadFour, notepadHeaderFour);
appendChilds(notepadFour, notepadBodyFour);

let dropdownIndexFour = 0;
const dropdownsFour = [];

compositionData.forEach((sentence) => {
    const sentenceTag = createTag('p');
    setClass(sentenceTag, 'sentence');

    let parts = sentence.split('_');
    for (let index = 0; index < parts.length; index++) {
        if (parts[index]) {
            const textNode = document.createTextNode(parts[index].trimStart());
            appendChilds(sentenceTag, textNode);
        }

        if (index < parts.length - 1) {
            const select = createTag('select');
            setClass(select, 'text-dropdown');

            const emptyOption = createTag('option');
            emptyOption.value = '';
            emptyOption.textContent = ' ';
            appendChilds(select, emptyOption);

            compositionOptions[dropdownIndexFour].forEach(optionText => {
                const option = createTag('option');
                option.value = optionText;
                option.textContent = optionText;
                appendChilds(select, option);
            });

            appendChilds(sentenceTag, select);
            dropdownsFour.push(select);
            dropdownIndexFour++;
        }
    }
    appendChilds(notepadBodyFour, sentenceTag);
});

/* TRUE/FALSE Sentences */
/* Container TAGS */
const sentenceRows = createTag('div');
setClass(sentenceRows, 'rows');
appendChilds(contentFour, sentenceRows);

/* Sentence TAGS */
compositionPrompts.forEach((prompt, index) => {
    /* Create TAGS */
    const sentenceRow = createTag('div');
    const numberTag = createTag('p');
    const sentenceTag = createTag('p');
    const selectTag = createTag('select');

    /* Set Classes */
    setClass(sentenceRow, 'sentence-row');
    setClass(numberTag, 'number');
    setClass(sentenceTag, 'sentence');
    setClass(selectTag, 'dropdown');

    /* Set Content */
    setContent(numberTag, (index + 1).toString());
    setContent(sentenceTag, prompt);

    /* Create Options */
    for (const option of [' ', 'True', 'False']) {        
        const optionTag = createTag('option');
        setClass(optionTag, 'option');
        setContent(optionTag, option);
        appendChilds(selectTag, optionTag);
    }

    /* Append TAGS */
    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, sentenceTag);
    appendChilds(sentenceRow, selectTag);
    appendChilds(sentenceRows, sentenceRow);
});

/* EVENT LISTENER – track answers for Exercise 4 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 4: 23 notepad + 4 True/False (all Unit 5)
        const reviewMap = Array(27).fill({ unit: 5, exercise: null });

        const selects = document.querySelectorAll('#exercise-Four select');
        const expected = window.expectedAnswers.exercise4.dropdowns ?? [];
        const totalQuestions = expected.length;

        selects.forEach((select, index) => {
            const userAnswer = select.value;
            const expectedAnswer = expected[index];
            const isCorrect = userAnswer === expectedAnswer;
            const reviewInfo = reviewMap[index] ?? null;

            if (isCorrect) {
                items++;
                score++;
                correctAnswersChosen.push(expectedAnswer);
            } else {
                wrongAnswersChosen.push(userAnswer || null);
            }

            details.push({
                questionIndex: index,
                unit: reviewInfo?.unit ?? null,
                exercise: reviewInfo?.exercise ?? null,
                reviewCode:
                    reviewInfo != null
                        ? reviewInfo.exercise != null
                            ? `${reviewInfo.unit}/${reviewInfo.exercise}`
                            : `${reviewInfo.unit}`
                        : null,
                userAnswer: userAnswer || null,
                expectedAnswer,
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

        window.studentChoices.choicesFour = correctAnswersChosen;
        window.studentChoices.choicesFourHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});