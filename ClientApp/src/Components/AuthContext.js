import React, { useContext, useState } from 'react'
import bcrypt from 'bcryptjs';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()

    async function GetSalt(email) {

        const details = JSON.stringify({
            "id": "",
            "emailAddress": email,
            "password": ""
        })

        try {
            const response = await fetch("https://localhost:7247/api/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: details
            });
            const salt = (response)
            return salt;
        }
        catch(err) {
            return(err)
        }
    };

    async function Login(email, password, salt) {

        const hashedPassword = bcrypt.hashSync(password, salt);
        const details = JSON.stringify({
            "id": "",
            "emailAddress": email,
            "password": hashedPassword
        })

        try {
            const response = await fetch("https://localhost:7247/api/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: details
            })
            if (response.ok) {
                const data = await response.text()
                const [userID, token] = data.split(':')
                setCurrentUser(userID);
                const date = new Date();
                date.setTime(date.getTime() + 1800000);
                const expires = "expires=" + date.toUTCString();
                document.cookie = `token=${token}; ${expires}; path=/; secure`;
            }
            return response
        }
        catch (err) {
           console.error(err)
        }
    };

    function Logout() {
        setCurrentUser(null)
        document.cookie = 'token="";0; path=/'
    }

    const value = {
        currentUser,
        GetSalt,
        Login,
        Logout
    }

    return (
        <AuthContext.Provider value={ value }>
            {children }
        </AuthContext.Provider>  
    )
}