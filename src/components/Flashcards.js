import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Flashcards.css'; // Import the CSS file

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const username = localStorage.getItem('username') || null; // Get username from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories/list');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('http://localhost:5000/flashcards/list', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { category: selectedCategory },
        });
        setFlashcards(response.data.data);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Failed to fetch flashcards', error);
      }
    };

    fetchFlashcards();
  }, [selectedCategory]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  
  const handleUpdateFlashcard = () => {
    const currentFlashcard = flashcards[currentIndex];
    navigate(`/update-flashcard/${currentFlashcard.id}`);
  };

  if (flashcards.length === 0) return <div className='flashcards-container'>
  <h2>No Flashcards yet, try adding one!</h2>
  <button onClick={() => navigate('/add-flashcard')} className="add-flashcard-button">Add Flashcard</button>
  </div>;

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="flashcards-container">
      <h2>{username ? `${username}'s Flashcards` : 'Flashcards'}</h2> {/* Personalized heading */}
      
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Search by category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      {flashcards.length > 0 && currentFlashcard ? (
        <div className="flashcard-wrapper" onClick={handleFlip}>
          <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
            <div className="flashcard-face">
              {currentFlashcard.question}
            </div>
            <div className="flashcard-face flashcard-back">
              {currentFlashcard.answer}
            </div>
          </div>
        </div>
      ) : (
        <div>No flashcards available</div>
      )}

      <button onClick={handlePrevious} disabled={flashcards.length === 0}>Previous</button>
      <button onClick={handleNext} disabled={flashcards.length === 0}>Next</button>
      <button onClick={() => navigate('/add-flashcard')} className="add-flashcard-button">Add Flashcard</button>
      <button onClick={handleUpdateFlashcard}>Update Flashcard</button>
    </div>
  );
}

export default Flashcards;
