
window.addEventListener("load", (event) => {
    loadData();
});

async function loadData() {
    const response = await fetch("/api/exams");
    const exams = await response.json();
    let tbody = document.getElementById("examsInTable");
  
    let liList = "";
    for (var i = 0; i < exams.length; i++) {
        var examObj = exams[i];
        const countStu = examObj.gradesNavigation;
        const avg = countStu.reduce((total, gradeObj) => total + gradeObj.gradeExam, 0) / examObj.gradesNavigation.length;

        liList += `    <tr>
        <td>${examObj.name}</td>
        <td>${examObj.id}</td>
        <td>${examObj.date}</td>
        <td>${examObj.startTime}</td>
        <td>${examObj.totalTime}</td>
        <td><button id="${examObj.id}_checkBTN"  onclick = "graphRow(this,${examObj.id});"><i style="font-size:24px;" class="fa">&#xf080;</i></button></td>
         </tr>
            <tr>
            <td id="mytd_${examObj.id}" style="padding-top: 150px;height: 330px;display:none">class average: ${avg}</td>
            <td colspan="7"><canvas id="myChart_${examObj.id}" style="width:100%;display:none;max-width:600px; background-color:floralwhite"></canvas></td>
            </tr>`

    }
    tbody.innerHTML = liList;


}

async function graphRow(row, idExam) {

    const canvasToShow = document.getElementById(`myChart_${idExam}`);
    const avgTdToShow = document.getElementById(`mytd_${idExam}`);


    if (canvasToShow.style.display === 'block') {
        canvasToShow.style.display = 'none';
        avgTdToShow.style.display = 'none';

        return;
    }

    const response = await fetch("/api/exams");
    const exams = await response.json();
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.style.display = 'none';
    });
    canvasToShow.style.display = 'block';
    

    document.querySelectorAll('td[id^="mytd"]').forEach(td => {
        td.style.display = 'none';
    });

    avgTdToShow.style.display = 'block';

    
        const studentsGrades = [];
        const studentNames = [];
        exams.find(item => item.id === idExam).gradesNavigation.forEach((item, index) => {
            studentsGrades.push(item.gradeExam);
            studentNames.push(index);
        });
        const sortedNumbers = studentsGrades.slice().sort(function (a, b) {
            return a - b;
        });

    new Chart(`myChart_${idExam}`, {
            type: "line",
            data: {
                labels: studentNames,
                datasets: [{
                    label: "Grades",
                    fill: false,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.2)",
                    data: sortedNumbers
                }]
            },
            options: {
                scales: {
                    yAxes: [{ ticks: { min: 0, max: 100 } }],
                }
            }
        });

}
