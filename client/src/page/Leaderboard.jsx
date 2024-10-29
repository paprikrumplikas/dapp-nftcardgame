// @custom

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

// higher order component (can wrap another component)
import { PageHOC, CustomButton } from "../components";
import { shortenAddress } from '../utils/shortenAddress';


const Leaderboard = () => {

    const { contract } = useGlobalContext();
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();

    const handleClick = () => { navigate("/") };

    useEffect(() => {
        console.log("using effect");
        const displayLeaderboard = async () => {
            const fetchedRegisteredPlayers = (await contract.getAllPlayers()).slice(1);   // slice the first element which is always 0
            const registeredPlayerNames = fetchedRegisteredPlayers.map((player => player[1]));

            const fetchedBattles = (await contract.getAllBattles()).slice(1); // slice the first element which is always 0
            const finishedBattles = fetchedBattles.filter((battle) => battle.battleStatus === BigInt(2));

            const leaderboard = {};
            let winnerAddress;

            // @syntax this for--of allows the await keyword inside it, forEach does not
            for (const battle of finishedBattles) {
                // get addresses
                const playerAddresses = battle[3]; // array of 2 player addresses in each battle
                winnerAddress = battle[5].toLowerCase();

                // get names
                const winner = (await contract.getPlayer(winnerAddress))[1];
                const loserAddress = playerAddresses.find(playerAddresses => playerAddresses.toLowerCase() !== winnerAddress).toLowerCase();
                const loser = (await contract.getPlayer(loserAddress))[1];

                // Initialize leaderboard entry for winner if not present
                if (!leaderboard[winner]) {
                    leaderboard[winner] = { wins: 0, losses: 0, winnerAddress: shortenAddress(winnerAddress) };
                }

                // Initialize leaderboard entry for loser if not present
                // for cases when the player appears as a loser before being a winner.
                if (!leaderboard[loser]) {
                    leaderboard[loser] = { wins: 0, losses: 0, winnerAddress: shortenAddress(loserAddress) };
                }

                // Update leaderboard for winner
                leaderboard[winner].wins += 1;
                leaderboard[loser].losses += 1;
            };

            // Convert leaderboard to an array of [player, stats] pairs and sort it by wins in descending order
            const sortedLeaderboard = Object.entries(leaderboard).map(([name, stats]) => {
                const totalBattles = stats.wins + stats.losses;
                const winPercentage = totalBattles > 0 ? (stats.wins / totalBattles) * 100 : 0;
                return {
                    playerName: name,
                    playerAddress: stats.winnerAddress,
                    NumberOfWonBattles: stats.wins,
                    NumberOfLostBattles: stats.losses,
                    PercentageOfBattlesWon: winPercentage.toFixed(2) + '%'
                };
            }).sort((a, b) => b.NumberOfWonBattles - a.NumberOfWonBattles);

            setLeaderboard(sortedLeaderboard); // Update the state with the sorted leaderboard
        };

        if (contract) {
            displayLeaderboard();
        }

    }, [contract]);




    return (
        <div>
            <div className="p-15">
                <table className="w-full border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="text-center p-3 text-white align-middle rounded-lg" style={{ backgroundColor: '#4B0082' }}>Player Name</th>
                            <th className="text-center p-3 text-white align-middle rounded-lg" style={{ backgroundColor: '#4B0082' }}>Player Address</th>
                            <th className="text-center p-3 text-white align-middle rounded-lg" style={{ backgroundColor: '#4B0082' }}>No. of Won Battles</th>
                            <th className="text-center p-3 text-white align-middle rounded-lg" style={{ backgroundColor: '#4B0082' }}>No. of Lost Battles</th>
                            <th className="text-center p-3 text-white align-middle rounded-lg" style={{ backgroundColor: '#4B0082' }}>% of Battles Won</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((player, index) => (
                            <tr key={index}>
                                <td className="text-center p-3 text-white align-middle rounded-lg bg-purple-700">{player.playerName}</td>
                                <td className="text-center p-3 text-white align-middle rounded-lg bg-purple-700">{player.playerAddress}</td>
                                <td className="text-center p-3 text-white align-middle rounded-lg bg-purple-700">{player.NumberOfWonBattles}</td>
                                <td className="text-center p-3 text-white align-middle rounded-lg bg-purple-700">{player.NumberOfLostBattles}</td>
                                <td className="text-center p-3 text-white align-middle rounded-lg bg-purple-700">{player.PercentageOfBattlesWon}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CustomButton
                title='Go back'
                handleClick={handleClick}
                restStyles="mt-8" />
        </div>
    );

}

export default PageHOC(
    Leaderboard,
    <>Leaderboard </>,
);