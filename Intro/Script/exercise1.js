const exerciseOne = document.getElementById('exercise-One')

/* SUBITEM */
for (let index = 0; index < 2; index++){
    const subitem = createTag('div')
    setClass(subitem, 'subitem')
    appendChilds(exerciseOne, subitem)
}

const subitems = exerciseOne.getElementsByClassName('subitem');
const letterContent = ['A', 'B']; // expected labels for each letter slot
const headlineContent = [
    'Now, listen to Victor and Luisa Talking.',
    'Now, listen to Eric and Michael talking'
];
const questionContent = [
    [
        'The woman spells her name _.',
        "Her name is _."
    ],
    [
        "There's no _ in the kitchen.",
        'Michael\'s apartment doesn\'t have _.'
    ]
];
const questionDropdownOptions = [
    [
        ['L-O-U-I-S-A', 'L-U-I-S-A', 'L-U-S-I-A'],
        ['Spanish', 'American', 'Italian']
    ],
    [
        ['stove', 'microwave oven', 'refrigerator'],
        ['a view', 'a yard', 'a nice kitchen']
    ]
];
const AUDIO_SOURCE = 'Audios/IC5_Intro_T1-8A_Track09.mp3';
const audioSegments = [
    { start: 38, end: 70 },
    { start: 101, end: 138 }
];
const audioControllers = [];

const audioIconBlueprint = [
    { id: 'play', src: 'Images/Icons/play.png', alt: 'Play audio', refKey: 'play' },
    { id: 'pause', src: 'Images/Icons/pause.png', alt: 'Pause audio', hidden: true, refKey: 'pause' },
    { id: 'divider', src: 'Images/Icons/divider.png', alt: 'divider' },
    { id: 'rewind', src: 'Images/Icons/rewind.png', alt: 'Rewind audio', refKey: 'rewind' },
    { id: 'fastForward', src: 'Images/Icons/fastForward.png', alt: 'Fast forward audio', refKey: 'fastForward' },
    { id: 'divider', src: 'Images/Icons/divider.png', alt: 'divider' },
    { id: 'stop', src: 'Images/Icons/stop.png', alt: 'Stop audio', refKey: 'stop' }
];

for (let index = 0; index < subitems.length; index++) {
    // Create <p> called letter
    const letter = createTag('p');
    setClass(letter, 'letter');
    setContent(letter, letterContent[index] ?? '');
    appendChilds(subitems[index], letter);

    // Create <p> called headline
    const headline = createTag('p');
    setClass(headline, 'headline');
    setContent(headline, headlineContent[index] ?? '');
    appendChilds(subitems[index], headline);

    // Create <div> called audioplayer
    const audioplayer = createTag('div');
    setClass(audioplayer, 'audioPlayer');
    appendChilds(subitems[index], audioplayer);

    const audioIcons = {};
    audioIconBlueprint.forEach((iconConfig) => {
        const icon = createAudioIcon(iconConfig);
        appendChilds(audioplayer, icon);

        if (iconConfig?.refKey) {
            audioIcons[iconConfig.refKey] = icon;
        }
    });

    const audioElement = createAudioElement(AUDIO_SOURCE);
    const segment = audioSegments[index] ?? null;
    setupAudioControls({
        playIcon: audioIcons.play,
        pauseIcon: audioIcons.pause,
        stopIcon: audioIcons.stop,
        rewindIcon: audioIcons.rewind,
        fastForwardIcon: audioIcons.fastForward,
        audioElement,
        segmentStart: segment?.start ?? 0,
        segmentEnd: segment?.end ?? Infinity
    });

    // Create <div> called question
    const question = createTag('div');
    setClass(question, 'question');
    appendChilds(subitems[index], question);

    const questions = questionContent[index] ?? [];
    const questionOptions = questionDropdownOptions[index] ?? [];
    questions.forEach((questionText, questionIndex) => {
        const questionRow = createTag('div');
        setClass(questionRow, 'question-row');

        const numberParagraph = createTag('p');
        setClass(numberParagraph, 'number');
        setContent(numberParagraph, `${questionIndex + 1}.`);
        appendChilds(questionRow, numberParagraph);

        const textParagraph = createTag('p');
        setClass(textParagraph, 'question-text');
        const questionTextFragment = buildQuestionTextFragment(
            questionText,
            questionOptions[questionIndex] ?? []
        );
        textParagraph.appendChild(questionTextFragment);
        appendChilds(questionRow, textParagraph);

        appendChilds(question, questionRow);
    });
}

/* EVENT LISTENER – track correct items for Exercise 1 */
// Follows the model in the picture: when the "Check answers" button is clicked,
// we clear the console, calculate how many items are correct in Exercise 1,
// and store that result in `studentChoices.choicesOne` plus rich history.
window.addEventListener('load', () => {
    const button = document.getElementById('check-answers');
    if (!button || !window.studentChoices || !window.expectedAnswers) return;

        button.addEventListener('click', () => {
        let items = 0;
        let score = 0;
        const correctAnswersChosen = [];
        const wrongAnswersChosen = [];
        const details = [];

        // Concept / skill mapping for each question in Exercise 1
        // Index 0 -> Exercise A, number 1
        // Index 1 -> Exercise A, number 2
        // Index 2 -> Exercise B, number 1
        // Index 3 -> Exercise B, number 2
        const skillMap = [
            {
                code: 'A1',
                area: 'Unit 6'
            },
            {
                code: 'A2',
                area: 'Unit 6'
            },
            {
                code: 'B1',
                area: 'Unit 7'
            },
            {
                code: 'B2',
                area: 'Unit 7'
            }
        ];

        const selectsOne = document.querySelectorAll(
            '#exercise-One select.question-dropdown'
        );
        const answersOne = window.expectedAnswers.exercise1.dropdowns ?? [];
        const totalQuestions = answersOne.length;

        selectsOne.forEach((select, index) => {
            const userAnswer = select.value;
            const expectedAnswer = answersOne[index];       
            const isCorrect = userAnswer === expectedAnswer;
            const skillInfo = skillMap[index] ?? null;

            if (isCorrect) {
                items++;
                score++;
                // Store the actual correct answer string, following the picture model
                correctAnswersChosen.push(expectedAnswer);
            } else {
                wrongAnswersChosen.push(userAnswer || null);
            }

            details.push({
                skillArea: skillInfo?.area ?? null,
                userAnswer: userAnswer || null,
                expectedAnswer,
                isCorrect
            });
        });

        const finalScore = (correct, total) =>
            total > 0 ? (correct / total) * 100 : 0;
        const percentage = Math.round(finalScore(score, totalQuestions));

        // For Exercise 1 we keep the array as the list of correct answers
        // e.g. ['in a gym', 'go jogging', ...]
        window.studentChoices.choicesOne = correctAnswersChosen;

        // Figure out which skill areas need review (any area with at least one wrong answer)
        const skillsToReview = Array.from(
            new Set(
                details
                    .filter((item) => item.isCorrect === false && item.skillArea)
                    .map((item) => item.skillArea)
            )
        );

        // Additionally, keep a compact history entry for Exercise 1
        // with only the information the teacher needs to review.
        window.studentChoices.choicesOneHistory.push({
            wrong: totalQuestions - items,
            wrongAnswers: wrongAnswersChosen,
            details,
            skillsToReview
        });
    });
});

function createAudioIcon (config) {
    const icon = createTag('img');
    setClass(icon, 'icon');
    setAttributeID(icon, 'id', config.id);
    icon.src = config.src;
    icon.alt = config.alt;

    if (config.hidden) {
        icon.style.display = 'none';
    }

    return icon;
}

function buildQuestionTextFragment (questionText, dropdownOptions = []) {
    const fragment = document.createDocumentFragment();
    const parts = questionText.split('_');

    parts.forEach((part, partIndex) => {
        if (part) {
            fragment.appendChild(document.createTextNode(part));
        }

        if (partIndex !== parts.length - 1) {
            const capitalise = shouldCapitaliseDropdown(part, partIndex);
            fragment.appendChild(
                createQuestionDropdown(dropdownOptions, capitalise)
            );
        }
    });

    return fragment;
}

function createQuestionDropdown (options = [], capitalise = false) {
    const select = createTag('select');
    setClass(select, 'question-dropdown');

    const placeholder = createTag('option');
    placeholder.value = '';
    placeholder.textContent = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    appendChilds(select, placeholder);

    const availableOptions = options.length ? options : ['N/A'];

    availableOptions.forEach((optionValue) => {
        const option = createTag('option');
        option.value = optionValue;
        option.textContent = formatDropdownLabel(optionValue, capitalise);
        appendChilds(select, option);
    });

    return select;
}

function createAudioElement (source) {
    const audio = new Audio(source);
    audio.preload = 'auto';
    return audio;
}

function registerAudioController (controller) {
    audioControllers.push(controller);
}

function stopOtherControllers (currentController) {
    audioControllers.forEach((controller) => {
        if (controller !== currentController) {
            controller.forceStop();
        }
    });
}

function setupAudioControls ({
    playIcon,
    pauseIcon,
    stopIcon,
    rewindIcon,
    fastForwardIcon,
    audioElement,
    segmentStart = 0,
    segmentEnd = Infinity
}) {
    if (!playIcon || !pauseIcon || !audioElement) return;

    let timeUpdateHandler = null;

    const clampTimeToSegment = (time) =>
        Math.min(segmentEnd, Math.max(segmentStart, time));

    const setAudioTime = (time) => {
        audioElement.currentTime = clampTimeToSegment(time);
    };

    const showPlay = () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    };

    const showPause = () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    };

    const cleanupTimeUpdate = () => {
        if (timeUpdateHandler) {
            audioElement.removeEventListener('timeupdate', timeUpdateHandler);
            timeUpdateHandler = null;
        }
    };

    const stopPlayback = () => {
        audioElement.pause();
        setAudioTime(segmentStart);
        cleanupTimeUpdate();
        showPlay();
    };

    const controller = {
        forceStop: () => {
            stopPlayback();
        }
    };

    const monitorSegment = () => {
        cleanupTimeUpdate();
        timeUpdateHandler = () => {
            if (audioElement.currentTime >= segmentEnd) {
                stopPlayback();
            }
        };
        audioElement.addEventListener('timeupdate', timeUpdateHandler);
    };

    const ensureWithinSegment = () => {
        if (
            audioElement.currentTime < segmentStart ||
            audioElement.currentTime >= segmentEnd
        ) {
            setAudioTime(segmentStart);
        }
    };

    const startPlayback = () => {
        stopOtherControllers(controller);
        ensureWithinSegment();
        audioElement.play()
            .then(() => {
                showPause();
                monitorSegment();
            })
            .catch(() => {
                stopPlayback();
            });
    };

    const pausePlayback = () => {
        audioElement.pause();
        cleanupTimeUpdate();
        showPlay();
    };

    const adjustPlaybackTime = (deltaSeconds) => {
        const targetTime = audioElement.currentTime + deltaSeconds;
        setAudioTime(targetTime);
    };

    playIcon.addEventListener('click', startPlayback);
    pauseIcon.addEventListener('click', pausePlayback);
    if (stopIcon) {
        stopIcon.addEventListener('click', stopPlayback);
    }
    if (rewindIcon) {
        rewindIcon.addEventListener('click', () => adjustPlaybackTime(-5));
    }
    if (fastForwardIcon) {
        fastForwardIcon.addEventListener('click', () => adjustPlaybackTime(5));
    }

    audioElement.addEventListener('ended', stopPlayback);
    registerAudioController(controller);
}