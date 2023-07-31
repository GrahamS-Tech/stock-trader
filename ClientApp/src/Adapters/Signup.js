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