import React from 'react';
import PortfolioChart from "../Components/PortfolioChart";
import TopMovers from "../Components/TopMovers";
import NewStories from "../Components/NewsStories";

export default function Research() {
    return (
        <div className="container-fluid w-50 justify-content-center">
            <PortfolioChart></PortfolioChart>
            <TopMovers></TopMovers>
            <NewStories></NewStories>
        </div>
    );
}