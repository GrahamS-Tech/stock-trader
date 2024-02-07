import React from 'react';
import AccountDetails from "../Components/AccountDetails";
import BankingDetails from "../Components/BankingDetails";

export default function MyAccount() {
    return (
        <div className="container-fluid w-50 justify-content-center">
            <AccountDetails></AccountDetails>
            <BankingDetails></BankingDetails>
        </div>
    );
}