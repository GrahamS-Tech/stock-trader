import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MyAccount from './components/MyAccount';
import Reports from './components/Reports';

export default function App() {
    return (
        <div className="container-fluid">
            <header>
                <Header></Header>
                <Navbar></Navbar>
            </header>
            <main>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="myAccount" element={<MyAccount />} />
                    <Route path="reports" element={<Reports />} />
                </Routes>
            </main>
        </div>
    );
}
