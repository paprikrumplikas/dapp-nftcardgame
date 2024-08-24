import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

// higher order component (can wrap another component)
import { PageHOC, CustomInput, CustomButton } from "../components";
//import { ContractFactory } from 'ethers';


const Home = () => {
    const { contract, walletAddress, setShowAlert, provider } = useGlobalContext();
    const [playerName, setPlayerName] = useState("");
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            console.log("contract: ", contract);
            console.log("wallet: ", walletAddress);
            console.log("player: ", playerName);
            console.log("provider:", provider)

            // 2 lines below added by me for troubleshooting
            //const network = await provider.getNetwork();
            //console.log('Connected to network:', network);


            const playerExists = await contract.isPlayer(walletAddress);

            // if player doesnt exist, register player and show alert
            if (!playerExists) {
                // 2 inputs are the same for now
                await contract.registerPlayer(playerName, playerName);

                setShowAlert({
                    status: true,
                    type: 'info',
                    message: `${playerName} is being summoned!`
                })
            }
        } catch (error) {
            setShowAlert({
                status: true,
                type: 'failure',
                // does not work correctly. Will come back to this later. @note
                // message: error.message
                message: "Something went wrong!"
            })
            //alert(error); // browser's default error message display
        }
    }

    // @note use this useEffect when contract changes -> adding 'contract' to the dependeny array
    useEffect(() => {
        const checkForPlayerToken = async () => {
            // check if player exists
            const playerExists = await contract.isPlayer(walletAddress);
            // check if playerToken exists
            const playerTokenExists = await contract.isPlayerToken(walletAddress);

            // if both exist, naviget to next page
            if (playerExists && playerTokenExists) {
                navigate('/create-battle')
            }
        }

        // if contract exists, call the function defined above
        if (contract) checkForPlayerToken();
    }, [contract])

    return (
        //  div can be completely empty, but we can also add additional elements
        <div className='flex flex-col'>
            {/* render 2 custom components, passing props to them */}
            <CustomInput
                label="Name"
                placeholder="Enter your player name"
                value={playerName}
                handleValueChange={setPlayerName}
            />
            <CustomButton
                title="Register"
                handleClick={handleClick}
                restStyles="mt-6"
            />


        </div>
    );
};

// PageOHC higher order component wrap Home component for reusability
// @note how thie HOC can be modified: by passing props, here:
// 1. a component (that can have custom contect/styling)
// 2. an empty react fragment with text as title
export default PageHOC(
    Home,
    <>Welcome to Avax Gods, <br /> a Web3 NFT Card Game</>,
    <>Connect your wallet to start playing <br /> the ultimate Web3 battle cardgame</>
);
