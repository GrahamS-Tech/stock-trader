import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext'
import Header from './Components/Header';
import Navigation from './Components/Navigation';
import Home from './Pages/Home';
import MyPortfolio from './Pages/MyPortfolio'
import Reports from './Pages/Reports';
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
                        <Route path="/Reports" element={<PrivateRoute/>}>
                            <Route path="/Reports" element={<Reports/>} />
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
