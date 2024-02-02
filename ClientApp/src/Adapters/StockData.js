import moment from "moment-timezone"
import { cache } from "../Storage/jsstore_con.js"

export async function getCurrenPrice(currentUser, requestedTicker) {
    //TODO: use moment-timezone in this function
    const dataCache = await cache;
    const now = new Date();
    const utcTime = now.getTime();
    const utcDate = new Date(utcTime);
    let expiration = new Date(utcDate.getTime() + 120000)
    let timeDiff = 0;
    let result = {};
    let responseData = [];
    let refreshData = true;

    const localData = await dataCache.select({
        from: "CurrentPrice-v1",
        where: {
            ticker: requestedTicker
        }
    });

    if (localData.length !== 0) {
        timeDiff = (localData[0].data_expiration - utcDate) / 60000
        if (timeDiff < 0) {
            refreshData = true
        }
        else {
            refreshData = false
            result.Status = "success"
            result.Data = localData[0].price
        }
    }
    if (refreshData) {
        try {
            const response = await fetch("https://stock-trader-api.azurewebsites.net/api/StockData/CurrentPrice/" + requestedTicker, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser
                }
            });
            result = await response.json();
            responseData = result.Data['Global Quote - DATA DELAYED BY 15 MINUTES'];
        } catch (err) {
            console.error("Error in stock API call")
            console.error(err)
            result.Status = "Error";
            result.Message = err;
            return result
        }

        const lastTradingDay = moment(responseData['07. latest trading day']).hours(0).minutes(0).seconds(0).toDate();

        const newStockData = {
            ticker: responseData['01. symbol'],
            open: parseFloat(responseData['02. open']),
            high: parseFloat(responseData['03. high']),
            low: parseFloat(responseData['04. low']),
            price: parseFloat(responseData['05. price']),
            volume: parseFloat(responseData['06. volume']),
            latest_trading_day: lastTradingDay,
            previous_close: parseFloat(responseData['08. previous close']),
            change: parseFloat(responseData['09. change']),
            change_percent: parseFloat(responseData['10. change percent'].slice(0, -1)),
            data_expiration: expiration
        }

        await dataCache.insert({
            into: "CurrentPrice-v1",
            upsert: true,
            values: [newStockData]
        })
        result.Status = "success"
        result.Data = responseData['05. price']
    }
    return result.Data
}

function marketStatusCheck(dateTimeMoment) {
    const extendedHoursOpen = moment.tz("04:00:00", "HH:mm:ss","America/New_York");
    const extendedHoursClose = moment.tz("20:00:00", "HH:mm:ss", "America/New_York");
    const regularHoursOpen = moment.tz("09:30:00", "HH:mm:ss", "America/New_York");
    const regularHoursClose = moment.tz("16:00:00", "HH:mm:ss", "America/New_York");

    if (dateTimeMoment.day() === 0 || dateTimeMoment.day() === 6) {
        return "Market closed"
    }
    else if (dateTimeMoment.isBetween(regularHoursOpen, regularHoursClose)) {
        return "Market open"
    }
    else if (dateTimeMoment.isBetween(extendedHoursOpen, extendedHoursClose)) {
        return "Market extended hours"
    }
    else {
        return "Market closed"
    }
}

async function cacheStockData(requestedTicker, data, interval) {
    const dataCache = await cache;
    let currentEasternTime = moment.tz("America/New_York")
    let newStockData = []
    let responseData = [];
    let responseMetaData = [];
    let result = {};
    const keys = Object.keys(data)
    responseMetaData = data[keys[0]]
    responseData = data[keys[1]];
    const estOffset = currentEasternTime.format("Z")
    switch(interval) {
        case "Intraday":
            let startEntry = moment(responseMetaData["3. Last Refreshed"]
                .substring(0,11) + "04:00:00" + estOffset)
            let endEntry = moment(responseMetaData["3. Last Refreshed"]
                .substring(0,11) + "19:45:00" + estOffset)
            let lastEntryFound
            for (startEntry; startEntry.isSameOrBefore(endEntry); startEntry.add(15,"minutes")) {
                let entrySearch = startEntry.clone();
                let entrySearchString = moment(entrySearch)
                    .tz("America/New_York")
                    .format("YYYY-MM-DD HH:mm:ss")
                let dataDerivedFromFuture = false
                let dataDerivedFromPast = false
                while (responseData[entrySearchString] === undefined && entrySearch.isSameOrBefore(endEntry)) {
                    dataDerivedFromFuture = true
                    entrySearch.add(15, "minutes")
                    entrySearchString = moment(entrySearch)
                        .tz("America/New_York")
                        .format("YYYY-MM-DD HH:mm:ss")
                }
                if (entrySearch.isAfter(endEntry)) {
                    dataDerivedFromPast = true
                    entrySearchString = lastEntryFound
                } else {
                    lastEntryFound = entrySearchString
                }
                let dataSource = "Actual"
                let open = parseFloat(responseData[entrySearchString]["1. open"])
                let high = parseFloat(responseData[entrySearchString]["2. high"])
                let low = parseFloat(responseData[entrySearchString]["3. low"])
                let close = parseFloat(responseData[entrySearchString]["4. close"])
                let volume = parseFloat(responseData[entrySearchString]["5. volume"])
                if (dataDerivedFromFuture) {
                    dataSource = "Derived from future data"
                    high = parseFloat(responseData[entrySearchString]["1. open"])
                    low = parseFloat(responseData[entrySearchString]["1. open"])
                    close = parseFloat(responseData[entrySearchString]["1. open"])
                    volume = 0
                }
                if (dataDerivedFromPast) {
                    dataSource = "Derived from past data"
                    open = parseFloat(responseData[entrySearchString]["4. close"])
                    high = parseFloat(responseData[entrySearchString]["4. close"])
                    low = parseFloat(responseData[entrySearchString]["4. close"])
                    volume = 0
                }
                const newEntry = {
                    ticker_time_block: `${requestedTicker.ticker}-${moment(startEntry)
                        .tz("America/New_York")
                        .format("YYYY-MM-DD HH:mm:ss")}`,
                    ticker: requestedTicker.ticker,
                    date_time_block_string: moment(startEntry)
                        .tz("America/New_York")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    chart_group: moment(startEntry)
                        .tz("America/New_York")
                        .format("h:mm A"),
                    interval: interval,
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    volume: volume,
                    time_block: startEntry.toDate(),
                    data_pulled: currentEasternTime.toDate(),
                    data_expiration: currentEasternTime.clone().add(1, "days").toDate(),
                    data_source: dataSource,
                    current_holdings: requestedTicker.balance
                }
                newStockData.push(newEntry)
            }
            break;
        case "Daily":
        case "Monthly":
            Object.keys(responseData).forEach(i => {
                let dataSource = "Actual"
                let open = parseFloat(responseData[i]["1. open"])
                let high = parseFloat(responseData[i]["2. high"])
                let low = parseFloat(responseData[i]["3. low"])
                let close = parseFloat(responseData[i]["4. close"])
                let volume = parseFloat(responseData[i]["5. volume"])
                const newEntry = {
                    ticker_time_block: `${requestedTicker.ticker}-${moment(i)
                        .format("YYYY-MM-DD HH:mm:ss")}`,
                    ticker: requestedTicker.ticker,
                    chart_group: moment(i)
                        .tz("America/New_York")
                        .format("YYYY-MM-DD"),
                    interval: interval,
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    volume: volume,
                    time_block: moment(i).toDate(),
                    data_pulled: currentEasternTime.toDate(),
                    data_source: dataSource,
                    current_holdings: requestedTicker.balance
                }
                newStockData.push(newEntry)
            })
            break;
    }
    await dataCache.insert({
        into: "StockDataPriceHistory-v1",
        values: newStockData,
        upsert: true
    })
    result.Status = "success"
    result.Message = "Data successfully cached"
    return result
}

export async function refreshIntradayPriceHistory(currentUser, requestedTickers) {
    const dataCache = await cache;
    let result = {};
    let storeData = ""
    for (const requestedTicker of requestedTickers) {
        const localData = await dataCache.select({
            from: "StockDataPriceHistory-v1",
            order: {
                by:"data_pulled",
                type: "desc"
            },
            where: {
                ticker: requestedTicker.ticker,
                interval: "Intraday"
            }
        });

        let refreshData = true;
        let localDataKeys = Object.keys(localData);
        let currentEasternTime = moment.tz("America/New_York")
        if (localDataKeys.length !== 0) {
            let newestDataPull = moment(localData[0]["data_pulled"]
                .toString()).tz("America/New_York")
            if (marketStatusCheck(currentEasternTime) !== "Market closed"
                && currentEasternTime.diff(newestDataPull, "minutes") < 15) {
                refreshData = false
            } else if (marketStatusCheck(newestDataPull) === "Market closed"
                && (currentEasternTime.diff(newestDataPull, "hours")) < 8) {
                refreshData = false
            }
        }
        //TODO: result is overwritten with each loop, should be aggregated
        if (refreshData) {
            try {
                const response = await fetch(
                    "https://stock-trader-api.azurewebsites.net/api/StockData/IntradayPriceHistory/" +
                    requestedTicker.ticker, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + currentUser
                    }
                });
                result = await response.json();
            } catch (err) {
                console.error("Error in stock API call")
                console.error(err)
            }
            if (result.Status === "success") {
                storeData = await cacheStockData(requestedTicker, result.Data, "Intraday")
            }
        }
    }
    //TODO: This should be under a 'return' statement
    result.Status = "Success"
    result.Message = "All entries refreshed"
    return result
}

export async function refreshDailyPriceHistory(currentUser, requestedTickers) {
    const dataCache = await cache;
    let result = {};
    let storeData = ""
    for (const requestedTicker of requestedTickers) {
        const localData = await dataCache.select({
            from: "StockDataPriceHistory-v1",
            order: {
                by:"data_pulled",
                type: "desc"
            },
            where: {
                ticker: requestedTicker.ticker,
                interval: "Daily"
            }
        });

        let refreshData = true;
        let localDataKeys = Object.keys(localData);
        let currentEasternTime = moment.tz("America/New_York")
        if (localDataKeys.length !== 0) {
            let newestDataPull = moment(localData[0]["data_pulled"]
                .toString()).tz("America/New_York")
            if (moment(newestDataPull).isSame(currentEasternTime, "day")) {
                refreshData = false
            }
        }

        if (refreshData) {
            try {
                const response = await fetch(
                    "https://stock-trader-api.azurewebsites.net/api/StockData/DailyPriceHistory/" +
                    requestedTicker.ticker, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + currentUser
                        }
                    });
                result = await response.json();
            } catch (err) {
                console.error("Error in stock API call")
                console.error(err)
            }

            if (result.Status === "success") {
                storeData = await cacheStockData(requestedTicker, result.Data, "Daily")
            }
        }
    }

    result.Status = "Success"
    result.Message = "All entries refreshed"
    return result

}

export async function refreshMonthlyPriceHistory(currentUser, requestedTickers) {
    const dataCache = await cache;
    let result = {};
    let storeData = ""
    for (const requestedTicker of requestedTickers) {
        //5
        const localData = await dataCache.select({
            from: "StockDataPriceHistory-v1",
            order: {
                by:"data_pulled",
                type: "desc"
            },
            where: {
                ticker: requestedTicker.ticker,
                interval: "Monthly"
            }
        });

        let refreshData = true;
        let localDataKeys = Object.keys(localData);
        let currentEasternTime = moment.tz("America/New_York")
        if (localDataKeys.length !== 0) {
            let newestDataPull = moment(localData[0]["data_pulled"]
                .toString()).tz("America/New_York")
            if (moment(newestDataPull).isSame(currentEasternTime, "month")) {
                refreshData = false
            }
        }

        if (refreshData) {
            try {
                const response = await fetch(
                    "https://stock-trader-api.azurewebsites.net/api/StockData/MonthlyPriceHistory/" +
                    requestedTicker.ticker, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + currentUser
                        }
                    });
                result = await response.json();
            } catch (err) {
                console.error("Error in stock API call")
                console.error(err)
            }

            if (result.Status === "success") {
                storeData = await cacheStockData(requestedTicker, result.Data, "Monthly")
            }
        }
    }

    result.Status = "Success"
    result.Message = "All entries refreshed"
    return result

}