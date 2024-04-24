import React from 'react';
import Chart from "../Components/Chart";
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