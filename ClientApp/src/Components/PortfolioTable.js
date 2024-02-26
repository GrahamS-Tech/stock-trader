import React, {useState} from "react";
import { Table, Button, Alert } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import TradeSharesModal from "./TradeSharesModal";

export default function PortfolioTable(props) {
    const { currentUser } = useAuth();
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [sharesToTrade, setSharesToTrade] = useState("");
    const [shareName, setShareName] = useState("");

    function handleCloseTradeModal() {
        setShowTradeModal(false);
        props.loadHoldings();
    }

    function handleShowTradeModal(e) {
        setSharesToTrade(e.target.attributes.ticker.value)
        setShareName(e.target.attributes.sharename.value)
        setShowTradeModal(true)
    }

    if (props.loading) return (
        <div className="container-fluid w-50 justify-content-center">
            <Alert variant="primary" className="text-center">Getting your portfolio...</Alert>
        </div>
    );

    return (
        <>
            {props.error && <Alert variant="danger" className="text-center">{props.error}</Alert>}
            <h3>My portfolio</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th className="text-center">Shares</th>
                        <th className="text-center">Value</th>
                        <th className="text-center">Trade</th>
                    </tr>
                </thead>
                <tbody>
                    {!props.holdings.length &&
                        <tr>
                            <td className="text-center" colSpan={6}>No items in your portfolio</td>
                        </tr>}
                    {props.holdings && props.holdings.map((items) => (
                        items.Shares !== 0 ? (
                        <tr key={items.Id}>
                            <td>{items.Ticker}</td>
                            <td>{items.Name}</td>
                            <td>{items.Price ? items.Price : "Loading..."}</td>
                            <td className="text-center">{ items.Shares }</td>
                            <td className="text-center">{items.Value? items.Value : "Loading..."}</td>
                            <td className="text-center"><Button sharename={ items.Name}  ticker={items.Ticker} id={items.Id} variant="success" size="sm" onClick={handleShowTradeModal}>Trade</Button></td>
                        </tr>
                            ) : null
                    ))}
                </tbody>
            </Table>
            <TradeSharesModal currentUser={currentUser} selectedName={shareName} selectedTicker={sharesToTrade} isModalOpen={showTradeModal} openTradeModal={handleShowTradeModal} closeTradeModal={handleCloseTradeModal}></TradeSharesModal>
        </>
)
}