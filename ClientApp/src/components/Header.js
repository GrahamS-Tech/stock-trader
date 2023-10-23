import React from 'react';
import logo from './Assets/Images/6423145.png'
import "../Styles/custom.css"

export default function Header() {
    return (
        <div className="row mb-3 mt-3">
            <div className="col d-flex justify-content-center align-items-center" >
                <img className="img-responsive d-inline" height="70pc" src={logo} alt="Magic Wand"></img>
                <h1 id="page-header-text" className="page-header text-primary d-inline pe-4">Fantasy Trade</h1>
            </div>
        </div>
    )
}