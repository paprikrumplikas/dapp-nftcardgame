

   START PROJECT
   
   1. web3
      1. install older version of ethers
      npm install ethers@5.7.2 @nomiclabs/hardhat-ethers --save-dev --legacy-peer-deps
      2. install older version of openzeppelin
      npm install @openzeppelin/contracts@4.7.3
      3. install other dependencies
      4. install Core Wallet, a Chrome extension for Avax, change to testnet, fund it, export private key

   4. client
      1. basic
         1. cd ./client
         2. npm init vite@latest
         3. npm install
         4. npm run dev
         5. npm install -D tailwindcss postcss autoprefixer
         6. npx tailwindcss init -p
         7. follow https://tailwindcss.com/docs/installation
         8. ensure tailwind.config.jss looks like this

                /** @type {import('tailwindcss').Config} */
                module.exports = {
                content: ["./src/**/*.{html,js,jsx}"],
                theme: {
                    extend: {},
                },
                plugins: [],
                }
       2. project specific
          1. update tailwind.config.css with provided stuff
          2. aquire assets folder with provided stuff
             To download them from github, use https://download-directory.github.io/
          3. acquire OnboardModal.jsx @note this a basic, often used web3 component that check that everything is setup properly. Put a self-closing OnbaordMocal tag in main.jsx.
             1. that core wallet is installed
             2. that we are connected the wallet
             3. that we are connected to the right network
             4. that we have enough AVAX tokens
          4. update package.json with provided stuff
          5. get the provided utils: animation.js and onboard.js
          6. update index.css with the provided info
          7. add sytles/index.js with the provided info
          8. update main.jsx with the provided stuff
          9. add page/Main.jsx as provided


----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------


   ALERTS - How they work

   1. Alert.jsx: This is indeed where the alert component is defined. The component takes type and message as props and renders the alert accordingly.
   2. index.jsc (GlobalContextProvider): This is where the state for showAlert is defined and managed. The GlobalContextProvider manages the state of the alert and provides setShowAlert to other components so they can trigger alerts. It also contains logic to automatically hide the alert after 10 seconds.
   3. pageHOC.jsx: This file uses the useGlobalContext hook to access the showAlert state from the global context. It checks if an alert should be displayed (showAlert?.status) and, if so, renders the Alert component. This effectively means that any page wrapped with this HOC will display an alert if the showAlert state is set.
   4. Home.jsx: This is where the alert status is set based on certain conditions, such as when there is an error or when a player is successfully registered. The setShowAlert function from the global context is used to trigger alerts with different types (info, failure, etc.) and messages.

   Summary of Connections:
   Alert Definition: Alert.jsx defines how an alert looks.
   Alert State Management: GlobalContextProvider in index.jsc manages the alert's state (showAlert) and provides a function (setShowAlert) to update it.
   Alert Display Logic: PageHOC.jsx uses the state from the context to determine whether to display the Alert component.
   Alert Triggering: Home.jsx triggers the alert by updating the showAlert state when specific actions occur (e.g., errors or successful player registration).



----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------


   TRICKS

   1. install extension: ES7+ React... @note type "rafce" in any file to create a React functional component (function) structure with default export statement
   2. Catch syntax issues
      1. Install ESLint extension 
      2. npm install eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh --save-dev
      3. lsit issues: npx eslint . --ext .js,.jsx
   3. // cool package that adds tilting animation to elements wrapped by the <Tilt> tag
      import Tilt from "react-parallax-tilt";


----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------

   CONNECTING TO THE BLOCKCHAIN

   1. Contect folder has everything we need to connect our FO app to the blockchain



----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------


   LEARNINGS
      1. hooks: 
         1. React Hooks need to be called at the top level of your functional components. This ensures they are called in the same order on every render, which is crucial for React to correctly maintain the state and lifecycle of hooks.
         2. Hooks like useNavigate are designed to return values or functions that can be used inside components rather than performing an action directly when called.
         3. useState: React components automatically re-render when their state changes. By using useState, React knows that when setWalletAddress is called, it should re-render the component to reflect the updated state. This reactivity is crucial for building interactive user interfaces.
         If you used a regular variable like let walletAddress = "";, changing its value wouldn’t trigger a re-render, so the UI wouldn’t update to reflect the new value.
         4.  useParams()  is a hook provided by React Router that allows you to access the parameters of the current route.
         //When a route is defined with parameters(e.g., /battle/: battleName), useParams can be used to extract these parameters inside the component that corresponds to that route.
         const { battleName } = useParams();

      2. spread operator
           // @note ...player01 is the spread operator: copies all the properties of the player01 object into a new object
           // copies all the properties of the player01 object into a new object
          setPlayer1({ ...player01, att: p1Att, def: p1Def, health: p1H, mana: p1M });


      3. ethers v6 vs v5
      When interacting with a smart contract that returns a struct, ethers.js v5 typically returns the data as an object where you can access fields by their names. For example, player01.playerName would be valid if the smart contract defines a struct with a field called playerName.

      Ethers.js v6: In v6, ethers.js introduces a slightly different behavior, where the data returned from a contract call can be an array, and you access fields using indexed positions (e.g., player01[1]). This means you access the data like you would with a tuple in Solidity, where player01[0], player01[1], etc., represent different fields.

      4. Setting things to local storage
         IN BATTLEGROUND.JSX:
         //@note also save it to local storage so if a user reloads the page we keep his chosen battleground
        // whether this has been set to local stroage is checked in the context, index.jsx
        localStorage.setItem('battleground', ground.id);

         IN INDEX:JSX, i.e. CONTEXT
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


         5. OnboardModal.jsx @note this a basic, often used web3 component that check that everything is setup properly - connected to correct network, has enough balance (0.1 AVAX), etc.. To make it work:
            1. export it in index.js
            2. import it in main.jsx
            3. Put a self-closing OnbaordMocal tag in main.jsx, above the router tags
            4. in the context (index.jsx), add a useEffect the resets web3 onboarding modal params

         6. Local storage vs state @note
            - State Persistence: The state does not persist beyond the component's lifecycle. When the component unmounts or the page reloads, the state is reset unless it's stored somewhere persistent (like local storage). 
            - Local storage: Data stored in local storage persists across page reloads and even after the browser is closed and reopened.

         7. Passing data through context vs prop drilling
            - Prop drilling refers to passing data through multiple levels of a component tree by explicitly passing props from parent to child components, often through many intermediary components.
            - React Context provides a way to share values (such as state) between components without having to explicitly pass props through every level of the component tree.
  
         8. useRefs and positioning of the animation
            https://chatgpt.com/c/bb2c2bdf-ed71-4d15-bd6e-799490c79402


         9. alerts: see above
   
         10. Event listeners - why use websocket provider instead of https provider  
            From troubleshooitng: Event Listeners Not Triggered. https://chatgpt.com/c/7924e0f7-915e-434b-ac36-85bf4c7b451d 
            Original Problem:

            The event listener was set up with the following code, but the event was never triggered:

            javascript
            Copy code
            contract.on(eventFilter, (Logs) => {
               console.log(`Event listener triggered for: ${eventFilter.fragment.name}`);
               const parsedLog = contract.interface.parseLog(Logs);
               cb(parsedLog);
            });

            Cause:
            The issue was due to using an HTTPS RPC provider instead of a WebSocket provider. Event listeners for real-time events do not work as expected with an HTTPS provider.
            Why HTTPS Provider Failed:

            Polling vs. Subscriptions: @note
            HTTPS Provider: Operates on a request-response model. It does not maintain a persistent connection and cannot push events to the client. The client would need to continuously poll the blockchain for new events, which is inefficient and prone to missing events that occur between polling intervals.
            WebSocket Provider: Maintains an open, persistent connection. This allows the Ethereum node to push events to the client as soon as they are emitted, ensuring real-time updates. This makes WebSocket providers ideal for applications that need immediate responses to on-chain events, such as games or financial applications.

            HTTPS operates on a request-response basis, meaning the client has to ask the server if there are any new events. This polling approach is not real-time and can lead to missed events or delays in processing events. @note

            Resolution:
            Switching to a WebSocket provider allowed the event listener to function correctly because the WebSocket provider could actively listen for and immediately trigger the callback when an event was emitted by the smart contract.

        11. Parsing Logs and Execution Flow
            From troubleshooting
            Original Problem:

            Even after switching to a WebSocket provider, the following line wasn’t executing as expected:

            javascript
            Copy code
            const parsedLog = contract.interface.parseLog(Logs);
            This led to the callback function not being triggered, and no further logs were printed.

            Cause:

            The parseLog function was failing because the Logs object being passed into it did not have the correct structure. Specifically, parseLog expected the topics and data properties at the top level, but these were nested inside the log property of the Logs object.
            Why the Parsing Failed:

            Structure Mismatch: The Logs object contained the necessary data, but it was nested inside a sub-object (log). The parseLog function needs direct access to the topics and data properties to correctly parse the event log.
            Error Handling: When parseLog fails due to incorrect input, it throws an error. If this error is not caught, it prevents the subsequent code from executing, which is why the callback wasn’t triggered and the "Parsed log" message wasn’t printed. @note
            Resolution:

            The code was adjusted to correctly access the necessary properties within the Logs object:

            javascript
            Copy code
            const logDetails = Logs.log; // Access the correct sub-objectconst parsedLog = contract.interface.parseLog(logDetails);
            Error Handling: We wrapped the parsing logic in a try-catch block to catch and handle any errors that occur during the parsing process. This ensures that if parseLog fails, the error is logged, but the program can continue executing or handle the failure gracefully.


            12. Async vs snyc functions

            So... code in a single async function is executed syncronously meanding that each line is executed one after each other. But if there are other functions, those can start their execution while the async func waits for the promise to be resolved
            ChatGPT said:
            ChatGPT
            Yes, that's correct! Let's summarize this:

            Execution Inside an async Function:
            Within an async function, the code runs sequentially, meaning each line is executed one after the other. If a line includes await, the function will pause at that point until the promise is resolved before moving on to the next line.
            Sequential Execution: Inside the async function, once await resolves, the next lines are executed in order. This makes the code within that async function behave in a synchronous-like manner.
            Execution Outside the async Function:
            Non-blocking Behavior: While the async function is waiting (because of an await), other functions or code outside of this async function can continue to execute. This is what makes async functions non-blocking.
            Concurrency: This means that while one async function is waiting for a promise to resolve (e.g., a network request or a timeout), other code (including other async functions) can execute in parallel.


            13. promises in assync functions
            In JavaScript, when you perform operations that involve things like network requests, database queries, or file reading—essentially anything that might take some time and isn’t instantaneous—the functions that perform these operations return a promise. This is because JavaScript is designed to be non-blocking, meaning it doesn't want to stop everything else just to wait for something that might take a while.


            14. race conditions, stale data, using different providers for listening and broadcasting for event emission @note @crucial
            If the event seems to be emitted before the transaction is fully mined, that could be bacaue
            If you're interacting with different nodes (e.g., one node for broadcasting transactions and another for listening to events), there might be a synchronization issue where one node believes an event has occurred, but the transaction hasn't been fully confirmed on the network
            https://chatgpt.com/c/dcd46df9-485b-458a-b70d-220169005d92
            meaning that if I initate the tx with metamask through a https rpc rpovider, and then my listeners are using a websocket rpc provider?
            ChatGPT said:
            ChatGPT
            Yes, that's exactly the kind of situation that can lead to the issue you're describing. Here's a more detailed explanation:
            Using Different RPC Providers (HTTPS vs. WebSocket):
               Transaction Broadcast via Metamask (HTTPS RPC Provider):
                  When you initiate a transaction through Metamask, it typically broadcasts the transaction using an HTTPS RPC provider. This transaction is then propagated to the Ethereum network, but it’s initially placed in the mempool (a pool of unconfirmed transactions) until it gets included in a block by a miner.
               Event Listening via WebSocket RPC Provider:
                  Your event listeners, which are using a WebSocket RPC provider, are often connected to a different Ethereum node or even the same node but over a different communication channel (WebSocket instead of HTTPS).
                  WebSocket connections are generally faster for real-time event listening because they maintain an open connection, allowing for immediate push notifications from the node when events occur.


         15. Taliwind margins
         The difference in margin between mt-18 and mt-20 in Tailwind CSS can be explained by the spacing scale that Tailwind uses. Tailwind's spacing utilities (mt, mb, ml, mr, p, m, etc.) follow a specific scale, which means that not all numeric values between 1 and 20 are included.

         Tailwind CSS Spacing Scale
         Tailwind CSS uses a pre-defined spacing scale that typically includes values like mt-1, mt-2, mt-4, mt-8, mt-16, mt-20, etc. However, it doesn't define every number in between. For instance, mt-18 is not part of the default spacing scale, so it may fall back to a smaller value, or it may not be applied as expected.




----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------





    BUILD

    1. Higher order components for resuability
       1. Put this in PageHOC.jsx. @note diff between higher order components and regular ones is that HOC func components accept other lower level func components as a first input param. Esentially, they act as a wrapper for the lower level component.