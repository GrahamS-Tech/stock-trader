
export async function getProfileData(currentUser) {

    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Profile/ProfileDetails", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            }
        });
        const result = await response.json();
        return result
    } catch(err) {
        console.error(err)
    }
}

export async function profileUpdate(currentUser, details) {
    try {
        const response = await fetch("https://stock-trader-api.azurewebsites.net/api/Profile/ProfileUpdate", {
            method: "PUT",
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