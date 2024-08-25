import React, { useEffect, useState } from 'react';
import { useParams, /*useNavigate*/ } from "react-router-dom";  // @note useNavigate is not used in this file

import styles from "../styles";
import { Alert, ActionButton, Card, GameInfo, PlayerInfo } from "../components";
import { useGlobalContext } from '../context';

import { attack, attackSound, defense, defenseSound, player01 as player01Icon, player02 as player02Icon } from "../assets";
import { playAudio } from "../utils/animation.js";

// array of all card assets
// @note my solution for card images
//import { allCards } from "../assets";


// Generate a random card image
// @note my solution for card images
//const generateRandomCardImage = () => allCards[Math.floor(Math.random() * (allCards.length - 1))];

const Battle = () => {
    const { contract, gameData, walletAddress, showAlert, setShowAlert, battleGround, setErrorMessage, player1Ref, player2Ref, updateGameData, round } = useGlobalContext();
    // const navigate = useNavigate();

    const [player1, setPlayer1] = useState({});
    const [player2, setPlayer2] = useState({});

    const [nextPlayer, setNextPlayer] = useState('');


    // @note @crucial @learning useParams() is a hook provided by React Router that allows you to access the parameters of the current route.
    //When a route is defined with parameters(e.g., /battle/: battleName), useParams can be used to extract these parameters inside the component that corresponds to that route.
    const { battleName } = useParams();


    // Retrieve or generate card images
    // i.e. for the very first time, we generate random card images for each player, then save those to local storage
    // afterwards, if the page relaods, we just get the images from local storage
    // @note my solution for card images
    /* const getPersistedImage = (key, generatedImage) => {
         const storedImage = localStorage.getItem(key);
         if (storedImage) {
             return storedImage;
         } else {
             const newImage = generatedImage;
             localStorage.setItem(key, newImage);
             return newImage;
         }
     };
 
     const player1ImageKey = player1[0];
     const player2ImageKey = player2[0];
 
     const player1CardImage = getPersistedImage(player1ImageKey, generateRandomCardImage());
     const player2CardImage = getPersistedImage(player2ImageKey, generateRandomCardImage());
     */


    // happens when the contract / gameData / battleName changes
    useEffect(() => {
        const getPlayerInfo = async () => {
            try {
                // setting up the vars for later use
                let player01Address = null;
                let player02Address = null;
                // identify which player is which one
                if (gameData.activeBattle.players[0].toLowerCase() === walletAddress.toLowerCase()) {
                    player01Address = gameData.activeBattle.players[0];
                    player02Address = gameData.activeBattle.players[1];
                } else {
                    player01Address = gameData.activeBattle.players[1];
                    player02Address = gameData.activeBattle.players[0];
                }

                // returns a gameToken struct (with id, attackStrength, defenseStrentg, etc)
                const p1TokenData = await contract.getPlayerToken(player01Address);
                // returns a Player struct (with mana, health, etc)
                const player01 = await contract.getPlayer(player01Address);
                const p2TokenData = await contract.getPlayerToken(player02Address);
                const player02 = await contract.getPlayer(player02Address);

                // based on the the above, we can add mana/health bars, etc
                const p1Att = Number(p1TokenData.attackStrength);
                const p1Def = Number(p1TokenData.defenseStrength);
                const p1H = Number(player01.playerHealth);
                const p1M = Number(player01.playerMana);
                const p2H = Number(player02.playerHealth);
                const p2M = Number(player02.playerMana);


                /**  @note      
                 * When interacting with a smart contract that returns a struct, ethers.js v5 typically returns the data as an object where you can access fields by their names. For example, player01.playerName would be valid if the smart contract defines a struct with a field called playerName.
                 * 
                 * 
                 * In v6, ethers.js introduces a slightly different behavior, where the data returned from a contract call can be an array, and you access fields using indexed positions (e.g., player01[1]).This means you access the data like you would with a tuple in Solidity, where player01[0], player01[1], etc., represent different fields. 
                 * 
                 * Also @note setting state in javascrypt is asyncronous, So that is why I needed to create newPlayer1 for logging, cause in this block player1 would have remained null even after setting the state*/

                //const newPlayer1 = { ...player01, att: p1Att, def: p1Def, health: p1H, mana: p1M };
                //console.log("Player01 object: ", player01);
                //console.log("Player1 object: ", newPlayer1);
                //console.log("Player1 address: ", newPlayer1[0]);


                // having these vars, set them to the state
                // @note ...player01 is the spread operator: copies all the properties of the player01 object into a new object, player1 (instead of player01)
                // copies all the properties of the player01 object into a new object
                // Any additional fields that exist in player01 but are not explicitly mentioned after the spread operator (like PlayerName, age, etc.) will remain unchanged in the new object.
                setPlayer1({ ...player01, att: p1Att, def: p1Def, health: p1H, mana: p1M });
                setPlayer2({ ...player02, att: 'X', def: 'X', health: p2H, mana: p2M });

            } catch (error) {
                //console.log(error);
                setErrorMessage(error);
            }

        }

        // if there is a contract and an active battle
        if (contract && gameData.activeBattle) getPlayerInfo();

        // @note as defined in context, gameData changes whenever walletAddress or updateGameData changes
        // @note nonetheless, added updateGameData to check
    }, [contract, gameData, battleName, updateGameData])



    // used and called in handleClick
    const makeAMove = async (choice) => {
        playAudio(choice === 1 ? attackSound : defenseSound);

        try {
            // @note @syntax @bugfix after all the params we can pass a special options param, like {gasLimit: 500000}
            // we use this to increase the gasLimit, as tx sometimes failed
            await contract.attackOrDefendChoice(choice, battleName);
            setShowAlert({
                status: true,
                type: "info",
                message: `Initiating ${choice === 1 ? 'attack' : 'defense'}`
            });
        } catch (error) {
            setErrorMessage(error);
            console.log(error);
        }
    }


    // determine the next player
    useEffect(() => {
        const determineNextPlayer = async (battleName) => {
            console.log("hej-----1");

            const battleStruct = await contract.getBattle(battleName);
            const moves = battleStruct[4]; // Array of moves
            const players = battleStruct[3];

            // Determine which player comes next
            let whoseTurn = "Next player: either";

            console.log("hej-----2");

            if (moves[0] === 0n && moves[1] === 0n) {
                whoseTurn = "Next player: either"
            } else if (moves[0] === 0n) {
                if (players[0].toLowerCase() === walletAddress) {
                    whoseTurn = "Your turn!";
                } else {
                    whoseTurn = "Their turn!";
                }
            } else if (moves[1] === 0n) {
                if (players[1].toLowerCase() === walletAddress) {
                    whoseTurn = "Your turn!";
                } else {
                    whoseTurn = "Their turn!";
                }
            }

            setNextPlayer(whoseTurn);
            console.log("Next player to move:", whoseTurn);    // @note logging not state which might be stale at this point, but a local var
        };

        if (contract && battleName) determineNextPlayer(battleName);

    }, [battleName, walletAddress, updateGameData]);




    return (
        <div className={`flex flex-row items-center justify-center h-screen ${battleGround}`}>
            <div className="h-80 w-40 flex items-center justify-center bg-white bg-opacity-30 rounded-3xl">
                <div className="transform rotate-90 text-3xl text-white">
                    {`Round ${round}`}
                </div>
            </div>

            <div className={`${styles.flexBetween} ${styles.gameContainer}`}>

                {/* if showAlert status exists (truthy), we are gonna show and alert component */}
                {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

                <PlayerInfo player={player2} playerIcon={player02Icon} />

                {/* div for the top card */}
                {/* @note in ethers v6, playerAddress and playerName fields can be accessed like player1[0] and player1[0], not player1.playerAddress */}
                <div className={`${styles.flexCenter} flex-col my-10`}>
                    <Card
                        card={player2}
                        title={player2?.[1]}
                        // @note needed for the placement of explosion animation
                        cardRef={player2Ref}
                        playerTwo
                    // cardImage={player2.cardImg} // Pass the stored image     // @note my solution for card images
                    />

                    {/* div for the bottom card, the left action button, right action button */}
                    <div className='flex items-center flex-row'>
                        <ActionButton
                            imgUrl={attack}
                            handleClick={() => { makeAMove(1) }}
                            restStyles="mr-2 hover:border-yellow-400"
                        />

                        <Card
                            card={player1}
                            title={player1?.[1]}
                            cardRef={player1Ref}
                            restStyles="mt-3"
                        //cardImage={player1.cardImg} // Pass the stored image     // @note my solution for card images
                        />

                        <ActionButton
                            imgUrl={defense}
                            handleClick={() => { makeAMove(2) }}
                            restStyles="ml-6 hover:border-red-600"
                        />
                    </div>
                </div>

                <PlayerInfo player={player1} playerIcon={player01Icon} mt />

                <GameInfo />
            </div>
            <div className="h-80 w-40 flex items-center justify-center bg-white bg-opacity-30 rounded-3xl">
                <div className="transform rotate-90 text-3xl text-white whitespace-nowrap">
                    {nextPlayer}
                </div>
            </div>

        </div >

    )
}

export default Battle