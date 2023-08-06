import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, ListGroup, Alert } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import { getAllWatchListItems, addWatchListItem, deactivateWatchListItem } from '../Adapters/WatchList';

export default function WatchListTable() {
    const { currentUser } = useAuth()
    const [show, setShow] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [watchList, setWatchList] = useState([])
    const [searchResult, setSearchResult] = useState({})
    const handleClose = () => (setShow(false), setSearchResult({}))
    const handleShow = () => (setShow(true), setSuccess(""), setError(""))

    async function loadWatchList() {
        setError("")
        setLoading(true)
        getAllWatchListItems(currentUser)
            .then((response) => {
                if (response.Status === "success") {
                    setWatchList(response.Data)
                }
                else {
                    console.error(response.Message)
                    setError("Unable to load watch list")
                }
            })
            .catch((err) => {
                console.error(err)
                setError("Unable to load watch list")
            })
            .finally(() => {
                setLoading(false)
            });
    }

    useEffect(() => {
        setError("")
        setLoading(true)
        getAllWatchListItems(currentUser)
            .then((response) => {
                if (response.Status === "success") {
                    setWatchList(response.Data)
                }
                else {
                    console.error(response.Message)
                    setError("Unable to load watch list")
                }
            })
            .catch((err) => {
                console.error(err)
                setError("Unable to load watch list")
            })
            .finally(() => {
                setLoading(false)
            });
    }, [currentUser])
    async function handleChange(e) {

        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${e.target.value}&apikey={apiKey}`

        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "request"
                }
            });
            const result = await response.json();
            await setSearchResult(result.bestMatches)
        } catch (err) {
            console.error(err)
        }
    }

   async function handleAdd(e) {
        e.preventDefault();

       const entry = searchResult.filter(item => item['1. symbol'] === e.target.id)[0]
       console.log(entry['1. symbol'])
        setError("")
        setSuccess("")
        const details = JSON.stringify({
            "Ticker": entry['1. symbol'],
            "Name": entry['2. name']
        })
        try {
            const response = await addWatchListItem(currentUser, details)
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

    async function handleRemove(e) {
        e.preventDefault();
        setError("")
        setSuccess("")
        const details = Number(e.target.id)
        try {
            const response = await deactivateWatchListItem(currentUser, details)
            if (response.Status === "success") {
                setSuccess("Item removed from your watch list");
            }
            else {
                console.error(response.Message)
                setError("Unable to remove item from your watch list")
            }
        } catch (err) {
            console.error(err)
            setError("Unable to remove item from your watch list")
        } finally {
            loadWatchList();
        }
    }

    if (loading) return (
        <div className="container-fluid w-50 justify-content-center">
            <Alert variant="primary" className="text-center">Getting watch list items...</Alert>
        </div>
    );

    return (
        <>
            <div>
                {success && <Alert variant="success" className="text-center">{success}</Alert>}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <h3>My watch list</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th className="text-center">Trade</th>
                        <th className="text-center">Remove</th>
                    </tr>
                </thead>
                    <tbody>
                        {!watchList.length && <tr>
                            <td className="text-center" colSpan={5}>No items in your watch list</td>
                        </tr>}
                        {watchList && watchList.map((items) => (
                            <tr key={items.Id}>
                                <td>{ items.Ticker }</td>
                                <td>{ items.Name }</td>
                                <td>{ items.Price }</td>
                                <td className="text-center">
                                    <Button id={items.Id} variant="success" size="sm">Trade</Button>
                                </td>
                                <td className="text-center">
                                    <Button id={items.Id} variant="danger" size="sm" onClick={handleRemove}>X</Button>
                                </td>
                            </tr>
                        ))}
                    <tr>
                        <td className="text-center" colSpan={5}><Button variant="success" onClick={handleShow}>Add</Button></td>
                    </tr>
                </tbody>
            </Table>
            </div>
            <Modal show={show} onHide={handleClose}>
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
                        {searchResult.length && searchResult.map((result) => (
                            <ListGroup.Item onClick={ handleAdd } id={result['1. symbol']}>{result['1. symbol']} : {result['2. name'] }</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
            </Modal>
        </>
)
}