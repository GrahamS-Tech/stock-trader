import React, {useState, useEffect, useCallback, useTransition} from "react";
import { useAuth } from "./AuthContext";
import {ButtonToolbar, ButtonGroup, Button, Form, Alert} from 'react-bootstrap';
import { Chart } from "react-google-charts";
import { refreshDailyPriceHistory } from "../Adapters/StockData"
import moment from "moment-timezone"
import { cache } from "../Storage/jsstore_con.js"
import { getTransactionsByDate } from "../Adapters/Transaction";

export default function PortfolioChart(props) {
    const { currentUser } = useAuth();
    const [chartDateRange, setChartDateRange] = useState("D");
    const [extendedHoursToggle, setExtendedHoursToggle] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    let chartData = [
        [{ type: "string", label: "Time" },
        { type: "number", label: "Values" },
        { id: "high", type: "number", role: "interval" },
        {id: "low", type: "number", role: "interval"}]
        //Add 'current value' on to the end if the market is still open
    ];

    const getChartData = useCallback(async () => {
        setError("");
        setLoading(true)
        try {
            let marketOpen;
            let marketClose;
                //If extended hours = true, use extended hours, else use regular hours
            if (extendedHoursToggle) {
                marketOpen = moment.tz("04:00:00", "HH:mm:ss","America/New_York");
                marketClose = moment.tz("19:45:00", "HH:mm:ss", "America/New_York");
            } else {
                marketOpen = moment.tz("09:30:00", "HH:mm:ss", "America/New_York");
                marketClose = moment.tz("15:45:00", "HH:mm:ss", "America/New_York");
            }

            const nowUTC = moment().utc();
            const dataCache = await cache;
            let newEntries = [];
            const result = await getTransactionsByDate(currentUser, moment.utc(marketOpen).format(), moment(nowUTC).format())
            if (result.Status === "success" && result.Data.length !== 0) {
                result.data.map(async (transaction) => {
                const newEntry = {
                    transaction_id: transaction.Id,
                    ticker: transaction.Ticker,
                    shares: transaction.Shares,
                    market_value: transaction.MarketValue,
                    transaction_type: transaction.TransactionType,
                    transaction_date: transaction.TransactionDate
                };
                newEntries.push(newEntry)
                })
                await dataCache.insert({
                    into: "TransactionHistory-v1",
                    values: newEntries,
                    upsert: true
                });
            }

            //create array of tickers that need to be refreshed
            let activeHoldings = [];
            props.holdings.map(async (holding) => {
                //if shares = 0 and last transaction(stored in utc) is before market open, exclude
                if (holding.Shares !== 0 || (moment(holding.LastTransactionDate).isBetween(marketOpen, nowUTC)) === true) {
                    activeHoldings.push(holding.Ticker)
                }
            })
            const stockDataRefresh = await refreshDailyPriceHistory(currentUser, activeHoldings) //Refresh data cache for all needed tickers
                if (stockDataRefresh.Status === "Success") {

                    //start at market open time, loop until market close time
                    //loop through each stock and find the entry from data cache that corresponds with the timeslot
                    //if there has been a transaction after the end of the current time slot, pull all transactions since,
                        //add the values for all transactions and add to the current stock balance
                    //Multiply current stock balance by the 'open' price from data cache for current time slot
                    //Store this value and repeat for the next stock
                    //Add all totals together
                    //Create new entry in chartData array
                } else {
                    setError("Chart data could not be loaded. Try again later")
                }
           } catch (err) {
               console.error(err)
               setError("Chart data could not be loaded. Try again later")
           } finally {
                setLoading(false)
           }
    }, [props.holdings])

    useEffect(() => {
         getChartData();
    }, [getChartData]);

    const chartOptions = {
        legend: { position: "none" },
        vAxis: { format: "currency" },
        intervals: { lineWidth: 1, barWidth: 1, style: "boxes" }
    }

    function handleChartDateRangeChange(e) {
        setChartDateRange(e.target.value)
    }

    const handleHoursToggle = (e) =>  {
        setExtendedHoursToggle(e.target.checked)
    }

    if (props.loading) return (
        <div className="container-fluid w-50 justify-content-center">
            <Alert variant="primary" className="text-center">Getting your chart data...</Alert>
        </div>
    );

    return (
        <>
            <h3 className="m-2">$10,459.67</h3>
            <h5 className="m-2">+10% Today</h5>
            <Chart chartType="LineChart" width="100%" height="500px" data={chartData ? chartData : null} options={chartOptions}>
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
                {chartDateRange === "D" ? <Form.Switch label="Extended hours" onChange={handleHoursToggle} checked={extendedHoursToggle} /> : null}
            </div>
        </>
    )
}