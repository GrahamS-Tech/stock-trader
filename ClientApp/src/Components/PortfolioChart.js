import React from "react";
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import monitor from "../Components/Assets/Images/stock-chart.jpg";
export default function PortfolioChart() {

    return (
        <>
            <h3 className="m-2">$10,459.67</h3>
            <h5 className="m-2">+10% Today</h5>
            <div className="d-block justify-content-center">
                <img className="img-fluid" src={monitor} alt="chart placeholder"></img>
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
        </>
    )
}