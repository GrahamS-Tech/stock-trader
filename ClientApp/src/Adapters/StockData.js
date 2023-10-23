//Pre - market trading: 4:00 a.m.to 9: 30 a.m.EST
//Regular trading hours: 9:30 a.m.to 4:00 p.m.EST
//After - hours trading: 4:00 p.m.to 8:00 p.m.EST

//Current Price URL: https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&entitlement=delayed&apikey={apiKey}
//Daily Price History (15min interval): https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=15min&entitlement=delayed&apikey={apiKey}
import { initDb } from "../Storage/jsstore_con.js"

export async function getCurrenPrice(currentUser, requestedTicker) {

    const dataCache = await initDb();
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
//<----------------Function incomplete-------------------->
export async function getDailyPriceHistory(currentUser, requestedTicker) {
    const dataCache = await initDb();
    const now = new Date();
    const utcTime = now.getTime();
    const utcDate = new Date(utcTime);
    let expDate = new Date(utcDate)
    let expiration = new Date(expDate.setDate(expDate.getDate() +1))
    let timeDiff = 0;
    let result = {};
    let responseData = [];
    let refreshData = true;

    const localData = await dataCache.select({
        from: "DailyPriceHistory-v1",
        where: {
            ticker: requestedTicker
        }
    });

    if (localData.length !== 0) {
        //need to loop through each entry in existing data and delete anything that is expired
        timeDiff = (localData[0].data_expiration - utcDate) / 60000
        if (timeDiff < 0) {
            await dataCache.remove({
                from: "DailyPriceHistory-v1",
                where: {
                    id: 1
                }
            });
            refreshData = true
        }
    }
    else {
        refreshData = false
        result.Status = "success"
        result.Data = localData[0].close
    }
    if (refreshData) {
        try {
            const response = await fetch("https://stock-trader-api.azurewebsites.net/api/StockData/PriceHistory/" + requestedTicker, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser
                }
            });
            result = await response.json();
            responseData = result.Data['Time Series (15min)'];
        } catch (err) {
            console.error("Error in stock API call")
            console.log(err)
            result.Status = "Error";
            result.Message = err;
            return result
        }

        //Need to loop through new data and add anything new

        const newStockData = {
            ticker: '',
            data_as_of: '',
            open: '',
            high: '',
            low: '',
            close: '',
            volume: '',
            data_expiration: expiration
        }

        await dataCache.insert({
            into: "DailyPriceHistory-v1",
            values: [newStockData]
        })

        result.Status = "success"
        result.Data = responseData['05. price']
    }

    //Figure out exactly what data needs to be returned
    return result.Data
}