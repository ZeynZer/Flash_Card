let flashcards = [];
let currentIndex = 0;
let weights = [];
let progress = 0; // Stocke la progression en pourcentage
let totalLearned = 0; // Nombre de cartes bien apprises
let totalCards = 0; // Nombre total de cartes ajoutées


document.addEventListener("DOMContentLoaded", () => {
    updateCard();
});



function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    let themeButton = document.querySelector(".toggle-theme");
    if (document.body.classList.contains("dark-mode")) {
        themeButton.innerText = "☀️ Mode clair";
    } else {
        themeButton.innerText = "🌙 Mode sombre";
    }
}

function flipCard() {
    document.querySelector(".card").classList.toggle("flipped");
}

function updateProgress() {
    if (totalCards > 0) {
        progress = Math.min(100, (totalLearned / totalCards) * 100);
    } else {
        progress = 0;
    }
    document.getElementById("progress-bar").style.width = progress + "%";
}


function updateCard() {
    if (flashcards.length > 0) {
        document.getElementById("question").innerText = flashcards[currentIndex].question;
        document.getElementById("answer").innerText = flashcards[currentIndex].answer;
    } else {
        document.getElementById("question").innerText = "Ajoute une carte \n Younes !";
        document.getElementById("answer").innerText = "";
    }
}

function addCard() {
    let newQuestion = document.getElementById("newQuestion").value.trim();
    let newAnswer = document.getElementById("newAnswer").value.trim();
    
    if (newQuestion && newAnswer) {
        flashcards.push({ question: newQuestion, answer: newAnswer });
        weights.push(1);
        totalCards = flashcards.length; // Met à jour le total
        document.getElementById("newQuestion").value = "";
        document.getElementById("newAnswer").value = "";
        
        if (flashcards.length === 1) {
            updateCard();
        }
        updateProgress();
    }
}


function getRandomCard() {
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let randomValue = Math.random() * totalWeight;
    let sum = 0;
    
    for (let i = 0; i < flashcards.length; i++) {
        sum += weights[i];
        if (randomValue < sum) return i;
    }
    return 0;
}

function nextCard() {
    if (flashcards.length > 0) {
        currentIndex = getRandomCard();
        updateCard();
    }
}

function prevCard() {
    if (flashcards.length > 0) {
        currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
        updateCard();
    }
}

function markCorrect() {
    if (flashcards.length > 0) {
        if (weights[currentIndex] > 1) {
            totalLearned++; // Si la carte avait un poids élevé, on la considère comme apprise
        } else if (weights[currentIndex] === 1 && totalLearned < totalCards) {
            totalLearned++; // Même si elle n’a jamais été oubliée, elle est comptée
        }

        weights[currentIndex] = Math.max(weights[currentIndex] - 1, 1);
        updateProgress();
        nextCard();
    }
}


function markForgotten() {
    if (flashcards.length > 0) {
        weights[currentIndex] += 2;
        totalLearned = Math.max(0, totalLearned - 1); // Réduit légèrement le progrès
        updateProgress();
        nextCard();
    }
}
