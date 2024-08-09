import React, { createContext, useContext, useEffect, UseRef, useState } from "react";
// to connect to the blockchain
import { ethers } from "ethers";
// help us to set up the onboarding that ensures the user is properly connected to the app
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";

import { ABI, ADDRESS } from "../contract";

// hook return a function that we can use later multiple times
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    // to connect with our smart wallet with Core
    const [walletAddress, setWalletAddress] = useState("");

    const [provider, setProvider] = useState("");
    const [contract, setContract] = useState("");

    //* Set the wallet address to the state
    const updateCurrentWalletAddress = async () => {
        // @note this requestAccount results the wallet login window popping up
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        // if exists, set state to the first account
        if (accounts) setWalletAddress(accounts[0]);
    }

    // @note to actually call updateCurrentWalletAddress. We want to call it only at the start, so the dependency array is gonna be empty like []
    useEffect(() => {
        updateCurrentWalletAddress();

        // but we also want to call it when account is changed in the wallet extension, so
        window.ethereum.on('accountsChanged',
            updateCurrentWalletAddress)
    }, [])

    //* Set the smart contract and the provider to the state
    // this is also called only at the beginning, so dependency array is empty like this []
    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            // @note this work only with ethers v5. For ethers v6, check the sendEther repo
            const newProvider = new ethers.providers.Web3Provider(connection);
            // @note this work only with ethers v5. For ethers v6, check the sendEther repo
            const signer = newProvider.signer();
            // @note this work only with ethers v5. For ethers v6, check the sendEther repo
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);

            setProvider(newProvider);
            setContract(contract);
        }

        // call this function as soon as the website loads
        setSmartContractAndProvider();
    }, [])

    {/* @note in the value object of the GlobalContext.Provider, we can pass all the value we want to share with every single component of the app*/ }
    {/* @note For this to work, we need to wrap our entire application with the GlobalContextProvider in main.jsx*/ }

    return (
        <GlobalContext.Provider value={{
            contract, walletAddress
        }}>
            {/* @note If we dont have this, we dont return nothing, the page will be empty*/}
            {/* @note with specyfing {children}, we return everything we pass to out app*/}
            {children}
        </GlobalContext.Provider>
    )
}


// helper function / hook @note allows us to call this from other components
export const useGlobalContext = () => useContext(GlobalContext);