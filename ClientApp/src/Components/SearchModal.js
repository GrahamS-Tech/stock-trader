import React, { useState } from "react";
import { Modal, Alert, ListGroup, Form } from "react-bootstrap";
import { addWatchListItem } from "../Adapters/WatchList";

export default function SearchModal(props) {
    const [searchResult, setSearchResult] = useState({})
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    async function handleAdd(e) {
        e.preventDefault();
        const entry = searchResult.filter(item => item['1. symbol'] === e.target.id)[0]
        setError("")
        setSuccess("")
        const details = JSON.stringify({
            "Ticker": entry['1. symbol'],
            "Name": entry['2. name']
        })
        try {
            const response = await addWatchListItem(props.currentUser, details)
            if (response.Status === "success") {
                setSuccess(`${entry['1. symbol']} has been added to your watch list`);
            }
            else {
                console.error(response.Message)
                setError("Unable to add item to your watch list")
            }
            return
        } catch (err) {
            console.error(err)
            setError("Unable to add item to your watch list")
        }
    }

    async function handleChange(e) {

        let debounceTimer;

        if (e.target.value) {

            const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${e.target.value}&apikey={apiKey}`

            clearTimeout(debounceTimer)

            debounceTimer = setTimeout(async() => {
                try {
                    const response = await fetch(url, {
                        headers: {
                            "User-Agent": "request"
                        }
                    });
                    const result = await response.json();
                    await setSearchResult(result.bestMatches)
                    console.log(url)
                    console.log(result.bestMatches)
                } catch (err) {
                    console.error(err)
                }
            }, 300);
        }
    }

    return (
    <>
        <Modal show={props.isModalOpen} onHide={() => { setSearchResult({}); props.closeSearchModal(); }}>
            <Modal.Header closeButton>
                <div className="container-fluid justify-content-center">
                    {success && <Alert variant="success" className="text-center">{success}</Alert>}
                    {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                    <Modal.Title>
                        Add to your Watchlist
                    </Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>Search</Form.Label>
                <Form.Control type="text" onChange={handleChange}></Form.Control>
                <Form.Text>Seach by company name or ticker symbol</Form.Text>
                <ListGroup>
                    {(searchResult && searchResult.length) && searchResult.map((result) => (
                        <ListGroup.Item onClick={handleAdd} id={result['1. symbol']}>{result['1. symbol']} : {result['2. name']}</ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
        </Modal>
    </>
    )
}
