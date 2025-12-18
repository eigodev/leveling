const exerciseNineContainer = document.getElementById('exercise-Nine');
if (!exerciseNineContainer) {
    throw new Error('Missing exercise-Nine container for exercise nine content.');
}

const contentNine = createTag('div');
setClass(contentNine, 'content');
appendChilds(exerciseNineContainer, contentNine);

// Options for each dropdown
const exerciseNineDropdownOptions = [
    // 1
    ['am', 'is', 'are'],
    // 2
    ['do', 'does', 'doing', "'m doing", "'s doing", "'re doing", 'did'],
    // 3
    ['watch', 'watches', 'watching', "'m watching", "'s watching", "'re watching", 'watched'],
    // 4
    ['rain', 'rains', 'raining', "'m raining", "'s raining", "'re raining", 'rained'],
    // 5
    ["don't wear", "doesn't wear", "'m not wearing", "'s not wearing", "'re not wearing", "didn't rain"],
    // 6
    ["don't be", "doesn't be", "I'm not hungry", "isn't hungry", "aren't hungry", "didn't be"],
    // 7
    ["don't eat", "doesn't eat", "I'm not eating", "isn't eating", "aren't eating", "didn't eat"],
    // 8
    ["'m", "'s", "'re"],
    // 9
    ['do', 'does', 'doing', "'m doing", "'s doing", "'re doing", 'did'],
    // 10
    ['check', 'checks', 'checking', "'m checking", "'s checking", "'re checking", 'checked'],
    // 11
    ['am', 'is', 'are'],
    // 12
    ['wear', 'wears', 'wearing', "'m wearing", "'s wearing", "'re wearing"],
    // 13
    ["don't", "doesn't", "'m not", "'s not", "'re not", "didn't"],
    // 14
    ['am', 'is', 'are'],
    // 15
    ["don't work", "doesn't work", "'m not working", "'s not working", "'re not working", "didn't work"],
    // 16
    ["'m", "'s", "'re"]
];

// Six items; 1, 4, 5, 6 are dialogues (A / B); 2 and 3 are single sentences
const exerciseNineData = [
    {
        number: 1,
        lines: {
            A: 'What _ you _ right now?',
            B: 'We _ TV.'
        }
    },
    {
        number: 2,
        sentence: "It _ , but I _ a raincoat."
    },
    {
        number: 3,
        sentence: 'Betty and Jill _ hungry, so they _ lunch right now.'
    },
    {
        number: 4,
        lines: {
            A: 'What _ Carol _ ?',
            B: 'She _ her messages.'
        }
    },
    {
        number: 5,
        lines: {
            A: '_ you _ shorts?',
            B: 'No, I_ not. It is cold today.'
        }
    },
    {
        number: 6,
        lines: {
            A: '_ Joyce at work now?',
            B: 'No, she _ today. It_ Sunday.'
        }
    }
];

// Track which dropdown we are filling (1–16) as we walk through the sentences
let exerciseNineDropdownIndex = 0;

exerciseNineData.forEach((item) => {
    const { number, lines, sentence } = item;

    const exerciseWrapper = createTag('div');
    setClass(exerciseWrapper, 'conversation');
    appendChilds(contentNine, exerciseWrapper);

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

            const fragment = buildExerciseNineSentenceFragment(text);
            speakerLine.appendChild(fragment);

            appendChilds(conversationRow, speakerLabel);
            appendChilds(conversationRow, speakerLine);
            appendChilds(exerciseWrapper, conversationRow);
        });
        return;
    }

    // Single-sentence items (no A / B labels)
    if (sentence) {
        const row = createTag('div');
        setClass(row, 'conversation-row');

        const sentenceText = createTag('p');
        setClass(sentenceText, 'text');

        const fragment = buildExerciseNineSentenceFragment(sentence);
        sentenceText.appendChild(fragment);

        appendChilds(row, sentenceText);
        appendChilds(exerciseWrapper, row);
    }
});

function buildExerciseNineSentenceFragment (sentence) {
    const fragment = document.createDocumentFragment();
    const parts = sentence.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            const capitalise = shouldCapitaliseDropdown(part, partIndex);
            const optionsForThisBlank =
                exerciseNineDropdownOptions[exerciseNineDropdownIndex] ?? [];
            fragment.appendChild(
                createExerciseNineDropdown(optionsForThisBlank, capitalise)
            );
            exerciseNineDropdownIndex++;
        }
    });

    return fragment;
}

function createExerciseNineDropdown (options = [], capitalise = false) {
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