import React, { useState } from "react";
import { Modal, Alert, ButtonGroup, Button, Form } from "react-bootstrap";

export default function TradeSharesModal(props) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [buyOrSell, setBuyOrSell] = useState("");

    function handleChange(e) {
        if (error === "Buy or sell?") setError(""); 
        setBuyOrSell(e.target.value)
    }

    function handleTrade(e) {
        e.preventDefault();
        if (!buyOrSell) {
            setError("Buy or sell?")
        }
    }

    return (
        <>
            <Modal show={props.isModalOpen} onHide={() => { setBuyOrSell(""); props.closeTradeModal(); }}>
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
                            <ButtonGroup onClick={handleChange}>
                                <Button name="group1" variant={buyOrSell == "Buy" ? "success" : "secondary" } value="Buy">Buy</Button>
                                <Button name="group1" variant={buyOrSell == "Sell" ? "success" : "secondary"} value="Sell">Sell</Button>
                            </ButtonGroup>
                        <Form.Group>
                            <Form.Label>Shares to trade</Form.Label>
                            <Form.Control disabled type="text" value={props.selectedTicker}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Number of shares</Form.Label>
                            <Form.Control required type="number" step={ 0.1 }></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Market Price</Form.Label>
                            <Form.Control disabled type="text"></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Estimated cost</Form.Label>
                            <Form.Control disabled type="text"></Form.Control>
                        </Form.Group>
                        <Button className="m-2" variant="success" type="submit">Trade</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
);
}