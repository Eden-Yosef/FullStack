
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));
const idStu = parseInt(localStorage.getItem('idStu'));
const user = parseInt(localStorage.getItem('idUser'));
const remarksObjectArray = localStorage.getItem(`savedAnswers_${selectedExamId}_${idStu}`);
const data = JSON.parse(remarksObjectArray);
console.log(localStorage);
console.log(data);



let questions = [];
let currentQuestionNumber = 0;
const answersData = {};
let numberQuestions = 0;
let answerElement = 0;
let shuffledAnswers = 0;
let currentQuestionIndex = 0;

function resetCurrentAnswers() {
    data.totalGrade = '';
    data.exam[currentQuestionIndex].remark = "";
    data.exam[currentQuestionIndex].grade = "";
}

document.addEventListener("DOMContentLoaded", async function () {
    const ress = await fetch(`/api/users/${user}`);
    const examToUpdate = await ress.json();
    const exit = document.getElementById('exit');
    const res = await getDataById(`/api/exams/${selectedExamId}`);
    questions = res.questionsNavigation.map(question => question.questionText);
    numberQuestions = questions.length;

    const localStorageKey = `savedAnswers_${selectedExamId}_${idStu}`;
    if (localStorage.selectedExamId == selectedExamId) {
        resetCurrentAnswers();
        const parsedAnswers = JSON.parse(localStorage.getItem(localStorageKey));
        console.log(parsedAnswers);
        // Update remarksObjectArray with saved answers
        if (parsedAnswers) {
            parsedAnswers.exam.forEach((parsedItem, index) => {
                data.exam[index].remark = parsedItem.remark;
                data.exam[index].grade = parsedItem.grade;
            });
            data.totalGrade = parsedAnswers.totalGrade;

        }
        console.log("f", remarksObjectArray.totalGrade);
    }

    if (examToUpdate.isStudent == false) {
        exit.textContent = "Finished testing";
    }
    else {
        exit.textContent = 'EXIT';
    }

    updateQuestion();
});


window.onload = function () {
    updateQuestion();

    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    var textArea = document.getElementById("test_lec");
    var grade = document.getElementById("test_grade");

    grade.addEventListener('input', function () {
        const testLec = grade.value;
        data.exam[currentQuestionIndex].grade = testLec;
        updateLocalStorage();
    });


    textArea.addEventListener('input', function () {
        const testLec = textArea.value;
        data.exam[currentQuestionIndex].remark = testLec;
        updateLocalStorage();
    });

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
};

function updateLocalStorage() {
    const remarksToSave = {
        exam: data.exam.map(item => ({
            question: item.question,
            answers: item.answers,
            remark: item.remark,
            grade: item.grade
        })),
        totalGrade  : Number(data.totalGrade)
    }
    localStorage.setItem(`savedAnswers_${selectedExamId}_${idStu}`, JSON.stringify(remarksToSave));
    console.log(localStorage);
}

function updateQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const questionTitle = document.querySelector("h2");
    currentQuestionNumber = currentQuestionIndex + 1;
    questionTitle.innerHTML = `Question ${currentQuestionNumber} <p id="num_question"></p>`;
    const contentContainer = document.getElementById("contentContainer");


    if (/\.(jpg|jpeg|png|gif)$/i.test(currentQuestion)) {
        contentContainer.innerHTML = `<img src="${currentQuestion}" style="display: block; max-width: 100%; margin: 0 auto;">`;
    } else if (currentQuestion && currentQuestion.endsWith && currentQuestion.endsWith(".pdf")) {
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

    console.log(currentQuestionIndex);
    console.log(data.exam[currentQuestionIndex].remark);

    test();

}


async function test() {
    const ress = await fetch(`/api/users/${user}`);
    const examToUpdate = await ress.json();
    const testAnswer = document.getElementById("testAnswer");
    const testGrade = document.getElementById("testGrade");
    var textArea = document.getElementById("test_lec");
    var numberInput = document.getElementById("test_grade");
    const answerTextarea = document.getElementById('answer_user');
    const remarkTextarea = document.getElementById('test_lec');
    const gradeTextarea = document.getElementById('test_grade');

    if (examToUpdate.isStudent == false) {
        remarkTextarea.value = data.exam[currentQuestionIndex].remark;
        gradeTextarea.value = data.exam[currentQuestionIndex].grade;
    }
    else {
        remarkTextarea.value = null;
        gradeTextarea.value = null;
    }

    if (examToUpdate.isStudent == false && data.totalGrade == -1) {
         textArea.style.display = "block";
        numberInput.style.display = "block";  
    }
    else {
        textArea.style.display = "none";
        numberInput.style.display = "none";
        testAnswer.textContent = 'Remarks:  ' + data.exam[currentQuestionIndex].remark;
        testGrade.textContent = 'Grage:  ' + data.exam[currentQuestionIndex].grade;

    }

    answerTextarea.value = data.exam[currentQuestionIndex].answers[0];
    answerTextarea.disabled = true;
    updateLocalStorage();
    console.log(examToUpdate);
  
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
    const res = await fetch(`/api/exams/${selectedExamId}`);
    const examToUpdate = await res.json();
    const ress = await fetch(`/api/users/${user}`);
    const use = await ress.json();
    let grade = 0;

    if (use.isStudent == false) {
        data.exam.map((item) => {
                grade += Number(item.grade);
            });
        data.totalGrade = grade;
        updateLocalStorage();

        const gradeData = {
            "id": examToUpdate.gradesNavigation.find(item => item.idStudent === idStu).id,
            "idExam": selectedExamId,
            "idStudent": idStu,
            "gradeExam": Math.round(grade)
        };
        console.log(gradeData)
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

        window.location.href = 'check_exams.html';
        const results = await response.json();
        return results;
    }
    else {
        window.location.href = 'home_student.html';

    }
}




