import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// to be import Home and Battle on a single line, we first need to create an index.jsx where both are imported separatley and then exported together
import { Home, CreateBattle, JoinBattle, Battle, Battleground } from "./page";
import { GlobalContextProvider } from './context';
import './index.css';
import { OnboardModal } from "./components";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* custom context provider that supplies global state or functions to the entire app */}
    <GlobalContextProvider>
      {/* custom  */}
      <OnboardModal />
      {/* It looks through all its child <Route> elements and renders the first one that matches the current URL. */}
      <Routes>
        {/* @note Each <Route> defines a mapping between a URL path and a React component.  */}
        {/* This means that when the user navigates to the root URL (/), the Home component will be rendered  */}
        <Route path="/" element={<Home />} />
        <Route path="/create-battle" element={<CreateBattle />} />
        <Route path="/join-battle" element={<JoinBattle />} />
        <Route path="/battle/:battleName" element={<Battle />} />
        <Route path="/battleground" element={<Battleground />} />
      </Routes>
    </GlobalContextProvider>
  </BrowserRouter >,
);