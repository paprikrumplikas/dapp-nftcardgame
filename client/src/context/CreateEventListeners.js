import {ethers} from "ethers";

import {ABI} from "../contract";
import { playAudio, sparcle} from "../utils/animation";
import { defenseSound } from "../assets";

import { WebSocketProvider} from "ethers/providers";


const emptyAccount ='0x0000000000000000000000000000000000000000';


// cb is for callback function 
// @note when the event we listen to is emitted, the listener is triggered and cb is executed
const AddNewEvent = (eventFilter, wsContract, cb) => {
    console.log(`Adding listener for event: ${eventFilter.fragment.name}`);
    // ensures that there are no multiple listeners for the same event at the same time
    // i.e. before we add a new one we remove the previosu ones
    wsContract.off(eventFilter);  // @note specific to ethers v6


    wsContract.on(eventFilter, (Logs) => {    // @note specific to ethers v6
        console.log(`Event listener triggered for: ${eventFilter.fragment.name}`);  // Log when the event is triggered

        // originally put this into a try-catch during troubleshooting to see what error I get during during parsing 
        try {
            // @note in v6, the logs object is a complex structure that includes multiple nested objects. It has properties like filter, emitter, log, args, and fragment, but topics is inside the log property, not at the root level.
            // To correctly parse the log, you need to access the topics and data properties from the log sub-object within logs.
            // Access topics and data from the logs.log property
            const logDetails = Logs.log;
            const parsedLog = wsContract.interface.parseLog(logDetails);  // @note specific to ethers v6
            cb(parsedLog);
        } catch (error) {
            console.error("Error parsing log:", error);
        }
    });    

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
export const createEventListeners = async ({navigate, contract, walletAddress, setShowAlert, updateGameData, setUpdateGameData, player1Ref, provider, player2Ref}) => {

    const wsProvider = new WebSocketProvider("wss://api.avax-test.network/ext/bc/C/ws");

    /*
    console.log("WebSocket Provider:", wsProvider);

    const network = await wsProvider.getNetwork();
    console.log("Connected to network:", network);

    console.log("Network name:", network.name);
    console.log("Network chainId:", network.chainId);

    // Get and log the latest block number to confirm connection
    const blockNumber = await wsProvider.getBlockNumber();
    console.log("Latest block number:", blockNumber);
    */ 

    // Create the contract instance using the WebSocket provider
    const wsContract = new ethers.Contract("0x2253bbaBB1feAaEDF3EBbdec0eAAce1cE63034cc", ABI, wsProvider);



    // filtering 1st event (NewPlayer) from a specified contract
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
            });
            // redirect to next page after registration
            navigate(`/create-battle`);

        }
    })


    // 2nd event. Goal is to navigate both players to the battle page
    const NewBattleEventFilter = wsContract.filters.NewBattle();
    AddNewEvent(NewBattleEventFilter, wsContract, ({args}) => {
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
    const BattleMoveEventFilter = wsContract.filters.BattleMove();
    AddNewEvent(BattleMoveEventFilter, wsContract, ({args}) => {
        console.log("Battle move initiated: ", args);
    });

    
    // filter for round ended
    const RoundEndedFilter = wsContract.filters.RoundEnded();
    AddNewEvent(RoundEndedFilter, wsContract, ({args}) => {
        console.log("Round ended ", args, walletAddress);

        for(let i=0; i<args.damagedPlayers.length; i+=1){
            // if somebody got damaged
            if (args.damagedPlayers[i] !== emptyAccount) {

                // @note bug fix if addresses are net uniformly set to lowercase when doing a comparison, then the animation gets always displayed on the top card
                if(args.damagedPlayers[i].toLowerCase() === walletAddress.toLowerCase()) {
                    // i.e. damaged player is the one who is connected, with the card at the bottom
                    console.log("Damaged player: ", args.damagedPlayers[i], walletAddress);
                    // @note needed for the placement of explosion animation
                    sparcle(getCoords(player1Ref));
                } else if (args.damagedPlayers[i].toLowerCase() !== walletAddress.toLowerCase()) {
                    console.log("Damaged player - xxxxxxxxx: ", args.damagedPlayers[i], walletAddress);
                    sparcle(getCoords(player2Ref));
                }
            } else {    // if nobody got damaged
                playAudio(defenseSound);
            }
        }

        // @note we want to update game data status each time something happens:
        // multiple useStates in index.jsx has the 'updateGameData" it their dependency arrays
        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
        console.log("In eventlisteners, round: ", updateGameData);
    });



        /*
    // @note Start monitoring blocks and logs
    const eventSignature = ethers.id("BattleMove(string,bool)");
    // @note fetch the logs directly from the provider. This is a listener that gets triggered with each new block mined
    provider.on('block', async (blockNumber) => {
        console.log(`New block mined: ${blockNumber}`);
        
        try {
            // @note By manually fetching logs with provider.getLogs, you bypass the abstraction that contract.on or provider.on (for events) provides. 
            // This approach directly queries the blockchain, which avoids any issues related to how events are registered or listened for in real-time.
            // Since getLogs works, it’s clear that the event is being emitted, and the log topics match what you expect. 
            const logs = await provider.getLogs({
                address: contract.address,
                fromBlock: blockNumber - 1, // Check the last blocktoBlock: blockNumber,
                topics: [eventSignature] // Filter by event signature hash
            });
        
            if (logs.length > 0) {
                console.log(`Relevant logs from block ${blockNumber}:`, logs);
                // Additional processing here if needed
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    });
    */


}