import React, { useState, useEffect } from 'react';
import { Table, Alert, ButtonGroup, Button, ButtonToolbar } from "react-bootstrap";
import { refreshTopMovers } from "../Adapters/StockData";
import { useAuth } from "./AuthContext";

export default function TopMovers() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tableFilter, setTableFilter] = useState("Gainer")
    const [tableSelection, setTableSelection] = useState([])

    useEffect(() => {
        const getMoverData = async() => {
            setError("")
            setLoading(true)
            try {
                const updateTableData = await refreshTopMovers(currentUser)
                setTableSelection(updateTableData.filter(i => i.mover_category ===tableFilter))
            } catch (err) {
                console.error(err)
                setError("Unable to load top movers. Try again later")
            } finally {
                setLoading(false)
            }
        }
        getMoverData();
    }, [currentUser, tableFilter]);

    function handleTableFilter(e) {
        setTableFilter(e.target.value)
    }

    if (loading) return <Alert className="text-center" variant="primary">Getting top movers...</Alert>;
    if (error) return <Alert className="text-center" variant="danger">There was a problem getting top movers...</Alert>;

    return (
        <>
            <h3>Top {tableFilter}s</h3>
            <ButtonToolbar className="my-2">
                <ButtonGroup onClick={handleTableFilter} className="mx-auto" aria-label="Top chart selection group">
                    <Button variant={tableFilter === "Gainer" ? "primary" : "secondary"} value="Gainer">Gainers</Button>
                    <Button variant={tableFilter === "Loser" ? "primary" : "secondary"}  value="Loser">Losers</Button>
                    <Button variant={tableFilter === "Mover" ? "primary" : "secondary"}  value="Mover">Movers</Button>
                </ButtonGroup>
            </ButtonToolbar>
            <Table size="sm">
                <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Percent</th>
                </tr>
                </thead>
                <tbody>
                {tableSelection.map((item) => (
                    <tr key={item.ticker}>
                        <td>{item.ticker}</td>
                        <td>{item.price}</td>
                        <td>{item.change_amount}</td>
                        <td>{item.change_percentage}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}