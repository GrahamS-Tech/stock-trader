import React, { useState, useEffect, useCallback } from "react";
import { ButtonToolbar, ButtonGroup, Button, Form } from 'react-bootstrap';
import { Chart } from "react-google-charts";
export default function PortfolioChart() {
    const [chartDateRange, setChartDateRange] = useState("D");
    const [hoursToggle, setHoursToggle] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    //const chartData = useCallback(async () => {
    //    setError("");
    //    setLoading(true)
    //    try {

    //    } catch (err) {
    //        console.error(err)
    //        setError(err)
    //    }
    //}, [])

    const now = new Date();
    const time = now.getTime();
    let marketOpen = new Date(time);
    let marketClose = new Date(time);
    if (hoursToggle) {
        marketOpen.setHours(4, 0, 0)
        marketOpen.setHours(20, 0, 0)
    }
    else {
        marketOpen.setHours(9, 0, 0)
        marketClose.setHours(16, 0, 0)
    }
    let startPrice = 5
    let regularHours = [[
        { type: "string", label: "Time" },
        { type: "number", label: "Values" },
        { id: "high", type: "number", role: "interval" },
        {id: "low", type: "number", role: "interval"},
    ]];
    while (marketOpen <= marketClose) {
        regularHours.push([marketOpen.toLocaleTimeString("en-US", {hour12: true,timeStyle: "short" }), startPrice, startPrice +10, startPrice -10])
        marketOpen.setMinutes(marketOpen.getMinutes() + 15)
        startPrice = startPrice + 5
    }

    const chartOptions = {
        legend: { position: "none" },
        vAxis: { format: "currency" },
        intervals: { lineWidth: 1, barWidth: 1, style: "boxes" }
    }

    function handleChartDateRangeChange(e) {
        setChartDateRange(e.target.value)
    }

    const handleHoursToggle = (e) =>  {
        setHoursToggle(e.target.checked)
    }

    return (
        <>
            <h3 className="m-2">$10,459.67</h3>
            <h5 className="m-2">+10% Today</h5>
            <Chart chartType="LineChart" width="100%" height="500px" data={regularHours} options={chartOptions}>
            </Chart>
            <div className="d-block justify-content-center">
                <ButtonToolbar className="my-2">
                    <ButtonGroup onClick={handleChartDateRangeChange} className="mx-auto" aria-label="Date range group">
                        <Button variant={chartDateRange === "D" ? "success" : "secondary"} value="D">D</Button>
                        <Button variant={chartDateRange === "W" ? "success" : "secondary"} value="W">W</Button>
                        <Button variant={chartDateRange === "M" ? "success" : "secondary"} value="M">M</Button>
                        <Button variant={chartDateRange === "YTD" ? "success" : "secondary"} value="YTD">YTD</Button>
                        <Button variant={chartDateRange === "Y" ? "success" : "secondary"} value="Y">Y</Button>
                        <Button variant={chartDateRange === "All" ? "success" : "secondary"} value="All">All</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {chartDateRange === "D" ? <Form.Switch label="Extended hours" onChange={handleHoursToggle} checked={hoursToggle} /> : null}
            </div>
        </>
    )
}

