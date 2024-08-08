   START PROJECT
   
   1. web3
      1. install older version of ethers
      npm install ethers@5.7.2 @nomiclabs/hardhat-ethers --save-dev --legacy-peer-deps
      2. install older version of openzeppelin
      npm install @openzeppelin/contracts@4.7.3
      3. install other dependencies
      4. install Core Wallet, a Chrome extension for Avax, change to testnet, fund it, export private key

   2. client
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


   TRICKS

   1. install extension: ES7+ React... @note type "rafce" in any file to create a React functional component (function) structure with default export statement
   2. Catch syntax issues
      1. Install ESLint extension 
      2. npm install eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh --save-dev
      3. lsit issues: npx eslint . --ext .js,.jsx




----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------


   LEARNINGS
      1. hooks: 
         1. React Hooks need to be called at the top level of your functional components. This ensures they are called in the same order on every render, which is crucial for React to correctly maintain the state and lifecycle of hooks.
         2. Hooks like useNavigate are designed to return values or functions that can be used inside components rather than performing an action directly when called.
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------





    BUILD

    1. Higher order components for resuability
       1. Put this in PageHOC.jsx. @note diff between higher order components and regular ones is that HOC func components accept other lower level func components as a first input param. Esentially, they act as a wrapper for the lower level component.