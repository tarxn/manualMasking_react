// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ManualDraw from './components/ManualDraw';
import ManualDrawReact from './components/ManualDrawReact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ManualDraw />} />
        <Route path="/react" element={<ManualDrawReact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
