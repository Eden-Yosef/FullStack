
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));
const idStu = parseInt(localStorage.getItem('idStu'));

let questions = []; 
let currentQuestionNumber = 0;
const answersData = {}; // Object to store answers for each question
let numberQuestions;
let answerElement;
let shuffledAnswers;

const answersObjectArray = [];

function resetCurrentAnswers() {
    answersObjectArray[currentQuestionIndex].answers.forEach(answer => {
        answer.checked = false;
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    const res = await getDataById(`/api/exams/${selectedExamId}`);
    questions = res.questionsNavigation.map(question => question.questionText);
    numberQuestions = questions.length;
    res.questionsNavigation.forEach(question => {
        const answerObjects = question.answersNavigation.map(answer => ({
            answerText: answer.answerText,
            checked: false
        }));
        answersObjectArray.push({
            question: question.questionText,
            answers: answerObjects
        });
    });

    const timerDisplay = document.getElementById("timer");
    const hoursInput = res["totalTime"];

    let remainingSeconds = hoursInput * 3600;

    function updateTimer() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        if (remainingSeconds === 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00";
        } else {
            remainingSeconds--;
        }
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    updateLocalStorage();
    const localStorageKey = `savedAnswers_${selectedExamId}_${idStu}`;
    if (localStorage.selectedExamId == selectedExamId) {
        resetCurrentAnswers();
        const parsedAnswers = JSON.parse(localStorage.getItem(localStorageKey));
        // Update answersObjectArray with saved answers
        console.log(Array.isArray(parsedAnswers));

        console.log(parsedAnswers);
        parsedAnswers.forEach((parsedItem, index) => {
            answersObjectArray[index].answers.forEach((answer, answerIndex) => {
                answer.checked = parsedItem.answers[answerIndex].checked;
            });
        });
    }
    updateLocalStorage();
    updateQuestion();

});

let currentQuestionIndex = 0;

function updateLocalStorage() {
    const answersToSave = answersObjectArray.map(item => ({
        question: item.question,
        answers: item.answers.map(answer => ({
            answerText: answer.answerText,
            checked: answer.checked
        }))
    }));
    localStorage.setItem(`savedAnswers_${selectedExamId}_${idStu}`, JSON.stringify(answersToSave));
    console.log(localStorage);

}

function updateQuestion() {
    let count = 0;
    const currentQuestion = questions[currentQuestionIndex];
    const questionTitle = document.querySelector("h2");
    currentQuestionNumber = currentQuestionIndex + 1;
    questionTitle.innerHTML = `Question ${currentQuestionNumber} <p id="num_question"></p>`;

    const contentContainer = document.getElementById("contentContainer");
    const answersContainerView = document.getElementById("answersContainerView");
    answersContainerView.innerHTML = "";

    const currentAnswers = answersObjectArray[currentQuestionIndex].answers;
    console.log(Array.isArray(currentAnswers));
    shuffledAnswers = shuffleArray(currentAnswers);

    if (/\.(jpg|jpeg|png|gif)$/i.test(currentQuestion)) {
        contentContainer.innerHTML = `<img src="${currentQuestion}" style="display: block; max-width: 100%; margin: 0 auto;">`;
    } else if (currentQuestion.endsWith(".pdf")) {
        contentContainer.innerHTML = `<canvas id="pdfCanvas" style="display: block; max-width: 100%; margin: 0 auto;"></canvas>`;
        pdfjsLib.getDocument(currentQuestion).promise.then(pdfDoc => {
            const pdfCanvas = document.getElementById("pdfCanvas");
            const page = pdfDoc.getPage(1);
            const viewport = page.getViewport({ scale: 1.0 });
            pdfCanvas.width = viewport.width;
            pdfCanvas.height = viewport.height;
            const context = pdfCanvas.getContext("2d");
            page.render({ canvasContext: context, viewport: viewport });
        });
    } else {
        contentContainer.innerHTML = `<p style="text-align: center;">${currentQuestion}</p>`;
    }


    shuffledAnswers.forEach((answer, index) => {
        if (answer.answerText) {
            answerElement = document.createElement("label");
            answerElement.className = "btn_move";
            answerElement.dataset.index = index;

            const inputElement = document.createElement("input");
            inputElement.type = "radio";
            inputElement.name = "option";
            inputElement.value = `option${index + 1}`;

            inputElement.checked = answer.checked === true;

            inputElement.addEventListener("change", () => {
                answer.checked = inputElement.checked;

                shuffledAnswers.forEach((otherAnswer) => {
                    if (otherAnswer !== answer) {
                        otherAnswer.checked = false;
                    }
                });

                updateLocalStorage(); // Save answers to Local Storage

            });

            const answerText = document.createTextNode(answer.answerText);

            answerElement.appendChild(inputElement);
            answerElement.appendChild(answerText);
            answersContainerView.appendChild(answerElement);

        }
    });
    for (i = 0; i < answersObjectArray.length; i++) {
        for (j = 0; j < answersObjectArray[i].answers.length; j++) {
            if (answersObjectArray[i].answers[j].checked == true) {
                count++;
            }
        }
    }
    const diff = numberQuestions - count;
    const noteElement = document.getElementById("note");
    noteElement.textContent = `You answered ${count}/${numberQuestions}. Have ${diff} questions left.`;

}


window.onload = function () {
    updateQuestion();

    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    nextButton.addEventListener("click", function () {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            updateQuestion();
        }
    });

    prevButton.addEventListener("click", function () {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestion();
        }
    });
};

async function getDataById(url = "") {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(button => {
    button.addEventListener("change", function () {
        const answerValue = this.value;
        answersData[currentQuestionIndex] = answersData[currentQuestionIndex] || {}; 
        answersData[currentQuestionIndex][answerValue] = this.checked;
        updateQuestion();
    });
});


async function endExam() {
    const res = await fetch(`/api/exams/${selectedExamId}`);
    const examToUpdate = await res.json();

    const numQuestions = answersObjectArray.length;
    let numCorrectAnswers = 0;

    for (let i = 0; i < numQuestions; i++) {
        const userAnswer = answersObjectArray[i].answers[0].answerText;
        const correctAnswer = examToUpdate.questionsNavigation[i].answersNavigation[0].answerText;

        if (userAnswer === correctAnswer && answersObjectArray[i].answers[0].checked) {
            numCorrectAnswers++;
        }
    }

    //const res = await getDataById(`/api/exams/${selectedExamId}`);
    //if (res["idExam"] === selectedExamId) {
    //    localStorage.setItem('selectedExamId', selectedExamId);
    //    localStorage.setItem('idStu', idStu);
       localStorage.setItem('savedAnswers', JSON.stringify(answersObjectArray));

    //}


    const questionScore = 100 / numQuestions;
    let grade = numCorrectAnswers * questionScore;
    console.log(grade);
    if (grade === 0) {
        grade = null;
    }

    const gradeData = {
        "id": 0,
        "idExam": selectedExamId,
        "idStudent": idStu,
        "gradeExam": Math.round(grade)
    };

    examToUpdate.gradesNavigation.push(gradeData);
    const updateUrl = `/api/exams/${selectedExamId}`;
    const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(examToUpdate)
    });
    updateLocalStorage();

    window.location.href = "home_student.html";
    const results = await response.json();
    return results;

    
}

