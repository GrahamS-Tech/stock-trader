import React, { useRef, useState, useEffect, useCallback } from "react";
import { Form, ButtonGroup, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import { getAllAccounts, addAccount, deactivateAccount } from '../Adapters/BankingDetail';
import { addFiatTransaction } from '../Adapters/FiatTransaction'
import { getFiatBalanceByCurrency } from '../Adapters/FiatHolding'
import { formatCurrency } from '../Adapters/StringToCurrency'

export default function BankingDetails() {
    const [userBankAccounts, setUserBankAccounts] = useState([]);
    const { currentUser } = useAuth();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [depositOrWithdraw, setDepositOrWithdraw] = useState("");
    const [currentFiatBalance, setCurrentFiatBalance] = useState("$0.00");
    let accountTypeRef = useRef();
    let accountNumberRef = useRef();
    let confirmaccountNumberRef = useRef();
    let routingNumberRef = useRef();
    let accountNameRef = useRef();
    let transferAccountRef = useRef();
    let transferAmountRef = useRef();

    const loadAccounts = useCallback(async() => { 
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
    }, [])

    const getFiatBalance = useCallback(async () => {
        getFiatBalanceByCurrency(currentUser, "USD")
            .then((response) => {
                if (response.Status === "success") {
                    const formattedCurrency = formatCurrency(response.Data);
                    setCurrentFiatBalance(formattedCurrency)
                }
                else {
                    console.error(response.Message)
                    setError("Unable to retrieve balance")
                }
            })
            .catch((err) => {
                console.error(err)
                setError("Unable to retrieve balance")
            });
    }, [])

    useEffect(() => {
        loadAccounts();
        getFiatBalance();
    }, [loadAccounts, getFiatBalance])

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
            "AccountName": accountNameRef.current.value,
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
                loadAccounts();
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

    async function moveFunds(e) {
        e.preventDefault();
        if (!depositOrWithdraw) {
            setError("Deposit or withdraw?")
            return
        }

        const details = JSON.stringify({
            "Currency": "USD",
            "Value": transferAmountRef.current.value,
            "TransactionType": depositOrWithdraw,
            "AccountNumber": transferAccountRef.current.value
        })
        console.log(transferAccountRef.current.value)

        try {
            const response = await addFiatTransaction(currentUser, details)
            if (response.Status === "success") {
                setSuccess("Transaction successfully submitted")
            }
            else {
                console.error(response.Message)
                setError("Unable to complete transaction")
            }
        } catch (err) {
            console.error(err)
            setError("Unable to complete transaction")
        } 
    }

    function handleDepositWithdrawChange(e) {
        if (error === "Deposit or withdraw?") setError("");
        setDepositOrWithdraw(e.target.value)
    }

    if (loading) return (
        <div className="container-fluid w-50 justify-content-center">
            <Alert variant="primary" className="text-center">Getting account details...</Alert>
        </div>
    );

    return (
        <div>
            <h3>Transfer Funds</h3>
            <h4 className="ms-3">{ currentFiatBalance? currentFiatBalance : "Unable to load balance" }</h4>
            <Form className="m-3" onSubmit={moveFunds}>
                <ButtonGroup className="mb-2" onClick={handleDepositWithdrawChange}>
                    <Button name="group1" variant={depositOrWithdraw === "Deposit" ? "primary" : "secondary"} value="Deposit">Deposit</Button>
                    <Button name="group1" variant={depositOrWithdraw === "Withdraw" ? "primary" : "secondary"} value="Withdraw">Withdraw</Button>
                </ButtonGroup>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label>Select account</Form.Label>
                        <Form.Select ref={transferAccountRef} required>
                            {userBankAccounts && userBankAccounts.map((accounts) => (
                                <option key={accounts.AccountNumber} value={accounts.AccountNumber}>{accounts.AccountName} - {accounts.AccountNumber}</option>))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Amount to transfer</Form.Label>
                        <Form.Control ref={transferAmountRef} required type="number" step={0.01}></Form.Control>
                        </Form.Group>
                </Row>
                <Button className="m-2" type="submit" variant="primary">Transfer</Button>
            </Form>
            <br></br>
            {success && <Alert variant="success" className="text-center">{success}</Alert>}
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <h3>Banking Detials</h3>
            <Table className="m-3">
                <thead>
                    <tr>
                        <th>Account type</th>
                        <th>Account name</th>
                        <th>Account number</th>
                        <th>Routing number</th>
                        <th className="text-center">Remove account</th>
                    </tr>
                </thead>
                <tbody>
                    {!userBankAccounts.length && <tr><td className="text-center" colSpan={5}>No accounts have been added</td></tr>}
                    {userBankAccounts && userBankAccounts.map((accounts) => (
                        <tr key={accounts.Id}>
                            <td>{accounts.AccountType}</td>
                            <td>{accounts.AccountName}</td>
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
            <Form className="m-3" onSubmit={handleAddAccount}>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label>Account type</Form.Label>
                        <Form.Select ref={accountTypeRef} required>
                            <option>Select...</option>
                            <option>Checking</option>
                            <option>Savings</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Routing number</Form.Label>
                        <Form.Control ref={routingNumberRef} type="text" placeholder="Enter routing number" required></Form.Control>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label>Account name</Form.Label>
                        <Form.Control ref={accountNameRef} type="text" placeholder="Enter a name for account" required></Form.Control>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                        <Form.Group as={Col}>
                            <Form.Label>Account number</Form.Label>
                            <Form.Control ref={accountNumberRef} type="text" placeholder="Enter account number" required></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Confirm account number</Form.Label>
                            <Form.Control ref={confirmaccountNumberRef} type="text" placeholder="Re-enter account number" required></Form.Control>
                        </Form.Group>

                </Row>
                <Button className="m-2" variant="primary" type="submit">Add</Button>
            </Form>
        </div>
    )
}