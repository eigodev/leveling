// Shared scoring & popup logic for the Intro level
// Exposes a single function: window.calculateIntroOverallScore(results)
// where `results` is an array of `{ correct, total }` objects returned
// by each `checkExerciseX()` function.

(function () {
    function getIntroScoreFeedback (percentage) {
        if (percentage < 20) {
            return "There's no way you can jump to the next level yet – let's review the basics and try again!";
        } else if (percentage < 40) {
            return " You're starting to find your way. Go back, practice a little more, and come back stronger!";
        } else if (percentage < 60) {
            return " Now we're talking! You're getting better. A bit more practice and you'll be ready.";
        } else if (percentage < 80) {
            return " That's a solid average – you're almost there! Review this level once more.";
        } else if (percentage < 100) {
            return " Great job! You're ready to think about the next level, but review a few tricky points before you go on.";
        } else {
            return " Perfect score! Absolutely amazing work.";
        }
    }

    function calculateIntroOverallScore (results = []) {
        const safeResults = Array.isArray(results) ? results : [];

        const totalCorrect = safeResults.reduce(
            (sum, result) => sum + (result?.correct ?? 0),
            0
        );
        const totalQuestions = safeResults.reduce(
            (sum, result) => sum + (result?.total ?? 0),
            0
        );

        const percentage =
            totalQuestions > 0
                ? Math.round((totalCorrect / totalQuestions) * 100)
                : 0;

        const scoreMessage = `You've scored ${totalCorrect} of ${totalQuestions} correct. Your rating is ${percentage}%.`;
        const feedbackMessage = getIntroScoreFeedback(percentage);
        const passed = percentage >= 80;

        if (window.studentChoices) {
            if (!Array.isArray(window.studentChoices.overallHistory)) {
                window.studentChoices.overallHistory = [];
            }
            window.studentChoices.overallHistory.push({
                timestamp: new Date().toISOString(),
                totalCorrect,
                totalQuestions,
                percentage,
                passed
            });
        }

        showResultPopup(scoreMessage, feedbackMessage, passed);
    }

    function showResultPopup (scoreMessage, feedbackMessage, success) {
        const popup = document.getElementById('popup-score');
        if (!popup) {
            // Fallback if popup container is missing
            window.alert(`${scoreMessage} ${feedbackMessage}`);
            return;
        }

        popup.innerHTML = '';

        const close = document.createElement('span');
        close.textContent = '×';
        close.classList.add('popup-close');
        close.addEventListener('click', () => {
            popup.style.display = 'none';
            resetAllExercises();
        });

        const scoreText = document.createElement('p');
        scoreText.id = 'score';
        scoreText.textContent = scoreMessage;

        const feedbackText = document.createElement('h1');
        feedbackText.id = 'feedback';
        feedbackText.textContent = feedbackMessage;

        popup.appendChild(close);
        // First line: feedback message
        popup.appendChild(feedbackText);
        // Second line: the numeric score
        popup.appendChild(scoreText);

        popup.style.display = 'flex';
    }

    function resetAllExercises () {
        // Reset all dropdowns to their placeholder option
        const allSelects = document.querySelectorAll(
            'select.question-dropdown, select.text-dropdown'
        );
        allSelects.forEach((select) => {
            if (select.options && select.options.length > 0) {
                select.selectedIndex = 0;
            } else {
                select.value = '';
            }
        });

        // Restore unique "word box" behaviour for Exercise 5
        if (typeof window.resetExerciseFiveDropdowns === 'function') {
            window.resetExerciseFiveDropdowns();
        }

        // Clear typed answers in Exercise 10
        const sentenceInputs = document.querySelectorAll(
            '#exercise-Ten input.sentence-input'
        );
        sentenceInputs.forEach((input) => {
            input.value = '';
        });

        // Clear typed questions in Exercise 7 and 8
        const questionInputsSeven = document.querySelectorAll(
            '#exercise-Seven input.question-input'
        );
        questionInputsSeven.forEach((input) => {
            input.value = '';
        });

        const questionInputsEight = document.querySelectorAll(
            '#exercise-Eight input.question-input'
        );
        questionInputsEight.forEach((input) => {
            input.value = '';
        });

        // Clear connections in Exercise 3 (possessive matching)
        if (typeof window.resetExerciseThreeConnections === 'function') {
            window.resetExerciseThreeConnections();
        }

        // Clear connections in Exercise 8 (question/answer matching)
        if (typeof window.resetExerciseEightConnections === 'function') {
            window.resetExerciseEightConnections();
        } else if (
            typeof connectionState !== 'undefined' &&
            connectionState.questionConnections &&
            connectionState.answerConnections
        ) {
            connectionState.questionConnections.forEach(({ line }) => {
                if (line && typeof line.remove === 'function') {
                    line.remove();
                }
            });
            connectionState.questionConnections.clear();
            connectionState.answerConnections.clear();
        }
    }

    // Expose the main entry point globally
    window.calculateIntroOverallScore = calculateIntroOverallScore;
})();

