export async function getLastClose(ticker) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=4UH2KHBG4WO9LP5E`
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "request"
            }
        });
        const result = await response.json();
        const stockData = result['Time Series (Daily)']
        const closePrice = Object.values(stockData)[0]['4. close'];
        return closePrice
    } catch (err) {
        console.error(err)
    }
}