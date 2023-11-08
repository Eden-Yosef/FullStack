window.addEventListener("load", (event) => {
    loadData();
});




const idLec = parseInt(localStorage.getItem('idLec'));
const idStu = parseInt(localStorage.getItem('idStu'));
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));
let exams;
async function loadData() {
    const response = await fetch("/api/exams");
    exams = await response.json();
    let tbody = document.getElementById("examsInTable");
    let editButtonDisabled = "";
    let deleteButtonDisabled = "";

    let liList = "";
    for (var i = 0; i < exams.length; i++) {
        var examObj = exams[i];

        if (examObj.gradesNavigation.length === 0) {
            editButtonDisabled = "";
            deleteButtonDisabled = "";

        }
        else {
            editButtonDisabled = "disabled";
            deleteButtonDisabled = "disabled";

        }

        liList += `    <tr>
        <td>${examObj.name}</td>
        <td>${examObj.id}</td>
        <td>${examObj.date}</td>
        <td>${examObj.startTime}</td>
        <td>${examObj.totalTime}</td>
        <td>${examObj.teacher}</td>
        <td><button id="${examObj.id}_editBTN"  ${editButtonDisabled} onclick = "editRow(this,${examObj.id});"><i style="font-size:24px;" class="fa">&#xf040;</i></button></td>
        <td><button id="${examObj.id}_deleteBTN"  ${deleteButtonDisabled} onclick = "deleteRow(this);" ><i style="font-size:24px;" class="fa">&#xf014;</i></button></td>
        <td><button id="${examObj.id}_checkBTN"  onclick = "checkRow(this);"><i style="font-size:24px;" class="fa">&#xf040;</i></button></td>
        </tr>`

    }
    tbody.innerHTML = liList;
}


async function doSearch() {
    let tbody = document.getElementById("examsInTable");
    const searchTerm = document.getElementById("search");
    const searchValue = searchTerm.value.toLowerCase();
    const matchingExams = exams.filter(examObj => examObj.name.toLowerCase().includes(searchValue));
    let liList = "";
    tbody.innerHTML = "";

    let editButtonDisabled = "";
    let deleteButtonDisabled = "";
    if (matchingExams.length > 0) {
        for (var i = 0; i < matchingExams.length; i++) {
            if (matchingExams[i].gradesNavigation.length === 0) {
                editButtonDisabled = "";
                deleteButtonDisabled = "";
            }
            else {
                editButtonDisabled = "disabled";
                deleteButtonDisabled = "disabled";
            }
            liList += `    <tr>
                <td>${matchingExams[i].name}</td>
                <td>${matchingExams[i].id}</td>
                <td>${matchingExams[i].date}</td>
                <td>${matchingExams[i].startTime}</td>
                <td>${matchingExams[i].totalTime}</td>
                <td>${matchingExams[i].teacher}</td>
                <td><button id="${matchingExams[i].id}_editBTN"  ${editButtonDisabled} onclick = "editRow(this,${matchingExams[i].id});"><i style="font-size:24px;" class="fa">&#xf040;</i></button></td>
                <td><button id="${matchingExams[i].id}_deleteBTN"  ${deleteButtonDisabled} onclick = "deleteRow(this);" ><i style="font-size:24px;" class="fa">&#xf014;</i></button></td>
                <td><button id="${matchingExams[i].id}_checkBTN"  onclick = "checkRow(this);"><i style="font-size:24px;" class="fa">&#xf040;</i></button></td>
            </tr>`;
        }
        tbody.innerHTML = liList;
    }
    else {
        await loadData();
    }

}


async function deleteDataById(url = "") {

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok && response.status !== 404) {
        throw new Error(`Error deleting data: ${response.status} ${response.statusText}`);
    }
    return; 
}


async function deleteRow(row) {
    const id_exam = row.id.replace('_deleteBTN', '');
    var index_in_table = row.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").deleteRow(index_in_table);
    const res = await deleteDataById(`/api/exams/${id_exam}`);
}

async function editRow(row, idExam) {
    const id_exam = row.id.replace('_editBTN', '');
    const res = await getDataById(`/api/exams/${id_exam}`);
    if (res["typeExam"] === "open") {
        localStorage.setItem('selectedExamId', idExam);
        localStorage.setItem('idUser', idLec);
        window.location.href = 'edit_test_open.html';
    }
    else if (res["typeExam"] === "american") {
        localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idUser', idLec);
        window.location.href = 'edit_test_americ.html';
    }
    else {
        console.error("Unknown test type");
    }

}
async function checkRow(row) {
    const id_exam = row.id.replace('_checkBTN', '');
    localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idStu', idStu);
        localStorage.setItem('checkExams', id_exam);
        window.location.href = 'check_exams.html';
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