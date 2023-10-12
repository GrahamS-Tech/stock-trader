export async function addWatchListItem(currentUser, newWatchListItem) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/WatchList/AddWatchListEntry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            },
            body: newWatchListItem
        });
        const result = await response.json();
        return result
    } catch (err) {
        console.error(err)
    }
}

export async function getAllWatchListItems(currentUser) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/WatchList/GetWatchListEntries", {
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

export async function deactivateWatchListItem(currentUser, Id) {
    try { 
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/WatchList/DeactivateWatchListEntry", {
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