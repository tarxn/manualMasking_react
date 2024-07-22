// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ManualDraw from './components/ManualDraw';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ManualDraw />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
