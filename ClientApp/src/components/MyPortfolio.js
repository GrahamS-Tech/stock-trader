import React from 'react';
import { ButtonToolbar, ButtonGroup, Button, Table } from 'react-bootstrap';

//View my current holdings
//Search for new stocks

export default function MyPortfolio() {
    return (
        < div className="container-fluid w-50 justify-content-center">
            <h3 className="m-2">$10,857.39</h3>
            <h5 className="m-2">+10% Today</h5>
            <div className="d-block justify-content-center">
                <ButtonToolbar className="my-2">
                    <ButtonGroup className="mx-auto" aria-label="Date range group">
                        <Button variant="secondary">d</Button>
                        <Button variant="secondary">w</Button>
                        <Button variant="secondary">m</Button>
                        <Button variant="secondary">ytd</Button>
                        <Button variant="secondary">y</Button>
                        <Button variant="secondary">all</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
            <hr></hr>
            <div>
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
                            <td className="text-center" colSpan={4}>No items in your portfolio</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <hr></hr>
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
                            <td className="text-center" colSpan={4}>No items in your watch list</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}