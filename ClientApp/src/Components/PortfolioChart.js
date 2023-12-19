import React, {useState, useEffect, useCallback, useTransition, useRef} from "react";
import moment from "moment-timezone"
import {ButtonToolbar, ButtonGroup, Button, Form, Alert} from 'react-bootstrap';
import { cache } from "../Storage/jsstore_con.js"
import { useAuth } from "./AuthContext";
import { Chart } from "react-google-charts";
import { refreshIntradayPriceHistory, refreshDailyPriceHistory, refreshMonthlyPriceHistory } from "../Adapters/StockData"
import { getTransactionsByDate } from "../Adapters/Transaction";
import {formatCurrency} from "../Adapters/StringToCurrency";

export default function PortfolioChart(props) {
    const { currentUser } = useAuth();
    const [chartDateRange, setChartDateRange] = useState("D");
    const [chartData, setChartData] = useState([])
    const [extendedHoursToggle, setExtendedHoursToggle] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentBalance, setCurrentBalance] = useState(0)
    const [openingBalance, setOpeningBalance] = useState(0)
    const [percentChange, setPercentChange] = useState(0)

    const chartOptions = {
    legend: { position: "none" },
    vAxis: { format: "currency" },
    intervals: { lineWidth: 5, barWidth: 1, style: "boxes" }
    }

    let chartDetail = [
        [{ type: "string", label: "Time" },
        { type: "number", label: "Open, [High, Low]" },
        { id: "high", type: "number", role: "interval" },
        {id: "low", type: "number", role: "interval"}]
        //Add 'current value' on to the end if the market is still open
    ];

    const getChartData = useCallback(async () => {
        if (!props.loading) {
            setError("");
            setLoading(true)
            const dataCache = await cache;
            let chartStartEST, chartEndEST;
            let interval = "";

            try {
                let maxLatestTradingDay = await dataCache.select({
                    from: "CurrentPrice-v1",
                    aggregate: {
                        max: "latest_trading_day"
                    }
                })
                let newestData = moment(maxLatestTradingDay[0]["max(latest_trading_day)"])
                    .tz("America/New_York")
                switch (chartDateRange) {
                    case "D":
                        if (extendedHoursToggle) {
                            chartStartEST = moment(newestData)
                                .hours(4)
                                .minutes(0)
                                .seconds(0)
                                .milliseconds(0)
                            chartEndEST = moment(newestData)
                                .hours(19)
                                .minutes(45)
                                .seconds(0)
                                .milliseconds(0)
                        } else {
                            chartStartEST = moment(newestData)
                                .hours(9)
                                .minutes(30)
                                .seconds(0)
                                .milliseconds(0)
                            chartEndEST = moment(newestData)
                                .hours(15)
                                .minutes(45)
                                .seconds(0)
                                .milliseconds(0)
                        }
                        break;
                    case "W":
                        chartStartEST = moment(newestData).subtract((newestData.weekday()-1),"days");
                        chartEndEST = moment(newestData);
                        break;
                    case "M":
                        chartStartEST = moment(newestData).subtract((newestData.date()-1),"days");
                        chartEndEST = moment(newestData);
                        break;
                    case "YTD":
                        chartStartEST = moment(newestData).subtract((newestData.dayOfYear()-1),"days");
                        chartEndEST = moment(newestData);
                        break;
                    case "Y":
                        chartStartEST = moment(newestData).subtract(1,"years");
                        chartEndEST = moment(newestData);
                        break;
                    case "5Y":
                        chartStartEST = moment(newestData).subtract(5,"years");
                        chartEndEST = moment(newestData);
                        break;
                }
                let chartStartUTC = moment(chartStartEST).utc()
                let chartEndUTC = moment(chartEndEST).utc()

                let activeHoldings = [];
                props.holdings.forEach(holding => {
                    let lastTransactionUTC = moment.utc(holding.LastTransactionDate)
                    if (holding.Shares !== 0 || (lastTransactionUTC.isBetween(chartStartUTC, chartEndUTC)) === true) {
                        activeHoldings.push({ticker: holding.Ticker, balance: holding.Shares})
                    }
                })

                let stockDataRefresh = []
                switch (chartDateRange) {
                    case "D":
                        stockDataRefresh = await refreshIntradayPriceHistory(currentUser, activeHoldings)
                        interval = "Intraday"
                        break;
                    case "W" || "M":
                        stockDataRefresh = await refreshDailyPriceHistory(currentUser, activeHoldings)
                        interval = "Daily"
                        break;
                    case "YTD" || "Y" || "5Y":
                        stockDataRefresh = await refreshMonthlyPriceHistory(currentUser, activeHoldings)
                        interval = "Monthly"
                        break;
                }

                const transactions = await getTransactionsByDate(currentUser, chartStartUTC.format(), chartEndUTC.format())
                if (transactions.Status === "success" && transactions.Data.length !== 0) {
                    let newEntries = [];
                    transactions.Data.map(async (transaction) => {
                        let transDate = moment.utc(transaction.TransactionDate)
                        let timeBlockUTC = moment(transDate)
                        let timeBlockMinutes = (Math.floor(moment(transaction.TransactionDate)
                            .minutes() / 15)) * 15
                        timeBlockUTC
                            .minutes(timeBlockMinutes)
                            .seconds(0)
                            .milliseconds(0)
                        let timeBlockET = moment(timeBlockUTC)
                            .tz("America/New_York")
                            .format("YYYY-MM-DD HH:mm:ss")
                        const newEntry = {
                            transaction_id: transaction.Id,
                            ticker: transaction.Ticker,
                            traded_shares: transaction.Shares,
                            market_value: transaction.MarketValue,
                            transaction_type: transaction.TransactionType,
                            transaction_date: transDate.toDate(),
                            ticker_time_block: transaction.Ticker + "-" + timeBlockET
                        };
                        newEntries.push(newEntry)
                    })
                    await dataCache.insert({
                        into: "TransactionHistory-v1",
                        values: newEntries,
                        upsert: true
                    });
                }

                if (stockDataRefresh.Status === "Success") {
                    const data = await dataCache.select({
                        from: "StockDataPriceHistory-v1",
                        order: {
                            by: "StockDataPriceHistory-v1.time_block",
                            type: "desc"
                        },
                        where: {
                            ticker: {
                                in: (activeHoldings.map(holding => holding.ticker)),
                                interval: interval,
                            },
                            time_block: {
                                "-": {
                                    low: chartStartEST.toDate(),
                                    high: chartEndEST.toDate()
                                }
                            }
                        },
                        as: {
                            ticker_time_block: "history_ticker_time_block"
                        },
                        join: {
                            with: "TransactionHistory-v1",
                            on: "StockDataPriceHistory-v1.ticker_time_block=TransactionHistory-v1.ticker_time_block",
                            type: "left",
                            as: {
                                ticker: "trans_ticker",
                                ticker_time_block: "trans_ticker_time_block"
                            }
                        }
                    })

                    let uniqueTickers = data.reduce((group, item) => {
                        let { ticker } = item;
                        if (!group[ticker]) {
                            group[ticker] = []
                        }
                        group[ticker].push({
                            ticker: item.ticker,
                            current_holdings: item.current_holdings,
                            open: item.open,
                            high: item.high,
                            low: item.low,
                            close: item.close,
                            time_block: item.time_block,
                            date_time_block_string: item.date_time_block_string,
                            time_string: item.time_string,
                            traded_shares: item.traded_shares,
                        });
                        return group;
                    }, {})

                    let adjusted_holdings = 0
                    let currentEasternTime = moment.tz("America/New_York")
                    Object.keys(uniqueTickers).forEach(t =>{
                        adjusted_holdings = 0
                        uniqueTickers[t].forEach(i => {
                            let thisEntry = moment.tz(i.date_time_block_string, "America/New_York")
                            if (thisEntry.isAfter(currentEasternTime)) {
                                i.open = null
                                i.high = null
                                i.low = null
                                i.close = null
                            } else {
                            i.current_holdings += adjusted_holdings
                            i.open = i.open * i.current_holdings
                            i.high = i.high * i.current_holdings
                            i.low = i.low * i.current_holdings
                            i.close = i.close * i.current_holdings
                            adjusted_holdings += (i.traded_shares * -1)
                            }
                        })
                    })

                    let chartRows = []
                    Object.keys(uniqueTickers).forEach(t => {
                        uniqueTickers[t].forEach(i => {
                            let existingEntry = chartRows.find(a => a[0] === i.time_string)
                            if (!existingEntry) {
                                chartRows.push([i.time_string, i.open, i.high, i.low])
                            }
                            else {
                                if (existingEntry[1] !== null || i.open !== null) {
                                    existingEntry[1] += i.open
                                }
                                if (existingEntry[2] !== null || i.high !== null) {
                                    existingEntry[2] += i.high
                                }
                                if (existingEntry[3] !== null || i.low !== null) {
                                    existingEntry[3] += i.low
                                }
                            }
                        })
                    })

                    let lastNonNullEntry = ((chartRows.slice().find(e => !e.includes(null)))[1])
                    chartRows.reverse();
                    setOpeningBalance(chartRows[0][1])
                    setCurrentBalance(lastNonNullEntry)
                    setPercentChange(`${((lastNonNullEntry / chartRows[0][1] - 1)*100).toFixed(2)}%`)
                    chartDetail = chartDetail.concat(chartRows);
                    setChartData(chartDetail)

                } else {
                    setError("Chart data could not be loaded. Try again later")
                }
            } catch (err) {
                console.error(err)
                setError("Unable to load chart data. Try again later")
            } finally{
                setLoading(false)
            }
        }
    }, [props.holdings, props.loading, extendedHoursToggle, chartDateRange])

    useEffect(() => {
         getChartData();
    }, [getChartData]);

    function handleChartDateRangeChange(e) {
        setChartDateRange(e.target.value)
    }

    const handleHoursToggle = (e) =>  {
        setExtendedHoursToggle(e.target.checked)
    }

    if (props.loading || loading) return (
        <div className="container-fluid w-50 p-3 justify-content-center">
            <Alert variant="primary" className="text-center">Getting your chart data...</Alert>
        </div>
    );
    if (error) return (
        <div className="container-fluid w-50 p-3 justify-content-center">
            <Alert variant="danger" className="text-center">{error}</Alert>
        </div>
    )

    return (
        <>
            <h3 className="m-2">{formatCurrency(currentBalance)}</h3>
            <h5 className="m-2">{percentChange}</h5>
            <Chart chartType="AreaChart" width="100%" height="500px" data={chartData} options={chartOptions}>
            </Chart>
            <div className="d-block justify-content-center">
                <ButtonToolbar className="my-2">
                    <ButtonGroup onClick={handleChartDateRangeChange} className="mx-auto" aria-label="Date range group">
                        <Button variant={chartDateRange === "D" ? "success" : "secondary"} value="D">D</Button>
                        <Button variant={chartDateRange === "W" ? "success" : "secondary"} value="W">W</Button>
                        <Button variant={chartDateRange === "M" ? "success" : "secondary"} value="M">M</Button>
                        <Button variant={chartDateRange === "YTD" ? "success" : "secondary"} value="YTD">YTD</Button>
                        <Button variant={chartDateRange === "Y" ? "success" : "secondary"} value="Y">Y</Button>
                        <Button variant={chartDateRange === "5Y" ? "success" : "secondary"} value="All">All</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {chartDateRange === "D" ? <Form.Switch label="Extended hours" onChange={handleHoursToggle} checked={extendedHoursToggle} /> : null}
            </div>
        </>
    )
}