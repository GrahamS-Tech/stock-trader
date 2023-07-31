import React, { useContext, useState, useEffect } from 'react'
import bcrypt from 'bcryptjs';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];
            if (cookieValue) setCurrentUser(cookieValue)
    },[])

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
                setCurrentUser(data);
                const date = new Date();
                date.setTime(date.getTime() + 1800000);
                const expires = "expires=" + date.toUTCString();
                document.cookie = `token=${data}; ${expires}; path=/; secure`;
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