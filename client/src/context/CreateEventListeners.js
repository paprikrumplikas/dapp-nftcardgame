import {ethers} from "ethers";

import {ABI} from "../contract";

// cb is for callback function 
const AddNewEvent = (eventFilter, contract, cb) => {
    // ensures that there are no multiple listeners for the same event at the same time
    // i.e. before we add a new one we remove the previosu ones
    contract.off(eventFilter);  // @note specific to ethers v6

    contract.on(eventFilter, (Logs) => {    // @note specific to ethers v6
        const parsedLog = (new ethers.Interface(ABI)).parseLog  // @note specific to ethers v6
        (Logs);

        cb(parsedLog);
    })
}

// contract, provider, walletAddress are not defined UNTIL we add this function to the context
export const createEventListeners = ({navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData}) => {
    // filtering the events fpr a specified contract
    const NewPlayerEventFilter = contract.filters.NewPlayer();

    // call the func we created above
    AddNewEvent(NewPlayerEventFilter, contract, ({args}) => {
        // log so that we know the event happened
        console.log("New player created", args);

        if(walletAddress === args.owner) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'Player has been successfully registered.'
            })
        }
    })


    // 2nd event. Goal is to navigate both players to the battle page
    const NewBattleEventFilter = contract.filters.NewBattle();
    AddNewEvent(NewBattleEventFilter, contract, ({args}) => {
        // log so that we know the event happened
        console.log("New battle started", args, walletAddress);

        // check if walletAddres is our player1 or player2
        if(walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()) {
            navigate(`/battle/${args.battleName}`);

            // update game data (e.g. instead of pending battle, set in battle)
            // get access to the previous UpdateGameData: prevUpdateGameData
            setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
        }


    });
}