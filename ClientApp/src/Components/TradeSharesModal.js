import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Alert, ButtonGroup, Button, Form } from "react-bootstrap";
import { getLastClose } from "../Adapters/StockData";
import { formatCurrency } from "../Adapters/StringToCurrency"
import { useAuth } from "./AuthContext";
import { addTransaction } from "../Adapters/Transaction"

export default function TradeSharesModal(props) {
    const { currentUser } = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    //combine state objects into one state object
    const [buyOrSell, setBuyOrSell] = useState("");
    const [marketPrice, setMarketPrice] = useState(0);
    const [formattedMarketPrice, setFormattedMarketPrice] = useState("");
    const sharesRef = useRef(0);
    const [estimatedCost, setEstimatedCost] = useState(null);

    const getPrice = useCallback(async() => {
        try {
            const lastClose = await getLastClose(props.selectedTicker)
            setMarketPrice(lastClose);
            setFormattedMarketPrice(formatCurrency(lastClose));
        } catch (err) {
            setError("Can't get price. Try again later")
            console.error(err)
        }
    }, [props.selectedTicker])

    useEffect(() => {
        if (props.isModalOpen) { 
            getPrice();
        }
    },[props.isModalOpen])

    function handleBuySellChange(e) {
        if (error === "Buy or sell?") setError(""); 
        setBuyOrSell(e.target.value)
    }

    function handleClose() {
        setError("");
        setSuccess("");
        setBuyOrSell("");
        setMarketPrice(0)
        setFormattedMarketPrice("")
        setEstimatedCost("")
        props.closeTradeModal();
    }

    async function handleTrade(e) {
        e.preventDefault();
        if (!buyOrSell) {
            setError("Buy or sell?")
            return
        }

        let shares = buyOrSell === "Buy" ? sharesRef.current.value : (sharesRef.current.value * -1)
        const transactionType = buyOrSell === "Buy" ? "bought" : "sold"

        const details = JSON.stringify({
            "Ticker": props.selectedTicker,
            "Shares": shares,
            "TransactionType": buyOrSell,
            "MarketValue": marketPrice,
            "ShareName": props.selectedName
        })

        try {
            const response = await addTransaction(currentUser, details)
            if (response.Status === "success") {
                setSuccess(`${sharesRef.current.value} share(s) of ${props.selectedTicker} has successfully been ${transactionType}`)
            } else {
                console.error(response.Message)
                setError("Unable to complete transaction")
            }
            return
        } catch (err) {
            console.error(err)
            setError("Unable to complete transaction")
        }
    }

    function handleSharesChange() {
        if (sharesRef.current.value) {
            setEstimatedCost(formatCurrency(marketPrice * sharesRef.current.value))
        }
    }



    return (
        <>
            <Modal show={props.isModalOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                    <div className="container-fluid justify-content-center">
                        <Modal.Title>
                            New Trade
                        </Modal.Title>
                        {success && <Alert variant="success" className="text-center">{success}</Alert>}
                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleTrade}>
                            <ButtonGroup onClick={handleBuySellChange}>
                                <Button name="group1" variant={buyOrSell === "Buy" ? "success" : "secondary" } value="Buy">Buy</Button>
                                <Button name="group1" variant={buyOrSell === "Sell" ? "success" : "secondary"} value="Sell">Sell</Button>
                            </ButtonGroup>
                        <Form.Group>
                            <Form.Label>Shares to trade</Form.Label>
                            <Form.Control disabled type="text" value={props.selectedTicker}></Form.Control>
                            <Form.Control disabled type="text" value={props.selectedName}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Number of shares</Form.Label>
                            <Form.Control onChange={ handleSharesChange } required type="number" step={0.1} ref={ sharesRef }></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Market Price</Form.Label>
                            <Form.Control disabled type="text" value={  formattedMarketPrice }></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Estimated cost</Form.Label>
                            <Form.Control disabled type="text" value={ estimatedCost }></Form.Control>
                        </Form.Group>
                        <Button className="m-2" variant="success" type="submit">Trade</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
);
}