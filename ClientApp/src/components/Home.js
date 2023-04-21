import React, { useState } from 'react';
import research from "./Assets/Images/chart-on-laptop.jpg";
import trends from "./Assets/Images/compass.jpg";
import trade from "./Assets/Images/buysell.jpg";
import monitor from "./Assets/Images/stock-chart.jpg";
import { Modal, Tabs, Tab, Form, Button } from 'react-bootstrap'

export default function Home() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    <p className="text-center my-3"><button type="button" className="btn btn-link" onClick={handleShow}>Login/Sign-up</button></p>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="login">
                        <Tab eventKey="login" title="Log in">
                            <Form>
                                <Form.Group className="m-3">
                                    <Form.Label>E-mail address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" required></Form.Control>
                                </Form.Group>
                                <Button className="m-3" variant="primary" type="submit">Log in</Button>
                            </Form>
                        </Tab>
                        <Tab eventKey="signup" title="Sign up">
                            <Form>
                                <Form.Group className="m-3">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter first name" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>E-mail address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter a password" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="m-3">
                                    <Form.Label>Confirm password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm password" required></Form.Control>
                                </Form.Group>
                                <Button className="m-3" variant="primary" type="submit">Submit</Button>
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>
        </>
    );
}