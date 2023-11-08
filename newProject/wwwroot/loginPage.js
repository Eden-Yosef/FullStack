async function getDataById(url = "") {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return await response.json();
}
console.log(localStorage);
async function btnCheckUserClicked() {
    const idUserInput = parseInt(document.getElementById("idUser").value);
    if (idUserInput.toString().trim() === "") {
        alert("Please enter a valid user ID.");
        return;
    }
    const passwordUserInput = document.getElementById("passwordUser").value;

    try {
        const dataUser = await getDataById(`/api/users/${idUserInput}`);

        if (dataUser && parseInt(dataUser.id) === idUserInput && dataUser.password === passwordUserInput) {
            if (dataUser.isStudent === true) {

                localStorage.setItem('idStu', idUserInput.toString());
                localStorage.setItem('idUser', idUserInput.toString());
                
                window.location.href = "home_student.html";
            }
            else {
                localStorage.setItem('idLec', idUserInput.toString());
                localStorage.setItem('idUser', idUserInput.toString());
                console.log(localStorage);
                window.location.href = "home_page.html";
            }
        }
        else {
            console.log("eeee");
            alert("Invalid credentials. Please check your ID and password.");
        }
    } catch (error) {
        alert("An error occurred while processing your request.");
        console.error(error);
    }

}

//async function loadUsers() {

//    const response = await fetch("/api/users");
//    const users = await response.json();

//    let liList = "";
//    for (var i = 0; i < users.length; i++) {

//        var userObj = users[i];
//        liList += `${userObj.name} ${userObj.id} ${userObj.password} ${userObj.isStudent}`
//        return liList;
//    }

//}