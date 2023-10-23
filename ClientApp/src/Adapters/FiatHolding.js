export async function getFiatBalanceByCurrency(currentUser, currency) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/FiatHolding/" + currency, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            }
        });
        const result = response.json();
        return result
    } catch (err) {
        console.error(err)
    }
}