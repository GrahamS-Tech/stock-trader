export async function addTransaction(currentUser, details) {
    try {
        const response = await fetch("https://localhost:7247/api/Transaction/AddTransaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            },
            body: details
        });
        const result = await response.json();
        return result
    } catch (err) {
        console.error(err)
    }
}

export async function getAllTransactions(currentUser) {
    try {
        const response = await fetch("", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            }
        });
        const result = await response.json();
        return result
    } catch (err) {
        console.error(err)
    }
}