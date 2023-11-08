
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));
const idStu = parseInt(localStorage.getItem('idStu'));

let questions = [];
let currentQuestionNumber = 0;
const answersData = {};
let numberQuestions;
let answerElement;
const textData = "";

const answersObjectArray = [];

function resetCurrentAnswers() {
    answersObjectArray[currentQuestionIndex].answers[0] = "";
    answersObjectArray[currentQuestionIndex].remark = "";
    answersObjectArray[currentQuestionIndex].grade = "";
}

document.addEventListener("DOMContentLoaded", async function () {
    const res = await getDataById(`/api/exams/${selectedExamId}`);
    
    questions = res.questionsNavigation.map(question => question.questionText);
    numberQuestions = questions.length;
    res.questionsNavigation.forEach(question => {
        answersObjectArray.push({
                question: question.questionText,
                answers: [''],
                remark: '',
                grade: ''
        });
        answersObjectArray.totalGrade = -1;
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
    const localStorageKey = `savedAnswers_${selectedExamId}_${idStu}`;
    if (localStorage.selectedExamId == selectedExamId) {
        resetCurrentAnswers();
        const parsedAnswers = JSON.parse(localStorage.getItem(localStorageKey));
        console.log(Array.isArray(parsedAnswers.exam));
        if (parsedAnswers) {
            parsedAnswers.exam.forEach((parsedItem, index) => {
                answersObjectArray[index].answers.forEach((answer) => {
                    answer.answerText = parsedItem.answers[0].answerText;
                });
            });
        }
    }
    updateQuestion();

});

let currentQuestionIndex = 0;

function updateLocalStorage() {
    const answersToSave = {
        exam: answersObjectArray.map(item => ({
            question: item.question,
            answers: item.answers,
            remark: item.remark,
            grade: item.grade
        })),
        totalGrade : answersObjectArray.totalGrade
    }
    localStorage.setItem(`savedAnswers_${selectedExamId}_${idStu}`, JSON.stringify(answersToSave));
    console.log(JSON.stringify(answersToSave));
}

function updateQuestion() {
    let count = 0;
    const answerTextarea = document.getElementById('answer_user');
    const currentQuestion = questions[currentQuestionIndex];
    const questionTitle = document.querySelector("h2");
    currentQuestionNumber = currentQuestionIndex + 1;
    questionTitle.innerHTML = `Question ${currentQuestionNumber} <p id="num_question"></p>`;

    const contentContainer = document.getElementById("contentContainer");
    const currentAnswersData = answersData[currentQuestionIndex] || {}; 


    if (/\.(jpg|jpeg|png|gif)$/i.test(currentQuestion)) {
        contentContainer.innerHTML = `<img src="${currentQuestion}" style="display: block; max-width: 100%; margin: 0 auto;">`;
    } else if (currentQuestion && currentQuestion.endsWith &&  currentQuestion.endsWith(".pdf")) {
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
    answerTextarea.value = answersObjectArray[currentQuestionIndex].answers[0];

    
    for (i = 0; i < answersObjectArray.length; i++) {
            if (answersObjectArray[i].answers[0] != '') {
                count++;
            }
        
    }
    const diff = numberQuestions - count;
    const noteElement = document.getElementById("note");
    noteElement.textContent = `You answered ${count}/${numberQuestions}. Have ${diff} questions left.`;
  updateLocalStorage();

}


window.onload = function () {
    updateQuestion();

    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const answerTextarea = document.getElementById('answer_user');

    answerTextarea.addEventListener('input', function () {
        const userAnswer = answerTextarea.value;
        answersObjectArray[currentQuestionIndex].answers[0] = userAnswer;
        updateLocalStorage();
        updateQuestion();
    });

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




async function endExam() {
    const res = await fetch(`/api/exams/${selectedExamId}`);
    const examToUpdate = await res.json();
    const gradeData = {
        "id": 0,
        "idExam": selectedExamId,
        "idStudent": idStu,
        "gradeExam": -1
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

