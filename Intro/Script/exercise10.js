const exerciseTenContainer = document.getElementById('exercise-Ten');
if (!exerciseTenContainer) {
    throw new Error('Missing exercise-Ten container for exercise ten content.');
}

const contentTen = createTag('div');
setClass(contentTen, 'content');
appendChilds(exerciseTenContainer, contentTen);

// Options for each dropdown (16 blanks total, left‑to‑right through the exercise)
const exerciseTenDropdownOptions = [
    // 1
    ['do', 'does', 'did'],
    // 2
    ['live', 'lives', 'lived'],
    // 3
    ['live', 'lives', 'lived'],
    // 4
    ["do", "does", "did"],
    // 5
    ['have', 'has', 'had'],
    // 6
    ["have", "has", "had"],
    // 7
    ["do", "does", "did"],
    // 8
    ["drive", "drives", "drove"],
    // 9
    ['don\'t', 'doesn\'t', 'didn\'t'],
    // 10
    ['take', 'takes', 'took'],
    // 11
    ['do', 'does', 'did'],
    // 12
    ['work', 'works', 'worked'],
    // 13
    ["work", "works", "worked"],
    // 14
    ['do', 'does', 'did'],
    // 15
    ["do", "does", "did"],
    // 16
    ["'m", "'s", "'re"],
];

// Five items; all are dialogues (A / B)
const exerciseTenData = [
    {
        number: 1,
        lines: {
            A: 'Where _ you _?',
            B: 'I _ in the suburbs with my family.'
        }
    },
    {
        number: 2,
        lines: {
            A: '_ you _ children?',
            B: 'Yes, we _ two daughters.'
        }
    },
    {
        number: 3,
        lines: {
            A: '_ you _ to work?',
            B: 'No, I _. I _ the bus.'
        }
    },
    {
        number: 4,
        lines: {
            A: '_ your wife _?',
            B: 'Yes, she _ in a hospital.'
        }
    },
    {
        number: 5,
        lines: {
            A: 'What _ she _?',
            B: 'She _ a nurse.'
        }
    }
];

// Track which dropdown we are filling (1–16) as we walk through the sentences
let exerciseTenDropdownIndex = 0;

exerciseTenData.forEach((item) => {
    const { number, lines, sentence } = item;

    const exerciseWrapper = createTag('div');
    setClass(exerciseWrapper, 'conversation');
    appendChilds(contentTen, exerciseWrapper);

    const exerciseNumber = createTag('p');
    setClass(exerciseNumber, 'number');
    setContent(exerciseNumber, `${number}.`);
    appendChilds(exerciseWrapper, exerciseNumber);

    // Dialogue items: two rows, A and B
    if (lines) {
        (['A', 'B']).forEach((speakerKey) => {
            const text = lines[speakerKey];
            if (!text) return;

            const conversationRow = createTag('div');
            setClass(conversationRow, 'conversation-row');

            const speakerLabel = createTag('p');
            setClass(speakerLabel, 'letter');
            setContent(speakerLabel, `${speakerKey.toLowerCase()}.`);

            const speakerLine = createTag('p');
            setClass(speakerLine, 'text');

            const fragment = buildExerciseTenSentenceFragment(text);
            speakerLine.appendChild(fragment);

            appendChilds(conversationRow, speakerLabel);
            appendChilds(conversationRow, speakerLine);
            appendChilds(exerciseWrapper, conversationRow);
        });
        return;
    }

    // Single-sentence items (none in current data, but kept for flexibility)
    if (sentence) {
        const row = createTag('div');
        setClass(row, 'conversation-row');

        const sentenceText = createTag('p');
        setClass(sentenceText, 'text');

        const fragment = buildExerciseTenSentenceFragment(sentence);
        sentenceText.appendChild(fragment);

        appendChilds(row, sentenceText);
        appendChilds(exerciseWrapper, row);
    }
});

function buildExerciseTenSentenceFragment (sentence) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            const capitalise = shouldCapitaliseDropdown(part, partIndex);
            const optionsForThisBlank =
                exerciseTenDropdownOptions[exerciseTenDropdownIndex] ?? [];
            fragment.appendChild(
                createExerciseTenDropdown(optionsForThisBlank, capitalise)
            );
            exerciseTenDropdownIndex++;
        }
    });

    return fragment;
}

function createExerciseTenDropdown (options = [], capitalise = false) {
    const select = createTag('select');
    setClass(select, 'text-dropdown');

    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(select, placeholder);

    const availableOptions = options.length ? options : ['N/A'];
    availableOptions.forEach((optionLabel) => {
        const option = createTag('option');
        option.value = optionLabel;
        option.textContent = formatDropdownLabel(optionLabel, capitalise);
        appendChilds(select, option);
    });

    return select;
}