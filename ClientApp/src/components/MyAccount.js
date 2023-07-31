import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Dropdown, Table, Alert } from 'react-bootstrap'
import { useAuth } from  "./AuthContext"
import state_data from './Assets/state_data.json'
import { getProfileData, profileUpdate } from '../Adapters/Profile';

export default function MyAccount() {
    const [currentUserProfile, setCurrentUserProfile] = useState([]);
    const { currentUser } = useAuth()
    const [success, setSuccess] = useState("")
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    let profileComplete = false
    let firstNameRef = useRef()
    let lastNameRef = useRef()
    let emailAddressRef = useRef()
    let address1Ref = useRef()
    let address2Ref = useRef()
    let cityRef = useRef()
    let stateRef = useRef()
    let postalCodeRef = useRef()

    useEffect(() => {
        setLoading(true)
        getProfileData(currentUser)
            .then((profileData) => {
                setCurrentUserProfile(profileData)              
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            });
    }, [currentUser])

    async function handleUpdate(e) {
        e.preventDefault();
        if (firstNameRef.current.value &&
            lastNameRef.current.value &&
            emailAddressRef.current.value &&
            address1Ref.current.value &&
            cityRef.current.value &&
            stateRef.current.value &&
            postalCodeRef.current.value)
        {
            profileComplete = true
        }
            const details = JSON.stringify({
                "FirstName": firstNameRef.current.value,
                "LastName": lastNameRef.current.value,
                "EmailAddress": emailAddressRef.current.value,
                "Address1": address1Ref.current.value,
                "Address2": address2Ref.current.value,
                "City": cityRef.current.value,
                "State": stateRef.current.value,
                "PostalCode": postalCodeRef.current.value,
                "ProfileComplete": profileComplete
            })

        try {
            await profileUpdate(currentUser, details)
            setSuccess("Account details updated")
        } catch (err) {
            setError(err)
        }
    }

        //await fetch("https://localhost:7247/api/Profile/ProfileUpdate", {
        //    method: "PUT",
        //    headers: {
        //        "Content-Type": "application/json",
        //        "Authorization": "Bearer " + currentUser
        //    },
        //    body: details
        //}).then((response) => {
        //    console.log(response)
        //    setSuccess("Account details updated")
        //}).catch((err) => {
        //    console.log(err)
        //    setError(err)
        //})

    if (loading) return <div className="container-fluid w-50 justify-content-center"><Alert variant="primary" className="text-center">Getting account details...</Alert></div>;

    return (
        <div className="container-fluid w-50 justify-content-center">
            <br></br>
            <div>
                {success && <Alert variant="success" className="text-center">{success}</Alert>}
                {error && <Alert variant="danger" className="text-center">{ error }</Alert>}
                {!currentUserProfile?.profileComplete && <Alert variant="danger" className="text-center">You must complete your profile before making a trade</Alert>}
            </div>
            <h3>My Account</h3>
            <Form onSubmit={handleUpdate} >
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" ref={ firstNameRef } defaultValue={currentUserProfile?.firstName} required></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name" ref={ lastNameRef } defaultValue={currentUserProfile?.lastName} required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>E-mail address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" ref={ emailAddressRef } defaultValue={currentUserProfile?.emailAddress} required></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>Address 1</Form.Label>
                        <Form.Control type="text" placeholder="Enter address" ref={ address1Ref } defaultValue={currentUserProfile?.address1} required></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>Address 2</Form.Label>
                        <Form.Control type="text" placeholder="Enter address" ref={ address2Ref } defaultValue={currentUserProfile?.address2}></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="Enter city" ref={ cityRef } defaultValue={currentUserProfile?.city}></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>State</Form.Label>
                            <Form.Select ref={stateRef} defaultValue={currentUserProfile?.state ? currentUserProfile?.state : "SL"}>
                                {state_data.map((states) => (
                                    <option key={states.code} value={states.code}>{ states.state }</option>))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>Postal code</Form.Label>
                            <Form.Control type="text" placeholder="Enter postal code" ref={ postalCodeRef } defaultValue={currentUserProfile?.postalCode}></Form.Control>
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