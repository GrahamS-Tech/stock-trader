//Pre - market trading: 4:00 a.m.to 9: 30 a.m.EST
//Regular trading hours: 9:30 a.m.to 4:00 p.m.EST
//After - hours trading: 4:00 p.m.to 8:00 p.m.EST

//Current Price URL: https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&entitlement=delayed&apikey={apiKey}
//Daily Price History (15min interval): https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=15min&entitlement=delayed&apikey={apiKey}


export async function getCurrenPrice(ticker) {
    const now = new Date();
    const utcTime = now.getTime();
    const utcDate = new Date(utcTime);
    let timeDiff = 0;
    let result = {};

    if (localStorage.getItem("CurrentPrice-" + ticker)) {
        result = JSON.parse(localStorage.getItem("CurrentPrice-" + ticker))
        console.log(result)
        const expireTime = new Date(result['Global Quote - DATA DELAYED BY 15 MINUTES']['Expiration'])
        timeDiff = (expireTime - utcDate)/60000
    }
    if (timeDiff > 0) {
        const currentPrice = result['Global Quote - DATA DELAYED BY 15 MINUTES']['05. price']
        return currentPrice
    }
    else {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&entitlement=delayed&apikey={apiKey}`
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "request"
                }
            });
            const result = await response.json();
            const stockData = result['Global Quote - DATA DELAYED BY 15 MINUTES']
            const expiration = new Date(utcDate.setUTCMinutes(utcDate.getUTCMinutes() + 15))
            Object.assign(stockData, {Expiration: expiration})
            localStorage.setItem("CurrentPrice-"+ticker, JSON.stringify(result))
            const currentPrice = (stockData)['05. price'];
            return currentPrice
        } catch (err) {
            console.error(err)
        }
    }
}

export async function getDailyPriceHistory(ticker) {
    const now = new Date();
    const utcTime = now.getTime();
    const utcDate = new Date(utcTime);
    let timeDiff = 0;
    let result = {};

    if (localStorage.getItem("DailyPriceHistory-" + ticker)) {
        result = JSON.parse(localStorage.getItem("DailyPriceHistory-" + ticker))
        const expireTime = new Date(result['Meta Data']['Expiration'])
        timeDiff = (expireTime - utcDate) / 60000
    }
    if (timeDiff > 0) {
        const dailyPriceHistory = result['Time Series (15min)']
        return dailyPriceHistory
    }
    else {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=15min&entitlement=delayed&apikey={apiKey}`
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "request"
                }
            });
            const result = await response.json();
            const metaData = result['Meta Data']
            const stockData = result['Time Series (15min)']
            const expiration = new Date(utcDate.setUTCMinutes(utcDate.getUTCMinutes() + 15))
            Object.assign(metaData, { Expiration: expiration })
            localStorage.setItem("DailyPriceHistory-" + ticker, JSON.stringify(result))
            return stockData
        } catch (err) {
            console.error(err)
        }
    }
}