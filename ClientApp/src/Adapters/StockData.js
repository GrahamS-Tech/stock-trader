export async function getCurrenPrice(ticker) {
    const now = new Date();
    const utcTime = now.getTime();
    const utcDate = new Date(utcTime);
    let timeDiff = 0;
    let result = {};

    if (localStorage.getItem("CurrentPrice-" + ticker)) {
        result = JSON.parse(localStorage.getItem("CurrentPrice-" + ticker))
        const expireTime = new Date(result['Global Quote']['Expiration'])
        timeDiff = (expireTime - utcDate)/60000
    }
    if (timeDiff > 0) {
        const currentPrice = result['Global Quote']['05. price']
        return currentPrice
    }
    else {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey={apiKey}`
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "request"
                }
            });
            const result = await response.json();
            const stockData = result['Global Quote']
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