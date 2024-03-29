import React, { useState, useRef } from 'react';
import { Modal, Tabs, Tab, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import { Signup } from "../Adapters/Signup";
import { useAuth } from "../Components/AuthContext";
import research from "../Components/Assets/Images/chart-on-laptop.jpg";
import trends from "../Components/Assets/Images/compass.jpg";
import trade from "../Components/Assets/Images/buysell.jpg";
import monitor from "../Components/Assets/Images/stock-chart.jpg";

export default function Home() {
    const { GetSalt, Login } = useAuth()
    const [show, setShow] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const signinEmailRef = useRef()
    const signinPasswordRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const signupEmailRef = useRef()
    const signupPasswordRef = useRef()
    const signupPasswordConfirmRef = useRef()
    const navigate = useNavigate()


    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError("");

        if (signinEmailRef.current.value === "" || signinPasswordRef.current.value === "") {
            return setError("Enter email and password")
        }

        try {
            const getUserSalt = await GetSalt(signinEmailRef.current.value);
            if (getUserSalt.Status === "success") {
                const userSalt = getUserSalt.Data;
                const loginDetails = await Login(signinEmailRef.current.value, signinPasswordRef.current.value, userSalt);
                if (loginDetails.Status === "success") {
                    navigate("/MyPortfolio")
                }
                else {
                    setError(loginDetails.Message)
                }
            }
            else {
                setError(getUserSalt.Message)
            }
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSignup(e) {
        e.preventDefault()
        setError("");
        setSuccess("");

        if (signupPasswordRef.current.value !== signupPasswordConfirmRef.current.value)
        {
            return setError("Passwords do not match")
        }
        try {
            setLoading(true)
            const result = await Signup(firstNameRef.current.value, lastNameRef.current.value, signupEmailRef.current.value, signupPasswordRef.current.value)
            if (result.Status === "success") {
                setSuccess("Account created successfully. Return to log in to access your account")
            }
            else {
                setError(result.Message)
            }
        } catch (err) {
            console.error(err)
            setError("Unalbe to create your account. Please try again later")
        } finally {
        setLoading(false)
        }
    }

    return (
        <>
            <div className="container-fluid w-50 justify-content-center">
                <div className="row">
                    <div className="col">
                        <div className="card mt-4 mb-0">
                            <div className="card-body">
                                <h3 className="text-primary">Research</h3>
                                <img className="img-fluid" src={research} alt="Graphs on a laptop"></img>
                            </div>
                            <div className="card-footer">
                                <p>Some random text for card number one.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card mt-4 mb-0">
                            <div className="card-body">
                                <h3 className="text-primary">Direction & Trends</h3>
                                <img className="img-fluid" src={trends} alt="Compass laying on paperwork"></img>
                            </div>
                            <div className="card-footer">
                                <p>Some random text for card number two.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="card mt-4 mb-0">
                            <div className="card-body">
                                <h3 className="text-primary">Trade</h3>
                                <img className="img-fluid" src={trade} alt="Cards showing Buy and Sell"></img>
                            </div>
                            <div className="card-footer">
                                <p>Some random text for card number three.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card mt-4 mb-0">
                            <div className="card-body">
                                <h3 className="text-primary">Monitor</h3>
                                <img className="img-fluid" src={monitor} alt="Stock charts"></img>
                            </div>
                            <div className="card-footer">
                                <p>Some random text for card number four.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid w-50 justify-content-center">
                    <p className="text-center my-3"><button type="button" className="btn btn-primary" onClick={handleShow}>Login/Sign-up</button></p>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <div className="container-fluid justify-content-center">
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="login">
                        <Tab eventKey="login" title="Log in">
                            <Form onSubmit={ handleLogin }>
                                <Form.Group className="m-3">
                                    <Form.Label>E-mail address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" required ref={signinEmailRef}></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" required ref={signinPasswordRef}></Form.Control>
                                </Form.Group>
                                <Button disabled={loading} className="m-3" variant="primary" type="submit">{ loading? <Spinner size="sm"></Spinner> : "Log in"}</Button>
                            </Form>
                        </Tab>
                        <Tab eventKey="signup" title="Sign up">
                            <Form onSubmit={ handleSignup }>
                                <Form.Group className="m-3">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter first name" required ref={firstNameRef}></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" required ref={lastNameRef}></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>E-mail address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" required ref={signupEmailRef}></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter a password" required ref={signupPasswordRef}></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Confirm password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm password" required ref={signupPasswordConfirmRef}></Form.Control>
                                </Form.Group>
                                <Button disabled={loading} className="m-3" variant="primary" type="submit">Submit</Button>
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>
        </>
    );
}