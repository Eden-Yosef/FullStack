
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));
const idStu = parseInt(localStorage.getItem('idStu'));
const idUser = parseInt(localStorage.getItem('idUser'));

const answersObjectArray = localStorage.getItem(`savedAnswers_${selectedExamId}_${idStu}`);
const data = JSON.parse(answersObjectArray); 
console.log(localStorage);
console.log(data);



let questions = [];
let currentQuestionNumber = 0;
const answersData = {}; // Object to store answers for each question
let numberQuestions = 0;
let answerElement = 0;
let shuffledAnswers = 0;
let currentQuestionIndex = 0;


document.addEventListener("DOMContentLoaded", async function () {
    const res = await getDataById(`/api/exams/${selectedExamId}`);
    questions = res.questionsNavigation.map(question => question.questionText);
    numberQuestions = questions.length;

    updateQuestion();   
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    next.addEventListener("click", function () {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            updateQuestion();
        }
    });

    prev.addEventListener("click", function () {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestion();
        }
    });
});


window.onload = function () {
    updateQuestion();
};

function updateQuestion() {

    const currentQuestion = questions[currentQuestionIndex];
    const questionTitle = document.querySelector("h2");
    currentQuestionNumber = currentQuestionIndex + 1;
    questionTitle.innerHTML = `Question ${currentQuestionNumber} <p id="num_question"></p>`;

    const contentContainer = document.getElementById("contentContainer");
    const answersContainerView = document.getElementById("answersContainerView");
    answersContainerView.innerHTML = "";


    //const currentAnswers = answersObjectArray[currentQuestionIndex];
    //shuffledAnswers = shuffleArray(currentAnswers).answers;

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

    //const currentAnswers = answersObjectArray[currentQuestionIndex];
   // console.log(data);
    data[currentQuestionIndex].answers.forEach((answer, index) => {
        if (answer.answerText) {
            answerElement = document.createElement("label");
            answerElement.className = "btn_move";
            answerElement.dataset.index = index;

            const inputElement = document.createElement("input");
            inputElement.type = "radio";
            inputElement.name = "option";
            inputElement.value = `option${index + 1}`;

            inputElement.checked = answer.checked === true;
            inputElement.disabled = true;
    
            if (answer.checked) {
                answerElement.style.color = "red"; 
            }

            const answerText = document.createTextNode(answer.answerText);

            answerElement.appendChild(inputElement);
            answerElement.appendChild(answerText);
            answersContainerView.appendChild(answerElement);

        }
    });
    test();

}


async function test() {
    const ress = await fetch(`/api/exams/${selectedExamId}`);
    const examToUpdate = await ress.json();

    const userAnswer = data[currentQuestionIndex].answers[0].answerText;
    const correctAnswer = examToUpdate.questionsNavigation[currentQuestionIndex].answersNavigation[0].answerText;
    const testAnswer = document.getElementById("testAnswer");

    if (userAnswer === correctAnswer && data[currentQuestionIndex].answers[0].checked) {
        testAnswer.textContent = `Very nice. Correct answer.`;
    }
    else {
        testAnswer.textContent = `Not true. The correct answer is: ${userAnswer}.`;
    }

}


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



async function exit() {
    const ress = await fetch(`/api/users/${idUser}`);
    const examToUpdate = await ress.json();
    if (examToUpdate.isStudent == false) {
        window.location.href = 'check_exams.html';
    }
    else {
        window.location.href = 'home_student.html';
    }
}




