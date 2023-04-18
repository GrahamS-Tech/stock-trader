import React from 'react';

//Into
//Login or signup
//Login modal
//Signup modal
export default function Home() {
    return (
        <div className="container-fluid w-50 justify-content-center">
            <div className="row">
                <div className="col">
                    <div className="card m-5">
                        <div className="card-body">
                        <h3>Card 1</h3>
                        </div>
                        <div className="card-footer">
                            <p>Some random text for card number one.</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card m-5">
                        <div className="card-body">
                            <h3>Card 2</h3>
                        </div>
                        <div className="card-footer">
                            <p>Some random text for card number two.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="card m-5">
                        <div className="card-body">
                            <h3>Card 3</h3>
                        </div>
                        <div className="card-footer">
                            <p>Some random text for card number three.</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card m-5">
                        <div className="card-body">
                            <h3>Card 4</h3>
                        </div>
                        <div className="card-footer">
                            <p>Some random text for card number four.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}