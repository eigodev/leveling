const exerciseSevenContainer = document.getElementById('exercise-Seven');
if (!exerciseSevenContainer) {
    throw new Error('Missing exercise-Seven container for exercise seven content.');
}

const contentSeven = createTag('div');
setClass(contentSeven, 'content');
appendChilds(exerciseSevenContainer, contentSeven);

const exerciseSevenConversation = {
    A: [
        '_ you ever _ the India drink Chai?',
        'When _ you _ it?'
    ],
    B: [
        'Yes, but I _ any for a long time.',
        'Last winter. I _ it for my roommate when the weather _ cold.'
    ]
};

// Seven dropdowns in reading order (1–7)
// 1 and 4 -> did / have / has / had
// 2       -> try / tries / tried
// 3       -> don't have / doesn't have / didn't have
// 5       -> drink / drinks / drank / drunk
// 6       -> make / makes / made
// 7       -> get / gets / got / gotten
const exerciseSevenDropdownOptionsByIndex = [
    ['did', 'have', 'has', 'had'],
    ['try', 'tries', 'tried'],
    ["don't have", "doesn't have", "didn't have"],
    ['did', 'have', 'has', 'had'],
    ['drink', 'drinks', 'drank', 'drunk'],
    ['make', 'makes', 'made'],
    ['get', 'gets', 'got', 'gotten']
];
let exerciseSevenDropdownCursor = 0;

const conversationSevenWrapper = createTag('div');
setClass(conversationSevenWrapper, 'conversation');
appendChilds(contentSeven, conversationSevenWrapper);

const conversationSevenSequence = [
    { speaker: 'A', index: 0 },
    { speaker: 'B', index: 0 },
    { speaker: 'A', index: 1 },
    { speaker: 'B', index: 1 }
];

conversationSevenSequence.forEach(({ speaker, index }) => {
    const conversationRow = createTag('div');
    setClass(conversationRow, 'conversation-row');

    const letterTag = createTag('p');
    setClass(letterTag, 'letter');
    setContent(letterTag, `${speaker}.`);

    const textTag = createTag('p');
    setClass(textTag, 'text');
    const lineText = exerciseSevenConversation[speaker][index] ?? '';

    const sentenceFragment = buildExerciseSevenSentenceFragment(lineText);
    textTag.appendChild(sentenceFragment);

    appendChilds(conversationRow, letterTag);
    appendChilds(conversationRow, textTag);
    appendChilds(conversationSevenWrapper, conversationRow);
});

function buildExerciseSevenSentenceFragment (sentence) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            exerciseSevenDropdownCursor++;

            const dropdownOptions =
                exerciseSevenDropdownOptionsByIndex[exerciseSevenDropdownCursor - 1] ??
                [];

            const trimmedPart = part.trimEnd();
            const lastChar = trimmedPart[trimmedPart.length - 1];
            const isSentenceStart =
                (!trimmedPart && partIndex === 0) ||
                lastChar === '.' ||
                lastChar === '?' ||
                lastChar === '!';

            fragment.appendChild(
                createExerciseSevenDropdown(dropdownOptions, isSentenceStart)
            );
        }
    });

    return fragment;
}

function createExerciseSevenDropdown (options = [], capitalize = false) {
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
        const label = capitalize
            ? optionValue.charAt(0).toUpperCase() + optionValue.slice(1)
            : optionValue;
        const option = createTag('option');
        option.value = optionValue;
        option.textContent = label;
        appendChilds(select, option);
    });

    return select;
}

/* EVENT LISTENER – track answers for Exercise 7 */
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

    button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Review map for Exercise 7 (8 blanks)
        // Items 1 and 4–6 -> Unit 7 / Exercise 3
        // Items 2 and 3     -> Unit 7 / Exercise 10
        // Items 7 and 8     -> no specific mapping provided
        const reviewMap = [
            { unit: 7, exercise: 3 },  // 1
            { unit: 7, exercise: 10 }, // 2
            { unit: 7, exercise: 10 }, // 3
            { unit: 7, exercise: 3 },  // 4
            { unit: 7, exercise: 3 },  // 5
            { unit: 7, exercise: 3 },  // 6
            null,                      // 7
            null                       // 8
        ];

        const selects = document.querySelectorAll(
            '#exercise-Seven select.text-dropdown'
        );
        const expected = window.expectedAnswers.exercise7.dropdowns ?? [];
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

        window.studentChoices.choicesSeven = correctAnswersChosen;
        window.studentChoices.choicesSevenHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});