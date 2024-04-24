import React, {useState, useEffect, useCallback} from 'react';
import StockChart from '../Components/Chart';
import PortfolioTable from '../Components/PortfolioTable';
import WatchListTable from '../Components/WatchListTable';
import { useAuth } from "../Components/AuthContext";
import { formatCurrency } from "../Adapters/StringToCurrency";
import { getAllHoldings } from "../Adapters/Holding";
import { getCurrenPrice } from "../Adapters/StockData";

export default function MyPortfolio() {
    const { currentUser } = useAuth();
    const [holdings, setHoldings] = useState([]);
    const [tickers, setTickers] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadHoldings = useCallback(async() => {
        const tickerList = []
        setError("")
        setLoading(true)
        try {
            const response = await getAllHoldings(currentUser, false)
            if (response.Status === "success" && response.Data != null) {
                try {
                    await Promise.all(response.Data.map(async (i) => {
                        const currentPrice = await getCurrenPrice(currentUser, i.Ticker)
                        const formattedPrice = formatCurrency(currentPrice)
                        Object.assign(i, { Price: formattedPrice })
                        const value = currentPrice * i.Shares;
                        const formattedValue = formatCurrency(value)
                        Object.assign(i, { Value: formattedValue })
                        tickerList.push(i.Ticker)
                    }));
                } catch (err) {
                    console.error(err)
                    setError("Unable to load price data")
                } finally {
                    setHoldings(response.Data)
                    setTickers(tickerList)
                }
            }
            else {
                console.error(response.Message)
                setError("Unable to load holdings")
            }
        } catch (err) {
            console.error(err)
            setError("Unable to load holdings")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadHoldings()
    }, [loadHoldings])

    return (
        < div className="container-fluid w-50 justify-content-center">
            <StockChart tickers={tickers} loading={loading} showUserBalance={true} holdings={holdings}></StockChart>
            <hr></hr>
            <PortfolioTable holdings={holdings} error={error} loading={loading} loadHoldings={loadHoldings}></PortfolioTable>
            <hr></hr>
            <WatchListTable></WatchListTable>
        </div>
    );
}