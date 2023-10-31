//Pre - market trading: 4:00 a.m.to 9: 30 a.m.EST
//Regular trading hours: 9:30 a.m.to 4:00 p.m.EST
//After - hours trading: 4:00 p.m.to 8:00 p.m.EST

//Current Price URL: https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&entitlement=delayed&apikey={apiKey}
//Daily Price History (15min interval): https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=15min&entitlement=delayed&apikey={apiKey}
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
            console.log(err)
            result.Status = "Error";
            result.Message = err;
            return result
        }

        const lastTradingDay = new Date(responseData['07. latest trading day']);

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
//<----------------Function incomplete-------------------->
export async function refreshDailyPriceHistory(currentUser, requestedTickers) {
    const dataCache = await cache;
    let errorCount = 0;
    let result = {};

    requestedTickers.map(async(requestedTicker) => {
        const localData = await dataCache.select({
            from: "DailyPriceHistory-v1",
            order: {
                by:"time_block",
                type: "desc"
            },
            where: {
                ticker: requestedTicker
            }
        });

        //TODO: <------------refactor this logic to only set refreshData to false------------->
        let refreshData = true;
        let localDataKeys = Object.keys(localData);
        let currentEasternTime = moment.tz("America/New_York")
        if (localDataKeys.length !== 0) { //1.
            console.log(`${requestedTicker} - Local data is present. ${localDataKeys.length} entries found.`)
            //TODO: Change newestTimeBlock to data_pulled, converted to eastern. Data will always refresh on the weekend since no new data will be stored...
            let newestTimeBlock = moment(localData[0]["time_block"].toString()).tz("America/New_York")
            if (marketStatusCheck(currentEasternTime) !== "Market closed") { //2
                console.log(`${requestedTicker} - Market is open.`)
                if (currentEasternTime.diff(newestTimeBlock, "minutes") > 15) { //3
                    console.log(`${requestedTicker} - Data is more than 15 minutes old. Current market time: ${currentEasternTime}, last data as of: ${newestTimeBlock}`)
                    refreshData = true //4
                } else {
                    console.log(`${requestedTicker} - Data is less than 15 minutes old. Current market time: ${currentEasternTime}, last data as of: ${newestTimeBlock}`)
                    refreshData = false //5
                }
            } else if (marketStatusCheck(newestTimeBlock) !== "Market closed") { //6
                console.log(`${requestedTicker} - Last data was pulled while market was open. Last data as of: ${newestTimeBlock}`)
                refreshData = true //7
            } else if ((currentEasternTime.diff(newestTimeBlock, "hours")) >= 8) { //8
                console.log(`${requestedTicker} - Data is more than 8 hours old. Last data as of: ${newestTimeBlock}`)
                refreshData = true //9
            } else {
                console.log(`${requestedTicker} - Market is closed & data is less than 8 hours old. Last data as of: ${newestTimeBlock}`)
                refreshData = false //10
            }
        } else {
            console.log(`${requestedTicker} - No local data is available.`)
            refreshData = true //11
        }

        let responseData = [];
        let responseMetaData = [];
        if (refreshData) {
            try {
                const response = await fetch(
                    "https://stock-trader-api.azurewebsites.net/api/StockData/PriceHistory/" +
                    requestedTicker, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + currentUser
                    }
                });
                result = await response.json();
                responseData = result.Data["Time Series (15min)"];
                responseMetaData = result.Data["Meta Data"]
            } catch (err) {
                console.error("Error in stock API call")
                console.log(err)
                errorCount++
            }

            if (result.Status === "success") {
                let newStockData = []
                let newStockDataKeys = Object.keys(responseData);
                let startEntry = moment(responseMetaData["3. Last Refreshed"].substring(0,11) + "04:00:00-4:00")
                let endEntry = moment(responseMetaData["3. Last Refreshed"].substring(0,11) + "19:45:00-4:00")
                let lastEntryFound
                for (startEntry; startEntry.isSameOrBefore(endEntry); startEntry.add(15,"minutes")) {
                    let entrySearch = startEntry.clone();
                    let entrySearchString = moment(entrySearch).tz("America/New_York").format("YYYY-MM-DD HH:mm:ss")
                    let dataDerivedFromFuture = false
                    let dataDerivedFromPast = false
                    while (responseData[entrySearchString] === undefined && entrySearch.isSameOrBefore(endEntry)) {
                        dataDerivedFromFuture = true
                        entrySearch.add(15, "minutes")
                        entrySearchString = moment(entrySearch).tz("America/New_York").format("YYYY-MM-DD HH:mm:ss")
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
                            ticker_time_block: `${requestedTicker}-${moment(startEntry).tz("America/New_York").format("YYYY-MM-DD HH:mm:ss")}`,
                            ticker: requestedTicker,
                            open: open,
                            high: high,
                            low: low,
                            close: close,
                            volume: volume,
                            time_block: startEntry.toDate(),
                            data_pulled: currentEasternTime.toDate(),
                            data_expiration: currentEasternTime.clone().add(1, "days").toDate(),
                            data_source: dataSource
                        }
                        newStockData.push(newEntry)
                }

                await dataCache.insert({
                    into: "DailyPriceHistory-v1",
                    values: newStockData,
                    upsert: true
                })
                result.Status = "success"
            } else {
                errorCount++
            }
        }
    })
    if (errorCount > 0) {
        result.Status = "Error"
        result.Message = `${errorCount} entries could not be refreshed`
    } else {
        result.Status = "Success"
        result.Message = "All entries refreshed"
    }
    return result
}