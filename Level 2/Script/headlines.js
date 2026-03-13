const content = document.getElementById('content')
const numberExercise = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const textExercise = [
    "One", "Two", "Three", "Four", "Five", 
    "Six", "Seven", "Eight", "Nine", "Ten"
]

const headline = [
    "Listen to the people talking.",
    "Check the correct words.",
    "Match the answers with the questions.",
    "Read each conversation.",
    "Complete the paragraph with words from the box.",
    "Check the correct word or phrase.",
    "Complete the conversation.",
    "Read about the Winter Carnival",
    "Check the correct word or phrase",
    "Select the incorrect word in each sentence"
]   

const guideline = [
    "Check the correct answers.",
    "Complete the conversation.",
    "",
    "Check the correct response",
    "One word will not be used.",
    "Complete each sentence",
    "Use the simple past or present perfect of the verbs",
    "Then, choose True or False",
    "Complete each sentence",
    "Type the correct word in the blank"
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