import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Alert } from 'react-bootstrap';
import { getAllHoldings } from "../Adapters/Holding"
import { getLastClose } from "../Adapters/StockData"
import { useAuth } from "./AuthContext"

export default function PortfolioTable() {
    const { currentUser } = useAuth()
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [holdings, setHoldings] = useState([])

    const loadHoldings = useCallback(async () => {
        setError("")
        setLoading(true)
        try {
            const response = await getAllHoldings(currentUser)
            //let holdingsWithPrice = "";
            if (response.Status === "success" && response.Data != null) {
                try {
                    const holdingsWithPrice = await Promise.all(response.Data.map(async (i) => {
                        const closePrice = await getLastClose(i.Ticker)
                        console.log(closePrice)
                        Object.assign(i, { Price: closePrice })
                    }));
                    console.log(holdingsWithPrice)
                } catch (err) {
                    console.error(err)
                } finally {
                //setHoldings(holdingsWithPrice)
                console.log("Line afer setState")
                }
            }
            else {
                console.error(response.Message)
                setError("Unable to load holdings")
            }
        } catch (err) {
            console.error(err)
            setError("Unable to load holdings")
        } finally {
            setLoading(false)
            console.log(holdings)
            console.log("finally...")
        }
    }, [])

    useEffect(() => {
        loadHoldings()
    }, [loadHoldings])

    if (loading) return (
        <div className="container-fluid w-50 justify-content-center">
            <Alert variant="primary" className="text-center">Getting your portfolio...</Alert>
        </div>
    );

    return (
        <>
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <h3>My portfolio</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th className="text-center">Shares</th>
                        <th className="text-center">Value</th>
                        <th className="text-center">Trade</th>
                    </tr>
                </thead>
                <tbody>
                    {!holdings.length &&
                        <tr>
                            <td className="text-center" colSpan={6}>No items in your portfolio</td>
                        </tr>}
                    {holdings && holdings.map((items) => (
                        <tr key={items.Id}>
                            <td>{items.Ticker}</td>
                            <td>{items.Name}</td>
                            <td>{items.Price ? items.Price : "Loading..."}</td>
                            <td className="text-center">{ items.Shares }</td>
                            <td className="text-center">{items.Price? items.Price * items.Shares : "Loading..."}</td>
                            <td className="text-center"><Button id={items.Id} variant="success" size="sm">Trade</Button></td>
                        </tr>
                    ))}
                    <tr>
                        <td className="text-center" colSpan={6}><Button variant="success">Buy</Button></td>
                    </tr>
                </tbody>
            </Table>
        </>
)
}