import ReactTooltip from "react-tooltip";
import styles from "../styles";
import { UNSAFE_DataRouterStateContext } from "react-router-dom";

const healthPoints = 25;

// determines the background color of the health bar based on the player's health points.
const healthLevel = (points) =>
    (points >= 12 ? 'bg-green-500' : points >= 6 ? 'bg-orange-500' : 'bg-red-500');

// adds right margin (mr-1) to all health bars except the last one. This ensures proper spacing between the health bars.
const marginIndexing = (index) => index !== healthPoints - 1 ? 'mr-1' : 'mr-0';

// 'player' is an object with multiple key-value pairs (like a struct)
const PlayerInfo = ({ player, playerIcon, mt }) => {

    // first div: only if there is mt, we are gonna add mt-4, otherwise mb-4
    // data-for: if there is mt, it is player1
    return (
        <div className={`${styles.flexCenter} ${mt ? 'mt-4' : 'mb-4'}`}>
            {/* Icons */}
            <img
                data-for={`player-${mt ? '1' : '2'}`}
                data-tip
                src={playerIcon}
                alt="player2"
                className="w-14 h-14 object-contain rounded-full"
            />

            {/* Div for the health bars */}
            <div
                data-for={`Health-${mt ? '1' : '2'}`}
                data-tip={`Health: ${player?.health}`}
                className={styles.playerHealth}
            >

                {/* 
                1. Array(player.health): When player.health is 3, Array(3) creates an array with 3 empty slots. This array looks like [ , , ], with three "holes" or empty slots.
                2. .keys(): The .keys() method is called on this array, which returns an iterator. This iterator contains the keys (indexes) of the array, which are 0, 1, and 2 for an array with three slots.
                3. [...Array(...)] (Spread Operator): The spread operator ... is then used to spread out the values from the iterator into a new array. In this case, it converts the iterator into a plain array of indices: [0, 1, 2]. 
                4. The .map() function iterates over this array [0, 1, 2]. For each it m (0, 1, and 2), it renders a div element representing a health bar. Each health bar div has a unique key
                */}

                {[...Array(player.health).keys()].map((item, index) => (
                    < div
                        key={`player-item-${item}`}
                        className={`${styles.playerHealthBar} ${healthLevel(player.health)} ${marginIndexing(index)}`}
                    />
                ))}
            </div>

            {/* Div for the mana */}
            {/* @note data-for attribute is used so that later on the react tooltip can use if to display more info*/}
            <div
                data-for={`Mana-${mt ? '1' : '2'}`}
                data-tip="Mana"
                className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana}`}
            >
                {player.mana || 0}
            </div>

            {/* tooltip for icons*/}
            <ReactTooltip
                id={`player-${mt ? '1' : '2'}`}
                effect="solid"
                backgroundColor="#7f46f0"
            >

                {/* @note in ethers v6, playerAddress and playerName fields can be accessed like player1[0] and player1[0], not player1.playerAddress */}
                <p className={styles.playerInfo}>
                    <span className={styles.playerInfoSpan}>Name: </span>
                    {player?.[1] || "Unknown"}
                </p>
                <p className={styles.playerInfo}>
                    <span className={styles.playerInfoSpan}>Address: </span>
                    {player?.[0]?.slice(1, 10) || "N/A"}
                </p>
            </ReactTooltip>

            {/* tooltip for health*/}
            <ReactTooltip
                id={`Health-${mt ? '1' : '2'}`}
                effect="solid"
                backgroundColor="#7f46f0"
            />

            {/* tooltip for mana*/}
            <ReactTooltip
                id={`Mana-${mt ? '1' : '2'}`}
                effect="solid"
                backgroundColor="#7f46f0"
            />


        </div >

    )
}

export default PlayerInfo