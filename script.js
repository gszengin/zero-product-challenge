function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to format terms correctly
function formatTerm(a, variable, b) {
    let formattedA = a === 1 ? variable : a === -1 ? `-${variable}` : `${a}${variable}`;
    if (b === 0) return formattedA; // If b = 0, return only ax
    return `(${formattedA} ${b < 0 ? '-' : '+'} ${Math.abs(b)})`;
}

function generateQuestion() {
    let caseType = getRandomInt(1, 5);
    let a, b, c, d;
    let variables = ['x', 'y', 'z', 'k', 'm', 'n', 't'];
    let variable = variables[getRandomInt(0, variables.length - 1)];
    let factor1, factor2;
    let zero1, zero2;

    switch (caseType) {
        case 1: // Monomial * One-step equation = 0
            a = getRandomInt(1, 5);
            b = getRandomInt(-10, 10);
            zero1 = 0;
            zero2 = -b;
            factor1 = formatTerm(a, variable, 0); // Ensure correct monomial format
            factor2 = formatTerm(1, variable, b); // Ensure correct binomial format
            break;

        case 2: // Monomial * Two-step equation = 0
            a = getRandomInt(1, 5);
            b = getRandomInt(1, 5);
            c = b * getRandomInt(-5, 5);
            zero1 = 0;
            zero2 = -c / b;
            factor1 = formatTerm(a, variable, 0);
            factor2 = formatTerm(b, variable, c);
            break;

        case 3: // One-step equation * One-step equation = 0
            a = getRandomInt(-10, 10);
            b = getRandomInt(-10, 10);
            zero1 = -a;
            zero2 = -b;
            factor1 = formatTerm(1, variable, a);
            factor2 = formatTerm(1, variable, b);
            break;

        case 4: // One-step equation * Two-step equation = 0
            a = getRandomInt(-10, 10);
            b = getRandomInt(1, 5);
            c = b * getRandomInt(-5, 5);
            zero1 = -a;
            zero2 = -c / b;
            factor1 = formatTerm(1, variable, a);
            factor2 = formatTerm(b, variable, c);
            break;

        case 5: // Two-step equation * Two-step equation = 0
            a = getRandomInt(1, 5);
            b = a * getRandomInt(-5, 5);
            c = getRandomInt(1, 5);
            d = c * getRandomInt(-5, 5);
            zero1 = -b / a;
            zero2 = -d / c;
            factor1 = formatTerm(a, variable, b);
            factor2 = formatTerm(c, variable, d);
            break;
    }

    // Store the question
    currentQuestion = {
        type: caseType,
        expression: `${factor1}${factor2} = 0`,
        factor1: factor1,
        factor2: factor2,
        zeros: [zero1, zero2]
    };

    // Display the question
    document.getElementById("question").innerHTML = `Find the zeros:&nbsp;&nbsp;&nbsp;${currentQuestion.expression}`;
    document.getElementById("answer1").value = "";
    document.getElementById("answer2").value = "";
}



// Ensure the game starts properly
document.addEventListener("DOMContentLoaded", function() {
    generateQuestion();
});

document.getElementById("startButton").addEventListener("click", startGame);


let timer; // Define timer globally
function startGame() {
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    correctStreak = 0;
    gameActive = true; // Game starts

    let timeLeft = parseInt(document.querySelector('input[name="timer"]:checked').value);

    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;

    if (timer) {
        clearInterval(timer);
    }

    // ✅ Re-enable input fields and submit button
    document.getElementById("answer1").disabled = false;
    document.getElementById("answer2").disabled = false;
    document.querySelector("#question-box button").disabled = false;

    generateQuestion(); // Generate the first question

    // ✅ Ensure Enter key submits answers
    document.getElementById("answer1").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            document.getElementById("answer2").focus(); // Move cursor to second input
        }
    });

    document.getElementById("answer2").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkAnswer(); // Submit answers when Enter is pressed
        }
    });

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}


document.getElementById("startButton").addEventListener("click", startGame);


document.getElementById("hintButton").addEventListener("click", function() {
    let hintText = document.getElementById("hintText");

    if (hintText.style.display === "none" || hintText.innerHTML === "") {
        // Show the hint
        hintText.style.display = "block";
        this.textContent = "Hide Hint"; // Change button text
        hintText.innerHTML = `
        Solve: ${currentQuestion.expression} <br>
        Step 1: Set each factor equal to zero.<br>
        Step 2: Create two linear equations.<br>
        Step 3: Solve equation to find zeros.
        `;
    } else {
        // Hide the hint
        hintText.style.display = "none";
        this.textContent = "Show Hint"; // Change button text back
    }
});


function checkAnswer() {
    if (!gameActive) return; // Stop processing answers when the game is over

    let userAnswer1 = parseInt(document.getElementById("answer1").value.trim());
    let userAnswer2 = parseInt(document.getElementById("answer2").value.trim());

    if (isNaN(userAnswer1) || isNaN(userAnswer2)) {
        document.getElementById("feedback").innerHTML = "❌ Please enter valid numbers!";
        return;
    }

    // Get the correct answers
    let correctRoots = [...currentQuestion.zeros].sort((a, b) => a - b);
    let userRoots = [userAnswer1, userAnswer2].sort((a, b) => a - b);

    let feedbackMessages = [
        "Great job! 🎉",
        "You're doing amazing! 🌟",
        "Keep it up! 🚀",
        "Fantastic work! ✅",
        "You're on a roll! 🔥"
    ];

    if (JSON.stringify(correctRoots) === JSON.stringify(userRoots)) {
        score += 2;
        correctAnswers++;
        correctStreak++;

        if (correctStreak === 3) {
            score += 3;
            feedbackMessages.push("🔥 Bonus! +3 points for 3 correct answers in a row!");
        }
        if (correctStreak === 5) {
            score += 5;
            feedbackMessages.push("🚀 Mega Bonus! +5 points for 5 correct streak!");
        }
        if (correctStreak === 10) {
            score += 10;
            feedbackMessages.push("🏆 Unstoppable! +10 points for 10 in a row!");
        }

        let feedbackMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
        document.getElementById("feedback").innerHTML = `<br>${feedbackMessage}`;
    } else {
        score = Math.max(0, score - 1);
        wrongAnswers++;
        correctStreak = 0;
        document.getElementById("feedback").innerHTML = `<br>❌ Incorrect! The correct answers were ${correctRoots.join(', ')}`;
    }

    document.getElementById("score").innerText = `Score: ${score}`;

    generateQuestion(); // Move to the next question

    // **Move cursor back to the first input box**
    setTimeout(() => {
        document.getElementById("answer1").focus();
    }, 100); // Delay ensures the focus is set after the new question loads
}

function endGame() {
    gameActive = false; // Game stops
    document.getElementById("final-score").innerText = score;
    document.getElementById("end-screen").classList.remove("hidden");

    // Disable input and submit button
    document.getElementById("answer1").disabled = true;
    document.getElementById("answer2").disabled = true;
    document.querySelector("#question-box button").disabled = true;
}


function generateCertificate() {

    document.getElementById("certificate").style.display = "block";


    let playerName = document.getElementById("player-name").value.trim();
    if (playerName === "") {
        playerName = "Student"; // Default if no name is entered
    }

    let totalQuestions = correctAnswers + wrongAnswers;
    let percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;

    // Achievement messages based on performance
    let achievementMessage = "";
    if (percentage === 100) {
        achievementMessage = "Outstanding performance! You achieved a perfect score! 🌟";
    } else if (percentage >= 90) {
        achievementMessage = "Amazing work! You're mastering factoring like a pro! 🚀";
    } else if (percentage >= 75) {
        achievementMessage = "Great job! You're on your way to becoming a factoring expert! 💡";
    } else if (percentage >= 50) {
        achievementMessage = "Good effort! Keep practicing and you'll be a pro in no time! 🔥";
    } else {
        achievementMessage = "Keep going! Every mistake is a step toward improvement. 💪";
    }

    // Get the selected timer challenge
    let selectedTimer = document.querySelector('input[name="timer"]:checked')?.value || "Unknown";

    // Certificate template
    let certificateHTML = `
        <h2>Unlocking The Zeros: Factored Form Challenge Certificate</h2>
        <p><strong>Congratulations, ${playerName}!</strong></p>
        <p>You completed the Zero Product Challenge in <strong>${selectedTimer} seconds</strong> with the following results:</p>
        <ul>
            <p><strong>Correct Answers:</strong> ${correctAnswers} and <strong>Wrong Answers:</strong> ${wrongAnswers}</p>
            <p></p>
            <p><strong>Total Questions Attempted:</strong> ${totalQuestions}</p>
            <p><strong>Accuracy:</strong> ${percentage}%</p>
        </ul>
        <p>${achievementMessage}</p>
        <p>Keep up the great work, and continue sharpening your math skills! </p>
    `;

    document.getElementById("certificate").innerHTML = certificateHTML;
}

function saveCertificateAsImage() {
    const certificateElement = document.getElementById("certificate");

    html2canvas(certificateElement).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Zero_Product_Challenge_Certificate.png";
        link.click();
    });
}

function saveCertificateAsPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "landscape", // Landscape format
        unit: "in", // Use inches
        format: [11, 8.5] // US Letter size (11 x 8.5 inches)
    });

    const certificateElement = document.getElementById("certificate");

    html2canvas(certificateElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const margin = 0.5; // Adjust bottom margin (in inches)
        const imgWidth = 10.2; // Keep some space on left/right
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.setFontSize(15); // Adjust font size (default is 16)

        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight - margin); // Adds spacing at bottom
        pdf.save("Zero_Product_Challenge_Certificate.pdf");
    });
}
