
export async function getProfileData(currentUser) {

    try {
        const response = await fetch("https://localhost:7247/api/Profile/ProfileDetails", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            }
        });
        const details = await response.json();
        return details
    } catch(err) {
        console.error(err)
    }
}

export async function profileUpdate(currentUser, details) {
    try {
        const response = await fetch("https://localhost:7247/api/Profile/ProfileUpdate", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser
            },
            body: details
        });
        return response
    } catch (err) {
        console.error(err)
    }
}