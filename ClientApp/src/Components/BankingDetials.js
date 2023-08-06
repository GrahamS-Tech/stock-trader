import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Table, Alert } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import { getAllAccounts, addAccount, deactivateAccount } from '../Adapters/BankingDetail';

export default function BankingDetails() {
    const [userBankAccounts, setUserBankAccounts] = useState([])
    const { currentUser } = useAuth()
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    let accountTypeRef = useRef()
    let accountNumberRef = useRef()
    let confirmaccountNumberRef = useRef()
    let routingNumberRef = useRef()

    async function loadAccounts() {
        setError("")
        setLoading(true)
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
    }

    useEffect(() => {
        setError("")
        setLoading(true)
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

    async function handleAddAccount(e) {
        e.preventDefault();
        setError("")
        setSuccess("")
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
                loadAccounts()
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
        setError("")
        setSuccess("")
        const details = Number(e.target.id)
        try {
            const response = await deactivateAccount(currentUser, details)
            if (response.Status === "success") {
                setSuccess("Account removed successfully");
                setUserBankAccounts(userBankAccounts.filter(account => account.Id !== details));
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

    if (loading) return (
        <div className="container-fluid w-50 justify-content-center">
            <Alert variant="primary" className="text-center">Getting account details...</Alert>
        </div>
    );

    return (
        <div>
            {success && <Alert variant="success" className="text-center">{success}</Alert>}
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <br></br>
            <h3>Banking Detials</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Account type</th>
                        <th>Account number</th>
                        <th>Routing number</th>
                        <th className="text-center">Remove Account</th>
                    </tr>
                </thead>
                <tbody>
                    {!userBankAccounts.length && <tr><td className="text-center" colSpan={4}>No accounts have been added</td></tr>}
                    {userBankAccounts && userBankAccounts.map((accounts) => (
                        <tr key={accounts.Id}>
                            <td>{accounts.AccountType}</td>
                            <td>{accounts.AccountNumber}</td>
                            <td>{accounts.RoutingNumber}</td>
                            <td className="text-center">
                                <Button
                                    id={accounts.Id}
                                    onClick={handleAccountDelete}
                                    className="btn btn-sm btn-danger"
                                    size="sm">
                                    X
                                </Button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
            <br></br>
            <h3>Add account</h3>
            <Form onSubmit={handleAddAccount}>
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Account type</Form.Label>
                            <Form.Select ref={accountTypeRef} required>
                                <option>Select...</option>
                                <option>Checking</option>
                                <option>Savings</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Routing number</Form.Label>
                            <Form.Control ref={routingNumberRef} type="text" placeholder="Enter routing number" required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Account number</Form.Label>
                            <Form.Control ref={accountNumberRef} type="text" placeholder="Enter account number" required></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-lg-6">
                        <Form.Group className="m-2">
                            <Form.Label>Confirm account number</Form.Label>
                            <Form.Control ref={confirmaccountNumberRef} type="text" placeholder="Re-enter account number" required></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <Button className="m-2" variant="primary" type="submit">Add</Button>
            </Form>
        </div>
    )
}