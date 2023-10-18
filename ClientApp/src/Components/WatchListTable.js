import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useAuth } from "./AuthContext";
import { getAllWatchListItems, deactivateWatchListItem } from "../Adapters/WatchList";
import TradeSharesModal from "./TradeSharesModal";
import SearchModal from "./SearchModal";
import { getCurrenPrice } from "../Adapters/StockData";
import { formatCurrency } from "../Adapters/StringToCurrency"


export default function WatchListTable() {
    const { currentUser } = useAuth();
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [watchList, setWatchList] = useState([]);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [sharesToTrade, setSharesToTrade] = useState("");
    const [shareName, setShareName] = useState("");
    const handleShowSearchModal = () => (setShowSearchModal(true));
    const handleCloseTradeModal = () => (setShowTradeModal(false));

    function handleCloseSearchModal() {
        setShowSearchModal(false)
        loadWatchList();
    };

    function handleShowTradeModal(e) {
        setSharesToTrade(e.target.attributes.ticker.value)
        setShareName(e.target.attributes.shareName.value)
        setShowTradeModal(true)
    };

    const loadWatchList = useCallback(async () => {
        setError("")
        setLoading(true)
        try {
            const response = await getAllWatchListItems(currentUser)
            if (response.Status === "success" && response.Data != null) {
                try {
                    await Promise.all(response.Data.map(async (i) => {
                        const currentPrice = await getCurrenPrice(currentUser, i.Ticker)
                        const formattedPrice = formatCurrency(currentPrice)
                        Object.assign(i, { Price: formattedPrice })
                    }));                    
                } catch (err) {
                    console.error(err)
                    setError("Unable to load price data")
                } finally {
                    setWatchList(response.Data)
                }
            }
            else {
                console.error(response.Message)
                setError("Unable to load watch list")
            }
        } catch (err) {
            console.error(err)
            setError("Unable to load watch list")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadWatchList();
    }, [loadWatchList]);

    async function handleRemove(e) {
        e.preventDefault();
        setError("")
        setSuccess("")
        const details = Number(e.target.id)
        try {
            const response = await deactivateWatchListItem(currentUser, details)
            if (response.Status === "success") {
                setSuccess("Item removed from your watch list");
            }
            else {
                console.error(response.Message)
                setError("Unable to remove item from your watch list")
            }
        } catch (err) {
            console.error(err)
            setError("Unable to remove item from your watch list")
        } finally {
            loadWatchList();
        }
    };

    if (loading) return (
        <div className="container-fluid w-50 justify-content-center">
            <Alert variant="primary" className="text-center">Getting watch list items...</Alert>
        </div>
    );

    return (
        <>
            <div>
                {success && <Alert variant="success" className="text-center">{success}</Alert>}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <h3>My watch list</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th className="text-center">Trade</th>
                        <th className="text-center">Remove</th>
                    </tr>
                </thead>
                    <tbody>
                        {!watchList.length && <tr>
                            <td className="text-center" colSpan={5}>No items in your watch list</td>
                        </tr>}
                        {watchList && watchList.map((items) => (
                            <tr key={items.Id}>
                                <td>{ items.Ticker }</td>
                                <td>{ items.Name }</td>
                                <td>{ items.Price ? items.Price : "Loading..." }</td>
                                <td className="text-center">
                                    <Button shareName={ items.Name} ticker={items.Ticker} id={items.Id} variant="success" size="sm" onClick={handleShowTradeModal}>Trade</Button>
                                </td>
                                <td className="text-center">
                                    <Button id={items.Id} variant="danger" size="sm" onClick={handleRemove}>X</Button>
                                </td>
                            </tr>
                        ))}
                    <tr>
                        <td className="text-center" colSpan={5}><Button variant="success" onClick={handleShowSearchModal}>Add</Button></td>
                    </tr>
                </tbody>
            </Table>
            </div>
            <SearchModal currentUser={currentUser} isModalOpen={showSearchModal} openSearchModal={handleShowSearchModal} closeSearchModal={handleCloseSearchModal}></SearchModal>            
            <TradeSharesModal currentUser={currentUser} selectedName={shareName} selectedTicker={sharesToTrade} isModalOpen={showTradeModal} openTradeModal={handleShowTradeModal} closeTradeModal={handleCloseTradeModal}></TradeSharesModal>
        </>
)
}