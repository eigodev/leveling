const content = document.getElementById('content')
const numberExercise = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const textExercise = [
    "One", "Two", "Three", "Four", "Five", 
    "Six", "Seven", "Eight", "Nine", "Ten"
]

const headline = [
    "Listen to the people talking.",
    "Complete each conversation.",
    "Complete this story.",
    "Read Brenda's composition.",
    "John is giving a guest a tour of his office.",
    "Check the correct words to complete the sentences.",
    "Complete this conversation.",
    "Match the answers with the questions.",
    "Check the correct word or phrase",
    "Analyze the words given",
]

const guideline = [
    "Check the correct answers.",
    "Use the correct form of be or do.",
    "Use the words from the box.",
    "Then circle T (true) or F (false).",
    "Complete the sentences.",
    "",
    "Use the past tense of the verbs given.",
    "",
    "Complete each conversation.",
    "Arrange these words to make sentences.",
]

/* EXERCISES */
for (const index in numberExercise){
    // Variables
    const divExercise = document.createElement('div')

    // Attributes
    setClass(divExercise, 'exercise')
    setAttributeID(divExercise, 'id', `exercise-${textExercise[index]}`)

    // Appending
    appendChilds(content, divExercise)
}

/* ITEMS */
for (const index in numberExercise){
    // Variables
    const divExercise = document.querySelectorAll('#content .exercise')
    const itemExercise = document.createElement('div')
    
    // Attributes
    setClass(itemExercise, 'item')
    
    // Appending
    appendChilds(divExercise[index], itemExercise)
}

/* SUBITEMS */
for (const index in numberExercise){
    // Variables
    const itemExercise = document.querySelectorAll('.exercise .item')
    const number = document.createElement('p')
    const headlineText = document.createElement('p')
    const guidelineText = document.createElement('p')
    const divider = document.createElement('hr')
    
    // Attributes
    setClass(number, 'number')
    setClass(headlineText, 'headline')
    setClass(guidelineText, 'guideline')
    
    // Content
    number.innerText = numberExercise[index]
    headlineText.innerText = headline[index]
    guidelineText.innerText = guideline[index] 
    
    // Appending
    itemExercise[index].appendChild(number)
    itemExercise[index].appendChild(headlineText)
    itemExercise[index].appendChild(guidelineText)
    itemExercise[index].appendChild(divider)
}

document.querySelectorAll('.guideline').forEach((tag)=>{
    if (!tag.textContent.trim()){
        tag.remove()
    }
})