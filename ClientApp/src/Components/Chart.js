import React, {useState, useEffect, useCallback} from "react";
import moment from "moment-timezone"
import {ButtonToolbar, ButtonGroup, Button, Form, Alert} from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import { Chart } from "react-google-charts";
import { getPriceHistory } from "../Adapters/StockData"
//import { getTransactionsByDate } from "../Adapters/Transaction";
import {formatCurrency} from "../Adapters/StringToCurrency";
import {getTransactionsByDate} from "../Adapters/Transaction";



//Current user, tickers, chart interval, and show balance flag passed in from parent component
export default function StockChart({tickers, showUserBalance, holdings}) {
    const { currentUser } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [chartInterval, setChartInterval] = useState("D")
    const [extendedHoursToggle, setExtendedHoursToggle] = useState(false)
    const [chartData, setChartData] = useState([])

    const chartOptions = {
        legend: { position: "none" },
        vAxis: { format: "currency" },
        intervals: { lineWidth: 5, barWidth: 1, style: "boxes" }
    }

    let chartDetail = [
        [{ type: "string", label: "Time" },
            { type: "number", label: "Close, [High, Low]" },
            { id: "high", type: "number", role: "interval" },
            {id: "low", type: "number", role: "interval"}]
    ];

    useEffect(() => {
        const getChartData = async() => {
    //Set chart start and end times based on provided interval (DONE)
            let priceHistoryInterval = ""
            switch(chartInterval){
                case "D":
                    priceHistoryInterval = "intraday"
                    break;
                case "W":
                case "M":
                    priceHistoryInterval = "daily"
                    break;
                case "YTD":
                case "Y":
                case "5Y":
                    priceHistoryInterval = "monthly"
                    break;
            }
//Call price history adapter with tickers & interval (DONE)
            let stockPriceHistory = []
            try {
                stockPriceHistory = await getPriceHistory(currentUser, tickers, priceHistoryInterval)
            } catch (err) {
                console.error(err)
                setError("Could not retrieve price history. Try again later")
            }

            //Loop through stockPriceHistory, adding each entry to a new array (DONE)
            //De duplicate that array (DONE)
            //Sort array (DONE)

            let allDates = new Set()
            stockPriceHistory.map(i => {
                Object.keys(i.data).forEach(key => {
                    allDates.add(key)
                })
            })
            const sortedDates = Array.from(allDates).sort((a, b) => new Date(b) - new Date(a));

            //Set chartStart & chartEnd dates (DONE)
            let chartStartEastern = moment(sortedDates[0])
            let chartEndEastern = moment(sortedDates[0])
            let chartAddBy = 0
            let chartAddByInterval = ""
            switch(chartInterval) {
                case "D":
                    chartAddBy = 15
                    chartAddByInterval = "minutes"
                    if (extendedHoursToggle) {
                        chartStartEastern = moment(chartStartEastern)
                            .hours(4)
                            .minutes(0)
                            .seconds(0)
                            .milliseconds(0)
                        chartEndEastern = moment(chartEndEastern)
                            .hours(19)
                            .minutes(45)
                            .seconds(0)
                            .milliseconds(0)
                    } else {
                        chartStartEastern = moment(chartStartEastern)
                            .hours(9)
                            .minutes(30)
                            .seconds(0)
                            .milliseconds(0)
                        chartEndEastern = moment(chartEndEastern)
                            .hours(15)
                            .minutes(45)
                            .seconds(0)
                            .milliseconds(0)
                    }
                    break;
                case "W":
                    chartAddBy = 1
                    chartAddByInterval = "days"
                    chartStartEastern.subtract(7, "days")
                    break;
                case "M":
                    chartAddBy = 1
                    chartAddByInterval = "days"
                    chartStartEastern.subtract(30, "days")
                    break;
                case "YTD":
                    chartAddBy = 1
                    chartAddByInterval = "months"
                    chartStartEastern.subtract((chartStartEastern.dayOfYear() - 1), "days")
                    break;
                case "Y":
                    chartAddBy = 1
                    chartAddByInterval = "months"
                    chartStartEastern.subtract(1, "years")
                    break;
                case "5Y":
                    chartAddBy = 1
                    chartAddByInterval = "months"
                    chartStartEastern.subtract(5, "years")
                    break;
            }

//If user price history is true, call transaction history with chart start and end dates (DONE)
            let userTransactions = []
            if (showUserBalance) {
                let chartStartUTC = moment(chartStartEastern).utc()
                let chartEndUTC = moment(chartEndEastern).utc()

                try {
                    userTransactions = await getTransactionsByDate(currentUser, chartStartUTC.format(), chartEndUTC.format())
                    console.log(userTransactions)
                } catch (err) {
                    console.error(err)
                }

                //TODO:Loop through stockData appending balance as of to each entry
            }

//Create new array beginning at chart start date, increasing by provided interval.
            const chartEntries = []
            let currentEntry = moment(chartStartEastern)
            let currentEntryText = ""
            //If include transactions is true, get current holdings and last transaction date
            let currentShares = 1
            while (moment(currentEntry).isBefore(chartEndEastern)) {
                chartInterval === "D" ?
                    currentEntryText = currentEntry.format("YYYY-MM-DD HH:mm:ss") :
                    currentEntryText = currentEntry.format("YYYY-MM-DD")
                //if include transactions is true, adjust currentShares by sum of transactions between chartStartDate and currentEntry
                let close = 0, high = 0, low = 0
                console.log(currentEntryText)
                stockPriceHistory.map(i => {
                    console.log(i)
                    if (i.data[currentEntryText]) {
                        //Need to add lookup to user holdings and multiple by current holdings for this time block
                        close += parseFloat(i.data[currentEntryText]["4. close"]) * currentShares
                        high += parseFloat(i.data[currentEntryText]["2. high"]) * currentShares
                        low += parseFloat(i.data[currentEntryText]["3. low"]) * currentShares
                    }
                })
                let newEntry = [
                    currentEntryText,
                    close,
                    high,
                    low
                ]
                console.log(newEntry)
                chartEntries.push(newEntry)
                currentEntry.add(chartAddBy, chartAddByInterval)
            }
            console.log(chartEntries)
            console.log(holdings)

// For each entry, find all matching entries in price data and combine into one entry by totalling user holdings and price for each ticker
    //If show user balance is true, check transaction history for each entry and adjust holdings accordingly
//Pass data into chart



        }
        getChartData();
    },[tickers, chartInterval])

    function handleChartIntervalChange(e) {
        setChartInterval(e.target.value)
    }

    function handleHoursToggle(e) {
        setExtendedHoursToggle(e.target.checked)
    }

    let currentBalance = 0
    let percentChange = 0

    return (
        <>
            <h3 className="m-2">{formatCurrency(currentBalance)}</h3>
            <h5 className="m-2">{percentChange}</h5>
            {error ?
                <div className="container-fluid w-50 p-3 justify-content-center">
                <Alert variant="danger" className="text-center">{error}</Alert>
                </div> :
                <Chart chartType="AreaChart" width="100%" height="500px" data={chartData} options={chartOptions}>
                </Chart>}
    <div className="d-block justify-content-center">
                <ButtonToolbar className="my-2">
                    <ButtonGroup onClick={handleChartIntervalChange} className="mx-auto" aria-label="Date range group">
                        <Button variant={chartInterval === "D" ? "success" : "secondary"} value="D">D</Button>
                        <Button variant={chartInterval === "W" ? "success" : "secondary"} value="W">W</Button>
                        <Button variant={chartInterval === "M" ? "success" : "secondary"} value="M">M</Button>
                        <Button variant={chartInterval === "YTD" ? "success" : "secondary"} value="YTD">YTD</Button>
                        <Button variant={chartInterval === "Y" ? "success" : "secondary"} value="Y">Y</Button>
                        <Button variant={chartInterval === "5Y" ? "success" : "secondary"} value="5Y">5Y</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {chartInterval === "D" ? <Form.Switch label="Extended hours" onChange={handleHoursToggle} checked={extendedHoursToggle} /> : null}
            </div>
        </>
    )
}