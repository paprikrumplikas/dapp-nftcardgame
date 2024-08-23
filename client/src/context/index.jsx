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
    // trigger/flag that causes certain useEffect to re-run.
    // flag is updated when new battle event or when round ended event is emitted
    // when it updates, triggers the useEffect with fetchGameData
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



    // @note to actually call updateCurrentWalletAddress. We want to call it only at the start, so the dependency array is gonna be empty like []
    useEffect(() => {
        //* Set the wallet address to the state
        const updateCurrentWalletAddress = async () => {
            // @note this requestAccount results the wallet login window popping up
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // if exists, set state to the first account
            if (accounts) setWalletAddress(accounts[0]);
        }

        // actually call the function
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

            console.log("Provider set:", newProvider);
            console.log("Contract set:", newContract);
        }

        // call this function as soon as the website loads
        setSmartContractAndProvider();
    }, [])

    // if step is -1, we are not ready for the game, we cannot call our function to call event listeners
    useEffect(() => {
        // if step is not -1 and contract exists, create event listener
        console.log("step: ", step);
        if (step !== -1 && contract && provider) {
            console.log("creating event listeners");

            createEventListeners({
                navigate, contract,
                walletAddress, setShowAlert,
                setUpdateGameData,
                player1Ref, player2Ref,
                provider,
                fetchGameData,
            });
        }
    }, [contract, provider, step])


    useEffect(() => {
        // if the alert shows (alert status is true), set a timer, show the alert for 3s, then close the alert, reset it
        if (showAlert?.status) {
            const timer = setTimeout(() => {
                setShowAlert({ status: false, type: 'info', message: '' })
            }, 3000)

            // clear timer
            return () => clearTimeout(timer);
        }

    }, [showAlert]);


    // @note handle error messages. If there is a new error message, it displays it as an alert
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






    // @note for troubleshooting, to check if provider can retrieve basic bloachchain info
    /*
    useEffect(() => {
        if (provider) {
            provider.getBlockNumber()
                .then(blockNumber => {
                    console.log("Current block number - xxxxxxxxxx:", blockNumber);
                })
                .catch(error => {
                    console.error("Failed to fetch block number - xxxxxxxxxxx:", error);
                });
        } else {
            console.error("Provider is not initialized - xxxxxxxx.");
        }
    }, [provider]);
    */


    const fetchGameData = async () => {
        const fetchedBattles = await contract.getAllBattles();
        // filter those active battles that are pending (signified by status '0', but bigInt 0, i.e. 0n)
        const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0n);
        const ongoingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 1n);
        let activeBattle = null;    // i.e. the ongoing battle that is displayed

        ongoingBattles.forEach((battle) => {
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


    // set the game data to the state - to check if the battle is active, and if the player is in a battle
    // gonna be executed whenever the contract or the setGameData var changes; see dependency array
    useEffect(() => {
        // if contract exists, call the fetchGameData function
        if (contract) {
            fetchGameData();
            console.log("updating game data via fecthGameData");
        }

        // @note added walletAddress so that gameData is refreshed when accounts are switched and battle can proceed
        // @note added gameData so that when a round ends, player stats get updated. But adding it causing an infitinite loop
    }, [contract, updateGameData, walletAddress]);




    // logging for troubleshooting @note
    /*useEffect(() => {
        console.log("using effect");
        const fetchRegisteredPlayers = async () => {
            const fetchedRegisteredPlayers = (await contract.getAllPlayers()).slice(1);   // slice the first element which is always 0
            const registeredPlayerNames = fetchedRegisteredPlayers.map((player => player[1]));
            console.log("Names of registered players: ", registeredPlayerNames);

            const playersInGame = fetchedRegisteredPlayers.filter((player) => player.inBattle === true);   // returns a struct-like thing
            const playerNamesInGame = playersInGame.map((player) => player[1]);
            const playerAddressesInGame = playersInGame.map((player) => player[0]);

            console.log("Names of players in game, ", playerNamesInGame);
            console.log("Addresses of players in game, ", playerAddressesInGame);

        }

        const fetchGameData = async () => {
            const fetchedBattles = (await contract.getAllBattles()).slice(1); // slice the first element which is always 0
            const allBattleNames = fetchedBattles.map((battle) => battle[2]);
            console.log("All battles: ", allBattleNames);

            const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0n);
            // console.log("Pendng battles: ", pendingBattles);

            // Log battle names together with player addresses
            const pendingBattlesAndTheirPlayers = pendingBattles.map((battle) => {
                const battleName = battle[2]; // Battle name
                const playerAddress = battle[3][0]; // First player's address in the battle
                return `${battleName}, ${playerAddress}`;
            });
            console.log("Pending battles and their players: ", pendingBattlesAndTheirPlayers);

            const activeBattles = fetchedBattles.filter((battle) => battle.battleStatus === 1n);
            // console.log("Active battle objects ", activeBattles);
            // Log battle names together with player addresses
            const activeBattlesAndTheirPlayers = activeBattles.map((battle) => {
                const battleName = battle[2]; // Battle name
                const player1Address = battle[3][0]; // First player's address in the battle
                const player2Address = battle[3][1]; // Second player's address in the battle
                return `${battleName}, ${player1Address}  ${player2Address}`;
            });
            console.log("Active battles and their players: ", activeBattlesAndTheirPlayers);


            if (activeBattles.length > 0) {
                const battle = activeBattles[0]; // Assuming there's only one active battle for this example
                const playerAddresses = battle[3]; // Array of player addresses
                const moves = battle[4]; // Array of moves

                // Determine which player comes next
                let nextPlayerMessage;
                if (moves[0] === 0n && moves[1] === 0n) {
                    nextPlayerMessage = "Any of the players can make the next move.";
                } else if (moves[0] === 0n) {
                    nextPlayerMessage = `Next player to move: ${playerAddresses[0]}`; // First player hasn't moved yet
                } else if (moves[1] === 0n) {
                    nextPlayerMessage = `Next player to move: ${playerAddresses[1]}`; // Second player hasn't moved yet
                } else {
                    nextPlayerMessage = "Both players have already moved.";
                }

                console.log(nextPlayerMessage);
            }
        }


        if (contract) {
            fetchRegisteredPlayers();
            fetchGameData();
        }

    }, [contract]); */



    // logging for troubleshooting. Logs every 10 s
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("UPDATE GAMEDATA VALUE: ", updateGameData);
            if (gameData?.activeBattle) {
                // console.log("Battle Name:", gameData.activeBattle.name);
                console.log("Battle Status:", gameData.activeBattle.battleStatus);
                // console.log("Winner:", gameData.activeBattle.winner);
            } else {
                console.log("xxxx No active battle or gameData is not loaded yet.");
            }
        }, 10000); // Logs every 10 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [gameData]);


    useEffect(() => {
        console.log("gameData updated----------------------------------: ", gameData);
    }, [gameData]);


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
            fetchGameData,
        }}>
            {/* @note If we dont have this, we dont return nothing, the page will be empty*/}
            {/* @note with specyfing {children}, we return everything we pass to our app*/}
            {children}
        </GlobalContext.Provider>
    )
}


// helper function / hook @note allows us to call this from other components
export const useGlobalContext = () => useContext(GlobalContext);