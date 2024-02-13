import React, {useState} from 'react'
import { useAuth } from "./AuthContext";
import {Button, Dropdown, Table} from "react-bootstrap";

export default function TopMovers() {
    const {currentUser} = useAuth();
    const [loading, setLoading] = useState();

    return (
        <div>
            <h3>Top Movers</h3>
            <Dropdown>
                <Dropdown.Toggle variant="secondary"></Dropdown.Toggle>
                <Dropdown.Menu style={{overflowY: "scroll", maxHeight: "400px"}}>
                    <Dropdown.Item key="top_gainers">Top Gainers</Dropdown.Item>
                    <Dropdown.Item key="top_losers">Top Losers</Dropdown.Item>
                    <Dropdown.Item key="most_traded">Most Traded</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Table>
                <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th></th>
                    <th className="text-center">Watch</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </Table>
        </div>
    )
}