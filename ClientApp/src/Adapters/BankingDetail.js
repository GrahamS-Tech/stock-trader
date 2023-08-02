export async function getAllAccounts(currentUser) {
    try {
        const response = await fetch("https://localhost:7247/api/BankingDetail/GetAllAccounts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            }
        });
        const result = await response.json();
        return result
    } catch (err) {
        console.log(err)
    }
}

export async function addAccount(currentUser, newAccountDetails) {
    try {
        const response = await fetch("https://localhost:7247/api/BankingDetail/AddAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            },
            body: newAccountDetails
        });
        const result = await response.json();
        return result
    } catch (err) {
        console.log(err)
    }
}

export async function deactivateAccount(currentUser, Id) {
    console.log(Id)
    try {
        const response = await fetch("https://localhost:7247/api/BankingDetail/DeactivateAccount", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            },
            body: Id
        });
        const result = await response.json();
        return result
    } catch (err) {
        console.log(err)
    }
}