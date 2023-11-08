
window.addEventListener("load", (event) => {
    loadData();
});

const idStu = parseInt(localStorage.getItem('idStu'));
const selectedExamId = parseInt(localStorage.getItem('selectedExamId'));

async function loadData() {
    const response = await fetch("/api/exams");
    const exams = await response.json();
    let tbody = document.getElementById("examsInTable");
    let avgStu = 0;
    let count = 0;

    let liList = "";
    for (var i = 0; i < exams.length; i++) {
        var examObj = exams[i];
        const gradeStu = examObj.gradesNavigation.find(item => item.idStudent === idStu);
        const countStu = examObj.gradesNavigation;
        if (gradeStu) {
            if (gradeStu.gradeExam !== -1) {
                avgStu += Number(gradeStu.gradeExam);
                count++;
                const avg = countStu.reduce((total, gradeObj) => total + gradeObj.gradeExam, 0) / examObj.gradesNavigation.length;
                countStu.sort((a, b) => b.gradeExam - a.gradeExam);
                const sortedGrades = countStu.map(item => item.gradeExam).sort((a, b) => b - a);
                const rating = sortedGrades.indexOf(gradeStu.gradeExam) + 1;
                console.log(countStu);

                liList += `    <tr>
            <td>${examObj.name}</td>
            <td>${examObj.id}</td>
            <td>${examObj.date}</td>
            <td>${examObj.startTime}</td>
            <td>${examObj.totalTime}</td>
            <td><button id="${examObj.id}_checkBTN"  onclick = "graphRow(this,${examObj.id});"><i style="font-size:24px;" class="fa">&#xf080;</i></button></td>
            </tr>
            <tr>
            <td id="mytd_${examObj.id}" style="height: 110px;display:none">grade: ${gradeStu.gradeExam}</td>
            <td id="mytd1_${examObj.id}" style="height: 110px;display:none">class rating: ${rating} from ${examObj.gradesNavigation.length}</td>
            <td id="mytd2_${examObj.id}" style="height: 110px;display:none">class average: ${avg}</td>
            <td colspan="7" ><canvas id="myChart_${examObj.id}" style="width:100%;display:none;max-width:600px; background-color:floralwhite"></canvas></td>
            </tr>`
            }
        }
    }
    tbody.innerHTML = liList;
    document.getElementById("avg").textContent = `Your grade point average is: ${avgStu / count}`;

}

async function graphRow(row, idExam) {
    const canvasToShow = document.getElementById(`myChart_${idExam}`);
    const avgTdToShow = document.getElementById(`mytd_${idExam}`);
    const avgTdToShow1 = document.getElementById(`mytd1_${idExam}`);
    const avgTdToShow2 = document.getElementById(`mytd2_${idExam}`);

    if (canvasToShow.style.display === 'block') {
        canvasToShow.style.display = 'none';
        avgTdToShow.style.display = 'none';
        avgTdToShow1.style.display = 'none';
        avgTdToShow2.style.display = 'none';
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
    avgTdToShow1.style.display = 'block';
    avgTdToShow2.style.display = 'block';

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

