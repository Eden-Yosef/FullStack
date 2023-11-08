
async function Register() {
    var passwordUserInput = document.getElementById("passwordUser");
    var idUserInput = document.getElementById("idUser");
    var nameUserInput = document.getElementById("nameUser");


    if (!passwordUserInput.checkValidity() || !idUserInput.checkValidity() || !nameUserInput.checkValidity()) {
        return;
    }

     var user = {};
     var starusUser = document.getElementById("StudentUser").checked;
     if (starusUser) {
         user = {
             "name": document.getElementById("nameUser").value,
             "id": parseInt(document.getElementById("idUser").value),
             "passWord": document.getElementById("passwordUser").value,
             "isStudent": true
         };
     }
     else {
         user = {
             "name": document.getElementById("nameUser").value,
             "id": parseInt(document.getElementById("idUser").value),
             "passWord": document.getElementById("passwordUser").value,
             "isStudent": false
         };
     }

    let res = await postData("/api/users", user);
    window.location.href = "login.html";

    
}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

