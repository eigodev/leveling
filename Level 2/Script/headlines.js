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

// Show exercise content by default; clicking the number hides/shows with animation.
window.addEventListener('load', () => {
    const exercises = document.querySelectorAll('#content .exercise')

    exercises.forEach((exercise) => {
        // Header item that contains the main number, headline, guideline and <hr>
        const headerItem = exercise.querySelector('.item')
        if (!headerItem) return

        const numberEl = headerItem.querySelector('.number')
        if (!numberEl) return

        // Create a wrapper for all content below the header so we can animate it
        const detailsWrapper = document.createElement('div')
        detailsWrapper.classList.add('exercise-details', 'expanded') // shown by default

        // Move all siblings after the header item into the wrapper
        let sibling = headerItem.nextElementSibling
        while (sibling) {
            const next = sibling.nextElementSibling
            detailsWrapper.appendChild(sibling)
            sibling = next
        }

        // If there is nothing below the header, nothing to toggle
        if (!detailsWrapper.children.length) return

        exercise.appendChild(detailsWrapper)

        // Exercises are visible by default. Toggle to hide on click.
        numberEl.style.cursor = 'pointer'

        numberEl.addEventListener('click', () => {
            detailsWrapper.classList.toggle('expanded')
        })
    })
})