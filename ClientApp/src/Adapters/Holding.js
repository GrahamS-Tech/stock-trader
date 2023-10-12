export async function addHolding(currentUser, newHolding) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Holding/AddHolding", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            },
            body: newHolding
        });
        const result = await response.json();
        return result
    } catch (err) {
        console.error(err)
    }
}

export async function getAllHoldings(currentUser, excludeZero) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Holding/GetAllHoldings/?excludeZero=" + excludeZero, {
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

export async function updateHolding(currentUser, Id) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Holding/DeactivateHolding", {
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
        console.error(err)
    }
}