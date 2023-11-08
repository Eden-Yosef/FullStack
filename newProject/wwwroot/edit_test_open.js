
window.addEventListener("load", (event) => {
    loadData();
});


let DetailsTest = {};
const Exams = {};
let ArrayQuestions = new Array();
const answers = [];
const actualBtn = document.getElementById('actual-btn');
const fileChosen = document.getElementById('file-chosen');

const idLec = parseInt(localStorage.getItem('idLec'));
const idStu = parseInt(localStorage.getItem('idStu'));
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));

actualBtn.addEventListener('change', function () {
    fileChosen.textContent = this.files[0].name
    document.getElementById("question").value = null;
})

async function loadData() {
    const response = await fetch(`/api/exams/${selectedExamId}`);
    const exams = await response.json();
    let Id_test = document.getElementById('Id_test');
    let Name_test = document.getElementById('Name_test');
    let Name_Lecturer = document.getElementById('Name_Lecturer');
    let Date_test = document.getElementById('Date_test');
    let Start_hour = document.getElementById('Start_hour');
    let Total_time = document.getElementById('Total_time');

    document.getElementById('Id_test').disabled = true;

    Id_test.value = exams.id;
    Name_test.value = exams.name;
    Name_Lecturer.value = exams.teacher;
    Date_test.value = exams.date;
    Start_hour.value = exams.startTime;
    Total_time.value = exams.totalTime;
    const tbody = document.querySelector("tbody");

   

    ArrayQuestions = exams.questionsNavigation;
    for (let i = 0; i < ArrayQuestions.length; i++) {


        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const td_delete = document.createElement("td");
        const input = document.createElement("input");


        input.setAttribute('type', "button");
        input.setAttribute('id', "btn_delete");
        input.setAttribute('value', "DELETE");
        input.setAttribute('onclick', `deleteRow(this, ${ArrayQuestions[i].id})`);
        td_delete.setAttribute('id', "td_delete");

        td.textContent = ArrayQuestions[i].questionText;

        td_delete.appendChild(input);
        tr.appendChild(td);
        tr.appendChild(td_delete);
        tbody.appendChild(tr);

        document.getElementById("question").value = null;
        document.getElementById('actual-btn').value = null;
        document.getElementById("file-chosen").innerHTML = "No file chosen";
    }
   
   
}

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
        return 0;
    }

    else{
        DetailsTest["id"] = Id_test;
        DetailsTest["name"] = Name_test;
        DetailsTest["date"] = Date_test;
        DetailsTest["teacher"] = Name_Lecturer;
        DetailsTest["startTime"] = Start_hour;
        DetailsTest["totalTime"] = Total_time;
        DetailsTest["typeExam"] = TypeExam;
        DetailsTest["grades"] = null;
        DetailsTest["gradesNavigation"] = []; 
        DetailsTest["questions"] = null;
        DetailsTest["questionsNavigation"] = [];
    }

    for (var i = 0; i < ArrayQuestions.length; i++) {
        delete ArrayQuestions[i].id;
    }    
}



async function add_question() {
    Save();
    var question = document.getElementById("question").value;
    var fileInput = document.getElementById("actual-btn");
    var file = fileInput.files[0] ? fileInput.files[0].name : null;
    const tbody = document.querySelector("tbody");

    if (question != '' && !file) {

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

    DetailsTest["questionsNavigation"] = ArrayQuestions;

    if (DetailsTest["questionsNavigation"] != null) {

        let res = await putData(`/api/exams/${selectedExamId}`, DetailsTest);
    }
}

async function finishExam() {
    const deleteUrl = `/api/exams/${selectedExamId}`;

    const deleteResponse = await fetch(deleteUrl, {
        method: "DELETE"
    });

    return deleteResponse.status === 204;
}

async function Finish() {
    let res;

    if (Save() === 0) {
        return;
    }
    DetailsTest["questionsNavigation"] = ArrayQuestions;
    
    if (DetailsTest["questionsNavigation"] != null) {
        console.log(DetailsTest);

        if (await finishExam()) {
            res = await postData("/api/exams", DetailsTest);
        }
        
        if (res === 201) {
            window.location.href = "home_page.html";
        }
    }
    else {
        alert("Check whether the test data is saved and questions have been entered");
    }
}

async function deleteRow(row, idQuestion) {
    const response = await fetch(`/api/exams/${selectedExamId}`);
    const exams = await response.json();
    console.log(exams);
    let index_in_table = row.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").deleteRow(index_in_table);

    for (var i = 0; i < ArrayQuestions.length; i++) {

        if (exams.questionsNavigation[i].id === idQuestion) {
            ArrayQuestions.splice(i, 1);
            
        }
        console.log(ArrayQuestions);
        if (ArrayQuestions[i].id) {
            delete ArrayQuestions[i].id;

        }
    }
    exams.questionsNavigation = ArrayQuestions;
    DetailsTest = exams;
    console.log(DetailsTest);
}

async function postData(url = "", data = {}) {

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const text = await response.text(); // קרא את התוכן למשתנה text
    console.log(text);
    return response.status;
}

async function putData(url = "", data = {}) {

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const text = await response.text(); // קרא את התוכן למשתנה text
    console.log(text);
    return response.status;
}