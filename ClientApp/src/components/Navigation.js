import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from "./AuthContext";

export default function Navigation() {

    const {Logout} = useAuth()
    function logout() {
        sessionStorage.clear();
        Logout()
    }

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/MyPortfolio">My Portfolio</Nav.Link>
                    <Nav.Link as={Link} to="/Reports">Reports</Nav.Link>
                    <Nav.Link as={Link} to="/MyAccount">My Account</Nav.Link>
                    <Nav.Link as={Link} onClick={logout} to="/" >Log out</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}