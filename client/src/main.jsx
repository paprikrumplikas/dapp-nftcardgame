import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// to be import Home and Battle on a single line, we first need to create an index.jsx where both are imported separatley and then exported together
import { Home, CreateBattle } from "./page";
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-battle" element={<CreateBattle />} />
    </Routes>
  </BrowserRouter>,
);