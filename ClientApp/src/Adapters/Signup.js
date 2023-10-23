export async function Signup(firstName, lastName, emailAddress, password, signUpDate) {
    const details = JSON.stringify({
        "FirstName": firstName,
        "LastName": lastName,
        "EmailAddress": emailAddress,
        "Password": password,
        "SignUpDate": signUpDate
    })

    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: details
        });
        const result = await response.json();
        return result
    } catch (err) {
        return err
    }
};