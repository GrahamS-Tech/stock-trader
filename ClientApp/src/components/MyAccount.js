import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Table, Alert } from 'react-bootstrap'
import { useAuth } from  "./AuthContext"
import state_data from './Assets/state_data.json'
import { getProfileData, profileUpdate } from '../Adapters/Profile';
import { getAllAccounts, addAccount, deactivateAccount } from '../Adapters/BankingDetail'

export default function MyAccount() {
    const [currentUserProfile, setCurrentUserProfile] = useState([]);
    const [userBankAccounts, setUserBankAccounts] = useState([])
    const { currentUser } = useAuth()
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("");
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
    let accountTypeRef = useRef()
    let accountNumberRef = useRef()
    let confirmaccountNumberRef = useRef()
    let routingNumberRef = useRef()

    useEffect(() => {
        setError("")
        setLoading(true)
        getProfileData(currentUser)
            .then((response) => {
                if (response.Status === "success") {
                    console.log(response.Data)
                    setCurrentUserProfile(response.Data)
                }
                else {
                    console.error(response.Message)
                    setError("Unable to load account details")
                }
            })
            .catch((err) => {
                console.error(err)
                setError(setError("Unable to load account details"))
            });
        getAllAccounts(currentUser)
            .then((response) => {
                if (response.Status === "success") {
                    setUserBankAccounts(response.Data)
                }
                else {
                    console.error(response.Message)
                    setError("Unable to load account details")
                }
            })
            .catch((err) => {
                console.error(err)
                setError("Unable to load account details")
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
            const response = await profileUpdate(currentUser, details)
            if (response.Status === "success") {
                setSuccess("Account details updated")
            }
            else {
                console.log(response.Message)
                setError("Unable to update account details")
            }
        } catch (err) {
            console.error(err)
            setError("Unable to update account details")
        }
    }

    async function handleAddAccount(e) {
        e.preventDefault();

        if (accountNumberRef.current.value !== confirmaccountNumberRef.current.value) {
            setError("Account numbers do not match")
            return
        }

        const details = JSON.stringify({
            "AccountType": accountTypeRef.current.value,
            "AccountNumber": accountNumberRef.current.value,
            "RoutingNumber": routingNumberRef.current.value
        });

        try {
            const response = await addAccount(currentUser, details)
            if (response.Status === "success") {
                setSuccess("Account added successfully")
            }
            else {
                console.error(response.Message)
                setError("Unable to add account")
            }
            return
        } catch (err) {
            console.error(err)
            setError("Unable to add account")
        }
    }

    async function handleAccountDelete(e) {
        e.preventDefault();
        const details = Number(e.target.id)
        try {
            const response = await deactivateAccount(currentUser, details)
            if (response.Status === "success") {
                setSuccess("Account removed successfully")
            }
            else {
                console.error(response.Message)
                setError("Unable to remove account")
            }
            return
        } catch (err) {
            console.error(err)
            setError("Unable to remove account")
        }
    }

    if (loading) return <div className="container-fluid w-50 justify-content-center"><Alert variant="primary" className="text-center">Getting account details...</Alert></div>;

    return (
        <div className="container-fluid w-50 justify-content-center">
            <br></br>
            <div>
                {success && <Alert variant="success" className="text-center">{success}</Alert>}
                {error && <Alert variant="danger" className="text-center">{ error }</Alert>}
                {!currentUserProfile?.ProfileComplete && <Alert variant="danger" className="text-center">You must complete your profile before making a trade</Alert>}
            </div>
            <h3>My Account</h3>
            <Form onSubmit={handleUpdate} >
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" ref={ firstNameRef } defaultValue={currentUserProfile?.FirstName} required></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name" ref={ lastNameRef } defaultValue={currentUserProfile?.LastName} required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>E-mail address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" ref={ emailAddressRef } defaultValue={currentUserProfile?.EmailAddress} required></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>Address 1</Form.Label>
                        <Form.Control type="text" placeholder="Enter address" ref={ address1Ref } defaultValue={currentUserProfile?.Address1} required></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group className="m-2">
                        <Form.Label>Address 2</Form.Label>
                        <Form.Control type="text" placeholder="Enter address" ref={ address2Ref } defaultValue={currentUserProfile?.Address2}></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="Enter city" ref={ cityRef } defaultValue={currentUserProfile?.City}></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>State</Form.Label>
                            <Form.Select ref={stateRef} defaultValue={currentUserProfile?.State}>
                                {state_data.map((states) => (
                                    <option key={states.code} value={states.code}>{ states.state }</option>))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-lg-4">
                        <Form.Group className="m-2">
                            <Form.Label>Postal code</Form.Label>
                            <Form.Control type="text" placeholder="Enter postal code" ref={ postalCodeRef } defaultValue={currentUserProfile?.PostalCode}></Form.Control>
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
                        <th>Remove Account</th>
                    </tr>
                </thead>
                <tbody>
                    {!userBankAccounts.length && <tr><td className="text-center" colSpan={4}>No accounts have been added</td></tr>}
                    {userBankAccounts && userBankAccounts.map((accounts) => (
                        <tr key={ accounts.Id }>
                            <td>{accounts.AccountType}</td>
                            <td>{accounts.AccountNumber}</td>
                            <td>{accounts.RoutingNumber}</td>
                            <td className="text-center">
                                <button
                                    id={accounts.Id}
                                    onClick={handleAccountDelete}
                                    className="btn btn-sm btn-danger">
                                    X
                                </button>
                            </td>
                        </tr>

                    )) }
                </tbody>
            </Table>
            <br></br>
            <h3>Add account</h3>
            <Form onSubmit={ handleAddAccount }>
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Account type</Form.Label>
                            <Form.Select ref={ accountTypeRef } required>
                                <option>Select...</option>
                                <option>Checking</option>
                                <option>Savings</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Routing number</Form.Label>
                            <Form.Control ref={ routingNumberRef } type="text" placeholder="Enter routing number" required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Account number</Form.Label>
                            <Form.Control ref={ accountNumberRef } type="text" placeholder="Enter account number" required></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Confirm account number</Form.Label>
                            <Form.Control ref={ confirmaccountNumberRef } type="text" placeholder="Re-enter account number" required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <Button className="m-2" variant="primary" type="submit">Add</Button>
            </Form>
        </div>
    );
}