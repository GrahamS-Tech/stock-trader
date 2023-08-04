import React from "react";
import { Table, Button } from 'react-bootstrap';

export default function PortfolioTable() {

    return (
        <>
            <h3>My portfolio</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Shares</th>
                        <th>Value</th>
                        <th>Trade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center" colSpan={4}><Button variant="success">Buy</Button></td>
                    </tr>
                </tbody>
            </Table>
        </>
)
}