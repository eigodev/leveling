const exerciseThreeContainer = document.getElementById('exercise-Three');
if (!exerciseThreeContainer) {
    throw new Error('Missing exercise-Three container for exercise three content.');
}

const contentThree = createTag('div');
setClass(contentThree, 'content');
appendChilds(exerciseThreeContainer, contentThree);

const storyDataThree = [
    'I live in a nice neighborhood in a big city.',
    'There are _ nice stores and restaurants near my house',
    'It\'s busy during the day, but there isn\'t _ traffic in the evening or at night.',
    'There is _ pollution, but _ thinks it\'s going to be a big problem.',
    'There are many programs to help keep the city clean.',
    'I think that _ the people who live in my neighborhood like it.'
];

const storyOptionsThree = [
    'a little',
    'few',
    'many',
    'much',
    'nearly all',
    'no one'
];

/* Create the notepad */
/* Create TAGS */
const notepadThree = createTag('div');
const notepadHeaderThree = createTag('p');
const notepadBodyThree = createTag('div');

/* Set Classnames */
setClass(notepadThree, 'notepad');
setClass(notepadHeaderThree, 'notepad-header');
setClass(notepadBodyThree, 'notepad-body');

/* Set Content */
setContent(notepadHeaderThree, 'My City');

/* Append TAGS */
appendChilds(notepadThree, notepadHeaderThree);
appendChilds(notepadThree, notepadBodyThree);
appendChilds(contentThree, notepadThree);

let dropdownIndexThree = 0;
const dropdownsThree = [];

storyDataThree.forEach((sentence) => {
    const sentenceTag = createTag('p');
    setClass(sentenceTag, 'sentence');
    
    // Replace every "_" with a select dropdown
    let parts = sentence.split('_');
    for (let index = 0; index < parts.length; index++) {
        // Add preceding HTML/text part
        if (parts[index]) {
            // split may return '' if '_' is at start; skip empty
            const textNode = document.createTextNode(parts[index].trimStart());
            appendChilds(sentenceTag, textNode);
        }
        // If not the last part, need a dropdown here
        if (index < parts.length - 1) {
            const select = createTag('select');
            setClass(select, 'text-dropdown');
            // Add empty option
            const emptyOption = createTag('option');
            emptyOption.value = '';
            emptyOption.textContent = ' ';
            appendChilds(select, emptyOption);

            // Add all available options
            storyOptionsThree.forEach(optionText => {
                const option = createTag('option');
                option.value = optionText;
                option.textContent = optionText;
                appendChilds(select, option);
            });

            appendChilds(sentenceTag, select);
            dropdownsThree.push(select);
            dropdownIndexThree++;
        }
    }
    appendChilds(notepadBodyThree, sentenceTag);
});

// Core logic: prevent choosing the same answer in more than one dropdown
function updateDropdownOptionsThree(triggeredSelect = null) {
    // Gather the current values (skip empty)
    const usedValues = dropdownsThree.map(sel => sel.value).filter(v => v);

    dropdownsThree.forEach(select => {
        // Save the current value of this dropdown so we don't accidentally disable its own option
        const currentValue = select.value;

        Array.from(select.options).forEach((opt) => {
            // Always keep the empty option enabled
            if (opt.value === '') {
                opt.disabled = false;
                return;
            }
            // Disable if this option is used in any other select (not itself)
            if (usedValues.includes(opt.value) && opt.value !== currentValue) {
                opt.disabled = true;
                // If trigger causes user to lose their selection, reset to ''
                if (select === triggeredSelect && opt.value === currentValue) {
                    select.value = '';
                }
            } else {
                opt.disabled = false;
            }
        });
    });
}

// Attach change listeners to all dropdowns
dropdownsThree.forEach(select => {
    select.addEventListener('change', function() {
        updateDropdownOptionsThree(this);
    });
});
// On first render, nothing is chosen but just in case, call once
updateDropdownOptionsThree();

/* EVENT LISTENER – track answers for Exercise 3 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers-button');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 3
        // Items 1–3 -> Unit 8 / Exercise 9
        // Items 4–5 -> Unit 5 / Exercise 10
        const reviewMap = [
            { unit: 8, exercise: 9 },
            { unit: 8, exercise: 9 },
            { unit: 8, exercise: 9 },
            { unit: 5, exercise: 10 },
            { unit: 5, exercise: 10 }
        ];

        const selects = document.querySelectorAll(
            '#exercise-Three select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise3.dropdowns ?? [];
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

        window.studentChoices.choicesThree = correctAnswersChosen;
        window.studentChoices.choicesThreeHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});