/* Intro A */
const buttonIntroA = document.getElementById('introA');
buttonIntroA.addEventListener('click', () => {
    window.open ('Intro/index.html', '_blank');
});

buttonIntroA.addEventListener('auxclick', (event) => {
    event.preventDefault();
    if (event.button === 1) {
        window.open ('Intro/index.html', '_blank');
    }
});

/* Level 1A */
const buttonLevelOneA = document.getElementById('levelOneA');
buttonLevelOneA.addEventListener('click', () => {
    window.open ('Level 1/index.html', '_blank');
});

buttonLevelOneA.addEventListener('auxclick', (event) => {
    event.preventDefault();
    if (event.button === 1) {
        window.open ('Level 1/index.html', '_blank');
    }
});

/* Level 2A */
const buttonLevelTwoA = document.getElementById('levelTwoA');
buttonLevelTwoA.addEventListener('click', () => {
    window.open ('Level 2/index.html', '_blank');
});

buttonLevelTwoA.addEventListener('auxclick', (event) => {
    event.preventDefault();
    if (event.button === 1) {
        window.open ('Level 2/index.html', '_blank');
    }
});

/* Level 3A */
const buttonLevelThreeA = document.getElementById('levelThreeA');
buttonLevelThreeA.addEventListener('click', () => {
    window.open ('Level 3/index.html', '_blank');
});

buttonLevelThreeA.addEventListener('auxclick', (event) => {
    event.preventDefault();
    if (event.button === 1) {
        window.open ('Level 3/index.html', '_blank');
    }
});