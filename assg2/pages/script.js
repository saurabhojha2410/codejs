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
            popup.innerHTML = `
                <div class="popup-content">
                    <h2>${result === 'win' ? 'Congratulations, you won!' : 'You lose! The word was: ' + word}</h2>
                    <button onclick="quitGame()">Quit Game</button>
                    <button onclick="changeCategory()">Change Category</button>
                    <button onclick="replayGame()">Replay</button>
                </div>
            `;
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
