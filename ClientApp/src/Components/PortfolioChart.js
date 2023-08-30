import React, { useState, useEffect, useCallback } from "react";
import { ButtonToolbar, ButtonGroup, Button, Form } from 'react-bootstrap';
import { Chart } from "react-google-charts";
import { getDailyPriceHistory } from "../Adapters/StockData"
export default function PortfolioChart(props) {
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
    let regularHours = []

    function buildChartData() {
        //Handle 'market is closed'
        const now = new Date();
        const time = now.getTime();
        let marketOpen = new Date();
        let marketClose = new Date();
        if (hoursToggle) {
            time.setHours(4, 0, 0)
            marketOpen = Date(time).toLocaleString('en-US', { timeZone: "America/New_York" });
            time.setHours(20, 0, 0)
            marketClose = Date(time).toLocaleString('en-US', { timeZone: "America/New_York" });
        }
        else {
            time.setHours(9, 0, 0)
            marketOpen = Date(time).toLocaleString('en-US', { timeZone: "America/New_York" });
            time.setHours(16, 0, 0)
            marketClose = Date(time).toLocaleString('en-US', { timeZone: "America/New_York" });
        }


        let startPrice = 5
        let regularHours = [[
            { type: "string", label: "Time" },
            { type: "number", label: "Values" },
            //Intervals not needed for this type of chart
            //{ id: "high", type: "number", role: "interval" },
            //{id: "low", type: "number", role: "interval"},
        ]];
        //Loop through holdings:
        //If shares = 0 and last transaction date is before market open, skip
        props.holdings.map(async (holding) => {
            //1.If last transaction date in est is before market open, then
            const lastTransactionInEastern = new Date(holding.LastTransactionDate).toLocaleString('en-US', { timeZone: "America/New_York" });
            console.log(holding.LastTransactionDate)
            console.log(lastTransactionInEastern)
            console.log(marketOpen)
            if (holding.Shares !== 0 && lastTransactionInEastern < marketOpen) {
            console.log("if is running")
                //pull stock data for share
                const marketData = await getDailyPriceHistory(holding.Ticker)
                console.log(marketData)
            }
        })
        //match timestamp to current time entry in market data array, multiply close price by shares
        while (marketOpen <= marketClose) {
            //else (there has been a transaction since current time entry) then
            //pull transactions occuring between last time entry and current time entry, 
            //sum shares from transactions, add to current holding shares, multiply result by matching close price
            regularHours.push([marketOpen.toLocaleTimeString("en-US", { hour12: true, timeStyle: "short" }), startPrice])
            marketOpen.setMinutes(marketOpen.getMinutes() + 15)
        }
    }

    buildChartData();

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
            <Chart chartType="LineChart" width="100%" height="500px" data={regularHours ? regularHours : null} options={chartOptions}>
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

