// Collect basic student information (name) when the page finishes loading.
// The name is stored on `window.studentInfo.name` so other scripts
// (for example, the PDF report) can use it later.
// Uses the same popup container / style as the "Check answers" result popup.

(function () {
    window.studentInfo = window.studentInfo || {};

    function showNamePopup () {
        // If a name is already set, don't ask again.
        if (window.studentInfo.name) return;

        const popupInfo = document.getElementById('popup-info');
        if (!popupInfo) return;

        popupInfo.innerHTML = '';

        const close = document.createElement('span');
        close.textContent = '×';
        close.classList.add('popup-close');
        close.addEventListener('click', () => {
            popupInfo.style.display = 'none';
        });

        const title = document.createElement('h1');
        title.textContent = 'There you are! Keep moving forward!';

        const message = document.createElement('p');
        message.id = 'message';
        message.textContent = 'Last time, I swear! We\'re gonna print your info on the report:';

        const form = document.createElement('div');
        form.classList.add('form');

        const createField = (labelText, id, type = 'text', parent = form) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('field');

            const label = document.createElement('span');
            label.textContent = labelText;
            label.classList.add('label');

            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.classList.add('input');

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            parent.appendChild(wrapper);

            return { input, wrapper };
        };

        // First, last name and job on the first row
        // Create all fields in a single column, each with class "fields" and an ID matching the field (all lowercase, hyphenless).
        // Fields in order: First Name, Last Name, Job, Age, City, State, Relationship

        // Helper to create a labeled field with proper id/class
        function addField(labelText, id, type = 'text') {
            const wrapper = document.createElement('div');
            wrapper.classList.add('fields');
            wrapper.id = id;

            const label = document.createElement('span');
            label.textContent = labelText;
            label.classList.add('label');

            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.classList.add('input');

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            form.appendChild(wrapper);

            return { input, wrapper };
        }

        // All fields
        const { input: firstNameInput, wrapper: firstNameWrapper } = addField('First Name', 'first-name');
        const { input: lastNameInput, wrapper: lastNameWrapper } = addField('Last Name', 'last-name');
        const { input: jobInput, wrapper: jobWrapper } = addField('Job', 'job');
        const { input: ageInput, wrapper: ageWrapper } = addField('Age', 'age');
        const { input: cityInput, wrapper: cityWrapper } = addField('City', 'city');
        const { input: stateInput, wrapper: stateWrapper } = addField('State', 'state');
        const { input: relationshipInput, wrapper: relationshipWrapper } = addField('Relationship', 'relationship');

        // Age field: only 2 numeric characters
        ageInput.maxLength = 2;
        ageInput.inputMode = 'numeric';
        ageInput.addEventListener('input', () => {
            ageInput.value = ageInput.value.replace(/\D/g, '').slice(0, 2);
        });

        // State: 2 capital letters (Brazilian state or DF)
        stateInput.maxLength = 2;
        stateInput.addEventListener('input', () => {
            // Keep only letters, force uppercase, limit to 2 chars
            stateInput.value = stateInput.value
                .replace(/[^a-zA-Z]/g, '')
                .toUpperCase()
                .slice(0, 2);
        });

        // Helper: Abbreviation list (abbrs only)
        const brazilStates = [
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB",
            "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ];

        // Create the suggestion dropdown (simple abbr list)
        const stateList = document.createElement('div');
        stateList.style.position = 'absolute';
        stateList.style.background = '#f5f7ff';
        stateList.style.border = '1px solid #001bb1';
        stateList.style.borderRadius = '8px';
        stateList.style.padding = '7px 14px';
        stateList.style.display = 'none';
        stateList.style.zIndex = 1000;
        stateList.style.fontSize = '14px';
        stateList.style.boxShadow = '1px 2px 6px #90a0e0';
        stateList.style.maxHeight = '210px';
        stateList.style.overflowY = 'auto';
        stateList.tabIndex = -1; // so it can be focused if needed

        // Helper to (re)render the list according to what's typed
        function renderStateList () {
            const query = stateInput.value.trim().toUpperCase();

            // If there is something typed, show only abbreviations that start with it
            const filtered = query
                ? brazilStates.filter(abbr => abbr.startsWith(query))
                : brazilStates;

            stateList.innerHTML = filtered
                .map(abbr => `<div style="padding:2px 0;"><strong>${abbr}</strong></div>`)
                .join('');
        }

        // Initial full list
        renderStateList();

        // Attach below the input (inside wrapper)
        stateWrapper.style.position = 'relative';
        stateWrapper.appendChild(stateList);

        // Update suggestions every time the user types in the state input
        stateInput.addEventListener('input', renderStateList);

        // Show the state list on focus; hide on blur
        stateInput.addEventListener('focus', () => {
            stateList.style.display = 'block';
            // Position below stateInput
            const rect = stateInput.getBoundingClientRect();
            stateList.style.left = stateInput.offsetLeft + 'px';
            stateList.style.top = (stateInput.offsetTop + stateInput.offsetHeight + 5) + 'px';
        });
        stateInput.addEventListener('blur', () => {
            // Slight delay to allow copy/paste etc
            setTimeout(() => { stateList.style.display = 'none'; }, 120);
        });
        stateInput.addEventListener('keydown', e => {
            // Hide the list on Enter or Escape
            if (e.key === 'Enter' || e.key === 'Escape') {
                stateList.style.display = 'none';
            }
        });

        const button = document.createElement('button');
        button.id = 'confirm';
        button.textContent = 'OK';

        const confirmHandler = () => {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const ageRaw = ageInput.value.trim();
            const city = cityInput.value.trim();
            const stateRaw = stateInput.value.trim().toUpperCase();
            const job = jobInput.value.trim();
            const relationship = relationshipInput.value.trim();

            const age = ageRaw ? Number.parseInt(ageRaw, 10) : null;

            window.studentInfo.firstName = firstName || null;
            window.studentInfo.lastName = lastName || null;
            window.studentInfo.age = Number.isNaN(age) ? null : age;
            window.studentInfo.state = stateRaw || null;
            window.studentInfo.city = city || null;
            window.studentInfo.job = job || null;
            window.studentInfo.relationship = relationship || null;

            const fullName = [firstName, lastName].filter(Boolean).join(' ');
            window.studentInfo.name = fullName || null;

            popupInfo.style.display = 'none';
        };

        button.addEventListener('click', confirmHandler);

        [
            firstNameInput,
            lastNameInput,
            ageInput,
            cityInput,
            stateInput,
            jobInput,
            relationshipInput
        ].forEach((input) => {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    confirmHandler();
                }
            });
        });

        popupInfo.appendChild(close);
        popupInfo.appendChild(title);
        popupInfo.appendChild(message);
        popupInfo.appendChild(form);
        popupInfo.appendChild(button);

        popupInfo.style.display = 'flex';

        // Focus the first name input after it's visible
        setTimeout(() => {
            firstNameInput.focus();
        }, 0);
    }

    window.addEventListener('load', () => {
        // Give all other scripts a moment to finish building the page
        setTimeout(showNamePopup, 0);
    });
})();
