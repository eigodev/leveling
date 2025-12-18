const exerciseSixContainer = document.getElementById('exercise-Six');
if (!exerciseSixContainer) {
    throw new Error('Missing exercise-Six container for exercise six content.');
}

const contentSix = createTag('div');
setClass(contentSix, 'content');
appendChilds(exerciseSixContainer, contentSix);

// Sentences
const exerciseSixSentences = [
    "Most nuclear power plants work safely and efficiently.",
    "Only one reactor was damaged in the earthquake.",
    "Nuclear radiation does not usually travel very far.",
    "The Fukushima reactors avoided nuclear meltdown.",
    "The plant workers didn’t work in high-radiation areas."
]

// Options
const exerciseSixOptions = ['true', 'false'];

// Image
const image = createTag('img');
image.src = 'Images/Content/IMG_0001.jpg';
image.alt = 'Nuclear Disaster at Fukushima';
appendChilds(contentSix, image);

// Sentences
exerciseSixSentences.forEach((sentence, index) => {
    // Creating the sentence row
    const sentenceRow = createTag('div')
    const numberTag = createTag('p');
    const selectTag = createTag('select');
    const sentenceTag = createTag('p');

    // Setting the classes
    setClass(sentenceRow, 'sentence-row');
    setClass(numberTag, 'number');
    setClass(selectTag, 'select');
    setClass(sentenceTag, 'sentence');

    // Setting the content
    setContent(numberTag, index + 1);
    setContent(sentenceTag, sentence)

    // Creating the placeholder
    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(selectTag, placeholder);

    // Adding the options to the select
    exerciseSixOptions.forEach(option => {
        // Creating the option
        const optionTag = createTag('option');
        optionTag.value = option;
        optionTag.textContent = option;
        appendChilds(selectTag, optionTag);
    })

    // Appending the childs
    appendChilds(contentSix, sentenceRow);
    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, selectTag);
    appendChilds(sentenceRow, sentenceTag);
})