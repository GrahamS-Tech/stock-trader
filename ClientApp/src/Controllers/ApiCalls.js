import bcrypt from 'bcryptjs';

export async function GetSalt(user) {

    const details = JSON.stringify({
            "id": "",
            "emailAddress": user,
            "password": ""
        })

    var result = ""

    await fetch("https://localhost:7247/api/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: details
    }).then(response => {
        return response.text();
    }).then(data => {
        result = data;
    });

    return result
};

export async function Login(email, password, salt) {

    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(hashedPassword)

    const details = JSON.stringify({
        "id": "",
        "emailAddress": email,
        "password": hashedPassword
    })
    console.log(details)

    var result = ""

    await fetch("https://localhost:7247/api/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: details
    }).then(response => {
        return response.text();
    }).then(data => {
        result = data;
    });

    return result

};

export async function Signup(firstName, lastName, emailAddress, password) {
    const details = JSON.stringify({
        "FirstName": firstName,
        "LastName": lastName,
        "EmailAddress": emailAddress,
        "Password": password
    })

    var result = ""

    await fetch("https://localhost:7247/api/Signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: details
    }).then(response => {
        return response.text();
    }).then(data => {
        result = data;
    });

    return result
};