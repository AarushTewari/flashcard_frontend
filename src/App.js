import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Flashcards from './components/Flashcards';
import AddFlashcard from './components/AddFlashcard';
import UpdateFlashcard from './components/UpdateFlashcard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Flashcards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-flashcard" element={<AddFlashcard />} />
        <Route path="/update-flashcard/:id" element={<UpdateFlashcard />} />
      </Routes>
    </Router>
  );
}

export default App;
