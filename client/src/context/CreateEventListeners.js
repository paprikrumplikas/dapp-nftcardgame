import {ethers} from "ethers";

import {ABI} from "../contract";
import { playAudio, sparcle} from "../utils/animation";
import { defenseSound } from "../assets";

const emptyAccount ='0x0000000000000000000000000000000000000000';



// cb is for callback function 
const AddNewEvent = (eventFilter, contract, cb) => {

    console.log(`Adding event listener with filter: ${eventFilter.fragment.name}`);
    // ensures that there are no multiple listeners for the same event at the same time
    // i.e. before we add a new one we remove the previosu ones
    contract.off(eventFilter);  // @note specific to ethers v6


    contract.on(eventFilter, (Logs) => {    // @note specific to ethers v6
        const parsedLog = (new ethers.Interface(ABI)).parseLog(Logs);  // @note specific to ethers v6
        cb(parsedLog);
    })
};

// @note needed for the placement of explosion animation
const getCoords = (cardRef) => {
    const {left, top, width, height} = cardRef.current.getBoundingClientRect();

    return {
        pageX: left + width /2,
        pageY: top + height /2.25
    }
};


// contract, provider, walletAddress are not defined UNTIL we add this function to the context
export const createEventListeners = ({navigate, contract, walletAddress, setShowAlert, updateGameData, setUpdateGameData, player1Ref, player2Ref}) => {
    // filtering the events fpr a specified contract
    const NewPlayerEventFilter = contract.filters.NewPlayer();
    // call the func we created above. Args is the arguments passed on by the emitted event, like emit NewPlayer(player);
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


    // filter for moves
    const BattleMoveEventFilter = contract.filters.BattleMove();
    AddNewEvent(BattleMoveEventFilter, contract, ({args}) => {
        console.log("Battle move initiated - xxx ", args);
    });

    // filter for round ended
    const RoundEndedFilter = contract.filters.RoundEnded();
    AddNewEvent(RoundEndedFilter, contract, ({args}) => {
        console.log("Round ended ", args, walletAddress);

        for(let i=0; i<args.damagedPlayers.length; i+=1){
            // if somebody got damaged
            if (args.damagedPlayers[i] !== emptyAccount) {

                if(args.damagedPlayers[i] === walletAddress) {
                    // @note needed for the placement of explosion animation
                    sparcle(getCoords(player1Ref));
                } else if (args.damagedPlayers[i] !== walletAddress) {
                    sparcle(getCoords(player2Ref));
                }
            } else {    // if nobody got damaged
                playAudio(defenseSound);
            }
        }

        // @note we want to update game data status each time something happens:
        // multiple useStates in index.jsx has the 'updateGameData" it their dependency arrays
        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
        console.log("In eventlisteneres, round: ", updateGameData);

    })


}