import React from 'react';
import PortfolioChart from "../Components/PortfolioChart";
import TopMovers from "../Components/TopMovers";
import NewStories from "../Components/NewsStories";

export default function Research() {
    return (
        <div className="container-fluid w-50 justify-content-center">
            <br/>
            <TopMovers></TopMovers>
            {/*<br/>*/}
            {/*<PortfolioChart></PortfolioChart>*/}
            <br/>
            <NewStories></NewStories>
        </div>
    );
}