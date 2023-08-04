import React from 'react';
import AccountDetails from "../Components/AccountDetails";
import BankingDetials from "../Components/BankingDetials";

export default function MyAccount() {
    
    return (
        <div className="container-fluid w-50 justify-content-center">
            <AccountDetails></AccountDetails>
            <BankingDetials></BankingDetials>
        </div>
    );
}