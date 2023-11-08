const DetailsTest = {};
const Exams = {};
const ArrayQuestions = new Array();
const answers = [];
const actualBtn = document.getElementById('actual-btn');
const fileChosen = document.getElementById('file-chosen');

actualBtn.addEventListener('change', function () {
    fileChosen.textContent = this.files[0].name
    document.getElementById("question").value = null;
})

function Save() {

    const Id_test = parseInt(document.getElementById('Id_test').value);
    const Name_test = document.getElementById('Name_test').value;
    const Name_Lecturer = document.getElementById('Name_Lecturer').value;
    const Date_test = document.getElementById('Date_test').value;
    const Start_hour = document.getElementById('Start_hour').value;
    const Total_time = parseInt(document.getElementById('Total_time').value);
    const TypeExam = "open";


    if (!Id_test || !Name_test || !Name_Lecturer || !Date_test || !Start_hour || !Total_time) {
        alert("Please fill in all required fields.");
        return;
    }

    if (Object.keys(DetailsTest).length === 0) {
        DetailsTest["id"] = Id_test;
        DetailsTest["name"] = Name_test;
        DetailsTest["date"] = Date_test;
        DetailsTest["teacher"] = Name_Lecturer;
        DetailsTest["startTime"] = Start_hour;
        DetailsTest["totalTime"] = Total_time;
        DetailsTest["typeExam"] = TypeExam;
        DetailsTest["gradesNavigation"] = [];
        DetailsTest["questionsNavigation"] = [];
    }
}

async function Finish() {
    Save();
    DetailsTest["questionsNavigation"] = ArrayQuestions;

    if (DetailsTest["questionsNavigation"] != null) {

        let res = await postData("/api/exams", DetailsTest);
        if (res === 201) {
            window.location.href = "home_page.html";
        }
    }
    else {
        alert("Check whether the test data is saved and questions have been entered");
    }
}

function add_question() {
    Save();
    var question = document.getElementById("question").value;
    var fileInput = document.getElementById("actual-btn");
    var file = fileInput.files[0] ? fileInput.files[0].name : null;
    const tbody = document.querySelector("tbody");

    if (question !='' && !file) {

        const obj = {
            "id": 0,
            "idExam": DetailsTest["id"],
            "questionText": question,
            "answersNavigation": []
        };

        ArrayQuestions.push(obj);

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const td_delete = document.createElement("td");
        const input = document.createElement("input");


        input.setAttribute('type', "button");
        input.setAttribute('id', "btn_delete");
        input.setAttribute('value', "DELETE");
        input.setAttribute('onclick', "deleteRow(this)");
        td_delete.setAttribute('id', "td_delete");

        td.textContent = question;

        td_delete.appendChild(input);
        tr.appendChild(td);
        tr.appendChild(td_delete);
        tbody.appendChild(tr);

        document.getElementById("question").value = null;
        document.getElementById('actual-btn').value = null;
        document.getElementById("file-chosen").innerHTML = "No file chosen";

    }
    else if (question == '' && file) {
        const obj = {
            "id": 0,
            "idExam": DetailsTest["id"],
            "questionText": file,
            "answersNavigation": []
        };

        ArrayQuestions.push(obj);

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const td_delete = document.createElement("td");
        const input = document.createElement("input");

        input.setAttribute('type', "button");
        input.setAttribute('id', "btn_delete");
        input.setAttribute('value', "DELETE");
        input.setAttribute('onclick', "deleteRow(this)");
        td_delete.setAttribute('id', "td_delete");

        td.textContent = file;

        td_delete.appendChild(input);
        tr.appendChild(td);
        tr.appendChild(td_delete);
        tbody.appendChild(tr);

        document.getElementById("question").value = null;
        document.getElementById('actual-btn').value = null;
        document.getElementById("file-chosen").innerHTML = "No file chosen";

    }
    else {
        document.getElementById("demo").innerHTML = "No question typed";
        setTimeout(function () {
            document.getElementById("demo").innerHTML = "";
        }, 2500);
    }
}

function deleteRow(row) {

    let index_in_table = row.parentNode.parentNode.rowIndex;
    var question = document.getElementById("myTable").rows[index_in_table].cells[0].innerHTML;
    document.getElementById("myTable").deleteRow(index_in_table);

    for (var i = 0; i < ArrayQuestions.length; i++) {
        if (ArrayQuestions[i][0] == question) {
            ArrayQuestions.splice(i, 1);
        }
    }
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