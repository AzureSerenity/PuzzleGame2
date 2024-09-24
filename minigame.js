let currentAnswer = '';
let currentIndex = -1;
let currentOverlayDiv = null;

function showPopup(question, answer, index, imageUrl = '') {
    currentAnswer = answer.replace(/\s+/g, '').toUpperCase();
    currentIndex = index;
    currentOverlayDiv = document.querySelectorAll('.overlay div')[index];
    
    const popup = document.getElementById('popup');
    const questionElement = document.getElementById('question');
    const questionImage = document.getElementById('question-image');
    
    questionElement.innerHTML = question;

    if (imageUrl) {
        questionImage.src = imageUrl;
        questionImage.style.display = 'block'; 
    } else {
        questionImage.style.display = 'none'; 
    }

    const answerField = document.getElementById('answer-field');
    answerField.innerHTML = '';
    
    //Scan for each characters in the answer
    for (let i = 0; i < answer.length; i++) {
        const char = answer[i];
        
        //Add a space in the line if the answer has a line
        if (char === ' ') {
            const space = document.createElement('div');
            space.style.width = '40px'; 
            answerField.appendChild(space);
        } else {
            //Create underlines
            const span = document.createElement('span');
            span.textContent = '_';
            span.setAttribute('data-index', i);
            answerField.appendChild(span);
        }
    }
    
    popup.style.display = 'block';
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    const spans = document.querySelectorAll('#answer-field span');
    if (event.key === 'Enter') {
        checkAnswer();
    } else if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        for (let span of spans) {
            if (span.textContent === '_') {
                span.textContent = event.key.toUpperCase();
                break;
            }
        }
    } else if (event.key === 'Backspace') {
        for (let i = spans.length - 1; i >= 0; i--) {
            if (spans[i].textContent !== '_') {
                spans[i].textContent = '_';
                break;
            }
        }
    }
}

function checkAnswer() {
    const userAnswer = Array.from(document.querySelectorAll('#answer-field span'))
        .map(span => span.textContent)
        .join('');

    if (userAnswer === currentAnswer) {
        currentOverlayDiv.classList.add('revealed');
        currentOverlayDiv.classList.remove('incorrect');
        alert('Đáp án chính xác!');
        
        //Update correct answers into the left-list
        updateCorrectAnswer(currentAnswer);
    } else {
        currentOverlayDiv.classList.add('incorrect');
        alert('Đáp án sai!');
    }
    closePopup();
}

function updateCorrectAnswer(answer) {
    const correctAnswersList = document.getElementById('correct-answers-list');
    const listItem = document.createElement('li');
    
    listItem.textContent = `${answer}`;
    
    listItem.style.color = '#28a745';  
    
    correctAnswersList.appendChild(listItem);
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.removeEventListener('keydown', handleKeyPress);
}

document.addEventListener('DOMContentLoaded', function() {
    const resultField = document.getElementById('result-field');
    const words = ['TRI TUE', 'NHAN TAO'];
    
    words.forEach((word, wordIndex) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'answer-row';
        
        word.split('').forEach(char => {
            if (char === ' ') {
                wordDiv.appendChild(document.createTextNode(' '));
            } else {
                const charDiv = document.createElement('div');
                charDiv.className = 'guess-char';
                charDiv.setAttribute('contenteditable', 'true');
                charDiv.setAttribute('maxlength', '1');
                wordDiv.appendChild(charDiv);
            }
        });
        
        resultField.appendChild(wordDiv);
    });

    setupInputHandling();
});

function setupInputHandling() {
    const guessChars = document.querySelectorAll('.guess-char');
    guessChars.forEach((char, index) => {
        char.addEventListener('input', function(e) {
            if (char.innerText.length > 1) {
                char.innerText = char.innerText.slice(0, 1).toUpperCase();
            }
            if (char.innerText.length === 1) {
                const nextChar = guessChars[index + 1];
                if (nextChar) {
                    nextChar.focus();
                }
            }
        });
        char.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && char.innerText === '') {
                e.preventDefault();
                const prevChar = guessChars[index - 1];
                if (prevChar) {
                    prevChar.focus();
                    prevChar.innerText = '';
                }
            }
        });
    });
}

function checkResult() {
    const answer = 'TRITUENHANTAO';
    let userGuess = '';
    document.querySelectorAll('.guess-char').forEach(function(char) {
        userGuess += char.innerText.toUpperCase();
    });
    if (userGuess === answer) {
        alert('Chính xác!');
        revealAllOverlays();
    } else {
        alert('Sai rồi, thử lại nhé!');
    }
}

function revealAllOverlays() {
    document.querySelectorAll('.overlay-item').forEach(function(item) {
        item.style.backgroundColor = 'transparent';
        item.style.pointerEvents = 'none';
    });
}