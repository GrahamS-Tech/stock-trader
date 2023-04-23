import React from 'react';
import { Form, Button, Dropdown, Table } from 'react-bootstrap'
import state_data from './Assets/state_data.json'

export default function MyAccount() {
    return (
        <div className="container-fluid w-50 justify-content-center">
            <br></br>
            <h3>My Account</h3>
            <Form>
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" required></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name" required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>E-mail address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>Address 1</Form.Label>
                        <Form.Control type="text" placeholder="Enter address"></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>Address 2</Form.Label>
                        <Form.Control type="text" placeholder="Enter address"></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="Enter city"></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                    <Form.Group className="m-2">
                        <Form.Label>State</Form.Label>
                        <Dropdown>
                                <Dropdown.Toggle variant="secondary">Select</Dropdown.Toggle>
                                <Dropdown.Menu required style={{ overflowY: "scroll", maxHeight: "400px" }} >
                                    {state_data.map((states) => (
                                        <Dropdown.Item key={states.code}>{states.state}</Dropdown.Item>
                                    ))}
                            </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>Postal code</Form.Label>
                            <Form.Control type="text" placeholder="Enter postal code"></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                    <Button className="m-2" variant="primary" type="submit">Update</Button>
            </Form>
            <br></br>
            <h3>Banking Detials</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Account type</th>
                        <th>Account number</th>
                        <th>Routing number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center" colSpan={3}>No accounts have been added</td>
                    </tr>
                </tbody>
            </Table>
            <br></br>
            <h3>Add account</h3>
            <Form>
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Account type</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary">Select</Dropdown.Toggle>
                            <Dropdown.Menu required>
                                <Dropdown.Item >Checking</Dropdown.Item>
                                <Dropdown.Item >Savings</Dropdown.Item>
                            </Dropdown.Menu>
                                </Dropdown>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Account number</Form.Label>
                            <Form.Control type="text" placeholder="Enter account number" required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Confirm account number</Form.Label>
                            <Form.Control type="text" placeholder="Re-enter account number" required></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Routing number</Form.Label>
                            <Form.Control type="text" placeholder="Enter routing number" required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <Button className="m-2" variant="primary" type="submit">Add</Button>
            </Form>
        </div>
    );
}