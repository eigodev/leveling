const exerciseFiveContainer = document.getElementById('exercise-Five');
if (!exerciseFiveContainer) {
    throw new Error('Missing exercise-Five container for exercise five content.');
}

const contentFive = createTag('div');
setClass(contentFive, 'content');
appendChilds(exerciseFiveContainer, contentFive);

const storyDataFive = [
    'I’d like to introduce you to some of the people here.',
    'First, this is Ms. Cartwright, our receptionist.',
    'Hmm. She _ time to talk with us right now, so let’s come back later.',
    'This is Joel. He _ here on Tuesdays and Thursdays.',
    'Right now he _ an office building for an important customer.',
    'And over here are Bill and Bryan.',
    'Usually they _ to the office on Tuesdays, but today they _ ready for a meeting this afternoon.',
    'I guess everyone else _ lunch now.',
    'Come on, I’ll show you where the cafeteria is.'
];

const storyOptionsFive = [
    ['has', 'have', "don't have", "doesn't have", "didn't have"],
    ['work', 'works', "don't work", "doesn't work", "didn't work"],
    ['design', 'designs', "'m designing", "'s designing", "'re designing", 'designed'],
    ['come', 'comes', "don't come", "doesn't come", "didn't come"],
    ['get', 'gets', "'m getting", "'s getting", "'re getting", 'got'],
    ['eat', 'eats', "'m eating", "'s eating", "'re eating", 'ate']
];

/* Create the notepad */
/* Create TAGS */
const notepadFive = createTag('div');
const notepadHeaderFive = createTag('p');
const notepadBodyFive = createTag('div');

/* Set Classnames */
setClass(notepadFive, 'notepad');
setClass(notepadHeaderFive, 'notepad-header');
setClass(notepadBodyFive, 'notepad-body');

/* Set Content */
setContent(notepadHeaderFive, 'A tour in the office.');

/* Append TAGS */
appendChilds(contentFive, notepadFive);
appendChilds(notepadFive, notepadHeaderFive);
appendChilds(notepadFive, notepadBodyFive);

let dropdownIndexFive = 0; // Track which dropdown we're filling;
const dropdownsFive = []; // Store all dropdowns for this exercise;

storyDataFive.forEach((sentence) => {
    const sentenceTag = createTag('p');
    setClass(sentenceTag, 'sentence');
    
    let parts = sentence.split('_')
    for (let index = 0; index < parts.length; index++) {
        if (parts[index]) {
            const textNode = document.createTextNode(parts[index].trimStart());
            appendChilds(sentenceTag, textNode)
        }

        if (index < parts.length - 1) {
            const select = createTag('select');
            setClass(select, 'text-dropdown')

            const emptyOption = createTag('option');
            emptyOption.value = '';
            emptyOption.textContent = ' ';
            appendChilds(select, emptyOption);

            storyOptionsFive[dropdownIndexFive].forEach(optionText => {
                const option = createTag('option');
                option.value = optionText;
                option.textContent = optionText;
                appendChilds(select, option);
            });
            
            appendChilds(sentenceTag, select);
            dropdownsFive.push(select);
            dropdownIndexFive++;
        }
    }
    appendChilds(notepadBodyFive, sentenceTag);
})

/* EVENT LISTENER – track answers for Exercise 5 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 5
        // Items 1, 2, 4 -> Unit 2 / Exercise 5
        // Items 3, 5, 6 -> Unit 5 / Exercise 5
        const reviewMap = [
            { unit: 2, exercise: 5 }, // 1
            { unit: 2, exercise: 5 }, // 2
            { unit: 5, exercise: 5 }, // 3
            { unit: 2, exercise: 5 }, // 4
            { unit: 5, exercise: 5 }, // 5
            { unit: 5, exercise: 5 }  // 6
        ];

        const selects = document.querySelectorAll(
            '#exercise-Five select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise5.dropdowns ?? [];
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
                        ? `${reviewInfo.unit}/${reviewInfo.exercise}`
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

        window.studentChoices.choicesFive = correctAnswersChosen;
        window.studentChoices.choicesFiveHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});