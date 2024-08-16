import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// to connect to the blockchain
import { ethers, InfuraProvider } from "ethers";
// help us to set up the onboarding that ensures the user is properly connected to the app
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";

import { ABI, ADDRESS } from "../contract";
import { createEventListeners } from "./CreateEventListeners";
/** @note give the GetParams() function
 * designed to check the current status of a user's Ethereum wallet connection and provide information based on the state of the connection. 
 * isError: Indicates if there was an error during the process.
 * message: Holds any error or status messages.
 * step: Used to track the progress or status of the connection process.
 * balance: Stores the user's Ethereum balance.
 * account: Holds the Ethereum account address.
*/
import { GetParams } from "../utils/onboard";

// hook return a function that we can use later multiple times
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    // to connect with our smart wallet with Core
    const [walletAddress, setWalletAddress] = useState("");

    const [provider, setProvider] = useState("");
    const [contract, setContract] = useState("");
    const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: '' })
    const [battleName, setBattleName] = useState("");
    // new state with an object containing 2 arrays and a 3rd
    const [gameData, setGameData] = useState({
        players: [], pendingBattles: [], activeBattle: null
    });
    const [updateGameData, setUpdateGameData] = useState(0);
    // battlegrounf of the battle page. State needed in battle and battleground pages
    const [battleGround, setBattleGround] = useState('bg-astral');
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    // @note needed for the placement of explosion animation
    const player1Ref = useRef();
    const player2Ref = useRef();


    const navigate = useNavigate();

    // @note checking the local storage for backgorund selection, so that when a user reloads the page, his chosen battleground does not change
    // this local storage is set in Battleground
    useEffect(() => {
        const battlegroundFromLocalStorage = localStorage.getItem('battleground');
        if (battlegroundFromLocalStorage) {
            setBattleGround(battlegroundFromLocalStorage);
        }
        else {
            localStorage.setItem('battleground', battleGround);
        }
    }, [])



    //* @note Reset web3 onboarding modal params so the onboarding modal fully works
    useEffect(() => {
        const resetParams = async () => {
            const getParamsResponse = await GetParams();  // this function is coming from utils/onboard.js

            setStep(getParamsResponse.step);
        }

        // actually call the func - initially, when the component mounts
        resetParams();

        // @note After resetParams is called initially, the window.ethereum.on method sets up event listeners for chainChanged and accountChanged.
        // These event listeners are independent of the useEffect hook and the dependency array.They will persist and remain active as long as the component is mounted.
        window?.ethereum?.on('chainChanged', () => resetParams());
        window?.ethereum?.on('accountChanged', () => resetParams());

    }, [])

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
        // on: listening the events emitted by the provider. Listening to accountsChnaged
        window.ethereum.on('accountsChanged',
            updateCurrentWalletAddress)
    }, [])

    //* Set the smart contract and the provider to the state
    // this is also called only at the beginning, so dependency array is empty like this []
    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3Modal = new Web3Modal();
            // @note extension of the original which was only const connection = await web3Modal.connect()
            const connection = await web3Modal.connect().catch((error) => {
                console.error("Web3Modal connection failed:", error);
                setShowAlert({
                    status: true,
                    type: 'error',
                    message: 'Failed to connect wallet'
                });
            });
            const newProvider = new ethers.BrowserProvider(connection);
            const signer = await newProvider.getSigner();
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);

            setProvider(newProvider);
            setContract(newContract);
        }

        // call this function as soon as the website loads
        setSmartContractAndProvider();
    }, [])

    // if step is -1, we are not ready for the game, we cannot call our function to call event listeners
    useEffect(() => {
        // if step is not -1 and contract exists, create event listener
        console.log("step: ", step);
        if (step !== -1 && contract) {
            console.log("creating event listeners");

            createEventListeners({
                navigate, contract,
                walletAddress, setShowAlert,
                setUpdateGameData,
                player1Ref, player2Ref,
            });
        }
    }, [contract, step])


    useEffect(() => {
        // if the alert shows (alert status is true), set a timer, show the alert for 10s, then close the alert, reset it
        if (showAlert?.status) {
            const timer = setTimeout(() => {
                setShowAlert({ status: false, type: 'info', message: '' })
            }, 10000)

            // clear timer
            return () => clearTimeout(timer);
        }

    }, [showAlert]);


    // @note handle error messages
    useEffect(() => {
        if (errorMessage) {
            const parsedErrorMessage = errorMessage?.reason;

            if (parsedErrorMessage) {

                setShowAlert({
                    status: true,
                    type: 'failure',
                    message: parsedErrorMessage
                })
            }

        }

    }, [errorMessage]);


    // set the game data to the state - to check if the battle is active, and if the player is in a battle
    // gonna be executed whenever the contract or the setGameData var changes; see dependency array
    useEffect(() => {
        const fetchGameData = async () => {
            const fetchedBattles = await contract.getAllBattles();
            // filter those active battles that are pending (signified by status '0', but bigInt 0, i.e. 0n)
            const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0n);
            let activeBattle = null;

            fetchedBattles.forEach((battle) => {
                // check if the player has the same address as the wallet in the browser
                if (battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())) {
                    // if there is no winner yet
                    if (battle.winner.startsWith('0x00')) {
                        activeBattle = battle;
                    }
                }
            })

            // updating the state with the game data
            // slicing pendingBattles[], as the 0th entry is always one filled with 0s
            setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });

            // @note this will not work, state updates in React are asynchronous, meaning that gameData is not updated immediately after calling setGameData
            // console.log("active battle status 2: ", gameData.activeBattle.battleStatus);

        }

        // if contract exists, call the fetchGameData function
        if (contract) fetchGameData();
    }, [contract, updateGameData])


    {/* @note in the value object of the GlobalContext.Provider, we can pass all the value we want to share with every single component of the app*/ }
    {/* @note For this to work, we need to wrap our entire application with the GlobalContextProvider in main.jsx*/ }
    return (
        <GlobalContext.Provider value={{
            contract, walletAddress, provider,
            showAlert, setShowAlert,
            battleName, setBattleName,
            gameData,
            battleGround, setBattleGround,
            errorMessage, setErrorMessage,
            player1Ref, player2Ref,
            updateGameData,
        }}>
            {/* @note If we dont have this, we dont return nothing, the page will be empty*/}
            {/* @note with specyfing {children}, we return everything we pass to our app*/}
            {children}
        </GlobalContext.Provider>
    )
}


// helper function / hook @note allows us to call this from other components
export const useGlobalContext = () => useContext(GlobalContext);