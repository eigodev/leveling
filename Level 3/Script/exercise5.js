const exerciseFiveContainer = document.getElementById('exercise-Five');
if (!exerciseFiveContainer) {
    throw new Error('Missing exercise-Five container for exercise five content.');
}

const contentFive = createTag('div');
setClass(contentFive, 'content');
appendChilds(exerciseFiveContainer, contentFive);

const exerciseFiveSentences = [
    "I like students... _",
    "I can't stand... _",
    "I'd rather watch a movie at someone's house... _",
    "The best way to meet new people... _",
    "Going out with friends is more interesting... _",
    "Jeremy is a person... _"
]

const exerciseFiveOptions = [
    " is to go to a lot of parties.",
    " that I'd like to know better.",
    " who are excited about learning.",
    " than staying at home.",
    " when my friends don't answer my texts.",
    " than go out to the movies."
]

exerciseFiveSentences.forEach((sentence, index) => {
    const sentenceRow = createTag('div');
    const numberTag = createTag('p');
    const sentenceTag = createTag('p');

    setClass(sentenceRow, 'sentence-row');
    setClass(numberTag, 'number');
    setClass(sentenceTag, 'sentence');

    setContent(numberTag, index + 1)
    setContent(sentenceTag, sentence)

    appendChilds(contentFive, sentenceRow);
    appendChilds(sentenceRow, numberTag);
    appendChilds(sentenceRow, sentenceTag);
})

const sentenceRow = document.querySelectorAll('#exercise-Five div.content div.sentence-row p.sentence')
sentenceRow.forEach((sentence, index) => {
    const originalSentence = sentence.textContent;
    const [before, after] = sentence.textContent.split('_')
    const select = createTag('select')

    sentence.textContent = ''
    sentence.appendChild(document.createTextNode(before))
    sentence.appendChild(select);
    sentence.appendChild(document.createTextNode(after))
})

const selectRow = document.querySelectorAll('#exercise-Five div.content div.sentence-row p.sentence select')
selectRow.forEach((select, index) => {
    const placeholder = createTag('option')
    placeholder.value = ''
    placeholder.textContent = ''
    placeholder.disabled = true
    placeholder.selected = true
    appendChilds(select, placeholder)

    for (const option of exerciseFiveOptions) {
        const optionTag = createTag('option')
        setClass(optionTag, 'option')
        setContent(optionTag, option)
        appendChilds(select, optionTag)
    }
})

// Collecting all selects
const selects = document.querySelectorAll('#exercise-Five div.content div.sentence-row p.sentence select')

// Identifying user's choices
function userChoices() {
    // Collecting all choices
    const choices = []

    // If the select has a value, add it to the choices array
    selects.forEach((select) => {
        if (select.value !== '') {
            choices.push(select.value)
        }
    })
    return choices
}

// Disable used options
function disableUsedOptions() {
    // Collecting all used choices
    const usedChoices = userChoices()

    selects.forEach(select => {
        // Collecting the current choice
        const currentChoice = select.value

        // For each option in this select, disable/hide if it's used in another select
        Array.from(select.options).forEach(option => {
            // Skip placeholder
            if (option.value === '') return

            // If the option is used in another select, disable/hide it
            const isUsedElsewhere = usedChoices.includes(option.value) && option.value !== currentChoice
            option.disabled = isUsedElsewhere
            option.hidden = isUsedElsewhere
        })
    })
}

// Event listener for disablement
selects.forEach (select => {
    select.addEventListener('change', disableUsedOptions)
})

// Initial disablement
disableUsedOptions()