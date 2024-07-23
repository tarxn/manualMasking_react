// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ManualDraw from './components/ManualDraw';
import ManualDrawReact from './components/ManualDrawReact';
import ManualDrawTest from './components/ManualDrawTest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ManualDraw />} />
        <Route path="/react" element={<ManualDrawReact />} />
        <Route path="/test" element={<ManualDrawTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
