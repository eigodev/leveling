/* TAG creation */
function createTag (string){
    return document.createElement(string)
}

function setClass (tag, classNames){
    if (!tag || !classNames) {
        return tag
    }

    const tokens = Array.isArray(classNames)
        ? classNames
        : String(classNames).split(' ')

    tokens
        .map((token) => token && token.trim())
        .filter(Boolean)
        .forEach((token) => tag.classList.add(token))

    return tag
}

function setAttributeID (tag, id, attributes){
    return tag.setAttribute(id, attributes)
}

function setContent (tag, string){
    return tag.textContent = string
}

function appendChilds (parent, child){
    return parent.appendChild(child)
}

/* Student tracking */
const studentChoices = {
    choicesOne: [],
    choicesOneHistory: [],
    choicesTwo: [],
    choicesTwoHistory: [],
    choicesThree: [],
    choicesThreeHistory: [],
    choicesFour: [],
    choicesFourHistory: [],
    choicesFive: [],
    choicesFiveHistory: [],
    choicesSix: [],
    choicesSixHistory: [],
    choicesSeven: [],
    choicesSevenHistory: [],
    choicesEight: [],
    choicesEightHistory: [],
    choicesNine: [],
    choicesNineHistory: [],
    choicesTen: [],
    choicesTenHistory: [],
    overallHistory: []
};

// Make available globally so any exercise script can read/update it.
window.studentChoices = studentChoices;