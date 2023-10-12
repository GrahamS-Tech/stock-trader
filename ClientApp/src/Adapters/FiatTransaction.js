export async function addFiatTransaction(currentUser, details) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/FiatTransaction/AddFiatTransaction", {
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