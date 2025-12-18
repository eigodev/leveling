const exerciseSevenContainer = document.getElementById('exercise-Seven');
if (!exerciseSevenContainer) {
    throw new Error('Missing exercise-Seven container for exercise seven content.');
}

const contentSeven = createTag('div');
setClass(contentSeven, 'content');
appendChilds(exerciseSevenContainer, contentSeven);

// Sentences
const exerciseSevenSentences = [
    "The streetlights _ by city volunteers.",
    "One way _ garbage is to recyle more.",
    "Acid rain _ by pollution from factories.",
    "We can protect ourselves from skin cancer by _ our exposure to the sun."
]

const exerciseSevenOptions = ['repair', 'reduce', 'cause', 'limit'];
function autoGrowInput (input, minPx = 100) {
    // Resizing the input
    const resize = () => {
        // Setting the width to 0px
        input.style.width = '0px'

        // Calculating the next width
        const next = Math.max(minPx, (input.value.length + 1) * 7.5)
        // Setting the width to the next width
        input.style.width = next + 'px';
    }
    // Adding the event listener to the input
    input.addEventListener('input', resize);
    // Resizing the input
    resize();
}


// Sentences
exerciseSevenSentences.forEach((sentence, index) => {
    // Creating the sentence row
    const sentenceRow = createTag('div')
    const numberTag = createTag('p');
    const sentenceTag = createTag('p');

    // Setting the classes
    setClass(sentenceRow, 'sentence-row');
    setClass(numberTag, 'number');
    setClass(sentenceTag, 'sentence');

    // Setting the content
    setContent(numberTag, index + 1);
    setContent(sentenceTag, sentence)

    // Appending the childs
    appendChilds(contentSeven, sentenceRow);
    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, sentenceTag);
})

const sentencesSeven = document.querySelectorAll('#exercise-Seven div.content p.sentence');
sentencesSeven.forEach((sentence, index) => {
    // Splitting the sentence into before and after the underscore
    const [before, after] = sentence.textContent.split('_')
    const input = document.createElement('input');
    autoGrowInput(input, 100); // 100px is the minimum width
    input.placeholder = exerciseSevenOptions[index]; // Setting the placeholder
    input.addEventListener('focus', () => {input.placeholder = ''}); // Removing the placeholder when the input is focused
    input.addEventListener('blur', () => {input.placeholder = exerciseSevenOptions[index]}); // Setting the placeholder when the input is blurred

    if (sentence.textContent.includes('_')) {
        // Clearing the sentence text content
        sentence.textContent = ''
        
        // Appending the before text and the input and the after text
        sentence.appendChild(document.createTextNode(before.trimEnd()))
        sentence.appendChild(input)
        sentence.appendChild(document.createTextNode(after))
    }
})