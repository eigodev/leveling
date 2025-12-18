const exerciseTwoContainer = document.getElementById('exercise-Two');
if (!exerciseTwoContainer) {
    throw new Error('Missing exercise-Two container for exercise two content.');
}

const contentTwo = createTag('div');
setClass(contentTwo, 'content');
appendChilds(exerciseTwoContainer, contentTwo);

const exerciseTwoSentences = [
    "Our company produced a new _ of shoes last month.",
    "All the _ in this restaurant are very friendly.",
    "Amazon is one of the largest _ companies in the world.",
    "I bought this jacket for a good _ in the sale.",
    "The _ was so bad that flights were cancelled."
];

const exerciseTwoOptions = [
    ["brand", "staff", "competition"],
    ["customers", "staff", "products"],
    ["delivery", "sale", "fashion"],
    ["fashion", "price", "staff"],
    ["weather", "product", "brand"]
];

// Create side‑by‑side columns for numbers and sentences
exerciseTwoSentences.forEach((sentences, index) => {
    const row = createTag('div');
    const number = createTag('p');
    const sentence = createTag('p');
    
    setClass(row, 'sentence-row');
    setClass(number, 'number');
    setClass(sentence, 'sentence');

    number.textContent = index + 1;
    sentence.textContent = sentences;

    appendChilds(row, number);
    appendChilds(row, sentence);
    appendChilds(contentTwo, row);
})

// Transform sentences with "_" to split around underscore and use <select>
const sentenceRows = contentTwo.querySelectorAll('.sentence-row');
sentenceRows.forEach((row, index) => {
    const sentenceElem = row.querySelector('p.sentence');
    const sentenceText = exerciseTwoSentences[index];
    const options = exerciseTwoOptions[index];

    if (sentenceText.includes('_')) {
        // Split the sentence around the underscore
        const [before, after] = sentenceText.split('_');
        // Create the select element
        const select = document.createElement('select');
        select.className = 'dropdown';

        // Add a placeholder option
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '';
        placeholder.selected = true;
        placeholder.disabled = true;
        select.appendChild(placeholder);

        // Add the answer/select options
        for (const optionText of options) {
            const opt = document.createElement('option');
            opt.value = optionText;
            opt.textContent = optionText;
            select.appendChild(opt);
        }

        // Clear the original sentence element
        sentenceElem.textContent = '';

        // Construct the sentence with <select> in place of "_"
        sentenceElem.appendChild(document.createTextNode(before.trimEnd()));
        sentenceElem.appendChild(select);
        if (after.trim() !== '') {
            sentenceElem.appendChild(document.createTextNode(after));
        }
    }
});
