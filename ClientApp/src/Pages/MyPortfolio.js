import React from 'react';

import PortfolioChart from '../Components/PortfolioChart';
import PortfolioTable from '../Components/PortfolioTable';
import WatchListTable from '../Components/WatchListTable';

//View my current holdings
//Search for new stocks

export default function MyPortfolio() {
    return (
        < div className="container-fluid w-50 justify-content-center">
            <PortfolioChart></PortfolioChart>
            <hr></hr>
            <PortfolioTable></PortfolioTable>
            <hr></hr>
            <WatchListTable></WatchListTable>
        </div>
    );
}