export async function addTransaction(currentUser, details) {
    const result = {}
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Transaction/AddTransaction", {
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
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Transaction/GetAllTransactions", {
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

export async function getTransactionsByDate(currentUser, startDate, endDate) {
    try{
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Transaction/GetTransactionsByDate/" + startDate + ", " + endDate, {
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