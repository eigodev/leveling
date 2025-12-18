const exerciseNineContainer = document.getElementById('exercise-Nine');
if (!exerciseNineContainer) {
    throw new Error('Missing exercise-Nine container for exercise nine content.');
}

const contentNine = createTag('div');
setClass(contentNine, 'content');
appendChilds(exerciseNineContainer, contentNine);

// 1) Object with the sentences (each with ONE underscore)
const sentencesNine = {
    1: 'Remember _ the new software tomorrow.',
    2: 'Do you know how often _ texts to your friends?',
    3: 'I wish I _ get better cell-phone service here.',
    4: 'This file is used _ business reports.'
};

// 2) Object with the dropdown options for each sentence
const dropdownOptionsNine = {
    1: ['download', 'downloading', 'to download'],
    2: ['do you send', 'send', 'you send'],
    3: ['will', 'could', 'can'],
    4: ['prepare', 'to prepare', 'preparing']
};

// Build the 4 numbered lines like Exercise 3:
// 1. [question text and dropdown]
Object.keys(sentencesNine)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((key) => {
        const index = Number(key);
        const sentence = sentencesNine[index];
        const options = dropdownOptionsNine[index] ?? [];

        const row = createTag('div');
        setClass(row, 'question-row');

        const numberTag = createTag('p');
        setClass(numberTag, 'number');
        setContent(numberTag, `${index}.`);

        const textTag = createTag('p');
        setClass(textTag, 'text');
        const fragment = buildExerciseNineSentenceFragment(sentence, options);
        textTag.appendChild(fragment);

        appendChilds(row, numberTag);
        appendChilds(row, textTag);
        appendChilds(contentNine, row);
    });

function buildExerciseNineSentenceFragment (
    sentence,
    dropdownOptions = []
) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        // Insert one dropdown where the underscore is
        if (partIndex !== parts.length - 1) {
            fragment.appendChild(
                createExerciseNineDropdown(dropdownOptions)
            );
        }
    });

    return fragment;
}

function createExerciseNineDropdown (options = []) {
    const select = createTag('select');
    setClass(select, 'text-dropdown');

    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(select, placeholder);

    const availableOptions = options.length ? options : ['N/A'];
    availableOptions.forEach((optionValue) => {
        const option = createTag('option');
        option.value = optionValue;
        option.textContent = optionValue;
        appendChilds(select, option);
    });

    return select;
}



/* EVENT LISTENER – track answers for Exercise 9 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 9
        // Item 1 -> Unit 3 / Exercise 3
        // Item 2 -> Unit 2 / Exercise 9
        // Item 3 -> Unit 3 / Exercise 10
        // Item 4 -> Unit 6 / Exercise 11
        // Item 5 -> Unit 4 / Exercise 9
        // Item 6 -> Unit 8 / Exercise 3
        const reviewMap = [
            { unit: 3, exercise: 3 },
            { unit: 2, exercise: 9 },
            { unit: 3, exercise: 10 },
            { unit: 6, exercise: 11 },
            { unit: 4, exercise: 9 },
            { unit: 8, exercise: 3 }
        ];

        const selects = document.querySelectorAll(
            '#exercise-Nine select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise9.dropdowns ?? [];
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

        window.studentChoices.choicesNine = correctAnswersChosen;
        window.studentChoices.choicesNineHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});