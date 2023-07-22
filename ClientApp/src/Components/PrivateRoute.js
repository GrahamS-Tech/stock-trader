import React from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext";

export default function PriavateRoute()
{
    const { currentUser } = useAuth()
    var token = RegExp("token" + "=[^;]+").exec(document.cookie);
    token = decodeURIComponent(!!token ? token.toString().replace(/^[^=]+./, "") : "");

    return currentUser && token ? <Outlet /> : <Navigate to="/" />
}