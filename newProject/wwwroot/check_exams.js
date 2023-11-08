window.addEventListener("load", (event) => {
    loadData();
});

const idLec = parseInt(localStorage.getItem('idLec'));
const idStu = parseInt(localStorage.getItem('idStu'));
const idExam = parseInt(localStorage.getItem('checkExams'));
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));
async function loadData() {

    const response = await fetch("/api/exams");
    const exams = await response.json();
    const exam = exams.find(e => e.id === idExam);
    console.log(exam);
    let tbody = document.getElementById("examsInTable");
    let chackeButtonDisabled = "";
    let viewButtonDisabled = "";
    let num = "";
    let liList = "";
    for (var i = 0; i < exam.gradesNavigation.length; i++) {

        var examObj = exam.gradesNavigation[i];
        if (exam.gradesNavigation[i].gradeExam == -1) {
            num = "";
            chackeButtonDisabled = "";
            viewButtonDisabled = "disabled";

        }
        else {
            chackeButtonDisabled = "disabled";
            num = exam.gradesNavigation[i].gradeExam;
            viewButtonDisabled = "";
        }

        liList += `    <tr>
        <td>${exam.name}</td>
        <td>${exam.id}</td>
        <td>${exam.date}</td>
        <td>${exam.startTime}</td>
        <td>${examObj.idStudent}</td>
        <td>${num}</td>
        <td><button id="${examObj.idExam}_checkBTN"  ${chackeButtonDisabled} onclick = "checkRow(this, ${examObj.idStudent});"><i style="font-size:24px;" class="fa">&#xf040;</i></button></td>
         <td><button id="${examObj.idExam}_viewBTN" ${viewButtonDisabled} onclick="viewRow(this, ${examObj.idStudent});"><i style="font-size:24px" class="fa">&#xf06e;</i></button></td>

</tr>`
    }
    tbody.innerHTML = liList;
}


async function checkRow(row, idStudent) {
    const id_exam = row.id.replace('_checkBTN', '');
    const res = await getDataById(`/api/exams/${id_exam}`);
    if (res["typeExam"] === "open") {
        localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idStu', idStudent);
        localStorage.setItem('idUser', idLec);
        window.location.href = 'view_test_open.html';
    }
    else if (res["typeExam"] === "american") {
        localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idStu', idStudent);
        localStorage.setItem('idUser', idLec);
        window.location.href = 'test_open.html';
    }
    else {
        console.error("Unknown test type");
    }

}

async function viewRow(row, idStudent) {
    console.log(localStorage);
    const id_exam = row.id.replace('_viewBTN', '');
    const res = await getDataById(`/api/exams/${id_exam}`);
    if (res["typeExam"] === "american") {
        localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idStu', idStudent);
        window.location.href = 'view_test_americ.html';
    }
    else if (res["typeExam"] === "open") {
        localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idStu', idStudent);
        window.location.href = 'view_test_open.html';
    }
    else {
        console.error("Unknown test type");
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