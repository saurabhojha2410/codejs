const categories = data[0].categories;
const urlParams = new URLSearchParams(window.location.search);
const categoryName = urlParams.get('category');

if (categories[categoryName]) {
    const words = categories[categoryName];
    const availableWords = words.filter(wordObj => !wordObj.selected);

    if (availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWordObj = availableWords[randomIndex];
        selectedWordObj.selected = true;
        const word = selectedWordObj.name.toUpperCase();

        let wrongAttempts = 0;
        const maxWrongAttempts = 4;
        let guessedWord = Array(word.length).fill('_');

        document.getElementById('category-name').innerText = `${categoryName}`;
        displayWordBlanks();
        createKeyboard();

        function displayWordBlanks() {
            const wordBlanksContainer = document.getElementById('word-blanks');
            wordBlanksContainer.innerHTML = ''; // Clear previous blanks

            guessedWord.forEach((letter, index) => {
                const span = document.createElement('span');
                span.classList.add('blank');
                if (letter !== '_') {
                    span.classList.add('filled');
                    span.innerText = letter;
                }
                wordBlanksContainer.appendChild(span);
            });
        }

        function createKeyboard() {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const keyboard = document.getElementById('keyboard');
            alphabet.split('').forEach(letter => {
                const button = document.createElement('button');
                button.innerText = letter;
                button.addEventListener('click', () => guessLetter(letter, button));
                keyboard.appendChild(button);
            });
        }

        function guessLetter(letter, button) {
            let correctGuess = false;
            for (let i = 0; i < word.length; i++) {
                if (word[i] === letter) {
                    guessedWord[i] = letter;
                    correctGuess = true;
                }
            }
            button.disabled = true;
            button.classList.add(correctGuess ? 'correct' : 'incorrect');
            displayWordBlanks();

            if (!correctGuess) {
                wrongAttempts++;
                if (wrongAttempts >= maxWrongAttempts) {
                    guessedWord = word.split('');
                    displayWordBlanks();
                    showEndPopup('lose');
                    disableAllButtons();
                }
            } else if (!guessedWord.includes('_')) {
                showEndPopup('win');
                disableAllButtons();
            }
        }

        function disableAllButtons() {
            const buttons = document.getElementById('keyboard').getElementsByTagName('button');
            for (const button of buttons) {
                button.disabled = true;
            }
        }

        function showEndPopup(result) {
            const popup = document.createElement('div');
            popup.id = 'gamePopup'; // Apply the popup ID from CSS
            popup.className = 'popup'; // Apply the popup class
        
            // Create the popup content
            const popupContent = document.createElement('div');
            popupContent.className = 'popup-content';
        
            // Add the message (win or lose)
            const message = document.createElement('h2');
            message.innerHTML = result === 'win' ? 'YOU WIN !' : 'YOU LOSE!';
            popupContent.appendChild(message);
        
            // Create and append the buttons
            const quitButton = document.createElement('button');
            quitButton.id = 'quitBtn'; // Apply button ID
            quitButton.className = 'popup-btn'; // Apply a common class for styling
            quitButton.innerText = 'Quit Game';
            quitButton.onclick = quitGame; // Add the event listener for quit game action
        
            const changeCategoryButton = document.createElement('button');
            changeCategoryButton.id = 'changeCategoryBtn'; // Apply button ID
            changeCategoryButton.className = 'popup-btn'; // Apply a common class for styling
            changeCategoryButton.innerText = 'Change Category';
            changeCategoryButton.onclick = changeCategory; // Add event listener for change category action
        
            const replayButton = document.createElement('button');
            replayButton.id = 'replayBtn'; // Apply button ID
            replayButton.className = 'popup-btn'; // Apply a common class for styling
            replayButton.innerText = 'Replay';
            replayButton.onclick = replayGame; // Add event listener for replay action
        
            // Append the buttons to the popup content
            popupContent.appendChild(quitButton);
            popupContent.appendChild(changeCategoryButton);
            popupContent.appendChild(replayButton);
        
            // Append the popup content to the popup
            popup.appendChild(popupContent);
        
            // Append the popup to the body and make it visible
            document.body.appendChild(popup);
            popup.style.display = 'block';
        }
        

        function quitGame() {
            window.location.href = 'howToplay.html'; // Change this to your home page or desired page
        }

        function changeCategory() {
            window.location.href = 'category.html'; // Change to your category page
        }

        function replayGame() {
            window.location.reload();
        }

    } else {
        document.getElementById('message').innerText = "No words left in this category!";
    }
} else {
    document.getElementById('message').innerText = "Category not found!";
}
