import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './components/Home';
import MyPortfolio from './components/MyPortfolio'
import Reports from './components/Reports';
import MyAccount from './components/MyAccount';

export default function App() {
    return (
        <div className="container-fluid">
            <header>
                <Header></Header>
                <Navigation></Navigation>
            </header>
            <main>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="MyPortfolio" element={<MyPortfolio />} />
                    <Route path="Reports" element={<Reports />} />
                    <Route path="MyAccount" element={<MyAccount />} />
                </Routes>
            </main>
        </div>
    );
}
