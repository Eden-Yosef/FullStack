
window.addEventListener("load", (event) => {
    loadData();
});

const idStu = parseInt(localStorage.getItem('idStu'));
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));



async function loadData() {

    const response = await fetch(`/api/exams`);
    const exams = await response.json();
    let tbody = document.getElementById("examsInTable");
    let startButtonDisabled = "";
    let viewButtonDisabled = "";

    let num = "";
    let liList = "";
    for (var i = 0; i < exams.length; i++) {
        var examObj = exams[i];
        var gradeObj = examObj.gradesNavigation;
        if(examObj.gradesNavigation.length > 0 && gradeObj.some(elem => elem.idStudent === idStu)) {
            num = gradeObj.find(elem => elem.idStudent === idStu).gradeExam;
            startButtonDisabled = "disabled";
            if (num == -1) {
                num = "";
                viewButtonDisabled = "disabled";
            }
            else {
                viewButtonDisabled = "";
            }
        }
        else {
            num = "";
            startButtonDisabled = "";
            viewButtonDisabled = "disabled";

        }

        liList += `    <tr>
        <td>${examObj.name}</td>
        <td>${examObj.date}</td>
        <td>${examObj.startTime}</td>
        <td>${examObj.totalTime}</td>
        <td>${examObj.teacher}</td>
        <td><button id="${examObj.id}_startBTN"  ${startButtonDisabled} onclick="startRow(this);"><i style="font-size:24px;" class="fa">&#xf040;</i></button></td>
        <td id="grade">${num}</td>
        <td><button id="${examObj.id}_viewBTN" ${viewButtonDisabled} onclick="viewRow(this);"><i style="font-size:24px" class="fa">&#xf06e;</i></button></td>
    </tr>`
    }
    tbody.innerHTML = liList;
}



async function startRow(row) {
    const id_exam = parseInt(row.id.replace('_startBTN', ''));
    const res = await getDataById(`/api/exams/${id_exam}`);
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    let date1 = new Date(date + " " + time);
    let date2 = new Date(res.date + " " + res.startTime);
    console.log(date1.getTime()  , date2.getTime());
    var timeDifferenceInMilliseconds = Math.abs(date2 - date1);
    var timeDifferenceInSeconds = Math.floor(timeDifferenceInMilliseconds / 1000 / 60);
    console.log(timeDifferenceInSeconds);
    if (timeDifferenceInSeconds < 60000) { 
        if (res["typeExam"] === "american") {
            localStorage.setItem('selectedExamId', id_exam);
            localStorage.setItem('idStu', idStu);
            window.location.href = 'test_americ.html';
        }
        else if (res["typeExam"] === "open") {
            localStorage.setItem('selectedExamId', id_exam);
            localStorage.setItem('idStu', idStu);
            window.location.href = 'test_open.html';
        }
        else {
            console.error("Unknown test type");
        }
    }
    else {
        alert("Time problem");
    }

}

async function viewRow(row) {
    const id_exam = row.id.replace('_viewBTN', '');
    const res = await getDataById(`/api/exams/${id_exam}`);
    if (res["typeExam"] === "american") {
        localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idStu', idStu);
        localStorage.setItem('idUser', idStu);

        window.location.href = 'view_test_americ.html';
    }
    else if (res["typeExam"] === "open") {
        localStorage.setItem('selectedExamId', id_exam);
        localStorage.setItem('idStu', idStu);
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

async function postData(url = "", data = {}) {

    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.status;
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