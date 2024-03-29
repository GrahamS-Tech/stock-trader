import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext'
import Header from './Components/Header';
import Navigation from './Components/Navigation';
import Home from './Pages/Home';
import MyPortfolio from './Pages/MyPortfolio'
import Research from './Pages/Research';
import MyAccount from './Pages/MyAccount';
import PrivateRoute from "./Components/PrivateRoute"

export default function App() {
    return (
        <div className="container-fluid">
            <AuthProvider>
                <header>
                    <Header></Header>
                    <Navigation></Navigation>
                </header>
                <main>
                    <Routes>
                        <Route index element={<Home/>} />
                        <Route path="/MyPortfolio" element={<PrivateRoute/>}>
                            <Route path="/MyPortfolio" element={<MyPortfolio/> }/>
                        </Route>
                        <Route path="/Research" element={<PrivateRoute/>}>
                            <Route path="/Research" element={<Research/>} />
                        </Route>
                        <Route path="/MyAccount" element={<PrivateRoute/>}>
                            <Route path="/MyAccount" element={<MyAccount/>} />
                        </Route>
                    </Routes>
                </main>
            </AuthProvider>
        </div>
    );
}