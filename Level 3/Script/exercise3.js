const exerciseThreeContainer = document.getElementById('exercise-Three');
if (!exerciseThreeContainer) {
    throw new Error('Missing exercise-Three container for exercise three content.');
}

const contentThree = createTag('div');
setClass(contentThree, 'content');
appendChilds(exerciseThreeContainer, contentThree);

const exerciseThreeSentences = [
    "I think worked with children wouldn't be a lot of fun.",
    "A part-time tutor is not as well paid than a teacher.",
    "If you work as a tour guide, you're expecting to like travel.",
    "Would you rather meeting a politician or a journalist?",
    "A good way to keep a job is by have a good attitude.",
    "Melanie has worked as a server for two years before she became a chef."
];

// Build one row per sentence: number + clickable words
exerciseThreeSentences.forEach((text, index) => {
    const row = createTag('div');
    const number = createTag('p');
    const sentence = createTag('p');
    const input = createTag('input');

    setClass(row, 'sentence-row');
    setClass(number, 'number');
    setClass(sentence, 'sentence');

    number.textContent = index + 1;

    // Normalise spacing: single spaces only, trim ends
    const normalised = text.replace(/\s+/g, ' ').trim();

    // Split sentence into words and punctuation, make each word clickable
    const words = normalised.split(' ');
    words.forEach((word) => {
        const match = word.match(/([.,!?;:]+)$/u);
        const punctuation = match ? match[1] : '';
        const baseWord = match ? word.slice(0, -punctuation.length) : word;

        if (!baseWord) {
            if (punctuation) {
                const punctSpan = createTag('span');
                setClass(punctSpan, 'word-punctuation');
                setContent(punctSpan, punctuation);
                sentence.appendChild(punctSpan);
            }
            return;
        }

        const span = createTag('span');
        setClass(span, 'clickable-word');
        if (punctuation) {
            span.classList.add('no-gap-after');
        }
        setContent(span, baseWord);

        // Toggle "wrong" state on click (cross out the word). Only one per sentence.
        span.addEventListener('click', () => {
            const allWords = sentence.querySelectorAll('.clickable-word');
            const isAlreadySelected = span.classList.contains('selected-wrong');

            allWords.forEach((w) => w.classList.remove('selected-wrong'));

            if (!isAlreadySelected) {
                span.classList.add('selected-wrong');
            }
        });

        sentence.appendChild(span);

        if (punctuation) {
            const punctSpan = createTag('span');
            setClass(punctSpan, 'word-punctuation');
            setContent(punctSpan, punctuation);
            sentence.appendChild(punctSpan);
        }
    });

    appendChilds(row, number);
    appendChilds(row, sentence);
    appendChilds(row, input);
    appendChilds(contentThree, row);
});
