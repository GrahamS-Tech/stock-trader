import React from "react";
import { Table, Button } from 'react-bootstrap';

export default function WatchListTable() {

    return (
        <div>
            <h3>My watch list</h3>
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
                        <td className="text-center" colSpan={4}><Button variant="success">Add</Button></td>
                    </tr>
                </tbody>
            </Table>
        </div>
)
}