const exerciseTenContainer = document.getElementById('exercise-Ten');
if (!exerciseTenContainer) {
    throw new Error('Missing exercise-Ten container for exercise ten content.');
}

const contentTen = createTag('div');
setClass(contentTen, 'content');
appendChilds(exerciseTenContainer, contentTen);

const exerciseTenSentences = [
    {
      sentence: '_ you mind if I use your pen for a minute?',
      options: ['can', 'do', 'should', 'will', 'must']
    },
    {
      sentence: 'Could you tell Isabella not _ rude to the guests?',
      options: ['to be', 'be', 'being', 'been', 'to being']
    },
    {
      sentence: 'Please ask Derek _ we can do to help.',
      options: ['if', 'what', 'whether', 'that', 'how']
    },
    {
      sentence: 'I wonder _ you could take me home now.',
      options: ['that', 'when', 'if', 'why', 'where']
    }
];

function createExerciseTenDropdown (options = [], ariaLabel = '') {
    const select = createTag('select');
    // `text-dropdown` matches other exercises + makes scoring easy.
    setClass(select, ['dropdown', 'text-dropdown']);
    if (ariaLabel) {
        select.setAttribute('aria-label', ariaLabel);
    }

    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.selected = true;
    placeholder.disabled = true;
    appendChilds(select, placeholder);

    options.forEach((value) => {
        const option = createTag('option');
        option.value = value;
        option.textContent = value;
        appendChilds(select, option);
    });

    return select;
}

function buildExerciseTenSentenceFragment (
    sentenceText,
    dropdownOptions = [],
    ariaBaseLabel = ''
) {
    const fragment = document.createDocumentFragment();
    const parts = String(sentenceText ?? '').split('_');
    let blankIndex = 0;

    parts.forEach((part, partIndex) => {
        // Remove trailing spaces right before the dropdown so spacing stays natural.
        const text = partIndex !== parts.length - 1 ? part.trimEnd() : part;
        if (text) {
            fragment.appendChild(document.createTextNode(text));
        }

        if (partIndex !== parts.length - 1) {
            blankIndex++;
            fragment.appendChild(
                createExerciseTenDropdown(
                    dropdownOptions,
                    ariaBaseLabel
                        ? `${ariaBaseLabel} blank ${blankIndex}`
                        : ''
                )
            );
        }
    });

    return fragment;
}

exerciseTenSentences.forEach((sentence, index) => {
    const sentenceRow = createTag('div');
    const numberTag = createTag('p');
    const sentenceBlock = createTag('div');
    const sentenceTag = createTag('p');

    setClass(sentenceRow, 'sentence-row');
    setClass(numberTag, 'number');
    setClass(sentenceBlock, 'sentence-block');
    setClass(sentenceTag, 'sentence');

    setContent(numberTag, index + 1);
    sentenceTag.appendChild(
        buildExerciseTenSentenceFragment(
            sentence.sentence,
            sentence.options ?? [],
            `Exercise 10, item ${index + 1}`
        )
    );

    sentenceRow.appendChild(numberTag);
    sentenceBlock.appendChild(sentenceTag);
    sentenceRow.appendChild(sentenceBlock);
    contentTen.appendChild(sentenceRow);
});