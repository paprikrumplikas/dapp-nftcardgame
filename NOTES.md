   issues to fix:

   1. tooltip on icons
   2. connection to core wallet
   3. auto-navigate to battle page
   
   
   
   
   
   
   START PROJECT
   
   4. web3
      1. install older version of ethers
      npm install ethers@5.7.2 @nomiclabs/hardhat-ethers --save-dev --legacy-peer-deps
      2. install older version of openzeppelin
      npm install @openzeppelin/contracts@4.7.3
      3. install other dependencies
      4. install Core Wallet, a Chrome extension for Avax, change to testnet, fund it, export private key

   5. client
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
          3. acquire OnboardModal.jsx @note this a basic, often used web3 component that check that everything is setup properly
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


   ALERTS:

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


   ALERTS:

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

----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------





    BUILD

    1. Higher order components for resuability
       1. Put this in PageHOC.jsx. @note diff between higher order components and regular ones is that HOC func components accept other lower level func components as a first input param. Esentially, they act as a wrapper for the lower level component.