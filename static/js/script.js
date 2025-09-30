let timer, timeLeft, paragraphText;
let currentIndex = 0;

// Predefined meaningful sentences
const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing speed improves with consistent practice every day.",
    "Flask is a lightweight Python web framework.",
    "Learning to type accurately is better than typing fast.",
    "Practice makes perfect when it comes to typing skills.",
    "Consistency is key to mastering any skill.",
    "Use meaningful text for a better typing experience.",
    "Typing tests help track speed and accuracy over time."
];

// Filter characters based on selected character types
function filterTextByCharacterType(text) {
    const lowercase = $('#lowercase').is(':checked');
    const uppercase = $('#uppercase').is(':checked');
    const numeric = $('#numeric').is(':checked');
    const alphanumeric = $('#alphanumeric').is(':checked');
    
    // If no filters are selected, return original text
    if (!lowercase && !uppercase && !numeric && !alphanumeric) {
        return text;
    }
    
    let filteredText = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (lowercase && /[a-z]/.test(char)) {
            filteredText += char;
        } else if (uppercase && /[A-Z]/.test(char)) {
            filteredText += char;
        } else if (numeric && /[0-9]/.test(char)) {
            filteredText += char;
        } else if (alphanumeric && /[a-zA-Z0-9]/.test(char)) {
            filteredText += char;
        } else if (!/[a-zA-Z0-9]/.test(char)) {
            // Always include spaces, punctuation, etc.
            filteredText += char;
        }
        // Skip characters that don't match any selected type
    }
    
    return filteredText;
}

// Generate a paragraph with n sentences
function generateParagraph(numSentences = 4) {
    let text = "";
    for (let i = 0; i < numSentences; i++) {
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        text += sentence + " ";
    }
    
    // Apply character type filtering
    return filterTextByCharacterType(text.trim());
}

// Alternative approach: Generate text based on character types
function generateCustomText(numSentences = 4) {
    const lowercase = $('#lowercase').is(':checked');
    const uppercase = $('#uppercase').is(':checked');
    const numeric = $('#numeric').is(':checked');
    const alphanumeric = $('#alphanumeric').is(':checked');
    
    // If specific character types are selected, generate custom text
    if (lowercase || uppercase || numeric || alphanumeric) {
        let characterSet = '';
        let customText = '';
        
        // Build character set based on selections
        if (lowercase) characterSet += 'abcdefghijklmnopqrstuvwxyz';
        if (uppercase) characterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (numeric) characterSet += '0123456789';
        
        // If alphanumeric is selected, include both letters and numbers
        if (alphanumeric && characterSet === '') {
            characterSet += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        }
        
        // If no character types selected, use default sentences
        if (characterSet === '') {
            return generateParagraph(numSentences);
        }
        
        // Generate custom text with words of random length
        const wordCount = numSentences * 8; // Approximate words for the paragraph
        
        for (let i = 0; i < wordCount; i++) {
            const wordLength = Math.floor(Math.random() * 6) + 3; // 3-8 characters
            let word = '';
            
            for (let j = 0; j < wordLength; j++) {
                word += characterSet[Math.floor(Math.random() * characterSet.length)];
            }
            
            customText += word + ' ';
            
            // Add punctuation occasionally
            if (Math.random() > 0.8 && i < wordCount - 1) {
                customText = customText.trim() + '. ';
            }
        }
        
        return customText.trim() + '.';
    }
    
    // Default to regular sentences if no specific character types selected
    return generateParagraph(numSentences);
}

// Render paragraph as individual <span> for each character
function renderParagraph() {
    let html = "";
    for (let i = 0; i < paragraphText.length; i++) {
        html += `<span id="char-${i}" class="dim">${paragraphText[i]}</span>`;
    }
    $('#paragraph').html(html);
    highlightCurrent();
}

// Highlight the current active character
function highlightCurrent() {
    $('#paragraph span').removeClass('active');
    if (currentIndex < paragraphText.length) {
        $(`#char-${currentIndex}`).removeClass('dim').addClass('active');
    }
}

// Start typing test
function startTest() {
    paragraphText = generateCustomText(4); // Use the new function
    renderParagraph();
    $('#typedText').prop('disabled', false).val('').focus();
    $('#submitBtn').prop('disabled', true);
    currentIndex = 0;

    let minutes = parseInt($('#minutes').val());
    timeLeft = minutes * 60;
    $('#timeLeft').text(timeLeft);
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    updateStats();
}

// Update timer countdown
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        finishTest();
        return;
    }
    timeLeft--;
    $('#timeLeft').text(timeLeft);
}

// Update stats (WPM, Accuracy) and highlight letters
function updateStats() {
    const typed = $('#typedText').val();
    let correctChars = 0;

    for (let i = 0; i < paragraphText.length; i++) {
        const span = $(`#char-${i}`);

        if (typed[i] == null) {
            span.removeClass('correct incorrect active').addClass('dim');
        } else if (typed[i] === paragraphText[i]) {
            span.addClass('correct').removeClass('incorrect dim');
            correctChars++;
        } else {
            span.addClass('incorrect').removeClass('correct dim');
        }
    }

    // Update current active character
    currentIndex = typed.length;
    highlightCurrent();

    // Calculate WPM
    const wordsTyped = typed.trim().split(/\s+/).length;
    const minutesTyped = (parseInt($('#minutes').val()) * 60 - timeLeft) / 60;
    const wpm = minutesTyped > 0 ? Math.round(wordsTyped / minutesTyped) : 0;

    // Calculate Accuracy
    const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100;

    // Update UI
    $('#wpm').text(wpm);
    $('#accuracy').text(accuracy);

    // Update form fields for submission
    $('#formWpm').val(wpm);
    $('#formAccuracy').val(accuracy);
}

// Finish test
function finishTest() {
    $('#typedText').prop('disabled', true);
    $('#submitBtn').prop('disabled', false);
}

// Event listeners
$('#startBtn').click(startTest);
$('#typedText').on('input', updateStats);